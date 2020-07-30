function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}


function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  // var url = $SCRIPT_ROOT + '/predict_home_price'; //Use this if you are NOT using nginx 
  
  // var url = "/api/predict_home_price"   // Use this if  you are using nginx. 
  
  var data = {total_sqft: parseFloat(sqft.value), bhk: bhk, bath: bathrooms, location: location.value};

  $.ajax({
    url : '/predict_home_price',
    data: data,
    type: "POST",
    success: function(response){
      console.log("hello");
      console.log(response);
      estPrice.innerHTML = "<p>Price: <span> " + response.estimated_price.toString() + " Lakh</span> </p>";
    }
  });

}

function onPageLoad() {
  console.log( "document loaded" );

  // var url = $SCRIPT_ROOT + '/get_location_names'; // Use this if you are NOT using nginx 
  // url : window.location.href + '/get_location_names'

  // var url = "/api/get_location_names"   // Use this if  you are using nginx.
  
  $.ajax({
    url : '/get_location_names',
    type: "GET",
    dataType: "json",
    success: function(response){
        console.log("got response for get_location_names request");
        var locations = response.locations;
        // var uiLocations = document.getElementById("uiLocations");
        $('#uiLocations').empty();
        for(var i in locations) {
            var opt = new Option(locations[i]);
            $('#uiLocations').append(opt);
        }
    }
  });


}

window.onload = onPageLoad;