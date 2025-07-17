const baseSheetID = '1AwPGr0h17V5CWTgO4GGk35hD8fr_GDy9uHOjTVIO3n4';
let flashcards = [];
let currentCard = 0;
let isFlipped = false;

function getSheetURL(gid) {
  return `https://docs.google.com/spreadsheets/d/${baseSheetID}/export?format=csv&gid=${gid}`;
}

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
      flashcards = lines.slice(1).map(line => {
        // Split only on the first comma to support commas in definitions
        const [term, ...rest] = line.split(',');
        const definition = rest.join(','); 
        return { term: term.trim(), definition: definition.trim() };
      });
      currentCard = 0;
      isFlipped = false;
      displayCard();
    })
    .catch(error => {
      document.getElementById('card-front').innerText = 'Error loading flashcards.';
      document.getElementById('card-back').innerText = '';
      console.error('Error:', error);
    });
}

function displayCard() {
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const card = flashcards[currentCard];

  front.innerText = card.term;
  back.innerText = card.definition;

  const flashcard = document.getElementById('flashcard');
  if (isFlipped) {
    flashcard.classList.add('flipped');
  } else {
    flashcard.classList.remove('flipped');
  }
}

// Flip card on tap (not button click)
document.getElementById('flashcard').addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') {
    e.stopPropagation();
    return;
  }
  const flashcard = document.getElementById('flashcard');
  flashcard.classList.toggle('flipped');
  isFlipped = !isFlipped;
});

document.getElementById('next-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  isFlipped = false;  // Reset to front on navigation
  currentCard = (currentCard + 1) % flashcards.length;
  displayCard();
});

document.getElementById('back-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  isFlipped = false;  // Reset to front on navigation
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  displayCard();
});

document.getElementById('sheet-select').addEventListener('change', (e) => {
  const selectedGID = e.target.value;
  isFlipped = false;
  fetchFlashcards(selectedGID);
});

// Load initial sheet (Day 1 = gid 0)
fetchFlashcards('0');

