"use strict";
/*
---------------------------------------------------------------------------------------
 								* IST NOCH MACARONI CODE *
 --------------------------------------------------------------------------------------

										TODO
								*Button LösungenText 
								*Noten anzeigen/Mit Lösungen verbinden
								*ASYNC Event listeners -> nicht synchron mit fetch
									-> Hat keine daten, feuert bevor fetch geladen wird
								*BUG:bei zweitem durchlauf komisches verhalten
									->beim 1. durchlauf wird 1. Frage doppelt gerendert
									-> bei folgenden Durchläufen überspringt schleife immer eine indizierung mehr
										/ verdoppelt die vorherige
									=> notfix : Seite beim Statistik Screen neuladen
								*HTML Restrukturierunwqwg von Main
 */


function main(){
	let menu = document.getElementById("main__menu");
	let quiz = document.getElementById("main__quiz");
	let form = document.getElementById("menuform");
	let stat = document.getElementById("main__statistic");
	let choice = document.getElementById("main__choicebox");
	let jP = document.getElementById("Jens"); //Span Pseudo-Element für Text der Statistikanzeige
	let lP = document.getElementById("Wrongs");
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
	function fetchRequest(addr, noteType){
				fetch(addr).then(response => {
				  return response.json();
				}).then(data => {
					localStorage.setItem("notes", JSON.stringify(data.notes));
					localStorage.setItem("solution", JSON.stringify(data.solution));
					insertFirstPage(noteType);
					
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
		let h = JSON.parse(localStorage.getItem("solution"));
		let textSelection = ["C", "D", "E", "F", "G", "A", "B", "C'", "C#", "D#", "F#", "A#"];
			textSelection = shuffle(textSelection);
		let txtSelFilter = textSelection.filter((textSelection)=>{
			return textSelection != h[solutionIndex];
		});
		let solution = JSON.parse(localStorage.getItem("solution"));
		let choices = [];
			choices[0] = solution[solutionIndex];
			choices[1] = txtSelFilter[0];
			choices[2] = txtSelFilter[1];
			choices[3] = txtSelFilter[2];
		for(let i=0; i< buttons.length; ++i){
			document.getElementById(buttons[i]).innerHTML=choices[randomDec[i]];
		}	
	}





	//---------------------------
	//		Note rendering
	//---------------------------
	let arraysplit = (strings)=>{
		
			let returnArray=[];
			let t = strings.split(" ");
			for(let k=0; k<=t.length-1;++k){
				returnArray.push(t[k]);
			}
			return returnArray;
		
	}

	function renderNotes(type) {
		//Holt sich Clef aus dem Optionsmenü im HTML
		let noteType;
		let h = JSON.parse(localStorage.getItem("solution"));
		let accordArray = [];
		if (h[solutionIndex].length > 1) {
			accordArray = arraysplit(h[solutionIndex]);
		}
		else {
			accordArray = h[solutionIndex];
		}
		let note = [];
		if (type == 1) {
			noteType = "bass"
			for (let i = 0; i < accordArray.length; ++i) {
				note[i] = accordArray[i] + "/3";
			}
		}
		if (type == 2) {
			noteType = "treble"
			for (let i = 0; i < accordArray.length; ++i) {
				note[i] = accordArray[i] + "/5";
			}
		}


		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~Nachricht für Ben~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		//-------------------------------------------------------------------------------------------
		//|				note ist Array der Noten.Dort wo eingestellt wird wie viele					|
		//|				Noten gerendert werden, muss  es in schleife nach note.length gepackt werden|
		//-------------------------------------------------------------------------------------------
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


		var clef = noteType;

		//var note = localStorage.getItem("notes"
		//lokale Definition bis Schnittstelle
		// Create an SVG renderer and attach it to the DIV element named "boo".
		var canvas = document.getElementById("VexBody")
		//var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
		var renderer = new Vex.Flow.Renderer(canvas, Vex.Flow.Renderer.Backends.CANVAS);

		// Configure the rendering context.
		renderer.resize(120, 150); //in CSS class für responsive 100%
		var context = renderer.getContext();
		
		//----vvv----------FEHLER------------vvv------
		context.setViewBox(20, 20, 85, 85).setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
		//------------------^^^^---------------------
		
		// Create a stave of width 400 at position 10, 40 on the canvas.
		var stave = new Vex.Flow.Stave(20, 20, 100); //Beeiflusst ebenfalls die Groeße

		stave.addClef(clef);//.addTimeSignature("4/4"); 
		stave.setContext(context).draw();
		console.log("Noch da");
		if (note.length == 1) {
			console.log("H");
			var notes = [
				// A whole-note.
				new Vex.Flow.StaveNote({ clef: clef, keys: [note[0]], duration: "w" })
			];
			// Create a voice in 1/1 and add above notes
			var voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
		}
		else {
			console.log("HE");
			var notes = [];
			for(i=0; i<note.length; i++){
				notes.push(new Vex.Flow.StaveNote({ clef: clef, keys: [note[i]], duration: "q" }))
			}
			var voice = new Vex.Flow.Voice({ num_beats: note.length, beat_value: note.length });
		}
		console.log("HA")
		voice.addTickables(notes);
		var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);
		voice.draw(context, stave);
	}


	//---------------------------
	//		EventListeners
	//---------------------------

	//Setzt nächsten Rendering Content zusammen/ wechselt zur nächsten Seite & summiert richtige Antworten
	function handleButton(event, noteType){
		let solutionValue = JSON.parse(localStorage.getItem("solution"));
		let h = JSON.parse(localStorage.getItem("solution"));
		let lastPage = () => {
			jP.innerHTML = "Richtig" +"\n" +Correct +"/4";
			lP.innerHTML = "Falsch" +"\n" +(4-Correct) +"/4";
			//let section ='<section id="main__statistic" class="hidden"><div id="statistic__container"><h2>Dein Ergebnis</h2><span id="Jens" style="text-align: center; font-size: 5rem"></span><button class="statistic__button" id="statistic__button">Zurück zum Menu </button></div></section>'
			//document.getElementById("main").innerHTML=section;
			solutionIndex=0;
			quiz.classList.add("hidden");
			stat.classList.remove("hidden");	
		}

		let nextPage = () =>{
			randomChoice = shuffle(randomChoice);
			randomizeChoiceButtons(buttons, randomChoice);
			progBar.value += 10;
			renderNotes(noteType);
			solutionIndex+=1;

		}
		if (event === solutionValue[solutionIndex-1]) {
			if(solutionIndex === 4){
				Correct+=1;
				lastPage();	
			}
			else
			{
				Correct+=1;
				nextPage();
			}
		}
		else{
			if(solutionIndex === 4){
				lastPage();
			}
			else
			{
				nextPage();
			}
		}
	}

	function insertFirstPage(noteType){
		let section = '<section id="main__quiz" class=""><div class="quiz__progressbox"><progress id="progress" value="00" max="40" class="quiz__progressbar"></progress></div><div class="quiz__renderbody" id="quiz__renderbody"><p style="text-align:center; font-size:2rem;"  id="renderParagraph"></p><canvas id="renderbody"></canvas></div><hr><h2>Wählen sie eine Lösungsmöglichkeit aus</h2><div class="main__choicebox" id="main__choicebox"><button class="choiceButton1" id="choiceButton1">A</button><button class="choiceButton2" id="choiceButton2">B</button><button class="choiceButton3" id="choiceButton3">C</button><button class="choiceButton4" id="choiceButton4">D</button></div></section>'
		renderNotes(noteType);
		//document.getElementById("main").innerHTML=section;
		menu.classList.add("hidden");
		quiz.classList.remove("hidden");
		//renderRenderbody(solutionIndex);
		randomizeChoiceButtons(buttons, randomChoice);
		responseButtons(noteType);
		solutionIndex+=1;

	}
	function executeFetch(nt, modul){
		const htwAddr = ["https://www2.htw-dresden.de/~s77199/Modul1.json", 
						"https://www2.htw-dresden.de/~s77199/Modul1.json",
						"https://www2.htw-dresden.de/~s77199/Modul1.json"];
		for(let i=0; i<=3; ++i){
			if(modul === "Modul" +i){
				fetchRequest(htwAddr[i], nt);
			}
		}
	}
	//fect('http://192.168.0.108:8000/Modul2.json');
	//Start Button
	document.getElementById("form_button").addEventListener('click', () =>{
		let sel = document.getElementById("menuform").value;
		let sol = document.getElementById("modulform").value;
		let nt = 0;

		if(sel === "Bassschlüssel"){
			nt = 1;
		}
		if(sel === "Violinschlüssel"){
			nt=2;
		}
		if(sel === "Notenart"){
			document.getElementById("menuform").classList.add("main__choicebox--redLine");
		}
		if(sol === "Modul"){
			document.getElementById("modulform").classList.add("main__choicebox--redLine");
		}
		if(nt !== 0){
			executeFetch(nt, sol);
		}
		
	});


	// Quiz Buttons
	function responseButtons(noteType){
		document.getElementById("main__choicebox").addEventListener('click', function(event){
		let elem = event.target.id;

		if(elem === buttons[0]){
			let buttonText = document.getElementById(buttons[0]).innerHTML;
			handleButton(buttonText, noteType);
		}
		if(elem === buttons[1]){
			let buttonText = document.getElementById(buttons[1]).innerHTML;
			handleButton(buttonText, noteType);
		}
		if(elem === buttons[2]){
			let buttonText = document.getElementById(buttons[2]).innerHTML;
			handleButton(buttonText, noteType);
		}
		if(elem === buttons[3]){
			let buttonText = document.getElementById(buttons[3]).innerHTML;
			handleButton(buttonText, noteType);
		}
	});
	}
}

main();
//Restart Button
document.getElementById("statistic__button").addEventListener('click', () =>{
	/*menu.classList.remove("hidden");
	stat.classList.add("hidden");
	form.value="Modul";
	form.classList.remove("main__choicebox--redLine");
	solutionIndex=0;
	Correct=0;
	progBar.value="0";*/
	main();
});

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




