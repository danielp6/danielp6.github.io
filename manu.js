
var margin = {top: 20, right: 10, bottom: 100, left:50},
    width = 700 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body")
    .append("svg")
      .attr ({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
      })
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.2, 0.2);

var yScale = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

    d3.csv("VGM-3.csv", function(error, csv_data) {
     var data = d3.nest()
      .key(function(d) {if (! (Number.isNaN(d.key)|| d.key == ""))  return d.Manufacturer;})
      .rollup(function(d) {
       return d3.sum(d, function(g) {return g.Global_Sales; });
      }).entries(csv_data);

data.forEach(function(d) {
 d.Manufacturer = d.key;
 d.Global_Sales = d.values;
})

xScale.domain(data.map(function(d) { return d.Manufacturer; }) );
yScale.domain([0, d3.max(data, function(d) { return d.Global_Sales; } ) ]);

svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr("height", 0)
    .attr("y", height)
    .transition().duration(2500)
    .delay( function(d,i) { return i * 200; })
    .attr({
      "x": function(d) { return xScale(d.Manufacturer); },
      "y": function(d) { return yScale(d.Global_Sales); },
      "width": xScale.rangeBand(),
      "height": function(d) { return  height - yScale(d.Global_Sales); }
    })
    .style("fill", "blue");

        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "rotate(-60)" )
        .style("text-anchor", "end")
        .attr("font-size", "10px");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
		.attr("y", -10)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Global sales in Millions of Dollars");
});
