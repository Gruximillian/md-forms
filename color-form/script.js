window.addEventListener('load', function() {
  var redHandle = document.querySelector('input.red'),
      greenHandle = document.querySelector('input.green'),
      blueHandle = document.querySelector('input.blue'),
      alphaHandle = document.querySelector('input.alpha'),
      form = document.querySelector('#color-picker'),
      rgbaPlaceholder = document.querySelector('#code-rgba'),
      hexPlaceholder = document.querySelector('#code-hex'),
      colorOutput = document.querySelector('.display-color');

  form.addEventListener('input', function(e) {
    var red = redHandle.value,
        green = greenHandle.value,
        blue = blueHandle.value,
        redX = hexIt(red),
        greenX = hexIt(green),
        blueX = hexIt(blue),
        alpha = alphaHandle.value,
        rgbaString = '',
        hexString;

    rgbaString = 'rgba(' + red + ', ' + green + ', ' + blue + ', ' + alpha + ')';
    rgbaPlaceholder.textContent = rgbaString;
    rgbaPlaceholder.style.backgroundColor = rgbaString;
    colorOutput.style.backgroundColor = rgbaString;

    hexString = '#' + redX + greenX + blueX;
    hexPlaceholder.textContent = hexString;
    hexPlaceholder.style.backgroundColor = hexString;
  });

  function hexIt(component) {
    var c1 = Math.floor(component / 15).toString(),
        c2 = (component - c1 * 15).toString(),
        hexVals = {
          "10": "a",
          "11": "b",
          "12": "c",
          "13": "d",
          "14": "e",
          "15": "f"
        };

    if ( hexVals[c2] ) {
      c2 = hexVals[c2];
    }

    if ( hexVals[c1] ) {
      c1 = hexVals[c1];
    } else if ( c1 == 17 ) {
      c1 = "f";
      c2 = "f";
    }

    return c1 + c2;

  }

});
