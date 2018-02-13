// Setting object
settings = {
    sizes : { // Cirle width and height
        small : .5,
        medium : 1,
        big : 1.5
    },
    distances : { // Padding L&R
        cluttered : 3,
        medium : 6,
        sparse : 12
    },
    trainingStepNumber: 5,
    recordedSteps: 5 // Per couple (size, distance)
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
    },
    serie: undefined,
};
session = {
    steps: 0,
    started: false
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

function initExperiment(serie, fingerType) {
    pairData.fingerType = fingerType;
    pairData.serie = serie;
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
    session.started = true;
    session.steps = 0;
    document.getElementById('remaining').innerHTML = ((9*settings.recordedSteps + settings.trainingStepNumber)).toString();
    placeCircles();

}

function placeCircles() {
    var x1, x2, y1, y2;
    var offsetX = 0;
    var offsetY = 22 + settings.sizes.big*cm;
    var count = 0;
    var maxIterations = 100000;
    var containerWidth = document.getElementById('experiment-container').clientWidth;
    var containerHeight = document.getElementById('experiment-container').clientHeight;
    do {
        x1 = Math.random() * (containerWidth - pairData.size * cm - offsetX) + offsetX/2;
        y1 = Math.random() * (containerHeight - pairData.size * cm - offsetY) + offsetY/2;
        var angle = Math.random() * 359.9;
        x2 = x1 + pairData.distance * cm * Math.cos(angle * 3.14159 / 180);
        y2 = y1 + pairData.distance * cm *  Math.sin(angle  * 3.14159 / 180);
        var unfit = x2 < offsetX || x2 > containerWidth - pairData.size * cm - offsetX
            || y2 < offsetY || y2 > containerHeight - pairData.size * cm - offsetY;
        count++;
        //console.log(x1 + ' ' + x2 + ' ' + y1 + ' ' + y2 + ' ' + unfit);
    } while (unfit && count < maxIterations);
    if (count === maxIterations)
        throw RangeError("placeCircles() loops over " + maxIterations + "iterations.");
    else{
        pairData.elements.first.style.top = y1 + 'px';
        pairData.elements.first.style.left = x1 + 'px';
        pairData.elements.second.style.top = y2 + 'px';
        pairData.elements.second.style.left = x2 + 'px';
    }
}

function circleClicked(event, element) {
    // If first circle
    if (pairData.first && element === pairData.elements.first) {
        pairData.timeStart = event.timeStamp;
        pairData.elements.first.style.display = 'none';
        // Switch boolean value
        pairData.first = !pairData.first;
        event.stopPropagation();
    }
    // If second circle
    else if(!pairData.first && element === pairData.elements.second){
        // Get ending time
        pairData.timeEnd = event.timeStamp;

        // Calculate time spent
        var time = pairData.timeEnd - pairData.timeStart;

        // Re print first circle
        pairData.elements.first.style.display = 'initial';

        var result = {
            serie: pairData.serie,
            distance: pairData.distance,
            time: time,
            size: pairData.size,
            fingerType: pairData.fingerType,
            errors: pairData.errors
        };

        if (session.steps > settings.trainingStepNumber) {
            window.addResult(result);
        }
        console.log(result);

        // Reset the times and errors
        pairData.re_init();

        session.steps++;
        document.getElementById('remaining').innerHTML = ((9*settings.recordedSteps + settings.trainingStepNumber)-session.steps).toString();
        if (session.steps < settings.trainingStepNumber) {
            // TODO Random?
        } else if (session.steps === settings.trainingStepNumber) {
            setSize('medium');
            setDistance('medium');
        } else if (session.steps === settings.trainingStepNumber + settings.recordedSteps) {
            setSize('small');
            setDistance('medium');
        } else if (session.steps === settings.trainingStepNumber + 2*settings.recordedSteps) {
            setSize('small');
            setDistance('cluttered');
        } else if (session.steps === settings.trainingStepNumber + 3*settings.recordedSteps) {
            setSize('medium');
            setDistance('cluttered');
        } else if (session.steps === settings.trainingStepNumber + 4*settings.recordedSteps) {
            setSize('big');
            setDistance('cluttered');
        } else if (session.steps === settings.trainingStepNumber + 5*settings.recordedSteps) {
            setSize('medium');
            setDistance('sparse');
        } else if (session.steps === settings.trainingStepNumber + 6*settings.recordedSteps) {
            setSize('big');
            setDistance('sparse');
        } else if (session.steps === settings.trainingStepNumber + 7*settings.recordedSteps) {
            setSize('big');
            setDistance('medium');
        } else if (session.steps === settings.trainingStepNumber + 8*settings.recordedSteps) {
            setSize('small');
            setDistance('sparse');
        } else if (session.steps >= settings.trainingStepNumber + 9*settings.recordedSteps) {
            window.toggleResults();
            session.started = false;
        }


        // Update the screen
        placeCircles();

        event.stopPropagation();
        pairData.first = !pairData.first;
    }

}

function circleMissed(event, element) {
    console.log(element);
    pairData.errors++;
}

window.start = function start() {
  var name = document.getElementById('name').value;
  var finger = document.getElementById('finger').value;
  initExperiment(name, finger);
};
