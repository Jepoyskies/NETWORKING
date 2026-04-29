// A beginner-friendly dictionary. No complex jargon without explaining it!
// A beginner-friendly dictionary. No complex jargon without explaining it!
const dictionary = {
    // --- The Absolute Basics ---
    "router": "<strong>Router:</strong> Think of it as a traffic cop at an intersection. It connects different networks together (like connecting your home to the Internet) and decides the best path for data to travel.",
    "switch": "<strong>Switch:</strong> A device that connects computers together *inside* a single building or room (a LAN). It learns exactly which port your computer is plugged into using your MAC address.",
    "mac_address": "<strong>MAC Address:</strong> The permanent physical 'fingerprint' burned into your computer's network card by the factory. It never changes. (e.g., 00:1A:2B:3C:4D:5E).",
    "ipv4": "<strong>IPv4 Address:</strong> Like your computer's mailing address (e.g., 192.168.1.5). Unlike a MAC address, this changes depending on whose Wi-Fi you are connected to.",
    "vlan": "<strong>VLAN (Virtual LAN):</strong> A trick to take one physical switch and chop it up into multiple invisible, separate switches. E.g., separating the 'Student' network from the 'Teacher' network so they can't see each other's traffic.",
    "trunk": "<strong>Trunk Link:</strong> A special 'super highway' cable connecting two switches. Instead of carrying traffic for just one VLAN, a trunk carries traffic for ALL VLANs.",
    "default_gateway": "<strong>Default Gateway:</strong> The 'doorway' out of your local network. When your PC wants to talk to Google, it doesn't know where Google is, so it hands the data to the Default Gateway (your router) to figure it out.",
    "host": "<strong>Host / End Device:</strong> The actual devices people use: laptops, phones, servers, or printers.",
    "interface": "<strong>Interface / Port:</strong> The physical hole on a router or switch where you plug the network cable in. (e.g., GigabitEthernet0/1).",

    // --- Module 8: IPv6 & DHCPv6 ---
    "ipv6": "<strong>IPv6:</strong> The new, extremely long IP address format (e.g., 2001:db8:acad::1). We invented this because the world completely ran out of the old IPv4 addresses.",
    "gua": "<strong>GUA (Global Unicast Address):</strong> A public IPv6 address. This is the address that can actually reach the public Internet.",
    "link_local": "<strong>Link-Local Address (LLA):</strong> A special IPv6 address (always starts with <em>fe80::</em>). Your computer uses this ONLY to talk to devices plugged into the exact same local cable/switch. It cannot cross a router.",
    "slaac": "<strong>SLAAC (Stateless Address Autoconfiguration):</strong> A cool IPv6 feature where the router says 'Here is the network prefix!' and the PC replies 'Thanks, I'll generate the rest of my IP address myself!' No DHCP server needed.",
    "ra": "<strong>RA (Router Advertisement):</strong> A message a router sends out every 200 seconds saying 'I am the router, here is the default gateway info!'",
    "rs": "<strong>RS (Router Solicitation):</strong> A message a PC sends the moment it turns on, shouting 'Are there any routers out there? I need an IP address!'",
    "stateless": "<strong>Stateless:</strong> Means nobody is keeping a list. In Stateless DHCPv6, the server gives you an IP, but doesn't write down your name or remember you.",
    "stateful": "<strong>Stateful:</strong> Means keeping a strict logbook. A Stateful DHCP server records exactly which MAC address was given which IP address and when the lease expires.",
    "dhcpv6": "<strong>DHCPv6:</strong> The IPv6 version of the server that hands out IP addresses and DNS info to computers automatically.",
    "a_flag": "<strong>A Flag (Autoconfiguration):</strong> If this is set to 1 in an RA message, it tells the PC to use SLAAC to make its own IP address.",
    "o_flag": "<strong>O Flag (Other Configuration):</strong> If set to 1, it tells the PC 'Get your IP from SLAAC, but ask the Stateless DHCP server for <em>other</em> info like the DNS server address.'",
    "m_flag": "<strong>M Flag (Managed):</strong> If set to 1, it tells the PC 'Do NOT use SLAAC. Go ask the Stateful DHCPv6 server for your IP address.'",
    "eui_64": "<strong>EUI-64:</strong> A specific math formula a PC uses in SLAAC to turn its 48-bit MAC address into a 64-bit IPv6 Interface ID by stuffing 'fffe' in the middle.",
    "dad": "<strong>DAD (Duplicate Address Detection):</strong> A PC shouting 'Is anyone else using this IP address?' just to make sure its newly created SLAAC address is 100% unique.",
    "relay_agent": "<strong>DHCPv6 Relay Agent:</strong> If your PC and your DHCP server are on completely different networks (separated by a router), the router acts as a middle-man 'Relay Agent' to forward the DHCP requests across the boundary.",
    
    // --- Module 9: FHRP Concepts ---
    "fhrp": "<strong>FHRP (First Hop Redundancy Protocol):</strong> A safety net. You use 2 or more physical routers to act like 1 virtual router. If one dies, the other takes over instantly. The PCs don't even notice.",
    "virtual_router": "<strong>Virtual Router:</strong> A fake, imaginary router. Two physical routers share a 'Virtual IP' and 'Virtual MAC'. You set your PC's Default Gateway to this fake IP.",
    "active_role": "<strong>Active Router:</strong> The physical router that won the election and is currently doing all the heavy lifting (forwarding internet traffic).",
    "standby_role": "<strong>Standby Router:</strong> The backup router. It just sits there, listening to 'Hello' messages, waiting for the Active router to die so it can take over.",
    "hello_messages": "<strong>Hello Messages:</strong> Periodic 'I am alive!' signals sent between devices. If a standby router stops hearing 'Hello', it assumes the active router died.",
    "hsrp": "<strong>HSRP (Hot Standby Router Protocol):</strong> Cisco's specific brand of FHRP. It elects one Active and one Standby.",
    "priority": "<strong>Priority:</strong> A score from 0 to 255. In an HSRP election, the router with the highest score becomes the boss (Active router). Default is 100.",
    "preemption": "<strong>Preemption:</strong> If the King (Active Router) dies, the Prince (Standby) takes over. When the King comes back to life, <em>Preemption</em> is the setting that allows the King to violently take his throne back. If disabled, the Prince stays King.",
    "arp_fhrp": "<strong>ARP in FHRP:</strong> PCs use ARP to find the MAC address of their gateway. In FHRP, the router replies with the *Virtual* MAC address, not its real physical one.",

    // --- Module 10: LAN Security ---
    "ddos": "<strong>DDoS (Distributed Denial of Service):</strong> Hackers use thousands of infected zombie computers to flood a website with fake traffic until the website crashes.",
    "malware": "<strong>Malware:</strong> Any bad software (viruses, trojans, worms).",
    "ransomware": "<strong>Ransomware:</strong> A virus that encrypts/locks all your files. The hacker demands money (ransom) to give you the password to unlock them.",
    "vpn": "<strong>VPN (Virtual Private Network):</strong> Creates an encrypted 'tunnel' over the internet so remote workers can safely access corporate networks.",
    "ngfw": "<strong>NGFW (Next-Generation Firewall):</strong> Advanced firewalls that deeply inspect the actual application traffic for modern threats, not just IP addresses.",
    "nac": "<strong>NAC (Network Access Control):</strong> A security guard for the network. It checks your PC before letting you in ('Does this laptop have a firewall on? No? Access Denied.').",
    "esa": "<strong>ESA (Email Security Appliance):</strong> Cisco device that monitors emails to block spam, phishing links, and malicious attachments.",
    "wsa": "<strong>WSA (Web Security Appliance):</strong> Cisco device that monitors web browsing, blocking employees from visiting dangerous or infected websites.",
    "phishing": "<strong>Phishing:</strong> A scam email pretending to be your bank or boss, tricking you into clicking a fake link to steal your password.",
    "ssh": "<strong>SSH (Secure Shell):</strong> A highly secure, encrypted way for network admins to remotely log into a switch or router to configure it (replaces the unencrypted Telnet).",
    "aaa": "<strong>AAA (Authentication, Authorization, Accounting):</strong> The ultimate log-in system. Authentication (Who are you?), Authorization (What commands are you allowed to type?), Accounting (Keeping a log of every click you made).",
    "radius": "<strong>RADIUS:</strong> The protocol routers use to securely talk to the central AAA server to check if your password is correct.",
    "8021x": "<strong>802.1X:</strong> Port-based security. If you plug a laptop into a wall jack in an office, the switch port stays completely dead/blocked until you type in a valid username and password.",
    "layer2": "<strong>Layer 2:</strong> The Data Link layer of the OSI model. This is where Switches operate using MAC addresses. If Layer 2 isn't secure, the whole network is compromised.",
    "mac_flooding": "<strong>MAC Address Flooding:</strong> An attack where a hacker sends thousands of fake MAC addresses per second. The switch panics, its memory gets full, and it starts broadcasting all private traffic to everyone.",
    "port_security": "<strong>Port Security:</strong> The fix for MAC Flooding. You tell the switch, 'Only allow a maximum of 2 MAC addresses on this port. If you see a 3rd, shut the port down!'",
    "vlan_hopping": "<strong>VLAN Hopping:</strong> A hacker tricks the switch into thinking the hacker's PC is actually another switch. They form a 'Trunk' link, allowing the hacker to see traffic from ALL VLANs.",
    "dtp": "<strong>DTP (Dynamic Trunking Protocol):</strong> A Cisco feature that automatically turns a port into a Trunk if it detects another switch. Hackers exploit this, so we disable it on user ports.",
    "native_vlan": "<strong>Native VLAN:</strong> The one VLAN that travels across a trunk without an 802.1Q tag. Hackers use 'Double-Tagging' to exploit this, which is why we change the Native VLAN to an unused number.",
    "dhcp_spoofing": "<strong>DHCP Spoofing:</strong> A hacker plugs in their own fake DHCP server. When your PC asks for an IP, the hacker replies first, setting the hacker's PC as your Default Gateway so they can spy on your internet traffic.",
    "dhcp_snooping": "<strong>DHCP Snooping:</strong> The fix for DHCP spoofing. The switch blocks all DHCP server replies unless they come from a specific 'trusted' port where the real server is.",
    "arp_spoofing": "<strong>ARP Spoofing:</strong> A hacker lies to your PC, saying 'Hey, my MAC address is the router!' Your PC updates its ARP table and sends all its traffic to the hacker.",
    "dai": "<strong>DAI (Dynamic ARP Inspection):</strong> The fix for ARP spoofing. The switch checks ARP messages against a trusted database and drops the hacker's lies.",
    "ipsg": "<strong>IPSG (IP Source Guard):</strong> A security feature that stops IP spoofing by checking if the IP address you are trying to use matches the one the DHCP server actually assigned to you.",
    "stp": "<strong>STP (Spanning Tree Protocol):</strong> A protocol switches use to prevent endless loops. Hackers try to attack this to become the 'Root Bridge' (the center of the network).",
    "bpdu_guard": "<strong>BPDU Guard:</strong> The fix for STP attacks. PCs should never send STP messages (BPDUs). If a user port receives one, BPDU Guard immediately shuts the port down.",
    "cdp": "<strong>CDP (Cisco Discovery Protocol):</strong> Cisco switches shouting 'Hi, I'm a Cisco switch running iOS version 15.2!' Hackers listen to this to find vulnerabilities. Turn it off on user ports!"
};

// Wait for the page to load, then inject the dictionary HTML
document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject the Dictionary HTML into the page dynamically
    const dictionaryHTML = `
        <div id="dict-overlay"></div>
        <div id="dict-panel">
            <button id="close-btn">&times;</button>
            <h2>Refresher Dictionary</h2>
            <div id="term-display">
                <h3 id="term-title">Click a term!</h3>
                <div id="term-definition">
                    I am your interactive reviewer. As you read, tap any dashed blue word. I'll explain it simply so you don't have to Google it!
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', dictionaryHTML);

    // 2. Setup the Logic
    const overlay = document.getElementById('dict-overlay');
    const panel = document.getElementById('dict-panel');
    const closeBtn = document.getElementById('close-btn');
    const titleEl = document.getElementById('term-title');
    const defEl = document.getElementById('term-definition');

    // Function to close panel
    const closePanel = () => {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // 3. Attach click events to all <span class="term"> elements
    document.querySelectorAll('.term').forEach(term => {
        term.addEventListener('click', function() {
            const termKey = this.getAttribute('data-term');
            const termText = this.innerText;
            
            // Get the simple explanation or a fallback
            const definitionHTML = dictionary[termKey] || `<strong>${termText}:</strong> Oops! We don't have an explanation for this one yet, but we will add it soon!`;
            
            // Update the panel text
            titleEl.innerText = termText.charAt(0).toUpperCase() + termText.slice(1);
            defEl.innerHTML = `<p>${definitionHTML}</p>`;

            // Slide the panel in!
            panel.classList.add('active');
            overlay.classList.add('active');
        });
    });
});