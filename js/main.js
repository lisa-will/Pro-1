  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_z-zO24oVwxDTJrplArmjUtTqSuiB5Ao",
    authDomain: "somewhere-warm.firebaseapp.com",
    databaseURL: "https://somewhere-warm.firebaseio.com",
    storageBucket: "somewhere-warm.appspot.com",
    messagingSenderId: "675537655730"
  };
  firebase.initializeApp(config);

  // EMAIL/PASSWORD LOGIN VIA FIREBASE
var auth = firebase.auth();
//auth.signInWithEmailAndPassword(email, pass);
//auth.createUserWithEmailAndPassword(email, pass);
auth.onAuthStateChanged(firebaseUser => {})

var loginEmail = document.getElementById('loginEmail');
console.log(loginEmail);
var loginPassword = document.getElementById('loginPassword');
var btnLogin = document.getElementById('btnLogin');
var btnSignup = document.getElementById('btnSignup');
var btnLogOut = document.getElementById('btnLogOut')

//ADD LOGIN EVENT 
if(btnLogin){
  btnLogin.addEventListener('click', e => {
      //GET EMAIL AND PASS
      var email = loginEmail.val();
      var pass = loginPassword.val();
      var auth = firebase.auth();
      //SIGN IN
      var promise = auth.signInWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));

  });
}

//SIGN UP EVENT
if(btnSignup){
  btnSignup.addEventListener('click', e => {
      //GET EMAIL AND PASS
      //TO DO: CHECK FOR REAL EMAILS (#FUTURE GOALS)
      var email = loginEmail.val();
      var pass = loginPassword.val();
      var auth = firebase.auth();
      //SIGN IN
      var promise = auth.createUserWithEmailAndPassword(email, pass);
      promise.catch(e => console.log(e.message));

  });
}

//LOG OUT EVENT
if(btnLogOut){
  btnLogOut.addEventListener('click', e => {
      firebase.auth().signOut();

  });
}

//ADD REALTIME LISTENER 
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log(firebaseUser);
    } else {
        console.log('not logged in');
    }
});

    function getPhotos(textInput) {
      var apiKey = "5164f5b056c40e92395052ab337e2642";
      var tag = textInput;
      var accuracy = "11";
      var contentType = "1";
      var perPage = "1"; 
      var privacyFilter = "1"; 
      var safeSearch = "1"; 
      var queryURL = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + apiKey + "&tags=" + tag + "&accuracy=" + accuracy + "&content_type" + contentType +"&per_page" + perPage + "&safe_search" + safeSearch + "&privacy_filter" + privacyFilter + "&format=json&nojsoncallback=1";
      $.ajax({url: queryURL, method: 'GET'}).done(function(response) {
        console.log(textInput);
        console.log(response);
      })
    };
    $("#add").on("click", function() {
      var textInput = $("#textBox").val();
      getPhotos(textInput);
    });

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
    var contentString = "<form>Add or Update Location Name:<br><br><input type='text' id='nameInput'>"+
    "<button type='button' data-location='" + locationId + "' id='addName'>Submit</button><br><br>"+
    "<span>Name: </span><span id='nameInputSpace'> ?</span><br><br>"+ 
    "<button type='button' data-location='" + locationId + "' id='like'>"+
    "Like +1</button><span> Total Likes: </span><span id='likeCount'> #</span><br><br>"+
    "<button type='button' data-location='" + locationId + "' id='dislike'>"+
    "Dislike -1</button><span> Total Dislikes: </span><span id='dislikeCount'> #</span></form>";
    //"<div class='col-xs-3 col-sm-3 col-md-3 col-lg-3' id ='sidebar'>"+
    //"<form action='' method='POST' role='form'>"+
    
    //"<div class='location-form'>"+
    //"<label for=''>Aye where you at?</label>"+
    //"<input type='text' class='form-control' id='location-input' placeholder='Current location'>"+ 
      //"</div>"+
        //"<button type='button' class='btn btn-primary' id = 'searchButton'>Submit</button>"+
        //"<p></p>"+
        //"<div id='buttonsView'></div>"+

    //"<div class='name'></div>"+
    //"<div class='wind'></div>"+
    //"<div class='humidity'></div>"+
    //"<div class='temp'></div>";


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
    var clickCounterA = 0;

    //Need to call #like button
    $(document).on('click', '#like', function(){
      clickCounterA++;

      var locationId = $(this).attr("data-location");

      //console.log for debugging
      //console.log(clickCounter);

      //.push creates new data, .set replaces data
      database.ref(locationId).push({
      clickCountLike: clickCounterA
       });
      //return false; //For debugging
    });
    //*******************************************************************************

    //To read Like counts and show on info windows
    function valueChangedA(snapshot) {
      //console.log(snapshot.val());
      //If below I use clickCounterAA the code sort of works, but I should use clickCounterA
      clickCounterAA = snapshot.val().clickCountLike;
      $('#likeCount').html(clickCounterA);

    }

    function valueError(err) {

      console.log(err);
    }

    //'value' is the event
    database.ref().on('value', valueChangedA, valueError);


    //To write DISLIKE count to Firebase************************************************
    //var database = firebase.database(); *This line is a global variable on the top
    var clickCounterB = 0;

    //Need to call #like button
    $(document).on('click', '#dislike', function(){
      clickCounterB++;

      var locationId = $(this).attr("data-location");

      //console.log for debugging
      //console.log(clickCounter);

      //.push creates new data, .set replaces data
      database.ref(locationId).push({
      clickCountDislike: clickCounterB
       });
      //return false; //For debugging
    });
    //*******************************************************************************


    //To read Dislike counts and show on info windows
    function valueChangedB(snapshot) {
      console.log(snapshot.val());
      //If below I use clickCounterBB the code sort of works, but I should use clickCounterB
      clickCounterBB = snapshot.val().clickCountDislike;
      $('#dislikeCount').html(clickCounterB);

    }

    function valueError(err) {

      console.log(err);
    }

    //'value' is the event
    database.ref().on('value', valueChangedB, valueError);


    //To write NAME input ================================================================
    var nameA = "";

    $(document).on('click', '#addName' , function(){
      nameA = $("#nameInput").val().trim();
    
    var locationId = $(this).attr("data-location");
    
    database.ref(locationId).push({
    name: nameA
      });

    });
  
  
    //To read NAME input ==================================================================
    function valueChangedC(snapshot) {
      //console.log(snapshot.val());
      
      //nameA = snapshot.val().name; *If a enable this line the Name shows up on info window but doesn't show up when I refresh the page
      $('#nameInputSpace').html(nameA);

    }

    function valueError(err) {

      console.log(err);
    }

    //'value' is the event
    database.ref().on('value', valueChangedC, valueError);