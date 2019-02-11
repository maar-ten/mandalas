import {StateStore, ColorModus, SymmetryType} from "./settings.js";

const p5callback = function (p5) {
    p5.setup = function () {
        setInitialShapeSize();
        p5.createCanvas(StateStore.cWidth, StateStore.cHeight);
        p5.background(250);
    };

    p5.draw = function () {
        setFill();
        p5.noStroke();
        printColorPatch();

        if (mousePressedOverCanvas()) {
            if (StateStore.symmetryType === SymmetryType.RADIAL) {
                drawRadial(p5.mouseX, p5.mouseY);

            } else {
                drawMirror(p5.mouseX, p5.mouseY);
            }
        }
    };

    function printColorPatch() {
        // shows the current color in the top left corner;
        p5.rect(0, 0, 10, 10);
    }

    function drawRadial(x, y) {
        const cX = StateStore.cWidth / 2;
        const cY = StateStore.cHeight / 2;

        const relX = x - cX;
        const relY = y - cY;

        const r = p5.sqrt(relX * relX + relY * relY);
        const theta = p5.atan2(relY, relX);

        const pieSlice = 2 * p5.PI / StateStore.symmetry;
        for (let i = 0; i <= StateStore.symmetry; i++) {
            const x = p5.ceil(cX + r * p5.cos(i * pieSlice + theta));
            const y = p5.ceil(cY + r * p5.sin(i * pieSlice + theta));
            p5.ellipse(x, y, StateStore.shapeSize, StateStore.shapeSize);
        }
    }

    function drawMirror(x, y) {
        p5.ellipse(x, y, StateStore.shapeSize, StateStore.shapeSize);

        if (StateStore.symmetry >= 2) {
            p5.ellipse(StateStore.cWidth - x, StateStore.cHeight - y, StateStore.shapeSize, StateStore.shapeSize);
        }

        if (StateStore.symmetry >= 4) {
            p5.ellipse(x, StateStore.cHeight - y, StateStore.shapeSize, StateStore.shapeSize);
            p5.ellipse(StateStore.cWidth - x, y, StateStore.shapeSize, StateStore.shapeSize);
        }

        if (StateStore.symmetry >= 8) {
            p5.ellipse(y, x, StateStore.shapeSize, StateStore.shapeSize);
            p5.ellipse(StateStore.cWidth - y, StateStore.cHeight - x, StateStore.shapeSize, StateStore.shapeSize);
            p5.ellipse(y, StateStore.cHeight - x, StateStore.shapeSize, StateStore.shapeSize);
            p5.ellipse(StateStore.cWidth - y, x, StateStore.shapeSize, StateStore.shapeSize);
        }
    }

    function mousePressedOverCanvas() {
        return p5.mouseIsPressed && p5.mouseX >= 0 && p5.mouseY >= 0;
    }

    function setFill() {
        if (StateStore.colorModus === ColorModus.CYCLE) {
            p5.colorMode(p5.HSB);
            p5.fill(StateStore.vHue, 50, 100);

            // change the hue every time this function is called
            StateStore.vHue += hueIncrement();
            if (StateStore.vHue <= 0 || StateStore.vHue >= 255) {
                StateStore.change = StateStore.change * -1;
            }
        } else {
            p5.colorMode(p5.RGB);
            p5.fill(StateStore.fixedColor);
        }
    }

};

export {p5callback};

function setInitialShapeSize() {
    const cArea = StateStore.cWidth * StateStore.cHeight;
    if (cArea > 200000) {
        StateStore.shapeSize = 30;
    }
    if (cArea > 600000) {
        StateStore.shapeSize = 50;
    }
    if (cArea > 1000000) {
        StateStore.shapeSize = 75;
    }
}

function hueIncrement() {
    if (StateStore.colorCycleSpeed === 0) {
        return StateStore.change;
    }

    if (StateStore.colorCycleSpeed > 0) {
        return StateStore.change * StateStore.colorCycleSpeed;
    }

    if (StateStore.colorCycleSpeed < 0) {
        if (StateStore.hueIncrementSteps === Math.abs(StateStore.colorCycleSpeed)) {
            StateStore.hueIncrementSteps = 0;
            return StateStore.change;
        }

        StateStore.hueIncrementSteps++;
        return 0;
    }
}