class Dot {
    constructor(radius,goal) {
        this.radius = radius
        this.pos = createVector(width / 2, height-30);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.brain = new Brain(400);

        this.dead = false;
        this.reachedGoal = false;


        this.goal = goal;

        
        this.fitness = 0;
        this.prob = 0;
    }

    show() {

        fill(255, 255, 255, 0.6 * 255);  // Multiply by 255 to convert from [0, 1] to [0, 255]
        ellipse(this.pos.x, this.pos.y, this.radius);
    }

    move() {
        if (this.brain.directions.length > this.brain.step) {
            this.acc = this.brain.directions[this.brain.step];
            this.brain.step++;
        } else {
            this.dead = true
        }

        this.vel.add(this.acc);
        this.vel.limit(5);
        this.pos.add(this.vel);
    }

    update() {
        if(!this.dead && !this.reachedGoal) {
            this.move()
            if(this.pos.x < this.radius/2 || 
               this.pos.y < this.radius/2 ||
               this.pos.x > width - this.radius/2 ||
               this.pos.y > height - this.radius / 2
            ) {
                this.dead = true;
            } else if (dist(this.pos.x,this.pos.y,goal.x,goal.y) < goal.radius/2) {
                this.reachedGoal = true;
            }
        }
    }

    checkCollisionWithWall(wall) {
        // Ensure that this function works regardless of the direction of drag
        let wallRight = wall.x + wall.width;
        let wallBottom = wall.y + wall.height;
    
        return (
            this.pos.x + this.radius > wall.x &&
            this.pos.x - this.radius < wallRight &&
            this.pos.y + this.radius > wall.y &&
            this.pos.y - this.radius < wallBottom
        );
    }
    

    checkCollisionsWithWalls(walls) {
        for (let i = 0; i < walls.length; i++) {
            if (this.checkCollisionWithWall(walls[i])) {
                this.dead = true;
            }
        }
    }
    

    //------------------
    //GENETIC ALGORITHM STUFF
    // calculateFitness() {
    //     let distance = dist(this.pos.x,this.pos.y,goal.x,goal.y);
    //     this.fitness = 1 / (Math.pow(distance,2) + 0.001)
    // }
    

    setReachedGoal() {
        this.reachedGoal = true;
    }


    calculateFitness() {
        if(this.reachedGoal) {
            this.fitness = 0.001 + 10000/(Math.pow(this.brain.step),2)
        } else {
            let distance = dist(this.pos.x,this.pos.y,goal.x,goal.y);
            this.fitness = 1 / (Math.pow(distance,4) + 0.001)
        }

    }  
    
    
}