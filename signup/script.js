
//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {
  //console.log(validator.isEmpty('sedfd'));
  var form = document.getElementById('signup'),
      firstNameField = form.querySelector('#first-name'),
      lastNameField = form.querySelector('#last-name'),
      password = form.querySelector('#password'),
      passwordRepeat = form.querySelector('#password-repeat'),
      email = form.querySelector('#email'),
      month = form.querySelector('#month'),
      day = form.querySelector('#day'),
      year = form.querySelector('#year'),
      dateObj = {month: month, day: day, year: year},
      charSetsLatin = {
        interpunction: [' ', '-'],
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
    var value = element.value;
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

  function checkEmail(element) {
    var value = element.value;

    if ( validator.isEmailAddress(value) ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Invalid email address! An email address consists of two strings delimited by one "@" sign.');
    }
  }

  function checkMonth(element) {
    var value = element.value,
        pattern = /^[1-9]$|0[1-9]|1[0-2]/;
    // pattern matches numbers from 1 to 9, numbers 10 to 12, and zero padded numbers 1 to 9

    // this field is not required
    if ( pattern.test(value) || value === '' ) {
      element.setCustomValidity('');
      return true;
    } else {
      element.setCustomValidity('Month values must be between 1 and 12, and can be zero padded.');
      return false;
    }
  }

  function checkDay(element) {
    // this function actually needs to be aware of which month is selected
    // to be able to determine the correct number of days
    // it also must know the selected year because of the leap year
    // this functionality is yet to be done
    var value = element.value,
        pattern = /^[1-9]$|0[1-9]|1[0-9]|2[0-9]|3[0-1]/;

    // this field is not required
    if ( pattern.test(value) || value === '' ) {
      element.setCustomValidity('');
      return true;
    } else {
      element.setCustomValidity('Date values must be between 1 and 31, and can be zero padded.');
      return false;
    }
  }

  function checkYear(element) {
    var value = element.value,
        pattern = /19\d\d|20\d\d/;

    // this field is not required
    if ( pattern.test(value) || value === '' ) {
      element.setCustomValidity('');
      return true;
    } else {
      element.setCustomValidity('Year values must be between 1900 and 2099.');
      return false;
    }
  }

  function checkPassword(element) {
    var value = element.value;

    if ( validator.isOfLength(value, 8) ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Password must be at least 8 characters long!');
    }
  }

  function comparePasswords(pass, element) {
    var passRepeat = element.value;
    if ( pass === passRepeat ) {
      element.setCustomValidity('');
    } else {
      element.setCustomValidity('Passwords don\'t match!');
    }
  }

  function checkBirthDate(date, minAge, name) {
    var yearVal = date.year.value,
        monthVal = date.month.value,
        dayVal = date.day.value,
        firstName = name.value,
        birthDate;

    function getAge(birthDay) {
      var now = new Date(),
          age = Math.floor(( now.getTime() - birthDay.getTime() ) / ( 365 * 24 * 3600000 ));

      // this does not give precise results
      // parhaps it is because leap years are not considered
      // but it might be something else
      return age;
    }

    if ( yearVal && monthVal && dayVal ) {

      if ( checkYear(date.year) && checkMonth(date.month) && checkDay(date.day) ) {
        birthDate = yearVal + '-' + monthVal + '-' + dayVal;
        birthDate = new Date(birthDate);
        if ( validator.isBeforeToday(birthDate) && getAge(birthDate) >= minAge ) {
          console.log('Your age is: ', getAge(birthDate) );
        } else {
          date.month.setCustomValidity('You are not of the appropriate age to sign up here!');
        }
      }

    } else if ( !yearVal && !monthVal && !dayVal ) {

      console.log('Ok ' + firstName + ', no birthday present for you!');

    } else if ( !yearVal || !monthVal || !dayVal ) {

      date.month.setCustomValidity(firstName + ', you must enter all three fields for your birth date.');

    }
  }

  firstNameField.addEventListener('keyup', function() {
    checkName(this);
  });

  lastNameField.addEventListener('keyup', function() {
    checkName(this);
  });

  email.addEventListener('keyup', function() {
    checkEmail(this);
  });

  month.addEventListener('keyup', function() {
    checkMonth(this);
  });

  day.addEventListener('keyup', function() {
    checkDay(this);
  });

  year.addEventListener('keyup', function() {
    checkYear(this);
  });

  password.addEventListener('keyup', function() {
    checkPassword(this);
  });

  passwordRepeat.addEventListener('keyup', function() {
    checkPassword(this);
  });

  password.addEventListener('keyup', function() {
    var pass = this.value;
    comparePasswords(pass, passwordRepeat);
  });

  passwordRepeat.addEventListener('keyup', function() {
    var pass = this.value;
    comparePasswords(pass, password);
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    checkBirthDate(dateObj, 21, firstNameField);
  });

});
