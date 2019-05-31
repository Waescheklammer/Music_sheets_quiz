"use strict";

function main() {
	let menu = document.getElementById("main__menu");
	let quiz = document.getElementById("main__quiz");
	let stat = document.getElementById("main__statistic");
	let jP = document.getElementById("Jens"); //Span Pseudo-Element für Text der Statistikanzeige
	let lP = document.getElementById("Wrongs");
	let progBar = document.getElementById("progress");
	let numRounds = 6; //Anzahl der der Spielrunden
	let randomChoice = [0, 1, 2, 3];
	let buttons = ["choiceButton1", "choiceButton2", "choiceButton3", "choiceButton4"];
	let solutionIndex = 0; //Fragen/Antworten-Katalog Index
	let Correct = 0; //Richtige Antwortenzähler


	//---------------------------
	//			FETCH JSON
	//---------------------------

	//AJAX Fetch-API
	//idefix fkt. nicht bei mobilen Endgeräten
	//const source = 'https://idefix.informatik.htw-dresden.de/it1/beleg/noten-aufgaben.js';
	const source = "https://www2.htw-dresden.de/~s77158/Modul1.json";

	function fetchRequest(source, modul, key) {
		fetch(source)
			.then(response => { return response.json(); })
			.catch(error => console.error('Error:', error))
			.then(data => {
				if (modul === "note") {
					localStorage.setItem("questions", JSON.stringify(data.note));
				}
				if (modul === "akkord3") {
					localStorage.setItem("questions", JSON.stringify(data.akkord3));
				}
				insertFirstPage(key);
			})
	};

	//Start Button
	document.getElementById("form_button").addEventListener('click', () => {
		let sel = document.getElementById("menuform").value;
		let sol = document.getElementById("modulform").value;
		let nt = 0;
		let modul;

		if (sel === "Bassschlüssel") {
			nt = 1;
		}
		if (sel === "Violinschlüssel") {
			nt = 2;
		}
		if (sel === "Schlüssel") {
			document.getElementById("menuform").classList.add("main__choicebox--redLine");
		}

		if (sol === "Einzelnote") {
			modul = "note";
		}

		if (sol === "Akkorde") {
			modul = "akkord3";
		}

		if (sol === "Modul") {
			document.getElementById("modulform").classList.add("main__choicebox--redLine");
		}
		if (nt !== 0) {
			fetchRequest(source, modul, nt);
		}

	});
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

	//Rendert Buttontexte zufällig an
	function randomizeChoiceButtons(buttons, randomDec) {
		var obj = JSON.parse(localStorage.getItem("questions"));
		var l = obj[solutionIndex].l;
		let textSelection = l;
		textSelection = shuffle(textSelection);

		let choices = [];
		choices[0] = textSelection[0];
		choices[1] = textSelection[1];
		choices[2] = textSelection[2];
		choices[3] = textSelection[3];
		for (let i = 0; i < buttons.length; ++i) {
			document.getElementById(buttons[i]).innerHTML = choices[randomDec[i]];
		}
	}

	//---------------------------
	//		Note rendering
	//---------------------------

	
	//Benötigt für Umrechnung von Violin auf Bass
	function setCharAt(str, index, chr) {
		if (index > str.length - 1) return str;
		return str.substr(0, index) + chr + str.substr(index + 1);
	}
	
	
	function renderNotes(type) {
		//Holt sich Clef aus dem Optionsmenü im HTML
		let key;
		var obj = JSON.parse(localStorage.getItem("questions"));
		var a = obj[solutionIndex].a;

		if (type == 1) { key = 'bass' };
		if (type == 2) { key = 'treble' };

		var noteString = "";
		noteString = a;

		//Falls Bass, dann Dekrement z.B. C4 -> C2
		if (type == 1) {
			var i;
			var y = "";
			for (i = 0; i < noteString.length; i++) {
				let x = noteString.charAt(i);
				if (x >= '0' && x <= '9') {
					y = x - 2;
					noteString = setCharAt(noteString, i, y);
				}
			}
		}

		var note = noteString + "/w";

		var vf = new Vex.Flow.Factory({ renderer: { elementId: 'VexBody' } });
		var context = vf.getContext();
		context.setViewBox(20, 20, 60, 120);

		var score = vf.EasyScore();
		var system = vf.System();

		system.addStave({
			voices: [score.voice(score.notes(note, { clef: key }))]
		}).addClef(key);

		vf.draw();
	}

	//---------------------------
	//		EventListeners
	//---------------------------

	//Setzt nächsten Rendering Content zusammen/ wechselt zur nächsten Seite & summiert richtige Antworten
	function handleButton(buttonText, key) {
		let obj = JSON.parse(localStorage.getItem("questions"));
		let l = obj[solutionIndex - 1].l;
		let solution = String(l[0]); //erste Lösung immer richtig
		let usrInput = String(buttonText);

		let lastPage = () => {
			jP.innerHTML = "Richtig" + "\n" + Correct + "/" + numRounds;
			lP.innerHTML = "Falsch" + "\n" + (numRounds - Correct) + "/" + numRounds;
			solutionIndex = 0; //reset
			quiz.classList.add("hidden");
			stat.classList.remove("hidden");
		}

		let nextPage = () => {
			randomChoice = shuffle(randomChoice);
			randomizeChoiceButtons(buttons, randomChoice);
			d3.select("svg").remove(); //Verhindert das Aneinanderkleben von SVGs
			renderNotes(key);
			solutionIndex += 1;

		}
		//Antowrt richtig
		if (usrInput === solution) {
			if (solutionIndex == numRounds) { //Ende des Spiels
				Correct += 1;
				lastPage();
			}
			else {
				Correct += 1; //nächste Runde
				progBar.value += 100 / numRounds;
				nextPage();
			}
		}//Antwort falsch
		else {
			if (solutionIndex == numRounds) {
				lastPage();
			}
			else {
				nextPage();
			}
		}
	}

	function insertFirstPage(key) {
		//let section = '<section id="main__quiz" class=""><div class="quiz__progressbox"><progress id="progress" value="00" max="40" class="quiz__progressbar"></progress></div><div class="quiz__renderbody" id="quiz__renderbody"><p style="text-align:center; font-size:2rem;"  id="renderParagraph"></p><canvas id="renderbody"></canvas></div><hr><h2>Wählen sie eine Lösungsmöglichkeit aus</h2><div class="main__choicebox" id="main__choicebox"><button class="choiceButton1" id="choiceButton1">A</button><button class="choiceButton2" id="choiceButton2">B</button><button class="choiceButton3" id="choiceButton3">C</button><button class="choiceButton4" id="choiceButton4">D</button></div></section>'
		renderNotes(key);
		menu.classList.add("hidden");
		quiz.classList.remove("hidden");
		randomizeChoiceButtons(buttons, randomChoice);
		responseButtons(key);
		solutionIndex += 1;
	}

	// Quiz Buttons
	function responseButtons(key) {
		document.getElementById("main__choicebox").addEventListener('click', function (event) {
			let elem = event.target.id;

			if (elem === buttons[0]) {
				let buttonText = document.getElementById(buttons[0]).innerHTML;
				handleButton(buttonText, key);
			}
			if (elem === buttons[1]) {
				let buttonText = document.getElementById(buttons[1]).innerHTML;
				handleButton(buttonText, key);
			}
			if (elem === buttons[2]) {
				let buttonText = document.getElementById(buttons[2]).innerHTML;
				handleButton(buttonText, key);
			}
			if (elem === buttons[3]) {
				let buttonText = document.getElementById(buttons[3]).innerHTML;
				handleButton(buttonText, key);
			}
		});
	}
}

main();
//Restart Button
document.getElementById("statistic__button").addEventListener('click', () => {
	main();
});
