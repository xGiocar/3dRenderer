import {Point} from "./Point.js";
import {Vector} from "./Vector.js";
import {Matrix} from "./Matrix.js";

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

let vertices = [
    new Vector({x: 0.5, y: 0.5, z: 0.5, w: 0}),
    new Vector({x: 0.5, y: 0.5, z: -0.5, w: 0}),
    new Vector({x: 0.5, y: -0.5, z: 0.5, w: 0}),
    new Vector({x: 0.5, y: -0.5, z: -0.5, w: 0}),
    new Vector({x: -0.5, y: 0.5, z: 0.5, w: 0}),
    new Vector({x: -0.5, y: 0.5, z: -0.5, w: 0}),
    new Vector({x: -0.5, y: -0.5, z: 0.5, w: 0}),
    new Vector({x: -0.5, y: -0.5, z: -0.5, w: 0}),
]

function clear() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = STROKE_COLOR;
}

function convertCartesian(vector, side) {
    // x belongs to [-1; 1]   | add 1
    // x belongs to [0; 2]    | divide by 2
    // x belongs ot [0; 1]    | divide by width/height to shrink interval

    let new_x = (vector.x + 1) / 2 * WIDTH - side / 2;
    let new_y = (1 - (vector.y + 1) / 2) * HEIGHT - side / 2;

    return new Vector({x: new_x, y: new_y, z: vector.z, w: vector.w});
}

function drawSquare(vector, side) {
    let cartesian = convertCartesian(vector, side);
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
    angleZ = da;
    angleX = da;
    angleY = da;

    clear();

    for (let i = 0; i < vertices.length; i++) {
        let transformMatrix = Matrix.matrixMultiply(Matrix.rotationMatrixXY(angleZ), Matrix.rotationMatrixXZ(angleY));
        vertices[i] = Matrix.vectorMultiply(transformMatrix, vertices[i]);
        drawSquare(vertices[i], 10);
    }

    setTimeout(drawFrame, 1000 / FPS);
}


setTimeout(drawFrame, 1000 / FPS);


