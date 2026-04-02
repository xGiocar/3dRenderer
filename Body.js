import {Vector} from "./Vector.js";
import {Matrix} from "./Matrix.js";

export class Body {
    constructor(props = {vertices: [], faces: []}) {
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

        // compute the center for each axis (x,y,z)
        let maximums = new Array(3);
        let minimums = new Array(3);
        let centers = new Array(3);

        maximums[0] = Math.max(...vertices.map(v => v.x));
        minimums[0] = Math.min(...vertices.map(v => v.x));

        maximums[1] = Math.max(...vertices.map(v => v.y));
        minimums[1] = Math.min(...vertices.map(v => v.y));

        maximums[2] = Math.max(...vertices.map(v => v.z));
        minimums[2] = Math.min(...vertices.map(v => v.z));

        centers[0] = (maximums[0] + minimums[0]) / 2;
        centers[1] = (maximums[1] + minimums[1]) / 2;
        centers[2] = (maximums[2] + minimums[2]) / 2;

        // translate the body to (its) center
        for (let i = 0; i < vertices.length; i++) {
            vertices[i] = Matrix.vectorMultiply(Matrix.translationMatrix(-centers[0], -centers[1], -centers[2]), vertices[i]);
            // v.x = (v.x - xMin) / (xMax - xMin);
            // v.y = (v.y - yMin) / (yMax - yMin);
            // v.z = (v.z - zMin) / (zMax - zMin);
            //
            // // centers the model
            // v.x = v.x - 0.5;
            // v.y = v.y - 0.5;
            // v.z = v.z - 0.5;
        }

        console.log(vertices)
        console.log(faces)

        return new Body({vertices, faces});
    }



    }

