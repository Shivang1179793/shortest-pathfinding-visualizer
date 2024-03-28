import { n, m } from "../config";
export default async function Animation1(source, target, path, walls) {
    const cells = document.querySelectorAll(".cell");
    const totalNodes = n * m;
    for (let i = 0; i < totalNodes; i++) {
        cells[i].classList.remove("path-animation");
    }
    const allID = [];
    for (let i = 0; i < path.length; i++) {
        const animationID = setInterval(() => {
            // it shows color and border of shortest path 
            cells[path[i]].style.backgroundColor = "rgb(255,254,106)";
            cells[path[i]].style.border = "1px solid rgb(255,254,106)";
            cells[path[i]].classList.add("path-animation");
        }, i * 20);
        allID.push(animationID);
    }
    // It is used to clear intervals and avoid infinite calls from setinterval
    setTimeout(() => {
        for (let i = 0; i < allID.length; i++) {
            clearInterval(allID[i]);
        }
        for (let i = 0; i < totalNodes; i++) {
            if (!path.includes(i) && !walls.includes(i)) {
                cells[i].style.backgroundColor = ""; // Reset background color
                cells[i].style.border = ""; // Reset border
            }
        }
    }, path.length * 20);
    /* path.length * 20 and i * 10 are used for timing and delays within the animation logic, while in CSS, 250ms and 500ms control the duration,speed of the animations */
}