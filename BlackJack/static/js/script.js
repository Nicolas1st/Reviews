const cards = ['0_10.jpg', '10_3.jpg', '11_3.jpg', '12_4.jpg', '13_4.jpg', '14_4.jpg', '15_4.jpg', '16_5.jpg', '17_5.jpg', '18_5.jpg', '19_5.jpg', '1_10.jpg', '20_6.jpg', '21_6.jpg', '22_6.jpg', '23_6.jpg', '24_7.jpg', '25_7.jpg', '26_7.jpg', '27_7.jpg', '28_8.jpg', '29_8.jpg', '2_10.jpg', '30_8.jpg', '31_8.jpg', '32_9.jpg', '33_9.jpg', '34_9.jpg', '35_9.jpg', '36_11.jpg', '37_11.jpg', '38_11.jpg', '39_11.jpg', '3_10.jpg', '40_10.jpg', '41_10.jpg', '42_10.jpg', '43_10.jpg', '44_10.jpg', '45_10.jpg', '46_10.jpg', '47_10.jpg', '48_10.jpg', '49_10.jpg', '4_2.jpg', '50_10.jpg', '51_10.jpg', '5_2.jpg', '6_2.jpg', '7_2.jpg', '8_3.jpg', '9_3.jpg'];
let takenCards = [];

// there was an idea to add sounds but I found them to be too anoying


// class for both the human and computer players
class Player {

  constructor(cardsContainer, pointsContainer) {
    this.cardTable = document.querySelector(cardsContainer);
    this.pointRecord = document.querySelector(pointsContainer);
    this.points = Number(this.pointRecord.textContent);
  }

  hit() {
    if (this.points > 21) {
      return;
    }
    const card = this.takeRandomCard();
    this.updateScore(card);
    this.showCard(card);
  }


  takeRandomCard() {
    if (this.points > 21) {
      return;
    }
    while (1) {
      let card = cards[Math.floor(Math.random()*52)];
      if (!takenCards.includes(card)) {
        takenCards.push(card);
        return card;
      }
    }
  }


  showCard(card) {
    const cardImage = document.createElement('img');
    cardImage.src = `/static/images/${card}`;
    cardImage.className = 'players-cards';
    this.cardTable.appendChild(cardImage);
  }


  updateScore(card) {
    let [placeInDeck, value] = card.split('.')[0].split('_').map(Number);
    
    // checking for ace
    if (value === 11 && this.points + value > 21) {
      value = 1;
    }

    this.points += value;
    if (this.points <= 21) {
      this.pointRecord.textContent = this.points;
    } else {
      this.pointRecord.textContent = 'Bust!';
      this.pointRecord.style.color = 'red';
    }
  }

  deal() {
    while (this.cardTable.firstChild) {
      this.cardTable.firstChild.remove();
    }
    
    this.points = 0;
    this.pointRecord.textContent = 0;
    this.pointRecord.style.color = '#ffffff';
  }

  botPlay() {
    while (this.points < 15) {
      this.hit();
    }
  }
}


function displayResults(result, resultMessage, winScore, lossScore, drawScore) {
  if (result === 'You Won!') {
    resultMessage.textContent = 'You Won!'; // maybe it's better to set it just to result
    resultMessage.style.color = 'green';
    winScore.textContent = Number(winScore.textContent) + 1;
  } else if (result === 'You Lost!') {
    resultMessage.textContent = 'You Lost!';
    resultMessage.style.color = 'red';
    lossScore.textContent = Number(lossScore.textContent) + 1;
  } else {
    resultMessage.textContent = 'You Drew!';
    resultMessage.style.color = 'yellow';
    drawScore.textContent = Number(drawScore.textContent) + 1;
  }
}

function finishGame(humanPlayer, computerPlayer, resultMessage, scores) {
  let result;
  if (humanPlayer.points <= 21) {
    if (humanPlayer.points > computerPlayer.points || computerPlayer.points > 21) {
      result = 'You Won!';
    } else if (humanPlayer.points < computerPlayer.points && computerPlayer.points <= 21) {
      result = 'You Lost!';
    } else {
      result = 'You Drew!';
    }
  } else {
    if (computerPlayer.points > 21) {
      result = 'You Drew!';
    } else {
      result = 'You Lost!';
    }
  }
  displayResults(result, resultMessage, ...scores);
}


// ##############################################################################
let humanPlayer = new Player('.human-player-cards', '.human-player-points');
let computerPlayer = new Player('.computer-player-cards', '.computer-player-points');
let resultMessage = document.querySelector('.message-area');
let scores = [document.querySelector('.win-score'), document.querySelector('.loss-score'), document.querySelector('.draw-score')]
// let winScore = document.querySelector('.win-score');
// let lossScore = document.querySelector('.loss-score');
// let drawScore = document.querySelector('.draw-score');


// ##############################################################################
let hitButton = document.querySelector('.hit-button');
hitButton.addEventListener('click', () => humanPlayer.hit());


// ##############################################################################
let standButton = document.querySelector('.stand-button');
standButton.addEventListener('click', () => {
  computerPlayer.botPlay();
  finishGame(humanPlayer, computerPlayer, resultMessage, scores);
})


// ##############################################################################
// essentially it's a restart button
let dealButton = document.querySelector('.deal-button');
dealButton.addEventListener('click', () => {
  humanPlayer.deal();
  computerPlayer.deal();
  resultMessage.innerText = "Let's play";
  resultMessage.style.color = 'green';
});
