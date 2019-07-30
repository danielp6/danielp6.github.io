var margin = {
        top: 20,
        right: 10,
        bottom: 100,
        left: 100
    },
    width = 700 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body")
    .append("svg")
    .attr({
        "width": width + margin.right + margin.left,
        "height": height + margin.top + margin.bottom
    })
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");

var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.1, 0.1);

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
        .key(function(d) {
            return d.Manufacturer;
        })
        .rollup(function(d) {
            return d3.sum(d, function(g) {
                return g.Global_Sales;
            });
        }).entries(csv_data);

    data.forEach(function(d) {
        d.Manufacturer = d.key;
        d.Global_Sales = d.values;
    })

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Sales:</strong> <span style='color:red'>" + (d.Global_Sales).toFixed(2) + "</span>";
        });
    svg.call(tip);

    xScale.domain(["Atari", "Microsoft", "Nintendo", "PC", "Sega", "Sony"]);
	// 	data.map(function(d) {
    //     if (d.Manufacturer) {return d.Manufacturer}
    // }));
    yScale.domain([0, d3.max(data, function(d) {
        return d.Global_Sales;
    })]);

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr("height", 0)
        .attr("y", height)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .transition().duration(2500)
        .delay(function(d, i) {
            return i * 200;
        })
        .attr({
            "x": function(d) {
                return xScale(d.Manufacturer);
            },
            "y": function(d) {
                return yScale(d.Global_Sales);
            },
            "width": xScale.rangeBand(),
            "height": function(d) {
                return height - yScale(d.Global_Sales);
            }
        });

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
        .attr("transform", "rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Global sales in Millions of Dollars");


});
