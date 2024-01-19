const deckSize = 52;
const tableauSize = 28;
const nFoundations = 4;
const nColumns = 7;
const nSuits = 4;
const ace = 1;
const king = 13;
let transitionStartEvent = false;
let aiTimer, aiMoves, screenVisible;

const orderCards = ([...cards]) => cards.sort((a, b) => Number(b.style.zIndex) - Number(a.style.zIndex));

const clearFoundations = (delay) => {

    let interval = 0.10;
    let duration = 0.5;
    let stockCell = document.querySelector('.stock.cell');

    for (let card of document.querySelectorAll('[data-f]')) {
        card.style.zIndex = Number(card.style.zIndex) + 10;
    }

    for (let j = nFoundations - 1; j >= 0; j--) {

        let cards = document.querySelectorAll(`[data-f='${j + 1}']`); 

        for (let card of orderCards(cards)) {

            let style = window.getComputedStyle(card);
            let matrix = new DOMMatrix(style.transform);
            let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - stockCell.getBoundingClientRect().left);
            let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - stockCell.getBoundingClientRect().top);

            card.classList.remove('flip');
            card.classList.add('stock');
            card.removeAttribute('data-f');

            delay += interval;

            card.firstElementChild.firstElementChild.style.transition = `all ${duration}s ${delay}s linear`;

            card.style.transition = `all ${duration}s ${delay}s linear`;
            card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

            card.addEventListener('transitionend', (e) => {

                let card = e.currentTarget;

                card.style.zIndex = 'auto';
                card.style.removeProperty('transition');

                card.firstElementChild.firstElementChild.removeAttribute('style');
    
            }, {once: true}); 
        }
    }

    return delay;
}

const clearTableau = (delay) => {

    let interval = 0.10;
    let duration = 0.5;
    let stockCell = document.querySelector('.stock.cell');

    for (let j = nColumns - 1; j >= 0; j--) {

        let cards = document.querySelectorAll(`[data-col='${j + 1}']`); 

        for (let card of orderCards(cards)) {

            let style = window.getComputedStyle(card);
            let matrix = new DOMMatrix(style.transform);
            let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - stockCell.getBoundingClientRect().left);
            let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - stockCell.getBoundingClientRect().top);

            card.classList.remove('flip');
            card.classList.add('stock');
            card.removeAttribute('data-col');

            delay += interval;

            card.firstElementChild.firstElementChild.style.transition = `all ${duration}s ${delay}s linear`;

            card.style.transition = `all ${duration}s ${delay}s linear`;
            card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

            card.addEventListener('transitionend', (e) => {

                let card = e.currentTarget;

                card.style.zIndex = 'auto';
                card.style.removeProperty('transition');
    
                card.firstElementChild.firstElementChild.removeAttribute('style');
    
            }, {once: true}); 
        }
    }

    return delay;
}

const clearWaste = () => {

    let delay = 0;    
    let interval = 0.05;
    let duration = 0.5;
    let cards = document.querySelectorAll('.waste:not(.cell)');
    let stockCell = document.querySelector('.stock.cell');

    for (let card of cards) {

        let style = window.getComputedStyle(card);
        let matrix = new DOMMatrix(style.transform);
        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - stockCell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - stockCell.getBoundingClientRect().top);

        card.style.zIndex = 0;
        delay += interval;

        card.firstElementChild.firstElementChild.style.transition = `all ${duration}s ${delay}s linear`;

        card.style.transition = `all ${duration}s ${delay}s linear`;
        card.classList.add('stock');
        card.classList.remove('waste');
        card.classList.toggle('flip');
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;

            card.style.removeProperty('transition');
            card.style.zIndex = 'auto';

            card.firstElementChild.firstElementChild.removeAttribute('style');

        }, {once: true}); 
    }

    return delay;
} 

const clearTable = () => {

    let delay = clearWaste();
    delay = clearTableau(delay);
    delay = clearFoundations(delay);

    return delay;
}

const designedShow = () => {

    let el = document.querySelector('#designed');

    el.classList.add('show');

    el.addEventListener('animationend', (e) => {

        let el = e.currentTarget;

        el.classList.remove('show'); 

        setTable();    

    }, {once: true}); 
};

const gameOver = () => {

    clearTable();
    designedShow();
}

const shakeCards = (card) => {

    let cards = [card];

    if (card.classList.contains('waste')) {

        let cardEls = document.querySelectorAll('.waste:not(.cell)');

        for (let i = 0; i < cardEls.length; i++) {
            if (Number(cardEls[i].style.zIndex) < Number(card.style.zIndex)) cards.push(cardEls[i]);
        }
    }
    
    if (card.hasAttribute('data-f')) {

        let foundation = card.dataset.f;
        let cardEls = document.querySelectorAll(`[data-f='${foundation}']`);

        for (let i = 0; i < cardEls.length; i++) {
            if (Number(cardEls[i].style.zIndex) < Number(card.style.zIndex)) cards.push(cardEls[i]);
        }
    } 
    
    if (card.hasAttribute('data-col')) {

        let col = card.dataset.col;
        let cardEls = document.querySelectorAll(`[data-col='${col}']`);
    
        for (let i = 0; i < cardEls.length; i++) {
            if (Number(cardEls[i].style.zIndex) > Number(card.style.zIndex)) cards.push(cardEls[i]);
        }
    }

    cards.forEach(card => card.firstElementChild.addEventListener('animationend', (e) => {

        let card = e.currentTarget;

        card.classList.remove('shake');

    }, {once: true})); 
     
    cards.forEach(card => card.firstElementChild.classList.add('shake'));
}

const flipTopCard = (col) => {

    let topCard;
    let zIndex = 0;
    let cards = document.querySelectorAll(`[data-col='${col}']`);

    if (cards.length == 0) return;

    for (let card of cards) {
        if (Number(card.style.zIndex) > zIndex) [zIndex, topCard] = [Number(card.style.zIndex), card];
    }

    if (topCard.classList.contains('flip')) return;

    disableCard(topCard);  

    topCard.classList.add('move2c');

    topCard.querySelector('.card').classList.add('zoom');
    topCard.classList.toggle('flip');

    topCard.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;

        card.classList.remove('move2c');
        card.querySelector('.card').classList.remove('zoom');

        enableCard(card);

    }, {once: true}); 
}

const spreadColumn = (col) => {

    let gap;
    let topCard;
    let zIndex = 0;
    let closedCards = document.querySelectorAll(`[data-col='${col}']:not(.flip)`);    
    let cards =  document.querySelectorAll(`[data-col='${col}']`);
    let cells = document.querySelectorAll('.cell');
    let cellGap = cells[14].getBoundingClientRect().top - cells[7].getBoundingClientRect().top;

    if (col == undefined) return;
    if (closedCards.length == 0) return;

    for (let card of cards) {
        if (Number(card.style.zIndex) > zIndex) [zIndex, topCard] = [Number(card.style.zIndex), card];
    }

    for (let i = 1; i < cards.length; i++) {

        let card, previousCard

        for (let j = 0; j < cards.length; j++) {
            if (Number(cards[j].style.zIndex) == i + 1) card = cards[j];
            if (Number(cards[j].style.zIndex) == i) previousCard = cards[j];
        }

        if (i == 1) gap = card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top;
        if (Math.abs(gap - cellGap) < 1) return;

        let coef = card.offsetHeight / (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top);
        let topCell = document.querySelectorAll('.cell')[Number(col) + nColumns - 1];
        let rect1 = topCell.getBoundingClientRect();
        let offsetPlus = previousCard.getBoundingClientRect().top - rect1.top + (previousCard.getBoundingClientRect().height / coef);
        let style = window.getComputedStyle(card);
        let matrix = new DOMMatrix(style.transform);
        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;
        let rect = topCard.getBoundingClientRect();
        let offset = Math.max(gap - cellGap, Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length));

        if (offset >= 0) continue;

        if (gap - cellGap > Math.floor((rect.bottom - window.innerHeight + 5) / closedCards.length)) {
            offset = card.getBoundingClientRect().top - (topCell.getBoundingClientRect().top + cellGap * (Number(card.style.zIndex) - 1));
        } else {
            offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (Number(card.style.zIndex) - 1);
        }

        disableCard(card);

        card.classList.add('move2c');
        card.style.transition = 'all 0.3s 0.0s linear';
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop - offset}px)`;

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;

            enableCard(card);
            card.classList.remove('move2c');
            card.style.removeProperty('transition');
                
        }, {once: true}); 
    }    
}

const moveToColumn = (card, n, topCard) => {

    const compressColumn = () => {
    
        let gap;
        let lastCard = moveCards[0];
        let col = lastCard.dataset.col;    
        let closedCards =  document.querySelectorAll(`[data-col='${col}']:not(.flip)`);
        let cards = document.querySelectorAll(`[data-col='${col}']`);

        if (closedCards.length == 0) return;

        for (let i = 0; i < cards.length; i++) {
            if (Number(cards[i].style.zIndex) > Number(lastCard.style.zIndex)) lastCard = cards[i];
        }
    
        for (let i = 1; i < cards.length; i++) {

            let card, previousCard

            for (let j = 0; j < cards.length; j++) {                    
                if (Number(cards[j].style.zIndex) == i + 1) card = cards[j];
                if (Number(cards[j].style.zIndex) == i) previousCard = cards[j];
            }

            if (i == 1) gap = card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top;
    
            let coef = card.offsetHeight / (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top);
            let topCell = document.querySelectorAll('.cell')[n + nColumns - 1];
            let rect1 = topCell.getBoundingClientRect();   
            let offsetPlus = previousCard.getBoundingClientRect().top - rect1.top + (previousCard.getBoundingClientRect().height / coef);      
            let style = window.getComputedStyle(card);
            let matrix = new DOMMatrix(style.transform);
            let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
            let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;    
            let rect2 = lastCard.getBoundingClientRect();
            let offset = Math.ceil((rect2.bottom - window.innerHeight + 5) / closedCards.length);

            if (gap - offset < 10) offset = gap - 10;   
            if (card.getBoundingClientRect().top - previousCard.getBoundingClientRect().top - offset < 8) return;    
            if (offset <= 0) continue;

            offset = card.classList.contains('flip') ? offset * closedCards.length : offset * (Number(card.style.zIndex) - 1);
        
            disableCard(card);
            card.classList.add('move2c');

            card.style.transition = 'all 0.3s 0.0s linear';              
            card.style.transform = `translate(${offsetLeft}px, ${offsetTop - offset}px)`;

            card.addEventListener('transitionend', (e) => {
    
                let card = e.currentTarget;

                enableCard(card);    
                card.classList.remove('move2c');
                card.style.removeProperty('transition');
                        
            }, {once: true}); 
        }
    }

    let moveCards = [card];
    let col = card.dataset.col;
    let cards = document.querySelectorAll(`[data-col='${col}']`);
    let cards2 = document.querySelectorAll(`[data-col='${n}']`);
    let nCards = 0;

    for (let i = 0; i < cards.length; i++) {
        if (Number(cards[i].style.zIndex) > Number(card.style.zIndex)) moveCards.push(cards[i]);
    }

    for (let card of cards2) {
        disableCard(card);
    }

    if (topCard && topCard.classList.contains('move2c')) return;

    let zIndex = topCard ? cards2.length : 0;
    let baseIndex = Number(moveCards[0].style.zIndex);

    moveCards.forEach(card => {

        let offsetPlus;
        let i = Number(card.style.zIndex) -  baseIndex;

        disableCard(card);

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;

            card.style.removeProperty('transition');
            card.classList.remove('move2c');
            card.style.zIndex = zIndex + 1 + i;
            card.querySelector('.card').classList.remove('zoom');

            enableCard(card);

            for (let card of cards2) {
                enableCard(card);
            }

            nCards++;

            if (moveCards.length == nCards) setTimeout(compressColumn, 10);

        }, {once: true}); 

        let coef = screen.width > 460 && screen.height > 460 ? 3 : 2.5;
        let topCell = document.querySelectorAll('.cell')[n + nColumns - 1];
        let rect = topCell.getBoundingClientRect();
    
        if (topCard) {
            offsetPlus = Number(card.dataset.rank) != 13 ? topCard.getBoundingClientRect().top - rect.top + (topCard.getBoundingClientRect().height / coef) * (i + 1) : 0;
        } else {
            offsetPlus = Number(card.dataset.rank) != 13 ? card.getBoundingClientRect().height * (zIndex + i) / coef : 0;
        }

        let style = window.getComputedStyle(card);
        let matrix = new DOMMatrix(style.transform);
        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - topCell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - topCell.getBoundingClientRect().top) + offsetPlus;

        card.style.zIndex = Number(card.style.zIndex) + 50;
        card.querySelector('.card').classList.add('zoom');
        card.dataset.col = n;
        card.classList.remove('waste');
        card.removeAttribute('data-f');
        card.classList.add('move2c');
        card.style.transition = `all 0.5s ease-in-out`;              
        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    });

    spreadColumn(col);
}

const checkColumns = (card) => {

    for (let n = 1; n <= nColumns; n++) {

        let cards = document.querySelectorAll(`[data-col='${n}']`);
        let topCard = cards[0];

        for (let card of cards) {
            if (Number(card.style.zIndex) > Number(topCard.style.zIndex)) topCard = card;
        }

        if (!topCard && Number(card.dataset.rank) != king) continue;
        if (!topCard && Number(card.dataset.rank) == king && 
            Number(card.style.zIndex) == 1 && card.hasAttribute('data-col')) continue;
        if ((!topCard && Number(card.dataset.rank) == king) || 
             Number(topCard.dataset.rank) - Number(card.dataset.rank) == 1 && 
             card.dataset.color != topCard.dataset.color) return {n, topCard};
    }

    return null;
}

const moveToFounation = (card, n, zIndex) => {

    const win = () => {

        for (let i = 1; i <= nFoundations; i++) {
    
            let cards =  document.querySelectorAll(`[data-f='${i}']`);
    
            if (cards.length != king) return false;
        }
    
        return true;
    }

    let cards = document.querySelectorAll(`[data-f='${n}']`);
    let col = card.dataset.col;
    let foundationCell = document.querySelectorAll('.foundation')[n - 1];
    let style = window.getComputedStyle(card);
    let matrix = new DOMMatrix(style.transform);
    let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - foundationCell.getBoundingClientRect().left);
    let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - foundationCell.getBoundingClientRect().top);

    disableCard(card);

    for (let card of cards) {
        disableCard(card);
    }

    card.style.zIndex = Math.pow(2, Number(card.dataset.rank) + 10);
    card.querySelector('.card').classList.add('zoom');
    card.dataset.f = n;
    card.classList.remove('waste');
    card.removeAttribute('data-col');
    card.classList.add('move2f');
    card.style.transition = 'all 0.5s ease-in-out';
    card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    
    card.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;

        card.style.removeProperty('transition');
        card.classList.remove('move2f');
        card.style.zIndex = zIndex + 1;
        card.querySelector('.card').classList.remove('zoom');

        if (!win()) {

            enableCard(card);

            for (let card of cards) {
                enableCard(card);
            }  
        }

    }, {once: true});

    spreadColumn(col);

    if (win()) {
        disableReset();
        disableCards();
        setTimeout(gameOver, 2000);
    }
}

const topCard = (card) => {

    if (card.classList.contains('waste')) return true;

    let col = card.dataset.col;
    let cards =  document.querySelectorAll(`[data-col='${col}']`);

    for (let i = 0; i < cards.length; i++) {
        if (Number(card.style.zIndex) < Number(cards[i].style.zIndex)) return false;
    }

    return true;
}

const checkFoundations = (card) => {

    if (card.hasAttribute('data-f')) return;
    if (!topCard(card)) return null;

    for (let n = 1; n <= nFoundations; n++) {

        let suit, rank;
        let topIndex = 0;
        let cards =  document.querySelectorAll(`[data-f='${n}']`);

        for (let card of cards) {
            if (Number(card.style.zIndex) > topIndex) [topIndex, rank, suit] = [Number(card.style.zIndex), Number(card.dataset.rank), card.dataset.suit];
        }

        if (topIndex == 0 && Number(card.dataset.rank) == ace) return {n, zIndex: 0};
        if (Number(card.dataset.rank) - rank == 1 && suit == card.dataset.suit) return {n, zIndex: cards.length};
    }

    return null;
}

const drawCard = (card) => {

    const zIndex = () => {

        let zIndex = 0;
        let cards = [...document.querySelectorAll('.waste:not(.cell)')];
    
        for (let card of cards) {
            if (Number(card.style.zIndex) > zIndex) zIndex = Number(card.style.zIndex);
        }
    
        return zIndex == 0 ?  1 : zIndex < 5 ? zIndex *= 3 : zIndex *= 2;
    }

    let cards = document.querySelectorAll('.stock:not(.cell)');
    let wasteCell = document.querySelector('.cell.waste');
    let style = window.getComputedStyle(card);
    let matrix = new DOMMatrix(style.transform);
    let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - wasteCell.getBoundingClientRect().left);
    let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - wasteCell.getBoundingClientRect().top);

    disableCard(card);

    if (cards.length == 1) setTimeout(enableReset, 600);

    card.style.zIndex = zIndex();
    card.querySelector('.card').classList.add('zoom');

    card.classList.remove('stock');
    card.classList.add('waste');
    card.classList.toggle('flip');
    card.style.transition = 'all 0.5s ease-in-out';
    card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

    card.addEventListener('transitionend', (e) => {

        let card = e.currentTarget;

        card.style.removeProperty('transition');
        card.querySelector('.card').classList.remove('zoom');

        enableCard(card);

    }, {once: true}); 
}

const nextMove = () => {

    let cards = document.querySelectorAll('.card-wrap');

    if (document.hidden) return;
    if (aiMoves.length == 0) return;

    aiTimer = setTimeout(() => moveCards(cards[aiMoves.shift()]), 1000);
}

const encriptDeck = () => {
    
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let suits = {'♥': 1,'♠': 2,'♦': 3,'♣': 4};
    let cards = document.querySelectorAll('.card-wrap');
    let encDeck = '';

    for (let card of cards) {

        let rank = Number(card.dataset.rank);
        let suit = suits[card.dataset.suit];
        let char = abc[(rank - 1) * nSuits + suit - 1];

        encDeck = encDeck + char;
    }

    return encDeck;
}

const changeMode = () => {
    
    if (document.hidden) {
        
        clearTimeout(aiTimer);
        screenVisible = false;
    }

    if (!document.hidden && !screenVisible) {

        nextMove();
        screenVisible = true;
    }
}

const aiPlay = () => {

    window.removeEventListener('visibilitychange', changeMode);

    setTimeout(() => window.addEventListener('visibilitychange', changeMode), 50);

    screenVisible = true;

    let encDeck = encriptDeck();

    aiMoves = getMoves(encDeck);

    nextMove();
}

const aiMode = () => {

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let mode = urlParams.get('mode');

    return mode == 'ai';
}

const moveCards = (e) => {
    
    let card = e.currentTarget ? e.currentTarget : e;
    let cards = [...document.querySelectorAll('.card-wrap')];
    let cardNumber = cards.indexOf(card);

    if (document.hidden) return;
    if (aiMode() && e.isTrusted) return;

    if (!card.classList.contains('flip')) {
        if (cardNumber < deckSize - tableauSize) {

            drawCard(card);
    
            if (aiMode()) nextMove();
        }

        return;
    }
    
    let foundation = checkFoundations(card);

    if (foundation != null) {

        let col = card.dataset.col;

        moveToFounation(card, foundation.n, foundation.zIndex);

        if (col) flipTopCard(col);
        if (aiMode()) nextMove();

        return;
    }

    let column = checkColumns(card);

    if (column != null) {

        let col = card.dataset.col;

        moveToColumn(card, column.n, column.topCard);

        if (col) flipTopCard(col);
        if (aiMode()) nextMove();

        return;
    }

    shakeCards(card);
}

const fillTableau = () => {

    let index;
    let zIndex = 0;
    let delay = 1;
    let interval = 0.1;
    let duration = 0.5;
    let openCards = [0, 7, 13, 18, 22, 25, 27];
    let n = tableauSize;
    let cards = [...document.querySelectorAll('.card-wrap')].reverse();
    let ua = navigator.userAgent;
    let safari = /Safari/.test(ua) && !/Chrome/.test(ua);
    let app = !document.URL.startsWith('http://') && !document.URL.startsWith('https://');
    let transitionStartAvail = transitionStartEvent && safari || app;

    for (let i = 0; i < tableauSize; i++) {

        let card = cards[i];
        let cell = document.querySelectorAll('.cell')[i + nColumns];
        let style = window.getComputedStyle(card);
        let matrix = new DOMMatrix(style.transform);
        let offsetLeft = matrix.m41 - (card.getBoundingClientRect().left - cell.getBoundingClientRect().left);
        let offsetTop = matrix.m42 - (card.getBoundingClientRect().top - cell.getBoundingClientRect().top);


        delay += interval;

        card.querySelector('.card-inner').style.transition = `all ${duration}s ${delay}s linear`;

        card.style.transition = `transform ${duration}s ${delay}s linear`;

        if (openCards.includes(i)) {
            index = openCards.indexOf(i);
            card.classList.toggle('flip');
        }

        if (!transitionStartAvail) {
             setTimeout(() => {
                if (card.classList.contains('flip')) zIndex++;
                card.style.zIndex = zIndex;
            }, (delay + 0.05) * 1000);
        }
       
        card.dataset.col = i - openCards[index] + index + 1;
        card.classList.remove('stock');

        card.addEventListener('transitionstart', (e) => {

            let card = e.currentTarget;

            if (transitionStartAvail) {
                setTimeout(() => {
                   if (card.classList.contains('flip')) zIndex++;
                   card.style.zIndex = zIndex;
                }, 50);
            }
        
        }, {once: true}); 

        card.addEventListener('transitionend', (e) => {

            let card = e.currentTarget;
            
            card.style.removeProperty('transition');

            card.firstElementChild.firstElementChild.removeAttribute('style');

            n--;

            if (n == 0) aiMode() ? aiPlay() : enableCards();

        }, {once: true}); 

        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;
    }
}

const getDeck = () => {

    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let suits = ['♥','♠','♦','♣'];
    let ranks = {1:'A',11:'J',12:'Q',13:'K'};
    let n = Math.trunc(Math.random() * decks.length);
    let encDeck = decks[n];
    let deck = [];

    for (let char of encDeck) {

        let suit = suits[abc.indexOf(char) % nSuits];
        let value = Math.trunc(abc.indexOf(char) / nSuits) + 1;
        let rank = ranks[value] || String(value);

        deck.push({rank, suit});
    }

    return deck;
}

const setCards = () => {

    let deck = getDeck();
    let cards = document.querySelectorAll('.card-wrap');
    let values = {'A':1,'J':11,'Q':12,'K':13};
    let suits = {'♥':'heart','♦':'diamond','♠':'spade','♣':'club'};

    for (let i = deckSize - 1; i >= 0; i--) {

        let card = cards[i];
        let {rank, suit} = deck[i];
        let color = suit == '♥' || suit == '♦' ? 'red' : 'black';

        if (rank == '10') {
            card.querySelector('.rank').classList.add('ten');
        } else {
            card.querySelector('.rank').classList.remove('ten');
        }

        card.querySelector('.front').classList.remove('red', 'black');
        card.querySelector('.front').classList.add(color);
        card.querySelector('.rank').innerText = rank;
        card.dataset.suit = suit; 
        card.dataset.rank = values[rank] || Number(rank);
        card.dataset.color = color; 

        card.querySelectorAll('img').forEach(img => {
            img.src = `images/suits/${suits[suit]}.svg`;
        });
    } 
}

const setTable = ({shuffle = true} = {}) => {

    if (document.hidden && !shuffle)  {

        window.addEventListener('visibilitychange', () => {

            setTable({shuffle: false});

        }, {once: true});

        return;
    }

    if (shuffle) setCards();

    setTimeout(fillTableau, 200);
}

const resetGame = () => {

    let timeOut = 0;
    let cards = document.querySelectorAll('.card-wrap');

    if (aiMode()) return;

    disableCards();
    disableReset();

    for (let card of cards) {

        if (card.classList.contains('move2f') || card.classList.contains('move2c')) timeOut = 500;
    }

    setTimeout(() => {

        let delay = clearTable();

        setTimeout(setTable, delay * 1000 + 1000, {shuffle: false});        

    }, timeOut); 
}

const showBoard = () => {

    let body = document.querySelector('body');

    body.addEventListener('transitionstart', () => {

        transitionStartEvent = true;
    
    }, {once: true}); 

    body.style.opacity = 1;  
}

const placeDeck = () => {

    let stockCell = document.querySelector('.stock.cell');
    let table = document.querySelector('.table');
    let template = document.querySelector('.card-template');
    
    for (let i = 0; i < deckSize; i++) {

        let cardClone = template.content.cloneNode(true);
        let card = cardClone.querySelector('.card-wrap');

        table.appendChild(cardClone);

        let cellRect = stockCell.getBoundingClientRect();
        let cardRect = card.getBoundingClientRect();
        let offsetLeft = cellRect.left - cardRect.left;
        let offsetTop = cellRect.top  - cardRect.top ;

        card.style.transform = `translate(${offsetLeft}px, ${offsetTop}px)`;

        card.classList.add('stock');
    }
}

const setCardSize = () => {

    let minSide = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight;

    document.documentElement.style.setProperty('--card-width', Math.floor(minSide *  0.97 / 7 * 0.86) + 'px');
}

const enableReset = () => {

    let button = document.querySelector('.reset');

    button.addEventListener('touchstart', resetGame);
    button.addEventListener('mousedown', resetGame);
}

const disableReset = () => {

    let button = document.querySelector('.reset');

    button.removeEventListener('touchstart', resetGame);
    button.removeEventListener('mousedown', resetGame);
}

const enableCard = (card) => {

    card.addEventListener('touchstart', moveCards);
    card.addEventListener('mousedown', moveCards);
}

const enableCards = () => {    

    for (let card of document.querySelectorAll('.card-wrap')) {
        enableCard(card);
    }
}

const disableCard = (card) => {
    
    card.removeEventListener('touchstart', moveCards);
    card.removeEventListener('mousedown', moveCards);
} 

const disableCards = () => {

    for (let card of document.querySelectorAll('.card-wrap')) {
        disableCard(card);
    }
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.addEventListener('touchstart', preventDefault, {passive: false});
    document.addEventListener('mousedown', preventDefault, {passive: false});
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {

    registerServiceWorker();
    disableTapZoom();
    setCardSize();
    placeDeck();
    showBoard();
    setTable();
}

window.onload = () => document.fonts.ready.then(() => setTimeout(init, 500));