// Setting object
settings = {
    sizes : { // Cirle width and height
        small : .5,
        medium : 1,
        big : 1.5
    },
    widths : { // Padding L&R
        cluttered : 0.5,
        medium : 5.5,
        sparse : 11
    }
};
// Empirical conversion  cm -> px
cm = 37.8;

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
    }
}

// Set distance between the circles
// @param width : { 'cluttered', 'medium', 'sparse' }
function setDistance(distance) {
    // Get list of circle containers
    var circle_containers = document.getElementsByClassName('circle-container');
    // For each container
    for (var index = 0; index < circle_containers.length; index++) {
        var container = circle_containers[index];

        // Get container width
        var containerWidth = parseInt(window.getComputedStyle(container).width);
        // Get circle width
        var circle = document.getElementsByClassName('circle')[0];
        var circleWidth = parseInt(window.getComputedStyle(circle).width);
        // Compute distance
        var maxDistance = containerWidth - circleWidth;
        var computedDistance = settings.widths[distance] * cm;
        // Limit distance
        var distancePx = computedDistance > maxDistance ? maxDistance : computedDistance;
        distancePx = computedDistance < circleWidth ? circleWidth : computedDistance;
        // Change the padding to change the distance
        var padding = (containerWidth - circleWidth - distancePx) / 2;
        padding = (padding < 0 ? 0 : padding);
        container.style.padding = '0 ' + padding + "px";
        console.log('padding: '+padding+'\ndistance: '+distancePx+'\ncontainerWidth: '+containerWidth);
    }
}