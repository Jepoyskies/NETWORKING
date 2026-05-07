// ==========================================
// 1. DICTIONARY & UI INJECTION
// ==========================================
const termDictionary = {
    "ipv6": "Internet Protocol v6. Uses 128-bit hexadecimal addresses.",
    "slaac": "Stateless Address Autoconfiguration. Clients create their own IP using the router prefix.",
    "dhcpv6": "Dynamic Host Configuration Protocol for IPv6.",
    "stateless dhcpv6": "Clients use SLAAC for IP, but ask DHCPv6 for DNS servers (O-Flag).",
    "stateful dhcpv6": "Clients get their IP and DNS strictly from the DHCPv6 server (M-Flag).",
    "ra": "Router Advertisement. ICMPv6 message sent by routers carrying network prefixes and flags.",
    "o-flag": "Other Configuration Flag (ipv6 nd other-config-flag). Triggers Stateless DHCPv6.",
    "m-flag": "Managed Address Flag (ipv6 nd managed-config-flag). Triggers Stateful DHCPv6.",
    "dhcp relay": "Forwards DHCP requests across subnets to a remote server.",
    "unicast-routing": "Command required to enable IPv6 routing and RA messages.",
    "link-local": "IPv6 address starting with FE80:: used for local subnet communication.",
    "dns": "Domain Name System. Translates URLs to IP addresses.",
    "prefix": "The network portion of an IPv6 address (e.g., /64)."
};

const termsArray = Object.keys(termDictionary).sort((a, b) => b.length - a.length);

function autoLinkTextNode(textNode) {
    let text = textNode.nodeValue;
    for (let term of termsArray) {
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-zA-Z0-9_-])(${escapedTerm})([^a-zA-Z0-9_-]|$)`, 'i');
        const match = text.match(regex);
        if (match) {
            const beforeChar = match[1]; 
            const matchText = match[2];  
            const matchIndex = match.index + beforeChar.length;
            const beforeText = text.substring(0, matchIndex);
            const afterText = text.substring(matchIndex + matchText.length);
            const parent = textNode.parentNode;
            
            if (beforeText) {
                const beforeNode = document.createTextNode(beforeText);
                parent.insertBefore(beforeNode, textNode);
                autoLinkTextNode(beforeNode); 
            }
            
            const span = document.createElement('span');
            span.className = 'term';
            span.setAttribute('data-term', term);
            span.textContent = matchText;
            parent.insertBefore(span, textNode);
            
            if (afterText) {
                const afterNode = document.createTextNode(afterText);
                parent.insertBefore(afterNode, textNode);
                autoLinkTextNode(afterNode); 
            }
            parent.removeChild(textNode);
            return;
        }
    }
}

function highlightElement(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
    const textNodes =[];
    let node;
    while (node = walker.nextNode()) {
        if (node.parentNode.tagName === 'SPAN' && node.parentNode.classList.contains('term')) continue;
        if (node.parentNode.tagName === 'INPUT' || node.parentNode.classList.contains('terminal-output')) continue;
        textNodes.push(node);
    }
    textNodes.forEach(node => autoLinkTextNode(node));
    attachDictionaryListeners();
}

const overlay = document.createElement('div'); overlay.id = 'dict-overlay';
const panel = document.createElement('div'); panel.id = 'dict-panel';
panel.innerHTML = `<button id="dict-close">&times;</button><h3 id="dict-title">Term</h3><div class="dict-content-box" id="dict-desc"></div>`;
document.body.appendChild(overlay); document.body.appendChild(panel);

const closeSidebar = () => { panel.classList.remove('active'); overlay.classList.remove('active'); };
document.getElementById('dict-close').addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);

function attachDictionaryListeners() {
    document.querySelectorAll('.term').forEach(term => {
        const newTerm = term.cloneNode(true);
        term.parentNode.replaceChild(newTerm, term);
        newTerm.addEventListener('click', (e) => {
            const termKey = e.target.getAttribute('data-term').toLowerCase();
            const dictEntry = termDictionary[termKey];
            document.getElementById('dict-title').innerText = e.target.innerText.toUpperCase();
            document.getElementById('dict-desc').innerHTML = dictEntry ? `<strong>${e.target.innerText.toUpperCase()}</strong>: ${dictEntry}` : `<strong>${e.target.innerText.toUpperCase()}</strong>: Description not found.`;
            panel.classList.add('active'); overlay.classList.add('active');
        });
    });
}

// ==========================================
// 2. VIRTUAL IPv6 DEVICE ENGINE
// ==========================================
const createDevice = (name) => ({
    name: name, hostname: name, mode: '>',
    ipv6UnicastRouting: false,
    ipv6Pools: {}, // Store DHCPv6 pools
    interfaces: {
        'g0/0/0': { ip: null, linkLocal: null, ndOther: false, ndManaged: false, dhcpServer: null, relayDest: null, relayPort: null, shutdown: true },
        'g0/0/1': { ip: null, linkLocal: null, ndOther: false, ndManaged: false, dhcpServer: null, relayDest: null, relayPort: null, shutdown: true }
    },
    currentContext:[]
});

const network = {
    R1: createDevice('R1'),
    R2: createDevice('R2')
};

let currentDevice = 'R1';
const outputDiv = document.getElementById('output');
const inputField = document.getElementById('cli-input');
const promptSpan = document.getElementById('prompt');
const diagOutput = document.getElementById('diagnostic-output');

window.switchDevice = function(devName, btn) {
    document.querySelectorAll('.test-btn').forEach(b => {
        if(b.innerText.includes('R1') || b.innerText.includes('R2')){
            b.style.background = '#334155';
        }
    });
    btn.style.background = '#0ea5e9';
    currentDevice = devName;
    let dev = network[currentDevice];
    outputDiv.innerHTML = `<br>--- Console connection to ${dev.name} established ---<br>`;
    if(dev.mode === 'LOGGED_OUT') { outputDiv.innerHTML += `Press RETURN to get started.`; dev.mode = '>'; }
    updatePrompt();
    inputField.focus();
};

function updatePrompt() {
    let dev = network[currentDevice];
    let p = '';
    if (dev.mode === '>') p = `${dev.hostname}>`;
    else if (dev.mode === '#') p = `${dev.hostname}#`;
    else if (dev.mode === 'config') p = `${dev.hostname}(config)#`;
    else if (dev.mode === 'config-if') p = `${dev.hostname}(config-if)#`;
    else if (dev.mode === 'config-dhcpv6') p = `${dev.hostname}(config-dhcpv6)#`;
    promptSpan.innerText = p;
}

function printLine(text) { outputDiv.innerHTML += `<br>${text}`; outputDiv.scrollTop = outputDiv.scrollHeight; }

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cmdRaw = this.value; const cmd = cmdRaw.trim().toLowerCase();
        printLine(`${promptSpan.innerText}${cmdRaw}`);
        this.value = ''; processCommand(cmd); updatePrompt(); outputDiv.scrollTop = outputDiv.scrollHeight;
    }
});

function processCommand(cmd) {
    let dev = network[currentDevice];

    if (cmd === '') return;
    if (cmd === 'enable' || cmd === 'en') { dev.mode = '#'; return; }
    if (cmd === 'disable') { dev.mode = '>'; return; }
    if (cmd === 'configure terminal' || cmd === 'conf t') { if (dev.mode === '#') dev.mode = 'config'; else printLine("% Invalid input"); return; }
    if (cmd === 'end') { if (dev.mode.startsWith('config')) dev.mode = '#'; return; }
    if (cmd === 'exit') {
        if (dev.mode === 'config') dev.mode = '#';
        else if (dev.mode.startsWith('config-')) dev.mode = 'config';
        return;
    }

    if (dev.mode === 'config') {
        if (cmd === 'ipv6 unicast-routing') { dev.ipv6UnicastRouting = true; return; }
        if (cmd.startsWith('ipv6 dhcp pool ')) { 
            let poolName = cmd.split('pool ')[1].trim(); // Extract exact case used by user
            dev.currentContext = [poolName];
            if (!dev.ipv6Pools[poolName]) dev.ipv6Pools[poolName] = { dns: null, domain: null, prefix: null };
            dev.mode = 'config-dhcpv6'; return; 
        }
        if (cmd.startsWith('int ') || cmd.startsWith('interface ')) {
            let arg = cmd.replace('interface ', '').replace('int ', '').trim();
            let intName = arg.replace('gigabitethernet', 'g');
            dev.currentContext = [intName];
            dev.mode = 'config-if'; return;
        }
    }

    if (dev.mode === 'config-dhcpv6') {
        let pool = dev.currentContext[0];
        if (cmd.startsWith('dns-server ')) { dev.ipv6Pools[pool].dns = cmd.split('server ')[1].trim(); return; }
        if (cmd.startsWith('domain-name ')) { dev.ipv6Pools[pool].domain = cmd.split('name ')[1].trim(); return; }
        if (cmd.startsWith('address prefix ')) { dev.ipv6Pools[pool].prefix = cmd.split('prefix ')[1].trim(); return; }
    }

    if (dev.mode === 'config-if') {
        let port = dev.currentContext[0];
        if (cmd === 'shutdown' || cmd === 'shut') { dev.interfaces[port].shutdown = true; return; }
        if (cmd === 'no shutdown' || cmd === 'no shut') { dev.interfaces[port].shutdown = false; return; }
        if (cmd === 'ipv6 nd other-config-flag') { dev.interfaces[port].ndOther = true; return; }
        if (cmd === 'ipv6 nd managed-config-flag') { dev.interfaces[port].ndManaged = true; return; }
        if (cmd.startsWith('ipv6 dhcp server ')) { dev.interfaces[port].dhcpServer = cmd.split('server ')[1].trim(); return; }
        if (cmd.startsWith('ipv6 dhcp relay destination ')) { 
            let parts = cmd.split(' '); 
            dev.interfaces[port].relayDest = parts[4]; // 2001:db8...
            dev.interfaces[port].relayPort = parts[5]; // g0/0/0
            return; 
        }
    }
    printLine(`% Invalid input detected at '^' marker.`);
}

// ==========================================
// 3. DIAGNOSTIC TESTING ENGINE
// ==========================================
function logMsg(msg, isSuccess = false) { return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#4ade80' : '#f87171'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`; }

function runR1StatelessTest() {
    let R1 = network.R1; let pass = true; let output = `<b style="color:white; font-size:1.1rem; display:block;">Checking R1 Stateless DHCPv6</b>`;

    if (R1.ipv6UnicastRouting) output += logMsg(`IPv6 Unicast Routing enabled globally.`, true); else { output += logMsg(`IPv6 Routing is DISABLED! Use 'ipv6 unicast-routing'.`); pass = false; }
    
    let pool = R1.ipv6Pools['R1-STATELESS'] || R1.ipv6Pools['r1-stateless'];
    if (pool) {
        output += logMsg(`Pool R1-STATELESS exists.`, true);
        if (pool.dns === '2001:db8:acad::254') output += logMsg(`DNS Server configured correctly in pool.`, true); else { output += logMsg(`DNS Server missing or incorrect in pool.`); pass = false; }
        if (pool.domain?.toLowerCase() === 'stateless.com') output += logMsg(`Domain name configured correctly in pool.`, true); else { output += logMsg(`Domain name missing or incorrect in pool.`); pass = false; }
    } else { output += logMsg(`DHCPv6 Pool 'R1-STATELESS' is missing.`); pass = false; }

    let g1 = R1.interfaces['g0/0/1'] || {};
    if (g1.ndOther) output += logMsg(`O-Flag (other-config-flag) set on g0/0/1.`, true); else { output += logMsg(`O-Flag NOT SET on g0/0/1. PC will not know to ask for DNS!`); pass = false; }
    if (g1.dhcpServer?.toLowerCase() === 'r1-stateless') output += logMsg(`DHCP pool bound to interface g0/0/1.`, true); else { output += logMsg(`DHCP Server pool not applied to g0/0/1.`); pass = false; }

    output += pass ? `<br><strong style="color:#4ade80;">RESULT: STATELESS DHCPv6 CONFIGURED PERFECTLY!</strong>` : `<br><strong style="color:#f87171;">RESULT: ERRORS DETECTED. Review hints above.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
}

function runR1StatefulTest() {
    let R1 = network.R1; let pass = true; let output = `<b style="color:white; font-size:1.1rem; display:block;">Checking R1 Stateful DHCPv6</b>`;

    let pool = R1.ipv6Pools['R2-STATEFUL'] || R1.ipv6Pools['r2-stateful'];
    if (pool) {
        output += logMsg(`Pool R2-STATEFUL exists.`, true);
        if (pool.prefix === '2001:db8:acad:3:aaa::/80') output += logMsg(`Address prefix configured correctly.`, true); else { output += logMsg(`Address prefix missing or incorrect in pool.`); pass = false; }
        if (pool.dns === '2001:db8:acad::254') output += logMsg(`DNS Server configured correctly.`, true); else { output += logMsg(`DNS Server missing or incorrect in pool.`); pass = false; }
        if (pool.domain?.toLowerCase() === 'stateful.com') output += logMsg(`Domain name configured correctly.`, true); else { output += logMsg(`Domain name missing or incorrect in pool.`); pass = false; }
    } else { output += logMsg(`DHCPv6 Pool 'R2-STATEFUL' is missing.`); pass = false; }

    let g0 = R1.interfaces['g0/0/0'] || {};
    if (g0.dhcpServer?.toLowerCase() === 'r2-stateful') output += logMsg(`DHCP pool bound to interface g0/0/0.`, true); else { output += logMsg(`DHCP Server pool not applied to g0/0/0.`); pass = false; }

    output += pass ? `<br><strong style="color:#4ade80;">RESULT: STATEFUL POOL READY!</strong>` : `<br><strong style="color:#f87171;">RESULT: ERRORS DETECTED. Review hints above.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
}

function runR2RelayTest() {
    let R2 = network.R2; let pass = true; let output = `<b style="color:white; font-size:1.1rem; display:block;">Checking R2 DHCPv6 Relay</b>`;

    if (R2.ipv6UnicastRouting) output += logMsg(`IPv6 Unicast Routing enabled globally.`, true); else { output += logMsg(`IPv6 Routing is DISABLED! Use 'ipv6 unicast-routing'.`); pass = false; }

    let g1 = R2.interfaces['g0/0/1'] || {};
    if (g1.ndManaged) output += logMsg(`M-Flag (managed-config-flag) set on g0/0/1.`, true); else { output += logMsg(`M-Flag NOT SET on g0/0/1. PCs won't ask for Stateful DHCP!`); pass = false; }
    if (g1.relayDest === '2001:db8:acad:2::1') output += logMsg(`DHCP Relay destination IP correct.`, true); else { output += logMsg(`Relay destination IP incorrect or missing.`); pass = false; }
    if (g1.relayPort === 'g0/0/0') output += logMsg(`DHCP Relay egress interface correct.`, true); else { output += logMsg(`Relay egress interface incorrect or missing.`); pass = false; }

    output += pass ? `<br><strong style="color:#4ade80;">RESULT: DHCP RELAY FUNCTIONAL! PC-B WILL RECEIVE IP!</strong>` : `<br><strong style="color:#f87171;">RESULT: ERRORS DETECTED. Review hints above.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
}

document.getElementById('test-r1-stateless').addEventListener('click', runR1StatelessTest);
document.getElementById('test-r1-stateful').addEventListener('click', runR1StatefulTest);
document.getElementById('test-r2-relay').addEventListener('click', runR2RelayTest);

// Cheat Sheet Logic
document.addEventListener('DOMContentLoaded', () => {
    highlightElement(document.getElementById('objectives-box'));
    const cheatBtn = document.getElementById('cheat-btn');
    const cheatModal = document.getElementById('cheat-modal');
    const closeCheatBtn = document.getElementById('close-cheat');
    if (cheatBtn && cheatModal) {
        cheatBtn.addEventListener('click', () => cheatModal.style.display = 'flex');
        closeCheatBtn.addEventListener('click', () => cheatModal.style.display = 'none');
        cheatModal.addEventListener('click', (e) => { if (e.target === cheatModal) cheatModal.style.display = 'none'; });
    }
});

// ==========================================
// ANTI-CHEAT / ANTI-INSPECT MECHANISMS
// ==========================================

// 1. Disable Right-Click (Context Menu)
document.addEventListener('contextmenu', event => event.preventDefault());

// 2. Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, and Ctrl+U
document.onkeydown = function(e) {
    // Disable F12
    if (e.keyCode == 123) {
        return false;
    }
    // Disable Ctrl+Shift+I (Open DevTools)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // Disable Ctrl+Shift+J (Open Console)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    // Disable Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
};