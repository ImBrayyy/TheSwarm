class Goal {
    constructor(x,y,radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    show() {
        fill(255,255,0);
        ellipse(this.x,this.y,this.radius);
    }
}