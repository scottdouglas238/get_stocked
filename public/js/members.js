$(document).ready(function(){

  const apiKey1 = "UVV1OIJYR1HSOP3Z";
  const apiKey2 = "VOHNJ8AEVGUI9HYK";

  // console.log(process.env)
  
  $("#submit").on("click", function () {
    $("#companyBtns").html("");
    $("#saveBtn").html("");
  let companySearch;
  companySearch = $("#input").val();
  $.ajax({
    url: "/api/search/" + companySearch,
    method: "GET"
  }).then(function (response) {
    const companies = response.bestMatches;
    companies.forEach((company) => {
      const $btn = $("<button>")
      .text(company["2. name"])
      .addClass("btn btn-dark compButton")
      .attr("data-symbol", company["1. symbol"])
      .attr("data-name", company["2. name"])
      .attr("data-type", company["3. type"])
      .attr("data-currency", company["8. currency"])
      
      $("#companyBtns").append($btn);
    });
  });
});

$("#companyBtns").on("click", ".compButton", function (e) { 
  $("#saveBtn").html("");
  e.preventDefault();
  const companySymbol = ($(this).attr("data-symbol"));
  const companyName = ($(this).attr("data-name"));
  const companyType = ($(this).attr("data-type"))
  const companyCurrency = ($(this).attr("data-currency"))
  
  $.ajax({
    url: "/api/search/s/" + companySymbol,
    method: "GET"
  }).then(function (response) {
    console.log(response)
    const stocks = response["Time Series (Daily)"];
    const stockData = sanitizeStockData(stocks);
    const labels = Object.keys(stockData).reverse();
    
    const vals = labels.map((month) => {
      
      const stocks = stockData[month];
      
      const averageCloseValue =
      stocks.reduce((x, y) => ({ close: x.close + y.close }), {
        close: 0,
      }).close / stocks.length;
  
      return averageCloseValue.toFixed(2);
    });
  
    const ctx = document.getElementById("canvas").getContext("2d");
    config.data.labels = labels;
    config.data.datasets.splice(0, 1);
    config.data.datasets.push({
      label: companyName,
      backgroundColor: "rgba(0, 225, 0, 1)",
      borderColor: "rgba(0, 225, 0, 1)",
      data: vals,
      fill: false,
    });
    window.myLine = new Chart(ctx, config);
    
    
    $("#companyName").text("Company Name: " + companyName)
    $("#companySymbol").text("Company Symbol: " + companySymbol)
    $("#companyType").text("Stock Type: " + companyType)
    $("#companyCurrency").text("Type of Currency: " + companyCurrency)
    
    let saveBtn = $("<button>").text(`Save ${companyName} To Favorites!`)
    saveBtn.addClass("btn btn-dark saveToFavorites")
    saveBtn.attr("data-saveToFavoritsCN", companyName)
    saveBtn.attr("data-saveToFavoritsCS", companySymbol)
    saveBtn.attr("data-saveToFavoritsCT", companyType)
    saveBtn.attr("data-saveToFavoritsCC", companyCurrency)

    $("#saveBtn").append(saveBtn)
    
  });
  
})

$("#saveBtn").on("click", ".saveToFavorites", function(e){
  $("#companyBtns").html("");
  $("#saveBtn").html("");
  const companyName = ($(this).attr("data-saveToFavoritsCN"));
  const companySymbol = ($(this).attr("data-saveToFavoritsCS"));
  const companyType = ($(this).attr("data-saveToFavoritsCT"))
  const companyCurrency = ($(this).attr("data-saveToFavoritsCC"))
  
  $.get("/api/user_data").then(function(data){

    const newStockSave = {
      emails: data.email,
      symbol: companySymbol,
      stockName: companyName,
      stockType: companyType,
      stockCurrency: companyCurrency
    }

    $.ajax("/api/favoriteStocks", {
      type: "POST",
      data: newStockSave
    }).then(function(){
      location.reload();
    })
  }) 
});

$("#savedBtns").on("click", ".savedInfoPull", function(e){
  e.preventDefault()
  const companyName = ($(this).attr("data-renderFavoritesCN"));
  const companySymbol = ($(this).attr("data-renderFavoritesCS"));
  const companyType = ($(this).attr("data-renderFavoritesCT"))
  const companyCurrency = ($(this).attr("data-renderFavoritesCC"))
console.log(companyName, companySymbol, companyType, companyCurrency)
  $.ajax({
    url: "api/search/s/" + companySymbol,
    method: "GET"
  }).then(function(response){
    console.log(response)
    //Graph starts here
    const stocks = response["Time Series (Daily)"];
    const stockData = sanitizeStockData(stocks);
    const labels = Object.keys(stockData).reverse();
    
    const vals = labels.map((month) => {
      
      const stocks = stockData[month];
      
      const averageCloseValue =
      stocks.reduce((x, y) => ({ close: x.close + y.close }), {
        close: 0,
      }).close / stocks.length;
  
      return averageCloseValue.toFixed(2);
    });
  
    const ctx = document.getElementById("canvas").getContext("2d");
    config.data.labels = labels;
    config.data.datasets.splice(0, 1);
    config.data.datasets.push({
      label: companyName,
      backgroundColor: "rgba(0, 225, 0, 1)",
      borderColor: "rgba(0, 225, 0, 1)",
      data: vals,
      fill: false,
    });
    window.myLine = new Chart(ctx, config);
    //Graph ends here
    $("#companyName").text("Company Name: " + companyName)
    $("#companySymbol").text("Company Symbol: " + companySymbol)
    $("#companyType").text("Stock Type: " + companyType)
    $("#companyCurrency").text("Type of Currency: " + companyCurrency)

    let deleteBtn = $("<button>").text(`Delete ${companyName} From Favorites!`)
    deleteBtn.addClass("btn btn-dark deleteFromFavorites")
    deleteBtn.attr("data-deleteFromFavoritsCN", companyName)
    deleteBtn.attr("data-deleteFromFavoritsCS", companySymbol)
    deleteBtn.attr("data-deleteFromFavoritsCT", companyType)
    deleteBtn.attr("data-deleteFromFavoritsCC", companyCurrency)
    $("#deleteBtn").append(deleteBtn)
  })
})

$("#deleteBtn").on("click", ".deleteFromFavorites", function(e){

  e.preventDefault();
  const companyName = ($(this).attr("data-deleteFromFavoritsCN"));
  console.log(companyName);
      
      $.ajax("/api/favoriteStocks/" + companyName, {
        method: "DELETE",
      }).then(function(){
        location.reload();
      })
});

function appendSavedBtns(){
  $.ajax("/api/favoriteStocks", {
    type: "GET"
  }).then(function(response){
    
    $.each(response,function(index, value){
      let companyName = response[index].stockName
      let companySymbol = response[index].symbol
      let companyType = response[index].stockType
      let companyCurrency = response[index].stockCurrency
      const favorites = $("<button>").text(companyName)
      favorites.addClass("btn btn-dark savedInfoPull")
      favorites.attr("data-renderFavoritesCN", companyName)
      favorites.attr("data-renderFavoritesCS", companySymbol)
      favorites.attr("data-renderFavoritesCT", companyType)
      favorites.attr("data-renderFavoritesCC", companyCurrency)
      $("#savedBtns").append(favorites)
      
    });
  })
}

appendSavedBtns();

function sanitizeStockData(stocks) {
  const stockData = {};
  for (date in stocks) {
    const stock = stocks[date];
    //moment gives us the current month
    const month = moment(date).format("MMMM");
    // If month does not exist in stockData set it to empty array
    if (stockData[month] === undefined) {
      stockData[month] = [];
    }
    stockData[month].push({
      open: +stock["1. open"],
      high: +stock["2. high"],
      low: +stock["3. low"],
      close: +stock["4. close"],
      volume: +stock["5. volume"],
      date: date,
    });
  }
  return stockData;
}

const config = {
  type: "line",
  data: {
    labels: [],
    datasets: [],
  },
  gridLines: {
    color: "#FFFFFF"
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Average Stock Prices Over 6 Months",
    },
    tooltips: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      xAxes: [
        {
          display: true,
          gridLines: {
            color: "#FFFFFF"
          },
          scaleLabel: {
            display: true,
            labelString: "Month",
          },
        },
      ],
      yAxes: [
        {
          display: true,
          gridLines: {
            color: "#FFFFFF"
          },
          scaleLabel: {
            display: true,
            labelString: "Value",
          },
        },
      ],
    },
  },
};

});