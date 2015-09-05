// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  var index = 0;
  var jLen = json.length;
  var failed = false;
  var digits = '0123456789';

  var checkFail = function (bool) {
    return failed = failed || !bool;
  };

  var skipSpaces = function () {
    while(json[index] === ' ' && index < jLen) {
      index++;
    }
  };

  var increment = function () {
    index++;
    skipSpaces();
  };

  var parseObj = function () {
    var obj = {};
    var property;
    var data;
    increment();

    while(json[index] !== '}' && index < jLen) {

      checkFail(json[index] === '\"');
      if (failed) { return undefined; }

      property = parseStr();

      checkFail(property !== undefined);
      checkFail(json[index] === ':');
      if (failed) { return undefined; }
      increment();

      data = parseJ();

      checkFail(data !== undefined);
      checkFail(json[index] === ',' || json[index] === '}');
      if (failed) { return undefined; }

      obj[property] = data;
      if(json[index] === ',') {
        increment();
      }
    }

    checkFail(json[index] === '}');
    if (failed) { return undefined; }
    increment();
    return obj;
  };

  var parseArr = function () {
    var arr = []
    var data;
    increment();


    while(json[index] !== ']' && index < jLen) {

      data = parseJ();

      checkFail(data !== undefined);
      checkFail(json[index] === ',' || json[index] === ']');
      if (failed) { return undefined; }

      arr.push(data);

      if(json[index] === ',') {
        increment();
      }

    }
    checkFail(json[index] === ']');
    if (failed) { return undefined; }

    increment();
    return arr;
  };

  var parseStr = function () {
    var str = '';
    index++;
    while((json[index] !== '\"')&& index < jLen) {
      if(json[index] === '\\') {
        str+= json[index];
        index++;
      }
      str += json[index];
      index++;
    }
    checkFail(json[index] === '\"');
    if (failed) { return undefined }

    increment();
    return str;
  };

  var parseNumber = function (subJson) {
    //attempts to create a number from a string.  Does not guarantee accuracy, and may overflow.
    //I may come back and figure out how to validate bounds before conversion, but that seems like an
    //entirely separate class of problem from the one at hand.
    var digitArr = [];
    var d = -1;
    var sign = 1;
    var hasDecimal = false;
    var digitTypes = {whole: 0, decimal: 0}

    if(subJson[i] === '-') {
      sign = -1;
    }

    checkFail((subJson[i] === '0' && subJson[i+1] === '.') || subJson[i] !== '0');
    if (failed) { return undefined }

    for(var i = (sign === 1 ? 0 : 1); i < subJson.length; i++) {
      if(subJson[i] === '.') {
        checkFail(!hasDecimal);
        if (failed) { return undefined }
        hasDecimal = true;
      } else {
        d = digits.indexOf(subJson[i]);
        checkFail(d !== -1);
        checkFail()
        
        if (failed) { return undefined }
        digitArr.push(d);
        hasDecimal ? digitTypes.decimal++ : digitTypes.whole++;
      }
      i++;
    }

    var dLen = digitArr.length;
    var factor;
    var result;
    if(digitTypes.whole > 0) {
      factor = Math.pow(10, digitTypes.whole-1);
    } else {
      factor = 0.1;
    }

    for(var j = 0; j < dLen; j++) {
      result += digitArr[j] * factor;
      factor /= 10;
    }

    return result;
  };

  var parseJ = function () {
    var firstChar = json[index];

    if(firstChar === '{') {
      return parseObj();

    } else if(firstChar === '[') {
      return parseArr();

    }else if(firstChar === '\"') {
      return parseStr();
    } else {
      var subJson = '';
      while(json[index] !== ']' && json[index] !== '}' && json[index] !== ',' && json[index] !== ' ' && index < jLen) {
        subJson += json[index];
        index++;
      }
      skipSpaces();
      if(subJson === 'true') {
        return true;
      } else if(subJson === 'false') {
        return false;
      } else if(subJson === 'null') {
        return null;
      } else if(firstChar === '-' || digits.indexOf(firstChar) !== -1) {
        return parseNumber(subJson);
      } else {
        checkFail(true);
        return undefined;
      }

    }
  }

var p = parseJ(json)
return p;

};

