import {Vector} from "./Vector.js";

export class Matrix {
    constructor(props = { cells:
                [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1 ]
    }) {
        this.cells = props.cells;
    }

    static rotationMatrixXY(angle) {
        /*
            |cos a  -sin a   0| |x|
            |sin a   cos a   0| |y|
            |  0       0     1| |z|
        */

        return new Matrix({cells:
                [Math.cos(angle), -Math.sin(angle), 0, 0,
                Math.sin(angle), Math.cos(angle), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]});
    }

    static rotationMatrixXZ(angle) {
        /*
            |cos a     0   -sin a| |x|
            |  0       1        0| |y|
            |sin a     0    cos a| |z|
        */

        return new Matrix({cells:
                [
                    Math.cos(angle), 0, -Math.sin(angle), 0,
                    0, 1, 0, 0,
                    Math.sin(angle), 0, Math.cos(angle), 0,
                    0, 0, 0, 1
                ]});
    }

    static rotationMatrixYZ(angle) {
        /*
            |  1      0         0| |x|
            |  0   cos a   -sin a| |y|
            |  0   sin a    cos a| |z|
        */

        return new Matrix({cells:
                [
                    1, 0, 0, 0,
                    0, Math.cos(angle), -Math.sin(angle), 0,
                    0, Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 0, 1
                ]});
    }

    static translationMatrix(tx = 0, ty = 0, tz = 0) {
        return new Matrix({cells:
                [1, 0, 0, tx,
                0, 1, 0, ty,
                0, 0, 1, tz,
                0, 0, 0, 1 ]});
    }

    static scalingMatrix(sx = 1, sy = 1, sz = 1) {
        return new Matrix({cells:
                [sx, 0, 0, 0,
                0, sy, 0, 0,
                0, 0, sz, 0,
                0, 0, 0, 1 ]});
    }

    at(i, j) {
        return this.cells[(j - 1) + 4 * (i - 1)];
    }

    static vectorMultiply(matrix, vector) {
        let result = new Vector();

        result.x = matrix.at(1, 1) * vector.x +
            matrix.at(1, 2) * vector.y +
            matrix.at(1, 3) * vector.z +
            matrix.at(1, 4) * vector.w;

        result.y = matrix.at(2, 1) * vector.x +
            matrix.at(2, 2) * vector.y +
            matrix.at(2, 3) * vector.z +
            matrix.at(2, 4) * vector.w;

        result.z = matrix.at(3, 1) * vector.x +
            matrix.at(3, 2) * vector.y +
            matrix.at(3, 3) * vector.z +
            matrix.at(3, 4) * vector.w;

        result.w = matrix.at(4, 1) * vector.x +
            matrix.at(4, 2) * vector.y +
            matrix.at(4, 3) * vector.z +
            matrix.at(4, 4) * vector.w;

        return result;
    }

    static matrixMultiply(matrix1, matrix2) {
        let resultCells = new Array(16).fill(0);


        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 4; j++) {

                let sum = 0;
                for (let k = 1; k <= 4; k++) {
                    sum += matrix1.at(i, k) * matrix2.at(k, j);
                }
                resultCells[(i - 1) + 4 * (j - 1)] = sum;
            }
        }

        return new Matrix({ cells: resultCells });
    }

}