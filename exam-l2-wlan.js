document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. INJECT CUSTOM CSS FOR INTERACTIVE UI & NAV
    // ==========================================
    const style = document.createElement('style');
    style.innerHTML = `
        /* Dictionary & Links CSS */
        .term { text-decoration: none; border-bottom: 2px dashed #38bdf8; padding-bottom: 2px; cursor: pointer; color: #38bdf8; font-weight: bold; transition: 0.2s; }
        .term:hover { color: #7dd3fc; border-bottom-color: #7dd3fc; background: rgba(56,189,248,0.1); border-radius: 3px; }
        #dict-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 998; opacity: 0; pointer-events: none; transition: 0.3s ease; }
        #dict-overlay.active { opacity: 1; pointer-events: all; }
        #dict-panel { position: fixed; top: 0; right: -400px; width: 350px; height: 100vh; background: #0f172a; box-shadow: -5px 0 25px rgba(0,0,0,0.8); z-index: 999; transition: right 0.3s ease; padding: 20px; color: white; display: flex; flex-direction: column; overflow-y: auto;}
        #dict-panel.active { right: 0; }
        #dict-close { align-self: flex-end; font-size: 28px; cursor: pointer; color: #94a3b8; border: none; background: transparent; transition: 0.2s;}
        #dict-close:hover { color: #ef4444; transform: scale(1.1);}
        #dict-panel h2 { font-size: 1.1rem; border-bottom: 1px solid #334155; padding-bottom: 10px; margin-bottom: 20px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;}
        #dict-title { font-size: 1.8rem; color: #38bdf8; margin-bottom: 15px; }
        .dict-content-box { background: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; font-size: 1rem; line-height: 1.6; color: #cbd5e1; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);}

        /* Quiz Buttons & Hints CSS */
        .hint-box { background: rgba(56, 189, 248, 0.1); border-left: 4px solid #38bdf8; padding: 15px; margin: 15px 0; border-radius: 4px; color: #e0f2fe; display: none; line-height: 1.5; font-size: 0.95rem; }
        .action-container { display: flex; gap: 15px; margin-top: 15px; }
        .lock-btn, .next-btn, .finish-btn { padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .lock-btn { background: #38bdf8; color: #0f172a; }
        .lock-btn:hover:not(:disabled) { background: #7dd3fc; transform: translateY(-2px); }
        .lock-btn:disabled { background: #475569; color: #94a3b8; cursor: not-allowed; box-shadow: none; transform: none;}
        .next-btn { background: #4ade80; color: #0f172a; display: none; }
        .next-btn:hover { background: #86efac; transform: translateY(-2px); }
        .finish-btn { background: #f59e0b; color: #0f172a; display: none; }
        .finish-btn:hover { background: #fbbf24; transform: translateY(-2px); }

        /* Top Navigation Bar CSS */
        #nav-wrapper { display: flex; align-items: center; margin-bottom: 20px; background: #1e293b; padding: 10px; border-radius: 8px; border: 1px solid #334155; }
        #question-nav-container { display: flex; overflow-x: auto; scroll-behavior: smooth; gap: 8px; padding: 5px; flex-grow: 1; scrollbar-width: none; }
        #question-nav-container::-webkit-scrollbar { display: none; }
        .nav-arrow { background: none; border: none; color: #38bdf8; font-size: 24px; cursor: pointer; padding: 0 10px; font-weight: bold; }
        .nav-arrow:hover { color: #7dd3fc; transform: scale(1.2); }
        .nav-btn { background: #334155; color: #cbd5e1; border: 2px solid transparent; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; white-space: nowrap; transition: 0.2s; }
        .nav-btn:hover { background: #475569; }
        .nav-btn.active { border-color: #38bdf8; background: #0ea5e9; color: white; transform: scale(1.05); }
        .nav-btn.locked-correct { background: rgba(74, 222, 128, 0.2); border-color: #4ade80; color: #4ade80; }
        .nav-btn.locked-incorrect { background: rgba(248, 113, 113, 0.2); border-color: #f87171; color: #f87171; }
    `;
    document.head.appendChild(style);

    // ==========================================
    // 2. MASSIVE REFRESHER DICTIONARY (UPDATED WITH MOD 8, 9, 10)
    // ==========================================
    const termDictionary = {
        // --- IPv6, SLAAC, DHCPv6 (Mod 8) ---
        "ipv4": "Internet Protocol version 4. Uses 32-bit addresses (e.g. 192.168.1.1).",
        "ipv6": "Internet Protocol version 6. Uses 128-bit hexadecimal addresses.",
        "icmpv6": "Internet Control Message Protocol for IPv6. Used for Neighbor Discovery, DAD, and Router Advertisements.",
        "slaac": "Stateless Address Autoconfiguration. Clients create their own IP using the router prefix.",
        "dhcpv6": "Dynamic Host Configuration Protocol for IPv6.",
        "stateless": "A method (like SLAAC) where no server keeps a database tracking which client has which IP address.",
        "stateful": "A method where a DHCP server maintains a strict database of assigned IPs.",
        "dad": "Duplicate Address Detection. A process where a host checks if its newly generated IPv6 address is already in use.",
        "ra": "Router Advertisement. An ICMPv6 message sent by routers carrying network prefixes, gateways, and M/O flags.",
        "rs": "Router Solicitation. An ICMPv6 message sent by a booting host to immediately discover routers.",
        "eui-64": "A method where a host creates its 64-bit interface ID by taking its MAC address and inserting 'fffe' in the middle.",
        "link-local": "An IPv6 address used only within the same local network segment (starts with fe80::).",
        "m-flag": "Managed Address Flag. In an RA, tells the client to use a Stateful DHCPv6 server for its IP.",
        "o-flag": "Other Configuration Flag. In an RA, tells the client to get IP via SLAAC, but ask DHCPv6 for DNS.",
        "dhcp relay": "A router configured to forward DHCP requests across subnets to a remote DHCP server.",
        "unicast-routing": "The global command required to enable IPv6 routing and RA messages on a Cisco router.",
        "dhcpdiscover": "The initial broadcast message sent by an IPv4 client searching for a DHCP server.",
        
        // --- FHRP, HSRP, VRRP, GLBP (Mod 9) ---
        "fhrp": "First Hop Redundancy Protocol. A category of protocols that provide default gateway redundancy.",
        "hsrp": "Hot Standby Router Protocol. A Cisco-proprietary FHRP that uses an Active/Standby router model.",
        "vrrp": "Virtual Router Redundancy Protocol. An open-standard IEEE FHRP identical to HSRP, but works on any vendor's hardware.",
        "vrrpv2": "Virtual Router Redundancy Protocol version 2. Supports IPv4 only.",
        "vrrpv3": "Virtual Router Redundancy Protocol version 3. Supports both IPv4 and IPv6.",
        "glbp": "Gateway Load Balancing Protocol. A Cisco-proprietary FHRP that natively load-balances traffic across multiple active routers.",
        "slb": "Server Load Balancing. Distributes client requests across multiple backend servers.",
        "virtual ip": "A phantom IP address shared by multiple physical routers in an FHRP group. PCs use this as their Default Gateway.",
        "virtual mac": "A phantom MAC address generated by an FHRP so switches know where to send frames for the Virtual IP.",
        "virtual router": "The illusionary router created by combining multiple physical routers in an FHRP group.",
        "active router": "The router in an HSRP group that is currently forwarding traffic for the network.",
        "standby router": "The backup router in an HSRP group that waits silently. It takes over if the Active router crashes.",
        "priority": "A number (0-255) determining which router becomes Active. Default is 100. Highest priority wins.",
        "preempt": "A command that allows a router with a higher priority to violently seize the Active role from a lower-priority router.",
        "pvst": "Per-VLAN Spanning Tree. Cisco's version of STP that runs a separate spanning tree instance for every VLAN.",
        "rstp": "Rapid Spanning Tree Protocol. A faster-converging version of STP.",

        // --- LAN Security (Mod 10 & 11) ---
        "layer 2": "The Data Link layer of the OSI model. Deals with MAC addresses and switching. Historically the weakest security link.",
        "layer 3": "The Network layer of the OSI model. Deals with IP addresses and routing.",
        "layer 4": "The Transport layer of the OSI model. Deals with TCP/UDP ports.",
        "layer 7": "The Application layer of the OSI model.",
        "aaa": "Authentication, Authorization, and Accounting. Framework for controlling network access and tracking user activity.",
        "radius": "Remote Authentication Dial-In User Service. An open standard AAA protocol that encrypts ONLY the password payload. Uses UDP.",
        "tacacs+": "Terminal Access Controller Access-Control System Plus. A Cisco proprietary AAA protocol that encrypts the ENTIRE payload. Uses TCP.",
        "802.1x": "IEEE standard for Port-based Network Access Control. Authenticates users via RADIUS before granting physical switch port access.",
        "supplicant": "The 802.1X term for the client device (laptop/phone) requesting access.",
        "authenticator": "The 802.1X term for the switch or AP blocking access until authenticated.",
        "authentication server": "The 802.1X term for the backend RADIUS/AAA server verifying credentials.",
        "ssh": "Secure Shell. Encrypted protocol for remote CLI management. Replaces Telnet.",
        "telnet": "Unencrypted remote CLI management protocol. Very insecure because it sends data in plaintext.",
        "http": "Hypertext Transfer Protocol. Unencrypted web traffic.",
        "ftp": "File Transfer Protocol. Unencrypted file transfer protocol.",
        "vty": "Virtual Teletype. The virtual lines configured on a Cisco device to allow SSH/Telnet access.",
        "cdp": "Cisco Discovery Protocol. Shares device info with neighbors. Dangerous if enabled on user-facing ports.",
        "lldp": "Link Layer Discovery Protocol. The open-standard equivalent of CDP.",
        "vtp": "VLAN Trunking Protocol. A Cisco-proprietary protocol that syncs VLAN creation across switches.",
        "mac flooding": "An attack sending fake MACs to exhaust the switch MAC table, causing it to flood all traffic.",
        "mac address overflow": "Another term for MAC flooding. Fills the switch's CAM table to force a fail-open state.",
        "cam table": "Content Addressable Memory table. The switch's memory that maps MAC addresses to physical ports.",
        "port security": "A switch feature limiting the number and identity of MAC addresses allowed on a port.",
        "err-disabled": "A state where a switch OS forcibly shuts down a port due to a severe security violation.",
        "violation modes": "Port Security actions: Shutdown (kills port), Restrict (drops & logs), Protect (drops silently).",
        "sticky mac": "Port security feature that learns a MAC dynamically and saves it permanently to the running-config.",
        "dhcp starvation": "Attack exhausting a DHCP server's IP pool using spoofed MAC addresses.",
        "dhcp spoofing": "A Man-In-The-Middle attack where a rogue DHCP server hands out fake default gateways/DNS.",
        "dhcp snooping": "Security feature blocking rogue DHCP servers and limiting DHCP request rates on untrusted ports.",
        "dai": "Dynamic ARP Inspection. Blocks ARP spoofing by validating ARP packets against the DHCP snooping database.",
        "ipsg": "IP Source Guard. Prevents IP spoofing by verifying the source IP against the DHCP snooping database.",
        "arp spoofing": "An attack where a hacker sends fake ARP replies to associate their MAC address with another device's IP address.",
        "arp poisoning": "Another term for ARP Spoofing. Falsifying ARP messages to intercept traffic.",
        "dos attack": "Denial of Service attack. Flooding a network or device to make it unusable for legitimate users.",
        "vlan hopping": "An attack tricking a switch into granting access to an unauthorized VLAN (Switch Spoofing or Double Tagging).",
        "dtp": "Dynamic Trunking Protocol. Auto-negotiates trunks. Should be disabled (switchport nonegotiate) to prevent VLAN hopping.",
        "native vlan": "An untagged VLAN on an 802.1Q trunk. Vulnerable to Double-Tagging attacks if left as default.",
        "802.1q": "The IEEE standard for VLAN tagging over trunk links.",
        "trunk": "A point-to-point link carrying traffic for multiple VLANs.",
        "access port": "A switch port assigned to a single VLAN, connected to an end-user device.",
        "stp": "Spanning Tree Protocol. Prevents Layer 2 broadcast storms by blocking redundant physical loops.",
        "bpdu": "Bridge Protocol Data Unit. Messages sent between switches to map out the STP topology.",
        "portfast": "Bypasses STP listening/learning states on edge ports connected to end-user PCs.",
        "bpdu guard": "Instantly err-disables a PortFast port if it receives a BPDU (switch message).",
        "root guard": "Prevents unauthorized switches from becoming the STP Root Bridge.",
        "nac appliance": "Network Admission Control. An endpoint security device that checks a PC's antivirus posture before letting it on the network.",
        "vpn": "Virtual Private Network. Creates a secure, encrypted tunnel over the public internet.",
        "ipsec": "Internet Protocol Security. A suite of protocols used to encrypt and secure VPN tunnels.",
        "dmz": "Demilitarized Zone. A subnetwork exposed to the internet, separated from the internal secure LAN.",
        "pppoe": "Point-to-Point Protocol over Ethernet. Commonly used by DSL internet providers.",
        
        // --- WLAN Concepts (Mod 12 & 13) ---
        "wlan": "Wireless Local Area Network. Wi-Fi network covering a building.",
        "wman": "Wireless Metropolitan Area Network. Covers a city/district.",
        "wwan": "Wireless Wide Area Network. Covers countries/regions (cellular/satellite).",
        "wpan": "Wireless Personal Area Network. Very short range (Bluetooth/ZigBee).",
        "ssid": "Service Set Identifier. The name of the Wi-Fi network.",
        "ssid cloaking": "Hiding the SSID so the AP does not broadcast its name.",
        "passive mode": "When an AP openly broadcasts Beacons, and clients passively listen to discover it.",
        "active mode": "When an AP hides its SSID, forcing clients to actively send Probe Requests.",
        "beacon": "A management frame broadcasted regularly by an AP to announce its presence.",
        "probe request": "A frame sent by a client device searching for a specific Wi-Fi network.",
        "wep": "Wired Equivalent Privacy. Extremely weak, obsolete Wi-Fi encryption.",
        "wpa": "Wi-Fi Protected Access. An older wireless security protocol that used TKIP.",
        "wpa2": "Wi-Fi Protected Access 2. Uses strong AES encryption.",
        "wpa3": "The latest Wi-Fi security standard. Defends against brute-force dictionary attacks.",
        "psk": "Pre-Shared Key. A single Wi-Fi password shared by everyone.",
        "aes": "Advanced Encryption Standard. The highly secure encryption cipher used by WPA2.",
        "tkip": "Temporal Key Integrity Protocol. Older, vulnerable encryption used in WPA. Replaced by AES.",
        "wlc": "Wireless LAN Controller. Centralized brain managing multiple Access Points.",
        "capwap": "Protocol used to tunnel control data and user traffic between a WLC and an AP.",
        "dtls": "Datagram Transport Layer Security. Encrypts the CAPWAP control tunnel.",
        "infrastructure mode": "WLAN topology where clients connect to a central AP, which connects to wired network.",
        "ad hoc": "A peer-to-peer wireless network with no router or AP involved.",
        "hotspot": "A small wireless access point, usually created by a smartphone sharing its cellular data.",
        "ess": "Extended Service Set. Multiple APs connected together broadcasting the same SSID.",
        "bss": "Basic Service Set. A single AP and its connected clients.",
        "ibiss": "Independent Basic Service Set. Another term for an Ad Hoc (peer-to-peer) network.",
        "mimo": "Multiple-Input Multiple-Output. Using multiple antennas to transmit/receive faster.",
        
        // --- General Networking ---
        "dhcp": "Dynamic Host Configuration Protocol. Automatically assigns IP addresses to devices on a network.",
        "dns": "Domain Name System. Translates human-readable domain names (like google.com) into IP addresses.",
        "mac address": "Media Access Control address. A unique 48-bit physical identifier burned into a network card.",
        "ip address": "Internet Protocol address. A unique numerical identifier for a device on a network.",
        "router": "A network device that forwards data packets between computer networks.",
        "nat": "Network Address Translation. Translates private unroutable IPs into public internet IPs.",
        "qos": "Quality of Service. Prioritizes critical network traffic (like voice/video) over standard data.",
        "default gateway": "The router interface IP address that provides an exit point for a PC to reach the Internet.",
        "plaintext": "Data sent over the network that is not encrypted, making it readable to anyone intercepting it.",
        "spoofing": "Falsifying an identity (like a fake MAC or IP address) to deceive a network into trusting the attacker.",
        "rogue": "An unauthorized device (like a rogue switch or rogue access point) plugged into the network without permission.",
        "nvram": "Non-Volatile RAM. Where a Cisco device permanently saves its startup-config file."
    };

    // ==========================================
    // 3. BULLETPROOF AUTO-HIGHLIGHTER
    // ==========================================
    const termsArray = Object.keys(termDictionary).sort((a, b) => b.length - a.length);

    function autoLinkTextNode(textNode) {
        let text = textNode.nodeValue;
        
        for (let term of termsArray) {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(^|[^a-zA-Z0-9_])(${escapedTerm})([^a-zA-Z0-9_]|$)`, 'i');
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

    const elementsToProcess = document.querySelectorAll('.question-text, .choice-item, .explanation-box p, .explanation-box li, .hint-box');
    elementsToProcess.forEach(el => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
        const textNodes =[];
        let node;
        while (node = walker.nextNode()) {
            if (node.parentNode.tagName === 'SPAN' && node.parentNode.classList.contains('term')) continue;
            textNodes.push(node);
        }
        textNodes.forEach(node => autoLinkTextNode(node));
    });

    // ==========================================
    // 4. DICTIONARY SIDE-PANEL LOGIC
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'dict-overlay';
    const panel = document.createElement('div');
    panel.id = 'dict-panel';
    panel.innerHTML = `<button id="dict-close">&times;</button><h2>Refresher Dictionary</h2><h3 id="dict-title">Term</h3><div class="dict-content-box" id="dict-desc"></div>`;
    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    const closeSidebar = () => { panel.classList.remove('active'); overlay.classList.remove('active'); };
    document.getElementById('dict-close').addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    const attachDictionaryListeners = () => {
        document.querySelectorAll('.term').forEach(term => {
            const newTerm = term.cloneNode(true);
            term.parentNode.replaceChild(newTerm, term);
            
            newTerm.addEventListener('click', (e) => {
                const termKey = e.target.getAttribute('data-term').toLowerCase();
                const dictEntry = termDictionary[termKey];
                
                document.getElementById('dict-title').innerText = e.target.innerText.toUpperCase();
                
                if (dictEntry) {
                    document.getElementById('dict-desc').innerHTML = `<strong>${e.target.innerText.toUpperCase()}</strong>: ${dictEntry}`;
                } else {
                    document.getElementById('dict-desc').innerHTML = `<strong>${e.target.innerText.toUpperCase()}</strong>: Keep studying to master this concept!`;
                }
                
                panel.classList.add('active');
                overlay.classList.add('active');
            });
        });
    };

    // ==========================================
    // 5. TOP NAVIGATION BAR & INTERACTIVE QUIZ
    // ==========================================
    const questions = document.querySelectorAll('.question-card');
    let currentIndex = 0;
    let globalScore = 0;

    const navWrapper = document.createElement('div');
    navWrapper.id = 'nav-wrapper';
    
    const leftArrow = document.createElement('button');
    leftArrow.className = 'nav-arrow';
    leftArrow.innerHTML = '&#10094;';
    
    const rightArrow = document.createElement('button');
    rightArrow.className = 'nav-arrow';
    rightArrow.innerHTML = '&#10095;';

    const navContainer = document.createElement('div');
    navContainer.id = 'question-nav-container';

    navWrapper.appendChild(leftArrow);
    navWrapper.appendChild(navContainer);
    navWrapper.appendChild(rightArrow);
    
    const mainContainer = document.querySelector('.container');
    const h1Title = document.querySelector('.container h1');
    if(mainContainer && h1Title) {
        mainContainer.insertBefore(navWrapper, h1Title.nextSibling.nextSibling);
    }

    const navButtons =[];

    const goToQuestion = (index) => {
        questions[currentIndex].style.display = 'none'; 
        navButtons[currentIndex].classList.remove('active'); 
        
        currentIndex = index;
        
        questions[currentIndex].style.display = 'block'; 
        navButtons[currentIndex].classList.add('active'); 
        
        navButtons[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    };

    questions.forEach((card, index) => {
        if (index !== 0) card.style.display = 'none'; 
        
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        if (index === 0) btn.classList.add('active');
        btn.innerText = `Q${index + 1}`;
        btn.addEventListener('click', () => goToQuestion(index));
        navContainer.appendChild(btn);
        navButtons.push(btn);

        const hintBox = document.createElement('div');
        hintBox.className = 'hint-box';
        
        const actionContainer = document.createElement('div');
        actionContainer.className = 'action-container';
        
        const lockBtn = document.createElement('button');
        lockBtn.className = 'lock-btn';
        lockBtn.innerText = '🔒 Lock Answer';
        lockBtn.disabled = true;

        const nextBtn = document.createElement('button');
        nextBtn.className = 'next-btn';
        nextBtn.innerText = 'Next Question ➔';

        const finishBtn = document.createElement('button');
        finishBtn.className = 'finish-btn';
        finishBtn.innerText = '🏁 Finish Exam';

        actionContainer.appendChild(lockBtn);
        actionContainer.appendChild(nextBtn);
        actionContainer.appendChild(finishBtn);

        const choicesList = card.querySelector('.choices-list');
        choicesList.parentNode.insertBefore(hintBox, choicesList.nextSibling);
        hintBox.parentNode.insertBefore(actionContainer, hintBox.nextSibling);

        const radios = card.querySelectorAll('input[type="radio"]');
        const explanationBox = card.querySelector('.explanation-box');

        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                lockBtn.disabled = false;
                const val = e.target.value; 
                const listItems = card.querySelectorAll('.explanation-box ul li');
                let hintHtml = '';
                
                listItems.forEach(li => {
                    const firstPart = li.innerText.trim().split(/[\.\:]/)[0]; 
                    
                    if (/^[A-D\/\s\&\,]+$/.test(firstPart) && firstPart.includes(val)) {
                        hintHtml = li.innerHTML
                            .replace(/\(Correct\)/gi, '')
                            .replace(/\(Incorrect\)/gi, '')
                            .replace(/Correct:/gi, '')
                            .replace(/Incorrect:/gi, '');
                    }
                });

                if (hintHtml) {
                    hintBox.innerHTML = `<strong>💡 Choice Hint:</strong> ${hintHtml}`;
                } else {
                    hintBox.innerHTML = `<strong>💡 Choice Hint:</strong> Think carefully about what this option means in the context of the question.`;
                }
                
                hintBox.style.display = 'block';
                
                const walker = document.createTreeWalker(hintBox, NodeFilter.SHOW_TEXT, null, false);
                const textNodes =[];
                let node;
                while (node = walker.nextNode()) {
                    if (node.parentNode.tagName === 'SPAN' && node.parentNode.classList.contains('term')) continue;
                    textNodes.push(node);
                }
                textNodes.forEach(n => autoLinkTextNode(n));
                
                attachDictionaryListeners(); 
            });
        });

        lockBtn.addEventListener('click', () => {
            const selectedOption = card.querySelector('input[type="radio"]:checked');
            const correctAnswer = card.getAttribute('data-correct');

            if (selectedOption.value === correctAnswer) {
                globalScore++;
                card.style.borderColor = '#4ade80';
                card.style.backgroundColor = 'rgba(74, 222, 128, 0.05)';
                navButtons[index].classList.add('locked-correct');
            } else {
                card.style.borderColor = '#f87171';
                card.style.backgroundColor = 'rgba(248, 113, 113, 0.05)';
                navButtons[index].classList.add('locked-incorrect');
            }

            radios.forEach(r => r.disabled = true);
            hintBox.style.display = 'none'; 
            explanationBox.classList.add('show'); 
            
            attachDictionaryListeners(); 

            lockBtn.style.display = 'none';
            if (index < questions.length - 1) {
                nextBtn.style.display = 'inline-block';
            } else {
                finishBtn.style.display = 'inline-block';
            }
        });

        nextBtn.addEventListener('click', () => goToQuestion(index + 1));

        finishBtn.addEventListener('click', () => {
            navWrapper.style.display = 'none'; 
            questions.forEach(q => q.style.display = 'block'); 
            finishBtn.style.display = 'none';

            const percentage = Math.round((globalScore / questions.length) * 100);
            let message = percentage >= 80 ? "🏆 Excellent! You are ready for the CCNA!" : "📘 Keep studying! Review the deep dives below.";
            
            const resultsDiv = document.getElementById('exam-results') || document.createElement('div');
            resultsDiv.id = 'exam-results';
            
            resultsDiv.innerHTML = `
                <h2>Final Score: ${globalScore} / ${questions.length} (${percentage}%)</h2>
                <p style="font-size: 1.2rem; margin-top: 10px;"><strong>${message}</strong></p>
                <p style="margin-top: 10px; color: #cbd5e1;">Scroll through the exam below to review all explanations and hints.</p>
            `;
            
            resultsDiv.style.padding = '30px';
            resultsDiv.style.margin = '20px 0 40px 0';
            resultsDiv.style.backgroundColor = '#0f172a';
            resultsDiv.style.border = '3px solid #38bdf8';
            resultsDiv.style.borderRadius = '8px';
            resultsDiv.style.textAlign = 'center';
            resultsDiv.style.color = '#e0f2fe';

            mainContainer.insertBefore(resultsDiv, questions[0]);
            window.scrollTo({top: 0, behavior: 'smooth'});
        });
    });

    leftArrow.addEventListener('click', () => navContainer.scrollBy({ left: -150, behavior: 'smooth' }));
    rightArrow.addEventListener('click', () => navContainer.scrollBy({ left: 150, behavior: 'smooth' }));

    attachDictionaryListeners();
    const oldSubmit = document.getElementById('submit-exam');
    if (oldSubmit) oldSubmit.style.display = 'none';
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