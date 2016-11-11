// Initialize Firebase
  var config = {
    apiKey: "AIzaSyA_z-zO24oVwxDTJrplArmjUtTqSuiB5Ao",
    authDomain: "somewhere-warm.firebaseapp.com",
    databaseURL: "https://somewhere-warm.firebaseio.com",
    storageBucket: "somewhere-warm.appspot.com",
    messagingSenderId: "675537655730"
  };
  firebase.initializeApp(config);

(function($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 50
        }
    })

})(jQuery); // End of use strict
