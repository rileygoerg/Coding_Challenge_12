// U14123683
function main(){
    var svg = d3.select("svg")
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;

     //Mouseover Function
     function mouseOver(d,i){
        var xPos = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        var yPos = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;

        d3.select("#tooltip")
                .style("left", xPos + "px")
                .style("top", yPos + "px")
                .select("#value").text(i.Price)
        d3.select("#tooltip")
                .style("left", xPos + "px")
                .style("top", yPos + "px")
                .select("#date").text(i.Date)
                
        d3.select("#tooltip").classed("hidden", false);

        d3.select(this).attr("class","highlight")
        d3.select(this)
                .transition()
                .duration(250)
                .attr("width", xScale.bandwidth()+5)
                .attr("y", function(d){return yScale(d.Price) - 10})
                .attr("height", function(d){return height - yScale(d.Price) + 10;})

    }
    //Mouseout Function
    function mouseOut(d,i){
        d3.select(this).attr("class","bar")
        d3.select(this)
                .transition()
                .duration(250)
                .attr("width", xScale.bandwidth())
                .attr("y", function(d){return yScale(d.Price)})
                .attr("height", function(d){return height - yScale(d.Price);})
        d3.select("#tooltip").classed("hidden", true);        
    }

    svg.append("text")
            .attr("transform","translate(100,0)")
            .attr("x", 100)
            .attr("y", 50)
            .attr("font-size", "20px")
            .text("Stock Price Over Time");

    //Scales
    var xScale = d3.scaleBand().range([0,width]).padding(0.4);
    var yScale = d3.scaleLinear().range([height, 0]);

    //Graph
    var g = svg.append("g").attr("transform", "translate("+100+","+100+")");

                function updateGraph(buttonId) {
                    var filteredStock = buttonId; // Update filteredStock based on buttonId
            
                    d3.csv("mock_stock_data.csv").then(function(data) {
                        data.forEach(function(d) {
                            d.Price = +d.Price; // Ensure the price is treated as a number
                        });
            
                        var filteredData = data.filter(function(d) {
                            return d["Stock"] === filteredStock;
                        });
            
                        xScale.domain(filteredData.map(function(d) { return d.Date; }));
                        yScale.domain([0, d3.max(filteredData, function(d) { return d.Price; })]);
                        
                       g.selectAll("g").remove()

                        g.append("g")
                            .attr("transform", "translate(0,"+height+")")
                             .call(d3.axisBottom(xScale))

                        g.append("g")
                             .call(d3.axisLeft(yScale)
                                .tickFormat(function(d) { return "$" + d; })
                                .ticks(10));

                        var bars = g.selectAll(".bar").data(filteredData);
            
                        bars.exit().remove();
            
                        bars.enter().append("rect")
                            .attr("class", "bar")
                            .on("mouseover", mouseOver)
                            .on("mouseout", mouseOut)
                            .merge(bars)
                            .transition()
                            .ease(d3.easeLinear)
                            .duration(500)
                            .attr("x", function(d) { return xScale(d.Date); })
                            .attr("y", function(d) { return yScale(d.Price); })
                            .attr("width", xScale.bandwidth())
                            .attr("height", function(d) { return height - yScale(d.Price); });
            
                        g.select(".x-axis").transition().call(d3.axisBottom(xScale));
                        g.select(".y-axis").transition().call(d3.axisLeft(yScale).tickFormat(function(d) { return "$" + d; }).ticks(10));
                    });
                }
            
                // Initialize with default stock (Apple)
                updateGraph("Apple");
            
                // Expose updateGraph to the window object so it can be called on button click
                window.updateGraph = updateGraph;
            }