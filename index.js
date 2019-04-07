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
			}).catch(err => {
			  // Do something for an error here
			});
		}


fetchRequest(fetchAddr);

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

randomizeChoiceButtons(buttons, randomChoice);




//---------------------------
//		Note rendering
//---------------------------


//Rendert (später) Notenanzeige
function renderRenderbody(solutionIndex){
	let textArr=JSON.parse(localStorage.getItem("notes"));
	document.getElementById("renderParagraph").innerHTML= textArr[solutionIndex];
}

renderRenderbody(solutionIndex);


//---------------------------
//		EventListeners
//---------------------------

let solutionValue = JSON.parse(localStorage.getItem("solution"));

//Setzt nächsten Rendering Content zusammen/ wechselt zur nächsten Seite & summiert richtige Antworten
function handleButton(event){
	let h = JSON.parse(localStorage.getItem("solution"));

	let lastPage = () => {
		jP.innerHTML = Correct +"/4";
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
		}
		else
		{
			Correct+=1;
			nextPage();
		}
	}
	else{
		if(solutionIndex === 3){lastPage();}
		else
		{nextPage();}
	}
}

//Start Button
document.getElementById("form_button").addEventListener('click', () =>{
	var sel = document.getElementById("menuform").value;
	if (sel !== 'Modul') {
		menu.classList.add("hidden");
		quiz.classList.remove("hidden");
		renderRenderbody(solutionIndex);
	}
	else
	{
		form.classList.add("main__choicebox--redLine");
	}
})

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
