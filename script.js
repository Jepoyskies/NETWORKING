// A beginner-friendly dictionary. No complex jargon without explaining it!
const dictionary = {
    // --- The Absolute Basics ---
    "router": "<strong>Router:</strong> Think of it as a traffic cop. It connects different networks together and reads the Destination IP Address to decide where to forward packets.",
    "switch": "<strong>Switch:</strong> A device that connects computers together *inside* a single building (LAN). It forwards frames using MAC addresses.",
    "mac_address": "<strong>MAC Address / Physical Address:</strong> The permanent physical 'fingerprint' burned into a network card by the factory. (e.g., 00:1A:2B:3C:4D:5E).",
    "ipv4": "<strong>IPv4 Address:</strong> Like your computer's mailing address (e.g., 192.168.1.5). This changes depending on whose network you connect to.",
    "default_gateway": "<strong>Default Gateway:</strong> The 'doorway' out of your local network. Usually your router's IP address. If a PC wants to talk to a remote network, it sends the packet here first.",
    "host": "<strong>Host / End Device:</strong> The actual devices people use: laptops, phones, servers.",
    "interface": "<strong>Interface / Port:</strong> The physical hole on a router or switch where you plug the network cable in. (e.g., GigabitEthernet0/1).",
    "lan": "<strong>LAN (Local Area Network):</strong> A network restricted to a small physical area, like your house or an office building.",
    "packet": "<strong>Packet:</strong> A piece of data traveling over the network at Layer 3 (IP). It's like a digital envelope that has a source and destination IP address on it.",
    "frame": "<strong>Frame:</strong> A piece of data traveling at Layer 2 (Data Link). It's the box that carries the IP Packet from one MAC address to another over a single cable.",

    // --- Module 8-10 Exam Terms ---
    "source_ip": "<strong>Source IP Address:</strong> The IP address of the computer that is SENDING the data.",
    "destination_ip": "<strong>Destination IP Address:</strong> The IP address of the computer RECEIVING the data. Routers strictly use this address to figure out where to forward the packet.",
    "data_link": "<strong>Data-Link Address:</strong> Another name for a MAC address (Layer 2). Routers do NOT use these to route traffic across the internet; they only use them to hop to the very next device.",
    "arp": "<strong>ARP (Address Resolution Protocol):</strong> A protocol used by a PC to discover the MAC address of a destination when it only knows the IP address.",
    "arp_cache": "<strong>ARP Cache / Table:</strong> A temporary memory list on your computer that remembers 'Which IP address belongs to which MAC address?'",
    "routing_table": "<strong>Routing Table:</strong> The router's personal map. It looks at this map to match the destination IP of a packet to the correct exit interface.",
    "loopback": "<strong>Loopback Interface (127.0.0.1):</strong> A fake, internal IP address. If you ping 127.0.0.1, your computer is literally pinging itself to test if its own network card and TCP/IP stack are working.",
    "nic": "<strong>NIC (Network Interface Card):</strong> The actual hardware component inside your PC that lets it connect to a network.",
    "subnet_mask": "<strong>Subnet Mask:</strong> A number (like 255.255.255.0) that tells the computer which part of its IP address is the 'Network' and which part is the 'Host'.",
    "encapsulation": "<strong>Encapsulation:</strong> The process of putting data inside an envelope (like putting a Layer 3 Packet inside a Layer 2 Frame) before sending it.",
    "layer2_protocol": "<strong>Layer 2 Protocols:</strong> Rules that govern how data moves across a single physical link (like Ethernet or Wi-Fi).",
    "upper_layer": "<strong>Upper Layer Services (TCP):</strong> Protocols like TCP that operate above IP. Because IP is 'unreliable' (it doesn't check if data arrived), it relies on TCP to catch errors and resend missing packets.",
    "nat": "<strong>NAT (Network Address Translation):</strong> A trick used in IPv4 to share one public IP address among multiple private computers. IPv6 has so many addresses, NAT isn't needed anymore!",
    "metric": "<strong>Metric:</strong> The 'cost' of taking a certain path. If a router has two paths to a destination, it will always choose the path with the LOWER metric (cost).",
    "osi_network": "<strong>OSI Network Layer (Layer 3):</strong> This layer is entirely responsible for Logical Addressing (IP addresses) and Routing packets to their final destination.",
    "error_detection": "<strong>Error Detection:</strong> Checking if data got corrupted during travel. This is a job for the Data Link Layer (Layer 2), not the Network Layer.",
    "pdu": "<strong>PDU (Protocol Data Unit):</strong> The generic term for a piece of data at any layer. (e.g., A packet is a Layer 3 PDU, a frame is a Layer 2 PDU).",
    "transport_layer": "<strong>Transport Layer (Layer 4):</strong> Responsible for segmentation (breaking large data into smaller pieces) and reliability (TCP).",
    "telnet": "<strong>Telnet:</strong> An old, highly unsecure way to remotely control a switch or router. Hackers can easily steal passwords sent via Telnet.",
    "ssh": "<strong>SSH (Secure Shell):</strong> A highly secure, encrypted way for network admins to remotely log into a switch or router. Replaces Telnet.",
    "connectionless": "<strong>Connectionless:</strong> IP protocol is connectionless. It means it just throws the packet into the network hoping it reaches the destination, without setting up a dedicated connection first (unlike a phone call).",
    "ttl": "<strong>TTL (Time-to-Live):</strong> A timer on an IPv4 packet. Every time a router processes the packet, it lowers the TTL by 1. If it hits 0, the router deletes the packet to stop it from looping endlessly forever.",
    "checksum": "<strong>Header Checksum:</strong> A mathematical value in IPv4 used to detect if the packet header got corrupted. IPv6 completely removed this to make processing faster!",
    "flow_label": "<strong>Flow Label:</strong> A new field in IPv6. It tags packets that belong to a real-time stream (like a Zoom video call) so routers keep them on the exact same path to prevent lag.",
    "protocol_field": "<strong>Protocol Field:</strong> A field in the IPv4 header that tells the computer what type of upper-layer data is packed inside (e.g., is the data inside TCP, UDP, or ICMP?).",
    "dscp": "<strong>Differentiated Services (DS):</strong> An 8-bit field in the IPv4 header used to determine the priority of the packet (e.g., VoIP audio gets higher priority than web browsing).",
    "broadcast": "<strong>Broadcast (FF:FF:FF:FF:FF:FF):</strong> A message sent to EVERYONE on the local network.",
    "multicast": "<strong>Multicast:</strong> A message sent to a SPECIFIC GROUP of devices on the network.",
    "unicast": "<strong>Unicast:</strong> A message sent directly to ONE specific device.",
    "console_port": "<strong>Console Port:</strong> A physical port on a switch/router used for out-of-band, direct local management using a rollover cable.",
    "aux_port": "<strong>AUX Port:</strong> An older port on routers used to connect a modem for remote dial-up management.",
    "vty": "<strong>VTY Lines:</strong> Virtual Terminal lines. These are the invisible, logical ports used to remotely SSH or Telnet into a device across the network.",
    "running_config": "<strong>Running Configuration:</strong> The active, currently applied settings in the router's RAM. It gets erased if the power goes out!",
    "startup_config": "<strong>Startup Configuration:</strong> The saved settings in NVRAM that get loaded into RAM when the router boots up.",
    "nvram": "<strong>NVRAM (Non-Volatile RAM):</strong> Permanent memory inside the router. It does not erase when the power goes off. Used to store the startup-config.",
    "flash": "<strong>Flash Memory:</strong> The storage drive inside a router where the Cisco IOS operating system files are kept.",
    "post": "<strong>POST (Power-On Self Test):</strong> A hardware check the router performs immediately when turned on to ensure CPU, RAM, and interfaces are working.",
    "arp_spoofing": "<strong>ARP Spoofing / Poisoning:</strong> A hacker lies to your PC, saying 'Hey, my MAC address is the router!' Your PC updates its ARP table and sends all its traffic to the hacker.",
    "dhcp": "<strong>DHCP:</strong> Automatically hands out IP addresses and default gateways to PCs."
    
    // --- Module 11: Switch Security Configuration ---
    "port_security": "<strong>Port Security:</strong> A switch feature that says 'I will only allow a specific number of MAC addresses on this physical port.' If a hacker plugs in a hub and tries to connect 5 PCs, Port Security shuts them down.",
    "sticky_mac": "<strong>Sticky MAC Address:</strong> A feature where the switch dynamically learns the MAC address of the first PC plugged into the port, and 'sticks' it permanently into the running configuration so you don't have to type it manually.",
    "violation_modes": "<strong>Violation Modes:</strong> How the switch reacts when a hacker breaks Port Security. <strong>Shutdown</strong> kills the port. <strong>Restrict</strong> drops the bad traffic and sends a log message. <strong>Protect</strong> just drops the bad traffic silently.",
    "err_disabled": "<strong>Err-Disabled:</strong> A state where the switch mathematically unplugs the port due to a severe security violation. The port LED turns off. An admin must type 'shutdown' then 'no shutdown' to revive it.",
    "vlan_hopping": "<strong>VLAN Hopping:</strong> A hacker tricks the switch into letting their PC see traffic from all VLANs, bypassing isolation.",
    "dtp": "<strong>DTP (Dynamic Trunking Protocol):</strong> A Cisco protocol that automatically negotiates Trunk links. Hackers spoof DTP to perform VLAN Hopping. Always disable it on user ports using 'switchport mode access'.",
    "native_vlan": "<strong>Native VLAN:</strong> The one VLAN on a trunk that isn't tagged. Hackers use 'double-tagging' to abuse this, which is why we must change it from VLAN 1 to a fake, unused VLAN (like VLAN 999).",
    "dhcp_starvation": "<strong>DHCP Starvation:</strong> An attack where a hacker uses a tool (like Gobbler) to rapidly request every single IP address from the DHCP server until it's empty, creating a Denial of Service for real users.",
    "dhcp_spoofing": "<strong>DHCP Spoofing:</strong> A hacker plugs in their own fake DHCP server and hands out fake Default Gateways so they can intercept all internet traffic.",
    "dhcp_snooping": "<strong>DHCP Snooping:</strong> The ultimate defense against DHCP attacks. You configure 'Trusted' ports (where the real DHCP server is). Any DHCP server replies coming from untrusted user ports are instantly blocked.",
    "dai": "<strong>Dynamic ARP Inspection (DAI):</strong> Protects against ARP Spoofing. It relies on the DHCP Snooping table. If a PC tries to send an ARP message claiming to own an IP it doesn't actually have, DAI drops the packet.",
    "stp": "<strong>STP (Spanning Tree Protocol):</strong> Prevents endless loops in switches. Hackers try to spoof STP messages to become the 'Root Bridge' (the center of the network traffic).",
    "portfast": "<strong>PortFast:</strong> A feature for end-user ports. It skips STP's listening/learning phases (which take 30 seconds) so PCs get internet instantly when plugged in.",
    "bpdu_guard": "<strong>BPDU Guard:</strong> BPDUs are STP messages that only switches should send. If you enable BPDU Guard on a user's port, and the user plugs in an illegal switch, BPDU Guard instantly err-disables the port to save the network."

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
    "ess": "<strong>ESS (Extended Service Set):</strong> Multiple Access Points connected together by a wired network to create one massive, seamless Wi-Fi bubble (so you can walk through a school without losing connection).",
    "csma_ca": "<strong>CSMA/CA (Collision Avoidance):</strong> Wi-Fi is half-duplex (only one device can talk at a time). CSMA/CA means devices 'Listen before they talk' to make sure the airwaves are clear to avoid data collisions.",
    "ssid": "<strong>SSID (Service Set Identifier):</strong> The public name of the Wi-Fi network (e.g., 'Starbucks_Free_WiFi').",
    "passive_mode": "<strong>Passive Discover Mode:</strong> The AP openly shouts its SSID to the world using 'Beacon' frames so your phone can easily find it.",
    "active_mode": "<strong>Active Discover Mode:</strong> The AP hides its name (SSID Cloaking). Your phone has to actively send out a 'Probe Request' asking for the hidden network by name.",
    "split_mac": "<strong>Split MAC Architecture:</strong> Chores are divided! The Access Point handles physical radio stuff (like sending beacons), and the WLC handles the big-brain stuff (like Authentication and roaming).",
    "dtls": "<strong>DTLS Encryption:</strong> A protocol that encrypts the CAPWAP control tunnel between the Access Point and the WLC so hackers can't spy on the management traffic.",
    "flexconnect": "<strong>FlexConnect:</strong> A feature for branch offices. If the remote branch AP loses its connection to the main WLC over the internet, it can act as a standalone router temporarily so local workers don't lose access.",
    "dsss": "<strong>DSSS / OFDM:</strong> Modulation techniques used to spread a wireless signal across frequencies to avoid interference.",
    "rogue_ap": "<strong>Rogue AP:</strong> An unauthorized wireless router plugged into a corporate network. A massive security risk!",
    "evil_twin": "<strong>Evil Twin Attack:</strong> A hacker sets up a rogue AP with the exact same SSID as the real network (e.g., 'Airport_Free_WiFi') to trick people into connecting to the hacker's router.",
    "wep": "<strong>WEP:</strong> The original Wi-Fi security. It is incredibly weak and can be hacked in seconds. NEVER USE IT.",
    "wpa2": "<strong>WPA2:</strong> The modern standard for Wi-Fi security. It uses strong AES encryption.",
    "wpa3": "<strong>WPA3:</strong> The newest, strongest generation of Wi-Fi security. It protects against brute-force password guessing attacks.",
    "aes": "<strong>AES:</strong> Advanced Encryption Standard. A highly secure encryption protocol used by WPA2 to scramble your data so hackers can't read it.",
    "tkip": "<strong>TKIP:</strong> An older, weaker encryption protocol used by WPA (which is no longer recommended).",
    "radius": "<strong>RADIUS (AAA Server):</strong> In 'WPA2-Enterprise' networks, instead of everyone sharing one Wi-Fi password, the WLC uses a RADIUS server to force every employee to log in with their own unique username and password.",
    "qos": "<strong>QoS (Quality of Service):</strong> A router setting that gives priority to time-sensitive traffic (like Zoom calls or VoIP) over less important traffic (like downloading a file).",
    "port_forwarding": "<strong>Port Forwarding:</strong> Punching a specific hole in your router's firewall so traffic from the outside internet can reach a specific server inside your private LAN (like hosting a Minecraft server).",
    "snmp": "<strong>SNMP (Simple Network Management Protocol):</strong> A protocol used to monitor network devices. The WLC can be configured to send 'Traps' (log messages and alerts) to an SNMP server when something goes wrong."

// --- Modules 11-13: IP Addressing & IPv6 ---
    "prefix_length": "<strong>Prefix Length (/24):</strong> The number of '1' bits in a subnet mask. It tells you exactly how many bits are locked for the network portion.",
    "subnet_mask": "<strong>Subnet Mask:</strong> A number (like 255.255.255.0) that divides an IP address into a 'Network' part (the street) and a 'Host' part (the house).",
    "host_bits": "<strong>Host Bits:</strong> The zeroes at the end of a subnet mask. These determine how many devices (hosts) can fit in the network. Formula: 2^n - 2.",
    "broadcast_address": "<strong>Broadcast Address:</strong> The very last IP address in a subnet. Sending a packet here copies it to every single device in that network.",
    "network_address": "<strong>Network Address:</strong> The very first IP address in a subnet. It represents the network itself and cannot be assigned to a PC.",
    "private_ip": "<strong>Private IP (RFC 1918):</strong> Free IP addresses reserved for internal LANs (like 192.168.x.x or 10.x.x.x). They are strictly blocked from the public internet.",
    "multicast": "<strong>Multicast:</strong> Sending data to a specific *group* of devices. In IPv4, this is the 224.0.0.0 range. In IPv6, it starts with FF00::.",
    "unicast": "<strong>Unicast:</strong> Sending data directly from exactly ONE host to exactly ONE other host.",
    "anycast": "<strong>Anycast:</strong> An IPv6 feature where multiple routers share the exact same IP. Your packet is automatically delivered to whichever one is geographically closest.",
    "link_local": "<strong>Link-Local (FE80::):</strong> An IPv6 address used ONLY for communicating on the exact same physical cable/switch. It cannot pass through a router.",
    "global_unicast": "<strong>Global Unicast (2000::):</strong> A public, routable IPv6 address. It is the IPv6 equivalent of a public IPv4 address.",
    "slaac": "<strong>SLAAC:</strong> Stateless Address Autoconfiguration. A feature where the router announces the network prefix, and the PC mathematically generates the rest of its own IPv6 address. No DHCP server needed!",
    "icmpv6": "<strong>ICMPv6:</strong> The control protocol for IPv6. Since ARP doesn't exist in IPv6, ICMPv6 handles MAC address discovery (Neighbor Discovery) as well as Ping and Traceroute.",
    "traceroute": "<strong>Traceroute / tracert:</strong> A tool that tracks the exact path a packet takes through the internet by forcing every router along the way to reveal itself.",
    "dual_stack": "<strong>Dual-Stack:</strong> Running both IPv4 and IPv6 on the exact same network hardware at the same time so both work natively.",
    "tunneling": "<strong>Tunneling:</strong> Wrapping a new IPv6 packet inside an old IPv4 packet so it can safely travel over an older IPv4-only internet provider.",
    "translation": "<strong>Translation:</strong> Converting an IPv6 packet completely into an IPv4 packet (like NAT64) so an IPv6 PC can talk to an IPv4 server.",
    "eui_64": "<strong>EUI-64:</strong> A trick IPv6 SLAAC uses to automatically generate a host ID. It takes your PC's 48-bit MAC address, splits it in half, and inserts 'FFFE' in the middle.",
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
    document.body.insertAdjacentHTML('beforeend', dictionaryHTML);

    const overlay = document.getElementById('dict-overlay');
    const panel = document.getElementById('dict-panel');
    const closeBtn = document.getElementById('close-btn');
    const titleEl = document.getElementById('term-title');
    const defEl = document.getElementById('term-definition');

    const closePanel = () => {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    };

    closeBtn.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);

    // 2. Click event for Dictionary Terms (using event delegation to avoid interfering with radio labels)
    document.body.addEventListener('click', function(e) {
        if(e.target && e.target.classList.contains('term')) {
            e.preventDefault(); // Stop it from clicking a radio button if it's inside one
            const termKey = e.target.getAttribute('data-term');
            const termText = e.target.innerText;
            
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
            
            // Loop through all questions
            document.querySelectorAll('.question-card').forEach(card => {
                total++;
                const correctVal = card.getAttribute('data-correct'); // The correct answer (A, B, C, or D)
                const selectedInput = card.querySelector('input[type="radio"]:checked');
                const explanation = card.querySelector('.explanation-box');

                // Disable all inputs so user can't change answers after grading
                card.querySelectorAll('input').forEach(input => input.disabled = true);

                if (selectedInput) {
                    // Check if they got it right
                    if (selectedInput.value === correctVal) {
                        score++;
                        selectedInput.parentElement.classList.add('correct');
                    } else {
                        // They got it wrong
                        selectedInput.parentElement.classList.add('incorrect');
                        // Highlight the one they SHOULD have clicked
                        const correctLabel = card.querySelector(`input[value="${correctVal}"]`).parentElement;
                        correctLabel.classList.add('correct');
                    }
                } else {
                    // They didn't answer at all - just highlight the correct one
                    const correctLabel = card.querySelector(`input[value="${correctVal}"]`).parentElement;
                    correctLabel.classList.add('correct');
                }
                
                // Show the explanation box
                if (explanation) explanation.classList.add('show');
            });

            // Calculate percentage and show results
            const resultsDiv = document.getElementById('exam-results');
            const percentage = (score / total) * 100;
            
            let message = "";
            let color = "";
            if (percentage >= 90) { message = "🏆 Outstanding! You are absolutely ready for the Prelim!"; color = "#047857"; }
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
            
            // Scroll down to the results smoothly
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }
});