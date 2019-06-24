const { app, ipcMain, dialog } = require('electron');
// const { exec } = require('child_process');
const fs = require('fs');

const { createMainWindow } = require('./main');


function saveFile(currentWindow, newFilename, quit = false) {
    if(!newFilename){
        return;
    }
    ipcMain.on('fileContent', (event, fileContent) => {
        fs.writeFile(newFilename, fileContent, function(err) {
            if(err) {
                dialog.showErrorBox("Erreur", err);
                return null;
            }
//            console.log("The file was saved!");
            if(quit) currentWindow.destroy();
        }); 
    });
    currentWindow.webContents.send('getFileContent');
}

function openFile(path) {
    console.log(path);
    let content = fs.readFileSync(path, 'utf8');
//    console.log(content);
    return content;
}

function isFilePath(filename) {
    return !filename.startsWith("Draft");
}

function getFilenameAndSave(currentWindow, saveAs = false, quit = false){
//    console.log('getFilename');
    ipcMain.once('filename', (event, filename) => {
//        console.log(filename);
        saveDialog(filename, currentWindow, saveAs, quit);
    });
    currentWindow.webContents.send('getFilename');
}

function saveDialog(filename, currentWindow, saveAs = false, quit = false){
    if( isFilePath(filename) && !saveAs){
      saveFile(currentWindow, filename, quit)
    }
    else if ( isFilePath(filename) && saveAs ){
        const options = {
            defaultPath: filename,
        }
        const path = dialog.showSaveDialog(null, options);
        saveFile(currentWindow, path, quit);
        currentWindow.webContents.send('setFilename', path);
    }
    else {
      const options = {
        defaultPath: app.getPath('documents') + "/" + filename + ".ml",
      }
      const path = dialog.showSaveDialog(null, options);
      saveFile(currentWindow, path, quit);
      currentWindow.webContents.send('setFilename', path);
    }
    currentWindow.webContents.send('fileSaved')
}

function saveBeforeCloseDialog(currentWindow){
    //options object for dialog.showMessageBox(...)
    let options = {
        type : "question",
        buttons : ["Yes", "No", "Cancel"],
        defaultId : 0,
        title: "Quitter",
        message: "Voulez vous enregistrer avant de quitter ?",
        cancelId : 2,
        noLink: true,
    }
    dialog.showMessageBox(currentWindow, options, (res) => {
    if (res === 0){
    //Yes button pressed
        getFilenameAndSave(currentWindow, false, true);
    }
    else if (res === 1) {
    //No button pressed
        currentWindow.destroy();
        app.quit();
    }
    else if (res === 2){
    //Cancel button pressed
    }
    });
}

function openDialog() {
    dialog.showOpenDialog(
    //            {properties : ['openFile']},  
    function (fileList) {
        if(!fileList) { return ; }
        const [file] = fileList;
        const content = openFile(file);
        createMainWindow(file, content);
    });
}


module.exports = {
    openFile : openFile,
    getFilenameAndSave : getFilenameAndSave,
    saveDialog : saveDialog,
    saveBeforeCloseDialog : saveBeforeCloseDialog,
    openDialog : openDialog,
}