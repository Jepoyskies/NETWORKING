// Function to grade the interactive WLC GUI Practice
function checkWlcSim() {
    const ssid = document.getElementById('sim-ssid').value.trim();
    const status = document.getElementById('sim-status').checked;
    const l2 = document.getElementById('sim-l2').value;
    const akm = document.getElementById('sim-akm').value;
    const psk = document.getElementById('sim-psk').value.trim();
    const feedback = document.getElementById('gui-feedback');

    let errors = [];

    // Check SSID
    if (ssid !== "GuestNet") {
        errors.push("SSID must be exactly 'GuestNet'.");
    }

    // Check Status (THE BIG TRAP)
    if (!status) {
        errors.push("CRITICAL: You forgot to check the 'Enabled' box! The AP will not broadcast.");
    }

    // Check Security
    if (l2 !== "wpa") {
        errors.push("Layer 2 Security must be set to 'WPA+WPA2'.");
    }

    // Check Auth Management
    if (akm !== "psk") {
        errors.push("Auth Key Management must be set to 'PSK' for a shared password.");
    }

    // Check Password
    if (psk !== "Cisco123") {
        errors.push("PSK Passphrase must be 'Cisco123'.");
    }

    feedback.style.display = "block";

    if (errors.length === 0) {
        feedback.style.backgroundColor = "#dcfce7";
        feedback.style.color = "#166534";
        feedback.style.border = "2px solid #22c55e";
        feedback.innerHTML = "✅ <strong>PERFECT!</strong> You successfully configured the WLC. The AP is now broadcasting 'GuestNet' and the laptop can connect!";
    } else {
        feedback.style.backgroundColor = "#fee2e2";
        feedback.style.color = "#991b1b";
        feedback.style.border = "2px solid #ef4444";
        feedback.innerHTML = "❌ <strong>ERRORS DETECTED:</strong><br><ul style='margin: 5px 0 0 20px; padding:0;'>" + errors.map(e => `<li>${e}</li>`).join("") + "</ul>";
    }
}