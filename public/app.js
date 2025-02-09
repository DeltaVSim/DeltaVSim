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
            [{"mass" : 1000, "position" : {"x" : -700, "y" : -300 }, "radius" : 100, "model" : "earth.json"}, 
            {"mass" : 10 , "position" : {"x" : -300, "y" : 200 }, "radius" : 12, "model" : "moon.json"}, 
            {"mass" : 2 , "position" : {"x" : 0, "y" : -200 }, "radius" : 10, "model" : "asteroid.json"},
            {"mass" : 1.7 , "position" : {"x" : -200, "y" : 250 }, "radius" : 5, "model" : "asteroid.json"},
            {"mass" : 2.1 , "position" : {"x" : 300, "y" : 300 }, "radius" : 7, "model" : "asteroid.json"}], 
    
        "rocket" : 
            [{"position" : {"x" : -700, "y" : -200}, "fuel" : 50}]
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

function Random(min, max) { // Inclusive, exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

function AudioSource(source) { // Creates an audio element for playing sound effects
    let audio = document.createElement("AUDIO");
    audio.src = "assets/" + source;
    audio.type = 'audio/mpeg';
    audio.loop = false;
    audio.volume = 1;
    audio.autoplay = true;
    document.body.appendChild(audio);
    setTimeout(function (element) {
        if (!audio.paused) { // Still playing, so wait until it is done
            setTimeout(function (element) { element.remove(); }, element.duration * 1000, element);
        }
        else { element.remove(); }
    }, 1000, audio); // Wait one second before checking if it finished playing (Due to load times)
}

window.onload = init;