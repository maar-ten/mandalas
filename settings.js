const ColorModus = Object.freeze({
    CYCLE: 1,
    FIXED: 2
});

const SymmetryType = Object.freeze({
    MIRROR: 1,
    RADIAL: 2 // draws the points along a virtual circle
});

const StateStore = {
    // change these for different shape sizes, drawing symmetries or color speed
    shapeSize: 20, // anything between 5 and 200
    symmetry: 8, // 1, 2, 4 or 8
    colorCycleSpeed: 0, // anything between -10 and +10
    symmetryType: SymmetryType.RADIAL,

    // be careful, here be dragons
    vHue: 255, // value of the hue
    change: -1, // either +1 or -1, increase or decrease the current hue
    hueIncrementSteps: 0, // used to slow down the hue change
    cWidth: window.innerWidth, // canvas width
    cHeight: window.innerHeight - document.getElementById('settings').offsetHeight - 5, // canvas height
    colorModus: ColorModus.CYCLE,
    fixedColor: '', // the hue value used when color modus is fixed
    loading: true // toggles the loading image
};

export {StateStore, ColorModus, SymmetryType};