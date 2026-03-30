export class Vector {
    constructor(props = {x: 0, y: 0, z: 0, w: 0}) {
        this.x = props.x;
        this.y = props.y;
        this.z = props.z;
        this.w = props.w;

    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        this.z += vector.z;
        this.w += vector.w;
    }

    static add(vector1, vector2) {
        return new Vector({
            x: vector1.x + vector2.x,
            y: vector1.y + vector2.y,
            z: vector1.z + vector2.z,
            w: vector1.w + vector2.w }
        )
    }

    scale(value) {
        this.x *= value;
        this.y *= value;
        this.z *= value;
        this.w *= value;
        return this;
    }

    length(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
    }

    normalize(){
        let magnitude = this.length();
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;

        return this;
    }

    static scale(vector1, value) {
        return new Vector({
            x: vector1.x * value,
            y: vector1.y * value,
            z: vector1.z * value,
            w: vector1.w * value }
        )
    }

    static scalarProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z + vector1.w * vector2.w;
    }


}