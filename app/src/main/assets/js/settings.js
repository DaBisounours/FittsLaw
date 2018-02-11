settings = {
    sizes : { // Cirle width and height
        small : .5,
        medium : 1,
        big : 1.5
    },
    widths : { // Padding L&R
        cluttered : 2.5,
        medium : 1.5,
        sparse : 0.5
    }
};

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

function setWidth(width) {
}