const sheetUrl = https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8El5F-Dzp9csw4uTuisucRK5eyq0q8Hkyq6q18-yX90e4M-8I9VBa2OsVhogDgudfTQScjuQhpubz/pub?output=csv

let flashcards = [];
let currentIndex = 0;
let showingDefinition = false;

const card = document.getElementById("card");
const nextBtn = document.getElementById("next-btn");

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadCSV(url) {
  fetch(url)
    .then((res) => res.text())
    .then((data) => {
      const rows = data.trim().split("\n").slice(1); // Skip header
      flashcards = rows.map((row) => {
        const [word, definition] = row.split(",");
        return { word: word.trim(), definition: definition.trim() };
      });

      shuffleArray(flashcards);
      showCard();
    })
    .catch((err) => {
      card.textContent = "Error loading flashcards.";
      console.error("Fetch error:", err);
    });
}

function showCard() {
  if (flashcards.length === 0) {
    card.textContent = "No cards loaded.";
    return;
  }

  const { word, definition } = flashcards[currentIndex];
  card.textContent = showingDefinition ? definition : word;
}

card.addEventListener("click", () => {
  showingDefinition = !showingDefinition;
  showCard();
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showingDefinition = false;
  showCard();
});

loadCSV(sheetUrl);
