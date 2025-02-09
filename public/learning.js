class QLearningAgent {
    constructor(actions, learningRate = 0.1, discountFactor = 0.9, explorationRate = 0.1) {
        this.qTable = new Map();
        this.actions = actions;
        this.learningRate = learningRate;
        this.discountFactor = discountFactor;
        this.explorationRate = explorationRate;
    }

    getState(rocket) {
        let x = Math.round(rocket.position.x);
        let y = Math.round(rocket.position.y);
        let vx = Math.round(rocket.velocity.x);
        let vy = Math.round(rocket.velocity.y);
        let rotation = Math.round(rocket.rotation);
        return `${x},${y},${vx},${vy},${rotation}`;
    }

    getAction(state) {
        if (Math.random() < this.explorationRate || !this.qTable.has(state)) {
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        }

        let bestAction = this.actions[0];
        let maxQValue = this.qTable.get(state)[bestAction] || 0;

        for (let action of this.actions) {
            let qValue = this.qTable.get(state)[action] || 0;
            if (qValue > maxQValue) {
                maxQValue = qValue;
                bestAction = action;
            }
        }

        return bestAction;
    }

    updateQTable(state, action, reward, nextState) {
        if (!this.qTable.has(state)) {
            this.qTable.set(state, this._initializeQValues());
        }
        if (!this.qTable.has(nextState)) {
            this.qTable.set(nextState, this._initializeQValues());
        }

        let oldQ = this.qTable.get(state)[action] || 0;
        let maxFutureQ = Math.max(...Object.values(this.qTable.get(nextState)));
        let newQ = oldQ + this.learningRate * (reward + this.discountFactor * maxFutureQ - oldQ);

        this.qTable.get(state)[action] = newQ;
    }

    _initializeQValues() {
        let qValues = {};
        for (let action of this.actions) {
            qValues[action] = 0;
        }
        return qValues;
    }
}

class RocketController {
    constructor(rocket) {
        this.rocket = rocket;
        this.actions = [
            { left: -10, right: 10 },
            { left: 10, right: -10 },
            { left: 0, right: 10 },
            { left: 10, right: 0 },
            { left: 0, right: 0 }
        ];
        this.agent = new QLearningAgent(this.actions);
    }

    controlRocket() {
        if (!this.rocket.useQLearning) return;

        let state = this.agent.getState(this.rocket);
        let action = this.agent.getAction(state);

        this.rocket.left = action.left;
        this.rocket.right = action.right;
    }

    rewardFunction() {
        return -Math.abs(this.rocket.velocity.x) - Math.abs(this.rocket.velocity.y);
    }

    updateLearning() {
        if (!this.rocket.useQLearning) return;
        
        let state = this.agent.getState(this.rocket);
        let reward = this.rewardFunction();
        
        this.controlRocket();

        let nextState = this.agent.getState(this.rocket);
        this.agent.updateQTable(state, { left: this.rocket.left, right: this.rocket.right }, reward, nextState);
    }
}
