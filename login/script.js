//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('login-form'),
      username = form.querySelector('#username'),
      password = form.querySelector('#password'),
      unameValid = false,
      passValid = false;


  function checkUsername(element) {
    var value = element.value;

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('You must provide your username to login.');
      return false;
    } else if ( !validator.isOfLength(value, 2) ) {
      element.setCustomValidity('User names are longer than one character!');
      return false;
    }  else {
      element.setCustomValidity('');
      return true;
    }
  }


  function checkPassword(element) {
    var value = element.value;

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('You must enter your password to login.');
      return false;
    } else if ( validator.isOfLength(value, 8) ) {
      element.setCustomValidity('');
      return true;
    } else {
      element.setCustomValidity('Passwords are at least 8 characters long!');
      return false;
    }
  }


  /*************************/
  /*    EVENT LISTENERS    */
  /*************************/


  username.addEventListener('keyup', function() {
    unameValid = checkUsername(this);
    console.log('User name valid: ', unameValid);
  });

  password.addEventListener('keyup', function() {
    passValid = checkPassword(this);
    console.log('Password valid: ', passValid);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if ( unameValid && passValid ) {
      console.log('The entered data is valid and can be sent to the server for check.');
    } else {
      console.log('The data entered is not valid to be sent to the server.');
    }
  });

});