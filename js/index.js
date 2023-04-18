const highestSugarConsumptionCountries = [
  "Louisiana",
  "Kentucky",
  "West Virginia",
]; // "Mississippi"
const lowestSugarConsumptionCountries = ["Vermont", "Connecticut", "New York"];// "Minnesota"
const regionToColor = ["#1577B7", "#EDC951", "rgb(107,61,155)"];

const getCSVdata = () =>
  Promise.all([d3.csv("data/education_sugar_cdc_2003.csv")]);

document.addEventListener("DOMContentLoaded", async () => {
  const [highestConsumptionCountryData, lowestConsumptionCountryData] =
    await getData();

  drawRadarChart("highest-consumption", highestConsumptionCountryData);
  // drawRadarChart("lowest-consumption", lowestConsumptionCountryData);
  drawScatterPlot("lowest-consumption", lowestConsumptionCountryData);
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
  const svgMargin = { top: 100, right: 100, bottom: 110, left: 100 };
  const width = 600 - svgMargin.left - svgMargin.right;
  const height = 600 - svgMargin.top - svgMargin.bottom;
  const radarChartConfig = {
    totalInnerCirclePartitions: 6,
    maxDataValue: 60,
  };

  const axisList = data[0].map((i, j) => i.axis),
    radius = Math.min(width / 2, height / 2),
    numberPr = d3.format(".2"),
    chartPiece = (Math.PI * 2) / axisList.length;

  const radiusScale = d3
    .scaleLinear()
    .range([0, radius])
    .domain([0, radarChartConfig.maxDataValue]);
  const color = d3.scaleOrdinal().range(regionToColor);

  const svg = d3
    .select(`svg#${id}`)
    .attr("width", width + svgMargin.left + svgMargin.right)
    .attr("height", height + svgMargin.top + svgMargin.bottom);

  const g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (width / 2 + svgMargin.left) +
        "," +
        (height / 2 + svgMargin.top) +
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
      return (
        numberPr(
          (radarChartConfig.maxDataValue * d) /
            radarChartConfig.totalInnerCirclePartitions
        ) + " t/d"
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
      svg
        .selectAll(".radarArea")
        .transition()
        .duration(200)
        .style("fill-opacity", 0.1);

      d3.select(this).transition().duration(200).style("fill-opacity", 0.7);
    })
    .on("mouseout", function () {
      svg
        .selectAll(".radarArea")
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

  const legend = g
    .append("g")
    .attr("class", "colorLegend")
    .attr("transform", "translate(" + -120 + "," + (height - 100) + ")");

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
    .text(function (d, i) {
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

function drawScatterPlot(id, data) {
  const svgMargin = { top: 100, right: 100, bottom: 110, left: 100 };
  const width = 600;
  const height = 600 - svgMargin.top - svgMargin.bottom;
  const newData = [];
  const dimensions = [
    "<High school",
    "High school",
    "Some college",
    "College graduate",
    "Employed",
    "Not employed",
    "Retired",
  ];

  data.forEach((d) => {
    const obj = {};
    d.forEach((e) => {
      obj[e.axis] = e.value;
    });
    newData.push({
      state: d[0].state,
      ...obj,
    });
  });

  data = newData;

  const svg = d3
    .select(`svg#${id}`)
    .attr("width", width)
    .attr("height", height + svgMargin.top + svgMargin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + svgMargin.left + "," + svgMargin.top + ")"
    );

  const color = d3
    .scaleOrdinal()
    .domain(lowestSugarConsumptionCountries)
    .range(regionToColor);

  const y = {};
  dimensions.forEach((name) => {
    y[name] = d3.scaleLinear().domain([0, 60]).range([height, 0]);
  });

  const x = d3.scalePoint().range([-50, width-120]).domain(dimensions);

  const path = (d) => d3.line()(dimensions.map((p) => [x(p), y[p](d[p])]));

  svg
    .selectAll("myPath")
    .data(data)
    .join("path")
    .attr("class", function (d) {
      return "line";
    })
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function (d) {
      return color(d.state);
    });

  svg
    .selectAll("myAxis")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", function (d) {
      return `translate(${x(d)})`;
    })
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("x", -12)
    .attr("y", -10)
    .text(function (d) {
      return d;
    })
    .style("fill", "black")
    .style("font-size", "12px")
    .style("font-weight", "bold");

  const legend = svg
    .append("g")
    .attr("class", "colorLegend")
    .attr(
      "transform",
      "translate(" + 60 + "," + (height + svgMargin.bottom - 12) + ")"
    );

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
    .text(function (d, i) {
      return lowestSugarConsumptionCountries[i];
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
