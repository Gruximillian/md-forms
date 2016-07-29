//
//  THIS IS THE CODE THAT UTILIZES THE CONSTRAINT API FOR FORM VALIDATION
//  It also utilizes the 'validator.js' library created in the 'Introduction to the DOM' chapter
//

window.addEventListener('load', function() {

  var form = document.getElementById('questionnaire'),
      options = form.querySelectorAll('input[type=radio]'),
      selection,
      customAnswer = form.querySelector('#custom-answer'),
      i, len = options.length,
      submitButton = form.querySelector('#submit');

  function validateAnswer() {
    if ( validator.isEmpty(this.value) ) {
      this.setCustomValidity('Please enter your answer.');
      // prevent submitting the form if custom answer is selected but not provided
      submitButton.setAttribute('disabled', 'disabled');
    } else {
      this.setCustomValidity('');
      // allow submitting if the custom answer is provided
      submitButton.removeAttribute('disabled');
    }
  }


  //*************************//
  //     EVENT LISTENERS     //
  //*************************//


  for ( i = 0; i < len; i++ ) {

    options[i].addEventListener('click', function() {

      // the value of the radio button that is selected
      selection = this.value;

      if ( selection === 'Other' ) {
        // if 'Other' is selected, user must provide the answer
        // enable the fiels for the answer
        // disable submitting until the validation is performed successfully
        // focus the input filed for the answer
        // add event listeners on the input filed to validate the answer
        customAnswer.removeAttribute('disabled');
        submitButton.setAttribute('disabled', 'disabled');
        customAnswer.focus();
        customAnswer.addEventListener('change', validateAnswer);
        customAnswer.addEventListener('keyup', validateAnswer);
      } else {
        // if 'Other' is not selected, then disable the input for custom answer and clear it
        // also, remove the event listeners on the input field
        // and allow submit since other radio buttons have values associated
        customAnswer.setAttribute('disabled', 'disabled');
        customAnswer.value = '';
        customAnswer.removeEventListener('change', validateAnswer);
        customAnswer.removeEventListener('keyup', validateAnswer);
        submitButton.removeAttribute('disabled');
      }

    });

  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // read and log the final answer on submit
    if ( selection === 'Other' ) {
      answer = customAnswer.value;
      console.log('You have selected: ', selection);
      console.log('Answer: ', answer);
    } else if ( selection ) {
      console.log('You have selected: ', selection);
    }

  });

});
