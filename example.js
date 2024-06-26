// U14123683
function main(){
    var svg = d3.select("svg") // Initialize SVG Variable
    margin = 200,
    width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;
    // Adding tooltip if data does not load.
    d3.select("#hover").on("mouseover", function(){d3.select(this).text("Type python3 -m http.server 8000 into your terminal and then type localhost:8000 into your url bar")})
    d3.select("#hover").on("mouseout", function(){d3.select(this).text("Nothing Loading? Hover here.")})
     //Mouseover Function
     function mouseOver(d,i){
        var xPos = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
        var yPos = parseFloat(d3.select(this).attr("y")) / 2 + height / 2;
        d3.select("#tooltip")
                .style("left", xPos + "px")
                .style("top", yPos + "px")
                .select("#value").text(i.Price) // Displays Price on Tooltip
        d3.select("#tooltip")
                .style("left", xPos + "px")
                .style("top", yPos + "px")
                .select("#date").text(i.Date) // Displays Date on Tooltip  
        d3.select("#tooltip").classed("hidden", false); // When mouseOver active, tooltip is not hidden
        d3.select(this).attr("class","highlight") // Implementing highlight hover functionality
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
        d3.select(this) // Resetting attributes when mouseOut active
                .transition()
                .duration(250)
                .attr("width", xScale.bandwidth())
                .attr("y", function(d){return yScale(d.Price)})
                .attr("height", function(d){return height - yScale(d.Price);})
        d3.select("#tooltip").classed("hidden", true);    // Hiding tooltip when mouseOut active
    }
    //Adding Title
    svg.append("text") 
            .attr("transform","translate(100,0)")
            .attr("x", 100)
            .attr("y", 50)
            .attr("font-size", "20px")
            .text("Stock Price Over Time - U14123683");

    //Scales
    var xScale = d3.scaleBand().range([0,width]).padding(0.4);
    var yScale = d3.scaleLinear().range([height, 0]);

    //Graph Variable
    var g = svg.append("g").attr("transform", "translate("+100+","+100+")");

    //Filter Functionality
    function updateGraph(buttonId) {
        //Updating Stock name based on Button ID
        var filteredStock = buttonId; 
            //Loading Data
            d3.csv("mock_stock_data.csv").then(function(data) {
                data.forEach(function(d) {
                    d.Price = +d.Price; // Price is treated as a number
                        });
                // Data Selected Based on Button ID
                var filteredData = data.filter(function(d) {
                    return d["Stock"] === filteredStock;
                        });
                // Domains
                xScale.domain(filteredData.map(function(d) { return d.Date; }));
                yScale.domain([0, d3.max(filteredData, function(d) { return d.Price; })]);
                // Removing axes when stock changes
                g.selectAll("g").remove()
                // Re-applying axes based on stock data
                g.append("g")
                    .attr("transform", "translate(0,"+height+")")
                    .call(d3.axisBottom(xScale))
                g.append("g")
                    .call(d3.axisLeft(yScale)
                    .tickFormat(function(d) { return "$" + d; })
                    .ticks(10));
                // Adding Bars variable for calling
                var bars = g.selectAll(".bar").data(filteredData);
                // Removing bars when stock changes
                bars.exit().remove();
                // Re-applying bars based on stock data
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
                    });
                }
                // Initializing graph with Apple data
                updateGraph("Apple")
                // Allows button clicks to update graph
                window.updateGraph = updateGraph;

            }