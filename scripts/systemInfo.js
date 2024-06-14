const { shell, ipcRenderer } = require("electron");
const si = require("systeminformation");
const os = require("os");

const osDisplayNames = {
  win32: "Windows",
  darwin: "macOS",
  linux: "Linux",
  // Add more platform mappings as needed
};

function openDiscord() {
  shell.openExternal("https://discord.com/invite/ultw");
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

function formatOSInfo(platform, release) {
  const osName = osDisplayNames[platform] || platform;
  return `${osName} ${release}`;
}

let dataLoading = false;
let fetchDataPromise;

async function populateAllInfo() {
  try {
    dataLoading = true;
    document.getElementById("loadingModal").style.display = "block"; 
    const [
      systemInfo,
      cpuInfo,
      motherboardInfo,
      ramInfo,
      gpuInfo,
      soundCardInfo,
    ] = await Promise.all([
      si.system(),
      si.cpu(),
      si.baseboard(),
      si.mem(),
      si.graphics(),
      si.audio(),
    ]);

    if (!dataLoading) return; 

    const deviceName = `${systemInfo.manufacturer} ${systemInfo.model}`;
    const osInfo = formatOSInfo(os.platform(), os.release());
    const cpuModel = `${cpuInfo.manufacturer} ${cpuInfo.brand}`;
    const motherboardModel = `${motherboardInfo.manufacturer} ${motherboardInfo.model}`;
    const totalRAM = Math.round(ramInfo.total / (1024 * 1024 * 1024));
    const gpuModel = gpuInfo.controllers[0].model;
    const soundCardModel =
      soundCardInfo && soundCardInfo.length > 0
        ? soundCardInfo[0].name
        : "Unknown";

    const basicInfoDiv = document.querySelector(".basic-info");
    basicInfoDiv.innerHTML = `
            <p>${deviceName}</p>
            <p class="faded">${osInfo}</p>
        `;

    const cpuInfoDiv = document.querySelector(".cpu-info");
    cpuInfoDiv.children[0].textContent = cpuModel;

    const motherboardInfoDiv = document.querySelector(".motherboard-info");
    motherboardInfoDiv.children[0].textContent = motherboardModel;

    const ramInfoDiv = document.querySelector(".ram-info");
    ramInfoDiv.children[0].textContent = `${totalRAM} GB`;

    const gpuInfoDiv = document.querySelector(".gpu-info");
    gpuInfoDiv.children[0].textContent = gpuModel;

    const soundCardInfoDiv = document.querySelector(".sound-card-info");
    soundCardInfoDiv.children[0].textContent = soundCardModel;

    document.getElementById("loadingModal").style.display = "none";
    dataLoading = false;
  } catch (error) {
    console.error("Error fetching system information:", error);
    document.getElementById("loadingModal").style.display = "none";
    dataLoading = false;
  }
}

document.querySelectorAll(".links a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (dataLoading) {
      event.preventDefault();
      console.log("Data is still loading. Please wait.");
    }
  });
});

populateAllInfo();
window.addEventListener("beforeunload", () => {
  if (fetchDataPromise) {
    fetchDataPromise.cancel();
  }
});
