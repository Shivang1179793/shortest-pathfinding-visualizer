import { n, m } from "../config";
import swal from "sweetalert";
const totalNodes = n * m;
let visited = new Array(totalNodes);
let dist = new Array(totalNodes);
let isWeighted = new Array(totalNodes);
let walls = new Array(totalNodes);
for (let i = 0; i < totalNodes; i++) {
    visited[i] = false;
    isWeighted[i] = false;
    dist[i] = 1e9 + 7;
    walls[i] = -1;
}
let edges = new Array(n);
for (let i = 0; i < n; i++) {
    edges[i] = new Array(m);
    for (let j = 0; j < m; j++) {
        edges[i][j] = [];
        //I have to connect nodes in all 4 directions up,down,left,right
        if (i >= 1) {
            edges[i][j].push((i - 1) * m + j);//up
        }
        if (j + 1 < m) {
            edges[i][j].push(i * m + (j + 1));//right
        }
        if (i + 1 < n) {
            edges[i][j].push((i + 1) * m + j);//Down
        }
        if (j >= 1) {
            edges[i][j].push(i * m + (j - 1));
        }
    }
}
let path = [];
async function restart() {
    const cells = document.querySelectorAll(".cell");
    for (let i = 0; i < totalNodes; i++) {
        visited[i] = false;
        isWeighted[i] = false;
        dist[i] = 1e9 + 7;
        walls[i] = -1;
        cells[i].classList.remove("search-animation");
        cells[i].classList.remove("path-animation");
    }
    path = [];
}
//function
// sx: The x-coordinate of the source point.
// sy: The y-coordinate of the source point.
// tx: The x-coordinate of the target point.
// ty: The y-coordinate of the target point.
// wallArray: An array containing the indices of cells that represent walls or obstacles in the grid.
// weights: An array containing the indices of cells that have weights or costs associated with them.
export default async function Dijkstra(sx, sy, tx, ty, wallArray, weights) {
    const source = sx * m + sy;
    const target = tx * m + ty;
    await restart();
    for (let i = 0; i < weights.length; i++) {
        isWeighted[weights[i]] = true;
    }
    for (let i = 0; i < wallArray.length; i++) {
        walls[wallArray[i]] = 1;
    }
    await shortestPath(source, target, walls);
    await getPath(source, target);
    path.reverse();
    return path;
}
//sv=start vertex
// ev=end vertex 
//the below function updates an distances and marking nodes as visited until it finds the end vertex "ev" or exhausts all reachable nodes.
async function shortestPath(sv, ev, walls) {
    const cells = document.querySelectorAll(".cell");
    dist[sv] = 0;
    let q = [];
    q.push(sv);
    visited[sv] = true;
    while (q.length !== 0) {//It enters a while loop that continues until the queue q is not empty.
        const currNode = q.shift();
        const x = Math.floor(currNode / m);
        const y = currNode % m;
        //the above two lines It calculates the coordinates x and y of the current node currNode in the grid.
        //The below It iterates over the neighbors of the current node currNode using the edges array
        for (let i = 0; i < edges[x][y].length; i++) {
            const nextNode = edges[x][y][i];
            // console.log(edges[x][y][i]);
            // For each neighbor node nextNode, it checks if it is a wall. If it is, the iteration continues to the next neighbor
            if (walls[nextNode] == 1) {
                continue;
            }
            // It calculates the new distance to reach nextNode from currNode.
            let newDist = dist[currNode] + 1;
            let animationID;
            // It starts an animation to visualize the search process for the next node nextNode.
            const temp = new Promise((resolve, reject) => {
                animationID = setInterval(() => {
                    cells[nextNode].style.backgroundColor = "rgb(175, 216, 248)";
                    cells[nextNode].classList.add("search-animation");
                    resolve();
                }, 5);
            });
            await temp;//It awaits the animation to finish before proceeding to the next step
            clearInterval(animationID);
            // It checks if the neighbor node nextNode is the end vertex ev. If it is, the function sets ev as visited and breaks out of the loop.
            if (nextNode === ev) {
                visited[ev] = true;
                // targetReached++;
                break;
            }
            // If the neighbor node nextNode has a weight, it adjusts the distance accordingly.
            if (isWeighted[nextNode] === true) {
                newDist += 10; // 10 (because it is weighted)
            }
            // If the new distance to reach nextNode is shorter than the current distance stored in the dist array, it updates the distance and adds nextNode to the queue q.
            if (newDist < dist[nextNode]) {
                dist[nextNode] = newDist;
                q.push(nextNode);
            }
            visited[nextNode] = true;
        }
    }
}
// this function constructs the shortest path from the target vertex to the source vertex by traversing the grid based on the computed distances and selecting the next node with the minimum distance at each step
async function getPath(source, target) {
    let q = [];
    path.push(target);
    q.push(target);
    while (q.length !== 0) {
        const currNode = q.shift();
        const x = Math.floor(currNode / m);
        const y = currNode % m;
        let minDist = 1e9 + 7;
        let pathNode = -1;

        for (let i = 0; i < edges[x][y].length; i++) {
            const nextNode = edges[x][y][i];
            if (dist[nextNode] < minDist) {
                minDist = dist[nextNode];
                pathNode = nextNode;
            }
        }
        path.push(pathNode);
        if (pathNode === source) {
            break;
        }
        q.push(pathNode);
    }
}