
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

// define x and y axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

// d3.csv("VGM.csv", function(error,data) {
//   if(error) console.log("Error loading data");
//
//   data.forEach(function(d) {
//     d.Year_of_Release = d.Year_of_Release;
// });

    d3.csv("VGM-1.csv", function(error, csv_data) {
     var data = d3.nest()
      .key(function(d) { return d.Year_of_Release;})
      .rollup(function(d) {
       return d3.sum(d, function(g) {return g.Global_Sales; });
      }).entries(csv_data);

data.forEach(function(d) {
 d.Year_of_Release = d.key;
 d.Global_Sales = d.values;
})




xScale.domain(data.map(function(d) { return d.Year_of_Release; }) );
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
      "x": function(d) { return xScale(d.Year_of_Release); },
      "y": function(d) { return yScale(d.Global_Sales); },
      "width": xScale.rangeBand(),
      "height": function(d) { return  height - yScale(d.Global_Sales); }
    })
    .style("fill", "blue");


        svg.selectAll('text')
            .data(data)
            .enter()
            .append('text')


            //
            // .text(function(d){
            //     return d.Global_Sales;
            // })
            // .attr({
            //     "x": function(d){ return xScale(d.Year_of_Release) +  xScale.rangeBand()/2; },
            //     "y": function(d){ return yScale(d.Global_Sales)+ 12; },
            //     "font-family": 'sans-serif',
            //     "font-size": '13px',
            //     "font-weight": 'bold',
            //     "fill": 'white',
            //     "text-anchor": 'middle'
            // });

    // Draw xAxis and position the label
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


    // Draw yAxis and postion the label
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height/2)
        .attr("dy", "-3em")
        .style("text-anchor", "middle")
        .text("Global sales in Millions of Dollars");
});
