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
    while((json[index] === ' ' || json[index] === '\n' || json[index] === '\t' || json[index] === '\r') && index <= jLen) {
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

      checkFail(json[index] === ':');
      if (failed) { return undefined; }
      increment();

      data = parseJ();

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
    var start = 0;
    var foundDecimal = false;
    if(subJson[start] === '-') {
      start++;
    }
    if(subJson[start] === '0') {
      checkFail(subJson[start + 1] === '.' || subJson.length === 1)
      if(failed) { return undefined; }
      foundDecimal = true
      start += 2;
    }

    for(var i = start; i < subJson.length; i++) {
      checkFail(!(subJson[i] === '.' && foundDecimal));
      if(subJson[i] === '.') {
        foundDecimal = true;
      } else {
        checkFail(digits.indexOf(subJson[i]) !== -1);
      }
    }
    if( failed ) { return undefined; }
    if(foundDecimal) {
      return parseFloat(subJson);
    } else {
      return parseInt(subJson);
    }
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
      } else if(subJson === 'NaN') {
        return NaN;
      } else if(firstChar === '-' || digits.indexOf(firstChar) !== -1) {
        return parseNumber(subJson);
      } else {
        failed = true;
        return undefined;
      }

    }
  }

var p = parseJ(json)
return p;

};

