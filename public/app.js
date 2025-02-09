// Simulation Window and Logic
let canvas; let gl; let logic; let frame;

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
            [{"mass" : 10, "position" : {"x" : -10, "y" : 50 }, "radius" : 2, "texture" : "moon.png"}], 
        "rocket" : 
            {"position" : {"x" : 0, "y" : 0}, "fuel" : 50}
    }
    // FETCH PLEASE

    logic = new Logic(scenario, canvas.width, canvas.height);

    // Begin rendering
    RenderFrame();

    document.getElementById("play").onclick = SimulationMode;
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

window.onload = init;