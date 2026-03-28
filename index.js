import {Point} from "./Point.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FPS = 60;
const BACKGROUND_COLOR = "#000000";
const STROKE_COLOR = "#66FF66";
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

let dz = 0;

function clear() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = STROKE_COLOR;
}


function drawSquare(point, side) {
    let cartesian = point.convertCartesian(WIDTH, HEIGHT, side);
    ctx.fillRect(cartesian.x, cartesian.y, side, side);
}

function rotate() {

}

function drawFrame() {
    const dt = 1 / FPS;
    dz += dt;

    clear();
    let p = new Point(-0.5, -0.5, dz);
    let p1 = new Point(0.5, 0.5, dz);
    let p2 = new Point(-0.5, 0.5, dz);
    let p3 = new Point(0.5, -0.5, dz);
    drawSquare(p.project(), 10);
    drawSquare(p1.project(), 10);
    drawSquare(p2.project(), 10);
    drawSquare(p3.project(), 10);

    setTimeout(drawFrame, 1000 / FPS);
}


setTimeout(drawFrame, 1000 / FPS);


