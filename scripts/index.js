const si = require("systeminformation");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const Datastore = require('nedb');
const db = new Datastore({ filename: './database/Fps.db', autoload: true });

const cpuElement = document.querySelector(".cpu-details span");
const diskElement = document.querySelector(".disk-details span");
const memoryElement = document.querySelector(".memory-details span");

function reviewChannel() {
  shell.openExternal("https://discord.com/channels/1168225074558537820/1168231380157743274");
}

async function updateDetails() {
  try {
    const [cpuLoad, diskUsage, memoryData] = await Promise.all([
      si.currentLoad(),
      si.fsSize(),
      si.mem(),
    ]);

    // Update CPU details
    if (
      cpuLoad &&
      cpuLoad.currentLoad !== undefined &&
      cpuLoad.currentLoad !== null
    ) {
      const formattedCpuLoad = parseInt(cpuLoad.currentLoad.toFixed(2));
      cpuElement.textContent = `CPU ${formattedCpuLoad}%`;
    } else {
      console.error("CPU usage data is undefined or null");
    }

    // Update disk details
    if (diskUsage && diskUsage.length > 0) {
      const totalDiskSize = diskUsage[0].size;
      const usedDiskSize = diskUsage[0].used;
      const diskUsagePercentage = Math.round(
        (usedDiskSize / totalDiskSize) * 100
      );
      diskElement.textContent = `Disk ${diskUsagePercentage}%`;
    } else {
      console.error("Disk usage data is undefined, null, or empty");
    }

    // Update memory details
    if (
      memoryData &&
      memoryData.used !== undefined &&
      memoryData.total !== undefined
    ) {
      const usedMemoryPercentage = Math.round(
        (memoryData.used / memoryData.total) * 100
      );
      memoryElement.textContent = `Memory ${usedMemoryPercentage}%`;
    } else {
      console.error("Memory data is undefined or null");
    }
  } catch (error) {
    console.error("Error updating details:", error);
  }
}

// Initial update
updateDetails();

// Schedule periodic updates
setInterval(updateDetails, 5000);

function speedOptimize(text) {
  document.getElementById("rocket-conatainer").style.display = "flex";
  document.getElementById("rocket-conatainer").style.opacity = 1;

  const rocketText = document.querySelector("#rocket-conatainer .rocket-text");
  if (rocketText) {
    rocketText.textContent = text;
  }

  const batchFilePath = path.resolve(__dirname, "./batch/speed_optimizer.bat");
  console.log(batchFilePath);

  const command = `"${batchFilePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error optimizing speed: ${error}`);
      return;
    }

    console.log("Speed optimized");

    document.getElementById("rocket-conatainer").style.display = "none";
  });
}

function appendToTerminal(log) {
  const terminal = document.getElementById("terminal");
  if (terminal) {
    // Create a new paragraph element to display the log
    const logElement = document.createElement("p");
    logElement.textContent = log;

    // Append the log element to the terminal
    terminal.appendChild(logElement);

    // Scroll to the bottom of the terminal to show the latest log
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function systemClean(text) {
  document.getElementById("rocket-conatainer").style.display = "flex";
  document.getElementById("rocket-conatainer").style.opacity = 1;

  const rocketText = document.querySelector("#opration");
  if (rocketText) {
    rocketText.textContent = text;
  }

  const commands = [
    "del *.log /a /s /q /f 2>NUL",
    "RD /S /Q %temp% 2>NUL",
    "takeown /f \"%temp%\" /r /d y",
    "takeown /f \"C:\\Windows\\Temp\" /r /d y",
    "RD /S /Q C:\\Windows\\Temp 2>NUL",
    "MKDIR C:\\Windows\\Temp",
    "takeown /f \"C:\\Windows\\Temp\" /r /d y",
    "takeown /f %temp% /r /d y",
    "ipconfig /flushdns",
    "gpupdate /force",
    "rd /s /q \"C:\\Windows\\SoftwareDistribution\"",
    "md \"C:\\Windows\\SoftwareDistribution\"",
  ];

  executeCommands(commands);
}



function executeCommands(commands) {
  if (commands.length === 0) {
    handleSystemCleaningSuccess();
    return;
  }

  const command = commands.shift();
  console.log(`Executing command: ${command}`);
  exec(command, { cwd: 'C:\\' }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command "${command}": ${error.message}`);
      handleSystemCleaningError(error.message);
      return;
    }
    if (stderr) {
      console.error(`Error executing command "${command}": ${stderr}`);
      handleSystemCleaningError(stderr);
      return;
    }
    console.log(`Command "${command}" executed successfully`);
    appendToTerminal(stdout);
    executeCommands(commands);
  });
}

function handleSystemCleaningError(errorMessage) {
  setTimeout(() => {
    const errorModal = document.getElementById("errorModal");
    errorModal.style.display = "block";
    errorModal.querySelector(".modal-content-reg").textContent = `Error cleaning system: ${errorMessage}`;
    setTimeout(() => {
      errorModal.style.display = "none";
    }, 5000);
  }, 3000);
}

function handleSystemCleaningSuccess() {
  setTimeout(() => {
    document.getElementById("successModal").style.display = "block";
    setTimeout(() => {
      document.getElementById("successModal").style.display = "none";
    }, 5000);
  }, 3000);

  setTimeout(() => {
    document.getElementById("rocket-conatainer").style.display = "none";
  }, 3000);
}

// Check if directory exists
function directoryExists(directory) {
  try {
    return fs.existsSync(directory);
  } catch (err) {
    console.error(`Error checking directory existence: ${err}`);
    return false;
  }
}

let slideIndex = 0;
const cardWidth = document.querySelector('.game-container').offsetWidth + 20; // Card width including margin

function showSlides() {
  const slides = document.querySelector('.slides');
  if (!slides) return;

  const cards = document.querySelectorAll('.game-container');
  const numCards = cards.length;

  slideIndex++;
  if (slideIndex > numCards - 4) {
    slideIndex = 0;
    slides.style.transition = 'none';
    slides.style.transform = `translateX(0px)`;
    setTimeout(() => {
      slides.style.transition = 'transform 0.5s ease';
    }, 50);
  }

  slides.style.transform = `translateX(-${slideIndex * cardWidth}px)`;
  setTimeout(showSlides, 2000);
}

document.addEventListener('DOMContentLoaded', function () {
  showSlides();
});
// Function to retrieve click data from the database

