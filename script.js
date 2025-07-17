<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vocabulary Flashcards</title>
  <link rel="stylesheet" href="style-v2.css" />
</head>
<body>
  <div class="app">
    <h1>Vocabulary Flashcards</h1>

    <div class="controls">
      <label for="sheet-select">Choose a Day:</label>
      <select id="sheet-select">
        <option value="0">Day 1</option>
        <option value="761404854">Day 2</option>
      </select>
    </div>

    <div id="card" class="card">
      <div class="card-inner">
        <div class="card-front" id="card-front">Loading...</div>
        <div class="card-back" id="card-back"></div>
      </div>
    </div>

    <div class="buttons">
      <button id="prev">Back</button>
      <button id="next">Next</button>
    </div>
  </div>

  <script>
    const SHEET_ID = "1AwPGr0h17V5CWTgO4GGk35hD8fr_GDy9uHOjTVIO3n4";
    const card = document.getElementById("card");
    const front = document.getElementById("card-front");
    const back = document.getElementById("card-back");
    const prevBtn = document.getElementById("prev");
    const nextBtn = document.getElementById("next");
    const sheetSelect = document.getElementById("sheet-select");

    let cards = [];
    let currentCard = 0;
    let showingDefinition = false;

    function getSheetURL(gid) {
      return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function updateCard() {
      if (cards.length === 0) {
        front.textContent = "No cards available.";
        back.textContent = "";
        return;
      }
      const item = cards[currentCard];
      front.textContent = item.word;
      back.textContent = item.definition;
    }

    async function loadSheet(gid) {
      const url = getSheetURL(gid);
      front.textContent = "Loading...";
      back.textContent = "";
      try {
        const response = await fetch(url);
        const text = await response.text();
        const lines = text.trim().split("\n");
        cards = lines.slice(1).map(line => {
          const [word, definition] = line.split(/,(.+)/);
          return { word: word.trim(), definition: definition.trim() };
        });
        shuffle(cards);
        currentCard = 0;
        showingDefinition = false;
        card.classList.remove("flipped");
        updateCard();
      } catch (error) {
        front.textContent = "Error loading cards.";
        back.textContent = "";
        console.error("Failed to load sheet:", error);
      }
    }

    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
      showingDefinition = !showingDefinition;
    });

    prevBtn.addEventListener("click", () => {
      if (currentCard > 0) {
        currentCard--;
        updateCard();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentCard < cards.length - 1) {
        currentCard++;
        updateCard();
      }
    });

    sheetSelect.addEventListener("change", (e) => {
      const gid = e.target.value;
      loadSheet(gid);
    });

    // Load Day 1 by default
    loadSheet("0");
  </script>
</body>
</html>






