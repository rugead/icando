$(document).ready(function() {

  // Place JavaScript code here...
  $(".button-collapse").sideNav();
//  $('.fixed-action-btn').openFAB();

  $( "li.click_region" ).click(function() {
    var text = $( this ).text();
    $( "#region" ).val( text );
  });
  
  $( "li.click_country" ).click(function() {
    var text = $( this ).text();
    $( "#country" ).val( text );
  });

  $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year
    editable: true,
    firstDay: 1
  });
  


});