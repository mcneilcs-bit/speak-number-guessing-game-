const msgEl=document.getElementById('msg');
//Generate random number//
 function getRandomNumber(){
    return Math.floor(Math.random()*100)+1;
 }
 const randomNum=getRandomNumber();
    console.log('Number:',randomNum);

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = new window.SpeechRecognition();
    // start recognition and game//
    recognition.start();
    //capture user speak//
    function onSpeak(event){
         const msg = event.results[0][0].transcript;  // You can log the event to view the structure of the data
  console.log(msg);
}
//Speak result //
recognition.addEventListener('result',onSpeak);

//write what user speak//
function writeMessage(msg){
    const div = document.createElement('div');
    div.textContent = 'You said: ';
    const span = document.createElement('span');
     span.classList.add('box');
  span.textContent = msg;

  msgEl.append(div, span);
}
//check msg against number//
function checkNumber(msg){
   let num = Number(msg);
   const wordToNumber = {
    'one': 1,
    'won': 1,
    'two': 2,
    'to': 2,
    'too': 2,
    'three': 3,
    'four': 4,
    'for': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'ate': 8,
    'nine': 9,
    'ten': 10,
   };
   if (wordToNumber[msg]) {
    console.log(`adjusting ${msg} to ${wordToNumber[msg]}`);
    msg = wordToNumber[msg];
    num = Number(msg);
   }
    //check if the spoken content is a valid number//
    if(Number.isNaN(num)){
        const div = document.createElement('div');
        div.textContent = 'That is not a valid number';
        msgEl.innerHTML = "";
        msgEl.append(div);
        return;
    }
    //check if valid number//
    if(Number.isNaN(num)){
        const div = document.createElement('div');
        div.textContent = 'That is not a valid number';
        msgEl.append(div);
        return;
}
//check range//
if(num<1 || num>100){
    const div = document.createElement('div');
        div.textContent = 'Number must be between 1 and 100';
        msgEl.append(div);
        return;
}
//check number and provide feedback//
if(num===randomNum){
    const h2 = document.createElement('h2');
    h2.textContent = 'Congrats! You have guessed the number! It was ${num}';

    const button = document.createElement('button');
    button.classList.add('play-again');
    button.id = 'play-again';
    button.textContent = 'Play Again';
    //Add Listener and handler to button//
    button.addEventListener('click', () => window.location.reload());
    
    msgEl.append(h2,button);
} else if(num>randomNum){
    const div = document.createElement('div');
        div.textContent = 'GO LOWER';
        msgEl.append(div);
} else {
    const div = document.createElement('div');
        div.textContent = 'GO HIGHER';
        msgEl.append(div);
}
}
