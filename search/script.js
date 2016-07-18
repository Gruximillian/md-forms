//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('search'),
      categories = form.querySelector('#category'),
      category = categories.value, // the default value 'All'
      searchTerm = form.querySelector('#search-term'),
      submitButton = form.querySelector('#submit');

  function isSearchAlowed(element) {
    if ( validator.isEmpty(element.value) ) {
      element.setCustomValidity('Please enter a term for search.');
    } else {
      element.setCustomValidity('');
    }
  }


  //*************************//
  //     EVENT LISTENERS     //
  //*************************//


  categories.addEventListener('change', function() {
    category = this.value;
    console.log(category);
  });

  searchTerm.addEventListener('keyup', function() {
    isSearchAlowed(this);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // log the category and search term on submit
    console.log('You have selected "', category, '" category.');
    console.log('You want to search for: "', searchTerm.value, '".');
  });

});