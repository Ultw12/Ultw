  const { shell, ipcRenderer } = require('electron');
  const { exec } = require('child_process');
  const path = require('path');
  const Datastore = require('nedb');

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

  const db = new Datastore({ filename: './database/database.db', autoload: true });

  function showRestoreNameInput() {
    const inputContainer = document.getElementById('restoreNameInputContainer');
    inputContainer.style.opacity = 1;
  }

  function loadRestorePoints() {
    db.find({}, (err, docs) => {
      if (err) {
        console.error(`Error loading restore points: ${err}`);
        return;
      }
      docs.forEach(doc => {
        displayRestorePoint(doc._id, doc.name, doc.date);
      });
    });
  }

  function deleteRestorePoint(id) {
    const entry = document.getElementById(id);

    if (entry) {
      entry.remove();
      db.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
          console.error(`Error deleting restore point: ${err}`);
        } else {
          console.log(`Restore point deleted successfully. Removed ${numRemoved} entry.`);
        }
      });
    } else {
      console.error(`Entry with id ${id} not found.`);
    }
  }

  function displayRestorePoint(id, name, date) {
    const newEntry = document.createElement('div');
    newEntry.classList.add('history');
    newEntry.id = id;
    newEntry.innerHTML = `
      <div class="name">${name}</div>
      <div class="date">${date}</div>
      <div class="restore-btn">
        <button class="delete" onclick="deleteRestorePoint('${id}')">
          <img src="../assets/delete.png"/>
        </button>
        <button onclick="restoreBackup()">restore backup</button>
      </div>
    `;
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.appendChild(newEntry);
  }

  function createRestorePoint() {
    const restoreNameInput = document.getElementById('restoreNameInput');
    const restorePointName = restoreNameInput.value.trim(); 
    const restoreNameError = document.getElementById('restoreNameError');

    if (!restorePointName) {
      restoreNameError.style.display = 'inline';
      return; 
    }

    restoreNameError.style.display = 'none';
    document.getElementById('rocket-conatainer').style.display = 'flex';
    document.getElementById('rocket-conatainer').style.opacity = 1;
    
    const command = `powershell -ExecutionPolicy Bypass -Command "Checkpoint-Computer -Description '${restorePointName}' -RestorePointType 'MODIFY_SETTINGS'"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error creating system restore point: ${error}`);
        return;
      }

      console.log('System restore point created successfully');
      const currentDate = new Date().toLocaleString('en-GB');

      const restorePointData = {
        name: restorePointName,
        date: currentDate
      };

      db.insert(restorePointData, (err, newDoc) => {
        if (err) {
          console.error(`Error inserting data into database: ${err}`);
        } else {
          console.log('Data inserted into database:', newDoc);
          displayRestorePoint(newDoc._id, restorePointData.name, restorePointData.date);
          restoreNameInput.value = "";
          document.getElementById('rocket-conatainer').style.opacity = 0;
          document.getElementById('rocket-conatainer').style.display = 'none';
        }
      });
    });
}

  function restoreBackup() {
    shell.openPath('C:\\Windows\\System32\\rstrui.exe');
  }

  loadRestorePoints();