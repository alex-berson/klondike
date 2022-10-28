const fieldSize = 28;
const deckSize = 52;
const suits = {
    '♥': 'heart',
    '♦': 'diamond',
    '♠': 'spade',
    '♣': 'club'
} 

const touchScreen = () => matchMedia('(hover: none)').matches;

const zIndex = () => {

    let zIndex = 0;
    let cards = [...document.querySelectorAll(".waste:not(.cell)")];

    for (let card of cards) {
        if (parseInt(card.style.zIndex) > zIndex) [zIndex, topCard] = [parseInt(card.style.zIndex), card];
    }

    return zIndex == 0 ?  1 : zIndex < 5 ? zIndex *= 3 : zIndex *= 2;
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

    return sfri ? true : false;
}

const zoom = (card) => {

    let zoomCards = [card];
    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) zoomCards.push(cards[i]);
    }

    zoomCards.forEach(card => card.style.transition = 'transform 0.25s linear');
    zoomCards.forEach(card => card.style.transform += "scale(1.1)");
}

const removeZoom = (e) => {

    let card = e.currentTarget;
    let zoomCards = [card];
    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) zoomCards.push(cards[i]);
    }

    zoomCards.forEach(card =>  card.style.transform = card.style.transform.replace("scale(1.1)", ""));

    // card.style.transform = card.style.transform.replace("scale(1.1)", "");
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

    let index;
    let openCards = [0, 7, 13, 18, 22, 25, 27];

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
        if (openCards.includes(i)) {
            index = openCards.indexOf(i);
            card.classList.toggle('flip');
        }

        card.style.zIndex = index + 1;


        // card.classList.add(`c${i - opened[index] + index + 1}`);
        card.dataset.col = i - openCards[index] + index + 1;

        // console.log(i - opened[index] + index + 1);

        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    return delay;
}

const fillStock = (topCell, cards, offset, delay, interval, duration) => {

    let stockCell = document.querySelector('.stock.cell');

    for (let i = fieldSize; i < deckSize; i++) {

        delay += interval;

        let card = cards[i];

        card.style.left = topCell.offsetLeft + 'px';
        card.style.top = topCell.offsetTop +  offset + 'px';

        card.style.display = 'block';
        card.classList.add("stock");

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

        for (let suit of suits) {

            let card = rank + suit;

            if (!deck.includes(card)) {
                deck.push(card);
                break;
            }
        }
    });

    // deck[0] = 'A♥';
    // deck[50] = '2♥';
    // deck[49] = '3♥';
    // deck[48] = '4♥';
    // deck[47] = '5♥';

    return deck;
}

const setCards = () => {

    let cards = document.querySelectorAll('.front');

    deck = getDeck();

    for (let i = 0; i < deckSize; i++){

        let card = cards[i];
        let rank = deck[i].length == 2 ? deck[i][0] : deck[i][0] + deck[i][1];
        let suit = deck[i].length == 2 ? deck[i][1] : deck[i][2];

        if (suit == '♥' || suit == '♦') { 
            card.classList.add('red');
            card.parentElement.parentElement.dataset.color = 'red'; 
        } else {
            card.parentElement.parentElement.dataset.color = 'black'; 
        }

        card.querySelector('.rank').innerText = rank;
        // card.style.zIndex = -1;
        card.parentElement.parentElement.dataset.suit = suit; 
        card.parentElement.parentElement.dataset.rank = rankValue(rank); 


        switch(suit){
            case '♥':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/heart.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/heart.png';
                break;
            case '♦':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/diamond.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/diamond.png';
                break;
            case '♠':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/spade.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/spade.png';
                break;
            case '♣':
                card.querySelector('.suit').firstElementChild.src = 'images/suits/club.png';
                card.querySelector('.main').firstElementChild.src = 'images/suits/club.png';
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

        setTimeout(() => {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.opacity = 1;
            })
        }, 2500);

    }, 500);
}

const removeStyle = (e) => {

    let card = e.currentTarget;

    card.removeEventListener('transitionend', removeStyle); 
    card.firstElementChild.firstElementChild.removeAttribute("style");
    card.firstElementChild.lastElementChild.removeAttribute("style");
}

const reverseStock = () => {
    
    disableCards();

    let interval = 0.05;
    let duration = 0.5;
    let delay = 0;
    let n = 0;
    let cards = document.querySelectorAll('.card-wrap');
    let stockCell = document.querySelector(".stock.cell");

    for (let i = fieldSize; i < deckSize; i++) {

        let card = cards[i];

        if (!cards[i].classList.contains("waste")) continue;

        n++;

        card.classList.add("stock");
        card.classList.remove("waste");

        card.addEventListener('transitionend', removeStyle); 

        let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.zIndex = 0;

        delay += interval;

        card.querySelectorAll(".front, .back").forEach(card => {
            card.style.transition = `all ${duration}s ${delay}s ease-in-out`;
        });

        card.style.transition = `all ${duration}s ${delay}s ease-in-out`;
        card.classList.toggle("flip");
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    }

    setTimeout(enableCards, n * 50 + 500);
} 

const drawCard = (card) => {

    disableCard(card);

    card.addEventListener('transitionend', enableCard); 

    let wasteCell = document.querySelector(".cell.waste");
    let offsetLeft = wasteCell.offsetLeft - card.offsetLeft;
    let offsetTop = wasteCell.offsetTop - card.offsetTop;

    card.style.zIndex = zIndex();
    card.querySelector(".card").classList.add("zoom");
    card.classList.remove("stock");
    card.classList.add("waste");
    card.classList.toggle("flip");
    card.style.transition = `all 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;

    let cards = document.querySelectorAll(".stock:not(.cell)");

    if (cards.length == 0) setTimeout(enableReverseButton, 500);

    // if (lost()) setTimeout(gameOver, 600);
}

const checkFoundations = (card) => {

    // let rank = parseInt(card.dataset.rank);
    // let suit = card.dataset.suit;

    if (!openCard(card)) return null;

    for (let n = 1; n <= 4; n++) {

        let topIndex = 0;
        let rank = 0, suit;

        let cards =  document.querySelectorAll(`[data-f="${n}"]`);


        for (let card of cards) {
            if (parseInt(card.style.zIndex) > topIndex) [topIndex, rank, suit] = [parseInt(card.style.zIndex), parseInt(card.dataset.rank), card.dataset.suit];
        }

        // let topCard = topFoundation(i);

        if (rank == 0 && parseInt(card.dataset.rank) == 1) return {n, zIndex: 0};

        if (parseInt(card.dataset.rank) - rank == 1 && suit == card.dataset.suit) return {n, zIndex: topIndex};
    }

    return null;
}

const checkColumns = (card) => {

    // let rank = parseInt(card.dataset.rank);
    // let suit = card.dataset.suit;

    // if (!openCard(card)) return null; 

    for (let n = 1; n <= 7; n++) {

        // let topIndex = 0;

        let cards =  document.querySelectorAll(`[data-col="${n}"]`);

        // if (cards.length == 0) return {rank: 0, suit: null, zIndex: 0};
        let topCard = cards[0];

        for (let card of cards) {
            if (parseInt(card.style.zIndex) > parseInt(topCard.style.zIndex)) topCard = card;
        }

        // let topCard = topFoundation(i);

        if (!topCard && parseInt(card.dataset.rank) != 13) continue;

        if ((!topCard && parseInt(card.dataset.rank) == 13) || 
             (parseInt(card.dataset.rank) - parseInt(topCard.dataset.rank) == -1 && 
             (card.dataset.color == 'red' && topCard.dataset.color == 'black' ||
             card.dataset.color == 'black' && topCard.dataset.color == 'red'))) return {n, card: topCard};
    }

    return null;
}

const openCard = (card) => {

    if (card.classList.contains('waste')) return true;

    let col = card.dataset.col;

    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(card.style.zIndex) < parseInt(cards[i].style.zIndex)) return false;
    }

    return true;
}

const moveToFounation = (card, n, zIndex) => {

    disableCard(card);

    // console.log(zIndex);

    card.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;
         
        card.style.zIndex = zIndex + 1;
        enableCard(card);
    }); 


    // card.addEventListener('transitionend', enableCard); 

    let foundationCell = document.querySelectorAll(".foundation")[n - 1];
    let offsetLeft = foundationCell.offsetLeft - card.offsetLeft;
    let offsetTop = foundationCell.offsetTop - card.offsetTop;

    card.style.zIndex = parseInt(card.style.zIndex) + 100;
    card.querySelector(".card").classList.add("zoom");
    card.dataset.f = n;
    card.classList.remove('waste');
    card.removeAttribute('data-col');

    card.style.transition = `all 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    
    return true;
}

const moveToColumn = (card, n, topCard) => {

    let moveCards = [card];
    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) moveCards.push(cards[i]);
    }

    // let zIndex = topCard == undefined ? 0 : parseInt(topCard.style.zIndex);
    let zIndex = topCard ? parseInt(topCard.style.zIndex) : 0;

    let baseIndex = parseInt(moveCards[0].style.zIndex);

    console.log(moveCards, moveCards[0]);
    
    // for (let [i, card] of moveCards) {

    moveCards.forEach(card => {

        let i = parseInt(card.style.zIndex) -  baseIndex;
        
        disableCard(card);

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;
             
            card.style.zIndex = zIndex + 1 + i;
            enableCard(card);
        }); 

        let coef = screen.width > 460 && screen.height > 460 ? 3 : 2.5;
        let topCell = document.querySelectorAll(".cell")[n + 7 - 1];
        let offsetPlus = parseInt(card.dataset.rank) != 13 ? card.offsetHeight * (zIndex + i) / coef : 0;

        console.log(offsetPlus, card.offsetHeight, zIndex, i);
    
        let offsetLeft = topCell.offsetLeft - card.offsetLeft;
        let offsetTop = topCell.offsetTop - card.offsetTop + offsetPlus;
    
        card.style.zIndex = parseInt(card.style.zIndex) + 100;
        card.querySelector(".card").classList.add("zoom");
        card.dataset.col = n;
        card.classList.remove('waste');
        card.removeAttribute('data-f');
    
        card.style.transition = `all 0.5s ease-in-out`;
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;



    });

    
    return true;
}

// const moveToColumn = (card, n, topCard) => {

//     disableCard(card);

//     let zIndex = topCard == undefined ? 0 : parseInt(topCard.style.zIndex);

//     card.addEventListener('transitionend', (e) => {

//         let card = e.currentTarget;
         
//         card.style.zIndex = zIndex + 1;
//         enableCard(card);
//     }); 


//     let columnCell = document.querySelectorAll(".cell")[n + 7 - 1];
//     let offsetPlus = topCard ? card.offsetHeight * zIndex / 3 : 0;

//     let offsetLeft = columnCell.offsetLeft - card.offsetLeft;
//     let offsetTop = columnCell.offsetTop - card.offsetTop + offsetPlus;

//     card.style.zIndex = parseInt(card.style.zIndex) + 100;
//     card.querySelector(".card").classList.add("zoom");
//     card.dataset.col = n;
//     card.classList.remove('waste');
//     card.removeAttribute('data-f');

//     card.style.transition = `all 0.5s ease-in-out`;
//     card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    
//     return true;
// }

const reverseNextCard = (col) => {

    let zIndex = 0;
    let topCard;

    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    if (cards.length == 0) return;

    for (let card of cards) {
        if (card.style.zIndex > zIndex) [zIndex, topCard] = [card.style.zIndex, card];
    }

    if (topCard.classList.contains('flip')) return;

    disableCard(topCard);
    topCard.addEventListener('transitionend', enableCard); 
    topCard.querySelectorAll('.front, .back').forEach(card => {
        card.style.transition = 'all 0.5s 0.1s linear';
    });    
    topCard.querySelector(".card").classList.add("zoom");
    topCard.classList.toggle("flip");

    // console.log(topCard);
}

const turn = (e) => {

    let card = e.currentTarget;
    let cards = [...document.querySelectorAll(".card-wrap")];
    let cardNumber = cards.indexOf(card);

    // console.log(cardNumber, deckSize - fieldSize);

    if (!card.classList.contains("flip") && cardNumber >= fieldSize) {
        drawCard(card);        
        return;
    }

    // if (!cardOpen(card)) return;
        
    // if (!makeMove(card)) zoom(card);

    if (card.classList.contains('flip')) {
        // let col = card.dataset.col;

        // document.querySelectorAll(`[data-col="${col}"]`).forEach(x => {
        //     console.log(x);
        // })

        zoom(card);

        // console.log(topCard(card));

        let foundation = checkFoundations(card);

        if (foundation != null) {

            let col = card.dataset.col;
            // console.log(col);

            moveToFounation(card, foundation.n, foundation.zIndex);

            if (col) reverseNextCard(col);

            return;
        }

        let column = checkColumns(card);

        console.log(column);

        if (column != null) {

            let col = card.dataset.col;

            moveToColumn(card, column.n, column.card);

            if (col) reverseNextCard(col);
        }
    }
}

const enableReverseButton = () => {
    if (touchScreen()) {
        document.querySelector('.stock.cell').addEventListener("touchstart", reverseStock, {once: true});
    } else {
        document.querySelector('.stock.cell').addEventListener("mousedown", reverseStock, {once: true});
    }
} 

const enableCard = (card) => {

    card = card.currentTarget ? card.currentTarget : card;

    card.removeEventListener('transitionend', enableCard); 
    card.firstElementChild.classList.remove("zoom");
    
    if (touchScreen()) {
        card.addEventListener("touchstart", turn);
        card.addEventListener("touchend", removeZoom);
        card.addEventListener("touchcancel", removeZoom);
    } else {
        card.addEventListener("mousedown", turn);
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
        card.removeEventListener("touchstart", turn);
        card.removeEventListener("touchend", removeZoom);
        card.removeEventListener("touchcancel", removeZoom);
    } else {
        card.removeEventListener("mousedown", turn);
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

window.onload = () => document.fonts.ready.then(init);