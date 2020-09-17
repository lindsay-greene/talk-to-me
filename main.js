// Create variables to grab html elements
var output = document.querySelector(".output");
var placeholder = document.getElementById("placeholder");
var green_output = document.getElementById("green-output");
var yellow_output = document.getElementById("yellow-output");
var red_output = document.getElementById("red-output");
var results = document.getElementById("results");

// Create variables for speech recognition / constrained vocab 
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// Constrained vocabulary sorted by category 
var green_feelings = ["happy", "enthusiastic", "loving", "friendly", "confident", "motivated"];
var yellow_feelings = ["anxious", "nervous", "confused", "frustrated", "bored", "tired"];
var red_feelings = ["angry", "upset", "fearful", "stressed", "depressed", "jealous"];
var feelings = [green_feelings, yellow_feelings, red_feelings];
var grammar = `#JSGF V1.0; grammar feelings; public <feeling> = ${feelings.join(' | ')} ;`

// Create a new recognition object and connect it to grammar 
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;

// Settings for recognition of a single english word
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// Create variables for speech synthesis 
var synth = window.speechSynthesis;

// Speech synthesis function - will speak the placeholder text    
function speak() {
    var utterance = new SpeechSynthesisUtterance(placeholder.innerHTML);
    utterance.pitch = 1.2;
    utterance.rate = 1.1;
    synth.speak(utterance);
}

// Speech recognition on click 
document.body.onclick = function() {
    placeholder.innerHTML = "Ready to hear how you are feeling today.";
    recognition.start();
}

// Receive result and speak it 
recognition.onresult = function(event) {
    var feeling = event.results[0][0].transcript;
    placeholder.innerHTML = "Result received: you are feeling " + feeling + ". Here are some resources you might find helpful.";
    
    // Make resources visible based on feeling category
    if(green_feelings.includes(feeling)) {
        results.innerHTML = green_output.innerHTML;
        results.style.backgroundColor = "lawngreen";
        results.style.visibility = "visible";
        speak();
    }
    else if(yellow_feelings.includes(feeling)) {
        results.innerHTML = yellow_output.innerHTML;
        results.style.backgroundColor = "yellow";
        results.style.visibility = "visible";
        speak();
    }
    else if (red_feelings.includes(feeling)) {
        results.innerHTML = red_output.innerHTML;
        results.style.backgroundColor = "#ff3300";
        results.style.visibility = "visible";
        speak();
    }

    // Equivalent of onnomatch property of speech recognition 
    else {
        results.style.visibility = "hidden";
        placeholder.innerHTML = "I didn't recognize that feeling. Please try again.";
        speak();
    }
}