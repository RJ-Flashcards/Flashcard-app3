const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSm6VvHmCWfFh3Av-KM6IvuqcD_UdhNEq6-p_OE3V2e3BHs7boOoRb20Xq73isuU7eyvlqfl9SHNbMv/pub?output=csv";

let flashcards = [];
let currentIndex = 0;
let flipped = false;

const flashcard = document.querySelector(".flashcard");
const flashcardFront = document.getElementById("flashcard-front");
const flashcardBack = document.getElementById("flashcard-back");
const flashcardInner = document.getElementById("flashcard-inner");

async function loadFlashcards() {
  try {
    const response = await fetch(sheetUrl);
    const data = await response.text();
    const rows = data.trim().split("\n").slice(1); // skip header

    flashcards = rows.map(row => {
      const [word, definition] = row.split(",");
      return { word: word.trim(), definition: definition.trim() };
    });

    showCard();
  } catch (error) {
    flashcardFront.textContent = "Error loading flashcards";
    flashcardBack.textContent = "";
    console.error("Failed to load flashcards:", error);
  }
}

function showCard() {
  const card = flashcards[currentIndex];
  flashcardFront.textContent = card.word;
  flashcardBack.textContent = card.definition;
}

function flipCard() {
  flipped = !flipped;
  flashcard.classList.toggle("flipped", flipped);
}

function nextCard() {
  currentIndex = (currentIndex + 1) % flashcards.length;
  flipped = false;
  flashcard.classList.remove("flipped");
  showCard();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  flipped = false;
  flashcard.classList.remove("flipped");
  showCard();
}

loadFlashcards();


