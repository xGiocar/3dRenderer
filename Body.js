import {Vector} from "./Vector.js";
import {Matrix} from "./Matrix.js";

export class Body {
    constructor(props) {
        this.vertices = props.vertices;
        this.faces = props.faces;
    }

    static cube = new Body({
        vertices: [
            new Vector({x: 0.5, y: 0.5, z: 0.5, w: 1}),
            new Vector({x: 0.5, y: 0.5, z: -0.5, w: 1}),
            new Vector({x: 0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: 0.5, y: -0.5, z: -0.5, w: 1}),
            new Vector({x: -0.5, y: 0.5, z: 0.5, w: 1}),
            new Vector({x: -0.5, y: 0.5, z: -0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: -0.5, w: 1}),
        ],
        faces: [
            [1, 2, 4, 3],
            [5, 6, 8, 7],
            [1, 5],
            [2, 6],
            [4, 8],
            [3, 7]
        ]});

    static pyramid = new Body({
        vertices: [
            new Vector({x: 0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: 0.5, y: -0.5, z: -0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: -0.5, w: 1}),
            new Vector({x: 0, y: 0.5, z: 0, w: 1})
        ],
        faces: [
            [1, 2, 4, 3],
            [1, 5],
            [2, 5],
            [3, 5],
            [4, 5],
        ]});


    static readObjFile(content) {
        if (content === "") {
            return null;
        }

        let vertices = [];
        let faces = [];


        // regex means \n, optionally \r (if it is before \n)
        let lines = content.split(/\r?\n/);

        for (const line of lines) {
            let parts = line.trim().split(/ ? /);
            if (parts[0] === "v") {
                let x = Number.parseFloat(parts[1]);
                let y = Number.parseFloat(parts[2]);
                let z = Number.parseFloat(parts[3]);
                let vertex = new Vector({x: x, y: y, z: z, w: 1});

                //vertex = Matrix.vectorMultiply(Matrix.translationMatrix({Tx: 1, Ty: 1, Tz: 1}), vertex);
                vertices.push(vertex);
            }

            if (parts[0] === "f") {
                let face = [];
                for (let i = 1; i < parts.length; i++) {
                    let vals = parts[i].trim().split("/");
                    let vertex = vals[0];
                    face.push(vertex);
                }

                faces.push(face);
            }
        }

        let xMin = vertices[0].x;
        let xMax = vertices[0].x;
        let yMin = vertices[0].y;
        let yMax = vertices[0].y;
        let zMin = vertices[0].z;
        let zMax = vertices[0].z;
        // finds the max and for each coordinate
        for (let i = 1; i < vertices.length; i++) {
            let v = vertices[i];
            if (v.x < xMin) xMin = v.x;
            if (v.x > xMax) xMax = v.x;
            if (v.y < yMin) yMin = v.y;
            if (v.y > yMax) yMax = v.y;
            if (v.z < zMin) zMin = v.z;
            if (v.z > zMax) zMax = v.z;
        }

        // normalizes the coordinates to fit in the [0; 1] interval
        for (let i = 0; i < vertices.length; i++) {
            let v = vertices[i];
            v.x = (v.x - xMin) / (xMax - xMin);
            v.y = (v.y - yMin) / (yMax - yMin);
            v.z = (v.z - zMin) / (zMax - zMin);

            // centers the model
            v.x = v.x - 0.5;
            v.y = v.y - 0.5;
            v.z = v.z - 0.5;
        }

        console.log(vertices)
        console.log(faces)

        return new Body({vertices, faces});
    }



    }

