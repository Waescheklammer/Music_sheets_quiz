"use strict";
/*
---------------------------------------------------------------------------------------
 								* IST NOCH MACARONI CODE *
 								Nur Versuch, noch nichts geordnet nach MVC
 --------------------------------------------------------------------------------------

										TODO
								*Promise für Installation + Button
								*Button LösungenText 
								*Noten anzeigen/Mit Lösungen verbinden
								*Desktop CSS Layout
								*ASYNC Event listeners -> nicht synchron mit fetch
									-> Hat keine daten, feuert bevor fetch geladen wird
								*BUG:bei zweitem durchlauf komisches verhalten
								*Service Worker(?)
								*HTML Restrukturierunwqwg von Main
 */

let menu = document.getElementById("main__menu");
let quiz = document.getElementById("main__quiz");
let form = document.getElementById("menuform");
let stat = document.getElementById("main__statistic");
let choice = document.getElementById("main__choicebox");
let jP = document.getElementById("Jens"); //Span Pseudo-Element für Text der Statistikanzeige
let progBar = document.getElementById("progress");

let randomChoice = [0,1,2,3];
let buttons=["choiceButton1", "choiceButton2", "choiceButton3", "choiceButton4"];

let solutionIndex = 0; //Fragen/Antworten-Katalog Index
let Correct=0; //Richtige Antwortenzähler


//---------------------------
//			FETCH JSON
//---------------------------

const tempfetchAddr= 'http://141.56.236.191:8000/Modul1.json'; 
const fetchAddr = 'http://192.168.0.108:8000/Modul1.json'; //IP Adresse von Hostserver(lokaler Webserver)
function fetchRequest(addr){
			fetch(addr).then(response => {
			  return response.json();
			}).then(data => {
				localStorage.setItem("notes", JSON.stringify(data.notes));
				localStorage.setItem("solution", JSON.stringify(data.solution));
				insertFirstPage();
				
			}).catch(err => {
			  // Do something for an error here
			});
		}


//fetchRequest(fetchAddr);

//---------------------------
//		Render Buttons
//---------------------------

//random anordnen von Button-Text-Array ( Heißt anscheinend shuffling)
function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
    return arra1;
}

randomChoice = shuffle(randomChoice);

//Rendert Buttontexte zufällig an
function randomizeChoiceButtons(buttons, randomDec){
	let choices=["A", "B", "C", "D"];
	for(let i=0; i< buttons.length; ++i){
		document.getElementById(buttons[i]).innerHTML=choices[randomDec[i]];
	}	
}





//---------------------------
//		Note rendering
//---------------------------


function renderNotes(type){
	//VF = Vex.Flow;

	if(type===1){//Bassschlüssel

	}
	if(type===2){//Violinschlüssel

	}
	// Create an SVG renderer and attach it to the DIV element named "boo".
	var canvas = document.getElementById("VexBody")
	//var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
	var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

	// Configure the rendering context.
	renderer.resize(410, 150); //in CSS class für responsive 100%
	var context = renderer.getContext();
	context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

	// Create a stave of width 400 at position 10, 40 on the canvas.
	var stave = new Vex.Flow.Stave(10, 40, 370); //Beeiflusst ebenfalls die Groeße

	// Add a clef and time signature.
	stave.addClef("treble");//.addTimeSignature("4/4"); //addClef("bass")

	// Connect it to the rendering context and draw!
	stave.setContext(context).draw();

	var notes = [
	  // A quarter-note C.
	  new Vex.Flow.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),

	  // A quarter-note D.
	  new Vex.Flow.StaveNote({clef: "treble", keys: ["d/4"], duration: "q" }),

	  // A quarter-note rest. Note that the key (b/4) specifies the vertical
	  // position of the rest.
	  new Vex.Flow.StaveNote({clef: "treble", keys: ["b/4"], duration: "q" }),

	  // A C-Major chord.
	  new Vex.Flow.StaveNote({clef: "treble", keys: ["c/4", "e/4", "g/4"], duration: "q" })
	];

	// Create a voice in 4/4 and add above notes
	var voice = new Vex.Flow.Voice({num_beats: 4,  beat_value: 4});
	voice.addTickables(notes);

	// Format and justify the notes to 400 pixels.
	var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);

	// Render voice
	voice.draw(context, stave);
}
//Rendert (später) Notenanzeige
function renderRenderbody(solutionIndex){
	let textArr=JSON.parse(localStorage.getItem("notes"));
	document.getElementById("renderParagraph").innerHTML= textArr[solutionIndex];
}
//Überspring 2 und 3


//---------------------------
//		EventListeners
//---------------------------

let solutionValue = JSON.parse(localStorage.getItem("solution"));

//Setzt nächsten Rendering Content zusammen/ wechselt zur nächsten Seite & summiert richtige Antworten
function handleButton(event){
	let h = JSON.parse(localStorage.getItem("solution"));
	console.log(solutionIndex);
	let lastPage = () => {
		jP.innerHTML = Correct +"/4";
		//let section ='<section id="main__statistic" class="hidden"><div id="statistic__container"><h2>Dein Ergebnis</h2><span id="Jens" style="text-align: center; font-size: 5rem"></span><button class="statistic__button" id="statistic__button">Zurück zum Menu </button></div></section>'
		//document.getElementById("main").innerHTML=section;

		quiz.classList.add("hidden");
		stat.classList.remove("hidden");	
	}

	let nextPage = () =>{
		randomChoice = shuffle(randomChoice);
		randomizeChoiceButtons(buttons, randomChoice);
		solutionIndex+=1;
		progBar.value += 10;
		renderRenderbody(solutionIndex);
	}

	if (event === solutionValue[solutionIndex]) {
		if(solutionIndex === 3){
			Correct+=1;
			lastPage();
			solutionIndex=0;	
		}
		else
		{
			Correct+=1;
			nextPage();
		}
	}
	else{
		if(solutionIndex === 3){lastPage();
			solutionIndex=0;
		}
		else
		{
			nextPage();
		}
	}
}

function insertFirstPage(){
	let section = '<section id="main__quiz" class=""><div class="quiz__progressbox"><progress id="progress" value="00" max="40" class="quiz__progressbar"></progress></div><div class="quiz__renderbody" id="quiz__renderbody"><p style="text-align:center; font-size:2rem;"  id="renderParagraph"></p><canvas id="renderbody"></canvas></div><hr><h2>Wählen sie eine Lösungsmöglichkeit aus</h2><div class="main__choicebox" id="main__choicebox"><button class="choiceButton1" id="choiceButton1">A</button><button class="choiceButton2" id="choiceButton2">B</button><button class="choiceButton3" id="choiceButton3">C</button><button class="choiceButton4" id="choiceButton4">D</button></div></section>'

	//document.getElementById("main").innerHTML=section;
	menu.classList.add("hidden");
	quiz.classList.remove("hidden");
	renderRenderbody(solutionIndex);
	randomizeChoiceButtons(buttons, randomChoice);
	responseButtons();
}

//fect('http://192.168.0.108:8000/Modul2.json');
//Start Button
document.getElementById("form_button").addEventListener('click', () =>{
	var sel = document.getElementById("menuform").value;
	const htwAddr1="https://www2.htw-dresden.de/~s77199/Modul1.json";
	const htwAddr2="https://www2.htw-dresden.de/~s77199/Modul2.json";
	const mod2Addr= 'http://192.168.0.108:8000/Modul2.json'; 
	const mod1Addr= 'http://192.168.0.108:8000/Modul1.json'; 

	if(sel === 'Bassschlüssel'){
		localStorage.clear();
		fetchRequest(htwAddr2);
		renderNotes(1);
	}
	if(sel === 'Violinschlüssel'){
		localStorage.clear();
		fetchRequest(htwAddr1);
		renderNotes(2);
	}
	if (sel === 'Modul') {
		form.classList.add("main__choicebox--redLine");
	}
	
});

//Restart Button
document.getElementById("statistic__button").addEventListener('click', () =>{
	menu.classList.remove("hidden");
	stat.classList.add("hidden");
	form.value="Modul";
	form.classList.remove("main__choicebox--redLine");
	solutionIndex=0;
	Correct=0;
	progBar.value="0";
});

// Quiz Buttons
function responseButtons(){
	document.getElementById("main__choicebox").addEventListener('click', function(event){
	let elem = event.target.id;

	if(elem === buttons[0]){
		let buttonText = document.getElementById(buttons[0]).innerHTML;
		handleButton(buttonText);
	}
	if(elem === buttons[1]){
		let buttonText = document.getElementById(buttons[1]).innerHTML;
		handleButton(buttonText);
	}
	if(elem === buttons[2]){
		let buttonText = document.getElementById(buttons[2]).innerHTML;
		handleButton(buttonText);
	}
	if(elem === buttons[3]){
		let buttonText = document.getElementById(buttons[3]).innerHTML;
		handleButton(buttonText);
	}
});
}

/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
*/




