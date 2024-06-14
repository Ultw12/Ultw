const { shell, ipcRenderer } = require("electron");
const path = require("path");
const { exec } = require("child_process");

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

function showButton() {
  const button = document.getElementById("hoverButton");
  if (button) {
    button.classList.remove("hidden");
  }
}

function hideButton() {
  const button = document.getElementById("hoverButton");
  if (button) {
    button.classList.add("hidden");
  }
}

function gameOptimize() {
  document.getElementById("rocket-conatainer").style.display = "flex";
  document.getElementById("rocket-conatainer").style.opacity = 1;

  const rocketText = document.querySelector("#rocket-conatainer .rocket-text");
  if (rocketText) {
    rocketText.textContent = "Optimizing Game . . .";
  }

  exec('bcdedit /set useplatformclock No', (error, stdout, stderr) => {
    handleBCDEditExecutionResult('useplatformclock', error, stderr, stdout);
    exec('bcdedit /set allowedinmemorysettings 0', (error, stdout, stderr) => {
      handleBCDEditExecutionResult('allowedinmemorysettings', error, stderr, stdout);
      exec('bcdedit /set tscsyncpolicy Enhanced', (error, stdout, stderr) => {
        handleBCDEditExecutionResult('tscsyncpolicy', error, stderr, stdout);
        exec('bcdedit /set disabledynamictick Yes', (error, stdout, stderr) => {
          handleBCDEditExecutionResult('disabledynamictick', error, stderr, stdout);
          exec('bcdedit /set x2apicpolicy Enable', (error, stdout, stderr) => {
            handleBCDEditExecutionResult('x2apicpolicy', error, stderr, stdout);
            exec('bcdedit /set perfmem 0', (error, stdout, stderr) => {
              handleBCDEditExecutionResult('perfmem', error, stderr, stdout);
              exec('bcdedit /set uselegacyapicmode No', (error, stdout, stderr) => {
                handleBCDEditExecutionResult('uselegacyapicmode', error, stderr, stdout);
                exec('bcdedit /set MSI Default', (error, stdout, stderr) => {
                  handleBCDEditExecutionResult('MSI', error, stderr, stdout);
                  exec('bcdedit /set debug No', (error, stdout, stderr) => {
                    handleBCDEditExecutionResult('debug', error, stderr, stdout);

                    console.log("Game optimization completed");

                    setTimeout(() => {
                   
                      document.getElementById("successModal").style.display = "block";
                      setTimeout(() => {
                        document.getElementById("successModal").style.display = "none";
                      }, 5000);
                    }, 3000);
                    setTimeout(() => {
                      document.getElementById("rocket-conatainer").style.display = "none";
                    }, 3000);

                  });
                });
              });
            });
          });
        });
      });
    });
  });
}

function handleBCDEditExecutionResult(settingName, error, stderr, stdout) {
  const terminalElement = document.getElementById("terminal");
  terminalElement.innerHTML = "";

  if (error || stderr) {
    const errorMessage = `Error setting ${settingName}: ${error ? error.message : stderr}`;
    console.error(errorMessage);
    showErrorModal(errorMessage);
    appendToTerminal(errorMessage);
  } else {
    const successMessage = `Setting ${settingName} executed successfully: ${stdout}`;
    console.log(successMessage);
    appendToTerminal(successMessage);
  }
}


function appendToTerminal(log) {
  const terminal = document.getElementById("terminal");
  if (terminal) {
    // Split the log by new lines
    const lines = log.split("\n");

    // Append each line as a separate paragraph element
    lines.forEach(line => {
      // Create a new paragraph element to display the line
      const logElement = document.createElement("p");
      logElement.textContent = line;

      // Append the log element to the terminal
      terminal.appendChild(logElement);
    });

    // Scroll to the bottom of the terminal to show the latest log
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function showErrorModal(errorMessage) {
  setTimeout(() => {
    const errorModal = document.getElementById("errorModal");
    errorModal.style.display = "block";
    errorModal.querySelector(".modal-content-reg").textContent = errorMessage;
    setTimeout(() => {
      errorModal.style.display = "none";
    }, 5000);
  }, 3000); 
}