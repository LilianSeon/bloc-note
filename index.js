const electron = require('electron');
const url = require ('url');
const path = require('path');
const Tray = electron.Tray;
const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;
const { session } = require('electron');
const modal = require('electron-modal');
const Store = require('electron-store');
const store = new Store();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let loginWindow;
let addWindow;
let ses;


const mainMenuTemplate = [
{
	label:'File',
	submenu:[
	{
		label:'Add Item',
		accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
		click(){
			creatAddWindow();
		}
	},
	{
		label:'Clear Item',
		click(){
			mainWindow.webContents.send('item:clear');
		}
	},
	{
		label:'Quit',
		accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
		click(){
			app.quit();
		}
	}
	]
}
];

function createWindow () {
	ses = session.fromPartition('persist:name');
  // Create the browser window.
	mainWindow = new BrowserWindow({
		minWidth: 900,
		minHeight: 340,
		icon: 'img/logo.png',
		width: 900,
		height: 600,
		center: true,
	  })

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'notes.html'),
		protocal: 'file:',
		slashes: true
	}));
  // and load the index.html of the app.

	loginWindow = new BrowserWindow({
		minWidth: 900,
		minHeight: 340,
		icon: 'img/logo.png',
		width: 900,
		height: 600,
		center: true,
	  })

	loginWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'login_page.html'),
		protocal: 'file:',
		slashes: true
	}));

	loginWindow.loadFile('login_page.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
	mainWindow.on('closed', function(){
			app.quit();
	});

	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);

	const tray = new Tray('img/logo.png');

	tray.setToolTip('Bloc-Note');

	ipcMain.on('information-dialog-selection', function () {
		const option = {
			type: 'error',
			buttons: ['OK'],
			title: 'Attention !',
			message: 'Cette note est déjà enregistré sur le bureau.'
		};
		dialog.showMessageBox(null, option, (response) => {

		});
	})
}

// modal.open(path.join(__dirname, 'note.html'), {
//
//   // Any BrowserWindow options
//   width: 400,
//   height: 300
//
// }, {
//
//   // Any data you want to pass to the modal
//   title: 'electron-modal example'
//
// }).then((instance) => {
//   instance.on('increment', () => {
//     console.log('Increment event received!');
//   });
//
//   instance.on('decrement', () => {
//     console.log('Decrement event received!');
//   });
// });

ipcMain.on('show_notes', function(){ // Reload App
	  loginWindow.loadFile('notes.html')
});

ipcMain.on('get_id', function(event){
	 event.returnValue = store.get('id')
});


ipcMain.on('create_session', function(event, id){
	if (id != false){
			loginWindow.loadFile('notes.html')
			store.set('id', id);
	}else{

	}
});



ipcMain.on('verif_session', function(){
	if(store.get('id') == null){
		 loginWindow.loadFile('login_page.html')
	}
});

ipcMain.on('destroy_session', function(){
	store.delete('id');
});


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
 	createWindow()
  // Run this on the ready event to setup everything
  // needed on the main process.
  modal.setup();

  // Create browser windows, etc...

});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// Add developper tools item if not in prod
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developper Tools',
		submenu:[
		{
			label: 'Toggle DevTools',
			accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
			click(item, focusedWindow){
				focusedWindow.toggleDevTools();
			}
		},
		{
			role: 'reload'
		}
		]
	});
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
