const fieldSize = 28;
const deckSize = 52;
const suits = {
    '♥': 'hearts',
    '♦': 'diamonds',
    '♠': 'spades',
    '♣': 'clubs',
} 

const touchScreen = () => matchMedia('(hover: none)').matches;

const zIndex = () => {

    // console.log("ZINDEX");

    let zIndex = topIndex();

    zIndex < 5 ? zIndex *= 3 : zIndex *= 2;

    return zIndex;
}

const topIndex = () => {

    let cards = [...document.querySelectorAll(".waste")];
    let zIndex = 0;
    let topCard;

    for (let card of cards) {
        if (parseInt(card.style.zIndex) > parseInt(zIndex)) [zIndex, topCard] = [card.style.zIndex, card];
    }

    console.log(parseInt(zIndex));

    return parseInt(zIndex) == 0 ? 1 : parseInt(zIndex);
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]] 
    }
}

const safari = () => {

    let userAgent = window.navigator.userAgent.toLowerCase(),
    sfri = /safari/.test(userAgent),
    ios = /iphone|ipod|ipad/.test(userAgent);

    if (sfri) return true;
     
    return false;
}

const removeZoom = (e) => {

    let card = e.currentTarget;

    card.style.transform = card.style.transform.replace("scale(1.1)", "");
}

const rankValue = (rank) => {

    switch(rank) {
        case "A":
            rank = 1;
            break;
        case "J":
            rank = 11;
            break;
        case "Q":
            rank = 12;
            break;
        case "K":
            rank = 13;
            break;
        default:
            rank = parseInt(rank);
    }

    return rank;
}

const fillField = (topCell, cards, offset, delay, interval, duration) => {

    let opened = [0, 7, 13, 18, 22, 25, 27];

    for (let i = 0; i < fieldSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        card.style.display = 'block';

        let cell = document.querySelectorAll('.cell')[i + 7];
        let offsetLeft = cell.offsetLeft - card.offsetLeft;
        let offsetTop = cell.offsetTop - card.offsetTop;

        card.querySelectorAll('.front, .back').forEach(card => {
            card.style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;
        });

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        if (opened.includes(i)) card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector('.stock');

    for (let i = fieldSize; i < deckSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        card.style.display = 'block';

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const setCardsSize = () => {

    if (window.innerHeight > window.innerWidth) {
            document.documentElement.style.setProperty('--cell-width', Math.floor(window.innerWidth *  0.97 / 7 * 0.88) + 'px');
        } else {
            document.documentElement.style.setProperty('--cell-width', Math.floor(window.innerHeight *  0.97 / 7 * 0.88) + 'px');
    }

    if (window.innerHeight > window.innerWidth) {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerWidth *  0.97 / 7 * 0.86) + 'px');
    } else {
        document.documentElement.style.setProperty('--card-width', Math.floor(window.innerHeight *  0.97 / 7 * 0.86) + 'px');
    }
}

const getDeck = () => {

    let deck = [];
    let ranks = decks[Math.floor(Math.random() * decks.length)];
    let suits = ['♥','♠','♦','♣'];

    ranks.forEach(rank => {

        switch(rank) {
            case 11:
                rank = 'J';
                break;
            case 12:
                rank = 'Q';
                break;
            case 13:
                rank = 'K';
                break;
            case 1:
                rank = 'A';
                break;
            default:
                rank = String(rank);
        }

        shuffle(suits);

        for (suit of suits) {

            let card = rank + suit;

            if (!deck.includes(card)) {
                deck.push(card);
                break;
            }
        }
    });

    return deck;
}

const setCards = () => {

    let cards = document.querySelectorAll('.front');

    deck = getDeck();

    for (let i = 0; i < 52; i++){

        let card = cards[i];
        let rank = deck[i].length == 2 ? deck[i][0] : deck[i][0] + deck[i][1];
        let suit = deck[i].length == 2 ? deck[i][1] : deck[i][2];

        if (suit == '♥' || suit == '♦') { 
            card.classList.add('red');
        }

        card.querySelector('.rank').innerText = rank;
        // card.style.zIndex = -1;

        switch(suit){
            case '♥':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/hearts.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/hearts.png';
                break;
            case '♦':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/diamonds.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/diamonds.png';
                break;
            case '♠':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/spades.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/spades.png';
                break;
            case '♣':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/clubs.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/clubs.png';
                break;
        }
    } 
}

const setTable = () => {

    setCardsSize();
    setCards();

    let topCell = document.querySelectorAll('.cell')[3];
    let cards =  document.querySelectorAll('.card-wrap');

    setTimeout(() => {

        let offsetPlus = safari() ? 10 : 50;
        let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + offsetPlus;

        let delay = 0;
        let interval = 0.05;
        let duration = 0.5;

        delay = fillStock(topCell, cards, offset, delay, interval, duration);
        delay = fillField(topCell, cards, offset, delay, interval, duration);

    }, 500);
}

const drawCard = (card) => {

    disableCard(card);

    card.addEventListener('transitionend', enableCard); 

    let wasteCell = document.querySelector(".waste");
    let offsetLeft = wasteCell.offsetLeft - card.offsetLeft;
    let offsetTop = wasteCell.offsetTop - card.offsetTop;

    card.style.zIndex = zIndex();
    card.querySelector(".card").classList.add("zoom");
    card.classList.add("waste");
    card.classList.toggle("flip");
    card.style.transition = `all 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

    // if (lost()) setTimeout(gameOver, 600);
}

const move = (e) => {

    let card = e.currentTarget;
    let cards = [...document.querySelectorAll(".card-wrap")];
    let cardNumber = cards.indexOf(card);

    console.log(cardNumber, deckSize - fieldSize);

    if (!card.classList.contains("flip") && cardNumber >= fieldSize) {
        drawCard(card);        
        return;
    }

    // if (!cardOpen(card)) return;
        
    // if (!makeMove(card)) zoom(card);
}

const enableCard = (card) => {

    card = card.currentTarget ? card.currentTarget : card;

    card.removeEventListener('transitionend', enableCard); 
    card.firstElementChild.classList.remove("zoom");
    
    if (touchScreen()){
        card.addEventListener("touchstart", move);
        card.addEventListener("touchend", removeZoom);
        card.addEventListener("touchcancel", removeZoom);
    } else {
        card.addEventListener("mousedown", move);
        card.addEventListener("mouseup", removeZoom);
        card.addEventListener("mouseleave", removeZoom);
    }
}

const enableCards = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        enableCard(card);
    }
}

const disableCard = (card) => {
    if (touchScreen()){
        card.removeEventListener("touchstart", move);
        card.removeEventListener("touchend", removeZoom);
        card.removeEventListener("touchcancel", removeZoom);
    } else {
        card.removeEventListener("mousedown", move);
        card.removeEventListener("mouseup", removeZoom);
        card.removeEventListener("mouseleave", removeZoom);
    }
} 

const disableCards = () => {
    for (let card of document.querySelectorAll('.card-wrap')){
        disableCard(card);
    }
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, { passive: false });
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const init = () => {

    disableTapZoom();

    // disableCards();

    setTable();

    setTimeout(enableCards, 3700);    
}

window.onload = () => document.fonts.ready.then(() => init());