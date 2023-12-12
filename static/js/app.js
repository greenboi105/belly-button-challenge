const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

const dropdown = d3.select("#selDataset");

// Call setDemographicInfo() and 
function init() {

  d3.json(url).then(function(data) {
    let dropDown = d3.select("#selDataset");

    data.names.forEach(function(name) {
      dropDown.append("option").text(name).property("value", name);
    });
    
    let firstValue = data.names[0];

    optionChanged(firstValue)
  })
}

function optionChanged(selectedValue) {

  buildBubbleChart(selectedValue);
  buildBarChart(selectedValue);
  setDemographicInfo(selectedValue);

}

function buildBubbleChart(selectedValue) {

  d3.json(url).then(function(data){

    let bubbleChart = d3.select("#bubble");
    bubbleChart.html("");

    sample_data = data.samples.filter(entry => entry.id == selectedValue)[0]

    var trace1 = {
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      text: sample_data.otu_labels,
      mode: 'markers',
      marker: {
        size: sample_data.sample_values,
        color: sample_data.otu_ids,
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: "Patient Bubble Chart",
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"}
    };
    
    Plotly.newPlot('bubble', data, layout);
  });
}

function buildBarChart(selectedValue) {
  d3.json(url).then(function(data){

    let barChart = d3.select("#bar");

    barChart.html("");

    sample_data = data.samples.filter(entry => entry.id == selectedValue)[0]

    let trace = {
      x: sample_data.sample_values.slice(0, 10).reverse(),
      y: sample_data.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`),
      text: sample_data.otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };

    let layout = {
      title: "Top 10 OTUs",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU IDs"}
    };

    data = [trace];

    Plotly.newPlot("bar", data, layout);

  });
}

function setDemographicInfo(value) {
  d3.json(url).then(function(data) {

    metadata = data.metadata
    metadata_result = metadata.filter(x => x.id == value)

    metadata_table = d3.select("#sample-metadata")
    metadata_table.html("");
    for (key in metadata_result[0]) {
      metadata_table.append(`h5`).text(`${key}: ${metadata_result[0][key]}`)
    }
  });
}

init();
