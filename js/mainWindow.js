const electron = require('electron');
var fs = require('fs');
const request = require('request');
var twilio = require('twilio');
const googleTTS = require("google-tts-api");
const { createAudio } = require('node-mp3-player');
const editJsonFile = require("edit-json-file");
const updateJsonFile = require('update-json-file');
const userHome = require('user-home');
const ipc = require('electron').ipcRenderer;

function noteCount(){ // Count the amount of note saved
	var read = fs.readFileSync('myjsonfile.json');
	var data = JSON.parse(read);
	var data2 = JSON.stringify(data);
	var cb = data2.match(/"id":/g);

	return cb.length;
}

	document.getElementById('ajoutez').addEventListener('click',function(){ // When the user fill a new note.
		title = document.getElementById('title').value;
		message = document.getElementById('message').value;

		var client = new twilio('ACe1c50abb0d28db08f7b6dd98dc7bd4a2', '286416c143cec740a6daf985a83078c8');
			client.messages.create({ // Send a SMS when user create a new note
				to: '0658549675', // Lilian number
				from: '+33644602703',
				body: 'Nouvelle note ajouté !' // Text
			});
	});


// Get the modal
var NewNoteModal = document.getElementById('closeNewNote');

// When the user clicks on <i> (x), close the modal for a new note
NewNoteModal.onclick = function() {
    instances3.close();
}



document.getElementById('logo').addEventListener('click', function () { // Reload App
	ipc.send('reload');
});


function displayNote(stop){
	if (stop) return; // stop the refreshing of the notes.
	
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

function modif(i){ // Modify the note selected

	return i;
} /* Fin modif() */


function deleteNote(id, bool){ // Delete the note[id]. If bool = true then the function will remove the note, otherwise nothing will happen

} /* Fin deleteNote() */

function dragstart(event, id){
	fs.readFile("myjsonfile.json", 'utf8', function (err, data) {
		if (err) return cosole.log(err);
		var data = JSON.parse(data);
		var count = Object.keys(data.note).length-1;
		for(var i = 0; i <= count; i++){
			if(data.note[i].id == id){
				title = data.note[i].title;
				message = data.note[i].message;
			}
		}
	});
	if (event.screenX == 0 && event.screenY == 0) { // if the user is leaving the window
		id = id++;
		if (fs.existsSync(userHome+'/Desktop/note'+id+'.txt') == false) { // Check if the file is not already saved on desktop, if not then save it
			fs.appendFile(userHome+'/Desktop/note'+id+'.txt', title+'\r\n\r\n'+message, function (err) {
				if (err) throw err;
				return true;
			});
		}else{
			ipc.send('information-dialog-selection'); // send a message to index.js to throw an error.
		}
	} 
}

function speak(title, message, id) { // TTS
	new Audio('https://translate.google.com/translate_tts?ie=UTF-8&q='+encodeURIComponent(title.replace("20htpm","'"))+'%20.'+encodeURIComponent(message).replace("20htpm", "'")+'&tl=fr&client=tw-ob').play();
}


function search(){ //Display the notes that the user is looking for
	var input, filter, divNote, note, a, i, txtValue;
    input = document.getElementById("recherche");
    filter = input.value.toUpperCase();
    divNote = document.getElementById("note");
    note = divNote.getElementsByTagName("div");
    for (i = 0; i < note.length; i++) {
        a = note[i];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            note[i].style.display = "";
        } else {
			if(note[i].className != "card-action"){
				note[i].style.display = "none";
			}
        }
    }
}