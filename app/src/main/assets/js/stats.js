var CANVAS_HEIGHT = 270;
var colors = ['#3F549C', '#9733CD', '#C6519A', '#F33FAB', '#F76A92'];
// load data from localstorage if available
var data = { measurements: [] };
try {
  data = window.localStorage.getItem('fittslaw-data');
  data = JSON.parse(data);
}
catch(e) {}
window.data = data;

window.addResult = function addResult(params) {
  params = params || {};
  var serie = params.serie || '???';
  var fingerType = params.fingerType || 'default';
  var distance = params.distance || 0;
  var size = params.size || 0;
  var time = params.time || 0;
  window.data.measurements = window.data.measurements || [];
  window.data.measurements.push({
    serie: serie,
    fingerType: fingerType,
    size: size,
    distance: distance,
    time: time,
    difficulty: Math.log(1 + (distance / size))
  });
  window._saveData();
};

window.displayResults = function() {
  var wrapper = document.createElement('div');
  wrapper.id = 'stats';
  document.body.append(wrapper);

  /* Fitts law chart */
  var fittslaw = document.createElement('canvas');
  fittslaw.height = CANVAS_HEIGHT;
  var dataByDifficulty =__groupBy(data.measurements, 'difficulty', 'floor-2');
  var series = __groupBy(data.measurements, 'fingerType');
  var datasets = [];
  var difficulties = [];
  for (var difficulty in dataByDifficulty) {
    difficulties.push(difficulty);
  }
  difficulties = difficulties.sort();
  for (var key in series) {
    var dataset = {};
    dataset.type = 'line';
    dataset.label = key;
    dataset.borderWidth = 5;
    dataset.fill = false;
    dataset.borderColor = colors[datasets.length % colors.length];
    dataset.data = difficulties.map(function (difficulty) {
      var sameDifficultyData = series[key].filter(function(cur) {
        return (Math.floor(100 * cur.difficulty) / 100).toString() === difficulty;
      });
      return {
        x: Number(difficulty),
        y: sameDifficultyData.reduce(function(sum, cur) {
          sum += cur.time;
          return sum;
        }, 0) / sameDifficultyData.length
      };
    });
    datasets.push(dataset);
  }

  // compute regressions
  var regressions = [];
  datasets.forEach(function(dataset) {
    var points = [];
    dataset.data.forEach(function (dataPoint, i) {
      points.push([Number(difficulties[i]), dataPoint.y]);
    });
    var reg = regression.linear(points);
    var a = reg.equation[0];
    var b = reg.equation[1];
    var regpoints = [];
    difficulties.forEach(function (diff) {
      regpoints.push({ x: Number(diff), y: a * Number(diff) + b });
    });
    regressions.push({
      type: 'line',
      label: 'reg(' + dataset.label + ', r²=' + reg.r2 + '])',
      borderWidth: 2,
      fill: false,
      borderColor: 'red',
      data: regpoints
    });
  });
  regressions.forEach(function (reg) {
    datasets.push(reg);
  });

  var fittsLawChartOptions = {
    data: {
      labels: difficulties.map(Number),
      datasets: datasets
    },
    options: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Response time by difficulty'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Difficulty'
          },
          type: 'linear'
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Response time (ms)'
          }
        }]
      }
    }
  };
  console.log('fittsLawChartOptions', fittsLawChartOptions);
  wrapper.append(fittslaw);
  new Chart(fittslaw.getContext('2d'), fittsLawChartOptions);

  /* by size histogram */
  var bySize = document.createElement('canvas');
  bySize.height = CANVAS_HEIGHT;
  var dataBySize =__groupBy(data.measurements, 'size');
  var series = __groupBy(data.measurements, 'fingerType');
  var datasets = [];
  var sizes = [];
  for (var size in dataBySize) {
    sizes.push(size);
  }
  sizes = sizes.sort();
  for (var key in series) {
    var dataset = {};
    dataset.type = 'line';
    dataset.label = key;
    dataset.borderWidth = 5;
    dataset.fill = false;
    dataset.borderColor = colors[datasets.length % colors.length];
    dataset.data = sizes.map(function (size) {
      var sameSizeSerieData = series[key].filter(function(cur) {
        return cur.size.toString() === size;
      });
      return sameSizeSerieData.reduce(function(sum, cur) {
        sum += cur.time;
        return sum;
      }, 0) / sameSizeSerieData.length;
    });
    datasets.push(dataset);
  }
  var bySizeOptions = {
    data: {
      labels: sizes,
      datasets: datasets
    },
    options: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Response time by size'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Size (cm)'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Response time (ms)'
          }
        }]
      }
    }
  };
  wrapper.append(bySize);
  new Chart(bySize.getContext('2d'), bySizeOptions);

  /* by distance histogram */
  var byDistance = document.createElement('canvas');
  byDistance.height = CANVAS_HEIGHT;
  var dataByDistance =__groupBy(data.measurements, 'distance', 'floor');
  var series = __groupBy(data.measurements, 'fingerType');
  var datasets = [];
  var distances = [];
  for (var distance in dataByDistance) {
    distances.push(distance);
  }
  distances = distances.sort();
  for (var key in series) {
    var dataset = {};
    dataset.type = 'line';
    dataset.label = key;
    dataset.borderWidth = 5;
    dataset.fill = false;
    dataset.borderColor = colors[datasets.length % colors.length];
    dataset.data = distances.map(function (distance) {
      var sameDistanceSerieData = series[key].filter(function(cur) {
        return Math.round(cur.distance).toString() === distance;
      });
      return sameDistanceSerieData.reduce(function(sum, cur) {
        sum += cur.time;
        return sum;
      }, 0) / sameDistanceSerieData.length;
    });
    datasets.push(dataset);
  }

  var byDistanceOptions = {
    data: {
      labels: distances,
      datasets: datasets
    },
    options: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Response time by distance'
      },
      scales: {
        xAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Distance (cm)'
          }
        }],
        yAxes: [{
          display: true,
          scaleLabel: {
            display: true,
            labelString: 'Response time (ms)'
          }
        }]
      }
    }
  };
  wrapper.append(byDistance);
  new Chart(byDistance.getContext('2d'), byDistanceOptions);
};
window.hideResults = function() {
  document.body.removeChild(document.getElementById('stats'));
};
window.toggleResults = function() {
  if (document.getElementById('stats')) {
    window.hideResults();
  } else {
    window.displayResults();
  }
}

window._saveData = function _saveData() {
  try {
    window.localStorage.setItem('fittslaw-data', JSON.stringify(window.data));;
  }
  catch(e) {}
}


function __groupBy(arr, key, round) {
  return arr.reduce(function (acc, cur) {
    var k = key;
    if (round === 'floor') {
      k = Math.floor(Number(cur[k]));
    } else if (round === 'floor-2') {
      k = Math.floor(Number(100 * cur[k])) / 100;
    } else {
      k = cur[key];
    }
    acc[k] = acc[k] || [];
    acc[k].push(cur);
    return acc;
  }, {});
}
