export class Point {
    constructor(x=0, y=0, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    convertCartesian(width, height, side) {
        // x belongs to [-1; 1]   | add 1
        // x belongs to [0; 2]    | divide by 2
        // x belongs ot [0; 1]    | divide by width/height to shrink interval

        let new_x = (this.x + 1) / 2 * width - side / 2;
        let new_y = (1 - (this.y + 1) / 2) * height - side / 2;

        return new Point(new_x, new_y);
    }

    project() {
        let projected_x = this.x / this.z;
        let projected_y = this.y / this.z;

        return new Point(projected_x, projected_y, this.z);
    }



}