// --- VIRTUAL IOS DEVICE TEMPLATE ---
const createDevice = (name, type) => ({
    name: name, type: type, hostname: name, mode: 'LOGGED_OUT',
    awaitingPass: false,
    
    // Security Configs
    enableSecret: null, consolePass: null, consoleLogin: false,
    vtyPass: null, vtyLoginLocal: false, vtyTransportSsh: false,
    servicePassEnc: false, domainName: null, cryptoKey: false, users: {},
    
    // Global Switch Security Configs
    dhcpSnooping: false, dhcpSnoopingVlans: '',
    
    // Network Configs
    vlans:[],
    interfaces: {}, // Virtual ports generated dynamically
    subinterfaces: {}, 
    dhcpPools: {}, 
    defaultGateway: null,
    
    // CLI Context (Now an Array to support 'interface range'!)
    currentContext:[] 
});

const network = {
    Router0: createDevice('Router0', 'router'),
    Switch0: createDevice('Switch0', 'switch'),
    Switch1: createDevice('Switch1', 'switch')
};

// Default port template
const getDefaultInt = () => ({
    shutdown: false, mode: 'dynamic', accessVlan: 1, nativeVlan: 1, dtp: true,
    portSecurity: false, psMax: 1, psViolation: 'shutdown', psSticky: false, psAgingTime: 0, psAgingType: 'absolute',
    dhcpTrust: false, dhcpLimit: null, portfast: false, bpduguard: false, ip: null
});

// Initialize standard physical interfaces
['g0/0', 'g0/1'].forEach(i => { network.Router0.interfaces[i] = getDefaultInt(); network.Router0.interfaces[i].shutdown = true; });
['g0/1', 'f0/1', 'f0/2'].forEach(i => {
    network.Switch0.interfaces[i] = getDefaultInt();
    network.Switch1.interfaces[i] = getDefaultInt();
});

let currentDevice = 'Router0';

// --- UI ELEMENTS ---
const outputDiv = document.getElementById('output');
const inputField = document.getElementById('cli-input');
const promptSpan = document.getElementById('prompt');
const diagOutput = document.getElementById('diagnostic-output');

// --- DEVICE SWITCHING ---
document.querySelectorAll('.dev-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.dev-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentDevice = e.target.getAttribute('data-device');
        
        let dev = network[currentDevice];
        outputDiv.innerHTML = `\n--- Console connection to ${dev.name} established ---\n`;
        if(dev.mode !== 'LOGGED_OUT') {
            outputDiv.innerHTML += `Press RETURN to get started.`;
            dev.mode = 'LOGGED_OUT';
        }
        updatePrompt();
        inputField.focus();
    });
});

function updatePrompt() {
    let dev = network[currentDevice];
    let p = '';
    inputField.type = 'text'; 
    if (dev.awaitingPass) { p = 'Password: '; inputField.type = 'password'; } 
    else if (dev.mode === 'LOGGED_OUT') { p = ''; } 
    else if (dev.mode === '>') { p = `${dev.hostname}>`; } 
    else if (dev.mode === '#') { p = `${dev.hostname}#`; } 
    else if (dev.mode === 'config') { p = `${dev.hostname}(config)#`; } 
    else if (dev.mode === 'config-if') { 
        // If range, show config-if-range
        p = dev.currentContext.length > 1 ? `${dev.hostname}(config-if-range)#` : `${dev.hostname}(config-if)#`; 
    } 
    else if (dev.mode === 'config-vlan') { p = `${dev.hostname}(config-vlan)#`; } 
    else if (dev.mode === 'config-line') { p = `${dev.hostname}(config-line)#`; } 
    else if (dev.mode === 'config-dhcp') { p = `${dev.hostname}(dhcp-config)#`; }
    promptSpan.innerText = p;
}

function printLine(text) {
    outputDiv.innerHTML += `\n${text}`;
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

// --- CORE TERMINAL ENGINE ---
inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cmdRaw = this.value;
        const cmd = cmdRaw.trim().toLowerCase();
        
        if (network[currentDevice].awaitingPass) printLine(`${promptSpan.innerText}`);
        else printLine(`${promptSpan.innerText}${cmdRaw}`);
        
        this.value = '';
        processCommand(cmd);
        updatePrompt();
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
});

function processCommand(cmd) {
    let dev = network[currentDevice];

    // 1. LOGGED OUT & PASSWORDS
    if (dev.mode === 'LOGGED_OUT') {
        if (dev.consolePass && dev.consoleLogin) { dev.awaitingPass = 'console'; printLine("User Access Verification"); } 
        else { dev.mode = '>'; }
        return;
    }
    if (dev.awaitingPass === 'console') {
        if (cmd === dev.consolePass) { dev.mode = '>'; dev.awaitingPass = false; } 
        else { printLine("% Bad passwords"); dev.mode = 'LOGGED_OUT'; dev.awaitingPass = false; }
        return;
    }
    if (dev.awaitingPass === 'enable') {
        if (cmd === dev.enableSecret) { dev.mode = '#'; dev.awaitingPass = false; } 
        else { printLine("% Bad passwords"); dev.mode = '>'; dev.awaitingPass = false; }
        return;
    }

    // 2. GLOBAL NAVIGATION
    if (cmd === '') return;
    if (cmd === 'enable' || cmd === 'en') { if (dev.enableSecret) dev.awaitingPass = 'enable'; else dev.mode = '#'; return; }
    if (cmd === 'disable') { dev.mode = '>'; return; }
    if (cmd === 'configure terminal' || cmd === 'conf t') { if (dev.mode === '#') dev.mode = 'config'; else printLine("% Invalid input detected"); return; }
    if (cmd === 'end') { if (dev.mode.startsWith('config')) dev.mode = '#'; return; }
    if (cmd === 'exit') {
        if (dev.mode === '>') { dev.mode = 'LOGGED_OUT'; printLine(`${dev.hostname} con0 is now available\nPress RETURN to get started.`); }
        else if (dev.mode === '#') { dev.mode = '>'; }
        else if (dev.mode === 'config') { dev.mode = '#'; }
        else if (dev.mode.startsWith('config-')) { dev.mode = 'config'; }
        return;
    }

    // 3. GLOBAL CONFIG MODE
    if (dev.mode === 'config') {
        if (cmd.startsWith('hostname ')) { dev.hostname = cmd.split(' ')[1] || dev.hostname; return; }
        if (cmd.startsWith('enable secret ')) { dev.enableSecret = cmd.split(' ')[2]; return; }
        if (cmd === 'service password-encryption') { dev.servicePassEnc = true; return; }
        if (cmd.startsWith('ip domain-name ')) { dev.domainName = cmd.split(' ')[2]; return; }
        if (cmd === 'crypto key generate rsa') { dev.cryptoKey = true; printLine("OK - Generating RSA keys... Done."); return; }
        if (cmd.startsWith('username ')) { let p = cmd.split(' '); dev.users[p[1]] = p[3]; return; }
        if (cmd.startsWith('ip default-gateway ')) { dev.defaultGateway = cmd.split(' ')[2]; return; }
        
        // GLOBAL DHCP Snooping
        if (cmd === 'ip dhcp snooping') { dev.dhcpSnooping = true; return; }
        if (cmd.startsWith('ip dhcp snooping vlan ')) { dev.dhcpSnoopingVlans = cmd.split('vlan ')[1]; return; }
        
        // INTERFACE & INTERFACE RANGE
        if (cmd.startsWith('int ') || cmd.startsWith('interface ')) {
            let arg = cmd.replace('interface ', '').replace('int ', '').trim();
            dev.currentContext =[]; // Clear previous context
            
            // Handle Range (e.g. range f0/5-24)
            if (arg.startsWith('range ')) {
                let rangeStr = arg.replace('range ', '').trim();
                let prefix = rangeStr.match(/[a-z]+/i)[0]; // 'f'
                let mod = rangeStr.match(/\d+\//)[0]; // '0/'
                let ports = rangeStr.split('/')[1].split('-'); // ['5', '24']
                let start = parseInt(ports[0]), end = parseInt(ports[1] || ports[0]);
                
                for(let i = start; i <= end; i++){
                    let intName = prefix + mod + i;
                    if(!dev.interfaces[intName]) dev.interfaces[intName] = getDefaultInt(); // Auto-generate ports!
                    dev.currentContext.push(intName);
                }
            } else {
                // Single Interface
                let intName = arg.replace('gigabitethernet', 'g').replace('fastethernet', 'f');
                if (intName.includes('.') && dev.type === 'router') {
                    if (!dev.subinterfaces[intName]) dev.subinterfaces[intName] = { encap: null, ip: null };
                } else {
                    if(!dev.interfaces[intName]) dev.interfaces[intName] = getDefaultInt(); // Auto-generate if missing
                }
                dev.currentContext.push(intName);
            }
            dev.mode = 'config-if'; return;
        }

        if (cmd.startsWith('line console ')) { dev.currentContext =['console']; dev.mode = 'config-line'; return; }
        if (cmd.startsWith('line vty ')) { dev.currentContext = ['vty']; dev.mode = 'config-line'; return; }
        if (cmd.startsWith('vlan ') && dev.type === 'switch') {
            let vid = parseInt(cmd.split(' ')[1]);
            if (!dev.vlans.includes(vid)) dev.vlans.push(vid);
            dev.mode = 'config-vlan'; return;
        }
        if (cmd.startsWith('ip dhcp pool ') && dev.type === 'router') {
            dev.currentContext = [cmd.split(' ')[3]];
            if (!dev.dhcpPools[dev.currentContext[0]]) dev.dhcpPools[dev.currentContext[0]] = { network: null, router: null };
            dev.mode = 'config-dhcp'; return;
        }
    }

    // 4. INTERFACE CONFIG MODE (Applies to ALL interfaces in dev.currentContext Array)
    if (dev.mode === 'config-if') {
        let ctx = dev.currentContext; // Array of ports

        if (cmd === 'shutdown' || cmd === 'shut') { ctx.forEach(i => dev.interfaces[i] ? dev.interfaces[i].shutdown = true : null); return; }
        if (cmd === 'no shutdown' || cmd === 'no shut') { ctx.forEach(i => dev.interfaces[i] ? dev.interfaces[i].shutdown = false : null); return; }
        
        // IP Address
        if (cmd.startsWith('ip address ') || cmd.startsWith('ip add ')) {
            let ip = cmd.split(' ')[2] || cmd.split(' ')[1]; 
            ctx.forEach(i => {
                if (i.includes('.')) dev.subinterfaces[i].ip = ip;
                else dev.interfaces[i].ip = ip;
            });
            return;
        }
        
        if (cmd.startsWith('encapsulation dot1q ') && dev.type === 'router') { ctx.forEach(i => dev.subinterfaces[i].encap = parseInt(cmd.split(' ')[2])); return; }
        
        // MODULE 11: Switchport & Security Commands
        if (dev.type === 'switch') {
            if (cmd === 'switchport mode access') { ctx.forEach(i => dev.interfaces[i].mode = 'access'); return; }
            if (cmd === 'switchport mode trunk') { ctx.forEach(i => dev.interfaces[i].mode = 'trunk'); return; }
            if (cmd.startsWith('switchport access vlan ')) { let v = parseInt(cmd.split('vlan ')[1]); ctx.forEach(i => dev.interfaces[i].accessVlan = v); return; }
            
            // DTP & Native VLAN
            if (cmd === 'switchport nonegotiate') { ctx.forEach(i => dev.interfaces[i].dtp = false); return; }
            if (cmd.startsWith('switchport trunk native vlan ')) { let v = parseInt(cmd.split('vlan ')[1]); ctx.forEach(i => dev.interfaces[i].nativeVlan = v); return; }
            
            // Port Security
            if (cmd === 'switchport port-security') { ctx.forEach(i => dev.interfaces[i].portSecurity = true); return; }
            if (cmd.startsWith('switchport port-security maximum ')) { let v = parseInt(cmd.split('maximum ')[1]); ctx.forEach(i => dev.interfaces[i].psMax = v); return; }
            if (cmd.startsWith('switchport port-security violation ')) { let v = cmd.split('violation ')[1]; ctx.forEach(i => dev.interfaces[i].psViolation = v); return; }
            if (cmd === 'switchport port-security mac-address sticky') { ctx.forEach(i => dev.interfaces[i].psSticky = true); return; }
            if (cmd.startsWith('switchport port-security aging time ')) { let v = parseInt(cmd.split('time ')[1]); ctx.forEach(i => dev.interfaces[i].psAgingTime = v); return; }
            if (cmd.startsWith('switchport port-security aging type ')) { let v = cmd.split('type ')[1]; ctx.forEach(i => dev.interfaces[i].psAgingType = v); return; }
            
            // DHCP Snooping
            if (cmd === 'ip dhcp snooping trust') { ctx.forEach(i => dev.interfaces[i].dhcpTrust = true); return; }
            if (cmd.startsWith('ip dhcp snooping limit rate ')) { let v = parseInt(cmd.split('rate ')[1]); ctx.forEach(i => dev.interfaces[i].dhcpLimit = v); return; }
            
            // STP
            if (cmd === 'spanning-tree portfast') { ctx.forEach(i => dev.interfaces[i].portfast = true); return; }
            if (cmd === 'spanning-tree bpduguard enable') { ctx.forEach(i => dev.interfaces[i].bpduguard = true); return; }
        }
    }

    // 5. LINE & DHCP CONFIG MODES
    if (dev.mode === 'config-line') {
        let ctx = dev.currentContext[0];
        if (cmd.startsWith('password ')) { if (ctx === 'console') dev.consolePass = cmd.split(' ')[1]; if (ctx === 'vty') dev.vtyPass = cmd.split(' ')[1]; return; }
        if (cmd === 'login') { if (ctx === 'console') dev.consoleLogin = true; return; }
        if (cmd === 'login local' && ctx === 'vty') { dev.vtyLoginLocal = true; return; }
        if (cmd === 'transport input ssh' && ctx === 'vty') { dev.vtyTransportSsh = true; return; }
    }
    if (dev.mode === 'config-dhcp') {
        let pool = dev.currentContext[0];
        if (cmd.startsWith('network ')) { dev.dhcpPools[pool].network = cmd.split(' ')[1]; return; }
        if (cmd.startsWith('default-router ')) { dev.dhcpPools[pool].router = cmd.split(' ')[1]; return; }
    }
    if (dev.mode === 'config-vlan') { if (cmd.startsWith('name ')) return; }

    printLine(`% Invalid input detected at '^' marker.`);
}


// --- 💻 DIAGNOSTIC TESTING ENGINE ---
function logMsg(msg, isSuccess = false) { return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#047857' : '#991b1b'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`; }

function runPingTest(sourcePC, destPC, swName, v1, v2, rPort, swPort, pc1Port, pc2Port) {
    let R0 = network.Router0; let SW = network[swName]; let pass = true;
    let output = `<b>Testing Ping: ${sourcePC} to ${destPC}</b><br>`;

    if (SW.interfaces[swPort].mode === 'trunk') output += logMsg(`Switch ${swPort} is a Trunk.`, true); else { output += logMsg(`Switch ${swPort} is NOT a Trunk.`); pass = false; }
    if (SW.interfaces[pc1Port].mode === 'access' && SW.interfaces[pc1Port].accessVlan === v1) output += logMsg(`Switch ${pc1Port} assigned to VLAN ${v1}.`, true); else { output += logMsg(`Switch ${pc1Port} is NOT assigned to VLAN ${v1}.`); pass = false; }
    if (SW.interfaces[pc2Port].mode === 'access' && SW.interfaces[pc2Port].accessVlan === v2) output += logMsg(`Switch ${pc2Port} assigned to VLAN ${v2}.`, true); else { output += logMsg(`Switch ${pc2Port} is NOT assigned to VLAN ${v2}.`); pass = false; }
    if (!R0.interfaces[rPort].shutdown) output += logMsg(`Router physical port ${rPort} is UP.`, true); else { output += logMsg(`Router physical port ${rPort} is SHUTDOWN.`); pass = false; }

    let sub1 = `${rPort}.${v1}`, sub2 = `${rPort}.${v2}`;
    if (R0.subinterfaces[sub1] && R0.subinterfaces[sub1].encap === v1 && R0.subinterfaces[sub1].ip) output += logMsg(`Router subint ${sub1} configured.`, true); else { output += logMsg(`Router subint ${sub1} missing IP or encap.`); pass = false; }
    if (R0.subinterfaces[sub2] && R0.subinterfaces[sub2].encap === v2 && R0.subinterfaces[sub2].ip) output += logMsg(`Router subint ${sub2} configured.`, true); else { output += logMsg(`Router subint ${sub2} missing IP or encap.`); pass = false; }

    let dhcp1 = Object.values(R0.dhcpPools).find(p => p.router === (R0.subinterfaces[sub1] || {}).ip);
    let dhcp2 = Object.values(R0.dhcpPools).find(p => p.router === (R0.subinterfaces[sub2] || {}).ip);
    if (dhcp1) output += logMsg(`${sourcePC} obtained IP via DHCP.`, true); else { output += logMsg(`${sourcePC} failed DHCP.`); pass = false; }
    if (dhcp2) output += logMsg(`${destPC} obtained IP via DHCP.`, true); else { output += logMsg(`${destPC} failed DHCP.`); pass = false; }

    output += pass ? `<br><strong style="color:#047857;">RESULT: PING SUCCESSFUL!</strong>` : `<br><strong style="color:#991b1b;">RESULT: PING FAILED.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

function runSshTest() {
    let SW = network.Switch0; let pass = true; let output = `<b>Testing SSH to Switch0</b><br>`;
    if (SW.hostname !== 'Switch0') output += logMsg(`Hostname changed to ${SW.hostname}.`, true); else { output += logMsg(`Hostname not configured.`); pass = false; }
    if (SW.domainName === 'ccs.xu.local') output += logMsg(`Domain name is ccs.xu.local.`, true); else { output += logMsg(`Domain name missing or wrong.`); pass = false; }
    if (SW.cryptoKey) output += logMsg(`RSA Crypto keys generated.`, true); else { output += logMsg(`Crypto keys missing.`); pass = false; }
    if (SW.users['sshadmin'] === 'sshpass') output += logMsg(`Local user sshadmin configured.`, true); else { output += logMsg(`Missing user 'sshadmin'.`); pass = false; }
    if (SW.vtyLoginLocal && SW.vtyTransportSsh) output += logMsg(`VTY lines configured for SSH.`, true); else { output += logMsg(`VTY lines misconfigured.`); pass = false; }
    
    output += pass ? `<br><strong style="color:#047857;">RESULT: SSH SUCCESSFUL!</strong>` : `<br><strong style="color:#991b1b;">RESULT: SSH FAILED.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

function runSecurityTest() {
    let R0 = network.Router0; let SW0 = network.Switch0; let pass = true; let output = `<b>Checking Basic Security</b><br>`;
    if (R0.enableSecret === 'myclass' && SW0.enableSecret === 'myclass') output += logMsg(`Enable secret 'myclass' verified.`, true); else { output += logMsg(`Missing enable secret.`); pass = false; }
    if (R0.consolePass === 'mycisco' && R0.consoleLogin) output += logMsg(`Console password verified.`, true); else { output += logMsg(`Missing console password/login.`); pass = false; }
    if (R0.servicePassEnc && SW0.servicePassEnc) output += logMsg(`Service password-encryption verified.`, true); else { output += logMsg(`Missing password-encryption.`); pass = false; }
    output += pass ? `<br><strong style="color:#047857;">RESULT: SECURITY PASSED!</strong>` : `<br><strong style="color:#991b1b;">RESULT: SECURITY FAILED.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

// THE NEW MODULE 11 TEST ENGINE!
function runMod11Test() {
    let SW0 = network.Switch0; let pass = true; let output = `<b>Checking Module 11: Switch Security (Switch0)</b><br>`;

    // 1. Trunk Security
    let t = SW0.interfaces['g0/1'] || {};
    if (t.dtp === false) output += logMsg(`DTP negotiation disabled on Trunk (nonegotiate).`, true); else { output += logMsg(`DTP is still on for g0/1. Use 'switchport nonegotiate'.`); pass = false; }
    if (t.nativeVlan === 100 || t.nativeVlan === 333) output += logMsg(`Native VLAN securely changed to ${t.nativeVlan}.`, true); else { output += logMsg(`Native VLAN is still 1 on g0/1. Change it!`); pass = false; }

    // 2. Unused Ports (checking f0/24 as an example)
    let unused = SW0.interfaces['f0/24'];
    if (unused && unused.shutdown && (unused.accessVlan === 999 || unused.accessVlan === 99)) output += logMsg(`Unused ports (e.g. f0/24) are shut down and moved to BlackHole VLAN.`, true); else { output += logMsg(`Unused ports are not secured. Use 'interface range' to shut them and assign to VLAN 999.`); pass = false; }

    // 3. Port Security (checking f0/1)
    let p = SW0.interfaces['f0/1'] || {};
    if (p.portSecurity) output += logMsg(`Port Security enabled on f0/1.`, true); else { output += logMsg(`Port Security missing on access port f0/1.`); pass = false; }
    if (p.psMax > 1) output += logMsg(`Port Security Maximum MAC set to ${p.psMax}.`, true); else { output += logMsg(`Port Security Max MACs not set (default 1).`); pass = false; }
    if (p.psSticky) output += logMsg(`Port Security Sticky MAC enabled.`, true); else { output += logMsg(`Port Security sticky missing.`); pass = false; }
    if (p.psViolation === 'restrict' || p.psViolation === 'protect') output += logMsg(`Violation mode set to ${p.psViolation}.`, true); else { output += logMsg(`Violation mode not set properly (Default is shutdown).`); pass = false; }

    // 4. DHCP Snooping
    if (SW0.dhcpSnooping) output += logMsg(`DHCP Snooping enabled globally.`, true); else { output += logMsg(`DHCP Snooping is disabled globally.`); pass = false; }
    if (t.dhcpTrust) output += logMsg(`Trunk port g0/1 configured as DHCP Trust.`, true); else { output += logMsg(`Trunk port g0/1 is NOT trusted. DHCP will fail.`); pass = false; }
    if (p.dhcpLimit > 0) output += logMsg(`Access port f0/1 rate limited to ${p.dhcpLimit} pps.`, true); else { output += logMsg(`Access port f0/1 is not rate limited for DHCP.`); pass = false; }

    // 5. STP Features
    if (p.portfast) output += logMsg(`PortFast enabled on f0/1.`, true); else { output += logMsg(`PortFast missing on f0/1.`); pass = false; }
    if (p.bpduguard) output += logMsg(`BPDU Guard enabled on f0/1.`, true); else { output += logMsg(`BPDU Guard missing on f0/1.`); pass = false; }

    output += pass ? `<br><strong style="color:#047857;">RESULT: MODULE 11 LAB PERFECT! YOU ARE A HACKER'S WORST NIGHTMARE!</strong>` : `<br><strong style="color:#991b1b;">RESULT: SECURITY VULNERABILITIES DETECTED. Fix the red errors.</strong>`;
    diagOutput.innerHTML = output; diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

document.getElementById('test-ccs').addEventListener('click', () => runPingTest('PC0', 'PC1', 'Switch0', 100, 101, 'g0/0', 'g0/1', 'f0/1', 'f0/2'));
document.getElementById('test-engg').addEventListener('click', () => runPingTest('PC3', 'PC2', 'Switch1', 200, 201, 'g0/1', 'g0/1', 'f0/1', 'f0/2'));
document.getElementById('test-ssh').addEventListener('click', runSshTest);
document.getElementById('test-security').addEventListener('click', runSecurityTest);
document.getElementById('test-mod11').addEventListener('click', runMod11Test);