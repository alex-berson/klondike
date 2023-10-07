let deck = [];
let stock = [];
let waist = [];
let foundations = [[],[],[],[]];
let tableau = [[],[],[],[],[],[],[]];
let moves = [];

const reset = () => {
    deck = [];
    stock = [];
    waist = [];
    moves = [];
    foundations = [[],[],[],[]];
    tableau = [[],[],[],[],[],[],[]];
}

const setDeck = (encDeck) => {

    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let suits = [1,2,3,4];
    let open = false;

    for (let char of encDeck) {

        let val = Math.trunc(abc.indexOf(char) / 4) + 1;
        let suit = suits[abc.indexOf(char) % 4];
        let col = suit % 2 == 0 ? 'black' : 'red';

        deck.push({val, suit, col, open});
    }
}

const encriptDeckAI = () => {
    
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let encDeck = '';

    for (let card of deck) {

        let char = abc[(card.val - 1) * 4 + card.suit - 1];

        encDeck = encDeck + char;
    }

    return encDeck;
}

const setTableau = () => {

    stock = [...deck];

    for (let i = 0; i < 7; i++) {
        for (let j = i; j < 7; j++) {

            let card = stock.pop();
            if (j == i) card.open = true;
            tableau[j].push(card);
        }
    }
}

const checkLast = () => {

   for (let i = 0; i < 7; i++) {

        if (tableau[i].length == 0) continue;

        let card1 = tableau[i][tableau[i].length - 1];

        for (let j = 0; j < 4; j++) {

            if (foundations[j].length == 0) {
                if (card1.val == 1) {

                    saveMove(card1);

                    foundations[j].push(card1);
                    tableau[i].pop();

                    if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;

                    return true;
                }

                continue;
            }

            let card2 = foundations[j][foundations[j].length - 1];

            if (card1.suit == card2.suit && card1.val - card2.val == 1) {

                saveMove(card1);

                foundations[j].push(card1);
                tableau[i].pop();

                if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;

                return true;
            }
        }
    }

    return false;
}

const checkFirst = () => {

    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < tableau[i].length; j++) {

            if (!tableau[i][j].open) continue;

            for (let k = 0; k < 7; k++) {

                if (tableau[k].length == 0 && tableau[i][j].val == 13 && j != 0) {

                    saveMove(tableau[i][j]);

                    let cards = tableau[i].splice(j, tableau[i].length - j);

                    tableau[k].push(...cards);

                    if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;

                    return true;

                } else if (tableau[k].length != 0 && tableau[k][tableau[k].length - 1].val - tableau[i][j].val == 1 &&
                           tableau[i][j].col !== tableau[k][tableau[k].length - 1].col) {

                    saveMove(tableau[i][j]);

                    let cards = tableau[i].splice(j, tableau[i].length - j);

                    tableau[k].push(...cards);

                    if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;

                    return true;
                }
            }
        
            break;
        }
    }

    return false;
}

const ckeckWaste = () => {

    while (true) {

        if (waist.length == 0) {
            if (stock.length == 0) return false;

            saveMove(stock[stock.length - 1]);
            
            waist.push(stock.pop());
        };

        for (let i = 0; i < 4; i++) {

            if (foundations[i].length == 0) {
                if (waist[waist.length - 1].val == 1) {

                    saveMove(waist[waist.length - 1]);

                    foundations[i].push(waist.pop());
                    foundations[i][foundations[i].length - 1].open = true;
                    return true;
                }

                continue;
            };
            
            if (waist[waist.length - 1].val - foundations[i][foundations[i].length - 1].val != 1 ||
                waist[waist.length - 1].suit != foundations[i][foundations[i].length - 1].suit) continue;

            saveMove(waist[waist.length - 1]);

            foundations[i].push(waist.pop());

            foundations[i][foundations[i].length - 1].open = true;

            return true;
        }

        for (let i = 0; i < 7; i++) {

            if (tableau[i].length === 0) {
                if (waist[waist.length - 1].val === 13) {

                    saveMove(waist[waist.length - 1]);

                    tableau[i].push(waist.pop());

                    tableau[i][tableau[i].length - 1].open = true;

                    return true;
                }
            } else if (tableau[i][tableau[i].length - 1].val - waist[waist.length - 1].val === 1 &&
                    tableau[i][tableau[i].length - 1].col !== waist[waist.length - 1].col) {

                saveMove(waist[waist.length - 1]);

                tableau[i].push(waist.pop());

                tableau[i][tableau[i].length - 1].open = true;

                return true;
            }
        }
        
        if (stock.length == 0) return false;

        saveMove(stock[stock.length - 1]);

        waist.push(stock.pop());
    }
}

const solved = () => {

    for (let i = 0; i < 4; i++) {
        if (foundations[i].length != 13) return false;
    }

    return true;
}

const play = () => {

    while (true) {

        if (checkLast()) continue;
        if (checkFirst()) continue;
        if (ckeckWaste()) continue;

        break;
    }
}

const saveMove = (card) => {

    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let encDeck = encriptDeckAI();
    let char = abc[(card.val - 1) * 4 + card.suit - 1];
    let n = encDeck.indexOf(char);

    moves.push(n);
}

const getMoves = (encDeck) => {

    reset();
    setDeck(encDeck);
    setTableau();
    play();

    if (solved()) console.log('SOLVED');

    return moves;
}