/*
---------------------------------------------------------------------------------------
 								* IST NOCH MACARONI CODE *
 --------------------------------------------------------------------------------------
 */




/*
 * Description
 document.addEventListener('click', function(event){
	if(event.target.matches("choiceButton1"))
	{
		console.log("BH");
	}
});




var vf = new Vex.Flow.Factory({
  renderer: {elementId: 'main__renderbody', width: 500, height: 200}
});

var score = vf.EasyScore();
var system = vf.System();

system.addStave({
  voices: [
    score.voice(score.notes('C#5/q, B3, A3, G#3', {stem: 'up'})),
    score.voice(score.notes('C#4/h, C#4', {stem: 'down'}))
  ]
}).addClef('treble').addTimeSignature('4/4').setStyle({strokeStyle: "blue"});

vf.draw();
 */
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

var randomChoice = [0,1,2,3];
randomChoice = shuffle(randomChoice);
var buttons=["choiceButton1", "choiceButton2", "choiceButton3", "choiceButton4"];


function randomizeChoiceButtons(buttons, randomDec){
	var choices=["A", "B", "C", "D"];
	for(let i=0; i< buttons.length; ++i){
		document.getElementById(buttons[i]).innerHTML=choices[randomDec[i]];
	}	
}

randomizeChoiceButtons(buttons, randomChoice);


var json = {
	"notes": ["A", "C", "B", "C", "J"],
	"solution": [1,2,3,0,1]
};

function fetchRequest(){
					// Replace ./data.json with your JSON feed
			fetch('http://192.168.0.108:8000/Modul1.json').then(response => {
			  return response.json();
			}).then(data => {
			  // Work with JSON data here
				localStorage.setItem("notes", JSON.stringify(data.notes));
				localStorage.setItem("solution", JSON.stringify(data.solution));
			}).catch(err => {
			  // Do something for an error here
			});
		}

fetchRequest();

document.getElementById(buttons[0]).addEventListener('click', function(){
	var h = JSON.parse(localStorage.getItem("solution"));
	if (this.innerHTML === h[1]) {console.log("RICHTIG")}
		else{console.log("FALSCH" +h[1]);}

});



window.addEventListener('click', function(event){
	if(event.target.id === buttons[0]){
		var h = JSON.parse(localStorage.getItem("solution"));
		if (this.innerHTML === h[1]) {console.log("RICHTIG")}
		else{console.log("FALSCH" +h[1]);}
	}
});