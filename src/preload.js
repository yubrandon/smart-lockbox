const { contextBridge } = require('electron');

const { loginMenu } = require('./scripts/menus.js');
contextBridge.exposeInMainWorld('electron', {
    loginMenu: () => loginMenu(),
});