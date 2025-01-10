fetch(`dataUSD.json`)
.then(function(response){
   if(response.status == 200){
      return response.json();
   }
})
.then(function(data){ 
   Jsondata = data; 
   createChart(Jsondata, 'bar');
});	

function createChart(data, type){
	myChart = new Chart(ctx, {
		type: type, 
		data: {
		  labels: data.map(row => row.year), 
		  datasets: [{
		    label: 'nilai',
		    data: data.map(row => row.currency),
		    borderWidth: 1
		  }]
		},
		options: {
		  scales: {
		    y: {
		      beginAtZero: true
		    }
		  },
		  responsive: true,
		  maintainAspectRatio: false,
		}
	});

}

function setChartType(chartType){
	myChart.destroy();
	createChart(Jsondata, chartType);
}