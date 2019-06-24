const { app, dialog, ipcMain } = require('electron');

const {openFile, getFilenameAndSave, openDialog} = require('./fileUtil');
const {createCreditsWindow, createMainWindow, getCurrentWindow } = require('./main');


const mainMenuTemplate =  [
  // Each object is a dropdown
  {
    label: app.getName(),
    submenu:[
      {
        label : "Préférences"
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Fichier',
    submenu:[
      {
        label:'Nouveau',
        accelerator:process.platform == 'darwin' ? 'Command+N' : 'Ctrl+N',
        click(){
          createMainWindow();
        }
      },
      {
        label:'Ouvrir',
        accelerator:process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
        click(){
          openDialog();
        }
      },
      {
        label: 'Enregistrer',
        accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
        click(item, focusedWindow){
          getFilenameAndSave(focusedWindow);
        }
      },
      {
        label: 'Enregistrer sous',
        click(item, focusedWindow){
          getFilenameAndSave(focusedWindow, true);
        }
      }
    ]
  },
  {
    label: 'Edition',
    submenu:[
      {
        label:'Annuler',
        role: 'undo'
      },
      {
        label:'Répéter',
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        label: 'Couper',
        role: 'cut'
      },
      {
        label: 'Copier',
        role: 'copy'
      },
      {
        label: 'Coller',
        role : 'paste'
      }
    ]
  },
  {
    label: 'Aide',
    submenu:[
      {
        label:'Aide'
      },
      {
        label:'Rechercher'
      },
      {
        label:'Crédits',
        accelerator:process.platform == 'darwin' ? 'Command+M' : 'Ctrl+M',
        click(){
          createCreditsWindow();
        }
      }
    ]
  }
];


// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}

module.exports = { 
  mainMenuTemplate: mainMenuTemplate,
}
