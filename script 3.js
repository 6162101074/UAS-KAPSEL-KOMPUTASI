fetch(`dataUSD.json`)
.then(function(response1){
   if(response1.status == 200){
      return response1.json();
   }
})
.then(function(data1){ 
   Jsondata = data1; 
   createChart1(Jsondata, 'bar');
});	

function createChart1(data1, type){
	myChart1 = new Chart(ctx1, {
		type: type, 
		data: {
		  labels: data1.map(row => row.year), 
		  datasets: [{
		    label: 'nilai',
		    data: data1.map(row => row.currency),
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

function setChartType1(chartType){
	myChart1.destroy();
	createChart1(Jsondata, chartType);
}