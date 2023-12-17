class Population {
    constructor(populationCount,goal) {
        this.dots = [];
        for(let i = 0; i < populationCount; i++) {
            this.dots[i] = new Dot(5, goal);
        }

        this.fitnessSum = 0;

        this.generation = 1;

    }

    show() {
        for(let i = 0; i < this.dots.length; i++) {
            this.dots[i].show();
        }
    }


    update() {
        for(let i = 0; i < this.dots.length; i++) {
            this.dots[i].update();

        }
    }

    checkCollisionWithWalls(walls) {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].checkCollisionsWithWalls(walls);
        }
    }



    getCompletionCount() {
        const reachedGoalCount = this.dots.reduce((count, dot) => {
            return count + (dot.reachedGoal ? 1 : 0);
        }, 0);
    
        return reachedGoalCount;
    }
    



    allDotsDead() {
        for(let i = 0; i < this.dots.length; i++) {
            if(!this.dots[i].dead && !this.dots[i].reachedGoal) {
                return false;
            }
        }
        return true;
    }

    normalize() {
        let sum = 0;
        for(let i = 0; i<this.dots.length; i++) {
            sum += this.dots[i].fitness;
        }
        for(let i = 0; i<this.dots.length; i++) {
            this.dots[i].prob = (this.dots[i].fitness / sum);
        }
    }

    pickOne() {
        let index = 0;
        let rand = random();
        while (rand > 0) {
            rand = rand - this.dots[index].prob;
            index++;
        }

        index--;
        return this.dots[index];
    }

    crossover(parent1, parent2) {
        // Create two empty child dots
        let child1 = new Dot(parent1.radius, parent1.goal);
        let child2 = new Dot(parent2.radius, parent2.goal);
    
        // Choose a random crossover point
        let crossoverPoint = floor(random(parent1.brain.directions.length));
    
        // Combine the brain directions of parents to create children's brains
        child1.brain.directions = parent1.brain.directions.slice(0, crossoverPoint)
            .concat(parent2.brain.directions.slice(crossoverPoint));
        
        child2.brain.directions = parent2.brain.directions.slice(0, crossoverPoint)
            .concat(parent1.brain.directions.slice(crossoverPoint));
    
        return [child1, child2];
    }
    



    calculateFitness() {
        for(let i = 0; i<this.dots.length; i++) {
            this.dots[i].calculateFitness()
        }
    }


    selection() {
        this.normalize();

        let newPopulation = [];

        for (let i = 0; i < this.dots.length; i += 2) {
            const parent1 = this.pickOne();
            const parent2 = this.pickOne();

            const [child1, child2] = this.crossover(parent1, parent2);

            let mutationRate = 0.05
            if(parent1.reachedGoal || parent2.reachedGoal) {
                mutationRate = 0.00000;
            }

            const mutatedChild1 = this.mutate(child1,mutationRate);
            const mutatedChild2 = this.mutate(child2,mutationRate);

            newPopulation.push(mutatedChild1, mutatedChild2);
        }

        this.dots = newPopulation;
    }

    mutate(child,mutationRate) {
        // Probability of mutation

        // Check if the dot has reached the goal, and set mutationRate to 0 if true

        // Mutate the brain directions with a probability of mutationRate
        for (let i = 0; i < child.brain.directions.length; i++) {
            if (random() < mutationRate) {
                // Create a new random vector for mutation
                let randomVector = p5.Vector.random2D();
                child.brain.directions[i] = randomVector;
            }
        }

        return child;
    }



    
}