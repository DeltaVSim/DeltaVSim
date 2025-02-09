// Simulation Window and Logic
let canvas; let gl; let logic; let frame; let mouseDown = false;

async function init() {

    // Canvas and GL
    canvas = document.getElementById("canvas");
    gl = canvas.getContext('webgl2', {antialias: true, powerPreference: "high-performance"});
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Generate shaders and frame method
    frame = CreateShaders(canvas, gl);

    // Fetch scenario
    let scenario; const params = new URLSearchParams(document.location.search);
    await fetch("/getLevel", {
        method: "POST", headers: { "Content-type": "application/json" },
        body: JSON.stringify({
            level: params.get("level")
        })
    }).then((res) => res.json()).then((res) => scenario = res);

    // Create logic
    logic = new Logic(scenario, canvas.width, canvas.height);

    // Load saved program
    if (localStorage.getItem("pidCode") != null) {
        logic.rocketCode = localStorage.getItem("pidCode");
        document.getElementById("ide").value = logic.rocketCode;
    }

    // Begin rendering
    RenderFrame();

    document.getElementById("play").onclick = SimulationMode;
    document.getElementById("ide").oninput = () => {
        logic.rocketCode = document.getElementById("ide").value;
        localStorage.setItem("pidCode", logic.rocketCode);
    }

    window.onkeydown = (event) => {
        if (event.key == "a") { logic.rocket.left = 100; }
        if (event.key == "d") { logic.rocket.right = 100; }
    }
    window.onkeyup = (event) => {
        if (event.key == "a") { logic.rocket.left = 0; }
        if (event.key == "d") { logic.rocket.right = 0; }
    }
    document.getElementById("ide").oninput = () => {
        logic.rocketCode = document.getElementById("ide").value;
    }
}

function SimulationMode() { // Begin simulation
    if (!logic.running) {
        console.log("Starting Simulation");
        logic.Simulate(); // Begin simulation in logic
    }
    else { // End simulation
        console.log("Ending Simulation");
        logic.Quit(); // Quit simulation in logic
    }
}

function RenderFrame(timestamp) {
    logic.Update(timestamp);
    frame(logic.camera, logic.thingys);
    requestAnimationFrame(RenderFrame);
}

document.getElementById("canvas").onmousedown = () => { mouseDown = true; }
document.getElementById("canvas").onmouseup = () => { mouseDown = false; }

const moveScalar = 20;
window.onmousemove = (event) => {
    if (logic && mouseDown) {
        logic.camera.position = logic.camera.position.add(new Vector2(-event.movementX / moveScalar, event.movementY / moveScalar));
    }
}

window.onload = () => {
    init(); brython();
};