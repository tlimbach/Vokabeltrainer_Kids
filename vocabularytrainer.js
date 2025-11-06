let vocabularyList = [];
let currentMode = "";
let direction = "de-en";
let currentVocab = null;
let correctAnswers = 0;
let currentIndex = 0;
let progressSegments = [];
let completionAnimation = null;
let completionAnimationDuration = 2000;

const LOCAL_STORAGE_KEY = "vocabularyFileContent"; // Schlüssel für gespeicherten Dateiinhalt
const COMPLETION_ANIMATION_PATH = "animations/firework.json";
const COMPLETION_ANIMATION_SPEED = 0.5;

// Standard-Vokabelliste, falls keine Datei geladen wird
/*
const defaultVocabulary = [
  { deutsch: "Apfel", englisch: "apple", score: 0 },
  { deutsch: "Haus", englisch: "house", score: 0 },
  { deutsch: "Tisch", englisch: "table", score: 0 },
  { deutsch: "Buch", englisch: "book", score: 0 },
  { deutsch: "Stuhl", englisch: "chair", score: 0 },
  { deutsch: "Hund", englisch: "dog", score: 0 },
  { deutsch: "Katze", englisch: "cat", score: 0 },
  { deutsch: "Schule", englisch: "school", score: 0 },
  { deutsch: "Baum", englisch: "tree", score: 0 },
  { deutsch: "Auto", englisch: "car", score: 0 }
];
*/
/*
const defaultVocabulary = [
  { deutsch: "Der Apfel ist rot.", englisch: "The apple is red.", score: 0 },
  { deutsch: "Das Haus ist groß.", englisch: "The house is big.", score: 0 },
  { deutsch: "Der Tisch ist aus Holz.", englisch: "The table is made of wood.", score: 0 },
  { deutsch: "Ich lese ein Buch.", englisch: "I am reading a book.", score: 0 },
  { deutsch: "Der Stuhl ist bequem.", englisch: "The chair is comfortable.", score: 0 },
  { deutsch: "Der Hund bellt laut.", englisch: "The dog is barking loudly.", score: 0 },
  { deutsch: "Die Katze schläft.", englisch: "The cat is sleeping.", score: 0 },
  { deutsch: "Die Schule ist alt.", englisch: "The school is old.", score: 0 },
  { deutsch: "Der Baum ist hoch.", englisch: "The tree is tall.", score: 0 },
  { deutsch: "Das Auto ist schnell.", englisch: "The car is fast.", score: 0 }
];
*/

const defaultVocabulary = [
  {
    deutsch: "Der Apfel, den ich gekauft habe, ist sehr saftig und lecker.",
    englisch: "The apple I bought is very juicy and delicious.",
    score: 0,
  },
  {
    deutsch:
      "Das Haus am Ende der Straße hat ein rotes Dach und einen großen Garten.",
    englisch:
      "The house at the end of the street has a red roof and a large garden.",
    score: 0,
  },
  {
    deutsch: "Der Tisch im Esszimmer ist mit einer schönen Tischdecke bedeckt.",
    englisch:
      "The table in the dining room is covered with a beautiful tablecloth.",
    score: 0,
  },
  {
    deutsch:
      "Ich lese jeden Abend ein spannendes Buch, bevor ich schlafen gehe.",
    englisch: "I read an exciting book every evening before I go to sleep.",
    score: 0,
  },
  {
    deutsch:
      "Der Stuhl, auf dem ich sitze, ist sehr bequem und hat weiche Polster.",
    englisch:
      "The chair I am sitting on is very comfortable and has soft cushions.",
    score: 0,
  },
  {
    deutsch: "Der Hund spielt gerne im Garten und gräbt Löcher in den Boden.",
    englisch:
      "The dog likes to play in the garden and digs holes in the ground.",
    score: 0,
  },
  {
    deutsch:
      "Die Katze schläft gerne auf dem Fensterbrett und sonnt sich im Licht.",
    englisch:
      "The cat likes to sleep on the windowsill and bask in the sunlight.",
    score: 0,
  },
  {
    deutsch:
      "Die alte Schule in der Stadt hat viele Klassenzimmer und lange Flure.",
    englisch:
      "The old school in the town has many classrooms and long hallways.",
    score: 0,
  },
  {
    deutsch: "Der Baum vor unserem Haus ist im Frühling voller grüner Blätter.",
    englisch:
      "The tree in front of our house is full of green leaves in spring.",
    score: 0,
  },
  {
    deutsch:
      "Das Auto fährt schnell über die Autobahn und überholt andere Fahrzeuge.",
    englisch:
      "The car drives quickly on the highway and overtakes other vehicles.",
    score: 0,
  },
];

populateVoiceList();

function playVoiceSample() {
  const voiceSelect = document.getElementById("voices");
  const selectedVoiceName = voiceSelect.value;

  if (!selectedVoiceName) {
    alert("Bitte wählen Sie eine Stimme aus.");
    return;
  }

  playVoice(selectedVoiceName, "Hello, my name is " + selectedVoiceName);
}

function playVoice(selectedVoiceName, text) {
  console.log("voicename >" + selectedVoiceName + "<");

  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const selectedVoice = voices.find(
    (voice) => voice.name === selectedVoiceName
  );
  const utterThis = new SpeechSynthesisUtterance(text);
  utterThis.voice = selectedVoice;
  utterThis.rate = 0.5;
  utterThis.pitch = 1.4;

  synth.speak(utterThis);
}

function populateVoiceList() {
  let useHardcoded = true;

  if (useHardcoded) {
    const voiceSelect = document.getElementById("voices");

    voiceSelect.innerHTML = "";

    // Hardcodierte Stimmenliste
    const hardcodedVoices = [
      "Samantha",
      "Daniel",
      //  'Karen',

      "Orgel",
      "Cellos",
      "Zarvox",
      "Flüstern",
      "Seifenblasen",
    ];

    // Optionen in das Select-Element einfügen
    hardcodedVoices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice;
      option.textContent = voice;
      voiceSelect.appendChild(option);
    });
  } else {
    const voices = window.speechSynthesis.getVoices();
    const voiceSelect = document.getElementById("voices");

    console.log(voices.length + " voices");

    // Filter englisches Englisch
    const filteredVoices = voices.filter((voice) =>
      voice.lang.startsWith("en")
    );

    // Optionen in das Select-Element einfügen
    filteredVoices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.name;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });
  }
}

/*
function populateVoiceList() {
  const voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById('voices');

  console.log(voices.length + " voices");

  // Filter englisches Englisch
  const filteredVoices = voices.filter(voice => 
    voice.lang === 'en-GB'
  );

  // Optionen in das Select-Element einfügen
  filteredVoices.forEach(voice => {
    const option = document.createElement('option');
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}*/

// Eventlistener für das Laden der Stimmen (falls verzögert geladen)
if (
  typeof speechSynthesis !== "undefined" &&
  speechSynthesis.onvoiceschanged !== undefined
) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
} else {
  populateVoiceList();
}

function selectVocabularyFile() {
  document.getElementById("fileInput").click();
}

function speak() {
  console.log("speak");
  const selectedVoice = document.getElementById("voices").value;
  const textElement = document.getElementById("vocabulary");
  const direction = document.getElementById("direction").value;
  const text = textElement.textContent || textElement.innerText; // Textinhalt des Elements

  //if (direction === 'en-de')
  {
    playVoice(selectedVoice, text);
  }
}

function speakQuestion() {
  console.log("speakQuestion");
  const selectedVoice = document.getElementById("voices").value;
  const textElement = document.getElementById("question");
  const direction = document.getElementById("direction").value;
  const text = textElement.textContent || textElement.innerText; // Textinhalt des Elements

  //if (direction === 'en-de')
  {
    playVoice(selectedVoice, text);
  }
}

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const content = e.target.result;
        localStorage.setItem(LOCAL_STORAGE_KEY, content);
        parseVocabulary(content);
        document.getElementById("settings").classList.remove("hidden");
      };
      reader.readAsText(file);
    } else {
      vocabularyList = defaultVocabulary;
    }
  });

function parseVocabulary(content) {
  vocabularyList = content
    .trim()
    .split("\n")
    .map((line) => {
      // Trennen Sie die Zeile am ersten Bindestrich, um `deutsch` und `englisch` zu erhalten
      const parts = line.split(" - ");
      if (parts.length === 2) {
        // Nur wenn exakt ein Bindestrich vorhanden ist
        const deutsch = parts[0].trim();
        const englisch = parts[1].trim();
        return { deutsch, englisch, score: 0 };
      } else {
        console.warn("Zeile konnte nicht korrekt geparst werden:", line);
        return null; // Ignorieren der Zeile, wenn das Format nicht passt
      }
    })
    .filter((entry) => entry !== null); // Entfernen aller ungültigen Einträge

  console.log("Vokabelliste:", vocabularyList);
}

function confirmEndTraining() {
  if (confirm("Möchten Sie das Training wirklich abbrechen?")) {
    endTraining();
  }
}

function startTraining() {
  if (vocabularyList.length === 0) {
    vocabularyList = defaultVocabulary;
    console.log("Standard-Vokabelliste geladen:", vocabularyList);
  }

  document.getElementById("fileselect").classList.add("hidden");

  direction = document.getElementById("direction").value;
  currentMode = document.getElementById("mode").value;
  correctAnswers = 0;
  currentIndex = 0;

  document.getElementById("settings").classList.add("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("abortButton").classList.remove("hidden");

  if (currentMode === "flashcard") {
    startFlashcardMode();
  } else if (currentMode === "multiple-choice") {
    startMultipleChoiceMode();
  }
}

function startFlashcardMode() {
  document.getElementById("flashcard-mode").classList.remove("hidden");
  document.getElementById("flashcard-mode").style.display = "flex";
  selectNextFlashcard();
}

function selectNextFlashcard() {
  const totalScore = vocabularyList.reduce(
    (acc, vocab) => acc + (10 - vocab.score),
    0
  );
  let random = Math.random() * totalScore;
  for (let vocab of vocabularyList) {
    random -= 10 - vocab.score;
    if (random <= 0) {
      setFlashcard(vocab);
      return;
    }
  }
}

function setFlashcard(vocab) {
  currentVocab = vocab;

  // Extrahiere den anzuzeigenden Text in eine eigene Variable
  let displayText = direction === "de-en" ? vocab.deutsch : vocab.englisch;

  // Setze den Text im Element "vocabulary"
  document.getElementById("vocabulary").innerText = displayText;

  // Prüfe die Länge des Textes und passe die Schriftgröße an
  if (displayText.length > 15) {
    document.getElementById("vocabulary").style.fontSize = "1.6em";
  } else {
    document.getElementById("vocabulary").style.fontSize = "2.2em"; // Standardgröße zurücksetzen
  }

  document.getElementById("flipButton").classList.remove("hidden");
  document.getElementById("knowButton").classList.add("hidden");
  document.getElementById("dontKnowButton").classList.add("hidden");
}

function flipCard() {
  document.getElementById("vocabulary").innerText =
    direction === "de-en" ? currentVocab.englisch : currentVocab.deutsch;
  document.getElementById("flipButton").classList.add("hidden");
  document.getElementById("knowButton").classList.remove("hidden");
  document.getElementById("dontKnowButton").classList.remove("hidden");
}

function markKnown(isKnown) {
  if (isKnown) {
    currentVocab.score = Math.min(currentVocab.score + 1, 10);
  } else {
    currentVocab.score = Math.max(currentVocab.score - 1, 0);
  }
  selectNextFlashcard();
}

function startMultipleChoiceMode() {
  document.getElementById("multiple-choice-mode").classList.remove("hidden");
  initializeProgressBar();
  loadMultipleChoiceQuestion();
}

function initializeProgressBar() {
  const progressContainer = document.getElementById("progress");
  progressContainer.innerHTML = "";
  progressSegments = [];

  vocabularyList.forEach(() => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment");
    progressContainer.appendChild(segment);
    progressSegments.push(segment);
  });
}

function initializeCompletionAnimation() {
  const container = document.getElementById("completion-animation");
  if (!container) {
    return;
  }

  if (typeof lottie === "undefined") {
    console.warn("Lottie-Bibliothek wurde nicht geladen.");
    return;
  }

  completionAnimation = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: COMPLETION_ANIMATION_PATH,
    name: "finish-flag-animation",
  });
  completionAnimation.setSpeed(COMPLETION_ANIMATION_SPEED);

  completionAnimation.addEventListener("DOMLoaded", () => {
    const duration = completionAnimation.getDuration() * 1000;
    if (duration && !Number.isNaN(duration)) {
      completionAnimationDuration = Math.max(2000, Math.round(duration));
    }
  });

  completionAnimation.addEventListener("complete", () => {
    setTimeout(hideCompletionOverlay, 700);
  });
}

function playCompletionAnimation() {
  const overlay = document.getElementById("completion-overlay");
  if (!overlay || !completionAnimation) {
    return 1000;
  }

  overlay.classList.add("active");
  completionAnimation.goToAndStop(0, true);
  completionAnimation.play();

  return completionAnimationDuration + 700;
}

function hideCompletionOverlay() {
  const overlay = document.getElementById("completion-overlay");
  if (overlay) {
    overlay.classList.remove("active");
  }

  if (completionAnimation) {
    completionAnimation.stop();
  }
}

let correctButton = null; // Variable zur Speicherung des Buttons mit der korrekten Antwort

function loadMultipleChoiceQuestion() {
  if (currentIndex >= vocabularyList.length) {
    showResultDialog();
    return;
  }

  const vocab = vocabularyList[currentIndex];
  const correctAnswer = direction === "de-en" ? vocab.englisch : vocab.deutsch;
  const questionText = direction === "de-en" ? vocab.deutsch : vocab.englisch;

  if (questionText.length > 40) {
    document.getElementById("question").style.fontSize = "1.6em";
  } else {
    document.getElementById("question").style.fontSize = "";
  }

  document.getElementById("question").innerText = questionText;

  if (direction === "en-de") {
    setTimeout(() => {
      speakQuestion(questionText);
    }, 750);
  }

  const choices = [correctAnswer];
  while (choices.length < 4) {
    const randomChoice =
      vocabularyList[Math.floor(Math.random() * vocabularyList.length)][
        direction === "de-en" ? "englisch" : "deutsch"
      ];
    if (!choices.includes(randomChoice)) {
      choices.push(randomChoice);
    }
  }
  choices.sort(() => Math.random() - 0.5);

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = ""; // Leeren des Containers

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.textContent = choice; // Text wird unverändert angezeigt

    console.log("CHougn " + choice + " len = " + choice.length);

    // Anpassung der Schriftgröße bei langen Wörtern
    if (choice.length > 40) {
      button.style.fontSize = "0.9em";
    } else if (choice.length > 15) {
      button.style.fontSize = "1.3em";
    } else {
      button.style.fontSize = ""; // Standardgröße zurücksetzen
    }

    // Speichern des Buttons, falls es die korrekte Antwort ist
    if (choice === correctAnswer) {
      correctButton = button; // Dieser Button enthält die richtige Antwort
    }

    button.addEventListener("click", () =>
      checkAnswer(button, choice, correctAnswer, correctButton)
    );
    choicesContainer.appendChild(button);
  });
}

function checkAnswer(button, selected, correct, correctButton) {
  var incorrect = false;
  if (selected === correct) {
    button.classList.add("correct");
    progressSegments[currentIndex].classList.add("progress-correct");
    playPositiveSound();
    correctAnswers++;
  } else {
    incorrect = true;
    // Markiere den correctButton, um ihn hervorzuheben
    correctButton.classList.add("highlight");
    button.classList.add("incorrect");
    progressSegments[currentIndex].classList.add("progress-incorrect");
    playNegativSound();
    setTimeout(() => {
      button.classList.remove("correct", "incorrect");
    }, 500);
  }

  // Entferne die Markierungen nach 1 Sekunde und lade die nächste Frage
  setTimeout(
    () => {
      button.classList.remove("correct", "incorrect");
      currentIndex++;
      loadMultipleChoiceQuestion();
    },
    incorrect ? 1500 : 800
  );
}

function showResultDialog() {
  if (correctAnswers < vocabularyList.length) {
    playMp3Sound("sounds/marimba-win.mp3");
  } else {
    var soundmode = document.getElementById("theme").value;
    if (soundmode === "burp") {
      playMp3Sound("sounds/burps/winner-burp.mp3");
    }
    if (soundmode === "fart") {
      playMp3Sound("sounds/farts/winner-fart.mp3");
    }
    if (soundmode === "normal") {
      playMp3Sound("sounds/cheer.mp3");
    }
  }

  const completionDelay =
    currentMode === "multiple-choice" ? playCompletionAnimation() : 1000;

  setTimeout(() => {
    alert(
      `Herzlichen Glückwunsch! Du hast ${correctAnswers} von ${vocabularyList.length} Vokabeln korrekt übersetzt!`
    );
    endTraining();
  }, completionDelay); // Verzögerung des Alerts um die Animationsdauer
}

function endTraining() {
  hideCompletionOverlay();
  document.getElementById("abortButton").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
  document.getElementById("flashcard-mode").classList.add("hidden");
  document.getElementById("multiple-choice-mode").classList.add("hidden");
  document.getElementById("fileselect").classList.remove("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("flashcard-mode").style.display = "none";
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Prüfen, ob der AudioContext im "suspended" Zustand ist und ggf. auf "running" setzen
document.addEventListener(
  "click",
  () => {
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  },
  { once: true }
); // Nur einmal ausführen

function playMp3Sound(soundfile) {
  const audio = new Audio(soundfile); // Pfad zur Sounddatei
  audio.play();
}

function playPositiveSound() {
  var soundmode = document.getElementById("theme").value;
  console.log(" p sounds mode " + soundmode);
  if (soundmode === "normal") {
    playMp3Sound("sounds/triangle_open.mp3");
  }

  if (soundmode === "burp") {
    var soundbase = "sounds/burps/";
    playOneOfMp3Sounds(
      soundbase + "belch.mp3",
      soundbase + "burp1.mp3",
      soundbase + "burp2.mp3",
      soundbase + "burp3.mp3",
      soundbase + "burp4.mp3",
      soundbase + "burp5.mp3"
    );
  }

  if (soundmode === "fart") {
    var soundbase = "sounds/farts/";
    playOneOfMp3Sounds(
      soundbase + "fart1.mp3",
      soundbase + "fart2.mp3",
      soundbase + "fart3.mp3",
      soundbase + "fart4.mp3",
      soundbase + "fart5.mp3",
      soundbase + "fart6.mp3"
    );
  }
}

function playOneOfMp3Sounds(...sounds) {
  // Wählt zufällig einen der übergebenen Soundpfade aus
  const randomIndex = Math.floor(Math.random() * sounds.length);
  const selectedSound = sounds[randomIndex];

  // Spielt den ausgewählten Sound ab
  playMp3Sound(selectedSound);
}

function playNegativSound() {
  var soundmode = document.getElementById("theme").value;
  console.log(" n sounds mode " + soundmode);
  if (soundmode === "normal") {
    playMp3Sound("sounds/error-5.mp3");
  } else {
    playMp3Sound("sounds/triangle_open.mp3");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  // Prüfen, ob gespeicherter Dateiinhalt existiert
  const storedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedContent) {
    // Gespeicherten Dateiinhalt parsen und verwenden
    parseVocabulary(storedContent);
    console.log("Gespeicherte Datei geladen.");
  }
  initializeCompletionAnimation();
});
