import {Vector} from "./Vector.js";
import {Matrix} from "./Matrix.js";
import {Body} from "./Body.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const xSlider = document.getElementById("xAngle");
const ySlider = document.getElementById("yAngle");
const zSlider = document.getElementById("zAngle");

const xParagraph = document.getElementById("pX");
const yParagraph = document.getElementById("pY");
const zParagraph = document.getElementById("pZ");

const fileUpload = document.getElementById("fileInput");
let fileContent = "";

const FPS = 60;
const BACKGROUND_COLOR = "#151515";
const STROKE_COLOR = "#66FF66";
//const STROKE_COLOR = "#FF3366";
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

let dz = 0;
let angleZ = 0;
let angleX = 0;
let angleY = 0;
let radiansPerSecond = Math.PI / 2;  // rotation speed
let object = Body.cube;

let transformedVertices = [];


fileUpload.addEventListener("change", function () {
    const reader = new FileReader();

    reader.onload = function () {
        fileContent = reader.result;
    }

    reader.readAsText(this.files[0]);

});

document.getElementById("loadButton").addEventListener("click", loadObjectFromFile);


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function loadObjectFromFile() {
    object = Body.readObjFile(fileContent);
}

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
    ctx.fillRect(cartesian.x / cartesian.w, cartesian.y / cartesian.w, side, side);
}

function drawLine(vector1, vector2) {
    let cart_v1 = convertCartesian(vector1, 0);
    let cart_v2 = convertCartesian(vector2, 0);

    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cart_v1.x / cart_v1.w, cart_v1.y / cart_v1.w);
    ctx.lineTo(cart_v2.x / cart_v2.w, cart_v2.y / cart_v2.w);
    ctx.stroke();
}

function drawFace(vertices, face) {
    for (let i = 0; i < face.length; i++) {
        // draw a line from transformed vertex to another
        // we need -1 because .obj files are 1-indexed

        const vect1 = face[i] - 1;
        const vect2 = face[(i + 1) % face.length] - 1;
        drawLine(vertices[vect1], vertices[vect2]);
    }

}

function drawFrame() {
    const dt = 1 / FPS;
    const da = radiansPerSecond / FPS;
    dz += dt;

    angleX = degToRad(xSlider.value);
    angleY = degToRad(ySlider.value);
    angleZ = degToRad(zSlider.value);

    xParagraph.textContent = `${xSlider.value}°`;
    yParagraph.textContent = `${ySlider.value}°`;
    zParagraph.textContent = `${zSlider.value}°`;

    clear();

    for (let i = 0; i < object.vertices.length; i++) {
        let transformMatrix = Matrix.matrixMultiply(Matrix.rotationMatrixXY(angleZ), Matrix.rotationMatrixXZ(angleY));
        transformMatrix = Matrix.matrixMultiply(transformMatrix, Matrix.rotationMatrixYZ(angleX));
        //transformMatrix = Matrix.matrixMultiply(transformMatrix, Matrix.translationMatrix({Tx: 0.2, Ty: 0, Tz: 0.2}));
        //transformMatrix = Matrix.matrixMultiply(transformMatrix, Matrix.rotationMatrixYZ(angleY));
        //transformMatrix = Matrix.matrixMultiply(transformMatrix, Matrix.rotationMatrixXZ(angleY));
        transformedVertices[i] = (Matrix.vectorMultiply(transformMatrix, object.vertices[i]));
        drawSquare(transformedVertices[i], 1);
    }

    for (let i = 0; i < object.faces.length; i++) {

        drawFace(transformedVertices, object.faces[i]);
    }

    setTimeout(drawFrame, 1000 / FPS);
}

// for (let i = 0; i < object.vertices.length; i++) {
//     object.vertices[i] = Matrix.vectorMultiply(Matrix.translationMatrix({Tx: 0, Ty: 0, Tz: 0}), vertices[i]);
//     drawSquare(vertices[i], 10);
// }

setTimeout(drawFrame, 1000 / FPS);




