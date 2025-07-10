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
      const headers = lines[0].split(',');
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
  const cardElement = document.getElementById('flashcard');

  if (flashcards.length === 0) {
    front.innerText = 'No flashcards available.';
    back.innerText = '';
    return;
  }

  const card = flashcards[currentCard];
  front.innerText = card.term;
  back.innerText = card.definition;

  cardElement.classList.remove('flipped');
  isFlipped = false;
}

document.getElementById('flashcard').addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'button') return; // Don't flip if button was clicked
  const cardElement = document.getElementById('flashcard');
  cardElement.classList.toggle('flipped');
  isFlipped = !isFlipped;
});


document.getElementById('next-btn').addEventListener('click', () => {
  if (flashcards.length === 0) return;
  currentCard = (currentCard + 1) % flashcards.length;
  displayCard();
});

fetchFlashcards();
