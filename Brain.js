class Brain {
    constructor(size) {
        this.directions = new Array(size);
        this.step = 0;
        this.randomize();
    }

    randomize() {
        for (let i = 0; i < this.directions.length; i++) {
            let randomAngle = random(2 * PI);
            this.directions[i] = p5.Vector.fromAngle(randomAngle);
        }
    }
}