// The ULTIMATE beginner-friendly networking dictionary!
const dictionary = {
    // --- The Absolute Basics ---
    "router": "<strong>Router:</strong> Think of it as a traffic cop. It connects different networks together and reads the Destination IP Address to decide where to forward packets.",
    "switch": "<strong>Switch:</strong> A device that connects computers together *inside* a single building (LAN). It forwards frames using MAC addresses.",
    "mac_address": "<strong>MAC Address / Physical Address:</strong> The permanent physical 'fingerprint' burned into a network card by the factory. (e.g., 00:1A:2B:3C:4D:5E).",
    "ipv4": "<strong>IPv4 Address:</strong> Like your computer's mailing address (e.g., 192.168.1.5). This changes depending on whose network you connect to.",
    "default_gateway": "<strong>Default Gateway:</strong> The 'doorway' out of your local network. Usually your router's IP address. If a PC wants to talk to a remote network, it sends the packet here first.",
    "host": "<strong>Host / End Device:</strong> The actual devices people use: laptops, phones, servers, or printers.",
    "interface": "<strong>Interface / Port:</strong> The physical hole on a router or switch where you plug the network cable in. (e.g., GigabitEthernet0/1).",
    "lan": "<strong>LAN (Local Area Network):</strong> A network restricted to a small physical area, like your house or an office building.",
    "packet": "<strong>Packet:</strong> A piece of data traveling over the network at Layer 3 (IP). It's like a digital envelope that has a source and destination IP address on it.",
    "frame": "<strong>Frame:</strong> A piece of data traveling at Layer 2 (Data Link). It's the box that carries the IP Packet from one MAC address to another over a single cable.",

    // --- Module 8: IPv6 & DHCPv6 ---
    "ipv6": "<strong>IPv6:</strong> The new, extremely long IP address format (e.g., 2001:db8:acad::1). We invented this because the world completely ran out of the old IPv4 addresses.",
    "gua": "<strong>GUA (Global Unicast Address):</strong> A public IPv6 address. This is the address that can actually reach the public Internet.",
    "link_local": "<strong>Link-Local Address (LLA):</strong> A special IPv6 address (always starts with <em>fe80::</em>). Your computer uses this ONLY to talk to devices plugged into the exact same local cable/switch. It cannot cross a router.",
    "slaac": "<strong>SLAAC (Stateless Address Autoconfiguration):</strong> A cool IPv6 feature where the router says 'Here is the network prefix!' and the PC replies 'Thanks, I'll generate the rest of my IP address myself!' No DHCP server needed.",
    "ra": "<strong>RA (Router Advertisement):</strong> An ICMPv6 message a router sends out every 200 seconds saying 'I am the router, here is the default gateway info!'",
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

    // --- Module 10 & 11: LAN & Switch Security ---
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
    "port_security": "<strong>Port Security:</strong> The fix for MAC Flooding. You tell the switch, 'Only allow a maximum of X MAC addresses on this port. If you see more, shut the port down!'",
    "sticky_mac": "<strong>Sticky MAC Address:</strong> A feature where the switch dynamically learns the MAC address of the first PC plugged into the port, and 'sticks' it permanently into the running configuration.",
    "violation_modes": "<strong>Violation Modes:</strong> How the switch reacts when a hacker breaks Port Security. <strong>Shutdown</strong> kills the port. <strong>Restrict</strong> drops the bad traffic and sends a log message. <strong>Protect</strong> drops the bad traffic silently.",
    "err_disabled": "<strong>Err-Disabled:</strong> A state where the switch mathematically unplugs the port due to a severe security violation. The port LED turns off. An admin must type 'shutdown' then 'no shutdown' to revive it.",
    "vlan_hopping": "<strong>VLAN Hopping:</strong> A hacker tricks the switch into letting their PC see traffic from all VLANs, bypassing isolation.",
    "dtp": "<strong>DTP (Dynamic Trunking Protocol):</strong> A Cisco feature that automatically turns a port into a Trunk if it detects another switch. Hackers exploit this, so we disable it on user ports.",
    "native_vlan": "<strong>Native VLAN:</strong> The one VLAN that travels across a trunk without an 802.1Q tag. Hackers use 'Double-Tagging' to exploit this, which is why we change the Native VLAN to an unused number.",
    "dhcp_starvation": "<strong>DHCP Starvation:</strong> An attack where a hacker uses a tool (like Gobbler) to rapidly request every single IP address from the DHCP server until it's empty, creating a Denial of Service.",
    "dhcp_spoofing": "<strong>DHCP Spoofing:</strong> A hacker plugs in their own fake DHCP server. When your PC asks for an IP, the hacker replies first, setting the hacker's PC as your Default Gateway so they can spy on your internet traffic.",
    "dhcp_snooping": "<strong>DHCP Snooping:</strong> The fix for DHCP spoofing. The switch blocks all DHCP server replies unless they come from a specific 'trusted' port where the real server is.",
    "arp_spoofing": "<strong>ARP Spoofing:</strong> A hacker lies to your PC, saying 'Hey, my MAC address is the router!' Your PC updates its ARP table and sends all its traffic to the hacker.",
    "dai": "<strong>DAI (Dynamic ARP Inspection):</strong> The fix for ARP spoofing. The switch checks ARP messages against a trusted database and drops the hacker's lies.",
    "ipsg": "<strong>IPSG (IP Source Guard):</strong> A security feature that stops IP spoofing by checking if the IP address you are trying to use matches the one the DHCP server actually assigned to you.",
    "stp": "<strong>STP (Spanning Tree Protocol):</strong> A protocol switches use to prevent endless loops. Hackers try to attack this to become the 'Root Bridge' (the center of the network).",
    "portfast": "<strong>PortFast:</strong> A feature for end-user ports. It skips STP's listening/learning phases (which take 30 seconds) so PCs get internet instantly when plugged in.",
    "bpdu_guard": "<strong>BPDU Guard:</strong> The fix for STP attacks. BPDUs are STP messages that only switches should send. If you enable BPDU Guard on a user's port, and the user plugs in an illegal switch, it instantly err-disables the port.",
    "cdp": "<strong>CDP (Cisco Discovery Protocol):</strong> Cisco switches shouting 'Hi, I'm a Cisco switch!' Hackers listen to this to find vulnerabilities. Turn it off on user ports!",

    // --- Modules 12 & 13: Wireless (WLAN) Concepts & Config ---
    "wpan": "<strong>WPAN (Wireless Personal Area Network):</strong> Very short range (20-30 ft). Things like Bluetooth headphones or wireless mice.",
    "wlan": "<strong>WLAN (Wireless Local Area Network):</strong> Standard Wi-Fi! Covers a medium area like a house or an office (up to 300 ft).",
    "wman": "<strong>WMAN (Wireless Metropolitan Area Network):</strong> Covers a large geographic area like a city district using specific licensed frequencies.",
    "wwan": "<strong>WWAN (Wireless Wide Area Network):</strong> National or global communication. Think of your cell phone's 4G/5G data or Satellite internet.",
    "bluetooth": "<strong>Bluetooth:</strong> An IEEE WPAN standard used for short-range device pairing.",
    "mimo": "<strong>MIMO (Multiple Input Multiple Output):</strong> A technology that uses multiple antennas on a router to send and receive multiple data streams at the same time, making Wi-Fi much faster.",
    "wi_fi_alliance": "<strong>Wi-Fi Alliance:</strong> The organization that tests wireless products from different companies to make sure they all work together (interoperability).",
    "autonomous_ap": "<strong>Autonomous AP:</strong> A standalone Wi-Fi router. You have to log into it individually to configure it. Fine for a house, terrible for a massive hospital.",
    "wlc": "<strong>WLC (Wireless LAN Controller):</strong> The 'Master Brain' for enterprise Wi-Fi. Instead of configuring 50 Access Points one by one, you configure the WLC, and it automatically pushes the settings to all 50 APs.",
    "capwap": "<strong>CAPWAP:</strong> The tunnel protocol that the WLC uses to control and manage all the Access Points over the network.",
    "ad_hoc": "<strong>Ad hoc Mode:</strong> Peer-to-peer Wi-Fi. Two laptops connecting directly to each other without using a router.",
    "infrastructure_mode": "<strong>Infrastructure Mode:</strong> Standard Wi-Fi. Laptops connect to a central Access Point (AP) to get to the network.",
    "bss": "<strong>BSS (Basic Service Set):</strong> A single Access Point and the wireless clients connected to it. (Just one Wi-Fi bubble).",
    "ess": "<strong>ESS (Extended Service Set):</strong> Multiple Access Points connected together by a wired network to create one massive, seamless Wi-Fi bubble.",
    "csma_ca": "<strong>CSMA/CA (Collision Avoidance):</strong> Wi-Fi is half-duplex (only one device can talk at a time). CSMA/CA means devices 'Listen before they talk' to make sure the airwaves are clear to avoid data collisions.",
    "ssid": "<strong>SSID (Service Set Identifier):</strong> The public name of the Wi-Fi network (e.g., 'Starbucks_Free_WiFi').",
    "passive_mode": "<strong>Passive Discover Mode:</strong> The AP openly shouts its SSID to the world using 'Beacon' frames so your phone can easily find it.",
    "active_mode": "<strong>Active Discover Mode:</strong> The AP hides its name (SSID Cloaking). Your phone has to actively send out a 'Probe Request' asking for the hidden network by name.",
    "split_mac": "<strong>Split MAC Architecture:</strong> Chores are divided! The Access Point handles physical radio stuff (like sending beacons), and the WLC handles the big-brain stuff (like Authentication and roaming).",
    "dtls": "<strong>DTLS Encryption:</strong> A protocol that encrypts the CAPWAP control tunnel between the Access Point and the WLC so hackers can't spy on the management traffic.",
    "flexconnect": "<strong>FlexConnect:</strong> A feature for branch offices. If the remote branch AP loses its connection to the main WLC over the internet, it can act as a standalone router temporarily.",
    "dsss": "<strong>DSSS / OFDM:</strong> Modulation techniques used to spread a wireless signal across frequencies to avoid interference.",
    "rogue_ap": "<strong>Rogue AP:</strong> An unauthorized wireless router plugged into a corporate network. A massive security risk!",
    "evil_twin": "<strong>Evil Twin Attack:</strong> A hacker sets up a rogue AP with the exact same SSID as the real network to trick people into connecting to the hacker's router.",
    "wep": "<strong>WEP:</strong> The original Wi-Fi security. It is incredibly weak and can be hacked in seconds. NEVER USE IT.",
    "wpa2": "<strong>WPA2:</strong> The modern standard for Wi-Fi security. It uses strong AES encryption.",
    "wpa3": "<strong>WPA3:</strong> The newest, strongest generation of Wi-Fi security. It protects against brute-force password guessing attacks.",
    "aes": "<strong>AES:</strong> Advanced Encryption Standard. A highly secure encryption protocol used by WPA2 to scramble your data.",
    "tkip": "<strong>TKIP:</strong> An older, weaker encryption protocol used by WPA (which is no longer recommended).",
    "qos": "<strong>QoS (Quality of Service):</strong> A router setting that gives priority to time-sensitive traffic (like Zoom calls or VoIP) over less important traffic.",
    "port_forwarding": "<strong>Port Forwarding:</strong> Punching a specific hole in your router's firewall so traffic from the outside internet can reach a specific server inside your private LAN.",
    "snmp": "<strong>SNMP (Simple Network Management Protocol):</strong> A protocol used to monitor network devices. The WLC can be configured to send 'Traps' (log messages and alerts) to an SNMP server when something goes wrong.",

    // --- Extra Checkpoint Exam Terms ---
    "source_ip": "<strong>Source IP Address:</strong> The IP address of the computer that is SENDING the data.",
    "destination_ip": "<strong>Destination IP Address:</strong> The IP address of the computer RECEIVING the data. Routers strictly use this address to figure out where to forward the packet.",
    "data_link": "<strong>Data-Link Address:</strong> Another name for a MAC address (Layer 2). Routers do NOT use these to route traffic across the internet; they only use them to hop to the very next device.",
    "arp": "<strong>ARP (Address Resolution Protocol):</strong> A protocol used by a PC to discover the MAC address of a destination when it only knows the IP address.",
    "arp_cache": "<strong>ARP Cache / Table:</strong> A temporary memory list on your computer that remembers 'Which IP address belongs to which MAC address?'",
    "routing_table": "<strong>Routing Table:</strong> The router's personal map. It looks at this map to match the destination IP of a packet to the correct exit interface.",
    "nic": "<strong>NIC (Network Interface Card):</strong> The actual hardware component inside your PC that lets it connect to a network.",
    "encapsulation": "<strong>Encapsulation:</strong> The process of putting data inside an envelope (like putting a Layer 3 Packet inside a Layer 2 Frame) before sending it.",
    "layer2_protocol": "<strong>Layer 2 Protocols:</strong> Rules that govern how data moves across a single physical link (like Ethernet or Wi-Fi).",
    "upper_layer": "<strong>Upper Layer Services (TCP):</strong> Protocols like TCP that operate above IP. Because IP is 'unreliable' (it doesn't check if data arrived), it relies on TCP to catch errors and resend missing packets.",
    "metric": "<strong>Metric:</strong> The 'cost' of taking a certain path. If a router has two paths to a destination, it will always choose the path with the LOWER metric (cost).",
    "osi_network": "<strong>OSI Network Layer (Layer 3):</strong> This layer is entirely responsible for Logical Addressing (IP addresses) and Routing packets to their final destination.",
    "error_detection": "<strong>Error Detection:</strong> Checking if data got corrupted during travel. This is a job for the Data Link Layer (Layer 2), not the Network Layer.",
    "pdu": "<strong>PDU (Protocol Data Unit):</strong> The generic term for a piece of data at any layer. (e.g., A packet is a Layer 3 PDU, a frame is a Layer 2 PDU).",
    "transport_layer": "<strong>Transport Layer (Layer 4):</strong> Responsible for segmentation (breaking large data into smaller pieces) and reliability (TCP).",
    "telnet": "<strong>Telnet:</strong> An old, highly unsecure way to remotely control a switch or router. Hackers can easily steal passwords sent via Telnet.",
    "connectionless": "<strong>Connectionless:</strong> IP protocol is connectionless. It means it just throws the packet into the network hoping it reaches the destination, without setting up a dedicated connection first (unlike a phone call).",
    "ttl": "<strong>TTL (Time-to-Live):</strong> A timer on an IPv4 packet. Every time a router processes the packet, it lowers the TTL by 1. If it hits 0, the router deletes the packet to stop it from looping endlessly forever.",
    "checksum": "<strong>Header Checksum:</strong> A mathematical value in IPv4 used to detect if the packet header got corrupted. IPv6 completely removed this to make processing faster!",
    "flow_label": "<strong>Flow Label:</strong> A new field in IPv6. It tags packets that belong to a real-time stream (like a Zoom video call) so routers keep them on the exact same path to prevent lag.",
    "protocol_field": "<strong>Protocol Field:</strong> A field in the IPv4 header that tells the computer what type of upper-layer data is packed inside (e.g., is the data inside TCP, UDP, or ICMP?).",
    "dscp": "<strong>Differentiated Services (DS):</strong> An 8-bit field in the IPv4 header used to determine the priority of the packet (e.g., VoIP audio gets higher priority than web browsing).",
    "broadcast": "<strong>Broadcast (FF:FF:FF:FF:FF:FF):</strong> A message sent to EVERYONE on the local network.",
    "multicast": "<strong>Multicast:</strong> A message sent to a SPECIFIC GROUP of devices on the network. In IPv4, this is the 224.0.0.0 range. In IPv6, it starts with FF00::.",
    "unicast": "<strong>Unicast:</strong> A message sent directly from exactly ONE host to exactly ONE other host.",
    "console_port": "<strong>Console Port:</strong> A physical port on a switch/router used for out-of-band, direct local management using a rollover cable.",
    "aux_port": "<strong>AUX Port:</strong> An older port on routers used to connect a modem for remote dial-up management.",
    "vty": "<strong>VTY Lines:</strong> Virtual Terminal lines. These are the invisible, logical ports used to remotely SSH or Telnet into a device across the network.",
    "running_config": "<strong>Running Configuration:</strong> The active, currently applied settings in the router's RAM. It gets erased if the power goes out!",
    "startup_config": "<strong>Startup Configuration:</strong> The saved settings in NVRAM that get loaded into RAM when the router boots up.",
    "nvram": "<strong>NVRAM (Non-Volatile RAM):</strong> Permanent memory inside the router. It does not erase when the power goes off. Used to store the startup-config.",
    "flash": "<strong>Flash Memory:</strong> The storage drive inside a router where the Cisco IOS operating system files are kept.",
    "post": "<strong>POST (Power-On Self Test):</strong> A hardware check the router performs immediately when turned on to ensure CPU, RAM, and interfaces are working.",
    "dhcp": "<strong>DHCP:</strong> Automatically hands out IP addresses and default gateways to PCs.",
    "prefix_length": "<strong>Prefix Length (/24):</strong> The number of '1' bits in a subnet mask. It tells you exactly how many bits are locked for the network portion.",
    "subnet_mask": "<strong>Subnet Mask:</strong> A number (like 255.255.255.0) that divides an IP address into a 'Network' part (the street) and a 'Host' part (the house).",
    "host_bits": "<strong>Host Bits:</strong> The zeroes at the end of a subnet mask. These determine how many devices (hosts) can fit in the network. Formula: 2^n - 2.",
    "broadcast_address": "<strong>Broadcast Address:</strong> The very last IP address in a subnet. Sending a packet here copies it to every single device in that network.",
    "network_address": "<strong>Network Address:</strong> The very first IP address in a subnet. It represents the network itself and cannot be assigned to a PC.",
    "private_ip": "<strong>Private IP (RFC 1918):</strong> Free IP addresses reserved for internal LANs (like 192.168.x.x or 10.x.x.x). They are strictly blocked from the public internet.",
    "anycast": "<strong>Anycast:</strong> An IPv6 feature where multiple routers share the exact same IP. Your packet is automatically delivered to whichever one is geographically closest.",
    "global_unicast": "<strong>Global Unicast (2000::):</strong> A public, routable IPv6 address. It is the IPv6 equivalent of a public IPv4 address.",
    "icmpv6": "<strong>ICMPv6:</strong> The control protocol for IPv6. Since ARP doesn't exist in IPv6, ICMPv6 handles MAC address discovery (Neighbor Discovery) as well as Ping and Traceroute.",
    "traceroute": "<strong>Traceroute / tracert:</strong> A tool that tracks the exact path a packet takes through the internet by forcing every router along the way to reveal itself.",
    "dual_stack": "<strong>Dual-Stack:</strong> Running both IPv4 and IPv6 on the exact same network hardware at the same time so both work natively.",
    "tunneling": "<strong>Tunneling:</strong> Wrapping a new IPv6 packet inside an old IPv4 packet so it can safely travel over an older IPv4-only internet provider.",
    "translation": "<strong>Translation:</strong> Converting an IPv6 packet completely into an IPv4 packet (like NAT64) so an IPv6 PC can talk to an IPv4 server.",
    "loopback": "<strong>Loopback (127.0.0.1 or ::1):</strong> A fake, internal IP. Pinging it tests if your computer's own internal networking software is functioning."
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Dictionary Panel HTML
    const dictionaryHTML = `
        <div id="dict-overlay"></div>
        <div id="dict-panel">
            <button id="close-btn">&times;</button>
            <h2>Refresher Dictionary</h2>
            <div id="term-display">
                <h3 id="term-title">Click a term!</h3>
                <div id="term-definition">
                    I am your interactive reviewer. As you read, tap any dashed blue word. I'll explain it simply!
                </div>
            </div>
        </div>
    `;
    
    if (!document.getElementById('dict-panel')) {
        document.body.insertAdjacentHTML('beforeend', dictionaryHTML);
    }

    const overlay = document.getElementById('dict-overlay');
    const panel = document.getElementById('dict-panel');
    const closeBtn = document.getElementById('close-btn');
    const titleEl = document.getElementById('term-title');
    const defEl = document.getElementById('term-definition');

    const closePanel = () => {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closePanel);
    if (overlay) overlay.addEventListener('click', closePanel);

    // 2. BULLETPROOF Click event for Dictionary Terms
    document.body.addEventListener('click', function(e) {
        const termElement = e.target.closest('.term'); 
        
        if(termElement) {
            e.preventDefault(); 
            const termKey = termElement.getAttribute('data-term');
            const termText = termElement.innerText;
            
            const definitionHTML = dictionary[termKey] || `<strong>${termText}:</strong> Oops! We don't have an explanation for this one yet!`;
            
            titleEl.innerText = termText.charAt(0).toUpperCase() + termText.slice(1);
            defEl.innerHTML = `<p>${definitionHTML}</p>`;

            panel.classList.add('active');
            overlay.classList.add('active');
        }
    });

    // 3. EXAM GRADING LOGIC
    const submitBtn = document.getElementById('submit-exam');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            let score = 0;
            let total = 0;
            
            document.querySelectorAll('.question-card').forEach(card => {
                total++;
                const correctVal = card.getAttribute('data-correct'); 
                const selectedInput = card.querySelector('input[type="radio"]:checked');
                const explanation = card.querySelector('.explanation-box');

                card.querySelectorAll('input').forEach(input => input.disabled = true);

                if (selectedInput) {
                    if (selectedInput.value === correctVal) {
                        score++;
                        selectedInput.parentElement.classList.add('correct');
                    } else {
                        selectedInput.parentElement.classList.add('incorrect');
                        const correctLabel = card.querySelector(`input[value="${correctVal}"]`).parentElement;
                        if(correctLabel) correctLabel.classList.add('correct');
                    }
                } else {
                    const correctLabel = card.querySelector(`input[value="${correctVal}"]`).parentElement;
                    if(correctLabel) correctLabel.classList.add('correct');
                }
                
                if (explanation) explanation.classList.add('show');
            });

            const resultsDiv = document.getElementById('exam-results');
            const percentage = (score / total) * 100;
            
            let message = "";
            let color = "";
            if (percentage >= 90) { message = "🏆 Outstanding! You are absolutely ready for the Exam!"; color = "#047857"; }
            else if (percentage >= 75) { message = "🎉 Great job! Just review a few concepts and you'll be perfect."; color = "#0284c7"; }
            else if (percentage >= 50) { message = "👍 Good effort. Keep practicing using the explanations!"; color = "#ca8a04"; }
            else { message = "📚 Don't worry! Review the explanations highlighted in green and try again."; color = "#dc2626"; }

            resultsDiv.innerHTML = `
                <h2 style="color: ${color}">Your Score: ${score} / ${total}</h2>
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">(${percentage.toFixed(0)}%)</div>
                <div class="feedback-msg">${message}</div>
            `;
            
            resultsDiv.style.display = "block";
            submitBtn.style.display = "none";
            
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
});