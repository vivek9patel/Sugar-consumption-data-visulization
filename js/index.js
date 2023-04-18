const svgMargin = { top: 100, right: 100, bottom: 110, left: 100 };
const highestSugarConsumptionCountries = [
  "Louisiana",
  "Kentucky",
  "West Virginia",
]; // "Mississippi"
const lowestSugarConsumptionCountries = ["Vermont", "Connecticut", "New York"]; // "Minnesota"

// const width =
//     Math.min(700, window.innerWidth - 10) - svgMargin.left - svgMargin.right,
//   height = Math.min(
//     width,
//     window.innerHeight - svgMargin.top - svgMargin.bottom - 20
//   );

const width = 600 - svgMargin.left - svgMargin.right;
const height = width;

const getCSVdata = () =>
  Promise.all([d3.csv("data/education_sugar_cdc_2003.csv")]);

document.addEventListener("DOMContentLoaded", async () => {
  const [highestConsumptionCountryData, lowestConsumptionCountryData] =
    await getData();

  drawRadarChart("highest-consumption", highestConsumptionCountryData);
  drawRadarChart("lowest-consumption", lowestConsumptionCountryData);
});

async function getData() {
  let [raw_data] = await getCSVdata();
  const highestConsumptionCountryData = [],
    lowestConsumptionCountryData = [];
  raw_data.forEach((d) => {
    let newObj = [];
    Object.keys(d).forEach((key) => {
      if (key !== "State") {
        newObj.push({
          axis: key,
          value: +d[key].split(" ")[0],
          state: d["State"],
        });
      }
    });
    if (highestSugarConsumptionCountries.includes(d["State"]))
      highestConsumptionCountryData.push(newObj);
    else if (lowestSugarConsumptionCountries.includes(d["State"]))
      lowestConsumptionCountryData.push(newObj);
  });
  return [highestConsumptionCountryData, lowestConsumptionCountryData];
}

function drawRadarChart(id, data) {
  const radarChartConfig = {
    w: width,
    h: height,
    totalInnerCirclePartitions: 6,
    maxDataValue: 60,
  };

  const axisList = data[0].map((i, j) => i.axis),
    radius = Math.min(radarChartConfig.w / 2, radarChartConfig.h / 2),
    numberPr = d3.format(".2"),
    chartPiece = (Math.PI * 2) / axisList.length;

  const radiusScale = d3
    .scaleLinear()
    .range([0, radius])
    .domain([0, radarChartConfig.maxDataValue]);

  const regionToColor = ["#1577B7","#EDC951","rgb(107,61,155)"]
  const color = d3.scaleOrdinal().range(regionToColor)

  const svg = d3
    .select(`svg#${id}`)
    .attr("width", radarChartConfig.w + svgMargin.left + svgMargin.right)
    .attr("height", radarChartConfig.h + svgMargin.top + svgMargin.bottom);

  const g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (radarChartConfig.w / 2 + svgMargin.left) +
        "," +
        (radarChartConfig.h / 2 + svgMargin.top) +
        ")"
    );

  const gridG = g.append("g").attr("class", "axisWrapper");

  gridG
    .selectAll(".totalInnerCirclePartitions")
    .data(
      d3.range(1, radarChartConfig.totalInnerCirclePartitions + 1).reverse()
    )
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", function (d, i) {
      return (radius / radarChartConfig.totalInnerCirclePartitions) * d;
    })
    .style("fill", "#CDCDCD")
    .style("stroke", "#CDCDCD")
    .style("fill-opacity", 0.3)
    .style("filter", "url(#glow)");

  gridG
    .selectAll(".axisLabel")
    .data(
      d3.range(1, radarChartConfig.totalInnerCirclePartitions + 1).reverse()
    )
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", function (d) {
      return (-d * radius) / radarChartConfig.totalInnerCirclePartitions;
    })
    .attr("dy", "0.4em")
    .style("font-size", "12px")
    .attr("fill", "#737373")
    .text(function (d, i) {
      return numberPr(
        (radarChartConfig.maxDataValue * d) /
          radarChartConfig.totalInnerCirclePartitions
      );
    });

  const axis = gridG
    .selectAll(".axis")
    .data(axisList)
    .enter()
    .append("g")
    .attr("class", "axis");

  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", function (d, i) {
      return (
        radiusScale(radarChartConfig.maxDataValue * 1.1) *
        Math.cos(chartPiece * i - Math.PI / 2)
      );
    })
    .attr("y2", function (d, i) {
      return (
        radiusScale(radarChartConfig.maxDataValue * 1.1) *
        Math.sin(chartPiece * i - Math.PI / 2)
      );
    })
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-width", "2px");

  axis
    .append("text")
    .attr("class", "legend")
    .style("font-size", "14px")
    .style("fill", "#737373")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("x", function (d, i) {
      return (
        radiusScale(radarChartConfig.maxDataValue * 1.25) *
        Math.cos(chartPiece * i - Math.PI / 2)
      );
    })
    .attr("y", function (d, i) {
      return (
        radiusScale(radarChartConfig.maxDataValue * 1.25) *
        Math.sin(chartPiece * i - Math.PI / 2)
      );
    })
    .text(function (d) {
      return d;
    });

  const radarLine = d3
    .lineRadial()
    .curve(d3.curveCardinalClosed)
    .radius(function (d) {
      return radiusScale(d.value);
    })
    .angle(function (d, i) {
      return i * chartPiece;
    });

  const blobWrapper = g
    .selectAll(".radarWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("fill", function (d, i) {
      return color(i);
    })
    .style("fill-opacity", 0.4)
    .on("mouseover", function (d, i) {
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);

      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      d3.selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.4);
    });

  blobWrapper
    .append("path")
    .attr("class", "radarStroke")
    .attr("d", function (d, i) {
      return radarLine(d);
    })
    .style("stroke-width", 2 + "px")
    .style("stroke", function (d, i) {
      return color(i);
    })
    .style("fill", "none")
    .style("filter", "url(#glow)");

  blobWrapper
    .selectAll(".radarCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", 5)
    .attr("cx", function (d, i) {
      return radiusScale(d.value) * Math.cos(chartPiece * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return radiusScale(d.value) * Math.sin(chartPiece * i - Math.PI / 2);
    })
    .style("fill", function (d, i, j) {
      return color(j);
    })
    .style("fill-opacity", 0.8);

  const blobCircleWrapper = g
    .selectAll(".radarCircleWrapper")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "radarCircleWrapper");

  blobCircleWrapper
    .selectAll(".radarInvisibleCircle")
    .data(function (d, i) {
      return d;
    })
    .enter()
    .append("circle")
    .attr("class", "radarInvisibleCircle")
    .attr("r", 5 * 1.5)
    .attr("cx", function (d, i) {
      return radiusScale(d.value) * Math.cos(chartPiece * i - Math.PI / 2);
    })
    .attr("cy", function (d, i) {
      return radiusScale(d.value) * Math.sin(chartPiece * i - Math.PI / 2);
    })
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function (d, i) {
      newX = parseFloat(d3.select(this).attr("cx")) - 10;
      newY = parseFloat(d3.select(this).attr("cy")) - 10;
      tooltip
        .attr("x", newX)
        .attr("y", newY)
        .text(numberPr(i.value))
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function () {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  const tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

  // label for regionToColor, put it in bottom left corner
  const legend = g.append("g").attr("class", "colorLegend")
    .attr("transform", "translate(" + -120 + "," + (height-100) + ")");

  
  legend
    .selectAll("rect")
    .data(regionToColor)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      return i * 100;
    })
    .attr("y", function (d, i) {
      return 0;
    })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", (d) => d);

  legend
    .selectAll("text")
    .data(regionToColor)
    .enter()
    .append("text")
    .text(function (d,i) {
      return data[i][0].state;
    })
    .attr("x", function (d, i) {
      return i * 100 + 15;
    })
    .attr("y", 6)
    .style("font-size", "12px")
    .style("fill", "black")
    .style("text-anchor", "start")
    .style("alignment-baseline", "middle");

}
