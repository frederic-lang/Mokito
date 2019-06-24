const { app, ipcMain, dialog } = require('electron');
// const { exec } = require('child_process');
const fs = require('fs');

const { getCurrentWindow, createMainWindow } = require('./main');


function saveFile(newFilename) {
    if(!newFilename){
        return;
    }
    let currentWindow = getCurrentWindow();
    ipcMain.on('fileContent', (event, fileContent) => {
        fs.writeFile(newFilename, fileContent, function(err) {
            if(err) {
                dialog.showErrorBox("Erreur", err);
                return null;
            }
//            console.log("The file was saved!");
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

function getFilenameAndSave(webContents, saveAs = false){
//    console.log('getFilename');
    ipcMain.once('filename', (event, filename) => {
//        console.log(filename);
        saveDialog(filename, webContents, saveAs);
    });
    webContents.send('getFilename');
}

function saveDialog(filename, webContents, saveAs = false){
    if( isFilePath(filename) && !saveAs){
      saveFile(filename)
    }
    else if ( isFilePath(filename) && saveAs ){
        const options = {
            defaultPath: filename,
        }
        const path = dialog.showSaveDialog(null, options);
        saveFile(path);
        webContents.send('setFilename', path);
    }
    else {
      const options = {
        defaultPath: app.getPath('documents') + "/" + filename + ".ml",
      }
      const path = dialog.showSaveDialog(null, options);
      saveFile(path);
      webContents.send('setFilename', path);
    }
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
    openDialog : openDialog,
}