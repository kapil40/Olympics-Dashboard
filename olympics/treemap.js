// var margin = {top: 10, right: 10, bottom: 10, left: 10},
//   width = 600 - margin.left - margin.right,
//   height = 445 - margin.top - margin.bottom;



// // append the svg object to the body of the page
// const svg = d3.select("#my_dataviz")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         `translate(${margin.left}, ${margin.top})`);

// // Read data
// d3.csv('../olympics/sports_count.csv').then(function(data) {

//   // stratify the data: reformatting for d3.js
//   const root = d3.stratify()
//     .id(function(d) { return d.Sport; })   // Name of the entity (column name is name in csv)
//     .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
//     (data);
//   root.sum(function(d) { return +d.Count })   // Compute the numeric value for each entity

//   // Then d3.treemap computes the position of each element of the hierarchy
//   // The coordinates are added to the root object above
//   d3.treemap()
//     .size([width, height])
//     .padding(4)
//     (root)

//   // use this information to add rectangles:
//   svg
//     .selectAll("rect")
//     .data(root.leaves())
//     .join("rect")
//       .attr('x', function (d) { return d.x0; })
//       .attr('y', function (d) { return d.y0; })
//       .attr('width', function (d) { return d.x1 - d.x0; })
//       .attr('height', function (d) { return d.y1 - d.y0; })
//       .style("stroke", "black")
//       .style("fill", "#69b3a2");

//   // and to add the text labels
//   svg
//     .selectAll("text")
//     .data(root.leaves())
//     .join("text")
//       .attr("x", function(d){ return d.x0})    // +10 to adjust position (more right)
//       .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
//       .text(function(d){ return d.data.Sport})
//       .attr("font-size", "10px")
//       .attr("fill", "white")
// })


// var margin = {top: 10, right: 10, bottom: 10, left: 10},
//   width = 600 - margin.left - margin.right,
//   height = 445 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// const svg_1 = d3.select("#my_dataviz")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         `translate(${margin.left}, ${margin.top})`);

// socket.on('updated-treemap-json', function(jsonString) {
  
//   var d = JSON.parse(jsonString);
//   const data = [];

// for (let i = 0; i < Object.keys(d.Sport).length; i++) {
//   data.push({
//     Sport: d.Sport[i],
//     Count: d.Count[i],
//     parent: d.parent[i]
//   });
// }

//   const root = d3.stratify()
//       .id(function(d) { return d.Sport; })   // Name of the entity (column name is name in csv)
//       .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
//       (data);
//   root.sum(function(d) { return +d.Count }).sort(function(a, b) { return +b.Count - +a.Count; });   // Compute the numeric value for each entity

//   // Then d3.treemap computes the position of each element of the hierarchy
//   // The coordinates are added to the root object above
//   d3.treemap()
//     .size([width, height])
//     .padding(4)
//     (root)

//   // use this information to add rectangles:
//   svg_1
//     .selectAll("rect")
//     .data(root.leaves())
//     .join("rect")
//       .attr('x', function (d) { return d.x0; })
//       .attr('y', function (d) { return d.y0; })
//       .attr('width', function (d) { return d.x1 - d.x0; })
//       .attr('height', function (d) { return d.y1 - d.y0; })
//       .style("stroke", "black")
//       .style("fill", "#69b3a2");

      
//   // and to add the text labels
//   svg_1
//     .selectAll("text")
//     .data(root.leaves())
//     .join("text")
//       .attr("x", function(d){ return d.x0})    // +10 to adjust position (more right)
//       .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
//       .text(function(d){ return d.data.Sport + " " + d.data.Count})
//       .attr("font-size", "10px")
//       .attr("fill", "white")
// // console.log(dataArray);
// });


// Map and projection
// const path = d3.geoPath();
// const projection = d3.geoMercator()
//   .scale(70)
//   .center([0,20])
//   .translate([width / 2, height / 2 + 10]);




// const colorScale = d3.scaleThreshold()
//   .domain(color_domain)
//   .range(d3.schemeBlues[8]);

// var tip = d3.tip()
//   .attr("class","d3-tip")
//   .direction('e')
//   .html(function(event,d,i) {
//       return "<span style='color:red'>" + d.properties.name + "</span>";
//   });

// svg.call(tip);  

// var size=20;
// svg.selectAll("mydots")
//   .data(color_domain)
//   .enter()
//   .append("rect")
//     .attr("x", 50)
//     .attr("y", function(d,i){ return 100 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
//     .attr("width", size)
//     .attr("height", size)
//     .style("fill", function(d){ return colorScale(d)})

// // Add one dot in the legend for each name.
// svg.selectAll("mylabels")
//   .data(color_domain)
//   .enter()
//   .append("text")
//     .attr("x", 50 + size*1.2)
//     .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
//     .style("fill", function(d){ return colorScale(d)})
//     .text(function(d){ return d})
//     .attr("text-anchor", "left")
//     .style("alignment-baseline", "middle");

// d3.json("../olympics/world.geojson").then((function(loadData){
                  //   d3.selectAll("path.Country").remove();
                  //   let topo = loadData
                    
                  //   // Draw the map
                  //   svg.append("g")
                  //     .selectAll("path")
                  //     .data(topo.features)
                  //     .enter()
                  //     .append("path")
                  //       // draw each country
                  //       .attr("d", d3.geoPath()
                  //         .projection(projection)
                  //       )
                  //       // set the color of each country
                  //       .attr("fill", function (d) {
                  //         // console.log(d.id);
                  //         d.total = data.get(d.id) || 0;
                  //         return colorScale(d.total);
                  //       })
                  //       .style("stroke", "transparent")
                  //       .attr("class", function(d){ return "Country" } )
                  //       .style("opacity", .8)
                  //       // .on("click",function(event,d) {
                  //       //   const country = d.id;
                  //       //   // console.log(d);
                  //       //   const params = new URLSearchParams();
                  //       //   params.append("selectedCountry", JSON.stringify(country));
                  //       //   d3.json("http://127.0.0.1:5000/trigger-country" + "?" + params.toString())
                  //       //         .then(function(data) {
                  //       //             // console.log(data);
                  //       //           }).catch(function(error) {
                  //       //             // console.log(error);
                  //       //           });
                  //       // })
                  //       .on("mouseover", function(event,d) {
                  //         tip.show(event,d);
                  //         d3.selectAll(".Country")
                  //         .transition()
                  //         .duration(200)
                  //         .style("opacity", .2)
                  //         d3.select(this)
                  //         .transition()
                  //         .duration(200)
                  //         .style("opacity", 1)
                  //         .style("stroke", "black")
                  //       } )
                  //       .on("mouseleave", function(event,d) {
                  //         tip.hide(event,d);
                  //         d3.selectAll(".Country")
                  //         .transition()
                  //         .duration(200)
                  //         .style("stroke", "transparent") 
                  //         .style("opacity", .8);
                  //         d3.select(this)
                  //         .transition()
                  //         .duration(200)
                  //         .style("stroke", "transparent")
                  //         .style("opacity", .8);
                  //       } )})  )
