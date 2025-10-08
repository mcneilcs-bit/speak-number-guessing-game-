// text to speech number guessing game//

//sound effects//
buzzer = new Audio('sound/buzzer.mp3');

function speakMessage(message) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}
window.addEventListener('DOMContentLoaded', () => { 
    if (!sessionStorage.getItem('welcomeSpoken')) {
        speakMessage('Welcome to the number guessing game! Try to guess a number between 1 and 100 by speaking your guess into the microphone. Click the microphone icon to start. Good luck!');
        sessionStorage.setItem('welcomeSpoken', 'true');
    }
    
});



const msgEl = document.getElementById('msg');
//Generate random number//
function getRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
}
const randomNum = getRandomNumber();
console.log('Number:', randomNum);
// set up speech recognition//
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.continuous = false;


// start recognition and game//

//capture user speak//
function onSpeak(event) {
    const msg = event.results[0][0].transcript.toLowerCase().trim();  // You can log the event to view the structure of the data
    console.log('Heard:', msg);

    writeMessage(msg);
    checkNumber(msg);
}
// add a click listener to start the game//
const micImage = document.querySelector('img');
micImage.style.cursor = 'pointer';



micImage.addEventListener('click', () => {
    //unlock audio for browser autoplay restritions //
    buzzer.play().then(() => {
        buzzer.pause();
        buzzer.currentTime = 0;
    }).catch(e => console.log("Audio unlock:", e));

    // speech recognition//
    recognition.start();
    console.log('Listening...');

});
recognition.addEventListener('start', () => {
    micImage.classList.add('Listening');
});
recognition.addEventListener('end', () => {
    micImage.classList.remove('Listening');
});
//Speak result //
recognition.addEventListener('result', onSpeak);

//write what user speak//
function writeMessage(msg) {
    const previousGuess = msgEl.querySelector('.guess');
    if (previousGuess) previousGuess.remove(); // Clear previous messages

    //create new guess container
    const div = document.createElement('div');
    div.textContent = 'You said: ';
    const span = document.createElement('span');
    span.classList.add('box');
    span.textContent = msg;

    msgEl.append(div, span);
}
//check msg against number//
function checkNumber(msg) {
    msgEl.innerHTML = ""; // Clear previous messages

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
    //write what the user spoke//
    writeMessage(msg);
    //convert word to number if necessary//
    if (wordToNumber[msg]) {
        console.log(`adjusting ${msg} to ${wordToNumber[msg]}`);
        msg = wordToNumber[msg];
        num = Number(msg);
    }
    //check if the spoken content is a valid number//
    if (Number.isNaN(num)) {
        const div = document.createElement('div');
        div.textContent = 'That is not a valid number';
        msgEl.append(div);

        buzzer.pause();
        buzzer.currentTime = 0;
        buzzer.play();
        // play buzzer wrong input//
        return;
    }
    //check if valid number//
    if (Number.isNaN(num)) {
        const div = document.createElement('div');
        div.textContent = 'That is not a valid number';
        msgEl.innerHTML = "";
        msgEl.append(div);

        buzzer.pause();
        buzzer.currentTime = 0;
        buzzer.play(); // play buzzer for out of range//
        return;
    }
    //check range//
    if (num < 1 || num > 100) {
        const div = document.createElement('div');
        div.textContent = 'Number must be between 1 and 100';
        msgEl.append(div);
        return;
    }
    //check number and provide feedback//
    if (num === randomNum) {
        const h2 = document.createElement('h2');
        h2.textContent = `Congrats! You have guessed the number! It was ${num}`;

        const button = document.createElement('button');
        button.classList.add('play-again');
        button.id = 'play-again';
        button.textContent = 'Play Again';
        //Add Listener and handler to button//
        button.addEventListener('click', () => window.location.reload());

        msgEl.append(h2, button);

        //congrats message//
        speakMessage(`Congrats! You have guessed the number! It was ${num} You Won! Click the Play Again button to start a new game.`);

    } else if (num > randomNum) {
        const div = document.createElement('div');
        div.textContent = 'GO LOWER';
        msgEl.append(div);
        // buzzer for wrong guess//
        buzzer.pause();
        buzzer.currentTime = 0;
        buzzer.play();

        // speak hint// 
        speakMessage(`You said ${num} . Go Lower.`);
    } else {
        const div = document.createElement('div');
        div.textContent = 'GO HIGHER';
        msgEl.append(div);

        // speak hint//
        speakMessage(`You said ${num}. Go Higher.`);

        // play buzzer for wrong guess//
        buzzer.pause();
        buzzer.currentTime = 0;
        buzzer.play();
    }
}

