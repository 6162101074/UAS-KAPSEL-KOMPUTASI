const key = "fca_live_rMwakp88F0k0BVUFVWtwtgUPdd2OEsIASXs0KFna";

const state = {
  openedDrawer: null,
  currencies: [],
  filteredCurrencies: [],
  base: "USD",
  target: "EUR",
  rates: {},
  baseValue: 1,
};

//* selectors

const ui = {
  controls: document.getElementById("controls"),
  drawer: document.getElementById("drawer"),
  dismissBtn: document.getElementById("dismiss-btn"),
  currencyList: document.getElementById("currency-list"),
  searchInput: document.getElementById("search"),
  baseBtn: document.getElementById("base"),
  targetBtn: document.getElementById("target"),
  exchangeRate: document.getElementById("exchange-rate"),
  baseInput: document.getElementById("base-input"),
  targetInput: document.getElementById("target-input"),
  swapBtn: document.getElementById("swap-btn"),
};

//* event listeners

const setupEventListeners = () => {
  document.addEventListener("DOMContentLoaded", initApp);
  ui.controls.addEventListener("click", showDrawer);
  ui.dismissBtn.addEventListener("click", hideDrawer);
  ui.searchInput.addEventListener("input", filterCurrency);
  ui.currencyList.addEventListener("click", selectPair);
  ui.baseInput.addEventListener("change", convertInput);
  ui.swapBtn.addEventListener("click", switchPair);
};

//* event handlers

const initApp = () => {
  fetchCurrencies();
  fetchExchangeRate();
};

const showDrawer = (e) => {
  if (e.target.hasAttribute("data-drawer")) {
    state.openedDrawer = e.target.id;
    ui.drawer.classList.add("show");
  }
};

const hideDrawer = () => {
  clearSearchInput();
  state.openedDrawer = null;
  ui.drawer.classList.remove("show");
};

const filterCurrency = () => {
  const keyword = ui.searchInput.value.trim().toLowerCase();

  state.filteredCurrencies = getAvailableCurrencies().filter(
    ({ code, name }) => {
      return (
        code.toLowerCase().includes(keyword) ||
        name.toLowerCase().includes(keyword)
      );
    }
  );

  displayCurrencies();
};

const selectPair = (e) => {
  if (e.target.hasAttribute("data-code")) {
    const { openedDrawer } = state;

    // update the base or target in the state
    state[openedDrawer] = e.target.dataset.code;

    // load the exchange rates then update the btns
    loadExchangeRate();

    // close the drawer after selection
    hideDrawer();
  }
};

const convertInput = () => {
  state.baseValue = parseFloat(ui.baseInput.value) || 1;
  loadExchangeRate();
};

const switchPair = () => {
  const { base, target } = state;
  state.base = target;
  state.target = base;
  state.baseValue = parseFloat(ui.targetInput.value) || 1;
  loadExchangeRate();
};

//* render functions

const displayCurrencies = () => {
  ui.currencyList.innerHTML = state.filteredCurrencies
    .map(({ code, name }) => {
      return `
      <li data-code="${code}">
        <img src="${getImageURL(code)}" alt="${name}" />
        <div>
          <h4>${code}</h4>
          <p>${name}</p>
        </div>
      </li>
    `;
    })
    .join("");
};

const displayConversion = () => {
  updateButtons();
  updateInputs();
  updateExchangeRate();
};

const showLoading = () => {
  ui.controls.classList.add("skeleton");
  ui.exchangeRate.classList.add("skeleton");
};

const hideLoading = () => {
  ui.controls.classList.remove("skeleton");
  ui.exchangeRate.classList.remove("skeleton");
};

//* helper functions

const updateButtons = () => {
  [ui.baseBtn, ui.targetBtn].forEach((btn) => {
    const code = state[btn.id];

    btn.textContent = code;
    btn.style.setProperty("--image", `url(${getImageURL(code)})`);
  });
};

const updateInputs = () => {
  const { base, baseValue, target, rates } = state;

  const result = baseValue * rates[base][target];

  ui.targetInput.value = result.toFixed(4);
  ui.baseInput.value = baseValue;
};

const updateExchangeRate = () => {
  const { base, target, rates } = state;

  const rate = rates[base][target].toFixed(4);

  ui.exchangeRate.textContent = `1 ${base} = ${rate} ${target}`;
};

const getAvailableCurrencies = () => {
  return state.currencies.filter(({ code }) => {
    return state.base !== code && state.target !== code;
  });
};

const clearSearchInput = () => {
  ui.searchInput.value = "";
  ui.searchInput.dispatchEvent(new Event("input"));
};

const getImageURL = (code) => {
  const flag =
    "https://wise.com/public-resources/assets/flags/rectangle/{code}.png";

  return flag.replace("{code}", code.toLowerCase());
};

const loadExchangeRate = () => {
  const { base, rates } = state;
    fetchExchangeRate();
};

//* api functions

const fetchCurrencies = () => {
  fetch(`data.json`)
    .then((response) => response.json())
    .then(({ data }) => {
      state.currencies = Object.values(data);
      state.filteredCurrencies = getAvailableCurrencies();
      displayCurrencies();
    })
    .catch(console.error);
};

let ctx = document.getElementById('myChart');
let myChart;

let ctx1 = document.getElementById('myChart1');
let myChart1;



const fetchExchangeRate = () => {
  const { base } = state;
  const { target } = state;
  showLoading();
  
  fetch(
    `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_rMwakp88F0k0BVUFVWtwtgUPdd2OEsIASXs0KFna&base_currency=${base}`
  )
    .then((response) => response.json())
    .then(({ data }) => {
      state.rates[base] = data;
      state.rates[target]=data;
      displayConversion();
    })
    .catch(console.error)
    .finally(hideLoading);

    fetch(`data${base}.json`)
.then(function(response){
   if(response.status == 200){
      return response.json();
   }
})
.then(function(data){ 
   Jsondata = data; 
   createChart(Jsondata, 'bar');
   setChartType('bar');
   
});	

    fetch(`data${target}.json`)
.then(function(response){
   if(response.status == 200){
      return response.json();
   }
})
.then(function(data1){ 
   Jsondata = data1; 
   createChart1(Jsondata, 'bar');
   setChartType1('bar');
   
});	

function createChart(data, type){
  
  myChart.destroy()

  
	myChart = new Chart(ctx, {
		type: type, 
		data: {
		  labels: data.map(row => row.year), 
		  datasets: [{
		    label: `Nilai`,
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


function createChart1(data1, type){
  
  myChart1.destroy()

  
	myChart1 = new Chart(ctx1, {
		type: type, 
		data: {
		  labels: data1.map(row => row.year), 
		  datasets: [{
		    label: `Nilai,
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

}

//* initialization

setupEventListeners();




