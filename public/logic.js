class Logic {
    // Scenario
    #camera;
    #rocket; #objects = [];
    #simRocket = null; #simObjects = [];
    #rocketCode = ""; #target = null;
    #rocketCode = ""; #target = null;

    // Simulation State
    #timestep = 16;
    #lastUpdate = 0;
    #updatesPerFrame = 1;
    #running = false;

    // Physics
    #gravityConstant = 0.0674;
    #gravityConstant = 0.0674;

    constructor(scenario, resX, resY) {
        for (const dict of scenario["objects"]) { // Loading the objects from json
            const object = new Thingy(new Vector2(dict.position.x, dict.position.y), dict.radius, dict.mass, "assets/textures/" + dict.texture, dict.target);
            const object = new Thingy(new Vector2(dict.position.x, dict.position.y), dict.radius, dict.mass, "assets/textures/" + dict.texture, dict.target);
            this.#objects.push(object);
        }

        const dict = scenario["rocket"];
        this.#rocket = new Rocket(new Vector2(dict.position.x, dict.position.y), scenario["rocket"].fuel);
        const dict = scenario["rocket"];
        this.#rocket = new Rocket(new Vector2(dict.position.x, dict.position.y), scenario["rocket"].fuel);
        this.#camera = new Camera(resX, resY);
        this.#camera.position = this.#rocket.position.clone;
        this.#camera.position = this.#rocket.position.clone;
    }

    Update(timestamp) {
        if (timestamp - this.#lastUpdate < this.#timestep) { return; } // Early exit
        this.#lastUpdate = timestamp;

        if (!this.#running) { return; } // Early exit
        
        // Run simulator program
        Transpile(this.#rocketCode, this.#simRocket, this.#target);

        // Calculate physics (gravitational force and collisions)
        // Run simulator program
        Transpile(this.#rocketCode, this.#simRocket, this.#target);

        // Calculate physics (gravitational force and collisions)
        const objects = this.thingys;
        for (let iteration = 0; iteration < this.#updatesPerFrame; iteration++) {
            for (const object of objects) {
                object.relocate(); // Update position of object
                for (let index = objects.indexOf(object); index < objects.length; index++) {
                    if (objects[index] != object && !object.exploded && !objects[index].exploded) {

                        // Localize the two objects
                        const object1 = object;
                        const object2 = objects[index];

                        // Find distance between the two objects
                        let distance = object1.position.distance(object2.position);
                        // Find distance between the two objects
                        let distance = object1.position.distance(object2.position);

                        // Apply gravitational force (G * (m1 * m2) / r^2)
                        const force = this.#gravityConstant * (object1.mass * object2.mass) / (distance ** 2);

                        // Apply forces to the two objects
                        object1.impulse(object2.position.subtract(object1.position).divide(distance).multiply(force));
                        object2.impulse(object1.position.subtract(object2.position).divide(distance).multiply(force));

                        // Calculate collisions
                        if (distance < (object1.radius + object2.radius)) {
                            let explosion = false; const max = 0.1;
                            if (object1.mass < object2.mass && Math.abs(object1.velocity.x) + Math.abs(object1.velocity.y) > max) { object1.exploded = true; explosion = true; }
                            else if (object1.mass > object2.mass && Math.abs(object2.velocity.x) + Math.abs(object2.velocity.y) > max) { object2.exploded = true; explosion = true; }
                            else if (Math.abs(object1.velocity.x) + Math.abs(object1.velocity.y) > max || distance == 0) { object1.exploded = true; object2.exploded = true; explosion = true; }

                            let ourBoy = null; let notOurBoy = null;
                            if (object1 == this.#simRocket) { ourBoy = object1.position; notOurBoy = object2.position; }
                            else if (object2 == this.#simRocket) { ourBoy = object2.position; notOurBoy = object1.position; }
                            if (ourBoy != null) { // Rocket specific collision
                                const normalAngle = Math.atan((notOurBoy.y - ourBoy.y) / (notOurBoy.x - ourBoy.x)) * (180 / Math.PI);
                                console.log(normalAngle)
                                if (Math.abs(normalAngle - this.#simRocket.rotation) > 30) { // Crashed (not around 90)
                                    //this.#simRocket.exploded = true;
                                    //explosion = true;
                                }
                            }

                            if (explosion) { AudioSource("explosion.mp3"); }
                            else { // Push back
                                while (distance < (object1.radius + object2.radius)**2) {
                                    if (object1.mass < object2.mass) {
                                        object1.position = object1.position.add(object1.position.subtract(object2.position).multiply(0.0001));
                                        object1.velocity = new Vector2();
                                    }
                                    else if (object1.mass > object2.mass) {
                                        object2.position = object2.position.add(object2.position.subtract(object1.position).multiply(0.0001));
                                        object2.velocity = new Vector2();
                                    }
                                    else {
                                        object1.position = object1.position.add(object1.position.subtract(object2.position).unit.multiply(0.00005));
                                        object2.position = object2.position.add(object2.position.subtract(object1.position).unit.multiply(0.00005));
                                        object1.velocity = new Vector2(); object2.velocity = new Vector2();
                                    }

                                    distance = (object1.position.x - object2.position.x)**2;
                                    distance += ((object1.position.y - object2.position.y)**2);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    Simulate() {
        for (let object of this.#objects) { // Create new cloned instances
            const clone = Thingy.clone(object);
            if (clone.target) { this.#target = clone; }
            this.#simObjects.push(clone);
            const clone = Thingy.clone(object);
            if (clone.target) { this.#target = clone; }
            this.#simObjects.push(clone);
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
    get rocket() {
        if (this.#running) { return this.#simRocket; }
        else { return this.#rocket; }
    }
    get running() { return this.#running; }
    get rocketCode() { return this.#rocketCode; }
    set rocketCode(value) { this.#rocketCode = value; }
}

class Thingy { // Everything set up in the scenario
    position; rotation;
    velocity; acceleration;

    model; texture;
    radius; mass;

    exploded;
    target;

    constructor(position, radius, mass, texture, target = false) {
        this.position = position;
        this.radius = radius;
        this.mass = mass;
        this.texture = texture;
        this.target = target;
        this.texture = texture;
        this.target = target;

        this.model = "assets/models/planet.json";
        this.rotation = 90;
        this.rotation = 90;
        this.velocity = new Vector2();
        this.acceleration = new Vector2();
        this.exploded = false;

        CreateRenderer(this);
    }

    relocate() { // Relocates the thingy
        if (this.exploded) { return; }
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
    }

    impulse(force) { // Takes a vector for force
        this.velocity.x += force.x / this.mass;
        this.velocity.y += force.y / this.mass;
    }

    impulse(force) { // Takes a vector for force
        this.velocity.x += force.x / this.mass;
        this.velocity.y += force.y / this.mass;
    }

    static clone(object) {
        let clone = new Thingy(object.position.clone, object.radius, object.mass, object.texture, object.target);
        let clone = new Thingy(object.position.clone, object.radius, object.mass, object.texture, object.target);
        return clone;
    }
}

class Rocket extends Thingy { // User controlled object
    fuel; thrust;
    #left; #right;

    constructor(position, fuel) {
        super(position, 1, 1); // Radius is 1 and mass is 1
        super(position, 1, 1); // Radius is 1 and mass is 1
        this.fuel = fuel;
        this.thrust = 0.01; // Maximum thrust power
        this.left = 0; this.right = 0;
        this.texture = "assets/textures/rocket.png";
        this.model = "assets/models/rocket.json";

        CreateRenderer(this);
        this.texture = "assets/textures/rocket.png";
        this.model = "assets/models/rocket.json";

        CreateRenderer(this);
    }

    get left() { return this.#left; }
    get left() { return this.#left; }
    set left(value) {
        this.#left = value;
        if (this.#left < -100) { this.#left = -100; }
        else if (this.#left > 100) { this.#left = 100; }
    }

    get right() { return this.#right; }
    get right() { return this.#right; }
    set right(value) {
        this.#right = value;
        if (this.#right < -100) { this.#right = -100; }
        else if (this.#right > 100) { this.#right = 100; }
    }

    relocate() {
        // Calculate thrust power and apply force ------------------------------------ ACCOUNT FOR MASS IN THRUST FORCE
        if (this.exploded) { return; }
        const radians = this.rotation * (Math.PI / 180);
        const leftThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#left / 100));
        const rightThrust = new Vector2(Math.cos(radians), Math.sin(radians)).multiply(this.thrust * (this.#right / 100));
        this.acceleration = leftThrust.add(rightThrust).divide(this.mass);
        this.acceleration = leftThrust.add(rightThrust).divide(this.mass);
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // Calculate and apply torque (currently using arbitrary constant 3)
        this.rotation -= 3 * (this.#left / 100);
        this.rotation += 3 * (this.#right / 100);

        // Calculate fuel consumption
        this.fuel -= ((this.#left / 100) * 0.1 + (this.#right / 100) * 0.1);
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