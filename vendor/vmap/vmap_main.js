	/* Loader And Map */
	var loaded = false;
	var allCountrySummary = [];
	var totalInformation = {
	totalConfirmed: 0,
	totalDeaths: 0,
	totalRecovered: 0,
	newDeaths: 0,
	};


	const processAPIData = data => {
	allCountrySummary = data;
	};

	const showRegionResultText = result => {
	$("#region-new-confirmed").text(`Confirmed : ${result.NewConfirmed}`);
	$("#region-new-deaths").text(`Deaths : ${result.NewDeaths}`);
	$("#region-new-recovered").text(`Recovered : ${result.NewRecovered}`);
	$("#region-total-confirmed").text(
	  `Confirmed : ${result.TotalConfirmed}`
	);
	$("#region-total-deaths").text(`Deaths : ${result.TotalDeaths}`);
	$("#region-total-recovered").text(
	  `Recovered : ${result.TotalRecovered}`
	);
	};

	const removeLoaderAndShowMap = () => {
	$("#loader").hide();
	$("#VMAP_CoronaUpdates").append($("<div>").attr("id", "vmap"));
	$("#vmap").vectorMap({
	  map: "world_en",
	  enableZoom: true,
	  showTooltip: true,
	  onResize: function(element, width, height) {
		console.log("Map Size: " + width + "x" + height);
	  },
	  onRegionClick: function(element, code, region) {
		console.log(code);
		console.log(region);
		let result = allCountrySummary.find(item => {
		  return (
			item["shortName"] === region ||
			item["isoa2"] === code.toUpperCase()
		  );
		});
		console.log(result);
		if (result !== undefined) {
		  showRegionResultText(result);
		  $("#modal-title").text(region);
		  $("#alert-modal").modal("show");
		  console.log(result["countryCode"]);
		  fetchAndDisplay(result["countryCode"]);
		}
	  }
	});
	};

	$(() => {
	axios
	  .get('https://projdatawebapi.herokuapp.com/countries', {
        auth: {
            username: 'any-login',
            password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
        }
      })
	  .then(res => {
		processAPIData(res.data);
		loaded = true;
		removeLoaderAndShowMap();
		//showStatistics();
		buildStatisticsList();
	  })
	  .catch(err => {
		console.err(err);
	  });
	});
	/* Loader And Map END */
	
	/* Statistics */
	/*const buildStatisticsList = () => {
        return $("<ul>")
          .addClass("list-group mt-3 mb-2")
          .append(
            $("<li>")
              .addClass("list-group-item")
              .append(
                $("<h3>")
                  .addClass("text-center")
                  .text("Statistics")
              ),
            $("<li>")
              .addClass("list-group-item list-group-item-warning")
              .text(`Total Confirmed : ${totalInformation.totalConfirmed}`),
            $("<li>")
              .addClass("list-group-item list-group-item-danger")
              .text(`Total Deaths : ${totalInformation.totalDeaths}`),
            $("<li>")
              .addClass("list-group-item list-group-item-success")
              .text(`Total Recovered : ${totalInformation.totalRecovered}`)
          );
      }; */
	  
	  const buildStatisticsList = () => {
		var globalState = '<div class="col"><div class="icon-box"><div class="icon"><img src="images/icons/covid-defult.svg" alt=""/></div><div class="info"><h5>Total Confirmed</h5><h3>'+totalInformation.totalConfirmed+'</h3></div></div></div><div class="col"><div class="icon-box"><div class="icon"><img src="images/icons/covid-green.svg" alt=""/></div><div class="info"><h5>Total Recovered</h5><h3>'+totalInformation.totalRecovered+'</h3></div></div></div><div class="col"><div class="icon-box"><div class="icon"><img src="images/icons/covid-red.svg" alt=""/></div><div class="info"><h5>Total Deaths</h5><h3>'+totalInformation.totalDeaths+'</h3></div></div></div><div class="col"><div class="icon-box"><div class="icon"><img src="images/icons/covid-redark.svg" alt=""/></div><div class="info"><h5>New Deaths</h5><h3>'+totalInformation.newDeaths+'</h3></div></div></div><div class="col"><div class="icon-box"><div class="icon"><img src="images/icons/telephone.svg" alt=""/></div><div class="info"><h5>Help Line No.</h5><h3>198</h3></div></div></div>';
		
		jQuery('#globalStateRow').html(globalState);
		
		
		/*      .addClass("list-group-item list-group-item-warning")
			  .text(`Total Confirmed : ${totalInformation.totalConfirmed}`),
			$("<li>")
			  .addClass("list-group-item list-group-item-danger")
			  .text(`Total Deaths : ${totalInformation.totalDeaths}`),
			$("<li>")
			  .addClass("list-group-item list-group-item-success")
			  .text(`Total Recovered : ${totalInformation.totalRecovered}`)
		  ); */
	  };
	  
      const showStatistics = () => {
        let list = buildStatisticsList();
        let stat = $("<div>")
          .addClass("container-fluid mt-2 mb-5")
          .append(
            $("<div>")
              .addClass("row")
              .append(
                $("<div>")
                  .addClass("col-md-6")
                  .append(list),
                $("<div>")
                  .addClass("col-md-6")
                  .append($("<canvas>").attr("id", "total-stat-chart"))
              )
          );
        $("#VMAP_CoronaUpdates").append(stat);
        renderTotalStatChart(totalInformation);
      };
      const renderTotalStatChart = data => {
        var ctx = $("#total-stat-chart");
        var myChart = new Chart(ctx, {
          type: "horizontalBar",
          data: {
            labels: ["Total Confirmed", "Total Deaths", "Total Recovered"],
            datasets: [
              {
                label: "World Wide Statisticss",
                data: [
                  data.totalConfirmed,
                  data.totalDeaths,
                  data.totalRecovered
                ],
                backgroundColor: [
                  "rgba(255, 255, 0, 1)",
                  "rgba(255, 0, 0, 1)",
                  "rgba(0, 255, 0, 1)"
                ],
                borderColor: [],
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }
        });
      };
	/* Statistics END */

	/* Country Wise Stats On Graph In Model Box */
	const processRegionAPIData = objArr => {
        let list = [];
        Array.from(objArr).forEach(item => {
          list.push(item.value);
        });
        return list;
      };

      const processDateTimeFromAPIData = objArr => {
        let list = [];

        Array.from(objArr).forEach(item => {
          list.push(item.year);
        });
        return list;
      };


      const fetchRegionCode = code => {
        axios
            .get('https://projdatawebapi.herokuapp.com/countries', {
                auth: {
                    username: 'any-login',
                    password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
                }
            })
            .then(res => {
                a = JSON.stringify(res.data);
                var needle = code.toUpperCase();
                let answer = [];
                for (var i = 0; i < res.data.length; i++){
                  // look for the entry with a matching `code` value
                  if (res.data[i].isoa2 == needle){
                    answer.push(res.data[i]);
                     // we found it
                    // obj[i].name is the matched result
                  }
                }
                return answer
            })
            .catch(err => {
                console.error(err);
            });
      };



      const fetchAndDisplay = country_code => {
        let chart = generateRegionChart();
        fetchRegionData5(country_code, chart);
      };


      const fetchRegionData = (country_code, chart) => {
        axios
            .get(`https://api.footprintnetwork.org/v1/data/${country_code}/all/BCpc`, {
                auth: {
                    username: 'any-login',
                    password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
                }
            })
            .then(res => {
                chart.data.datasets[0].data = processRegionAPIData(res.data);
                chart.data.labels = processDateTimeFromAPIData(res.data);
                chart.update();
            })
            .catch(err => {
                console.error(err);
            });
        axios
            .get(`https://api.footprintnetwork.org/v1/data/${country_code}/all/EFCpc`, {
                auth: {
                    username: 'any-login',
                    password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
                }
            })
            .then(res => {
                chart.data.datasets[1].data = processRegionAPIData(res.data);
                chart.update();
            })
            .catch(err => {
                console.error(err);
            });
      };

      const fetchRegionData2 = (country_code, chart) => {
        axios
            .get(`https://api.footprintnetwork.org/v1/data/${country_code}/all/BCpc`, {
                auth: {
                    username: 'any-login',
                    password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
                }
            })
            .then(res => {
                res.data.sort(function (a, b) {
                             return a.year - b.year;
                });
                var efc = res.data.filter(function (item) {
                    return item.record === "EFConsPerCap";
                });
                var bc = res.data.filter(function (item) {
                    return item.record === "BiocapPerCap";
                });
                chart.data.datasets[0].data = processRegionAPIData(bc);
                chart.data.labels = processDateTimeFromAPIData(bc);
                chart.update();
                chart.data.datasets[1].data = processRegionAPIData(efc);
                chart.update();
            })
            .catch(err => {
                console.error(err);
            });
      };

      const fetchRegionData3 = (country_code, chart) => {
        let json = require('./dataset/'+ country_code + '.json');
        console.log(json, 'the json obj');
      };

      const fetchRegionData4 = (country_code, chart) => {
        let filename = '../dataset2/' + country_code + '.json'
        console.log("../dataset2/" + country_code + ".json");
        fetch("../dataset2/" + country_code + ".json")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                res.data.sort(function (a, b) {
                             return a.year - b.year;
                });
                var efc = res.data.filter(function (item) {
                    return item.record === "EFConsPerCap";
                });
                var bc = res.data.filter(function (item) {
                    return item.record === "BiocapPerCap";
                });
                chart.data.datasets[0].data = processRegionAPIData(bc);
                chart.data.labels = processDateTimeFromAPIData(bc);
                chart.update();
                chart.data.datasets[1].data = processRegionAPIData(efc);
                chart.update();
            })
            .catch(err => {
                console.error(err);
            });
      };

      const fetchRegionData5 = (country_code, chart) => {
        axios
            .get(`https://projdatawebapi.herokuapp.com/${country_code}`)
            .then(res => {
                console.log(res)
                res.data.sort(function (a, b) {
                             return a.year - b.year;
                });
                var efc = res.data.filter(function (item) {
                    return item.record === "EFConsPerCap";
                });
                var bc = res.data.filter(function (item) {
                    return item.record === "BiocapPerCap";
                });
                chart.data.datasets[0].data = processRegionAPIData(bc);
                chart.data.labels = processDateTimeFromAPIData(bc);
                chart.update();
                chart.data.datasets[1].data = processRegionAPIData(efc);
                chart.update();
            })
            .catch(err => {
                console.error(err);
            });
      };

      const generateRegionChart = () => {
        $("#region-stat-chart").remove();
        $("#region-stat-chart-container").append(
          $("<canvas>").attr("id", "region-stat-chart")
        );
        var ctx = document.getElementById("region-stat-chart").getContext("2d");

        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Biokapasitas (Supply)",
                data: [],
                backgroundColor: ["rgba(48, 166, 48, 0.4)"],
                borderColor: ["rgba(48, 166, 48, 1)"],
                borderWidth: 1
              },
              {
                label: "Tapak Ekologi (Demand)",
                data: [],
                backgroundColor: ["rgba(255, 0, 0, 0.4)"],
                borderColor: ["rgba(255, 0, 0, 1)"],
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tahun'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'gha (Hektar Global)'
                    }
                }]
            }
          }
        });
        return myChart;
      };
	/* Country Wise Stats On Graph In Model Box END */

	    const fetchWorldData = (chart) => {
            axios
                .get(`https://projdatawebapi.herokuapp.com/5001`, {
                    auth: {
                        username: 'any-login',
                        password: '8p3moflE64j32aV29s0NHF8PiOrt92SsSOG92T7SDT2V1DORRfO'
                    }
                })
                .then(res => {
                    res.data.sort(function (a, b) {
                        return a.year - b.year;
                    });
                    var efc = res.data.filter(function (item) {
                        return item.record === "EFConsPerCap";
                    });
                    var bc = res.data.filter(function (item) {
                        return item.record === "BiocapPerCap";
                    });
                    chart.data.datasets[0].data = processRegionAPIData(bc);
                    chart.data.labels = processDateTimeFromAPIData(bc);
                    chart.update();
                    chart.data.datasets[1].data = processRegionAPIData(efc);
                    chart.update();
                })
                .catch(err => {
                    console.error(err);
                });
        };

      const generateWorldChart = () => {
        var ctx = $("#world-chart");

        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [],
            datasets: [
              {
                label: "Biokapasitas (Supply)",
                data: [],
                backgroundColor: ["rgba(48, 166, 48, 0.4)"],
                borderColor: ["rgba(48, 166, 48, 1)"],
                borderWidth: 1
              },
              {
                label: "Tapak Ekologi (Demand)",
                data: [],
                backgroundColor: ["rgba(255, 0, 0, 0.4)"],
                borderColor: ["rgba(255, 0, 0, 1)"],
                borderWidth: 1
              }
            ]
          },
          options: {
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Tahun'
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'gha (Hektar Global)'
                    }
                }]
            }
          }
        });
        return myChart;
      };
    let chartworld = generateWorldChart();
    fetchWorldData(chartworld);