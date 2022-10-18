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

const setTable = () => {
    setCardsSize();
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, { passive: false });
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const init = () => {

    // disableTapZoom();

    // disableCards();

    setTable();

    // setTimeout(enableCards, 3700);    
}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(init, 0); 
    });
}