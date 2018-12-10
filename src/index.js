// change these for different shape sizes, drawing symmetries or color speed
let shapeSize = 20; // anything between 5 and 200
let symmetry = 4; // 1, 2, 4 or 8
let colorCycleSpeed = 0; // anything between -10 and +10
let drawingType = 'square'; // square or radial (draws the points along a virtual circle)

// be careful, here be dragons
let vHue = 255;
let change = -1; // either +1 or -1
let hueIncrementSteps = 0;
const cWidth = window.innerWidth;
const cHeight =
    window.innerHeight - document.getElementById("settings").offsetHeight - 5;
let colorModus = "cycle"; // can be cycle or fixed
let fixedColor = "";
let loading = true;

function setup() {
    setInitialShapeSize();
    createCanvas(cWidth, cHeight);
    background(250);
}

function removeLoadingImg() {
    const img = document.getElementById("loadingImg");


    if (img) {
        img.remove();
        loading = false;
    }
}

function getIntValue(idSelector) {
    return parseInt(getValue(idSelector));
}

function getValue(idSelector) {
    return document.getElementById(idSelector).value;
}

function setSymmetry() {
    symmetry = getIntValue("symmetry");
}

function setDrawingType() {
    drawingType = getValue("drawingType");
}

function setShapeSize() {
    shapeSize = getIntValue("size");
}

function setColorCycleSpeed() {
    colorCycleSpeed = getIntValue("speed");
    hueIncrementSteps = 0;
}

function setColor() {
    colorModus = "fixed";
    fixedColor = getValue("color");
}

function startColorCycle() {
    if (colorModus === "fixed") {
        colorModus = "cycle";
        document.getElementById("color").value = "#ffffff";
    }
}

function clearCanvas() {
    clear();
    if (loading) removeLoadingImg();
}

function setInitialShapeSize() {
    const cArea = cWidth * cHeight;
    if (cArea > 200000) {
        shapeSize = 30;
    }
    if (cArea > 600000) {
        shapeSize = 50;
    }
    if (cArea > 1000000) {
        shapeSize = 75;
    }
}

function setFill() {
    if (colorModus === "cycle") {
        colorMode(HSB);
        fill(vHue, 50, 100);

        // change the hue every time this function is called
        vHue += hueIncrement();
        if (vHue <= 0 || vHue >= 255) {
            change = change * -1;
        }
    } else {
        colorMode(RGB);
        fill(fixedColor);
    }
}

function hueIncrement() {
    if (colorCycleSpeed === 0) {
        return change;
    }

    if (colorCycleSpeed > 0) {
        return change * colorCycleSpeed;
    }

    if (colorCycleSpeed < 0) {
        if (hueIncrementSteps == abs(colorCycleSpeed)) {
            hueIncrementSteps = 0;
            return change;
        }

        hueIncrementSteps++;
        return 0;
    }
}

function draw() {
    setFill();
    noStroke();

    // shows the current color in the top left corner;
    rect(0, 0, 10, 10);

    // draw shapes when the mouse is pressed over the canvas
    if (mouseIsPressed && mouseX >= 0 && mouseY >= 0) {
        if (loading) {
            removeLoadingImg();
        }

        if (drawingType === 'radial') {
            const cX = cWidth / 2;
            const cY = cHeight / 2;

            const relX = mouseX - cX;
            const relY = mouseY - cY;

            const r = sqrt(relX * relX + relY * relY);
            const theta = atan2(relY, relX);

            const pieSlice = 2 * PI / symmetry;
            for (let i = 0; i <= symmetry; i++) {
                const x = ceil(cX + r * cos(i * pieSlice + theta));
                const y = ceil(cY + r * sin(i * pieSlice + theta));
                ellipse(x, y, shapeSize, shapeSize);
            }

        } else {
            ellipse(mouseX, mouseY, shapeSize, shapeSize);

            if (symmetry >= 2) {
                ellipse(cWidth - mouseX, cHeight - mouseY, shapeSize, shapeSize);
            }

            if (symmetry >= 4) {
                ellipse(mouseX, cHeight - mouseY, shapeSize, shapeSize);
                ellipse(cWidth - mouseX, mouseY, shapeSize, shapeSize);
            }

            if (symmetry >= 8) {
                ellipse(mouseY, mouseX, shapeSize, shapeSize);
                ellipse(cWidth - mouseY, cHeight - mouseX, shapeSize, shapeSize);
                ellipse(mouseY, cHeight - mouseX, shapeSize, shapeSize);
                ellipse(cWidth - mouseY, mouseX, shapeSize, shapeSize);
            }
        }
    }
}
