import {Point} from "./Point.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const FPS = 60;
const BACKGROUND_COLOR = "#000000";
const STROKE_COLOR = "#66FF66";
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

let dz = 0;
let angleZ = 0;
let angleX = 0;
let angleY = 0;

function clear() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = STROKE_COLOR;
}


function drawSquare(point, side) {
    let cartesian = point.project().convertCartesian(WIDTH, HEIGHT, side);
    ctx.fillRect(cartesian.x, cartesian.y, side, side);
}

function rotateZ(point, angle) {
    /*
    |cos a  -sin a   0| |x|
    |sin a   cos a   0| |y|
    |  0       0     1| |z|
     */

    let rot_x = Math.cos(angle) * point.x - Math.sin(angle) * point.y;
    let rot_y = Math.sin(angle) * point.x + Math.cos(angle) * point.y;

    return new Point(rot_x, rot_y, point.z);
}

function rotateY(point, angle) {
    /*
    |cos a      0   -sin a| |x|
    |  0        1        0| |y|
    |sin a      0    cos a| |z|
     */

    let rot_x = Math.cos(angle) * point.x - Math.sin(angle) * point.z;
    let rot_z = Math.sin(angle) * point.x + Math.cos(angle) * point.z;

    return new Point(rot_x, point.y, rot_z);
}

function rotateX(point, angle) {
    /*
    |  1      0         0| |x|
    |  0   cos a   -sin a| |y|
    |  0   sin a    cos a| |z|
     */

    let rot_y = Math.cos(angle) * point.y - Math.sin(angle) * point.z;
    let rot_z = Math.sin(angle) * point.y + Math.cos(angle) * point.z;

    return new Point(point.x, rot_y, rot_z);
}

function drawFrame() {
    const dt = 1 / FPS;
    const da = Math.PI / FPS;
    dz += dt;
    angleZ += da;
    angleX += da;
    angleY += da;

    clear();
    let p = new Point(-0.5, -0.5, dz);
    let p1 = new Point(0.5, 0.5, dz);
    let p2 = new Point(-0.5, 0.5, dz);
    let p3 = new Point(0.5, -0.5, dz);

    let p4 = new Point(-0.5, -0.5, -dz);
    let p5 = new Point(0.5, 0.5, -dz);
    let p6 = new Point(-0.5, 0.5, -dz);
    let p7 = new Point(0.5, -0.5, -dz);

    drawSquare(rotateZ(p, angleZ), 10);
    drawSquare(rotateZ(p1, angleZ), 10);
    drawSquare(rotateZ(p2, angleZ), 10);
    drawSquare(rotateZ(p3, angleZ), 10);

    drawSquare(rotateZ(p4, angleZ), 10);
    drawSquare(rotateZ(p5, angleZ), 10);
    drawSquare(rotateZ(p6, angleZ), 10);
    drawSquare(rotateZ(p7, angleZ), 10);

    setTimeout(drawFrame, 1000 / FPS);
}


setTimeout(drawFrame, 1000 / FPS);


