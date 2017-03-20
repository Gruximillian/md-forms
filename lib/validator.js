(function(object) {
  object.validator = {};

// FUNCTION #1: 'isEmailAddress':
//
// Checks if the input parameter is an email address, consisting of three parts:
// An email address consists of two strings combined by an @ symbol.

  validator.isEmailAddress = function(email) {
    if (!email) throw 'Missing parameter in "isEmailAddress" function: "email"';

    var emailSplit = email.split('@'),
        address,
        domain,
        addLen,
        domLen,
        allowedChars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-', '_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

    // if the length after splitting on '@' character is not 2, then the email is not valid
    if ( emailSplit.length === 2 ) {
      address = emailSplit[0];
      domain = emailSplit[1];
      addLen = address.length;
      domLen = domain.length,
      addressChar,
      domainChar;
      // if address or domain part are empty, mail is not valid
      if ( !address || !domain ) return false;

      for ( var i = 0; i < addLen; i++ ) {
        var addressChar = address.charAt(i);
        // there are invalid characters in the address part
        if ( allowedChars.indexOf(addressChar) === -1 ) return false;
        // if the '.' is at the start or the end of the address
        if ( addressChar === '.' && ( i === 0 || i === addLen - 1 ) ) return false;
        // if there are two consecutive '.' characters
        if ( i > 0 && address.charAt(i - 1) === '.' && addressChar === '.' ) return false;
      }

      for ( var i = 0; i < domLen; i++ ) {
        var domainChar = domain.charAt(i);
        // there are invalid characters or the underscore in the domain part
        if ( allowedChars.indexOf(domainChar) === -1 || domainChar === '_' ) return false;
        // if the '.' or '-' is at the start or the end of the domain
        if ( ( domainChar === '.' || domainChar === '-' ) && ( i === 0 || i === domLen - 1 ) ) return false;
        // if there are two consecutive '.' characters
        if ( i > 0 && domain.charAt(i - 1) === '.' && domainChar === '.' ) return false;
      }

    } else return false;

    return true;
  }

// FUNCTION #2: 'isPhoneNumber'
//
// checks if the input is the phone number, i.e. follows the appropriate phone number format
// in Serbia the format is: prefix(delimiter)number
// delimiter can be '/', '-', space or it may not exist
// the number can have 6 or 7 digits delimited after 3rd or 4th digit depending on the number of digits in the number
// '/' can only delimit prefix from the number, in that case the number can be delimited with either space or '-' or not be delimited at all
// space can delimit the prefix and the number, but the number can also be delimited with '-' if the prefix is delimited with space
// '-' can delimit the prefix, the number can be delimited with another '-' but not with space, the number may also not be delimited

  validator.isPhoneNumber = function(input) {
    // Checks phone numbers in Serbia
    if ( this.isEmpty(input) ) throw 'Missing parameter in "isPhoneNumber" function: "number"';

    var prefixes = ['0230', '0280', '0290', '0390', '061', '061', '062', '063', '064', '065', '066', '069'], // special ones and mobile ones (06*)
        i,
        input = input.trim(), // remove spaces before and after the number
        numLen = input.length,
        prefix = '',
        prefixLength,
        prefixDelimiter = '',
        numberDelimiter = '',
        mainNum = '',
        validNum = false,
        digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        chars = ['/', '-', ' ']; // allowed characters in the phone number

    // fill array with area prefixes
    for ( i = 0; i <= 29; i++ ) {
      // area prefixes go from '010' to '039', including the special ones
      prefixes.push( '0' + (10 + i).toString() );
    }

    // console.log('input: ', input);

    if ( input.indexOf('/') !== input.lastIndexOf('/') ) {
      // only one forward slash can exist
      console.error('Multiple forward slashes!');
      return false;
    }

    // if a character from number is not a digit or allowed character, then it is not a phone number
    for ( i = 0; i < numLen; i++ ) {
      if ( digits.indexOf(input.charAt(i)) === -1 && chars.indexOf(input.charAt(i)) === -1 ) {
        console.error('Invalid characters!');
        return false;
      }
    }

    // extract the prefix
    // the forward slash can only be on the third or fourth position
    if ( input.indexOf('/') === 3 || input.indexOf('/') === 4 ) {
      prefixLength = input.indexOf('/');
    } else if ( input.indexOf('/') !== -1 ) {
      console.error('Wrong position of forward slash!');
      return false;
    }

    function getPrefix(number, delimiter) {
      var prefix = number.split(delimiter)[0],
          prefixLength = prefix.length;

      //console.log('delimiter: ', delimiter);
      //console.log('prefix: ', prefix);
      //console.log('prefixLength: ', prefixLength);
      if ( prefixLength === 3 || prefixLength === 4 ) {
        return prefix;
      } else return '';
    }

    // test for all delimiters
    prefix = getPrefix(input, '/');
    if ( prefix ) prefixDelimiter = '/';
    if ( !prefix ) {
      prefix = getPrefix(input, ' ');
      prefixDelimiter = ' ';
    }
    if ( !prefix ) {
      prefix = getPrefix(input, '-');
      prefixDelimiter = '-';
    }

    // if preix is not determined by a delimiter, then assume it is a 3 digit prefix
    if ( !prefix ) {
      for ( i = 0; i < 3; i++ ) {
        prefix = prefix + input.charAt(i);
      }
      prefixDelimiter = '';
      // console.log('No prefix delimiter.');
    }

    // console.log('Prefix: ', prefix);
    // console.log('Prefix delimiter: ', prefixDelimiter);

    // check if prefix is valid
    if ( prefixes.indexOf(prefix) === -1 ) {
      // invalid prefix
      console.error('Invalid prefix!');
      return false;
    }

    // extract the main number
    if ( prefixDelimiter ) {
      mainNum = input.slice(input.indexOf(prefixDelimiter) + 1);
    } else {
      mainNum = input.slice(3);
    }

    function checkMainNumber (mainNum, delimiter) {
      var len,
          numFiltered,
          i;

      switch (delimiter) {
        case '':
          // if there is no prefix delimiter, then no other delimiters are allowed
          if ( mainNum.indexOf(' ') !== -1 ) return false;
          if ( mainNum.indexOf('-') !== -1 ) return false;
          break;
        case '/':
          // fallthrough, the '/' and ' ' cases are the same
        case ' ':
          // if the prefix delimiter is a space or '/', then it is allowed to have either space or dash
          //  as the delimiter in the main number, but not both

          // there can't be two different demlimiters in the number
          if ( mainNum.indexOf('-') !== -1 && mainNum.indexOf(' ') !== -1 ) return false;

          if ( mainNum.indexOf('-') === -1 && mainNum.indexOf(' ') !== -1 ) {
            // there is a space delimiter in the number
            if ( mainNum.indexOf(' ') !== mainNum.lastIndexOf(' ') || (mainNum.indexOf(' ') !== 3 && mainNum.indexOf(' ') !== 4) ) {
              console.error('Wrong number format! Space in the wrong positon.');
              return false;
            }
          }

          if ( mainNum.indexOf(' ') === -1 && mainNum.indexOf('-') !== -1 ) {
            // there is a dash delimiter in the number
            if ( mainNum.indexOf('-') !== mainNum.lastIndexOf('-') || (mainNum.indexOf('-') !== 3 && mainNum.indexOf('-') !== 4) ) {
              console.error('Wrong number format! Dash in the wrong position.');
              return false;
            }
          }

          break;
        case '-':
          // there can be no spaces in the number
          if ( mainNum.indexOf(' ') !== -1 ) return false;
          if ( mainNum.indexOf('-') !== mainNum.lastIndexOf('-') || (mainNum.indexOf('-') !== 3 && mainNum.indexOf('-') !== 4 && mainNum.indexOf('-') !== -1) ) {
            console.error('Wrong number format! Dash in the wrong position.');
            return false;
          }
          break;
      }

      // filter special characters from the main number
      numFiltered = mainNum.split('').filter(function(digit) {
        if ( digits.indexOf(digit) !== -1 ) {
          return digit;
        }
      }).join(''); // ugly solution!!!!!!!!!

      len = numFiltered.length;

      for ( i = 0; i < len; i++ ) {
        if ( digits.indexOf(numFiltered.charAt(i)) === -1 ) {
          console.error('Not all digits!');
          return false;
        }
      }

      if ( len < 6 || len > 7 ) {
        console.error('Invalid number length!');
        return false;
      }

      return true;
    }

    validNum = checkMainNumber(mainNum, prefixDelimiter);
    // console.log('Main number: ', mainNum);

    if ( validNum ) {
      // console.log('Valid Number!');
      return true;
    }

    // if there is no prefix delimiter and main number is not valid,
    // then check if the prefix is one of the extended prefixes
    if ( !prefixDelimiter && ( mainNum.length === 7 || mainNum.length === 8 ) ) {
      prefix = prefix + mainNum.charAt(0);
      mainNum = mainNum.slice(1);
      // console.log('Extended prefix: ', prefix);
      // console.log('Main number reduced: ', mainNum);
    }

    // again check if the extended prefix is valid
    if ( prefixes.indexOf(prefix) === -1 ) {
      // invalid prefix
      console.error('Invalid extended prefix!');
      return false;
    }

    // if the prefix is one of the extended prefixes
    // then check if the rest of the number is valid
    validNum = checkMainNumber(mainNum, prefixDelimiter);

    if ( validNum ) {
      // console.log('Valid Number with extended prefix!');
      return true;
    } else {
      console.error('Not a valid number!');
      return false;
    }

  }


// FUNCTION #3: 'withoutSymbols'
//
// return input string with all non-alphanumeric characters removed, ingoring spaces

  validator.withoutSymbols = function (input) {
    var aplhaNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        len = input.length,
        i,
        output = '';

    for ( i = 0; i < len; i++ ) {
      if ( aplhaNums.indexOf(input.charAt(i).toLowerCase()) !== -1 ) {
        output = output + input.charAt(i);
      }
    }

    return output;
  }


// FUNCTION  #4:'isDate'
//
// check if the input paramter is a valid date

  validator.isDate = function (input) {
    var date = new Date(input);
    if ( isNaN(date.getTime()) ) {
      return false;
    }
    return true;
  }


// FUNCTION #5: 'isBeforeDate'
//
// check if the input date is before the reference date

  validator.isBeforeDate = function (input, reference) {
    var date = new Date(input),
        ref = new Date(reference);

    if ( !this.isDate(date) ) throw 'Invalid input date!';
    if ( !this.isDate(ref) ) throw 'Invalid reference date!';

    return date.getTime() < ref.getTime();
  }


// FUNCTION #6: 'isAfterDate'
//
// check if the input date is after the reference date

  validator.isAfterDate = function (input, reference) {
    var date = new Date(input),
        ref = new Date(reference);

    if ( !this.isDate(date) ) throw 'Invalid input date!';
    if ( !this.isDate(ref) ) throw 'Invalid reference date!';

    return date.getTime() > ref.getTime();
  }

  /* Could this be done like so:
  // the problem is that it returns true if the day is the same
  validator.isAfterDate = function (input, reference) {
    return !this.isBeforeDate(input, reference);
  }
  */


// FUNCTION #7: 'isBeforeToday'
//
// check if the input date is before the current date

  validator.isBeforeToday = function (input) {
    var date = new Date(input);

    // throwing this error will prevent using the Constraint API validation
    //if ( !this.isDate(date) ) throw 'Invalid input date!';

    var dateYear = date.getFullYear(),
        dateMonth = date.getMonth(),
        dateDay = date.getDate(),
        today = new Date(),
        todayYear = today.getFullYear(),
        todayMonth = today.getMonth(),
        todayDay = today.getDate();

    if ( dateYear < todayYear ) {
      return true;
    } else if ( dateYear === todayYear && dateMonth < todayMonth ) {
      return true;
    } else if ( dateYear === todayYear && dateMonth === todayMonth && dateDay < todayDay ) {
      return true;
    }

    return false;
  }


// FUNCTION #8: 'isAfterToday'
//
// check if the input date is after the current date

  validator.isAfterToday = function (input) {
    var date = new Date(input);

    // throwing this error will prevent using the Constraint API validation
    //if ( !this.isDate(date) ) throw 'Invalid input date YAY!';

    var dateYear = date.getFullYear(),
        dateMonth = date.getMonth(),
        dateDay = date.getDate(),
        today = new Date(),
        todayYear = today.getFullYear(),
        todayMonth = today.getMonth(),
        todayDay = today.getDate();

    if ( dateYear > todayYear ) {
      return true;
    } else if ( dateYear === todayYear && dateMonth > todayMonth ) {
      return true;
    } else if ( dateYear === todayYear && dateMonth === todayMonth && dateDay > todayDay ) {
      return true;
    }

    return false;
  }

  /* Could this be done like so:
  // the problem is that it returns true if the day is the same
  validator.isAfterToday = function (input) {
    return !this.isBeforeToday(input);
  }
  */


// FUNCTION #9: 'isEmpty'
//
// check if the input is an empty string

  validator.isEmpty = function (input) {
    if ( input === null || input === undefined ) return false;

    // only strings
    if ( input === input.toString() ) {
      // empty string
      if ( !input ) return true;

      // check if the string consists only of whitespaces
      for ( var i = 0; i < input.length; i++ ) {
        if ( input.charAt(i) !== ' ' ) {
          return false;
        }
      }
      return true;
    } else return false;
  }


// FUNCTION #10: 'contains'
//
// check if the input contains one or more words within the words array

  validator.contains = function (input, words) {
    var len = words.length,
        input = input.toLowerCase(),
        index,
        wordLength,
        i,
        letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for ( i = 0; i < len; i++ ) {
      if ( input.indexOf(words[i].toLowerCase()) !== -1 ) {
        index = input.indexOf(words[i].toLowerCase());
        wordLength = words[i].length;

        if (  letters.indexOf(input.charAt(index - 1).toLowerCase()) === -1
              &&
              letters.indexOf(input.charAt(index + wordLength).toLowerCase()) === -1
            ) return true;
      }
    }
    return false;
  }


// FUNCTION #11: 'lacks'
//
// check if the input does not contain any of the words within the words array

  validator.lacks = function(input, words) {
    return !validator.contains(input, words);
  }


// FUNCTION #12: 'isComposedOf'
//
// check if input contains only strings found in the strings array

  validator.isComposedOf = function (input, strings) {
    var len = strings.length,
        i,
        input = input.toLowerCase();
    // sort the string array by the descending length of the strings
    // that way we can eliminate the longest strings first from the input string
    strings.sort(function (a, b) {
      return b.length - a.length;
    });

    for ( i = 0; i < len; i++ ) {
      while ( input.indexOf(strings[i].toLowerCase()) !== -1 ) {
        input = input.replace(strings[i].toLowerCase(), '');
      }
    }
    // console.log(input);
    return this.isEmpty(this.withoutSymbols(input));
  }


// FUNCTION #13: 'isLength'
//
// check if the length of the input string is less or equal to the parameter n

  validator.isLength = function (input, n) {
    return input.length <= n;
  }


// FUNCTION #14: 'isOfLength'
//
// check if the length of the input string is greater or equal to the parameter n

  validator.isOfLength = function (input, n) {
    return input.length >= n;
  }


//FUNCTION #15: 'countWords'
//
// conuts the number of words in the input parameter

  validator.countWords = function (input) {
    var i,
        len = input.length,
        wordsArray = [],
        word = '',
        letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    input = input.toLowerCase();
    for ( i = 0; i < len; i++ ) {
      if ( letters.indexOf(input.charAt(i)) !== -1 ) {
        word = word + input.charAt(i);
      } else if ( word ) {
        wordsArray.push(word);
        word = '';
      }
    }
    // if there are no non-letter characters at the end of the input string
    // we must push the last word into the array
    if ( word ) wordsArray.push(word);

    return wordsArray.length;
  }


// FUNCTION #16: 'lessWordsThan'
//
// check if the input string has word count less than or equal to the parameter n

  validator.lessWordsThan = function (input, n) {
    return this.countWords(input) <= n;
  }


// FUNCTION #17: 'moreWordsThan'
//
// check if the input string has word count greater than or equal to the parameter n

  validator.moreWordsThan = function (input, n) {
    return this.countWords(input) >= n;
  }


// FUNCTION #18: 'isBetween'
//
// check if the input is betwen floor and ceil values, including them

  validator.isBetween = function (input, floor, ceil) {
    // if the paramteres were entered as strings, convert them to numbers if possible
    input = +input;
    floor = +floor;
    ceil = +ceil;
    if ( floor > ceil ) throw '"floor" parameter is greater than "ceil" parameter!';
    if ( isNaN(input) || isNaN(floor) || isNaN(ceil) ) throw 'You have entered non-numeric values!';

    if ( floor <= input && input <= ceil ) {
      return true;
    }
    return false;
  }


// FUNCTION  #19: 'isAlphanumeric'
//
// check if input consists of only alphanumeric characters, a-z, A-Z and 0-9

  validator.isAlphanumeric = function (input) {
    var aplhaNums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        i,
        len = input.length;

    for ( i = 0; i < len; i++ ) {
      if ( aplhaNums.indexOf(input.charAt(i).toLowerCase()) === -1 ) return false;
    }
    return true;
  }


// FUNCTION #20: 'isCreditCard'
//
// check if input is a credit card or bank card number

  validator.isCreditCard = function (input) {
    // only uppercase letters allowed
    if ( input.toUpperCase() !== input ) return false;
    // if there are no hyphens, length is 16
    if ( input.length === 16 ) {
      return this.isAlphanumeric(input);
    }
    // if there are hyphens, the length is 19
    if ( input.length === 19 ) {
      var sections = input.split('-'),
          i,
          len = sections.length;

      // number sections are 4 characters long and must be aplhanumeric
      for ( i = 0; i < len; i++ ) {
        if ( sections[i].length !== 4 || !this.isAlphanumeric(sections[i]) ) return false;
      }
    } else return false;

    return true;
  }


// FUNCTION #21: 'isHex'
//
// check if the input string is hexadecimal color

  validator.isHex = function (input) {
    if ( !input ) throw 'No input parameter!';

    // the string must start with the '#' character
    if ( input.charAt(0) !== '#' ) return false;

    input = input.substring(1);
    var len = input.length,
        i,
        hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    // there must be 3 or 6 characters after the '#'
    if ( len !== 3 && len !== 6 ) return false;
    for ( i = 0; i < len; i++ ) {
      if ( hexChars.indexOf(input.charAt(i).toLowerCase()) === -1 ) return false;
    }
    // console.log('This is a hex color!');
    return true;
  }


// FUNCTION #22: 'isRGB'
//
// check if the input string is an RGB color

  validator.isRGB = function (input) {
    if ( !input ) throw 'No input parameter!';

    input = input.trim();
    input = input.split(')');
    // check if there is no closing parentheses
    if ( input.length !== 2 ) return false;
    input = input[0].split('rgb(')[1];

    // if the input can't be split with ')' and 'rgb(', then it is not an RGB color
    if ( !input ) return false;

    var colors = input.split(','),
        len = colors.length,
        i,
        component;
    
    // there must be 3 color components
    if ( len !== 3 ) return false;

    for ( i = 0; i < len; i++ ) {
      component = colors[i].trim();
      // no empty strings allowed
      if ( component === '' ) return false;
      // if the component is not empty, turn it into number
      component = +component;
      // don't allow floating point values
      if ( component !== parseInt(component) ) return false;
      // if the compnent isNaN or not between 0 and 255, it is not valid
      if ( isNaN(component) || component < 0 || component > 255 ) return false;
    }

    // console.log('This is a RGB color!');
    return true;
  }


// FUNCTION #23: 'isHSL'
//
// check if the input string is an HSL color

  validator.isHSL = function (input) {
    if ( !input ) throw 'No input parameter!';

    input = input.trim();
    input = input.split(')');
    // check if there is no closing parentheses
    if ( input.length !== 2 ) return false;
    input = input[0].split('hsl(')[1];

    // if the input can't be split with ')' and 'hsl(', then it is not an HSL color
    if ( !input ) return false;

    var components = input.split(','),
        len = components.length,
        H, S, L;
    
    // there must be 3 color components
    if ( len !== 3 ) return false;

    H = components[0].trim();
    S = components[1].trim();
    L = components[2].trim();

    // don't allow empty components
    if ( H === '' || S === '' || L === '' ) return false;

    // convert to numbers
    H = +H;
    S = +S;
    L = +L;

    // check component values
    // don't allow floating point values for H
    if ( H !== parseInt(H) ) return false;
    if ( isNaN(H) || H < 0 || H > 360 ) return false;
    if ( isNaN(S) || S < 0 || S > 1 ) return false;
    if ( isNaN(L) || L < 0 || L > 1 ) return false;

    // console.log('This is a HSL color!');
    return true;
  }


// FUNCTION #24: 'isColor'
//
// check if the input is a hex, RGB or HSL color

  validator.isColor = function (input) {
    if ( !input ) throw 'No input parameter!';

    input = input.trim();

    if ( input.charAt(0) === '#' ) return this.isHex(input);
    if ( input.charAt(0) === 'r' ) return this.isRGB(input);
    if ( input.charAt(0) === 'h' ) return this.isHSL(input);

    // if one of the above, then it is not a hex, RGB or HSL color
    return false;
  }


// FUNCTION #25: 'isTrimmed'
//
// check if the input string has leading or trailing whitespaces or too many spaces between the words

  validator.isTrimmed = function (input) {
    if ( !input ) throw 'No input parameter!';

    var len = input.length,
        i;

    // there is a leading whitespace
    if ( input.charAt(0) === ' ' ) return false;
    // there is a trailing whitespace
    if ( input.charAt(len - 1) === ' ' ) return false;

    // if there are no leading and trailing whitespaces
    // then check the rest of the string for multiple spaces between words
    for ( i = 1; i < len - 2; i++ ) {
      if ( input.charAt(i) === ' ' && input.charAt(i + 1) === ' ' ) return false;
    }

    return true;
  }


// FUNCTION #26: 'isCharacterSet'
//
// this function accepts a input string, and an object with character sets defined
// every item from character sets object has a key whose name is the name of the character set
// and the value that is an array of characters in that set
// This function will check if the input string characters are in the specified character sets
// I created it because I wanted to check for the name input in the forms, and I wanted to allow
// other characters than the english alphabet character to be valid

  validator.isCharacterSet = function(input, charSets) {
    var input = input.trim(),
        i,
        inputLen = input.length,
        found,
        char;

    for ( i = 0; i < inputLen; i++ ) {
      char = input.charAt(i).toLowerCase();
      found = false;
      for ( key in charSets ) {
        if ( charSets[key].indexOf(char) !== -1 && !found ) {
          //console.log('Found ' + char + ' in the ' + key + ' character set.');
          found = true;
        }
      //console.log(key + ': ' + charSets[key]);
      }
      if ( !found ) return false;
    }
    return true;
  }


// FUNCTION #27: 'isFullName'
//
// This function checks if the string represents a full name
// A full name consists of at least two words that are at least two characters long
// It does not check if the characters are valid characters for a name, that check must
// be performed before the string is passed to this function
// This was created for the CSS team project

  validator.isFullName = function(fullname) {
    var words,
        i, len,
        isFullName;

    // This function splits the string into words, and returns the array of words
    // Delimiters are space and hyphen, the delimiters that appear in the names of people
    function getWords(input) {
      var i, j, wordsArray = [],
          spaceDelimited = input.split(' '),
          len = spaceDelimited.length,
          hyphenDelimited;

      for ( i = 0; i < len; i++ ) {

        if ( spaceDelimited[i].indexOf('-') !== -1 ) {
          hyphenDelimited = spaceDelimited[i].split('-');
          for ( j = 0; j < hyphenDelimited.length; j++ ) {
            wordsArray.push(hyphenDelimited[j]);
          }
        } else {
          wordsArray.push(spaceDelimited[i]);
        }

      }
      // console.log('wordsArray: ', wordsArray);
      return wordsArray;
    }

    if ( this.isOfLength(fullname, 5) && fullname.indexOf(' ') !== -1 ) {
      isFullName = true;
      words = getWords(fullname);
      len = words.length;

      // if there are at least two words
      if ( words.length >= 2 ) {

        // if every word is longer than two characters
        for ( i = 0; i < len; i++ ) {
          if ( words[i].length >=2 && isFullName ) {
            isFullName = true;
          } else isFullName = false;
        }

      } else isFullName = false;

    }

    return isFullName;
  };

})(window);
