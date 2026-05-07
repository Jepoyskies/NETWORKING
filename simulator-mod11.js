// ==========================================
// 1. DICTIONARY & UI INJECTION
// ==========================================
const style = document.createElement('style');
style.innerHTML = `
    .term { text-decoration: none; border-bottom: 2px dashed #38bdf8; padding-bottom: 1px; cursor: pointer; color: #38bdf8; font-weight: bold; transition: 0.2s; }
    .term:hover { color: #7dd3fc; border-bottom-color: #7dd3fc; background: rgba(56,189,248,0.1); border-radius: 3px; }
    #dict-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 998; opacity: 0; pointer-events: none; transition: 0.3s ease; }
    #dict-overlay.active { opacity: 1; pointer-events: all; }
    #dict-panel { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background: #0f172a; box-shadow: -5px 0 25px rgba(0,0,0,0.8); z-index: 999; transition: right 0.3s ease; padding: 20px; color: white; display: flex; flex-direction: column; overflow-y: auto;}
    #dict-panel.active { right: 0; }
    #dict-close { align-self: flex-end; font-size: 28px; cursor: pointer; color: #94a3b8; border: none; background: transparent; transition: 0.2s;}
    #dict-close:hover { color: #ef4444; transform: scale(1.1);}
    #dict-title { font-size: 1.8rem; color: #38bdf8; margin-bottom: 15px; border-bottom: 1px solid #334155; padding-bottom: 10px;}
    .dict-content-box { background: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; font-size: 1rem; line-height: 1.6; color: #cbd5e1; }
`;
document.head.appendChild(style);

const termDictionary = {
    "interface range": "Command used to configure multiple ports simultaneously (e.g., interface range f0/3-24).",
    "dtp": "Dynamic Trunking Protocol. Auto-negotiates trunks. Disable it using 'switchport nonegotiate'.",
    "native vlan": "Carries untagged traffic on a trunk. Change it using 'switchport trunk native vlan 999'.",
    "port security": "Limits MAC addresses on a port. Enable with 'switchport port-security'.",
    "sticky mac": "Saves dynamically learned MACs to the running config ('switchport port-security mac-address sticky').",
    "violation": "What the switch does when an unauthorized MAC is detected (shutdown, restrict, protect).",
    "dhcp snooping": "Blocks rogue DHCP servers. Enable globally with 'ip dhcp snooping'.",
    "trust": "A port facing a legitimate DHCP server must be trusted using 'ip dhcp snooping trust'.",
    "rate limit": "Limits DHCP messages to prevent starvation ('ip dhcp snooping limit rate 5').",
    "portfast": "Skips STP listening/learning states on PC ports ('spanning-tree portfast').",
    "bpdu guard": "Err-disables a port if a switch message (BPDU) is received ('spanning-tree bpduguard enable').",
    "trunk": "A point-to-point link carrying multiple VLANs ('switchport mode trunk').",
    "access port": "A port connected to an end-user device ('switchport mode access').",
    "vlan": "Virtual Local Area Network. Logically segments a physical switch.",
    "shutdown": "Administratively turns off an interface.",
    "err-disabled": "A secure error state. The port shuts down due to a security violation.",
    "ssh": "Secure Shell. Requires crypto keys, a domain name, and local username/password to function."
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
// 2. VIRTUAL IOS DEVICE ENGINE
// ==========================================
const createDevice = (name, type) => ({
    name: name, type: type, hostname: name, mode: 'LOGGED_OUT',
    awaitingPass: false,
    enableSecret: null, consolePass: null, consoleLogin: false,
    vtyPass: null, vtyLoginLocal: false, vtyTransportSsh: false,
    servicePassEnc: false, domainName: null, cryptoKey: false, users: {},
    dhcpSnooping: false, dhcpSnoopingVlans: '',
    vlans:[], interfaces: {}, subinterfaces: {}, dhcpPools: {}, defaultGateway: null,
    currentContext:[] 
});

const network = {
    Router0: createDevice('Router0', 'router'),
    Switch0: createDevice('Switch0', 'switch'),
    Switch1: createDevice('Switch1', 'switch')
};

const getDefaultInt = () => ({
    shutdown: false, mode: 'dynamic', accessVlan: 1, nativeVlan: 1, dtp: true,
    portSecurity: false, psMax: 1, psViolation: 'shutdown', psSticky: false,
    dhcpTrust: false, dhcpLimit: null, portfast: false, bpduguard: false, ip: null
});['g0/0', 'g0/1'].forEach(i => { network.Router0.interfaces[i] = getDefaultInt(); network.Router0.interfaces[i].shutdown = true; });['g0/1', 'f0/1', 'f0/2'].forEach(i => { network.Switch0.interfaces[i] = getDefaultInt(); network.Switch1.interfaces[i] = getDefaultInt(); });

let currentDevice = 'Router0';
const outputDiv = document.getElementById('output');
const inputField = document.getElementById('cli-input');
const promptSpan = document.getElementById('prompt');
const diagOutput = document.getElementById('diagnostic-output');

window.switchDevice = function(devName, btn) {
    document.querySelectorAll('.test-btn').forEach(b => {
        if(b.innerText.includes(devName) || b.innerText.includes('Switch0 (Target)') || b.innerText === 'Router0' || b.innerText === 'Switch1'){
            b.style.background = '#334155';
        }
    });
    btn.style.background = '#0ea5e9';
    currentDevice = devName;
    let dev = network[currentDevice];
    outputDiv.innerHTML = `<br>--- Console connection to ${dev.name} established ---<br>`;
    if(dev.mode !== 'LOGGED_OUT') { outputDiv.innerHTML += `Press RETURN to get started.`; dev.mode = 'LOGGED_OUT'; }
    updatePrompt();
    inputField.focus();
};

function updatePrompt() {
    let dev = network[currentDevice];
    let p = ''; inputField.type = 'text'; 
    if (dev.awaitingPass) { p = 'Password: '; inputField.type = 'password'; } 
    else if (dev.mode === 'LOGGED_OUT') { p = ''; } 
    else if (dev.mode === '>') { p = `${dev.hostname}>`; } 
    else if (dev.mode === '#') { p = `${dev.hostname}#`; } 
    else if (dev.mode === 'config') { p = `${dev.hostname}(config)#`; } 
    else if (dev.mode === 'config-if') { p = dev.currentContext.length > 1 ? `${dev.hostname}(config-if-range)#` : `${dev.hostname}(config-if)#`; } 
    else if (dev.mode === 'config-vlan') { p = `${dev.hostname}(config-vlan)#`; } 
    else if (dev.mode === 'config-line') { p = `${dev.hostname}(config-line)#`; } 
    else if (dev.mode === 'config-dhcp') { p = `${dev.hostname}(dhcp-config)#`; }
    promptSpan.innerText = p;
}

function printLine(text) { outputDiv.innerHTML += `<br>${text}`; outputDiv.scrollTop = outputDiv.scrollHeight; }

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cmdRaw = this.value; const cmd = cmdRaw.trim().toLowerCase();
        if (network[currentDevice].awaitingPass) printLine(`${promptSpan.innerText}`);
        else printLine(`${promptSpan.innerText}${cmdRaw}`);
        this.value = ''; processCommand(cmd); updatePrompt(); outputDiv.scrollTop = outputDiv.scrollHeight;
    }
});

function processCommand(cmd) {
    let dev = network[currentDevice];

    if (dev.mode === 'LOGGED_OUT') {
        if (dev.consolePass && dev.consoleLogin) { dev.awaitingPass = 'console'; printLine("User Access Verification"); } else { dev.mode = '>'; }
        return;
    }
    if (dev.awaitingPass === 'console') { if (cmd === dev.consolePass) { dev.mode = '>'; dev.awaitingPass = false; } else { printLine("% Bad passwords"); dev.mode = 'LOGGED_OUT'; dev.awaitingPass = false; } return; }
    if (dev.awaitingPass === 'enable') { if (cmd === dev.enableSecret) { dev.mode = '#'; dev.awaitingPass = false; } else { printLine("% Bad passwords"); dev.mode = '>'; dev.awaitingPass = false; } return; }

    if (cmd === '') return;
    if (cmd === 'enable' || cmd === 'en') { if (dev.enableSecret) dev.awaitingPass = 'enable'; else dev.mode = '#'; return; }
    if (cmd === 'disable') { dev.mode = '>'; return; }
    if (cmd === 'configure terminal' || cmd === 'conf t') { if (dev.mode === '#') dev.mode = 'config'; else printLine("% Invalid input detected"); return; }
    if (cmd === 'end') { if (dev.mode.startsWith('config')) dev.mode = '#'; return; }
    if (cmd === 'exit') {
        if (dev.mode === '>') { dev.mode = 'LOGGED_OUT'; printLine(`${dev.hostname} con0 is now available<br>Press RETURN to get started.`); }
        else if (dev.mode === '#') { dev.mode = '>'; }
        else if (dev.mode === 'config') { dev.mode = '#'; }
        else if (dev.mode.startsWith('config-')) { dev.mode = 'config'; }
        return;
    }

    if (dev.mode === 'config') {
        if (cmd.startsWith('hostname ')) { dev.hostname = cmd.split(' ')[1] || dev.hostname; return; }
        if (cmd.startsWith('enable secret ')) { dev.enableSecret = cmd.split(' ')[2]; return; }
        if (cmd === 'service password-encryption') { dev.servicePassEnc = true; return; }
        if (cmd.startsWith('ip domain-name ')) { dev.domainName = cmd.split(' ')[2]; return; }
        if (cmd === 'crypto key generate rsa') { dev.cryptoKey = true; printLine("OK - Generating RSA keys... Done."); return; }
        if (cmd.startsWith('username ')) { let p = cmd.split(' '); dev.users[p[1]] = p[3]; return; }
        if (cmd === 'ip dhcp snooping') { dev.dhcpSnooping = true; return; }
        if (cmd.startsWith('ip dhcp snooping vlan ')) { dev.dhcpSnoopingVlans = cmd.split('vlan ')[1]; return; }
        
        if (cmd.startsWith('int ') || cmd.startsWith('interface ')) {
            let arg = cmd.replace('interface ', '').replace('int ', '').trim();
            dev.currentContext =[]; 
            if (arg.startsWith('range ')) {
                let rangeStr = arg.replace('range ', '').trim();
                let prefix = rangeStr.match(/[a-z]+/i)[0]; let mod = rangeStr.match(/\d+\//)[0]; 
                let ports = rangeStr.split('/')[1].split('-');
                let start = parseInt(ports[0]), end = parseInt(ports[1] || ports[0]);
                for(let i = start; i <= end; i++){
                    let intName = prefix + mod + i;
                    if(!dev.interfaces[intName]) dev.interfaces[intName] = getDefaultInt(); 
                    dev.currentContext.push(intName);
                }
            } else {
                let intName = arg.replace('gigabitethernet', 'g').replace('fastethernet', 'f');
                if (intName.includes('.') && dev.type === 'router') {
                    if (!dev.subinterfaces[intName]) dev.subinterfaces[intName] = { encap: null, ip: null };
                } else { if(!dev.interfaces[intName]) dev.interfaces[intName] = getDefaultInt(); }
                dev.currentContext.push(intName);
            }
            dev.mode = 'config-if'; return;
        }

        if (cmd.startsWith('line console ')) { dev.currentContext =['console']; dev.mode = 'config-line'; return; }
        if (cmd.startsWith('line vty ')) { dev.currentContext = ['vty']; dev.mode = 'config-line'; return; }
    }

    if (dev.mode === 'config-if') {
        let ctx = dev.currentContext; 
        if (cmd === 'shutdown' || cmd === 'shut') { ctx.forEach(i => dev.interfaces[i] ? dev.interfaces[i].shutdown = true : null); return; }
        if (cmd === 'no shutdown' || cmd === 'no shut') { ctx.forEach(i => dev.interfaces[i] ? dev.interfaces[i].shutdown = false : null); return; }
        
        if (dev.type === 'switch') {
            if (cmd === 'switchport mode access') { ctx.forEach(i => dev.interfaces[i].mode = 'access'); return; }
            if (cmd === 'switchport mode trunk') { ctx.forEach(i => dev.interfaces[i].mode = 'trunk'); return; }
            if (cmd.startsWith('switchport access vlan ')) { let v = parseInt(cmd.split('vlan ')[1]); ctx.forEach(i => dev.interfaces[i].accessVlan = v); return; }
            if (cmd === 'switchport nonegotiate') { ctx.forEach(i => dev.interfaces[i].dtp = false); return; }
            if (cmd.startsWith('switchport trunk native vlan ')) { let v = parseInt(cmd.split('vlan ')[1]); ctx.forEach(i => dev.interfaces[i].nativeVlan = v); return; }
            if (cmd === 'switchport port-security') { ctx.forEach(i => dev.interfaces[i].portSecurity = true); return; }
            if (cmd.startsWith('switchport port-security maximum ')) { let v = parseInt(cmd.split('maximum ')[1]); ctx.forEach(i => dev.interfaces[i].psMax = v); return; }
            if (cmd.startsWith('switchport port-security violation ')) { let v = cmd.split('violation ')[1]; ctx.forEach(i => dev.interfaces[i].psViolation = v); return; }
            if (cmd === 'switchport port-security mac-address sticky') { ctx.forEach(i => dev.interfaces[i].psSticky = true); return; }
            if (cmd === 'ip dhcp snooping trust') { ctx.forEach(i => dev.interfaces[i].dhcpTrust = true); return; }
            if (cmd.startsWith('ip dhcp snooping limit rate ')) { let v = parseInt(cmd.split('rate ')[1]); ctx.forEach(i => dev.interfaces[i].dhcpLimit = v); return; }
            if (cmd === 'spanning-tree portfast') { ctx.forEach(i => dev.interfaces[i].portfast = true); return; }
            if (cmd === 'spanning-tree bpduguard enable') { ctx.forEach(i => dev.interfaces[i].bpduguard = true); return; }
        }
    }
    if (dev.mode === 'config-line') {
        let ctx = dev.currentContext[0];
        if (cmd.startsWith('password ')) { if (ctx === 'console') dev.consolePass = cmd.split(' ')[1]; if (ctx === 'vty') dev.vtyPass = cmd.split(' ')[1]; return; }
        if (cmd === 'login') { if (ctx === 'console') dev.consoleLogin = true; return; }
        if (cmd === 'login local' && ctx === 'vty') { dev.vtyLoginLocal = true; return; }
        if (cmd === 'transport input ssh' && ctx === 'vty') { dev.vtyTransportSsh = true; return; }
    }
    printLine(`% Invalid input detected at '^' marker.`);
}

// ==========================================
// 3. DIAGNOSTIC TESTING ENGINE
// ==========================================
function logMsg(msg, isSuccess = false) { return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#4ade80' : '#f87171'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`; }

function runMod11Test() {
    let SW0 = network.Switch0; let pass = true; let output = `<b style="color:white; font-size:1.1rem; margin-bottom:10px; display:block;">Checking Module 11: Switch Security (Switch0)</b>`;

    let t = SW0.interfaces['g0/1'] || {};
    if (t.dtp === false) output += logMsg(`DTP negotiation disabled on trunk (nonegotiate).`, true); else { output += logMsg(`DTP is still on for g0/1. Use 'switchport nonegotiate'.`); pass = false; }
    if (t.nativeVlan === 999) output += logMsg(`Native VLAN securely changed to ${t.nativeVlan}.`, true); else { output += logMsg(`Native VLAN is still default on g0/1. Change it to 999!`); pass = false; }

    let unused = SW0.interfaces['f0/24'];
    if (unused && unused.shutdown) output += logMsg(`Unused ports (e.g. f0/24) are administratively shutdown.`, true); else { output += logMsg(`Unused ports are active. Use 'interface range' to shut them.`); pass = false; }

    let p = SW0.interfaces['f0/1'] || {};
    if (p.portSecurity) output += logMsg(`Port Security enabled on access port f0/1.`, true); else { output += logMsg(`Port Security missing on access port f0/1.`); pass = false; }
    if (p.psMax === 2) output += logMsg(`Port Security Maximum MAC set to ${p.psMax}.`, true); else { output += logMsg(`Port Security Max MACs not set to 2.`); pass = false; }
    if (p.psSticky) output += logMsg(`Port Security Sticky MAC enabled.`, true); else { output += logMsg(`Port Security sticky missing.`); pass = false; }
    if (p.psViolation === 'restrict') output += logMsg(`Violation mode set to ${p.psViolation}.`, true); else { output += logMsg(`Violation mode not set to restrict.`); pass = false; }

    if (SW0.dhcpSnooping) output += logMsg(`DHCP Snooping enabled globally.`, true); else { output += logMsg(`DHCP Snooping is disabled globally.`); pass = false; }
    if (t.dhcpTrust) output += logMsg(`Trunk port g0/1 configured as DHCP Trust.`, true); else { output += logMsg(`Trunk port g0/1 is NOT trusted. DHCP will fail.`); pass = false; }
    if (p.dhcpLimit === 5) output += logMsg(`Access port f0/1 rate limited to ${p.dhcpLimit} pps.`, true); else { output += logMsg(`Access port f0/1 is not rate limited to 5 pps.`); pass = false; }

    if (p.portfast) output += logMsg(`PortFast enabled on f0/1.`, true); else { output += logMsg(`PortFast missing on f0/1.`); pass = false; }
    if (p.bpduguard) output += logMsg(`BPDU Guard enabled on f0/1.`, true); else { output += logMsg(`BPDU Guard missing on f0/1.`); pass = false; }

    output += pass ? `<br><strong style="color:#4ade80;">RESULT: MODULE 11 LAB PERFECT! YOU ARE A HACKER'S WORST NIGHTMARE!</strong>` : `<br><strong style="color:#f87171;">RESULT: SECURITY VULNERABILITIES DETECTED. Fix the red errors.</strong>`;
    
    diagOutput.innerHTML = output; 
    diagOutput.className = pass ? 'diag-success' : 'diag-error';
    
    highlightElement(diagOutput);
}

document.getElementById('test-ccs').addEventListener('click', () => { diagOutput.innerHTML = logMsg("Ping test offline in this scope. Focus on Mod 11 test."); });
document.getElementById('test-ssh').addEventListener('click', () => { diagOutput.innerHTML = logMsg("SSH test offline in this scope. Focus on Mod 11 test."); });
document.getElementById('test-security').addEventListener('click', () => { diagOutput.innerHTML = logMsg("Security test offline in this scope. Focus on Mod 11 test."); });
document.getElementById('test-mod11').addEventListener('click', runMod11Test);

// ==========================================
// 4. CHEAT SHEET MODAL LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    highlightElement(document.getElementById('objectives-box'));

    const cheatBtn = document.getElementById('cheat-btn');
    const cheatModal = document.getElementById('cheat-modal');
    const closeCheatBtn = document.getElementById('close-cheat');

    if (cheatBtn && cheatModal && closeCheatBtn) {
        // Open Modal
        cheatBtn.addEventListener('click', () => {
            cheatModal.style.display = 'flex';
        });

        // Close Modal via X button
        closeCheatBtn.addEventListener('click', () => {
            cheatModal.style.display = 'none';
        });

        // Close Modal by clicking outside of it
        cheatModal.addEventListener('click', (e) => {
            if (e.target === cheatModal) {
                cheatModal.style.display = 'none';
            }
        });
    }
});