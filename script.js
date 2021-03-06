const divCanvas = document.querySelector("#canvas");
const inputRes = document.querySelector("#resolutionPicker");
const inputColorPicker = document.querySelector("#colorPicker");
const btnClear = document.querySelector("#btnClear");
const btnEraser = document.querySelector("#btnEraser");
const btnRgb = document.querySelector("#btnRgb");
const btnRainbow = document.querySelector("#btnRainbow");
const selectBrushType = document.querySelector("#brushstroke");

const Brushes = {
    color: "color",
    eraser: "eraser",
    rgb: "rgb",
    rainbow: "rainbow"
};

const BrushType = {
    continuous: "continuous",
    click: "click",
    toggle: "toggle"
};

let eventType = "mouseenter";
let brushStroke = BrushType.toggle;
let colorPickerColor = randomColor();
inputColorPicker.value = colorPickerColor;
let currentColor = "";
let currentHue = 0;
let currentBrush = Brushes.color;
let previousBrush = Brushes.color; 
changeBrush(Brushes.color);
let resolution = parseInt(inputRes.value);

btnEraser.addEventListener("click", (e) => {
    if (currentBrush != Brushes.eraser) {
        changeBrush(Brushes.eraser);
        return;
    } 
    changeBrush(previousBrush);
});

btnRgb.addEventListener("click", (e) => {
    if (currentBrush != Brushes.rgb) {
        changeBrush(Brushes.rgb);
        return;
    }
    changeBrush(Brushes.color);
});

btnRainbow.addEventListener("click", (e) => {
    if (currentBrush != Brushes.rainbow) {
        changeBrush(Brushes.rainbow);
    }
});

btnClear.addEventListener("click", (e) => {
    clearCanvas();
});

inputColorPicker.addEventListener("change", (e) => {
    colorPickerColor = e.target.value;
    changeBrush(Brushes.color);
});

inputRes.addEventListener('change', updateCanvasSize);

selectBrushType.addEventListener("change", (e) => {
    if (e.target.value === "continuous") {
        brushStroke = BrushType.continuous;
        eventType = "mouseenter";
    }
    if (e.target.value === "click") {
        brushStroke = BrushType.click;
        eventType = "click";
    }
    if (e.target.value === "toggle") {
        brushStroke = BrushType.toggle;
    }
    updatePixelEvents();
});

divCanvas.addEventListener('click', (e) => {
    console.log("click canvas")
    if (brushStroke === BrushType.toggle) {
        eventType = toggleBrushType(eventType);
        updatePixelEvents();
    }
});

function updatePixelEvents() {
    divCanvas.childNodes.forEach(element => {
        element.removeEventListener("click", paintPixel);
        element.removeEventListener("mouseenter", paintPixel);
        element.addEventListener(eventType, paintPixel);
    });
}

function toggleBrushType(eventType) {
    return eventType === "mouseenter" ? "click" : "mouseenter";
}

function changeBrush(brush) {
    previousBrush = currentBrush;
    currentBrush = brush;
    btnEraser.style.backgroundColor = "#007CC7";
    btnRgb.style.backgroundColor = "#007CC7";
    btnRainbow.style.backgroundColor = "#007CC7";
    inputColorPicker.style.backgroundColor = "#007CC7";

    if (brush === Brushes.color) {
        currentColor = colorPickerColor;
        inputColorPicker.style.backgroundColor = "#203647";
    }

    if (brush === Brushes.eraser) {
        currentColor = "white";
        btnEraser.style.backgroundColor = "#203647";
    }

    if (brush === Brushes.rgb) {
        currentColor = randomColor();
        btnRgb.style.backgroundColor = "#203647";
    }

    if (brush === Brushes.rainbow) {
        currentColor = "hsl(" + currentHue + ", 100%, 50%)";
        btnRainbow.style.backgroundColor = "#203647";
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (++max - min) + min);
}

function randomHex(length) {
    let hex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
    let out = "";
    for (let i = 0; i < length; i++) {
        out += hex[randomNumber(0, 15)];
    }
    return out;
}

function randomColor() {
    return "#" +  randomHex(6);
}

function updateCanvasSize(e) {
    deleteCanvas();
    createCanvas(parseInt(e.srcElement.value))
}

function rainbowColor(hue, step) {
    return (hue + step) % 360;
}

function clearCanvas() {
    divCanvas.childNodes.forEach(element => {
        element.style.backgroundColor = "white";
    });
}

function deleteCanvas() {
    divCanvas.replaceChildren();
}

function createCanvas(size) {
    deleteCanvas() // removes text element in the canvas
    let repeat = "repeat(" + size + ", 1fr)";
    divCanvas.style.gridTemplateColumns = repeat;
    divCanvas.style.gridTemplateRows = repeat;
    for (let i = 0; i < size**2; i++) {
        let pixel = document.createElement("div");
        pixel.className = "pixel"
        pixel.addEventListener(eventType, paintPixel);
        divCanvas.appendChild(pixel);        
    }
}

function paintPixel(pixel) {
    pixel.target.style.backgroundColor = currentColor;
    if (currentBrush === Brushes.rgb) {
        currentColor = randomColor();
        return;
    }
    if (currentBrush === Brushes.rainbow) {
        currentHue = rainbowColor(currentHue, 1);
        currentColor = "hsl(" + currentHue + ", 100%, 50%)";
    }
}

createCanvas(resolution);