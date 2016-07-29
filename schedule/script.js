//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('schedule'),
      email = form.querySelector('#email'),
      phone = form.querySelector('#phone'),
      date = form.querySelector('#date'),
      time = form.querySelectorAll('#time');

  function checkEmail(element) {
    var value = element.value.trim();

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('Enter an email address.');
    } else if ( !validator.isEmailAddress(value) ) {
      element.setCustomValidity('Wrong email address format!');
    } else {
      element.setCustomValidity('');
    }
  }

  function checkPhone(element) {
    var value = element.value.trim();

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('Please enter the phone number.');
    } else if ( !validator.isPhoneNumber(value) ) {
      element.setCustomValidity('Wrong phone number format!');
    } else {
      element.setCustomValidity('');
    }
  }

  function checkDate(element) {
    var value = element.value.trim();

// date stuff:
// var now = new Date();
// console.log(now);
// console.log(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())));

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('Enter a date.');
    } else if ( !validator.isDate(value) ) {
      element.setCustomValidity('Invalid date selected! Valid formats: "mm/dd/yyyy", "yyyy-mm-dd", "yyyy", "yyyy-mm"');
    } else if ( !validator.isAfterToday(value) ) {
      element.setCustomValidity('This date has already passed. Please select another one.');
    } else {
      element.setCustomValidity('');
    }
  }

  date.addEventListener('keyup', function() {
    checkDate(this);
  });

  email.addEventListener('keyup', function() {
    checkEmail(this);
  });

  phone.addEventListener('keyup', function() {
    checkPhone(this);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

});
