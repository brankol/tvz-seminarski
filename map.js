var width = 900,
    height = 900;

var projection = d3.geo.mercator()
    // .center([16, 45.48])
    .center([16.5, 44.4])
    // .rotate([4.4, 0])
    .scale(8000)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'map')
    .attr('class', 'map');

d3.json('zupanije_topo.json', function(error, hr) {
    var counties = topojson.object(hr, hr.objects.zupanije);

    // svg.append('path')
    //     .datum(topojson.object(hr, hr.objects.zupanije))
    //     .attr('d', path);

    svg.selectAll('.county')
        .data(counties.geometries)
    .enter().append('path')
        .attr('class', function(d) { return 'county ' + d.id; })
        .attr('d', path);

    svg.selectAll('.county-label')
        .data(counties.geometries)
    .enter().append('text')
        .attr('class', function(d) { return 'county-label ' + d.id; })
        .attr('transform', function(d) { return 'translate(' + path.centroid(d) + ')'; })
        .attr('dy', '.2em')
        .text(function(d) { return d.properties.name; });

    setTimeout(function () {
        monthEl.onchange();
        controls.className += ' visible';
    }, 1500);
});





var monthEl = document.querySelector('#month');
var yearEl = document.querySelector('#year');
var valueEl = document.querySelector('#val');
var controls = document.querySelector('.controls');
var months = ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'];

monthEl.onchange = function () {
    var time = yearEl.value + ((this.value.length < 2) ? '0' + this.value : this.value);
    var county;
    var unemploymentRate;

    // valueEl.innerHTML = months[parseInt(this.value, 10) - 1];

    for (county in unemploymentData) {
        unemploymentRate = (unemploymentData[county][time] / unemploymentData[county]['work-capable'] * 100).toFixed(2);

        svg.select('.county-label.' + unemploymentData[county]['id']).text(unemploymentRate + '%');

        if (unemploymentRate < 5) {
            svg.select('.county.' + unemploymentData[county]['id']).classed('county-lo', true).classed('county-me', false).classed('county-hi', false);
        } else if (unemploymentRate >= 5 && unemploymentRate < 10) {
            svg.select('.county.' + unemploymentData[county]['id']).classed('county-me', true).classed('county-lo', false).classed('county-hi', false);
        } else {
            svg.select('.county.' + unemploymentData[county]['id']).classed('county-hi', true).classed('county-lo', false).classed('county-me', false);
        }
    }
};

