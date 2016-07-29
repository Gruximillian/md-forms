//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('credit-card-info'),
      fullName = form.querySelector('#full-name'),
      cardNumber = form.querySelector('#card-number'),
      securityCode = form.querySelector('#csv-code'),
      cardExpiration = form.querySelectorAll('#card-expiration select'),
      charSetsLatin = {
        interpunction: [' ', '-', '\''],
        alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        serbianLatin: ['š', 'đ', 'č', 'ć', 'ž']
      },
      charSetsCyr = {
        interpunction: [' ', '-'],
        serbianCyrillic: ['а', 'б', 'в', 'г', 'д', 'ђ', 'е', 'ж', 'з', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ', 'о', 'п', 'р', 'с', 'т', 'ћ', 'у', 'ф', 'х', 'ц', 'ч', 'џ', 'ш']
      };


  function setSelectDate() {
    var expirationMonth = form.querySelector('#expiration-month'),
        expirationYear = form.querySelector('#expiration-year'),
        currentDate = new Date(),
        currentMonth = currentDate.getMonth(),
        currentYear = currentDate.getFullYear();

    // on page load, set the current month and year in the select fields
    expirationMonth.querySelector('option[value="' + currentMonth + '"]').setAttribute('selected', 'selected');
    expirationYear.querySelector('option[value="' + currentYear + '"]').setAttribute('selected', 'selected');
  }

  setSelectDate();

  // The following functions apply the custom validity messages
  // to the form fields using the Constraint API

  function checkFullName(element) {
    var value = element.value.trim();
    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('Required field!');
    } else if ( !validator.isCharacterSet(value, charSetsLatin) && !validator.isCharacterSet(value, charSetsCyr) ) {
      element.setCustomValidity('Wrong characters! Use english and serbian latin, or serbian cyrillic.');
    } else if ( !validator.isFullName(value) ) {
      element.setCustomValidity('Invalid full name format! There must be at least two words of length greater than one letter.');
    } else {
      element.setCustomValidity('');
    }
  }

  function checkCardNumber(element) {
    var value = element.value.trim();

    if ( validator.isCreditCard(value) ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Wrong format for the card number! Only numbers and capital letters, split with a hyphen into four groups of four characters. You can also enter complete number without hyphens.');
    }
  }

  function checkSecurityCode(element) {
    var value = element.value.trim();

    if ( validator.isEmpty(value) ) {
      element.setCustomValidity('Please enter your security number.');
    } else if ( +value === parseInt(value) && value.length === 3 ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Please enter a three digit number.');
    }
  }

  function checkExpirationDate(element) {
    var expirationMonth = form.querySelector('#expiration-month'),
        expirationYear = form.querySelector('#expiration-year'),
        currentDate = new Date(),
        currentMonth = currentDate.getMonth(),
        currentYear = currentDate.getFullYear(),
        expYear = parseInt(expirationYear.value),
        expMonth = parseInt(expirationMonth.value);

    if ( expYear < currentYear ) {
      expirationYear.setCustomValidity('That year has passed. Your card is no longer valid. Please provide another one.');
    } else if ( expYear === currentYear && expMonth < currentMonth ) {
      expirationMonth.setCustomValidity('That month has passed. Your card is no longer valid. Please provide another one.');
    } else {
      expirationYear.setCustomValidity('');
      expirationMonth.setCustomValidity('');
    }
  }

  fullName.addEventListener('keyup', function() {
    checkFullName(this);
  });

  cardNumber.addEventListener('keyup', function() {
    checkCardNumber(this);
  });

  securityCode.addEventListener('keyup', function() {
    checkSecurityCode(this);
  });

  for ( var i = 0; i < cardExpiration.length; i++) {
    cardExpiration[i].addEventListener('change', function() {
      checkExpirationDate(this);
    });
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
  });

});
