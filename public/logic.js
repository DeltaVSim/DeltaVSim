class Logic {
    // Scenario
    #camera;
    #rocket;
    #objects = [];

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
        
        for (const object of this.#objects) {
            object.relocate(); // Update position of object
            for (let index = this.#objects.indexOf(object); index < this.#objects.length; index++) {
                if (this.#objects[index] != object) {

                    // Localize the two objects
                    let object1 = object;
                    let object2 = this.#objects[index];

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
}