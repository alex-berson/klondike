const fieldSize = 28;
const deckSize = 52;
const suit = {
    '♥': 'heart',
    '♦': 'diamond',
    '♠': 'spade',
    '♣': 'club'
} 

let timer;
let movesAI;

// let moves = [13,25,27,26,0,51,50,50,7,22,19,1,15,49,49,23,18,14,9,3,48,47,47,8,2,24,21,46,45,44,44,43,43,42,41,40,40,39,39,38,37,36,36,20,10,4,21,16,37,35,35,34,34,33,33,32,32,31,31,30,30,25,34,27,10,23,16,49,38,22,41,29,29,28,28,18,1,15,20,36,0,32,24,11,2,42,35,5,45,39,46,48,51,40,3,17,19,7,8,50,47,12,6,9];

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

    // console.log(userAgent);

    // if (sfri) alert("SFRI");

    return sfri ? true : false;
}

const shake = (card) => {

    let shakeCards = [card];
    // let col = card.dataset.col;
    // let cards =  document.querySelectorAll(`[data-col="${col}"]`);
    // let cards =  document.querySelectorAll('waste');

    // console.log(cards.length);

    if (card.classList.contains('waste')) {

        let cards =  document.querySelectorAll('.waste:not(.cell)');

        for (let i = 0; i < cards.length; i++) {
            if (parseInt(cards[i].style.zIndex) < parseInt(card.style.zIndex)) shakeCards.push(cards[i]);
        }

    } else if (card.hasAttribute('data-f')) {

        let foundation = card.dataset.f;
        let cards =  document.querySelectorAll(`[data-f="${foundation}"]`);

        for (let i = 0; i < cards.length; i++) {
            if (parseInt(cards[i].style.zIndex) < parseInt(card.style.zIndex)) shakeCards.push(cards[i]);
        }

    } else {

        let col = card.dataset.col;
        let cards =  document.querySelectorAll(`[data-col="${col}"]`);
    
        for (let i = 0; i < cards.length; i++) {
            if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) shakeCards.push(cards[i]);
        }
    }

    shakeCards.forEach(card => card.firstElementChild.addEventListener('animationend', (e) => {

        let card = e.currentTarget;

        card.classList.remove("shake");

    }, {once: true})); 
    
    
    // zoomCards.forEach(card => card.firstElementChild.firstElementChild.style.transition = 'transform 0.25s linear');
    // zoomCards.forEach(card => card.firstElementChild.firstElementChild.style.transform = "scale(1.1)");
    shakeCards.forEach(card => card.firstElementChild.classList.add("shake"));

}

const removeZoom = (e) => {

    let card = e.currentTarget;
    let zoomCards = [card];
    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) zoomCards.push(cards[i]);
    }

    // zoomCards.forEach(card => card.firstElementChild.classList.remove("zoom"));
    // zoomCards.forEach(card =>  card.firstElementChild.firstElementChild.style.transform = card.firstElementChild.style.transform.replace("scale(1.1)", ""));

    // card.firstElementChild.style.transform = card.firstElementChild.style.transform.replace("scale(1.1)", "");
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

        // card.style.left = topCell.offsetLeft + 'px';
        // card.style.top = topCell.offsetTop +  offset + 'px';

        // card.style.display = 'block';

        // let cell = document.querySelectorAll('.cell')[i + 7];
        // let offsetLeft = cell.offsetLeft - card.offsetLeft;
        // let offsetTop = cell.offsetTop - card.offsetTop;


        card.style.left = topCell.getBoundingClientRect().left + 'px';
        card.style.top = topCell.getBoundingClientRect().top +  offset + 'px';

        card.style.display = 'block';

        let cell = document.querySelectorAll('.cell')[i + 7];
        let offsetLeft = cell.getBoundingClientRect().left - card.getBoundingClientRect().left;
        let offsetTop = cell.getBoundingClientRect().top - card.getBoundingClientRect().top;

        card.querySelectorAll('.front, .back').forEach(card => {
            card.style.transition = `all ${duration - 0.1}s ${delay + 0.1}s linear`;
        });

        card.style.transition = `all ${duration}s ${delay}s linear, opacity 0s linear`;
        card.style.opacity = 1;
        if (openCards.includes(i)) {
            index = openCards.indexOf(i);
            card.classList.toggle('flip');
        }

        // card.style.zIndex = index + 1;

        card.style.zIndex = Math.pow(2, index + 1);



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

        // card.style.left = topCell.offsetLeft + 'px';
        // card.style.top = topCell.offsetTop +  offset + 'px';

        // card.style.display = 'block';
        // card.classList.add("stock");

        // let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        // let offsetTop = stockCell.offsetTop - card.offsetTop;

        card.style.left = topCell.getBoundingClientRect().left + 'px';
        card.style.top = topCell.getBoundingClientRect().top +  offset + 'px';

        card.style.display = 'block';
        card.classList.add("stock");

        let offsetLeft = stockCell.getBoundingClientRect().left - card.getBoundingClientRect().left;
        let offsetTop = stockCell.getBoundingClientRect().top  - card.getBoundingClientRect().top ;

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

// const getDeck = () => {

//     let deck = [];
//     let ranks = decks[Math.floor(Math.random() * decks.length)];
//     let suits = ['♥','♠','♦','♣'];

//     ranks.forEach(rank => {

//         switch(rank) {
//             case 11:
//                 rank = 'J';
//                 break;
//             case 12:
//                 rank = 'Q';
//                 break;
//             case 13:
//                 rank = 'K';
//                 break;
//             case 1:
//                 rank = 'A';
//                 break;
//             default:
//                 rank = String(rank);
//         }

//         shuffle(suits);

//         for (let suit of suits) {

//             let card = rank + suit;

//             if (!deck.includes(card)) {
//                 deck.push(card);
//                 break;
//             }
//         }
//     });

//     return deck;
// }

const getDeck = () => {
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let suits = ['♥','♠','♦','♣'];
    let n = Math.trunc(Math.random() * decks.length);
    // n = 80;
    let encDeck = decks[n];
    // encDeck = 'gYomEzutsyNkqABfSlUpZIVOnGDJQbCPjFKvcMRhiXrLHdWxaTwe';
    let deck = [];

    for (let char of encDeck) {

        let rank = Math.trunc(abc.indexOf(char) / 4) + 1;
        let suit = suits[abc.indexOf(char) % 4];

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

        deck.push(rank + suit);
    }

    // console.log(deck);

    // console.log(n);

    return deck;
}

const encriptDeck = () => {
    
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let cards = document.querySelectorAll('.card-wrap');
    let encDeck = '';

    for (let card of cards) {

        let rank = Number(card.dataset.rank);
        let suit = card.dataset.suit;

        switch(suit) {
            case '♥':
                suit = 1;
                break;
            case '♠':
                suit = 2;
                break;
            case '♦':
                suit = 3;
                break;
            case '♣':
                suit = 4;
                break;
        }
        console.log(rank, suit);

        let char = abc[(rank - 1) * 4 + suit - 1];

        encDeck = encDeck + char;
    }

    // console.log(encDeck);

    return encDeck;
}


const setCards = () => {

    let cards = document.querySelectorAll('.front');

    let deck = getDeck();

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
        // let offset = window.innerHeight - topCell.parentNode.parentNode.offsetTop + offsetPlus;

        let offset = window.innerHeight - topCell.parentNode.parentNode.getBoundingClientRect().top + offsetPlus;

        // console.log(window.innerHeight, topCell.parentNode.parentNode.offsetTop, topCell.parentNode.parentNode.getBoundingClientRect().top)


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

        let style = window.getComputedStyle(card);
        let matrix = new WebKitCSSMatrix(style.transform);


        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - stockCell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - stockCell.getBoundingClientRect().top);

        // let offsetLeft = stockCell.offsetLeft - card.offsetLeft;
        // let offsetTop = stockCell.offsetTop - card.offsetTop;

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

    let style = window.getComputedStyle(card);
    let matrix = new WebKitCSSMatrix(style.transform);


    // let offsetLeft = wasteCell.offsetLeft - card.offsetLeft;
    // let offsetTop = wasteCell.offsetTop - card.offsetTop;

    let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - wasteCell.getBoundingClientRect().left);
    let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - wasteCell.getBoundingClientRect().top);

    // console.log(wasteCell.offsetLeft - card.offsetLeft, wasteCell.offsetTop - card.offsetTop);

    // console.log(matrix.m41 - (card.getBoundingClientRect().left - wasteCell.getBoundingClientRect().left), matrix.m42 - (card.getBoundingClientRect().top - wasteCell.getBoundingClientRect().top));

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

// const colOrder = (card, n) => {

//     let order = Array.from({length: n}, (_, i) => i + 1);

//     let m = card.dataset.col ? card.dataset.col : card.dataset.f

//     // console.log(card.dataset.col);

//     for (let i = 1; i < Number(m); i++) {
//         order.push(order.shift());
//     }

//     return order;
// }

const checkFoundations = (card) => {

    // let rank = parseInt(card.dataset.rank);
    // let suit = card.dataset.suit;

    const colOrder = () => {

        let order = [1,2,3,4];

        for (let i = 1; i < Number(card.dataset.f); i++) {
            order.push(order.shift());
        }

        return order;
    }

    if (!openCard(card)) return null;

    for (let n of colOrder()) {

    // for (let n = 1; n <= 4; n++) {

        let topIndex = 0;
        let rank = 0, suit;

        let cards =  document.querySelectorAll(`[data-f="${n}"]`);

        for (let card of cards) {
            if (parseInt(card.style.zIndex) > topIndex) [topIndex, rank, suit] = [parseInt(card.style.zIndex), parseInt(card.dataset.rank), card.dataset.suit];
        }

        // let topCard = topFoundation(i);

        if (rank == 0 && parseInt(card.dataset.rank) == 1) return {n, zIndex: 0};

        if (parseInt(card.dataset.rank) - rank == 1 && suit == card.dataset.suit) return {n, zIndex: cards.length};
    }

    return null;
}

const checkColumns = (card) => {

    // let rank = parseInt(card.dataset.rank);
    // let suit = card.dataset.suit;

    // if (!openCard(card)) return null;
    
    const colOrder = () => {

        let order = [1,2,3,4,5,6,7];

        for (let i = 1; i < Number(card.dataset.col); i++) {
            order.push(order.shift());
        }

        return order;
    }


    for (let n of colOrder()) {
    // for (let n = 1; n <= 7; n++) {

        // let topIndex = 0;

        let cards =  document.querySelectorAll(`[data-col="${n}"]`);

        // if (cards.length == 0) return {rank: 0, suit: null, zIndex: 0};
        let topCard = cards[0];

        for (let card of cards) {
            if (parseInt(card.style.zIndex) > parseInt(topCard.style.zIndex)) topCard = card;
        }

        // let topCard = topFoundation(i);

        if (!topCard && parseInt(card.dataset.rank) != 13) continue;
        // if (!topCard && parseInt(card.dataset.rank) == 13 && parseInt(card.style.zIndex) == 2) continue;

        // if (parseInt(card.dataset.rank) == 13) console.log(card.style.zIndex);

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

    let cards =  document.querySelectorAll(`[data-f="${n}"]`);

    for (let card of cards) {
        disableCard(card);
    }

    disableCard(card);

    // console.log(zIndex);

    card.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;

        // card.style.zIndex = Math.pow(2, Number(card.dataset.rank));
         
        card.style.zIndex = zIndex + 1;
        enableCard(card);

        for (let card of cards) {
            enableCard(card);
        }

    }, {once: true}); 


    // card.addEventListener('transitionend', enableCard); 

    let foundationCell = document.querySelectorAll(".foundation")[n - 1];

    let style = window.getComputedStyle(card);
    let matrix = new WebKitCSSMatrix(style.transform);

    let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - foundationCell.getBoundingClientRect().left);
    let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - foundationCell.getBoundingClientRect().top);

    // let offsetLeft = foundationCell.offsetLeft - card.offsetLeft;
    // let offsetTop = foundationCell.offsetTop - card.offsetTop;

    // card.style.zIndex = parseInt(card.style.zIndex) + 100;

    // card.style.zIndex = Number(card.dataset.rank) * 10000000;
    card.style.zIndex = Math.pow(2, Number(card.dataset.rank) + 10);


    card.querySelector(".card").classList.add("zoom");
    card.dataset.f = n;
    card.classList.remove('waste');
    card.removeAttribute('data-col');

    card.style.transition = `all 0.5s ease-in-out`;
    card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    
    return true;
}

const moveToColumn = (card, n0, n, topCard) => {

    let moveCards = [card];
    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col="${col}"]`);
    let cards2 =  document.querySelectorAll(`[data-col="${n}"]`);
    let topColCards = document.querySelectorAll(`[data-col="${n}"]`);
    let nCards = 0;

    for (let i = 0; i < cards.length; i++) {
        if (parseInt(cards[i].style.zIndex) > parseInt(card.style.zIndex)) moveCards.push(cards[i]);
    }

    for (let card of cards2) {
        disableCard(card);
    }

    // let zIndex = topCard == undefined ? 0 : parseInt(topCard.style.zIndex);
    // let zIndex = topCard ? parseInt(topCard.style.zIndex) : 0;

    let zIndex = topCard ? topColCards.length : 0;

    let baseIndex = Math.log2(Number(moveCards[0].style.zIndex));

    // console.log(moveCards, moveCards[0]);
    
    // for (let [i, card] of moveCards) {

    // console.log(moveCards);

    moveCards.forEach(card => {

        card.style.transform = card.style.transform.replace("scale(1.1)", "");

        console.log(card);

        let offsetPlus;

        // let i = Number(card.style.zIndex) -  baseIndex;

        let i = Math.log2(Number(card.style.zIndex)) -  baseIndex;

        
        disableCard(card);

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;
             
            // card.style.zIndex = zIndex + 1 + i;

            card.style.zIndex = Math.pow(2, zIndex + 1 + i);

            console.log(Math.pow(2, zIndex + 1 + i));


            // card.style.zIndex = 20 - Number(card.dataset.rank);

            setTimeout(() => {
                enableCard(card);

                for (let card of cards2) {
                    enableCard(card);
                }
            }, 0);


            nCards++;

            if (moveCards.length == nCards) compressCards();

            // card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop - 20}px)`;
        }, {once: true}); 

        let coef = screen.width > 460 && screen.height > 460 ? 3 : 2.5;
        // let coef = screen.width > 460 && screen.height > 460 ? 5 : 2.5;

        let topCell = document.querySelectorAll(".cell")[n + 7 - 1];
        // let offsetPlus = parseInt(card.dataset.rank) != 13 ? card.offsetHeight * (zIndex + i) / coef : 0;

        let rect1 =  topCell.getBoundingClientRect();
        // let rect2 =  topCard.getBoundingClientRect();

        // topCard = topCard ? topCard : document.querySelectorAll(".cell")[n + 7 - 1];

        // let offsetPlus = parseInt(card.dataset.rank) != 13 ? topCard.getBoundingClientRect().top - rect1.top + (topCard.getBoundingClientRect().height / coef) * (i + 1) : 0;


        // let rect1 =  card.getBoundingClientRect();
        // let rect2 =  topCard.getBoundingClientRect();

        // let offsetLeft = rect2.left - rect1.left;
        // let offsetTop = rect2.top - rect1.top;

        // console.log(rect2, rect1);
        // console.log(offsetPlus, card.offsetHeight, zIndex, i);

        // if (parseInt(card.dataset.rank) != 13) console.log(topCard.getBoundingClientRect().top, topCell.getBoundingClientRect().top);

        if (topCard) {
            offsetPlus = parseInt(card.dataset.rank) != 13 ? topCard.getBoundingClientRect().top - rect1.top + (topCard.getBoundingClientRect().height / coef) * (i + 1) : 0;
        } else {
            offsetPlus = parseInt(card.dataset.rank) != 13 ? card.getBoundingClientRect().height * (zIndex + i) / coef : 0;
        }

        let style = window.getComputedStyle(card);
        let matrix = new WebKitCSSMatrix(style.transform);

        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;
        
        // let offsetLeft = topCell.offsetLeft - card.offsetLeft;
        // let offsetTop = topCell.offsetTop - card.offsetTop + offsetPlus;

        // console.log(offsetLeft, offsetLeft2, offsetTop, offsetTop2);

    
        card.style.zIndex = parseInt(card.style.zIndex) + 1000000;
        // card.style.zIndex = 20 - Number(card.dataset.rank) + 10000;

        card.querySelector(".card").classList.add("zoom");
        card.dataset.col = n;
        card.classList.remove('waste');
        card.removeAttribute('data-f');
    
        card.style.transition = `all 0.5s ease-in-out`;
        card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop}px)`;
    });

    const compressCards = () => {

    // setTimeout(() => {

        // let col
        // let cards =  document.querySelectorAll(`[data-col="${col}"]`);

        // console.log(cards.length);

        let lastCard = moveCards[0];
        let col = lastCard.dataset.col;

        let closedCards =  document.querySelectorAll(`[data-col="${col}"]:not(.flip)`);

        let cards = document.querySelectorAll(`[data-col="${col}"]`);

        for (let i = 0; i < cards.length; i++) {
            if (parseInt(cards[i].style.zIndex) > parseInt(lastCard.style.zIndex)) lastCard = cards[i];
        }

        // let firstOpen;
        // for (let card of openCards) {
        //     if (parseInt(card.style.zIndex) == closedCards.length + 1) {
        //         cards.push(card);
        //         break;
        //     }
        // }

        // console.log(closedCards.length, openCards.length);


        // let cards =  document.querySelectorAll(`[data-col="${col}"][data-color="red"]`);

        let gap;

        for (let i = 1; i < cards.length; i++) {

            let card, previousCard

            for (let j = 0; j < cards.length; j++) {
                // console.log(parseInt(cards[j].style.zIndex));
                // if (parseInt(cards[j].style.zIndex) == i + 1) card = cards[j];
                // if (parseInt(cards[j].style.zIndex) == i) previousCard = cards[j];
                if (parseInt(Math.log2(cards[j].style.zIndex)) == i + 1) card = cards[j];
                if (parseInt(Math.log2(cards[j].style.zIndex)) == i) previousCard = cards[j];
            }

            if (i == 1) gap = card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top;

            let cells = document.querySelectorAll('.cell');

            let cellGap = cells[14].getBoundingClientRect().top - cells[7].getBoundingClientRect().top;

            console.log(gap, cellGap);
            // console.log(gap);

            // i = 0;

            // let coef = screen.width > 460 && screen.height > 460 ? 3 : 2.5;

            let coef = card.offsetHeight / (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top);

            console.log(card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top);

            let topCell = document.querySelectorAll(".cell")[n + 7 - 1];

            let rect1 =  topCell.getBoundingClientRect();
            // let rect2 =  topCard.getBoundingClientRect();

            let offsetPlus = previousCard.getBoundingClientRect().top - rect1.top + (previousCard.getBoundingClientRect().height / coef) * (1);

            let style = window.getComputedStyle(card);
            let matrix = new WebKitCSSMatrix(style.transform);

            let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
            let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;

            // let offsetLeft = topCell.offsetLeft - card.offsetLeft;
            // let offsetTop = topCell.offsetTop - card.offsetTop + offsetPlus;

            console.log(topCell.offsetLeft, topCell.getBoundingClientRect().left);

            let rect = lastCard.getBoundingClientRect();

            let offset = Math.ceil((rect.bottom - window.innerHeight + 5) / closedCards.length);

            if (gap - offset < 10) offset = gap - 10;

            // offset = Math.min(offset, card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top - offset);

            // console.log(offset); 

            if (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top - offset < 8) return;

            if (offset <= 0) continue;

            // offset = Math.ceil(offset / cards.length) * cards.length;

            // if (card.classList.contains('flip')) {
            //     console.log(i, Math.ceil(offset / closedCards.length) * closedCards.length);
            //     continue;
            // }


            // offset = card.classList.contains('flip') ? Math.ceil(offset / closedCards.length) * closedCards.length : Math.ceil(offset / closedCards.length) * (parseInt(card.style.zIndex) - 1);

            // offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (parseInt(card.style.zIndex) - 1);
            offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (Math.log2(parseInt(card.style.zIndex)) - 1);



            // offset = card.classList.contains('flip') ? Math.ceil(offset / closedCards.length) * closedCards.length : Math.ceil(offset / closedCards.length) * 1;

            // console.log(i, card.style.zIndex, previousCard.style.zIndex, card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top, offset);

            // console.log();

            // card.style.zIndex = 100;

            card.style.transition = `all 0.3s 0.0s linear`;
            card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop - offset}px)`;
            
        }
    }
    // }, 550);
    
    return true;
}

const reverseNextCard = (col) => {

    let zIndex = 0;
    let topCard;

    let cards =  document.querySelectorAll(`[data-col="${col}"]`);

    if (cards.length == 0) return;

    for (let card of cards) {
        if (Number(card.style.zIndex) > zIndex) [zIndex, topCard] = [Number(card.style.zIndex), card];
    }

    setTimeout(() => {

        let gap;

        if (!col) return;

        // console.log(col);

        let closedCards =  document.querySelectorAll(`[data-col="${col}"]:not(.flip)`);

        let cards =  document.querySelectorAll(`[data-col="${col}"]`);

        let cells = document.querySelectorAll('.cell');

        let cellGap = cells[14].getBoundingClientRect().top - cells[7].getBoundingClientRect().top;

        for (let i = 1; i < cards.length; i++) {

            let card, previousCard

            for (let j = 0; j < cards.length; j++) {
                // if (Number(cards[j].style.zIndex) == i + 1) card = cards[j];
                // if (Number(cards[j].style.zIndex) == i) previousCard = cards[j];
                if (Math.log2(Number(cards[j].style.zIndex)) == i + 1) card = cards[j];
                if (Math.log2(Number(cards[j].style.zIndex)) == i) previousCard = cards[j];
            }

            if (i == 1) gap = card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top;

            if (gap == cellGap) return;

            let coef = card.offsetHeight / (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top);

            let topCell = document.querySelectorAll(".cell")[parseInt(col) + 7 - 1];

            let rect1 =  topCell.getBoundingClientRect();
            // let rect2 =  topCard.getBoundingClientRect();

            let offsetPlus = previousCard.getBoundingClientRect().top - rect1.top + (previousCard.getBoundingClientRect().height / coef);

            let style = window.getComputedStyle(card);
            let matrix = new WebKitCSSMatrix(style.transform);

            let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
            let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;

            // let offsetLeft = topCell.offsetLeft - card.offsetLeft;
            // let offsetTop = topCell.offsetTop - card.offsetTop + offsetPlus;

            let rect = topCard.getBoundingClientRect();

            // let offset = Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length);

            // let offset = Math.floor((window.innerHeight - rect.bottom - 5));

            offset = Math.max(gap - cellGap, Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length));

            console.log(gap - cellGap, Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length));

            // offset = gap - cellGap;

            if (offset >= 0) continue;

            if (gap - cellGap > Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length)) {

                // offset = card.getBoundingClientRect().top - (topCell.getBoundingClientRect().top + cellGap * (parseInt(card.style.zIndex) - 1));
                offset = card.getBoundingClientRect().top - (topCell.getBoundingClientRect().top + cellGap * (Math.log2(parseInt(card.style.zIndex)) - 1));

            } else {

                // offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (parseInt(card.style.zIndex) - 1);
                offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (Math.log2(parseInt(card.style.zIndex)) - 1);

            }

            card.style.transition = `all 0.3s 0.0s linear`;
            card.style.transform = `translate(${offsetLeft - 2}px, ${offsetTop - offset}px)`;
        }
       
    }, 550);

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

const nextMove = () => {

    let cards = document.querySelectorAll(".card-wrap");

    // window.addEventListener('blur', () => {
        
    //     if (aiMode()) clearTimeout(timer);
    
    //     console.log("blur");

    //     window.addEventListener('focus', () => {
    //         if (aiMode()) nextMove();
    //         console.log("focus");
    //     }, {once: true}, false);

    // }, {once: true}, false);

    if (movesAI.length == 0) {
        setTimeout(clearBoard, 2000);
        setTimeout(init, 3000);
        return;
    }

    timer = setTimeout(() => turn(cards[movesAI.shift()]), 1000);
}

const turn = (e) => {


    if (document.hidden) {
        console.log("hidden");
        return;
    }

    let card = e.currentTarget ? e.currentTarget : e;

    // let card = e.currentTarget;
    let cards = [...document.querySelectorAll(".card-wrap")];
    let cardNumber = cards.indexOf(card);

    // console.log(e.isTrusted);

    if (aiMode() && e.isTrusted) return;

    // console.log(cardNumber, deckSize - fieldSize);

    if (!card.classList.contains("flip") && cardNumber >= fieldSize) {
        drawCard(card);     
        
        if (aiMode()) nextMove();

        // if (aiMode()) setTimeout(() => turn(cards[moves.shift()], moves), 1000);

        return;
    }

    // if (!cardOpen(card)) return;
        
    // if (!makeMove(card)) zoom(card);

    if (card.classList.contains('flip')) {
        // let col = card.dataset.col;

        // document.querySelectorAll(`[data-col="${col}"]`).forEach(x => {
        //     console.log(x);
        // })

        let topCell = document.querySelectorAll(".cell")[7];
        let rect = topCell.getBoundingClientRect();

        // console.log(topCell.offsetTop, rect.top);

        // zoom(card);

        // let rect = card.getBoundingClientRect();

        // console.log(window.innerHeight, rect.bottom);

        // console.log(topCard(card));

        let foundation = checkFoundations(card);

        if (foundation != null) {

            let col = card.dataset.col;
            // console.log(col);

            moveToFounation(card, foundation.n, foundation.zIndex);

            if (col) reverseNextCard(col);

            if (aiMode()) nextMove();

            // if (aiMode()) setTimeout(() => turn(cards[moves.shift()], moves), 1000);

            return;
        }

        let column = checkColumns(card);

        // console.log(column);

        if (column != null) {

            let col = card.dataset.col;

            moveToColumn(card, col, column.n, column.card);

            if (col) reverseNextCard(col);

            if (aiMode()) nextMove();

            return;
        }

        shake(card);
    }

    // if (aiMode()) nextMove();
    // if (aiMode()) setTimeout(() => turn(cards[moves.shift()], moves), 1000);
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

const clearBoard = () => {

    let cards = document.querySelectorAll(".card-wrap");

    for (let card of cards) {

        card.removeAttribute('style');
        card.classList.remove('flip');

        card.firstElementChild.firstElementChild.removeAttribute('style');
        card.firstElementChild.firstElementChild.classList.remove('red');
        card.firstElementChild.lastElementChild.removeAttribute('style');

        Object.keys(card.dataset).forEach(dataKey => delete card.dataset[dataKey]);
    }
}

const aiPlay = () => {

    let event = new Event('mousedown');
    let cards = document.querySelectorAll(".card-wrap");
    let encDeck = encriptDeck();
    movesAI = getMoves(encDeck);
    console.log(encDeck);

    console.log(moves);

    const play = () => {

            if (movesAI.length == 0) {

                clearInterval(interval);

                setTimeout(clearBoard, 2000);

                setTimeout(init, 3000);

                return;
            }

            let move = movesAI.shift();

            // console.log(move);

            cards[move].dispatchEvent(event);
    }

    let move = moves.shift();
    turn(cards[move]);

    // let interval = setInterval(play, 700);
}

// const newGame = () => {

//     disableTapZoom();

//     // disableCards();

//     setTable();

//     // encriptDeck(); //

//     setTimeout(enableCards, 3700);  

//     console.log(document.querySelectorAll(".card-wrap"));
    
//     // setTimeout(aiPlay, 4000);  
// }

const aiMode = () => {

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let mode = urlParams.get('mode');
    
    return mode == 'ai';

    return true; //
}

const init = () => {

    window.addEventListener('blur', () => {
            if (aiMode()) clearTimeout(timer);
            
        console.log("blur");

        window.addEventListener('focus', () => {
    
            if (aiMode()) nextMove();
            console.log("focus");
        }, {once: true});

    });

//    window.addEventListener('blur', () => {
//             if (aiMode()) clearTimeout(timer);
            
//         console.log("blur");

//     }, false);

//     window.addEventListener('focus', () => {
    
//         if (aiMode()) nextMove();
//         console.log("focus");
//     }, false);



    document.addEventListener("visibilitychange", () => {
        console.log("visibilitychange");
    }, false);

    window.addEventListener("pagehide", () => {
        console.log("pagehide");
    }, false);

    window.addEventListener('beforeunload', () => {
        console.log("beforeunload");
    });

    disableTapZoom();

    // disableCards();

    setTable();

    // encriptDeck(); //

    setTimeout(enableCards, 3700);  


    if (aiMode()) setTimeout(aiPlay, 4500);

    // setTimeout(aiPlay, 4500);

    // setTimeout(enableCards, 3700);  
    
    // setTimeout(aiPlay, 4000);  
}

window.onload = () => document.fonts.ready.then(init);