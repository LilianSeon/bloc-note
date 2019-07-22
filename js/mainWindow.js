var fs = require('fs');
const request = require('request');
var twilio = require('twilio');
const googleTTS = require("google-tts-api");
const { createAudio } = require('node-mp3-player');
const editJsonFile = require("edit-json-file");
const updateJsonFile = require('update-json-file');
const userHome = require('user-home');
const ipc = require('electron').ipcRenderer;
let $ = require('jquery');



function noteCount(){ // Count the amount of note saved
	var read = fs.readFileSync('myjsonfile.json');
	var data = JSON.parse(read);
	var data2 = JSON.stringify(data);
	var cb = data2.match(/"id":/g);

	return cb.length;
}

	$('#ajoutez').click(function(){
		$.ajax({
			url: 'http://localhost:3000/note/create',
			data: 'title='+ $('#title').val() +'&note='+ $('#message').val(),
			type: 'post',
			success: function(data) {
				displayNote()
			}
		});
	})

const electron = require('electron');

// document.getElementById('menu4').addEventListener('click', function () { // Quit the App
// 	ipc.send('quit');
// });
//
// document.getElementById('menu0').addEventListener('click', function () { // Reload App
// 	ipc.send('reload');
// });

function toast(i) { //Toggle Toast
	var x = document.getElementById("snackbar"+i);
	x.className = "show";
	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
}


	fs.stat('myjsonfile.json', function(err, stats){// If json file do exist
	if(!err){
		displayNote();
	}else{
		alert('No file json');
	}
	});

	function getFilesizeInBytes(filename) {
        const stats = fs.statSync(filename);
        const fileSizeInBytes = stats.size;
        return fileSizeInBytes;
	}

function loop(){

	const stats = fs.statSync("myjsonfile.json");
	var fileSize = stats.size;
	window.setInterval(function(){ // Display the new note almost in real time.
		if(fileSize != getFilesizeInBytes('myjsonfile.json')){
			displayNote();
			fileSize = getFilesizeInBytes('myjsonfile.json');
		}
	},200, 1);
}

function displayNote(stop){
	// $.ajax({
	// 	url: 'http://localhost:3000/note/show/all',
	// 	type: 'get',
	// 	success: function(data) {
	// 		for(i = 0; i < (data.lenght-1); i++){
	// 			console.log(data[i].title)
	// 		}
	//
	// 		$(".container").val(data)
	// 	}
	// });
}

function characteresCount(max){
	var textArea = document.getElementById('message');
	var count = textArea.value.length;
	var circle2 = document.getElementById('circle2');

	circle2.style.strokeDashoffset = 50-(50*count/max);

	if (circle2.style.strokeDashoffset < 0) { // To stop filling the circle
		circle2.style.strokeDashoffset = 0;
	}

	if (circle2.style.strokeDashoffset < 51 && circle2.style.strokeDashoffset < 10) { // Blue color
		circle2.classList.remove('RadialCounter--warn', 'RadialCounter--danger');
		circle2.classList.add('RadialCounter--safe');
		document.getElementById('ajoutez').style.cursor = "pointer";
	}
	if (circle2.style.strokeDashoffset < 9 && circle2.style.strokeDashoffset > 0 ) { // Orange color
		circle2.classList.remove('RadialCounter--safe', 'RadialCounter--danger', 'RadialCounter--pulse');
		circle2.classList.add('RadialCounter--warn', 'RadialCounter--pulse');
		document.getElementById('ajoutez').style.cursor = "pointer";
	}
	if (circle2.style.strokeDashoffset == 0) { // Red color
		circle2.classList.remove('RadialCounter--safe', 'RadialCounter--warn', 'RadialCounter--pulse');
		circle2.classList.add('RadialCounter--danger', 'RadialCounter--pulse');
		document.getElementById('ajoutez').style.cursor = "not-allowed";
	}
	if (max-count < 0) { // display the extra characteres
		document.getElementById('over').style.display = "inline";
		document.getElementById('over').innerHTML = max-count;
		document.getElementById('errorCharacteres').style.display = "inline";
	}else{
		document.getElementById('over').style.display = "none";
		document.getElementById('errorCharacteres').style.display = "none";
	}
}

// function dragstart(event, id){
// 	fs.readFile("myjsonfile.json", 'utf8', function (err, data) {
// 		if (err) return cosole.log(err);
// 		var data = JSON.parse(data);
// 		var count = Object.keys(data.note).length-1;
// 		for(var i = 0; i <= count; i++){
// 			if(data.note[i].id == id){
// 				title = data.note[i].title;
// 				message = data.note[i].message;
// 			}
// 		}
// 	});
// 	if (event.screenX == 0 && event.screenY == 0) { // if the user is leaving the window
// 		id = id++;
// 		if (fs.existsSync(userHome+'/Desktop/note'+id+'.txt') == false) { // Check if the file is not already saved on desktop, if not then save it
// 			fs.appendFile(userHome+'/Desktop/note'+id+'.txt', title+'\r\n\r\n'+message, function (err) {
// 				if (err) throw err;
// 				return true;
// 			});
// 		}else{
// 			ipc.send('information-dialog-selection'); // send a message to index.js to throw an error.
// 		}
// 	}
// }

function speak(id) { // TTS
	var title, message;
	title = document.getElementById('titleNote'+id).innerText;
	message = document.getElementById('messageNote'+id).innerText;
	new Audio('https://translate.google.com/translate_tts?ie=UTF-8&q='+encodeURIComponent(title.replace("20htpm","'"))+'%20.'+encodeURIComponent(message).replace("20htpm", "'")+'&tl=fr&client=tw-ob').play();
}




ipcMain.on('new_note', function(){ // Reload App
	$.ajax({
		url: 'http://localhost:3000/note/create',
		data: 'id='+store.get('id'),
		type: 'post',
		success: function(data) {
			// ipc.send('show_notes');
			// ipc.send('verif_session');
		}
	});
});

$('#new_note').click(function(){
	modal.emit('increment').then(() => {
	 console.log('The increment event was sent');
	});
})

if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

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


document.getElementById('menu1').addEventListener('click', function () { // Click on search menu
	var search = document.getElementById('recherche');
	if (search.style.display == "none" || search.style.display == "") {
		search.style.display = 'block';
	}else{
		search.style.display = "none";
	}
});

function search(){ //Display the notes that the user is looking for
	var input, filter, divNote, note, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    divNote = document.getElementById("note");
    note = $('.card')
    for (i = 0; i < note.length; i++) {
        a = note[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            note[i].style.display = "";
        } else {
            note[i].style.display = "none";
        }
    }
}
