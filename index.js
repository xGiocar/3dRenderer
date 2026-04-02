import {Vector} from "./Vector.js";
import {Matrix} from "./Matrix.js";
import {Body} from "./Body.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const xSlider = document.getElementById("xAngle");
const ySlider = document.getElementById("yAngle");
const zSlider = document.getElementById("zAngle");

const xSpinSlider = document.getElementById("xSpinSpeed");
const ySpinSlider = document.getElementById("ySpinSpeed");
const zSpinSlider = document.getElementById("zSpinSpeed");

const xSpinCheck = document.getElementById("xSpinCheck");
const ySpinCheck = document.getElementById("ySpinCheck");
const zSpinCheck = document.getElementById("zSpinCheck");

const xParagraph = document.getElementById("pX");
const yParagraph = document.getElementById("pY");
const zParagraph = document.getElementById("pZ");

const xSpinParagraph = document.getElementById("XSpinParagraph");
const ySpinParagraph = document.getElementById("YSpinParagraph");
const zSpinParagraph = document.getElementById("ZSpinParagraph");

const fileUpload = document.getElementById("fileInput");
const pickColor = document.getElementById("colorPicker");

let fileContent = "";

const FPS = 60;
const BACKGROUND_COLOR = "#151515";
const HEIGHT = canvas.height;
const WIDTH = canvas.width;

let dz = 0;
let angleZ = 0;
let angleX = 0;
let angleY = 0;
let object = Body.cube;
let stroke_color = pickColor.value;

let spinX = false;
let spinY = false;
let spinZ = false;

let rotationSpeedX = 0;
let rotationSpeedY = 0;
let rotationSpeedZ = 0;

let scale = 1;

fileUpload.addEventListener("change", function () {
    const reader = new FileReader();

    reader.onload = function () {
        fileContent = reader.result;
        object = Body.readObjFile(fileContent);
    }
    reader.readAsText(this.files[0]);

});

document.addEventListener("keydown", (e) => {
    if(e.key === "ArrowUp") {
        scale += 0.005;
    }

    if(e.key === "ArrowDown") {
        scale -= 0.005;
    }
})

pickColor.addEventListener("change", function() {
    stroke_color = pickColor.value;
});

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

function loadObjectFromFile() {
    object = Body.readObjFile(fileContent);
}


function clear() {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = stroke_color;
}

function convertCartesian(vector, side) {
    // x belongs to [-1; 1]   | add 1
    // x belongs to [0; 2]    | divide by 2
    // x belongs to [0; 1]    | divide by width/height to shrink interval

    let new_x = (vector.x + 1) / 2 * WIDTH - side / 2;
    let new_y = (1 - (vector.y + 1) / 2) * HEIGHT - side / 2;

    return new Vector({x: new_x, y: new_y, z: vector.z, w: vector.w});
}

function drawSquare(vector, side) {
    let cartesian = convertCartesian(vector, side);
    ctx.fillRect(cartesian.x / cartesian.w, cartesian.y / cartesian.w, side, side);
}

function drawLine(vector1, vector2, lineWidth) {
    let cart_v1 = convertCartesian(vector1, 0);
    let cart_v2 = convertCartesian(vector2, 0);

    ctx.strokeStyle = stroke_color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(cart_v1.x / cart_v1.w, cart_v1.y / cart_v1.w);
    ctx.lineTo(cart_v2.x / cart_v2.w, cart_v2.y / cart_v2.w);
    ctx.stroke();
}

function drawFace(vertices, face) {
    for (let i = 0; i < face.length; i++) {
        // draw a line from transformed vertex to another
        // we need -1 because .obj files are 1-indexed

        const vec1 = face[i] - 1;
        const vec2 = face[(i + 1) % face.length] - 1;
        drawLine(vertices[vec1], vertices[vec2], 2);
    }

}

function computeTransformMatrix(angleX, angleY, angleZ, scale) {
    let trMatrix = new Matrix();

    trMatrix = Matrix.matrixMultiply(Matrix.scalingMatrix(scale, scale, scale), trMatrix);

    //transformMatrix = Matrix.matrixMultiply(Matrix.translationMatrix(1/scale,1/scale,1/scale), transformMatrix);

    trMatrix = Matrix.matrixMultiply(Matrix.rotationMatrixYZ(angleX), trMatrix);
    trMatrix = Matrix.matrixMultiply(Matrix.rotationMatrixXZ(angleY), trMatrix);
    trMatrix = Matrix.matrixMultiply(Matrix.rotationMatrixXY(angleZ), trMatrix);

    return trMatrix;
}

function plotObject(object, transformMatrix) {
    let transformedVertices = [];
    for (let i = 0; i < object.vertices.length; i++) {
        transformedVertices[i] = (Matrix.vectorMultiply(transformMatrix, object.vertices[i]));
        drawSquare(transformedVertices[i], 1);
    }

    for (let i = 0; i < object.faces.length; i++) {
        drawFace(transformedVertices, object.faces[i]);
    }
}



function drawFrame() {

    let transformMatrix;
    spinX = xSpinCheck.checked;
    spinY = ySpinCheck.checked;
    spinZ = zSpinCheck.checked;

    xSpinParagraph.textContent = `${xSpinSlider.value}°/sec`;
    ySpinParagraph.textContent = `${ySpinSlider.value}°/sec`;
    zSpinParagraph.textContent = `${zSpinSlider.value}°/sec`;

    rotationSpeedX = xSpinSlider.value;
    rotationSpeedY = ySpinSlider.value;
    rotationSpeedZ = zSpinSlider.value;

    let deltaX = degToRad(rotationSpeedX) / FPS;
    let deltaY = degToRad(rotationSpeedY) / FPS;
    let deltaZ = degToRad(rotationSpeedZ) / FPS;


    xParagraph.textContent = `${xSlider.value}°`;
    yParagraph.textContent = `${ySlider.value}°`;
    zParagraph.textContent = `${zSlider.value}°`;

    if (!spinX) {
        angleX = degToRad(xSlider.value);
    }

    else if (spinX){
        angleX += deltaX;
        angleX %= 2 * Math.PI;
        xSlider.value = radToDeg(angleX);
    }

    if (!spinY) {
        angleY = degToRad(ySlider.value);
    }

    else if (spinY){
        angleY += deltaY;
        angleY %= 2 * Math.PI
        ySlider.value = radToDeg(angleY);
    }

    if (!spinZ) {
        angleZ = degToRad(zSlider.value);
    }

    else if (spinZ){
        angleZ += deltaZ;
        angleZ %= 2 * Math.PI;
        zSlider.value = radToDeg(angleZ);
    }

    transformMatrix = computeTransformMatrix(angleX, angleY, angleZ, scale);

    clear();

    plotObject(object, transformMatrix);

    setTimeout(drawFrame, 1000 / FPS);
}

setTimeout(drawFrame, 1000 / FPS);




