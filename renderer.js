const { shell, ipcRenderer } = require("electron");


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


