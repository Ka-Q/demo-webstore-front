const hideResults = (setVisible) => {
    const overlay = document.querySelector('#search-overlay');
    overlay.style.display = 'none';
    if (setVisible) setVisible(false);
}

const showResults = (setVisible) => {
    const overlay = document.querySelector('#search-overlay');
    overlay.style.display = 'block';
    if (setVisible) setVisible(true);
}

export {hideResults, showResults};