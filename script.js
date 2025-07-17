const baseSheetID = '1AwPGr0h17V5CWTgO4GGk35hD8fr_GDy9uHOjTVIO3n4'; // Google Sheet ID

let flashcards = [];
let currentCard = 0;
let isFlipped = false;

// Get CSV link for selected sheet tab
function getSheetURL(gid) {
  return `https://docs.google.com/spreadsheets/d/${baseSheetID}/export?format=csv&gid=${gid}`;
}

// Fetch flashcards and parse
function fetchFlashcards(gid) {
  const sheetURL = getSheetURL(gid);

  fetch(sheetURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch CSV');
      }
      return response.text();
    })
    .then(data => {
      const lines = data.trim().split('\n');

      // Remove the header row
      const rawCards = lines.slice(1);

      flashcards = rawCards.map(line => {
        const [term, definition] = line.split(',');
        return {
          term: (term || '').trim(),
          definition: (definition || '').trim()
        };
      });

      currentCard = 0;
      shuffleFlashcards();
      displayCard();
    })
    .catch(error => {
      document.getElementById('card-front').innerText = 'Error loading flashcards.';
      document.getElementById('card-back').innerText = '';
      console.error('Error:', error);
    });
}

// Shuffle cards randomly
function shuffleFlashcards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
}

// Display front and back of the current card
function displayCard() {
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const card = flashcards[currentCard];

  front.innerText = card.term;
  back.innerText = card.definition;

  const flashcard = document.getElementById('flashcard');
  flashcard.classList.toggle('flipped', isFlipped);
}

// Flip card when user taps the flashcard (but not buttons)
document.getElementById('flashcard').addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    return;
  }
  isFlipped = !isFlipped;
  displayCard();
});

// Next button
document.getElementById('next-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  isFlipped = false;
  currentCard = (currentCard + 1) % flashcards.length;
  displayCard();
});

// Back button
document.getElementById('back-btn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  isFlipped = false;
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  displayCard();
});

// Dropdown to select sheet tab
document.getElementById('sheet-select')?.addEventListener('change', (e) => {
  const selectedGID = e.target.value;
  isFlipped = false;
  fetchFlashcards(selectedGID);
});

// Load Day 1 by default (gid=0)
fetchFlashcards('0');
