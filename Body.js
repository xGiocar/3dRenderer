import {Vector} from "./Vector.js";

export class Body {
    constructor(props) {
        this.vertices = props.vertices;
        this.edges = props.edges;
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
        edges: [
            [1, 2],
            [1, 3],
            [1, 5],
            [2, 4],
            [2, 6],
            [3, 4],
            [3, 7],
            [4, 8],
            [5, 6],
            [5, 7],
            [6, 8],
            [7, 8]
        ]});

    static pyramid = new Body({
        vertices: [
            new Vector({x: 0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: 0.5, y: -0.5, z: -0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: 0.5, w: 1}),
            new Vector({x: -0.5, y: -0.5, z: -0.5, w: 1}),
            new Vector({x: 0, y: 0.5, z: 0, w: 1})
        ],
        edges: [
            [1, 2],
            [1, 3],
            [1, 5],
            [2, 4],
            [2, 5],
            [3, 5],
            [3, 4],
            [4, 5]
        ]});



}