const root = document.documentElement;

const secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();

const color = document.querySelector("#color");
const pen = document.querySelector("#pen");
const shade = document.querySelector("#shade");
const rainbow = document.querySelector("#rainbow");
const eraser = document.querySelector("#eraser");
const sliderLabel = document.querySelector("#slider-label");
const slider = document.querySelector("#slider");
const clear = document.querySelector("#clear");
const canvas = document.querySelector("#canvas");

let mouseDown = false;
let penColor = getComputedStyle(root).getPropertyValue('--text-color').trim();
let mode = "pen"

/**
 * Generates a random color in ROYGBIV.
 * 
 * @returns {string} - A random color.
 */
function randomColor() {
    switch (Math.floor(Math.random() * 7)) {
        case 0: return "red";
        case 1: return "orange";
        case 2: return "yellow";
        case 3: return "green";
        case 4: return "blue";
        case 5: return "indigo";
        case 6: return "violet";
    }
}

/**
 * Builds a blank canvas, attaching event listeners to each square to draw on.
 * 
 * @param {int} dimension - The number of squares on each side of the canvas.
 */
function buildCanvas(dimension) {
    let canvasSize = getComputedStyle(root).getPropertyValue('--canvas-size').trim();
    let pixelSize = canvasSize / dimension + "px";
    canvas.innerHTML = '';

    function draw(pixel) {
        if (mode == "pen") {
            pixel.style.backgroundColor = penColor;
            pixel.style.opacity = "1";
        } else if (mode == "shade") {
            if (pixel.style.backgroundColor == "rgb(255, 255, 255)") {
                pixel.style.opacity = "0";
            }
            let opacityValue = parseFloat(pixel.style.opacity);
            console.log(opacityValue);
            if (opacityValue < 1) {
                pixel.style.opacity = (opacityValue + 0.1).toString();
            }
            pixel.style.backgroundColor = penColor;
        } else if (mode == "rainbow") {
            pixel.style.backgroundColor = randomColor();
            pixel.style.opacity = "1";
        } else if (mode == "eraser") {
            pixel.style.backgroundColor = secondaryColor;
            pixel.style.opacity = "1";
        }
    }

    for (let i = 0; i < dimension * dimension; i++) {
        const pixel = document.createElement("div");

        pixel.style.backgroundColor = secondaryColor;
        pixel.style.width = pixelSize;
        pixel.style.height = pixelSize;

        pixel.addEventListener("mousedown", () => {
            draw(pixel);
        });

        pixel.addEventListener("mouseover", () => {
            if (mouseDown) {
                draw(pixel);
            }
        });

        canvas.appendChild(pixel)
    }
}

/**
 * Change pen color when color wheel has been selected.
 */
color.addEventListener("input", () => {
    penColor = color.value;
});

/**
 * Set mode to pen.
 */
pen.addEventListener("click", () => {
    mode = "pen";
    penColor = color.value;
});

/**
 * Set mode to shade.
 */
shade.addEventListener("click", () => {
    mode = "shade";
    penColor = color.value;
});

/**
 * Set mode to rainbow.
 */
rainbow.addEventListener("click", () => {
    mode = "rainbow";
});

/**
 * Set mode to eraser
 */
eraser.addEventListener("click", () => {
    mode = "eraser";
});

/**
 * Initialize new canvas when dimensions have been changed.
 */
slider.addEventListener("input", () => {
    sliderLabel.textContent = slider.value + " x " + slider.value;
    buildCanvas(slider.value);
});

/**
 * Reset canvas.
 */
clear.addEventListener("click", () => {
    const pixels = canvas.querySelectorAll("*");
    pixels.forEach(pixel => {
        pixel.style.backgroundColor = secondaryColor;
    });
});

/**
 * Set mouseDown to true when the mouse is down.
 */
document.addEventListener('mousedown', function() {
    mouseDown = true;
});

/**
 * Set mouseDown to false when the mouse is up.
 */
document.addEventListener('mouseup', function() {
    mouseDown = false;
});

/**
 * Reload the canvas when the size of the window has changed.
 */
window.addEventListener('resize', () => {
    const pixels = canvas.querySelectorAll("*");
    let canvasSize = getComputedStyle(root).getPropertyValue('--canvas-size').trim();
    pixels.forEach(pixel => {
        pixel.style.width = canvasSize / slider.value + "px";
        pixel.style.height = canvasSize / slider.value + "px";
    });
});

// Initial canvas created on load.
buildCanvas(50);