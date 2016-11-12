  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_z-zO24oVwxDTJrplArmjUtTqSuiB5Ao",
    authDomain: "somewhere-warm.firebaseapp.com",
    databaseURL: "https://somewhere-warm.firebaseio.com",
    storageBucket: "somewhere-warm.appspot.com",
    messagingSenderId: "675537655730"
  };
  firebase.initializeApp(config);

//var firebase = new Firebase("https://ucf-project1.firebaseio.com/");
var database = firebase.database();

window.onload = function () {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 3,
    styles: [{
      featureType: 'poi',
      stylers: [{
          visibility: 'on'
        }] // Turn ON points of interest visibility
    }, {
      featureType: 'transit.station',
      stylers: [{
          visibility: 'off'
        }] // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });
  //var firebase = new Firebase("https://ucf-project1.firebaseio.com/");
   map.addListener('click', function (e) {
     database.ref().push({
       lat: e.latLng.lat(),
       lng: e.latLng.lng()
     });
   });
  database.ref().on("child_added", function (snapshot, prevChildKey) {
    // Get latitude and longitude from the cloud.
    var newPosition = snapshot.val();

    // Create a google.maps.LatLng object for the position of the marker.
    // A LatLng object literal (as above) could be used, but the heatmap
    // in the next step requires a google.maps.LatLng object.
    var latLng = new google.maps.LatLng(newPosition.lat, newPosition.lng);

    var latString = newPosition.lat + "";
    var lonString = newPosition.lng + "";
    var locationId = "loc" + latString.replace(".", "") + "" + lonString.replace(".", "");
    // locationId = locationId.replace(".","");

    // Place a marker at that location.
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    // Content for Firebase Info Window----------------------------------------------
    var contentString = "<form>Location:<br><input><br><br>"+
    "<button type='button' data-location='" + locationId + "' id='like'>"+
    "Like +1</button><span id='likeCount'># </span><br><br>"+
    "<button id='dislike'>"+
    "Dislike -1</button><span id='dislikeCount'># <span></form><br><br>"+
    "<button>Weather</button>";



    // Info Window for Firebase Points-----------------------------------------------
    var firebaseInfoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    // Event to Open Firebase InfoWindow---------------------------------------------
    marker.addListener('click', function () {
      firebaseInfoWindow.open(map, marker);
    });

    //NEW CODE FOR HIDING FIREBASE MARKERS BASED ON ZOOM STARTS HERE*******
    google.maps.event.addListener(map, 'zoom_changed', function () {
      zoomLevel = map.getZoom();

      if (zoomLevel < 16) {
        //FALSE sets markers invisible
        marker.setVisible(false);

        //infowindow.open(map,marker);

      } else if(zoomLevel > 16){
        marker.setVisible(true);

      }
    });
    //NEW CODE FOR HIDING FIREBASE MARKERS BASED ON ZOOM ENDS HERE*****

  });

  // Info Window for Geolocation Result
  var infoWindow = new google.maps.InfoWindow({
    map: map
  });

  // False draggable marker for geolocation
  var markerCenter = new google.maps.Marker({
    draggable: false,
    map: map,
    icon: 'http://maps.google.com/mapfiles/kml/pal3/icon40.png'
      //path: google.maps.SymbolPath.CIRCLE,
      //path: 'http://maps.google.com/mapfiles/kml/pal3/icon40.png'
  });

  // Circle with specified radius around draggable Marker
  // var circle = new google.maps.Circle({
  // map: map,
  // clickable: false,
  // 1609.34 meters (1 mile)
  // radius: 1609.34,
  // fillColor: '#fff',
  // fillOpacity: .6,
  // strokeColor: '#313131',
  // strokeOpacity: .4,
  // strokeWeight: .8
  // });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);
      infoWindow.setContent('You are here!');
      markerCenter.setPosition(pos);
      // To bind circle of specified radius to Geolocation marker
      // circle.bindTo('center', markerCenter, 'position');
      map.setCenter(pos);
      map.setZoom(18);
    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Awww so sad: The geolocation service failed.' :
    'Awww so sad: Your browser doesn\'t support geolocation.');


}

    //To write LIKE count to Firebase************************************************
    //var database = firebase.database(); *This line is a global variable on the top
    var clickCounter = 0;

    //Need to call #like button
    $(document).on('click', '#like', function(){
      clickCounter++;

      var locationId = $(this).attr("data-location");

    console.log(clickCounter);

    database.ref(locationId).set({
    clickCount: clickCounter
       });
      //return false;
    });
    //*******************************************************************************

