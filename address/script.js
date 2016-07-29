//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('ship-bill-address'),
      sameAddressCheck = form.querySelector('#match-addresses'),
      charSetsLatin = {
        interpunction: [' ', '-', '\''],
        alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        serbianLatin: ['š', 'đ', 'č', 'ć', 'ž']
      },
      charSetsCyr = {
        interpunction: [' ', '-'],
        serbianCyrillic: ['а', 'б', 'в', 'г', 'д', 'ђ', 'е', 'ж', 'з', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ', 'о', 'п', 'р', 'с', 'т', 'ћ', 'у', 'ф', 'х', 'ц', 'ч', 'џ', 'ш']
      };


  // The following functions apply the custom validity messages
  // to the form fields using the Constraint API

  function checkName(element) {
    var value = element.value.trim();
    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('This is a required field, please fill it.');
    } else if ( !validator.isOfLength(value, 2) ) {
      element.setCustomValidity('The length of the name must be at least two characters long.');
    } else if ( !validator.isCharacterSet(value, charSetsLatin) && !validator.isCharacterSet(value, charSetsCyr) ) {
      element.setCustomValidity('Wrong characters! Use english and serbian latin, or serbian cyrillic.');
    } else {
      element.setCustomValidity('');
    }
  }

  function checkAddressCity(element) {
    var value = element.value.trim();
    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('This is a required field, please fill it.');
    } else if ( !validator.isOfLength(value, 2) ) {
      element.setCustomValidity('The length of the address/city must be at least two characters long.');
    } else {
      element.setCustomValidity('');
    }
  }

  // function that applies event listeners to the form fields
  function initFormSection(formHandle, sectionID) {
    var addressForm = formHandle.querySelector(sectionID),
        firstName = addressForm.querySelector('.first-name input'),
        lastName = addressForm.querySelector('.last-name input'),
        address = addressForm.querySelector('.address input'),
        city = addressForm.querySelector('.city input');

    firstName.addEventListener('keyup', function() {
      checkName(this);
    });

    lastName.addEventListener('keyup', function() {
      checkName(this);
    });

    address.addEventListener('keyup', function() {
      checkAddressCity(this);
    });

    city.addEventListener('keyup', function() {
      checkAddressCity(this);
    });

  }

  sameAddressCheck.addEventListener('change', function() {
    var checked = this.checked;

    // if addresses are not the same, then enable editing billing address separately
    if ( !checked ) {
      form.querySelector('#billing-address').removeAttribute('disabled');
    } else {
      form.querySelector('#billing-address').setAttribute('disabled', 'disabled');
    }
  });

  // initialize event listeners on form field
  initFormSection(form, '#shipping-address');
  initFormSection(form, '#billing-address');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

});
