
global_data = null    
sources=[]
application=[]
var getTraffic = function(postal) {
    //Define URL
    var url = postal;
    //Define XML request
    var xmlHttp =  new XMLHttpRequest();
    //Define state change
    xmlHttp.onreadystatechange = function() {
        //Validate state
        if(xmlHttp.readyState === 4)
            //Validate status the Server
            if(xmlHttp.status === 200) {
                //Insert code
              data = JSON.parse(xmlHttp.response)
              global_data = data
              short_data = cut_information(data)
              plot(data,'recv','sent','labels',"#all")
              plot(short_data,'recv','sent','labels',"#zoom")
              concated= application.map(function (num, idx) {
                          return num +'--'+ sources[idx];
                        });
              console.log(concated)
              short_data_2 = short_data.map(function(d){
                d['concated'] = d.application +'--'+ d.destination 
                return d
              })
              console.log(short_data_2)
              new_data = short_data_2.filter(function(d){
                return (concated.indexOf(d.concated ) < 0)
              })
              console.log(new_data)
              plot_big(new_data,'recv','sent','labels','numClients',"#bigs")

          }
    };
    //Open connection to server
    xmlHttp.open('GET', url, true);
    //Send petition
    xmlHttp.send();
}
var getSources = function(postal) {
    //Define URL
    var url = postal;
    //Define XML request
    var xmlHttp =  new XMLHttpRequest();
    //Define state change
    xmlHttp.onreadystatechange = function() {
        //Validate state
        if(xmlHttp.readyState === 4)
            //Validate status the Server
            if(xmlHttp.status === 200) {
                //Insert code
              data = JSON.parse(xmlHttp.response)
              sources=[]
              application=[]
              for (var i = data.length - 1; i >= 0; i--) {
                sources.push(data[i].destination)
                application.push(data[i].application)
              }

              getTraffic('php/api.php?command=getTransactions')

          }
    };
    //Open connection to server
    xmlHttp.open('GET', url, true);
    //Send petition
    xmlHttp.send();
}
$(document).ready(function(){
  getSources('php/api.php?command=getOriginalSource')
})
function cut_information(data){
  return data.filter(function(d){
    return (d['recv'] < 1000 && d['sent'] < 1000 )
  })
}
function plot(data,x_column,y_column,c_column,identifier){
  // Variables
  var body = d3.select(identifier)
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var h = 600 - margin.top - margin.bottom
  var w = 600 - margin.left - margin.right
  var formatPercent = d3.format('.2%')
  // Scales
  var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[x_column] })]),
      d3.max([0,d3.max(data,function (d) { return d[x_column] })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[y_column] })]),
      d3.max([0,d3.max(data,function (d) { return d[y_column] })])
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(5)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
  // Circles
  stroke_size = 3
  stroke_transition = 5
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d[x_column]) })
      .attr('cy',function (d) { return yScale(d[y_column]) })
      .attr('r',stroke_size)
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(d[c_column]) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',stroke_transition)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',stroke_size)
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return 'Application : '+d.application +
                           '\n'+'Destination : ' + (d.destination) +
                           '\n'+x_column+': ' + (d[x_column]) +
                           '\n'+y_column+': ' + (d[y_column]) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Received')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Sent')
    }
function plot_big(data,x_column,y_column,c_column,s_column,identifier){
  // Variables
  var body = d3.select(identifier)
  var margin = { top: 50, right: 50, bottom: 50, left: 100 }
  var h = 600 - margin.top - margin.bottom
  var w = 600 - margin.left - margin.right
  var formatPercent = d3.format('.2%')
  // Scales
  var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[x_column] })]),
      d3.max([0,d3.max(data,function (d) { return d[x_column] })])
      ])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
      d3.min([0,d3.min(data,function (d) { return d[y_column] })]),
      d3.max([0,d3.max(data,function (d) { return d[y_column] })])
      ])
    .range([h,0])
  // SVG
  var svg = body.append('svg')
      .attr('height',h + margin.top + margin.bottom)
      .attr('width',w + margin.left + margin.right)
    .append('g')
      .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
  // X-axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(5)
    .orient('bottom')
  // Y-axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient('left')
  // Circles
  stroke_size = 3
  stroke_transition = 5
  max_s =  d3.max(data,function (d) { return d[s_column] })
  console.log(max_s)
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d[x_column]) })
      .attr('cy',function (d) { return yScale(d[y_column]) })
      .attr('r',function (d) { return (50*(d[s_column]/max_s)) })
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return colorScale(d[c_column]) })
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',stroke_transition)
          .attr('stroke-width',3)
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('r',function (d) { return (70*(d[s_column]/max_s)) })
          .attr('stroke-width',1)
      })
    .append('title') // Tooltip
      .text(function (d) { return 'Application : '+d.application +
                           '\n'+'Destination : ' + (d.destination) +
                           '\n'+'numClients : ' + (d.numClients) +
                           '\n'+x_column+': ' + (d[x_column]) +
                           '\n'+y_column+': ' + (d[y_column]) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',-10)
      .attr('x',w)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Received')
  // Y-axis
  svg.append('g')
      .attr('class', 'axis')
      .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',0)
      .attr('y',5)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Sent')
    }