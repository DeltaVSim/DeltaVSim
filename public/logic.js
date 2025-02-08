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

class Object { // Everything set up in the scenario
    position; rotation;
    velocity; acceleration;
    
    radius; mass;

    constructor(position, radius, mass) {
        this.position = position;
        this.radius = radius;
        this.mass = mass;

        this.rotation = 0;
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
    }

    relocate() {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }
}

class Rocket extends Object { // User controlled object
    fuel; thrust;
    #left; #right;

    constructor(position, radius, fuel) {
        super(position, radius, 1); // Mass of the rocket is 1
        this.fuel = fuel;
        this.left = 0; this.right = 0;
    }

    set left(value) {
        this.#left = value;
        if (this.#left < -100) { this.#left = -100; }
        else if (this.#left > 100) { this.#left = 100; }
    }

    set right(value) {
        this.#right = value;
        if (this.#right < -100) { this.#right = -100; }
        else if (this.#right > 100) { this.#right = 100; }
    }

    relocate() {
        // Calculate thrust power and apply force ------------------------------------ ACCOUNT FOR MASS IN THRUST FORCE
        const radians = this.angle * (Math.PI / 180);
        const leftThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#left / 100));
        const rightThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#right / 100));
        this.acceleration = leftThrust.add(rightThrust);
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // Calculate and apply torque (currently using arbitrary constant 10)
        this.rotation -= 10 * (this.#left / 100);
        this.rotation += 10 * (this.#right / 100);
    }
}

class Camera { // Viewport
    position;
    resolution;
    constructor(resX, resY) {
        this.position = new Vector2(0, 0);
        this.resolution = new Vector2(resX, resY);
    }
}

class Vector2 { // 2D Vectors
    x; y;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(vector) { return new Vector2(this.x + vector.x, this.y + vector.y); }

    subtract(vector) { return new Vector2(this.x - vector.x, this.y - vector.y); }

    multiply(factor) { return new Vector2(this.x * factor, this.y * factor); }

    get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
    get normalized() { return new Vector2(-this.y, this.x).unit; }

    get unit() {
        if (this.magnitude == 0) { return new Vector2(); }
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    static dot(vector1, vector2) { return vector1.x * vector2.x + vector1.y * vector2.y; }
}