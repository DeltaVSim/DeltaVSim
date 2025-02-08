class Logic {
    // Scenario
    #camera;
    #rocket;
    #objects = [];
    #simulation = [];

    // Simulation State
    #timestep = 16;
    #lastUpdate = 0;
    #updatesPerFrame = 1;
    #running = false;

    // Physics
    #gravityConstant = 0.0000000000674;

    constructor(scenario, resX, resY) {
        this.#camera = new Camera(resX, resY);
    }

    Update(timestamp) {
        if (timestamp - this.#lastUpdate < this.#timestep) { return; } // Early exit
        this.#lastUpdate = timestamp;

        if (!this.#running) { return; } // Early exit
        
        for (const object of this.#simulation) {
            object.relocate(); // Update position of object
            for (let index = this.#simulation.indexOf(object); index < this.#simulation.length; index++) {
                if (this.#simulation[index] != object) {

                    // Localize the two objects
                    let object1 = object;
                    let object2 = this.#simulation[index];

                    // Find distance between the two objects
                    let distance = object1.position.distance(object2.position);

                    // Apply gravitational force (G * (m1 * m2) / r^2)
                    let force = this.#gravityConstant * (object1.mass * object2.mass) / (distance ** 2);

                    // Apply forces to the two objects
                    object1.impulse(object2.position.subtract(object1.position).divide(distance).multiply(force));
                    object2.impulse(object1.position.subtract(object2.position).divide(distance).multiply(force));
                }
            }
        }
    }

    Simulate() {
        for (let object of this.#objects) { // Create new cloned instances
            this.#simulation.push(Object.clone(object));
        }
        this.#running = true;
    }

    Quit() {
        this.#running = false;
        this.#simulation = [];
    }
}