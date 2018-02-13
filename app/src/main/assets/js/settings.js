// Setting object
settings = {
    sizes : { // Cirle width and height
        small : .5,
        medium : 1,
        big : 1.5
    },
    distances : { // Padding L&R
        cluttered : 3,
        medium : 5.5,
        sparse : 12.5
    },
    trainingStepNumber: 5,
    recordedSteps: 10 // Per couple (size, distance)
};

// Empirical conversion  cm -> px
cm = 37.8;

// Data concerning a pair of circle
pairData = {
    first: true, // State
    timeStart: undefined, // Time of first click
    timeEnd: undefined, // Time of first click
    distance: -1, // Distance between circles
    size: -1, // Size of circles
    elements: { // DOM Elements
        startCircle: undefined,
        endCircle: undefined
    },
    errors: 0,
    re_init: function () {
        pairData.timeStart = undefined;
        pairData.timeEnd = undefined;
        pairData.errors = 0;
    }
};

// Set size of the circles
// @param size : { 'small', 'medium', 'big' }
function setSize(size) {
    // Get list of circles
    var circles = document.getElementsByClassName('circle');
    // For each circle
    for (var index = 0; index < circles.length; index++) {
        var circle = circles[index];
        // Set height, width, and border radius of each circle
        circle.style.height = settings.sizes[size] + 'cm';
        circle.style.width = settings.sizes[size] + 'cm';
        circle.style.borderRadius = (settings.sizes[size] / 2) + 'cm';
        circle.style.fontSize = circle.style.height;
        circle.style.lineHeight = circle.style.height;
    }
    pairData.size = settings.sizes[size];
}

// Set distance between the circles
// @param width : { 'cluttered', 'medium', 'sparse' }
function setDistance(distance) {
    // Set distance for computation
    pairData.distance = settings.distances[distance];

}

function initExperiment(fingerType) {
    pairData.fingerType = 'thumb';
    var distance_str = 'sparse';
    var size_str = 'big';

    var angle = Math.random() * 359.9;
    var windowWidth = window.innerWidth;

    var distance = settings.distances[distance_str]*cm;
    var size = settings.sizes[size_str]*cm;




    document.getElementById('experiment-container').innerHTML =
        '<div id="circle1" class="circle start" onclick="circleClicked(event, this)">1</div>' +
        '<div id="circle2" class="circle end" onclick="circleClicked(event, this)">2</div>';


    pairData.elements.first = document.getElementById('circle1');
    pairData.elements.second = document.getElementById('circle2');
    setDistance(distance_str);
    setSize(size_str);
    placeCircles();

}

function placeCircles() {
    var x1, x2, y1, y2;
    var offsetX = 24;
    var offsetY = 162;
    var containerWidth = window.innerWidth;
    var containerHeight = window.innerHeight;
    do {
        x1 = Math.random() * (containerWidth - pairData.size * cm - offsetX) + offsetX/2;
        y1 = Math.random() * (containerHeight - pairData.size * cm - offsetY) + offsetY/2;
        var angle = Math.random() * 359.9;
        x2 = x1 + pairData.distance * cm * Math.cos(angle * 3.14159 / 180);
        y2 = y1 + pairData.distance * cm *  Math.sin(angle  * 3.14159 / 180);
        var unfit = x2 < offsetX || x2 > containerWidth - pairData.size * cm - offsetX
            || y2 < offsetY || y2 > containerHeight - pairData.size * cm - offsetY;
    } while (unfit);
    pairData.elements.first.style.top = y1 + 'px';
    pairData.elements.first.style.left = x1 + 'px';
    pairData.elements.second.style.top = y2 + 'px';
    pairData.elements.second.style.left = x2 + 'px';
}

function circleClicked(event, element) {
    // If first circle
    if (pairData.first) {
        pairData.timeStart = event.timeStamp;
        //pairData.elements.first.parentElement.style.display = 'none'; TODO replace : remove circle instead
        // TODO remove first element
    }
    // If second circle
    else {
        pairData.timeEnd = event.timeStamp;
        var time = pairData.timeEnd - pairData.timeStart;
        console.log(time + 'ms');

        // Record the action TODO uncomment
        /*window.addResult({
            serie: "MOCK_SERIE",
            distance: pairData.distance,
            time: time,
            size: pairData.size,
            fingerType: pairData.fingerType
            errors: pairData.errors
        });*/

        // Reset the data
        pairData.re_init();

        // Update the screen
        // TODO update screen

        // Update the data TODO elements, distance, size
    }
    // Switch boolean value
    pairData.first = !pairData.first;
    event.stopPropagation();
}

function circleMissed(event, element) {
    console.log(element);
}

initExperiment('finger');