
class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    show() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.width, this.height);
    }
}