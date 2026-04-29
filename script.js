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