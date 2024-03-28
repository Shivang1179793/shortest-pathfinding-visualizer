import React, { useEffect, useState } from "react";
import "./Home.css";
import "leaflet/dist/leaflet.css";
// swal is library of reactjs
import DijkstraWithWalls from "../../Algorithms/DijkstraWithWalls";
import swal from "sweetalert";
import Animation1 from "../../Animations/Animation1";
import Button from "../button/button";
import ReactSelect from "react-select";
import ItemCard from "../Item-card/item-card";
import { n, m } from "../../config";
import { clearWeights } from "../../utils/clearfunctions";
import BasicMap from "./basic";
export default function Home() {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = new Array(m);
        for (let j = 0; j < m; j++) {
            arr[i][j] = { i: i, j: j };
        }
    }
    const totalNodes = m * n;
    const [color, setColor] = useState("red");
    const [walls, setWalls] = useState([]);
    const [weights, setWeights] = useState([]);
    const [visualized, setVisualized] = useState(false);
    const [visualizing, setVisualizing] = useState(false);
    // by default we add source and destination places source at index (10,15) and (10,35) 
    const [source, setSource] = useState({ x: 10, y: 15 });
    const [target, setTarget] = useState({ x: 10, y: 35 });
    const [isMapVisible, setIsMapVisible] = useState(true);
    const toggleMapVisibility = () => {
        setIsMapVisible(!isMapVisible);
    };
    const handleButtonClick = () => {
        const leafletContainer = document.querySelector('.leaflet-container');
        if (leafletContainer) {
            leafletContainer.style.zIndex = isMapVisible ? -1 : 1;
        }
        toggleMapVisibility();
    }
    // The useEffect hook provided in your code snippet will render the page once, as indicated by the dependency array []. This means it will only run once when the component mounts and there are no dependencies to monitor for changes. Therefore, it won't rerender the page unless the component is unmounted and then remounted.
    useEffect(() => {
        const cells = document.querySelectorAll(".cell");
        const source = 10 * m + 15;//getting an source cells
        const target = 10 * m + 35;//getting an target cells
        const sourceImg = document.createElement("img");
        sourceImg.src = "./images/location.png";
        const targetImg = document.createElement("img");
        targetImg.src = "./images/bulleye.png";
        cells[source].appendChild(sourceImg);
        cells[target].appendChild(targetImg);
    }, []);
    const cells = document.querySelectorAll(".cell");
    const clearBoard = () => {
        const cells = document.querySelectorAll(".cell");
        const totalNodes = n * m;

        for (let i = 0; i < totalNodes; i++) {
            cells[i].style.backgroundColor = "transparent";
            cells[i].style.border = "none";
        }
        setWalls([]);
        setWeights([]);
        clearWeights(weights);
    };
    const markItem = (colorText, isCutThrough) => {
        // If item is cut then user should not able to select it.
        if (isCutThrough) return;
        setColor(colorText);
    };
    const mark = (event) => {
        const elem = event.target;
        const img = document.createElement("img");
        const cells = document.querySelectorAll(".cell");
        if (event.target.tagName === "IMG") return;
        const x = Number(event.target.childNodes[0].childNodes[0].innerText);
        const y = Number(event.target.childNodes[0].childNodes[1].innerText);
        const isOnWall = walls.filter((wall) => wall === x * m + y);
        if (isOnWall.length > 0 && (color === "red" || color === "green")) {
            swal(
                "Oops!",
                `${color === "red" ? "Source" : "Target"} can't be placed on wall.`,
                "info"
            );
            return;
        }
        if (color === "red") {
            const node = cells[source.x * m + source.y];
            if (node.hasChildNodes()) {
                node.removeChild(node.children[1]);
            }
            img.src = "./images/location.png";
            setSource({ x, y });
        } else if (color === "green") {
            const node = cells[target.x * m + target.y];
            if (node.hasChildNodes()) {
                node.removeChild(node.children[1]);
            }
            img.src = "./images/bulleye.png";
            setTarget({ x, y });
        } else if (color === "black") {
            const wallNode = x * m + y;
            setWalls((prev) => [...prev, wallNode]);
            cells[wallNode].style.backgroundColor = "#212a3e";
            cells[wallNode].style.border = "1px solid #212a3e";
        } else if (color === "blue") {
            const weightNode = x * m + y;
            setWeights((prev) => [...prev, weightNode]);
            img.src = "./images/weight.png";
        }
        elem.appendChild(img);
    };
    const DijsktraAlgo = async () => {
        const path = await DijkstraWithWalls(
            source.x,
            source.y,
            target.x,
            target.y,
            walls,
            weights
        ).then(path => {
            if (path.length === 0) {
                swal("Oops!", "Target not found", "warning");
                return;
            }
            Animation1(source, target, path, walls);
            setVisualizing(false);
        }).catch(error => {
            swal("There is no path found between the source and destination");
        });
    };
    const clearPath = () => {
        const cells = document.querySelectorAll(".cell");
        const isWall = new Array(totalNodes);
        for (let i = 0; i < totalNodes; i++) {
            isWall[i] = false;
        }
        for (let i = 0; i < walls.length; i++) {
            isWall[walls[i]] = true;
        }
        for (let i = 0; i < totalNodes; i++) {
            // weight is not considered here because I have to change there
            // background color to white again weight is a img.
            if (isWall[i]) {
                continue;
            }
            cells[i].style.backgroundColor = "transparent";
            cells[i].style.border = "none";
        }
    };
    const itemCardOptions = [
        {
            id: "source",
            label: "Source",
            className: "control-item",
            colorText: "red",
            imageSrc: "./images/location.png",
            altText: "Socuce Image Icon",
        },
        {
            id: "target",
            label: "Target",
            className: "control-item",
            colorText: "green",
            imageSrc: "./images/bulleye.png",
            altText: "Target Image Icon",
        },
        {
            id: "wall",
            label: "Wall",
            className: "control-item",
            colorText: "black",
            imageSrc: "./images/wall.png",
            altText: "Wall Image Icon",
        },
        {
            id: "weight",
            label: "Weight",
            className: "control-item",
            colorText: "blue",
            imageSrc: "./images/weight.png",
            altText: "Weight Image Icon",
        },
    ];
    const startSolving = () => {
        if (visualized) clearPath();
        setVisualizing(true);
        setVisualized(true);
        DijsktraAlgo();
    };
    return (
        <div className="home-container">
            {/* Navbar */}
            <div className="nav-container">
                <div className="nav-item">
                    <div className="heading-section">Path Finder</div>
                    <div className="control-section">
                        {itemCardOptions.map((itemCard) => {
                            return (
                                <ItemCard
                                    key={itemCard.id}
                                    text={itemCard.label}
                                    className={itemCard.className}
                                    onClick={() =>
                                        markItem(
                                            itemCard.colorText,
                                            itemCard.className.includes("cut-through")
                                        )
                                    }
                                    imageSrc={itemCard.imageSrc}
                                    altText={itemCard.altText}
                                />

                            );
                        })}
                    </div>
                </div>
                <div className="nav-item">
                    <div className="flex justify-center items-center">
                        <div style={{ width: "200px", paddingRight: "8px" }}>
                        </div>
                        <div style={{ width: "200px", paddingRight: "8px" }}>
                        </div>
                    </div>
                    <div>
                        <Button
                            ButtonText="Choose Route"
                            className="map-button"
                            onClick={handleButtonClick}
                        />
                        <Button
                            ButtonText="Visualize"
                            className="play-button"
                            onClick={startSolving}
                            isDisabled={visualizing}
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <Button
                            ButtonText="Clear Path"
                            className="ml-2"
                            onClick={clearPath}
                            isDisabled={visualizing}
                        />
                        <Button
                            ButtonText="Clear"
                            className="ml-2"
                            onClick={clearBoard}
                            isDisabled={visualizing}
                        />
                    </div>
                </div>
            </div>
            <BasicMap></BasicMap> 
            <div className="grid-container">
                <table className="cells-container">
                    <tbody>
                        {arr.map((item, row) => {
                            return (
                                <tr key={row}>
                                    {item.map((cell, column) => {
                                        return (
                                            <td key={column} className="cell" onClick={mark} style={{ backgroundColor: 'transparent', border: 'none' }}>
                                                <div className="value">
                                                    <span className="value-x">{cell.i}</span>
                                                    <span className="value-y">{cell.j}</span>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}