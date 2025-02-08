class Logic {
    constructor() {
        this.data = {
            fuel: 0,
            thrust: 0,
            force: 0,
            gravity: 0,
            over: false
        }
    }

    calculateForce(rocket) {
        m = rocket.getMass();
        g = this.getGravity();
        t = this.getThrust();
        w = m * g;
        this.data.force = t - w;
    }

    getForce() {
        return this.data.force;
    }

    setGravity(gravity) {
        this.data.gravity = gravity
    }

    getGravity() {
        return this.data.gravity;
    }

    setFuel(fuel) {
        this.data.fuel = fuel;
    }

    getFuel() {
        return this.data.fuel;
    }

    setThrust(thrust1, thrust2) {
        this.data.thrust = thrust1 + thrust2;
    }

    getThrust() {
        return this.data.thrust;
    }

    setOver(threshold, force) {
        if (Math.abs(force) > threshold) {
            this.data.over = true;
        } else {
            this.data.over = false;
        }
    }

    isOver() {
        return this.data.over;
    }
}