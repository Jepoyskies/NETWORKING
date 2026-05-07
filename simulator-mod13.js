// ==========================================
// 1. DICTIONARY & UI INJECTION
// ==========================================
const termDictionary = {
    "wlc": "Wireless LAN Controller. A centralized device that manages and configures multiple Lightweight Access Points.",
    "gui": "Graphical User Interface. A visual, point-and-click interface for configuring devices, as opposed to a command-line interface.",
    "wpa2-personal": "Also known as WPA2-PSK. Secures a Wi-Fi network with a single Pre-Shared Key (passphrase) for everyone.",
    "wpa2-enterprise": "Also known as 802.1X. Secures a Wi-Fi network by requiring each user to log in with a unique username and password, verified by a RADIUS server.",
    "radius": "Remote Authentication Dial-In User Service. The server that handles authentication for WPA2-Enterprise networks.",
    "snmp": "Simple Network Management Protocol. Used to monitor the health and status of network devices like WLCs.",
    "flexconnect": "A WLC feature that allows an Access Point to switch traffic locally at the site, instead of tunneling all traffic back to the WLC.",
    "dhcp": "Dynamic Host Configuration Protocol. Automatically assigns IP addresses to devices.",
    "ssid": "Service Set Identifier. The name of a Wi-Fi network.",
    "vlan": "Virtual Local Area Network. A way to logically segment a single physical switch into multiple separate networks."
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
// 2. GUI SIMULATOR ENGINE
// ==========================================
const configData = { home: {}, wlc: {}, hosts: {} };
const sections = document.querySelectorAll('.gui-section');
const diagOutput = document.getElementById('diagnostic-output');

document.querySelectorAll('.dev-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.id === 'cheat-btn') return; // Don't switch tabs for the cheat sheet button
        document.querySelectorAll('.dev-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        let targetId = 'gui-' + e.target.getAttribute('data-device');
        sections.forEach(sec => sec.classList.remove('active'));
        let targetSec = document.getElementById(targetId);
        if(targetSec) targetSec.classList.add('active');
    });
});

function showSaveConfirmation(button) {
    const originalText = button.innerText;
    button.innerText = '✓ Saved!';
    button.style.background = '#10b981';
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = ''; // Revert to default
    }, 2000);
}

window.saveHomeRouter = function(btn) {
    configData.home = {
        int: document.getElementById('hr-int').value, ip: document.getElementById('hr-ip').value.trim(), mask: document.getElementById('hr-mask').value.trim(), dhcpEn: document.getElementById('hr-dhcp-en').value, dhcpStart: document.getElementById('hr-dhcp-start').value.trim(), dhcpMax: document.getElementById('hr-dhcp-max').value.trim(), dns: document.getElementById('hr-dns').value.trim(), ssid: document.getElementById('hr-ssid').value.trim(), chan: document.getElementById('hr-chan').value, sec: document.getElementById('hr-sec').value, pass: document.getElementById('hr-pass').value.trim()
    };
    showSaveConfirmation(btn);
};

window.saveWLC = function(btn) {
    configData.wlc = {
        v2_id: document.getElementById('wlc-vlan2-id').value.trim(), v2_ip: document.getElementById('wlc-vlan2-ip').value.trim(), v2_gw: document.getElementById('wlc-vlan2-gw').value.trim(), v5_id: document.getElementById('wlc-vlan5-id').value.trim(), v5_ip: document.getElementById('wlc-vlan5-ip').value.trim(), v5_gw: document.getElementById('wlc-vlan5-gw').value.trim(), dhcp_name: document.getElementById('wlc-dhcp-name').value.trim(), dhcp_start: document.getElementById('wlc-dhcp-start').value.trim(), dhcp_end: document.getElementById('wlc-dhcp-end').value.trim(), dhcp_net: document.getElementById('wlc-dhcp-net').value.trim(), dhcp_def: document.getElementById('wlc-dhcp-def').value.trim(), rad_ip: document.getElementById('wlc-rad-ip').value.trim(), rad_sec: document.getElementById('wlc-rad-sec').value.trim(), snmp_ip: document.getElementById('wlc-snmp-ip').value.trim(), snmp_com: document.getElementById('wlc-snmp-com').value.trim(), wlan2_ssid: document.getElementById('wlc-wlan2-ssid').value.trim(), wlan2_int: document.getElementById('wlc-wlan2-int').value, wlan2_sec: document.getElementById('wlc-wlan2-sec').value, wlan2_psk: document.getElementById('wlc-wlan2-psk').value.trim(), wlan2_en: document.getElementById('wlc-wlan2-enable').checked, wlan2_f1: document.getElementById('wlc-wlan2-flex1').checked, wlan2_f2: document.getElementById('wlc-wlan2-flex2').checked, wlan5_ssid: document.getElementById('wlc-wlan5-ssid').value.trim(), wlan5_int: document.getElementById('wlc-wlan5-int').value, wlan5_sec: document.getElementById('wlc-wlan5-sec').value, wlan5_rad: document.getElementById('wlc-wlan5-rad').value, wlan5_en: document.getElementById('wlc-wlan5-enable').checked, wlan5_f1: document.getElementById('wlc-wlan5-flex1').checked, wlan5_f2: document.getElementById('wlc-wlan5-flex2').checked,
    };
    showSaveConfirmation(btn);
};

window.saveHosts = function(btn) {
    configData.hosts = {
        h1_ssid: document.getElementById('h1-ssid').value.trim(), h1_sec: document.getElementById('h1-sec').value, h1_pass: document.getElementById('h1-pass').value.trim(), h2_ssid: document.getElementById('h2-ssid').value.trim(), h2_sec: document.getElementById('h2-sec').value, h2_user: document.getElementById('h2-user').value.trim(), h2_pass: document.getElementById('h2-pass').value.trim(),
    };
    showSaveConfirmation(btn);
};

// --- DIAGNOSTICS ENGINE ---
function logMsg(msg, isSuccess = false) { return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#047857' : '#991b1b'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`; }

document.getElementById('test-home').addEventListener('click', () => {
    let d = configData.home; let pass = true; let out = `<b style="color:white;">Checking Home Router Config</b><br>`;
    if(!d.ip) { diagOutput.innerHTML = out + logMsg(`No data. Please apply settings first.`, false); diagOutput.className = 'diag-error'; return; }
    if (d.int === 'DHCP') out += logMsg(`Internet Connection: DHCP`, true); else { out += logMsg(`Internet Connection should be DHCP.`); pass = false; }
    if (d.ip === '192.168.6.1' && d.mask === '255.255.255.224') out += logMsg(`LAN IP: 192.168.6.1/27`, true); else { out += logMsg(`Incorrect LAN IP or Subnet Mask.`); pass = false; }
    if (d.dhcpEn === 'Enabled' && d.dhcpStart === '192.168.6.3' && d.dhcpMax === '20') out += logMsg(`DHCP Pool: Start .3, Max 20`, true); else { out += logMsg(`DHCP Server misconfigured.`); pass = false; }
    if (d.dns === '10.100.100.252') out += logMsg(`Static DNS correct.`, true); else { out += logMsg(`Static DNS incorrect.`); pass = false; }
    if (d.ssid === 'HomeSSID' && d.chan === '6') out += logMsg(`Wireless SSID/Channel correct.`, true); else { out += logMsg(`SSID should be HomeSSID, Channel 6.`); pass = false; }
    if (d.sec === 'WPA2-Personal' && d.pass === 'Cisco123') out += logMsg(`WPA2-Personal security applied.`, true); else { out += logMsg(`Security incorrect.`); pass = false; }
    out += pass ? `<br><strong style="color:#047857;">HOME ROUTER PASSED!</strong>` : `<br><strong style="color:#991b1b;">FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
});

document.getElementById('test-wlc-net').addEventListener('click', () => {
    let d = configData.wlc; let pass = true; let out = `<b style="color:white;">Checking WLC Network & DHCP</b><br>`;
    if(!d.v2_ip) { diagOutput.innerHTML = out + logMsg(`No data. Apply WLC settings.`, false); diagOutput.className = 'diag-error'; return; }
    if (d.v2_id === '2' && d.v2_ip === '192.168.2.254' && d.v2_gw === '192.168.2.1') out += logMsg(`WLAN 2 Interface correct.`, true); else { out += logMsg(`WLAN 2 Interface incorrect.`); pass = false; }
    if (d.v5_id === '5' && d.v5_ip === '192.168.5.254' && d.v5_gw === '192.168.5.1') out += logMsg(`WLAN 5 Interface correct.`, true); else { out += logMsg(`WLAN 5 Interface incorrect.`); pass = false; }
    if (d.dhcp_name === 'management' && d.dhcp_start === '192.168.100.235' && d.dhcp_end === '192.168.100.245' && d.dhcp_net === '192.168.100.0' && d.dhcp_def === '192.168.100.1') out += logMsg(`Internal DHCP Scope 'management' correct.`, true); else { out += logMsg(`Internal DHCP scope misconfigured.`); pass = false; }
    out += pass ? `<br><strong style="color:#047857;">WLC NETWORK PASSED!</strong>` : `<br><strong style="color:#991b1b;">FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
});

document.getElementById('test-wlc-wlan').addEventListener('click', () => {
    let d = configData.wlc; let pass = true; let out = `<b style="color:white;">Checking WLC WLANs & Servers</b><br>`;
    if(!d.rad_ip) { diagOutput.innerHTML = out + logMsg(`No data. Apply WLC settings.`, false); diagOutput.className = 'diag-error'; return; }
    if (d.rad_ip === '10.6.0.254' && d.rad_sec === 'RadiusPW') out += logMsg(`RADIUS Server registered.`, true); else { out += logMsg(`RADIUS server misconfigured.`); pass = false; }
    if (d.snmp_ip === '10.6.0.254' && d.snmp_com === 'WLAN') out += logMsg(`SNMP Server registered.`, true); else { out += logMsg(`SNMP Server misconfigured.`); pass = false; }
    if (d.wlan2_ssid === 'SSID-2' && d.wlan2_int === 'WLAN 2' && d.wlan2_sec === 'WPA2-PSK' && d.wlan2_psk === 'Cisco123') { out += logMsg(`WLAN 2 Base settings correct.`, true);
        if (d.wlan2_en && d.wlan2_f1 && d.wlan2_f2) out += logMsg(`WLAN 2 Enabled & FlexConnect settings verified!`, true); else { out += logMsg(`WLAN 2 missing "Enabled" or FlexConnect checkboxes!`); pass = false; }
    } else { out += logMsg(`WLAN 2 base settings misconfigured.`); pass = false; }
    if (d.wlan5_ssid === 'SSID-5' && d.wlan5_int === 'WLAN 5' && d.wlan5_sec === '802.1x - WPA2-Enterprise' && d.wlan5_rad === '10.6.0.254') { out += logMsg(`WLAN 5 Base settings correct.`, true);
        if (d.wlan5_en && d.wlan5_f1 && d.wlan5_f2) out += logMsg(`WLAN 5 Enabled & FlexConnect settings verified!`, true); else { out += logMsg(`WLAN 5 missing "Enabled" or FlexConnect checkboxes!`); pass = false; }
    } else { out += logMsg(`WLAN 5 base settings misconfigured.`); pass = false; }
    out += pass ? `<br><strong style="color:#047857;">WLC WLANS PASSED!</strong>` : `<br><strong style="color:#991b1b;">FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
});

document.getElementById('test-hosts').addEventListener('click', () => {
    let d = configData.hosts; let w = configData.wlc; let pass = true; let out = `<b style="color:white;">Testing End-to-End Host Connectivity</b><br>`;
    if(!d.h1_ssid) { diagOutput.innerHTML = out + logMsg(`No data. Apply Host settings.`, false); diagOutput.className = 'diag-error'; return; }
    if (d.h1_ssid === 'SSID-2' && d.h1_sec === 'WPA2-Personal' && d.h1_pass === 'Cisco123') {
        if(w.wlan2_en) out += logMsg(`Host 1 successfully connected to WLAN 2 (WPA2-PSK).`, true);
        else { out += logMsg(`Host 1 credentials correct, but WLC WLAN 2 is down/misconfigured.`); pass = false; }
    } else { out += logMsg(`Host 1 credentials incorrect. Can't join SSID-2.`); pass = false; }
    if (d.h2_ssid === 'SSID-5' && d.h2_sec === 'WPA2-Enterprise' && d.h2_user === 'userWLAN5' && d.h2_pass === 'userW5pass') {
        if(w.wlan5_en && w.rad_sec === 'RadiusPW') out += logMsg(`Host 2 successfully authenticated via RADIUS on WLAN 5.`, true);
        else { out += logMsg(`Host 2 credentials correct, but WLC/RADIUS backend is down/misconfigured.`); pass = false; }
    } else { out += logMsg(`Host 2 credentials incorrect. Can't join SSID-5.`); pass = false; }
    out += pass ? `<br><strong style="color:#047857;">ALL HOSTS CONNECTED!</strong>` : `<br><strong style="color:#991b1b;">CONNECTIVITY FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
    highlightElement(diagOutput);
});

// --- CHEAT SHEET MODAL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    highlightElement(document.getElementById('cheat-body')); // Pre-highlight the cheat sheet text
    const cheatBtn = document.getElementById('cheat-btn');
    const cheatModal = document.getElementById('cheat-modal');
    const closeCheatBtn = document.getElementById('close-cheat');
    if (cheatBtn) {
        cheatBtn.addEventListener('click', () => cheatModal.style.display = 'flex');
        closeCheatBtn.addEventListener('click', () => cheatModal.style.display = 'none');
        cheatModal.addEventListener('click', (e) => { if (e.target === cheatModal) cheatModal.style.display = 'none'; });
    }
});