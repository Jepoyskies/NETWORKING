// --- DATA STORE FOR GUI INPUTS ---
const configData = {
    home: {},
    wlc: {},
    hosts: {}
};

// --- UI ELEMENTS & TAB SWITCHING ---
const sections = document.querySelectorAll('.gui-section');
const diagOutput = document.getElementById('diagnostic-output');

document.querySelectorAll('.dev-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Handle Active Button State
        document.querySelectorAll('.dev-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        let targetId = 'gui-' + e.target.getAttribute('data-device');
        
        // Hide all sections, show target
        sections.forEach(sec => sec.classList.remove('active'));
        let targetSec = document.getElementById(targetId);
        if(targetSec) targetSec.classList.add('active');
    });
});

// --- CAPTURE CONFIGURATION FUNCTIONS ---

window.saveHomeRouter = function() {
    configData.home = {
        int: document.getElementById('hr-int').value,
        ip: document.getElementById('hr-ip').value.trim(),
        mask: document.getElementById('hr-mask').value.trim(),
        dhcpEn: document.getElementById('hr-dhcp-en').value,
        dhcpStart: document.getElementById('hr-dhcp-start').value.trim(),
        dhcpMax: document.getElementById('hr-dhcp-max').value.trim(),
        dns: document.getElementById('hr-dns').value.trim(),
        ssid: document.getElementById('hr-ssid').value.trim(),
        chan: document.getElementById('hr-chan').value,
        sec: document.getElementById('hr-sec').value,
        pass: document.getElementById('hr-pass').value.trim()
    };
    alert('Home Router configuration saved locally!');
};

window.saveWLC = function() {
    configData.wlc = {
        // Virtual Interfaces
        v2_id: document.getElementById('wlc-vlan2-id').value.trim(),
        v2_ip: document.getElementById('wlc-vlan2-ip').value.trim(),
        v2_gw: document.getElementById('wlc-vlan2-gw').value.trim(),
        
        v5_id: document.getElementById('wlc-vlan5-id').value.trim(),
        v5_ip: document.getElementById('wlc-vlan5-ip').value.trim(),
        v5_gw: document.getElementById('wlc-vlan5-gw').value.trim(),
        
        // DHCP & Servers
        dhcp_name: document.getElementById('wlc-dhcp-name').value.trim(),
        dhcp_start: document.getElementById('wlc-dhcp-start').value.trim(),
        dhcp_end: document.getElementById('wlc-dhcp-end').value.trim(),
        dhcp_net: document.getElementById('wlc-dhcp-net').value.trim(),
        dhcp_def: document.getElementById('wlc-dhcp-def').value.trim(),
        
        rad_ip: document.getElementById('wlc-rad-ip').value.trim(),
        rad_sec: document.getElementById('wlc-rad-sec').value.trim(),
        snmp_ip: document.getElementById('wlc-snmp-ip').value.trim(),
        snmp_com: document.getElementById('wlc-snmp-com').value.trim(),
        
        // WLAN 2
        wlan2_ssid: document.getElementById('wlc-wlan2-ssid').value.trim(),
        wlan2_int: document.getElementById('wlc-wlan2-int').value,
        wlan2_sec: document.getElementById('wlc-wlan2-sec').value,
        wlan2_psk: document.getElementById('wlc-wlan2-psk').value.trim(),
        wlan2_en: document.getElementById('wlc-wlan2-enable').checked,
        wlan2_f1: document.getElementById('wlc-wlan2-flex1').checked,
        wlan2_f2: document.getElementById('wlc-wlan2-flex2').checked,
        
        // WLAN 5
        wlan5_ssid: document.getElementById('wlc-wlan5-ssid').value.trim(),
        wlan5_int: document.getElementById('wlc-wlan5-int').value,
        wlan5_sec: document.getElementById('wlc-wlan5-sec').value,
        wlan5_rad: document.getElementById('wlc-wlan5-rad').value,
        wlan5_en: document.getElementById('wlc-wlan5-enable').checked,
        wlan5_f1: document.getElementById('wlc-wlan5-flex1').checked,
        wlan5_f2: document.getElementById('wlc-wlan5-flex2').checked,
    };
    alert('WLC-1 configuration saved locally! (Hope you remembered the FlexConnect checkboxes!)');
};

window.saveHosts = function() {
    configData.hosts = {
        h1_ssid: document.getElementById('h1-ssid').value.trim(),
        h1_sec: document.getElementById('h1-sec').value,
        h1_pass: document.getElementById('h1-pass').value.trim(),
        
        h2_ssid: document.getElementById('h2-ssid').value.trim(),
        h2_sec: document.getElementById('h2-sec').value,
        h2_user: document.getElementById('h2-user').value.trim(),
        h2_pass: document.getElementById('h2-pass').value.trim(),
    };
    alert('Host connectivity settings applied.');
};

// --- DIAGNOSTICS ENGINE FORMATTING ---
function logMsg(msg, isSuccess = false) { 
    return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#047857' : '#991b1b'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`; 
}

// --- TEST 1: HOME ROUTER VERIFICATION ---
document.getElementById('test-home').addEventListener('click', () => {
    let d = configData.home; let pass = true; let out = `<b>Checking Home Router Configuration</b><br>`;
    
    if(!d.ip) { diagOutput.innerHTML = out + logMsg(`No data. Please apply settings first.`, false); diagOutput.className = 'diag-error'; return; }

    if (d.int === 'DHCP') out += logMsg(`Internet Connection set to DHCP.`, true); 
    else { out += logMsg(`Internet Connection should be DHCP.`); pass = false; }
    
    if (d.ip === '192.168.6.1' && d.mask === '255.255.255.224') out += logMsg(`LAN IP configured correctly (192.168.6.1/27).`, true); 
    else { out += logMsg(`Incorrect LAN IP or Subnet Mask.`); pass = false; }
    
    if (d.dhcpEn === 'Enabled' && d.dhcpStart === '192.168.6.3' && d.dhcpMax === '20') out += logMsg(`DHCP Server enabled with Start IP .3 and Max 20.`, true); 
    else { out += logMsg(`DHCP Server misconfigured.`); pass = false; }
    
    if (d.dns === '10.100.100.252') out += logMsg(`Static DNS 1 configured securely.`, true); 
    else { out += logMsg(`Static DNS incorrect. Expected: 10.100.100.252`); pass = false; }
    
    if (d.ssid === 'HomeSSID' && d.chan === '6') out += logMsg(`Wireless SSID and Channel configured correctly.`, true); 
    else { out += logMsg(`SSID should be HomeSSID, Channel 6.`); pass = false; }
    
    if (d.sec === 'WPA2-Personal' && d.pass === 'Cisco123') out += logMsg(`WPA2-Personal security successfully applied.`, true); 
    else { out += logMsg(`Security should be WPA2-Personal with passphrase 'Cisco123'.`); pass = false; }

    out += pass ? `<br><strong style="color:#047857;">RESULT: HOME ROUTER PASSED!</strong>` : `<br><strong style="color:#991b1b;">RESULT: FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
});

// --- TEST 2: WLC NETWORK & DHCP ---
document.getElementById('test-wlc-net').addEventListener('click', () => {
    let d = configData.wlc; let pass = true; let out = `<b>Checking WLC-1 Interfaces & DHCP Scope</b><br>`;
    
    if(!d.v2_ip) { diagOutput.innerHTML = out + logMsg(`No data. Please apply settings first.`, false); diagOutput.className = 'diag-error'; return; }

    if (d.v2_id === '2' && d.v2_ip === '192.168.2.254' && d.v2_gw === '192.168.2.1') out += logMsg(`WLAN 2 Interface configured correctly.`, true); 
    else { out += logMsg(`WLAN 2 Interface incorrect (VLAN 2, IP .254, GW .1).`); pass = false; }
    
    if (d.v5_id === '5' && d.v5_ip === '192.168.5.254' && d.v5_gw === '192.168.5.1') out += logMsg(`WLAN 5 Interface configured correctly.`, true); 
    else { out += logMsg(`WLAN 5 Interface incorrect (VLAN 5, IP .254, GW .1).`); pass = false; }

    if (d.dhcp_name === 'management' && d.dhcp_start === '192.168.100.235' && d.dhcp_end === '192.168.100.245' && d.dhcp_net === '192.168.100.0' && d.dhcp_def === '192.168.100.1') 
         out += logMsg(`Internal DHCP Scope 'management' configured correctly.`, true); 
    else { out += logMsg(`Internal DHCP scope misconfigured. Verify pool IPs, network, and default router.`); pass = false; }

    out += pass ? `<br><strong style="color:#047857;">RESULT: WLC NETWORK PASSED!</strong>` : `<br><strong style="color:#991b1b;">RESULT: FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
});

// --- TEST 3: WLC WLAN PROFILES & SECURITY ---
document.getElementById('test-wlc-wlan').addEventListener('click', () => {
    let d = configData.wlc; let pass = true; let out = `<b>Checking WLC-1 WLANs & Server Auth</b><br>`;
    if(!d.rad_ip) { diagOutput.innerHTML = out + logMsg(`No data. Please apply settings first.`, false); diagOutput.className = 'diag-error'; return; }

    if (d.rad_ip === '10.6.0.254' && d.rad_sec === 'RadiusPW') out += logMsg(`RADIUS Server registered successfully.`, true); 
    else { out += logMsg(`RADIUS server missing or incorrect (IP 10.6.0.254, Secret RadiusPW).`); pass = false; }
    
    if (d.snmp_ip === '10.6.0.254' && d.snmp_com === 'WLAN') out += logMsg(`SNMP Server registered successfully.`, true); 
    else { out += logMsg(`SNMP Server missing or incorrect.`); pass = false; }

    // VLAN 2 Checks
    if (d.wlan2_ssid === 'SSID-2' && d.wlan2_int === 'WLAN 2' && d.wlan2_sec === 'WPA2-PSK' && d.wlan2_psk === 'Cisco123') {
        out += logMsg(`WLAN 2 Base settings are correct.`, true);
        if (d.wlan2_en && d.wlan2_f1 && d.wlan2_f2) out += logMsg(`WLAN 2 Enabled & FlexConnect settings verified!`, true);
        else { out += logMsg(`WLAN 2 is missing "Enabled" status or FlexConnect Local Switching/Auth!`); pass = false; }
    } else { out += logMsg(`WLAN 2 misconfigured. Check SSID, interface mapping, and PSK security.`); pass = false; }

    // VLAN 5 Checks
    if (d.wlan5_ssid === 'SSID-5' && d.wlan5_int === 'WLAN 5' && d.wlan5_sec === '802.1x - WPA2-Enterprise' && d.wlan5_rad === '10.6.0.254') {
        out += logMsg(`WLAN 5 Base settings are correct.`, true);
        if (d.wlan5_en && d.wlan5_f1 && d.wlan5_f2) out += logMsg(`WLAN 5 Enabled & FlexConnect settings verified!`, true);
        else { out += logMsg(`WLAN 5 is missing "Enabled" status or FlexConnect Local Switching/Auth!`); pass = false; }
    } else { out += logMsg(`WLAN 5 misconfigured. Needs WPA2-Enterprise and mapped RADIUS server.`); pass = false; }

    out += pass ? `<br><strong style="color:#047857;">RESULT: WLC WLANs PASSED! YOU ARE EXAM READY!</strong>` : `<br><strong style="color:#991b1b;">RESULT: FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
});

// --- TEST 4: END-TO-END HOST VERIFICATION ---
document.getElementById('test-hosts').addEventListener('click', () => {
    let d = configData.hosts; let w = configData.wlc; let pass = true; let out = `<b>Testing End-to-End Host Connectivity</b><br>`;
    if(!d.h1_ssid) { diagOutput.innerHTML = out + logMsg(`No data. Please apply Host settings first.`, false); diagOutput.className = 'diag-error'; return; }

    // Check Host 1 (WPA2 Personal)
    if (d.h1_ssid === 'SSID-2' && d.h1_sec === 'WPA2-Personal' && d.h1_pass === 'Cisco123') {
        if(w.wlan2_ssid === 'SSID-2' && w.wlan2_sec === 'WPA2-PSK' && w.wlan2_psk === 'Cisco123' && w.wlan2_en && w.wlan2_f1 && w.wlan2_f2) {
            out += logMsg(`Wireless Host 1 successfully associated with WLAN 2 (WPA2-PSK).`, true);
        } else { out += logMsg(`Host 1 credentials match, but WLC WLAN 2 is down/misconfigured.`); pass = false; }
    } else { out += logMsg(`Host 1 credentials incorrect. Can't join SSID-2.`); pass = false; }

    // Check Host 2 (WPA2 Enterprise)
    if (d.h2_ssid === 'SSID-5' && d.h2_sec === 'WPA2-Enterprise' && d.h2_user === 'userWLAN5' && d.h2_pass === 'userW5pass') {
        if(w.wlan5_ssid === 'SSID-5' && w.wlan5_sec === '802.1x - WPA2-Enterprise' && w.wlan5_rad === '10.6.0.254' && w.rad_sec === 'RadiusPW' && w.wlan5_en && w.wlan5_f1 && w.wlan5_f2) {
            out += logMsg(`Wireless Host 2 successfully authenticated with RADIUS on WLAN 5.`, true);
        } else { out += logMsg(`Host 2 configured, but WLC/RADIUS backend is down/misconfigured.`); pass = false; }
    } else { out += logMsg(`Host 2 credentials incorrect. Can't join SSID-5.`); pass = false; }

    out += pass ? `<br><strong style="color:#047857;">RESULT: ALL HOSTS CONNECTED SUCCESSFULLY!</strong>` : `<br><strong style="color:#991b1b;">RESULT: CONNECTIVITY FAILED. Fix red items.</strong>`;
    diagOutput.innerHTML = out; diagOutput.className = pass ? 'diag-success' : 'diag-error';
});