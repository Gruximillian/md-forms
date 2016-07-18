//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('login-form'),
      username = form.querySelector('#username'),
      password = form.querySelector('#password');


  function checkUsername(element) {
    var value = element.value;

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('You must provide your username to login.');
    } else if ( !validator.isOfLength(value, 2) ) {
      element.setCustomValidity('User names are longer than one character!');
    }  else {
      element.setCustomValidity('');
    }
  }


  function checkPassword(element) {
    var value = element.value;

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('You must enter your password to login.')
    } else if ( validator.isOfLength(value, 8) ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Passwords are at least 8 characters long!');
    }
  }


  /*************************/
  /*    EVENT LISTENERS    */
  /*************************/


  username.addEventListener('keyup', function() {
    checkUsername(this);
  });

  password.addEventListener('keyup', function() {
    checkPassword(this);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

});