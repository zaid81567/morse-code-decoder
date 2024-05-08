// VARIABLES
const morse_el = document.getElementById("morse");
const eng_el = document.getElementById("eng");
const swap_btn = document.getElementById("swap-btn");
const io_box_container_el = document.getElementById("io-box-container");
const virtual_btns_el = document.getElementById("virtual-btn");
let prev_field_len = 0;
morse_el.disabled = true;
// model box
const git_btn = document.getElementById("git-icon-btn");
const git_model_container_el = document.getElementById("model-box-container");
let isGitHidden = true;
let hasVirtualMorseBtnTurnedOn = false;

//record of translated morse
let translatedMorse = [];
const aplhaToMorse = {
  a: ".-",
  b: "-...",
  c: "-.-.",
  d: "-..",
  e: ".",
  f: "..-.",
  g: "--.",
  h: "....",
  i: "..",
  j: ".---",
  k: "-.-",
  l: ".-..",
  m: "--",
  n: "-.",
  o: "---",
  p: ".--.",
  q: "--.-",
  r: ".-.",
  s: "...",
  t: "-",
  u: "..-",
  v: "...-",
  w: ".--",
  x: "-..-",
  y: "-.--",
  z: "--..",
  ".": ".-.-.-", // Period (.)
  ",": "--..--", // Comma (,)
  "?": "..--..", // Question mark (?)
  "'": ".----.", // Apostrophe (')
  "!": "-.-.--", // Exclamation mark (!)
  "/": "-..-.", // Slash (/)
  "(": "-.--.", // Left parenthesis ((
  ")": "-.--.-", // Right parenthesis ())
  "&": ".-...", // Ampersand (&)
  ":": "---...", // Colon (:)
  ";": "-.-.-.", // Semicolon (;)
  "=": "-...-", // Equal sign (=)
  "+": ".-.-.", // Plus sign (+)
  "-": "-....-", // Hyphen (-)
  _: "..--.-", // Underscore (_)
  '"': ".-..-.", // Quotation mark (")
  $: "...-..-", // Dollar sign ($)
  "@": ".--.-.", // At sign (@)
  0: "-----", // Digit 0
  1: ".----", // Digit 1
  2: "..---", // Digit 2
  3: "...--", // Digit 3
  4: "....-", // Digit 4
  5: ".....", // Digit 5
  6: "-....", // Digit 6
  7: "--...", // Digit 7
  8: "---..", // Digit 8
  9: "----.", // Digit 9
};

//to reduce space comsumption, morse to alpha will only be added when user will actually want to translate so.
const morseToAlpha = {};
let single_morse_code = "";

//=====ENG -> MORSE ==================================
eng_el.addEventListener("input", (event) => {
  let keyPressed = getKey(eng_el);
  console.log("keypressed: " + "'" + keyPressed + "'");
  // console.log(keyPressed);
  // console.log(aplhaToMorse[keyPressed]);
  //handle backspace
  if (keyPressed === "Backspace") {
    let popped_el = translatedMorse.pop();
    //clearing everything from morse side if user erases everything from eng side
    setTimeout(() => {
      console.log(eng_el.value);
      if (isClearedBySelection(eng_el)) {
        prev_field_len = 0;
        translatedMorse = [];
        renderMorse();
      }
    });

    // console.log(eng_el.value);
    renderMorse();
  }
  //handle space
  if (keyPressed === " " && translatedMorse.length > 0) {
    translatedMorse.push("/");
    renderMorse();
    return;
  }
  //handle alphabets
  if (aplhaToMorse[keyPressed]) {
    translatedMorse.push(aplhaToMorse[keyPressed]);
    renderMorse();
  }
});

function renderMorse() {
  morse_el.value = "";
  for (let i = 0; i < translatedMorse.length; i++) {
    morse_el.value += translatedMorse[i] + " ";
  }
}

//=====MORSE -> ENG===================================
virtual_btns_el.addEventListener("click", (event) => {
  let keyPressed = null;
  if (event.target.classList.contains("dit")) {
    // console.log("dit");
    keyPressed = ".";
  } else if (event.target.classList.contains("dat")) {
    // console.log("dat");
    keyPressed = "-";
  } else if (event.target.classList.contains("space")) {
    // console.log("space");
    keyPressed = "Space";
  } else if (event.target.classList.contains("forward-slash")) {
    keyPressed = "/";
    // console.log("erase");
  } else if (event.target.classList.contains("erase")) {
    keyPressed = "Backspace";
    // console.log("erase");
  }

  // console.log(keyPressed);

  if (keyPressed != null) {
    console.log("Keypressed: " + keyPressed);
    if (keyPressed == "." || keyPressed == "-") {
      morse_el.value += keyPressed;
      single_morse_code += keyPressed;
      console.log("single morse code: " + single_morse_code);
    }

    //populating morseToAplha Object
    if (Object.keys(morseToAlpha).length == 0) {
      for (let letter in aplhaToMorse) {
        let morseVal = aplhaToMorse[letter];
        morseToAlpha[morseVal] = letter;
      }
    }

    //handle forwardslash
    if (keyPressed == "/") {
      console.log("in if of /");
      eng_el.value += " ";
      morse_el.value += "/";
      return;
    }

    //handle backspace
    if (keyPressed === "Backspace") {
      //erase morse side
      let morseArray = morse_el.value.trim().split(" ");
      //check if ereasing morse is an alphabet then don't erase eng part since that's not a part of morse
      if (morseArray[morseArray.length - 1].match(/^[0-9a-z/]+$/)) {
        console.log("THAT WAS NOT MORSE -> NOT ERASING ENG PART");
        return;
      }
      morseArray.pop();
      morse_el.value = morseArray.join(" ") + " ";

      //erase eng side
      let engArray = eng_el.value.trim().split("");
      engArray.pop();
      if (engArray.length > 0) {
        eng_el.value = engArray.join("");
      } else {
        eng_el.value = "";
      }
    }

    //handle space
    if (keyPressed === " " || keyPressed == "Space") {
      if (morseToAlpha[single_morse_code]) {
        eng_el.value += morseToAlpha[single_morse_code];
        single_morse_code = "";
        morse_el.value += " ";
      } else {
        console.log("no match");
      }
    }
  }
});
morse_el.addEventListener("input", (event) => {
  // if (event.key == "." || event.key == "-") {
  //   single_morse_code += event.key;
  // }
  let keyPressed = getKey(morse_el);
  console.log("Keypressed: " + keyPressed);
  if (keyPressed == "." || keyPressed == "-") {
    single_morse_code += keyPressed;
  }

  //populating morseToAplha Object
  if (Object.keys(morseToAlpha).length == 0) {
    for (let letter in aplhaToMorse) {
      let morseVal = aplhaToMorse[letter];
      morseToAlpha[morseVal] = letter;
    }
  }

  //handle forwardslash
  if (keyPressed == "/") {
    eng_el.value += " ";
    return;
  }

  //handle backspace
  if (keyPressed === "Backspace") {
    //erase morse side
    let morseArray = morse_el.value.trim().split(" ");
    //check if ereasing morse is an alphabet then don't erase eng part since that's not a part of morse
    if (morseArray[morseArray.length - 1].match(/^[0-9a-z/]+$/)) {
      console.log("THAT WAS NOT MORSE -> NOT ERASING ENG PART");
      return;
    }
    morseArray.pop();
    morse_el.value = morseArray.join(" ") + " ";

    //erase eng side
    let engArray = eng_el.value.trim().split("");
    engArray.pop();
    if (engArray.length > 0) {
      eng_el.value = engArray.join("");
    } else {
      eng_el.value = "";
    }
  }

  //handle space
  if (keyPressed === " ") {
    if (morseToAlpha[single_morse_code]) {
      eng_el.value += morseToAlpha[single_morse_code];
      single_morse_code = "";
    } else {
      console.log("no match");
    }
  }
});

//=====HANDLE SWAP BTN================================
swap_btn.addEventListener("click", (event) => {
  // morse -> eng
  if (morse_el.disabled) {
    morse_el.disabled = false;
    eng_el.disabled = true;
    if (window.innerWidth <= 600) {
      io_box_container_el.style.flexDirection = "column-reverse";
      io_box_container_el.style.height = "65dvh";
      morse_el.style.height = "10dvh";
      eng_el.style.height = "55dvh";

      virtual_btns_el.style.display = "flex";
    } else {
      io_box_container_el.style.flexDirection = "row-reverse";
      virtual_btns_el.style.display = "none";
    }
  } else {
    // eng -> morse
    morse_el.disabled = true;
    eng_el.disabled = false;

    if (window.innerWidth <= 600) {
      io_box_container_el.style.flexDirection = "column";
      eng_el.style.height = "10dvh";
      morse_el.style.height = "75dvh";
      virtual_btns_el.style.display = "none";
    } else {
      io_box_container_el.style.flexDirection = "row";
      virtual_btns_el.style.display = "none";
    }
  }

  //   clear
  morse_el.value = "";
  eng_el.value = "";

  prev_field_len = 0;
});

// =====UTILITIES FUNCTIONS=================================
function isClearedBySelection(element) {
  return element.value == "";
}

function getKey(input_el) {
  // console.log(input_el);
  let str = input_el.value;
  console.log(prev_field_len, str.length);

  if (prev_field_len > str.length) {
    // console.log("Returning Backspace");
    if (input_el.id == "morse") {
      prev_field_len = str.length - 1;
    } else {
      prev_field_len -= 1;
    }
    return "Backspace";
  }

  prev_field_len = str.length;
  // console.log("String: '" + str + "'");
  let currentChar = str.charAt(str.length - 1).toLowerCase();
  // console.log("Character: '" + currentChar + "'");
  return currentChar;
}

//=======GIT_MODEL_EVENT_HANDLERS===================================

git_btn.addEventListener("click", () => {
  if (isGitHidden) {
    git_model_container_el.style.display = "inherit";
  }
});

git_model_container_el.addEventListener("click", () => {
  git_model_container_el.style.display = "none";
});

document.getElementById("model-box").addEventListener("click", (event) => {
  event.stopPropagation();
});
