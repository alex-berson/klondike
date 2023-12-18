let moves, deck, stock, waste, foundations, tableau;
let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const setBoard = () => {
    moves = [];
    deck = [];
    stock = [];
    waste = [];
    foundations = [[],[],[],[]];
    tableau = [[],[],[],[],[],[],[]];
}

const setDeck = (encDeck) => {

    let suits = [1,2,3,4];

    for (let char of encDeck) {

        let val = Math.trunc(abc.indexOf(char) / nSuits) + 1;
        let suit = suits[abc.indexOf(char) % nSuits];
        let color = suit % 2 == 0 ? 'black' : 'red';

        deck.push({val, suit, color, open: false});
    }
}

const setTableau = () => {

    let maxColSize = 7;

    stock = [...deck];

    for (let i = 0; i < nColumns; i++) {
        for (let j = i; j < maxColSize; j++) {

            let card = stock.pop();

            if (j == i) card.open = true;

            tableau[j].push(card);
        }
    }
}

const saveMove = (card) => {

    let encDeck = '';

    for (let card of deck) {

        let char = abc[(card.val - 1) * nSuits + card.suit - 1];

        encDeck = encDeck + char;
    }
    
    let char = abc[(card.val - 1) * nSuits + card.suit - 1];
    let n = encDeck.indexOf(char);

    moves.push(n);
}

const checkTopCards = () => {

    const moveCard = (card, i, j) => {

        saveMove(card);

        foundations[j].push(card);
        tableau[i].pop();

        if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;
    }

   for (let i = 0; i < nColumns; i++) {

        if (tableau[i].length == 0) continue;

        let card1 = tableau[i][tableau[i].length - 1];

        for (let j = 0; j < nFoundations; j++) {

            if (foundations[j].length == 0) {

                if (card1.val == ace) {

                    moveCard(card1, i, j);

                    return true;
                }

                continue;
            }

            let card2 = foundations[j][foundations[j].length - 1];

            if (card1.suit == card2.suit && card1.val - card2.val == 1) {

                moveCard(card1, i, j);

                return true;
            }
        }
    }

    return false;
}

const checkBottomCards = () => {

    const moveCards = (i, j, k) => {

        saveMove(tableau[i][j]);

        let cards = tableau[i].splice(j, tableau[i].length - j);

        tableau[k].push(...cards);

        if (tableau[i].length != 0) tableau[i][tableau[i].length - 1].open = true;
    }

    for (let i = 0; i < nColumns; i++) {

        for (let j = 0; j < tableau[i].length; j++) {

            if (!tableau[i][j].open) continue;

            for (let k = 0; k < nColumns; k++) {

                if ((tableau[k].length == 0 && tableau[i][j].val == king && j != 0) ||
                    (tableau[k].length != 0 && tableau[k][tableau[k].length - 1].val - tableau[i][j].val == 1 &&
                     tableau[i][j].color != tableau[k][tableau[k].length - 1].color)) {

                    moveCards(i, j, k);

                    return true;
                }
            }
        
            break;
        }
    }

    return false;
}

const checkWaste = () => {

    const drawCard = () => {

        saveMove(stock[stock.length - 1]);
            
        waste.push(stock.pop());
    }

    const moveCard = (pile, i) => {

        saveMove(waste[waste.length - 1]);

        pile[i].push(waste.pop());

        pile[i][pile[i].length - 1].open = true;
    }

    while (true) {

        if (waste.length == 0) {

            if (stock.length == 0) return false;

            drawCard();
        };

        for (let i = 0; i < nFoundations; i++) {

            if (foundations[i].length == 0) {

                if (waste[waste.length - 1].val == ace) {

                    moveCard(foundations, i);

                    return true;
                }

                continue;
            }
            
            if (waste[waste.length - 1].val - foundations[i][foundations[i].length - 1].val != 1 ||
                waste[waste.length - 1].suit != foundations[i][foundations[i].length - 1].suit) continue;

            moveCard(foundations, i);

            return true;
        }

        for (let i = 0; i < nColumns; i++) {

            if (tableau[i].length == 0) {

                if (waste[waste.length - 1].val == king) {

                    moveCard(tableau, i);

                    return true;
                }

            } else if (tableau[i][tableau[i].length - 1].val - waste[waste.length - 1].val == 1 &&
                    tableau[i][tableau[i].length - 1].color != waste[waste.length - 1].color) {

                moveCard(tableau, i);

                return true;
            }
        }
        
        if (stock.length == 0) return false;

        drawCard();
    }
}

const playGame = () => {

    while (checkTopCards() || checkBottomCards() || checkWaste()) {}
}

const getMoves = (encDeck) => {

    setBoard();
    setDeck(encDeck);
    setTableau();
    playGame();
    
    return moves;
}