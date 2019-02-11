import {ColorModus, StateStore, SymmetryType} from './settings.js';
import {p5callback} from './p5-callback.js';

// CSS element ids
const CSS_ID_SYMMETRY = 'symmetry';
const CSS_ID_SYMMETRY_TYPE = 'symmetryType';
const CSS_ID_SIZE = 'size';
const CSS_ID_SPEED = 'speed';
const CSS_ID_COLOR = 'color';
const CSS_ID_CYCLECOLOR = 'cycleColor';
const CSS_ID_CLEAR = 'clear';
const CSS_ID_LOADING_IMG = 'loadingImg';

// setup p5 library (it is loaded in the global name space)
const p5Instance = new p5(p5callback);

// setup dom element event listeners
setOnchange(CSS_ID_SYMMETRY, () => StateStore.symmetry = getIntValue(CSS_ID_SYMMETRY));
setOnchange(CSS_ID_SYMMETRY_TYPE, setSymmetryType);
setOnchange(CSS_ID_SIZE, () => StateStore.shapeSize = getIntValue(CSS_ID_SIZE));
setOnchange(CSS_ID_SPEED, changeSpeed);
setOnchange(CSS_ID_COLOR, setFixedColor);
setOnclick(CSS_ID_CYCLECOLOR, changeColorModusToCycling);
setOnclick(CSS_ID_CLEAR, clearCanvas);
setOnclick(CSS_ID_LOADING_IMG, removeLoadingImg);

function setSymmetryType() {
    return StateStore.symmetryType = getIntValue(CSS_ID_SYMMETRY_TYPE);
}

function changeSpeed() {
    StateStore.colorCycleSpeed = getIntValue(CSS_ID_SPEED);
    StateStore.hueIncrementSteps = 0;
}

function setFixedColor() {
    StateStore.colorModus = ColorModus.FIXED;
    StateStore.fixedColor = getValue(CSS_ID_COLOR);
}

function changeColorModusToCycling() {
    if (StateStore.colorModus === ColorModus.FIXED) {
        StateStore.colorModus = ColorModus.CYCLE;
        document.getElementById(CSS_ID_COLOR).value = '#ffffff';
    }
}

function clearCanvas() {
    p5Instance.clear();
    if (StateStore.loading) removeLoadingImg();
}


function setOnchange(id, fn) {
    getById(id).onchange = fn;
}

function setOnclick(id, fn) {
    getById(id).onclick = fn;
}

function getById(id) {
    return document.getElementById(id);
}

function removeLoadingImg() {
    const img = document.getElementById(CSS_ID_LOADING_IMG);

    if (img) {
        img.remove();
        StateStore.loading = false;
    }
}

function getIntValue(elementId) {
    return parseInt(getValue(elementId));
}

function getValue(elementId) {
    return document.getElementById(elementId).value;
}