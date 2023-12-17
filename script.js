let population;
let goal;
let walls = [];
let populationCount = 1000;
let wallInProgress;

function setup() {
    let canvas = createCanvas(500, 700);
    canvas.parent("canvasContainer");

    
    initializeObjects();
}

function initializeObjects() {
    goal = new Goal(width / 2, 10, 50);

    if (wallInProgress) {
        wallInProgress = new Wall(wallInProgress.x, wallInProgress.y, wallInProgress.width, wallInProgress.height);
    }

    if (population) {
        population.goal = goal; // Update the goal for the population
    }
}

function draw() {
    background(0);
    goal.show();

    for (let i = 0; i < walls.length; i++) {
        walls[i].show();
    }

    if (wallInProgress) {
        wallInProgress.show();
    }
    if (population) {
        if (population.allDotsDead()) {
            population.generation++;
            document.getElementById("generation").innerHTML = `Generation: ${population.generation}`;
            document.getElementById("completionCount").innerHTML = `Completion Count Of Last Gen: ${population.getCompletionCount()}`;
            population.calculateFitness();
            population.selection();
        } else {
            population.checkCollisionWithWalls(walls);
            population.show();
            population.update();
        }
    }
}

function mousePressed() {
    // Start creating a new wall
    wallInProgress = new Wall(mouseX, mouseY, mouseX, mouseY);
}

function mouseDragged() {
    // Update the dimensions of the wall as the user drags the mouse
    if (wallInProgress) {
        // Check if the Shift key is being held down
        if (keyIsDown(SHIFT)) {
            // Adjust the width and height to make the aspect ratio 1:1
            let deltaX = mouseX - wallInProgress.x;
            let deltaY = mouseY - wallInProgress.y;

            if (abs(deltaX) > abs(deltaY)) {
                wallInProgress.width = deltaX;
                wallInProgress.height = deltaX;
            } else {
                wallInProgress.width = deltaY;
                wallInProgress.height = deltaY;
            }
        } else {
            // Ensure correct width and height regardless of drag direction
            wallInProgress.width = mouseX - wallInProgress.x;
            wallInProgress.height = mouseY - wallInProgress.y;
        }
    }
}

function mouseReleased() {
    // Finish creating the wall and add it to the array
    // Adjust the position if dragging from right to left
    if (wallInProgress.width < 0) {
        wallInProgress.x = mouseX;
        wallInProgress.width *= -1; // Make width positive
    }

    if (wallInProgress.height < 0) {
        wallInProgress.y = mouseY;
        wallInProgress.height *= -1; // Make height positive
    }

    if (wallInProgress) {
        walls.push(wallInProgress);
        wallInProgress = null;
    }
}

function keyPressed() {
    switch (keyCode) {
        case 32: //space bar
            population = new Population(populationCount, goal);
            break;
        case 85: //U key
            walls.pop();
            break;
    }
}

function windowResized() {
    // Resize the canvas while maintaining the aspect ratio
    let newWidth = min(windowWidth * 0.7, windowHeight * 0.7 * (width / height));
    let newHeight = newWidth * (height / width);
    resizeCanvas(newWidth, newHeight);

    // Readjust the position and dimensions of each wall
    for (let i = 0; i < walls.length; i++) {
        walls[i].x *= newWidth / width;
        walls[i].y *= newHeight / height;
        walls[i].width *= newWidth / width;
        walls[i].height *= newHeight / height;
    }

    initializeObjects(); // Recreate objects when the window is resized
}
windowResized()