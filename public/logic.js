class Logic {
    // Scenario
    #camera;
    #rocket; #objects = [];
    #simRocket = null; #simObjects = [];
    #rocketCode;

    // Simulation State
    #timestep = 16;
    #lastUpdate = 0;
    #updatesPerFrame = 1;
    #running = false;

    // Physics
    #gravityConstant = 0.0674;

    constructor(scenario, resX, resY) {
        for (const dict of scenario["objects"]) { // Loading the objects from json
            const object = new Thingy(new Vector2(dict.position.x, dict.position.y), dict.radius, dict.mass, "assets/textures/" + dict.texture, dict.target);
            this.#objects.push(object);
        }

        const dict = scenario["rocket"];
        this.#rocket = new Rocket(new Vector2(dict.position.x, dict.position.y), scenario["rocket"].fuel);

        this.#camera = new Camera(resX, resY);
    }

    Update(timestamp) {
        if (timestamp - this.#lastUpdate < this.#timestep) { return; } // Early exit
        this.#lastUpdate = timestamp;

        if (!this.#running) { return; } // Early exit
        
        // Run simulator program
        Transpile(this.#rocketCode, this.#rocket);

        // Calculate physics (gravitational force and collisions)
        const objects = this.thingys;
        for (let iteration = 0; iteration < this.#updatesPerFrame; iteration++) {
            for (const object of objects) {
                object.relocate(); // Update position of object
                for (let index = objects.indexOf(object); index < objects.length; index++) {
                    if (objects[index] != object) {

                        // Localize the two objects
                        let object1 = object;
                        let object2 = objects[index];

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

        this.#camera.position = this.#simRocket.position;
    }

    Simulate() {
        for (let object of this.#objects) { // Create new cloned instances
            this.#simObjects.push(Thingy.clone(object));
        }
        this.#simRocket = Rocket.clone(this.#rocket);
        this.#running = true;
    }

    Quit() {
        this.#running = false;
        this.#simObjects = [];
        this.#simRocket = null;
    }

    get thingys() { // Grab the objects currently meant to be rendered
        let thingys = [];
        if (this.#running) { // Use simulation objects
            for (const object of this.#simObjects) {
                thingys.push(object);
            }
            thingys.push(this.#simRocket);
        }
        else { // Use actual objects
            for (const object of this.#objects) {
                thingys.push(object);
            }
            thingys.push(this.#rocket);
        }
        return thingys;
    }

    get camera() { return this.#camera; }
    get running() { return this.#running; }
    get rocketCode() { return this.#rocketCode; }
    set rocketCode(value) { this.#rocketCode = value; }
}

class Thingy { // Everything set up in the scenario
    position; rotation;
    velocity; acceleration;

    model; texture;
    radius; mass;

    target;

    constructor(position, radius, mass, texture, target = false) {
        this.position = position;
        this.radius = radius;
        this.mass = mass;
        this.texture = texture;
        this.target = target;

        this.model = "assets/models/planet.json";
        this.rotation = 90;
        this.velocity = new Vector2();
        this.acceleration = new Vector2();

        CreateRenderer(this);
    }

    relocate() { // Relocates the thingy
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    impulse(force) { // Takes a vector for force
        this.velocity.x += force.x / this.mass;
        this.velocity.y += force.y / this.mass;
    }

    static clone(object) {
        let clone = new Thingy(object.position.clone, object.radius, object.mass, object.texture);
        return clone;
    }
}

class Rocket extends Thingy { // User controlled object
    fuel; thrust;
    #left; #right;

    constructor(position, fuel) {
        super(position, 1, 1); // Radius is 1 and mass is 1
        this.fuel = fuel;
        this.thrust = 1; // Maximum thrust power
        this.left = 0; this.right = 0;

        this.texture = "assets/textures/rocket.png";
        this.model = "assets/models/rocket.json";

        CreateRenderer(this);
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
        const radians = this.rotation * (Math.PI / 180);
        const leftThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#left / 100));
        const rightThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#right / 100));
        this.acceleration = leftThrust.add(rightThrust).divide(this.mass);
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // Calculate and apply torque (currently using arbitrary constant 10)
        this.rotation -= 10 * (this.#left / 100);
        this.rotation += 10 * (this.#right / 100);

        // Calculate fuel consumption
        this.fuel -= ((this.#left / 100) * 0.1 + (this.#right / 100) * 0.1);
        console.log(this.fuel)
    }

    static clone(rocket) {
        let clone = new Rocket(rocket.position.clone, rocket.fuel);
        return clone;
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

    divide(factor) { return new Vector2(this.x / factor, this.y / factor); }

    distance(vector) { return Math.sqrt((this.x - vector.x) ** 2 + (this.y - vector.y) ** 2); }

    get magnitude() { return Math.sqrt(this.x ** 2 + this.y ** 2); }
    get normalized() { return new Vector2(-this.y, this.x).unit; }

    get unit() {
        if (this.magnitude == 0) { return new Vector2(); }
        return new Vector2(this.x / this.magnitude, this.y / this.magnitude);
    }

    get clone() { return new Vector2(this.x, this.y); }

    static dot(vector1, vector2) { return vector1.x * vector2.x + vector1.y * vector2.y; }
}