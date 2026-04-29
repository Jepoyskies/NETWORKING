// --- VIRTUAL IOS DEVICE TEMPLATE ---
const createDevice = (name, type) => ({
    name: name,
    type: type,
    hostname: name,
    mode: 'LOGGED_OUT', // States: LOGGED_OUT, >, #, config, config-if, config-line, config-vlan, config-dhcp
    awaitingPass: false, // 'console' or 'enable'
    
    // Security Configs
    enableSecret: null,
    consolePass: null,
    consoleLogin: false,
    vtyPass: null,
    vtyLoginLocal: false,
    vtyTransportSsh: false,
    servicePassEnc: false,
    domainName: null,
    cryptoKey: false,
    users: {}, // local username/password database
    
    // Network Configs
    vlans:[],
    interfaces: {}, // e.g., 'g0/0': { shutdown: false, mode: 'access', vlan: 1, ip: null }
    subinterfaces: {}, // e.g., 'g0/0.100': { encap: 100, ip: '172.16.1.1' }
    dhcpPools: {}, // e.g., 'IT_DEPT': { network: '172.16.1.0', router: '172.16.1.1' }
    defaultGateway: null,
    
    // CLI Context
    currentContext: null // remembers which int/line/pool you are editing
});

const network = {
    Router0: createDevice('Router0', 'router'),
    Switch0: createDevice('Switch0', 'switch'),
    Switch1: createDevice('Switch1', 'switch')
};

// Initialize physical interfaces
['g0/0', 'g0/1'].forEach(i => network.Router0.interfaces[i] = { shutdown: true });['g0/1', 'f0/1', 'f0/2', 'f0/3'].forEach(i => {
    network.Switch0.interfaces[i] = { shutdown: false, mode: 'dynamic', vlan: 1 };
    network.Switch1.interfaces[i] = { shutdown: false, mode: 'dynamic', vlan: 1 };
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

// --- PROMPT RENDERER ---
function updatePrompt() {
    let dev = network[currentDevice];
    let p = '';
    
    inputField.type = 'text'; // default
    
    if (dev.awaitingPass) {
        p = 'Password: ';
        inputField.type = 'password'; // MASK TYPING
    } else if (dev.mode === 'LOGGED_OUT') {
        p = ''; // Blank until enter is pressed
    } else if (dev.mode === '>') {
        p = `${dev.hostname}>`;
    } else if (dev.mode === '#') {
        p = `${dev.hostname}#`;
    } else if (dev.mode === 'config') {
        p = `${dev.hostname}(config)#`;
    } else if (dev.mode === 'config-if') {
        p = `${dev.hostname}(config-if)#`;
    } else if (dev.mode === 'config-vlan') {
        p = `${dev.hostname}(config-vlan)#`;
    } else if (dev.mode === 'config-line') {
        p = `${dev.hostname}(config-line)#`;
    } else if (dev.mode === 'config-dhcp') {
        p = `${dev.hostname}(dhcp-config)#`;
    }
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
        
        // Print what the user typed (mask if it's a password)
        if (network[currentDevice].awaitingPass) {
            printLine(`${promptSpan.innerText}`);
        } else {
            printLine(`${promptSpan.innerText}${cmdRaw}`);
        }
        
        this.value = '';
        processCommand(cmd);
        updatePrompt();
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
});

function processCommand(cmd) {
    let dev = network[currentDevice];

    // --- 1. HANDLE LOGGED OUT STATE ---
    if (dev.mode === 'LOGGED_OUT') {
        if (dev.consolePass && dev.consoleLogin) {
            dev.awaitingPass = 'console';
            printLine("User Access Verification");
        } else {
            dev.mode = '>';
        }
        return;
    }

    // --- 2. HANDLE PASSWORDS ---
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

    // --- 3. GLOBAL NAVIGATION (EXIT, END, ENABLE, DISABLE) ---
    if (cmd === '') return;
    
    if (cmd === 'enable' || cmd === 'en') {
        if (dev.enableSecret) dev.awaitingPass = 'enable';
        else dev.mode = '#';
        return;
    }
    if (cmd === 'disable') { dev.mode = '>'; return; }
    if (cmd === 'configure terminal' || cmd === 'conf t') {
        if (dev.mode === '#') dev.mode = 'config';
        else printLine("% Invalid input detected");
        return;
    }
    if (cmd === 'end') {
        if (dev.mode.startsWith('config')) dev.mode = '#';
        return;
    }
    if (cmd === 'exit') {
        if (dev.mode === '>') { dev.mode = 'LOGGED_OUT'; printLine(`${dev.hostname} con0 is now available\nPress RETURN to get started.`); }
        else if (dev.mode === '#') { dev.mode = '>'; }
        else if (dev.mode === 'config') { dev.mode = '#'; }
        else if (dev.mode.startsWith('config-')) { dev.mode = 'config'; }
        return;
    }

    // --- 4. GLOBAL CONFIG COMMANDS ---
    if (dev.mode === 'config') {
        if (cmd.startsWith('hostname ')) { dev.hostname = cmd.split(' ')[1] || dev.hostname; return; }
        if (cmd.startsWith('enable secret ')) { dev.enableSecret = cmd.split(' ')[2]; return; }
        if (cmd === 'service password-encryption') { dev.servicePassEnc = true; return; }
        if (cmd.startsWith('ip domain-name ')) { dev.domainName = cmd.split(' ')[2]; return; }
        if (cmd === 'crypto key generate rsa') { dev.cryptoKey = true; printLine("OK - Generating RSA keys... Done."); return; }
        if (cmd.startsWith('username ') && (cmd.includes(' password ') || cmd.includes(' secret '))) {
            let parts = cmd.split(' ');
            dev.users[parts[1]] = parts[3]; // rough parse
            return;
        }
        if (cmd.startsWith('ip default-gateway ')) { dev.defaultGateway = cmd.split(' ')[2]; return; }
        
        // Enter Interface Mode
        if (cmd.startsWith('int ') || cmd.startsWith('interface ')) {
            let intName = cmd.split(' ')[1].replace('gigabitethernet', 'g').replace('fastethernet', 'f');
            dev.currentContext = intName;
            
            // Subinterface creation logic for routers
            if (intName.includes('.') && dev.type === 'router') {
                if (!dev.subinterfaces[intName]) dev.subinterfaces[intName] = { encap: null, ip: null };
            }
            dev.mode = 'config-if'; return;
        }

        // Enter Line Mode
        if (cmd.startsWith('line console ')) { dev.currentContext = 'console'; dev.mode = 'config-line'; return; }
        if (cmd.startsWith('line vty ')) { dev.currentContext = 'vty'; dev.mode = 'config-line'; return; }

        // Enter VLAN Mode (Switch)
        if (cmd.startsWith('vlan ') && dev.type === 'switch') {
            let vid = parseInt(cmd.split(' ')[1]);
            if (!dev.vlans.includes(vid)) dev.vlans.push(vid);
            dev.mode = 'config-vlan'; return;
        }

        // Enter DHCP Mode (Router)
        if (cmd.startsWith('ip dhcp pool ') && dev.type === 'router') {
            dev.currentContext = cmd.split(' ')[3];
            if (!dev.dhcpPools[dev.currentContext]) dev.dhcpPools[dev.currentContext] = { network: null, router: null };
            dev.mode = 'config-dhcp'; return;
        }
    }

    // --- 5. INTERFACE CONFIG MODE ---
    if (dev.mode === 'config-if') {
        let int = dev.currentContext;
        if (cmd === 'shutdown' || cmd === 'shut') {
            if (dev.interfaces[int]) dev.interfaces[int].shutdown = true;
            return;
        }
        if (cmd === 'no shutdown' || cmd === 'no shut') {
            if (dev.interfaces[int]) dev.interfaces[int].shutdown = false;
            return;
        }
        if (cmd.startsWith('ip address ') || cmd.startsWith('ip add ')) {
            let parts = cmd.split(' ');
            let ip = parts[2] || parts[1]; // handle ip add vs ip address
            if (int.includes('.')) dev.subinterfaces[int].ip = ip; // Router subint
            else if (int.startsWith('vlan')) dev.interfaces[int] = { ip: ip, shutdown: false }; // Switch SVI
            return;
        }
        if (cmd.startsWith('encapsulation dot1q ') && dev.type === 'router') {
            dev.subinterfaces[int].encap = parseInt(cmd.split(' ')[2]);
            return;
        }
        if (cmd === 'switchport mode access' && dev.type === 'switch') { dev.interfaces[int].mode = 'access'; return; }
        if (cmd === 'switchport mode trunk' && dev.type === 'switch') { dev.interfaces[int].mode = 'trunk'; return; }
        if (cmd.startsWith('switchport access vlan ') && dev.type === 'switch') {
            dev.interfaces[int].vlan = parseInt(cmd.split(' ')[3]);
            return;
        }
    }

    // --- 6. LINE CONFIG MODE ---
    if (dev.mode === 'config-line') {
        if (cmd.startsWith('password ')) {
            let pass = cmd.split(' ')[1];
            if (dev.currentContext === 'console') dev.consolePass = pass;
            if (dev.currentContext === 'vty') dev.vtyPass = pass;
            return;
        }
        if (cmd === 'login') {
            if (dev.currentContext === 'console') dev.consoleLogin = true;
            return;
        }
        if (cmd === 'login local' && dev.currentContext === 'vty') { dev.vtyLoginLocal = true; return; }
        if (cmd === 'transport input ssh' && dev.currentContext === 'vty') { dev.vtyTransportSsh = true; return; }
    }

    // --- 7. DHCP CONFIG MODE ---
    if (dev.mode === 'config-dhcp') {
        let pool = dev.currentContext;
        if (cmd.startsWith('network ')) { dev.dhcpPools[pool].network = cmd.split(' ')[1]; return; }
        if (cmd.startsWith('default-router ')) { dev.dhcpPools[pool].router = cmd.split(' ')[1]; return; }
    }

    // --- 8. VLAN CONFIG MODE ---
    if (dev.mode === 'config-vlan') {
        if (cmd.startsWith('name ')) return; // We allow it but don't strictly grade it
    }

    printLine(`% Invalid input detected at '^' marker.`);
}


// --- 💻 DIAGNOSTIC TESTING ENGINE ---

function logMsg(msg, isSuccess = false) {
    return `<div style="margin-bottom: 5px; color: ${isSuccess ? '#047857' : '#991b1b'}">${isSuccess ? '✅' : '❌'} ${msg}</div>`;
}

// TEST 1 & 2: Ping tests (Includes Router-on-a-stick)
function runPingTest(sourcePC, destPC, swName, v1, v2, rPort, swPort, pc1Port, pc2Port) {
    let R0 = network.Router0;
    let SW = network[swName];
    let output = `<b>Testing Ping: ${sourcePC} to ${destPC}</b><br>`;
    let pass = true;

    // Check Switch Trunks
    if (SW.interfaces[swPort] && SW.interfaces[swPort].mode === 'trunk') output += logMsg(`Switch ${swPort} is a Trunk.`, true);
    else { output += logMsg(`Switch ${swPort} is NOT a Trunk. (Use 'switchport mode trunk')`); pass = false; }

    // Check Access Ports
    if (SW.interfaces[pc1Port] && SW.interfaces[pc1Port].mode === 'access' && SW.interfaces[pc1Port].vlan === v1) output += logMsg(`Switch ${pc1Port} assigned to VLAN ${v1}.`, true);
    else { output += logMsg(`Switch ${pc1Port} is NOT assigned to VLAN ${v1}.`); pass = false; }

    if (SW.interfaces[pc2Port] && SW.interfaces[pc2Port].mode === 'access' && SW.interfaces[pc2Port].vlan === v2) output += logMsg(`Switch ${pc2Port} assigned to VLAN ${v2}.`, true);
    else { output += logMsg(`Switch ${pc2Port} is NOT assigned to VLAN ${v2}.`); pass = false; }

    // Check Router Port & Subinterfaces
    if (R0.interfaces[rPort] && !R0.interfaces[rPort].shutdown) output += logMsg(`Router physical port ${rPort} is UP.`, true);
    else { output += logMsg(`Router physical port ${rPort} is SHUTDOWN. (Use 'no shut')`); pass = false; }

    let sub1 = `${rPort}.${v1}`, sub2 = `${rPort}.${v2}`;
    
    if (R0.subinterfaces[sub1] && R0.subinterfaces[sub1].encap === v1 && R0.subinterfaces[sub1].ip) output += logMsg(`Router subinterface ${sub1} is configured with IP and dot1Q ${v1}.`, true);
    else { output += logMsg(`Router subinterface ${sub1} is missing IP or encapsulation.`); pass = false; }

    if (R0.subinterfaces[sub2] && R0.subinterfaces[sub2].encap === v2 && R0.subinterfaces[sub2].ip) output += logMsg(`Router subinterface ${sub2} is configured with IP and dot1Q ${v2}.`, true);
    else { output += logMsg(`Router subinterface ${sub2} is missing IP or encapsulation.`); pass = false; }

    if (pass) output += `<br><strong style="color:#047857;">RESULT: PING SUCCESSFUL! Inter-VLAN Routing works!</strong>`;
    else output += `<br><strong style="color:#991b1b;">RESULT: PING FAILED. Fix the red errors above.</strong>`;
    
    diagOutput.innerHTML = output;
    diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

// TEST 3: SSH Test
function runSshTest() {
    let SW = network.Switch0;
    let output = `<b>Testing SSH to Switch0 (CCS)</b><br>`;
    let pass = true;

    if (SW.hostname !== 'Switch0') output += logMsg(`Hostname changed to ${SW.hostname}.`, true);
    else { output += logMsg(`Hostname not configured. Key generation requires a custom hostname.`); pass = false; }

    if (SW.domainName) output += logMsg(`Domain name configured (${SW.domainName}).`, true);
    else { output += logMsg(`Domain name missing. Use 'ip domain-name <name>'.`); pass = false; }

    if (SW.cryptoKey) output += logMsg(`RSA Crypto keys generated.`, true);
    else { output += logMsg(`Crypto keys missing. Use 'crypto key generate rsa'.`); pass = false; }

    if (Object.keys(SW.users).length > 0) output += logMsg(`Local user account configured.`, true);
    else { output += logMsg(`Missing local user. Use 'username <name> secret <pass>'.`); pass = false; }

    if (SW.vtyLoginLocal && SW.vtyTransportSsh) output += logMsg(`VTY lines configured for local SSH.`, true);
    else { output += logMsg(`VTY lines misconfigured. Require 'login local' and 'transport input ssh'.`); pass = false; }

    if (pass) output += `<br><strong style="color:#047857;">RESULT: SSH CONNECTION SUCCESSFUL!</strong>`;
    else output += `<br><strong style="color:#991b1b;">RESULT: SSH CONNECTION REFUSED. Fix the red errors above.</strong>`;
    
    diagOutput.innerHTML = output;
    diagOutput.className = pass ? 'diag-success' : 'diag-error';
}

// TEST 4: DHCP Test
function runDhcpTest() {
    let R0 = network.Router0;
    let output = `<b>Testing DHCP IP Allocation for all PCs</b><br>`;
    let pass = true;

    // Helper function to check if a specific VLAN got DHCP
    const checkDhcpForVlan = (vlanId, port, pcName) => {
        let subInt = `${port}.${vlanId}`;
        let routerIp = (R0.subinterfaces[subInt] || {}).ip;
        
        if (!routerIp) {
            output += logMsg(`${pcName} (VLAN ${vlanId}): Failed. Router subinterface ${subInt} is missing an IP.`, false);
            pass = false;
            return;
        }

        // Find a DHCP pool that has a default-router matching the subinterface IP
        let pool = Object.values(R0.dhcpPools).find(p => p.router === routerIp);
        
        if (pool && pool.network) {
            output += logMsg(`${pcName} (VLAN ${vlanId}): Success! Obtained IP via DHCP pool (Gateway: ${routerIp}).`, true);
        } else {
            output += logMsg(`${pcName} (VLAN ${vlanId}): Failed. Missing 'ip dhcp pool' or 'default-router ${routerIp}'.`, false);
            pass = false;
        }
    };

    // Check CCS PCs (VLAN 100 & 101 on g0/0)
    checkDhcpForVlan(100, 'g0/0', 'PC0');
    checkDhcpForVlan(101, 'g0/0', 'PC1');
    
    // Check ENGG PCs (VLAN 200 & 201 on g0/1)
    checkDhcpForVlan(200, 'g0/1', 'PC2'); 
    checkDhcpForVlan(201, 'g0/1', 'PC3');

    if (pass) output += `<br><strong style="color:#047857;">RESULT: DHCP VERIFICATION SUCCESSFUL! All PCs have IPs.</strong>`;
    else output += `<br><strong style="color:#991b1b;">RESULT: DHCP VERIFICATION FAILED. Fix the red errors above.</strong>`;
    
    diagOutput.innerHTML = output;
    diagOutput.className = pass ? 'diag-success' : 'diag-error';
}


// --- BUTTON LISTENERS ---
// Make sure you updated index.html to have these button IDs!
document.getElementById('btn-test-1').addEventListener('click', () => runPingTest('PC0', 'PC1', 'Switch0', 100, 101, 'g0/0', 'g0/1', 'f0/1', 'f0/2'));
document.getElementById('btn-test-2').addEventListener('click', () => runPingTest('PC2', 'PC3', 'Switch1', 200, 201, 'g0/1', 'g0/1', 'f0/1', 'f0/2'));
document.getElementById('btn-test-3').addEventListener('click', runSshTest);
document.getElementById('btn-test-4').addEventListener('click', runDhcpTest);