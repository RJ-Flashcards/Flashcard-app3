const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8El5F-Dzp9csw4uTuisucRK5eyq0q8Hkyq6q18-yX90e4M-8I9VBa2OsVhogDgudfTQScjuQhpubz/pub?output=csv";

let flashcards = [];
let currentIndex = 0;

// Shuffle function
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadCSV(url) {
  console.log("Loading CSV from:", url);
  fetch(url)
    .then((res) => res.text())
    .then((data) => {
      const rows = data.trim().split("\n").slice(1); // Skip header
      flashcards = rows.map((row) => {
        const [word, definition] = row.split(",");
        return {
          word: word.trim(),
          definition: definition.trim()
        };
      });

      shuffleArray(flashcards);
      showCard();
    })
    .catch((err) => {
      document.getElementById("card-front").textContent = "Error loading flashcards.";
      console.error("Fetch error:", err);
    });
}

function showCard() {
  if (flashcards.length === 0) {
    document.getElementById("card-front").textContent = "No cards loaded.";
    document.getElementById("card-back").textContent = "";
    return;
  }

  const { word, definition } = flashcards[currentIndex];
  document.getElementById("card-front").textContent = word;
  document.getElementById("card-back").textContent = definition;

  // Make sure it always starts on the front side
  document.getElementById("card").classList.remove("flipped");
}

document.getElementById("card").addEventListener("click", () => {
  document.getElementById("card").classList.toggle("flipped");
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
});

loadCSV(sheetUrl);
