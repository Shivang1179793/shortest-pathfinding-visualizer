export const clearWeights = (weights) => {
    const cells = document.querySelectorAll(".cell");
    const len = weights.length;
    for (let i = 0; i < len; i++) {
        const elem = cells[weights[i]];

        if (elem.hasChildNodes()) {
            elem.removeChild(elem.children[1]);
        }
    }
};