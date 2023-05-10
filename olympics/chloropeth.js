var width = 1300, height = 45;
const svg = d3.select(".slider").append("svg")
                .attr("width",width)
                .attr("height",height);

const data1 = d3.range(0, 124,4).map(function (d) {
  return new Date(1896 + d, 10, 3);
});

var data2 = d3.range(0, 72,4).map(function (d) {
  return new Date(1924 + d, 10, 3);
});

var data3 = d3.range(0, 24,4).map(function (d) {
  return new Date(1994 + d, 10, 3);
});

const data4 = data2.concat(data3)

var year;
var season;
var countries_list;

window.onload = function() {
    year = 1896;
    season = "Summer";
    countries_list = 1;
    update_slider(season);
    // const country = '';
    const params = new URLSearchParams();
    // const params_1 = new URLSearchParams();
    params.append("selectedYear", JSON.stringify(year));
    params.append("selectedSeason", JSON.stringify(season));
    params.append("selectedPcaCountries", JSON.stringify(countries_list));
    // params_1.append("selectedCountry", JSON.stringify(country));
    d3.json("http://127.0.0.1:5000/trigger-script" + "?" + params.toString())
          .then(function(data) {
              // console.log(data);
              
            }).catch(function(error) {
              // console.log(error);
            });
};

// var allGroup = ["Summer", "Winter"];

// add the options to the button
// d3.select(".dropdown")
//   .selectAll('myOptions')
//     .data(allGroup)
//   .enter()
//   .append('option')
//   .text(function (d) { return d; }) // text showed in the menu
//   .attr("value", function (d) { return d; });

// d3.select(".dropdown").on("change", function(d){
//     selectedGroup = this.value;
//     season = this.value;
//     countries_list = 1;
//     if(season === "Summer") 
//       year = 1896;
//     else
//       year = 1924; 
//     update_slider(season);
//     const params = new URLSearchParams();
//     params.append("selectedYear", JSON.stringify(year));
//     params.append("selectedSeason", JSON.stringify(season));
//     params.append("selectedPcaCountries", JSON.stringify(countries_list));
//     // params_1.append("selectedCountry", JSON.stringify(country));
//     d3.json("http://127.0.0.1:5000/trigger-script" + "?" + params.toString())
//           .then(function(data) {
//               // console.log(data);
              
//             }).catch(function(error) {
//               // console.log(error);
//             });
// });

d3.selectAll('input[name="controlHeatmapType"]').on("change", function() {
  // code to handle change event
  season = d3.select('input[name="controlHeatmapType"]:checked').node().value;
  // console.log("Selected value: " + season);
  countries_list = 1;

  if(season === "Summer") {
      year = 1896;
      d3.select("body").style("background-color", "#FFD700");
  }
    else {
      year = 1924;
      d3.select("body").style("background-color", "#e0fbfc");
    } 
    update_slider(season);
    const params = new URLSearchParams();
    params.append("selectedYear", JSON.stringify(year));
    params.append("selectedSeason", JSON.stringify(season));
    params.append("selectedPcaCountries", JSON.stringify(countries_list));

    // params_1.append("selectedCountry", JSON.stringify(country));
    d3.json("http://127.0.0.1:5000/trigger-script" + "?" + params.toString())
          .then(function(data) {
              // console.log(data);
              
            }).catch(function(error) {
              // console.log(error);
            });
});


function update_slider(season) {

  svg.selectAll("*").remove();

const slider = d3.sliderBottom()
  .min(season === 'Summer' ? d3.min(data1) : d3.min(data4))
  .max(season === 'Summer' ? d3.max(data1) : d3.max(data4))
  .step(season === 'Summer' ? 1000 * 60 * 60 * 24 * 365 * 4 : 1000 * 60 * 60 * 24 * 365 *2)
  .width(1240)
  .tickFormat(d3.timeFormat('%Y'))
  .tickValues(season === 'Summer' ? data1: data4)
  .default(season === 'Summer' ? new Date(1896, 10, 3): new Date(1924, 10, 3))
  .on('end', (val) => {
    year = val.getFullYear();
    countries_list = 1;
    const params = new URLSearchParams();
    params.append("selectedYear", JSON.stringify(year));
    params.append("selectedSeason", JSON.stringify(season));
    params.append("selectedPcaCountries", JSON.stringify(countries_list));
    d3.json("http://127.0.0.1:5000/trigger-script" + "?" + params.toString())
          .then(function(data) {
              // console.log(data);
            }).catch(function(error) {
              // console.log(error);
            });
  });


svg.append("g").attr('transform', 'translate(30,10)')
            .call(slider);

}

var format = function(d) {
  return d3v5.format('d')(d);
}

var map = d3.choropleth()
.geofile('./olympics/world.json')
.colors(d3v5.schemeOrRd[9])
.column('Count')
.format(format)
.translate([330,183])
.width(700)
.height(350)
.legend(true)
.unitId('iso3');
  
var socket = io.connect('http://127.0.0.1:5000');
socket.on('updated-map-json', function(jsonString) {
              var selection = d3v5.selectAll('#geomap');
              // console.log(year);            
              // Check if the selection is not empty
              if (!selection.empty()) {
                  // Remove the geomap element
                  d3v5.selectAll('#geomap').remove();
              }
              // d3v5.selectAll('#geomap').remove();
              var d = JSON.parse(jsonString);
              //console.log(d.country_counts);
              const jsonData=[];
              if(year == 1916 || year == 1940 || year == 1944) {
                svg.append("text")
                .attr("x", width_1 / 2 )
                .attr("y", -margin_1.top / 2 + 200)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text("NO OLYMPICS WERE HELD!!!!!!");
              } else {

              Object.keys(d.iso3).forEach(key => {
                jsonData.push({
                  iso3: d.iso3[key],
                  Count: +d.Count[key]
                });
              });

              var newSelection = d3v5.select('.top-section')
                  .insert('div', '#barchart')
                  .attr('class', 'd3-geomap')
                  .attr('id', 'geomap');

              map.draw(newSelection.datum(jsonData));}
              // var selection = d3v5.select('#geomap').datum(jsonData);
              // map.draw(selection);                    
            });
      
var margin_1 = {top: 20, right: 30, bottom: 40, left: 100},
    width_1 = 650 - margin_1.left - margin_1.right,
    height_1 = 350 - margin_1.top - margin_1.bottom;

// append the svg object to the body of the page
const svg_1 = d3.select("#barchart")
  .append("svg")
    .attr("width", width_1 + margin_1.left + margin_1.right)
    .attr("height", height_1 + margin_1.top + margin_1.bottom)
  .append("g")
    .attr("transform", `translate(${margin_1.left + 35}, ${margin_1.top -10})`);

var tip_1 = d3.tip()
  .attr("class","d3-tip")
  .direction('e')
  .html(function(event,d,i) {
      return "<span style='color:red'>" + (+d.Count) + "</span>";
  });

svg_1.call(tip_1);  

// var tip_1 = d3.tip()
//   .attr("class","d3-tip")
//   .direction('e')
//   .html(function(event,d,i) {
//       return "<span style='color:red'>" + d.Sport + ": " +(+d.Count) + "</span>";
//   });

// svg_1.call(tip_1);  

socket.on('updated-barchart-json', function(jsonString) {
      svg_1.selectAll("*").remove();

      var d = JSON.parse(jsonString);
      
      // const isEmpty = Object.keys(d.Sport).every(key => !d.Sport[key]) && Object.values(d.Count).every(count => count === 0);
      if(year == 1916 || year == 1940 || year == 1944) {
          svg_1.append("text")
          .attr("x", width_1 / 2 )
          .attr("y", -margin_1.top / 2 + 180)
          .attr("text-anchor", "middle")
          .style("font-size", "24px")
          .text("NO OLYMPICS WERE HELD!!!!!!");        
      } else {
      const jsonData=[]
      
      Object.keys(d.Sport).forEach(key => {
        jsonData.push({
          Sport: d.Sport[key],
          Count: +d.Count[key]
        });
      });

      jsonData.sort((a, b) => b.Count - a.Count);
      console.log();
        const x = d3.scaleLinear()
        .domain([0,d3.max(jsonData, d=> d.Count)])
        .range([ 0, width_1]);
        
        svg_1.append("g")
          .attr("transform", `translate(0, ${height_1})`)
          .call(d3.axisBottom(x))
          .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    
        // Y axis
        const y = d3.scaleBand()
          .range([ 0, height_1 ])
          .domain(jsonData.map(d => d.Sport))
          .padding(.1);
        
          svg_1.append("g")
          .call(d3.axisLeft(y))
    
      //Bars
      if(jsonData.length == 1) {
        svg_1.selectAll("myRect")
        .data(jsonData)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => y(d.Sport) + 40)
        .attr("width", 0) // Set initial width to 0 for transition
        .attr("height", y.bandwidth() / 2)
        .on("mouseover", function(event, d) {tip_1.show(event,d);})
        .on("mouseleave", function(event, d) {tip_1.hide(event,d);})
        .attr("fill", "#69b3a2")
        .transition() // Add transition effect
        .duration(1000) // Set duration for transition
        .attr("width", d => x(+d.Count));
      }
      else if(jsonData.length >=2 && jsonData.length <=4) {
        svg_1.selectAll("myRect")
        .data(jsonData)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => y(d.Sport) + 15)
        .attr("width", 0) // Set initial width to 0 for transition
        .attr("height", y.bandwidth() / 2)
        .on("mouseover", function(event, d) {tip_1.show(event,d);})
        .on("mouseleave", function(event, d) {tip_1.hide(event,d);})
        .attr("fill", "#69b3a2")
        .transition() // Add transition effect
        .duration(1000) // Set duration for transition
        .attr("width", d => x(+d.Count));

      } else {

        svg_1.selectAll("myRect")
        .data(jsonData)
        .join("rect")
        .attr("x", 0)
        .attr("y", d => y(d.Sport) + 5)
        .attr("width", 0) // Set initial width to 0 for transition
        .attr("height", y.bandwidth() / 2)
        .on("mouseover", function(event, d) {tip_1.show(event,d);})
        .on("mouseleave", function(event, d) {tip_1.hide(event,d);})
        .attr("fill", "#69b3a2")
        .transition() // Add transition effect
        .duration(1000) // Set duration for transition
        .attr("width", d => x(+d.Count)); 
      }

      svg_1.append("text")
        .attr("x", width_1/2 - 70)
        .attr("y", height_1 + margin_1.top +24)
        .text("Number of athletes");
      } 
    });

// socket.on('updated-barchart-json', function(jsonString) {
//   svg_1.selectAll("*").remove();

//   var d = JSON.parse(jsonString);
  
//   // const isEmpty = Object.keys(d.Sport).every(key => !d.Sport[key]) && Object.values(d.Count).every(count => count === 0);
//   if(year == 1916 || year == 1940 || year == 1944) {
//       svg_1.append("text")
//       .attr("x", width_1 / 2  + 170)
//       .attr("y", -margin_1.top / 2 + 200)
//       .attr("text-anchor", "middle")
//       .style("font-size", "24px")
//       .text("NO OLYMPICS WERE HELD!!!!!!");
    
//   } else {
//   const jsonData=[]
  
//   Object.keys(d.Sport).forEach(key => {
//     jsonData.push({
//       Sport: d.Sport[key],
//       Count: +d.Count[key]
//     });
//   });

//   // jsonData.sort((a, b) => b.Count - a.Count);

//   const size = d3.scaleLinear()
//     .domain([0,d3.max(jsonData, d=> d.Count)])
//     .range([7,50])  // circle will be between 7 and 55 px wide

  
//   // Initialize the circle: all located at the center of the svg area
//   var node = svg_1.append("g")
//     .selectAll("circle")
//     .data(jsonData)
//     .join("circle")
//       .attr("class", "node")
//       .attr("r", d => size(d.Count))
//       .attr("cx", width_1 / 2)
//       .attr("cy", height_1 / 2)
//       .style("fill", "blue")
//       .style("fill-opacity", 0.8)
//       .attr("stroke", "black")
//       .style("stroke-width", 1)
//       .on("mouseover", function(event, d) {tip_1.show(event,d);})
//       .on("mouseleave", function(event, d) {tip_1.hide(event,d);})
//       .call(d3.drag() // call specific function when circle is dragged
//            .on("start", dragstarted)
//            .on("drag", dragged)
//            .on("end", dragended));

//   // Features of the forces applied to the nodes:
//   const simulation = d3.forceSimulation()
//       .force("center", d3.forceCenter().x(width_1 / 2).y(height_1 / 2)) // Attraction to the center of the svg area
//       .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
//       .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.Count)+3) }).iterations(1)) // Force that avoids circle overlapping

//   // Apply these forces to the nodes and update their positions.
//   // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
//   simulation
//       .nodes(jsonData)
//       .on("tick", function(d){
//         node
//             .attr("cx", d => d.x)
//             .attr("cy", d => d.y)
//       });

//   // What happens when a circle is dragged?
//   function dragstarted(event, d) {
//     if (!event.active) simulation.alphaTarget(.03).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }
//   function dragged(event, d) {
//     d.fx = event.x;
//     d.fy = event.y;
//   }
//   function dragended(event, d) {
//     if (!event.active) simulation.alphaTarget(.03);
//     d.fx = null;
//     d.fy = null;
//   }  
//   } 
// });
    

var margin = {top: 20, right: 10, bottom: 10, left: 55},
    width = 460 - margin.left - margin.right,
    height = 290 - margin.top - margin.bottom;

var x = d3v3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var line = d3v3.svg.line(),
    axis = d3v3.svg.axis().orient("left"),
    background,
    foreground;
var selected = [];

var svg_2 = d3v3.select(".pcp").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

socket.on('updated-pcp-json', function(jsonString) {

  svg_2.selectAll("*").remove();
  var d = JSON.parse(jsonString);  
  if(year == 1916 || year == 1940 || year == 1944) {
    // svg_2.append("text")
    //       .attr("x", width_1 / 2 )
    //       .attr("y", -margin_1.top / 2 + 200)
    //       .attr("text-anchor", "middle")
    //       .style("font-size", "24px")
    //       .text("");
    
  var pcp = document.querySelectorAll('.pcp');
  for (var i = 0; i < pcp.length; i++) {
      pcp[i].classList.add('hidden');
  }
  } else {
  
    var pcp = document.querySelectorAll('.pcp');
    for (var i = 0; i < pcp.length; i++) {
      if (pcp[i].classList.contains('hidden')) {
        pcp[i].classList.remove('hidden');
      } 
    } 
  const olympics=[]
      
  Object.keys(d.Age).forEach(key => {
    olympics.push({
      ID: +d.ID[key],
      Age: +d.Age[key],
      Height: +d.Height[key],
      Weight: +d.Weight[key],
      Sex: d.Sex[key]
    });
  });

  

  dimensions = d3v3.keys(olympics[0]).filter(function(d) { return d !== "ID"; });  
  dimensions.forEach(function(attr) {
        if (attr === "Sex"){
          var domain = [];
          olympics.forEach(function(row){
            var index = domain.indexOf(row[attr]);
            if (index === -1){ // Does not exists
              domain.push(row[attr]);
            }
          })
          y[attr] = d3v3.scale.ordinal()
                          .domain(domain)
                          .rangePoints([height, 0], 1);
        }
       
        else {
          y[attr] = d3v3.scale.linear()
                          .domain(d3v3.extent(olympics, function(row) { return +row[attr]; }))
                          .range([height, 0]);
        }
    });

  x.domain(dimensions);

  // Add grey background lines for context.
  background = svg_2.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(olympics)
    .enter().append("path")
      .attr("d", path_1);

  // Add blue foreground lines for focus.
  foreground = svg_2.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(olympics)
    .enter().append("path")
      .style("stroke", "#87CEEB")
      .attr("d", path_1);
  
  // Add a group element for each dimension.
  var g = svg_2.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3v3.behavior.drag()
            .on("dragstart", function(d) {
              dragging[d] = this.__origin__ = x(d);
              background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
              dragging[d] = Math.min(width, Math.max(0, this.__origin__ += d3v3.event.dx));
              foreground.attr("d", path_1);
              dimensions.sort(function(a, b) { return position(a) - position(b); });
              x.domain(dimensions);
              g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
              delete this.__origin__;
              delete dragging[d];
              d3v3.select(this).attr("transform", "translate(" + x(d) + ")").transition().duration(500);
              foreground.transition().duration(500).attr("d", path_1);
              background
                  .attr("d", path_1)
                  .transition()
                  .delay(500)
                  .duration(0)
                  .attr("visibility", null);
            }));


  g.append("g")
            .attr("class", "axis")
            .each(function(d) {
                return d3v3.select(this).call(axis.scale(y[d]))
              })
          .append("text")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .attr("font-size", "10px")
            .attr("y", -9)
            .text(function(d) { return d; });


  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3v3.select(this).call(y[d].brush = d3v3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush).on("brushend",brushend));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
    }
  
})


function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path_1(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3v3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  selected = [];
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { 
      
          return y[p].brush.extent(); 
         
      });
  foreground.style("display", function(d) {
    var isVisible = actives.every(function(p, i) {
       if(p === "Sex") {
        return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
       } else { 
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];}
      })
      if (isVisible) {
        
        selected.push(d.ID);
      }
      
      // d3.json("http://127.0.0.1:5000/trigger-pcp" + "?" + params.toString())
      //       .then(function(data) {
      //           // console.log(data);
      //         }).catch(function(error) {
      //           // console.log(error);
      //         });
      // console.log(selected);
      return isVisible ? null : "none";
  });
}

function brushend() {
      const params = new URLSearchParams();
      params.append("selectedPCPLines", JSON.stringify(selected));
      _.debounce(function() {
        d3.json("http://127.0.0.1:5000/trigger-pcp" + "?" + params.toString())
          .then(function(data) {
            // console.log(data);
          }).catch(function(error) {
            // console.log(error);
          });
      }, 100)();
}

// set the dimensions and margins of the graph
var margin_pca = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin_pca.left - margin_pca.right,
    height = 290 - margin_pca.top - margin_pca.bottom;

// append the svg object to the body of the page
var svg_pca = d3v5.select(".pca")
.append("svg")
    .attr("width", width + margin_pca.left + margin_pca.right)
    .attr("height", height + margin_pca.top + margin_pca.bottom)
.append("g")
    .attr("transform",
        "translate(" + margin_pca.left + "," + margin_pca.top + ")");


socket.on('updated-pca-json', function(jsonString) {
      svg_pca.selectAll("*").remove();
      // var json_data = JSON.parse('{{ data|safe }}');
      if(year == 1916 || year == 1940 || year == 1944) {
        // svg_pca.append("text")
        // .attr("x", width / 2  + 170)
        // .attr("y", -margin_pca.top / 2 + 200)
        // .attr("text-anchor", "middle")
        // .style("font-size", "24px")
        // .text("NO OLYMPICS WERE HELD!!!!!!");

        var pca = document.querySelectorAll('.pca');
        for (var i = 0; i < pca.length; i++) {
            pca[i].classList.add('hidden');
        }
      
    } else {

      var pca = document.querySelectorAll('.pca');
      for (var i = 0; i < pca.length; i++) {
        if (pca[i].classList.contains('hidden')) {
          pca[i].classList.remove('hidden');
        } 
      }

      var json_data = JSON.parse(jsonString);
      let pca_data = json_data.pca_results;
      let countries = json_data.countries;
      let country_names = json_data.country_names;
      
      let data = pca_data;


      let max_X = 0, max_Y = 0, min_X = Number.POSITIVE_INFINITY, min_Y = Number.POSITIVE_INFINITY;
      for(let i = 0; i <pca_data.length; i++) {

          if(max_X <pca_data[i][0]) {max_X =pca_data[i][0]};
          if(min_X >pca_data[i][0]) {min_X =pca_data[i][0]};
          
          if(min_Y >pca_data[i][1]) {min_Y =pca_data[i][1]};
          if(max_Y <pca_data[i][1]) {max_Y =pca_data[i][1]};
      }

      // Add X axis
      var x = d3v5.scaleLinear()
          .domain([min_X, max_X])
          .range([ 0, width ]);
      svg_pca.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3v5.axisBottom(x));

      // Add Y axis
      var y = d3v5.scaleLinear()
          .domain([min_Y, max_Y])
          .range([ height, 0]);
          
      svg_pca.append("g")
          .call(d3v5.axisLeft(y));

      // Color scale: give me a specie name, I return a color
      // var color = d3.scaleOrdinal()
      // .domain(countries) // Replace with your actual array of country names
      // .range(d3.schemeCategory20b); // You can use any predefined color scheme from the library

      var color = d3v5.scaleOrdinal()
          .domain(countries)
          .range(d3v5.schemeSet2);

      // Add dots
      var myCircle = svg_pca.append('g')
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", function (d) {  return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", 5)
          // .style("fill", "#FF0000")
          .style("fill", function (d) { return color(countries) } )
          .style("opacity", 0.5)

      svg_pca.append('g')
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
          .attr("x", function (d) { return x(d[0]) + 8; }) // Adjust the x position to add some padding
          .attr("y", function (d) { return y(d[1]) + 4; }) // Adjust the y position to add some padding
          .text(function(d, i) { return country_names[i]; }) // Set the text content to the country name
          .attr("font-size", "6.5px") // Set the font size
          .attr("fill", "black"); // Set the text color


      // Add brushing
      svg_pca
          .call( d3v5.brush()                 // Add the brush feature using the d3.brush function
          .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
          .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
          .on("end", sendCountries)
          )

      svg_pca.call(d3v5.brush().move, null);

      // // Function that is triggered when brushing is performed
      // function updateChart() {
      //     extent = d3v5.event.selection
      //     myCircle.classed("selected", function(d){  return isBrushed(extent, x(d[0]), y(d[1]) ) } )
      // }
      
      var brushedData = new Set(); // initialize an empty array to store brushed data

      function updateChart() {
        brushedData = new Set();
        extent = d3v5.event.selection;
        myCircle.classed("selected", function(d,i) {
          var isBrushed_pca = extent ? isBrushed(extent, x(d[0]), y(d[1])) : false;
          if (isBrushed_pca) {
            brushedData.add(country_names[i]); // push the brushed data into the array
          }
          console.log(brushedData)
          return isBrushed_pca;
        });
      }

      function sendCountries() {

      var countries = [...brushedData]
      const params = new URLSearchParams();
      params.append("selectedPcaCountries", JSON.stringify(countries));
      _.debounce(function() {
        d3.json("http://127.0.0.1:5000/trigger-pca" + "?" + params.toString())
          .then(function(data) {
            // console.log(data);
          }).catch(function(error) {
            // console.log(error);
          });
      }, 100)();

      }

      // A function that return TRUE or FALSE according if a dot is in the selection or not
      function isBrushed(brush_coords, cx, cy) {
          var x0 = brush_coords[0][0],
              x1 = brush_coords[1][0],
              y0 = brush_coords[0][1],
              y1 = brush_coords[1][1];
          return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
      }
    }

})
// PIE CHART 

var margin_pie = {top: 20, right: 10, bottom: 10, left: 45},
    width_1 = 450 - margin_pie.left - margin_pie.right,
    height_1 = 290 - margin_pie.top - margin_pie.bottom;

var radius = 100;

// append the svg object to the body of the page
const svg_pie = d3.select(".pie")
  .append("svg")
    .attr("width", width_1 + margin_pie.left + margin_pie.right)
    .attr("height", height_1 + margin_pie.top + margin_pie.bottom)
  .append("g")
    .attr("transform", `translate(${margin_pie.left + 125}, ${margin_pie.top + 130})`);

var tip_pie = d3.tip()
  .attr("class","d3-tip")
  .direction('e')
  .html(function(event,d,i) {
      return "<span style='color:red'>" + (+d.data[1]) + "</span>";
  });

svg_pie.call(tip_pie);  

socket.on('updated-pie-json', function(jsonString) {

  svg_pie.selectAll("*").remove();
      if(year == 1916 || year == 1940 || year == 1944) {
        // svg_pie.append("text")
        // .attr("x", width_1 / 2  + 170)
        // .attr("y", -margin_pie.top / 2 + 200)
        // .attr("text-anchor", "middle")
        // .style("font-size", "24px")
        // .text("");
        var pie_chart = document.querySelectorAll('.pie');
        for (var i = 0; i < pie_chart.length; i++) {
          
            pie_chart[i].classList.add('hidden');
          
        }

      }
      
     else {

      var pie_chart = document.querySelectorAll('.pie');
      for (var i = 0; i < pie_chart.length; i++) {
        if (pie_chart[i].classList.contains('hidden')) {
          pie_chart[i].classList.remove('hidden');
        } 
      }
      var data = JSON.parse(jsonString);

      // const color = d3.scaleOrdinal()
      //   .range(d3.schemeSet2);
      const color = d3.scaleOrdinal()
        .domain(["Gold", "Silver", "Bronze", "No_medal"])
        .range(["#FFD700", "#C0C0C0", "#CD7F32", "#add8e6"]);

      // Compute the position of each group on the pie:
      const pie = d3.pie()
        .value(function(d) {return d[1]})
      const data_ready = pie(Object.entries(data))
      // Now I know that group A goes from 0 degrees to x degrees and so on.

      // shape helper to build arcs:
      const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

      // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
      svg_pie
  .selectAll('mySlices')
  .data(data_ready)
  .join('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data[0])) })
    .attr("stroke", "black")
    .on("mouseover", function(event, d) {tip_pie.show(event,d);})
    .on("mouseleave", function(event, d) {tip_pie.hide(event,d);})
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .transition()
      .duration(500)
      .attrTween('d', function(d) {
        var startAngle = 0;
        var endAngle = 0;
        var interpolation = d3.interpolate(startAngle, d.endAngle);

        return function(t) {
          endAngle = interpolation(t);
          d.endAngle = endAngle;
          return arcGenerator(d);
        };
      })
      .attr('fill', function(d){ return(color(d.data[0])) });


      // Now add the annotation. Use the centroid method to get the best coordinates
      // svg_pie
      //   .selectAll('mySlices')
      //   .data(data_ready)
      //   .join('text')
      //   .text(function(d){ return d.data[0]})
      //   .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
      //   .style("text-anchor", "middle")
      //   .style("font-size", 12);

    
    // again rebind for legend
    var legendG = svg_pie.selectAll(".legend") // note appending itsvg_pie and not svg to make positioning easier
    .data(data_ready)
    .enter().append("g")
    .attr("transform", function(d,i){
      return "translate(" + (width - 200) + "," + (i * 15 - 130) + ")"; // place each legend on the right and bump each one down 15 pixels
    })
    .attr("class", "legend");   

    legendG.append("rect") // make a matching color rect
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", function(d, i) {
      return color(i);
    });

    legendG.append("text") // add the text
    .text(function(d){
      return d.data[0]
    })
    .style("font-size", 12)
    .attr("y", 10)
    .attr("x", 11);

     }


})





