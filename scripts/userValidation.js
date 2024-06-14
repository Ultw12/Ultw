const { shell, ipcRenderer } = require("electron");

const machineId = require('node-machine-id');

function openDiscord() {
    shell.openExternal('https://discord.com/invite/ultw');
}

function openCustomerSupport() {
    shell.openExternal(
        "https://discord.com/channels/1168225074558537820/1168230919514112040"
    );
}

function closeWindow() {
    ipcRenderer.send("close");
}

function minimizeWindow() {
    ipcRenderer.send("minimize");
}

function generateHWID() {
    return machineId.machineIdSync();
}

document.getElementById('rocket-conatainer').style.opacity = 0;
document.getElementById('rocket-conatainer').style.display = 'none';

document.addEventListener("DOMContentLoaded", function () {
    const storedLicenseKey = localStorage.getItem("licenseKey");

    if (storedLicenseKey) {
        document.getElementById("licenseKeyInput").value = storedLicenseKey;
        validateLicense();
    }
});

async function validateLicense() {
    const storedLicenseKey = localStorage.getItem("licenseKey");
    const licenseKey = document.getElementById("licenseKeyInput").value || storedLicenseKey;
   
    const API_KEY = "1grBglD81tUFvlr0-QeFuARXdmHtTZLcu3Mc6d5nI6A";
    const HWID = generateHWID();

    const url = `https://api.whop.com/api/v2/memberships/${licenseKey}/validate_license`;
    const payload = {
        metadata: {
            HWID: HWID,
        },
    };
    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    };

    try {
        document.getElementById('rocket-conatainer').style.opacity = 1;
        document.getElementById('rocket-conatainer').style.display = 'block';
        const response = await axios.post(url, payload, { headers });
        console.log(response.data);

        if (response.status === 201) {
            localStorage.setItem("licenseKey", licenseKey);
            hwidValidationPost()
            
            document.getElementById("successModal").style.display = "block";
            window.location.href = "../index.html";
        } else {
            document.getElementById("errorModal").style.display = "block";
            document.getElementById("licenseKeyInput").value = "";
            

            setTimeout(() => {
                document.getElementById("errorModal").style.display = "none";
            }, 5000);
        }
    } catch (error) {
        console.error("Error validating license key:", error);
        document.getElementById("errorModal").style.display = "block";
        document.getElementById('rocket-conatainer').style.opacity = 0;
        document.getElementById('rocket-conatainer').style.display = 'none';
        document.getElementById("licenseKeyInput").value = "";

        setTimeout(() => {
            document.getElementById("errorModal").style.display = "none";
        }, 5000);
    }
}

async function hwidValidationPost() {
    const licenseKey = document.getElementById("licenseKeyInput").value;
    const hwid = generateHWID();
    const url = `https://game-server-ten.vercel.app/${licenseKey}`;
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
    };

    try {

        const response = await axios.get(url, { headers });
        if (response.data.data.length > 0) {
            const existingHWID = response.data.data[0].hwid;
            if (existingHWID !== hwid) {
                document.getElementById("errorModal").style.display = "block";
                document.getElementById("errorModal").textContent = "license key is used on a different HWID";
                document.getElementById("licenseKeyInput").value = "";
                setTimeout(() => {
                    document.getElementById("errorModal").style.display = "none";
                }, 3000);
                return;
            } else {
                document.getElementById("errorModal").style.display = "block";
                document.getElementById("errorModal").textContent = "This license is already used on this HWID.";

                document.getElementById("licenseKeyInput").value = "";
                localStorage.setItem("licenseKey", licenseKey);

                window.location.href = "../index.html";

                setTimeout(() => {
                    document.getElementById("errorModal").style.display = "none";
                }, 3000);
                validateLicense()
                return;
            }
        } else {

            const payload = {
                hwid: hwid,
                licenseKey: licenseKey
            };
            const storeUrl = `https://game-server-ten.vercel.app/store/`;

            try {
                // Store the new data
                const response = await axios.post(storeUrl, payload, { headers });
                console.log(response.data);
            } catch (error) {
                console.log("Error storing data:", error);

            }
           
        }
    } catch (error) {

        console.log("Error checking data:", error);
        const payload = {
            hwid: hwid,
            licenseKey: licenseKey
        };
        const storeUrl = `https://game-server-ten.vercel.app/store/`;

        try {
            // Store the new data
            const response = await axios.post(storeUrl, payload, { headers });
            console.log(response.data);
        } catch (error) {
            console.log("Error storing data:", error);

        }
       

    }
}

const modals = document.querySelectorAll('.modal');
modals.forEach(modal => {
    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

