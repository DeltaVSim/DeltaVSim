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

    // FETCH JSON SCENARIO
    const scenario = {
        "objects" : 
            [{"mass" : 1, "position" : {"x" : 100, "y" : 100 }, "radius" : 2, "texture" : "moon.png", "target": true}], 
        "rocket" : 
            {"position" : {"x" : 0, "y" : 0}, "fuel" : 50}
    }
    // FETCH PLEASE

    logic = new Logic(scenario, canvas.width, canvas.height);

    // Begin rendering
    RenderFrame();

    document.getElementById("play").onclick = SimulationMode;
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
    if (logic && !logic.running && mouseDown) {
        logic.camera.position = logic.camera.position.add(new Vector2(-event.movementX / moveScalar, event.movementY / moveScalar));
    }
}

window.onload = () => {
    init(); brython();
};