const sheetURL = 'https://raw.githubusercontent.com/RJ-Flashcards/Flashcard-app3/main/vocab.csv';

let flashcards = [];
let currentCard = 0;
let isFlipped = false;

function fetchFlashcards() {
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
        const [term, definition] = line.split(',');
        return { term: term.trim(), definition: definition.trim() };
      });
      shuffleFlashcards();
      displayCard();
    })
    .catch(error => {
      document.getElementById('card-front').innerText = 'Error loading flashcards.';
      console.error('Error:', error);
    });
}

function shuffleFlashcards() {
  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
}

function displayCard() {
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const flashcard = document.getElementById('flashcard');

  if (flashcards.length === 0) {
    front.innerText = 'No flashcards available.';
    back.innerText = '';
    return;
  }

  const card = flashcards[currentCard];
  front.innerText = card.term;
  back.innerText = card.definition;

  flashcard.classList.remove('flipped');
  isFlipped = false;
}

// ✅ Flip card on tap only
document.getElementById('flashcard').addEventListener('click', (e) => {
  const tag = e.target.tagName.toLowerCase();
  if (tag === 'button' || tag === 'svg' || tag === 'path') {
    return; // don't flip if a button or icon was tapped
  }

  document.getElementById('flashcard').classList.toggle('flipped');
  isFlipped = !isFlipped;
});

// ✅ Next button — go to next card and reset to front
document.getElementById('next-btn')?.addEventListener('click', () => {
  currentCard = (currentCard + 1) % flashcards.length;
  displayCard();  // this will reset to front and remove flipped state
});

// ✅ Back button — go to previous card and reset to front
document.getElementById('back-btn')?.addEventListener('click', () => {
  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  displayCard();  // also resets flip
});


  currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
  displayCard();
});

fetchFlashcards();


