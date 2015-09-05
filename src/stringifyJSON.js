// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {

  var string = ''
  var objType = typeof obj;
  if(obj === null) {
    objType = 'null';
  } else if (Array.isArray(obj)) {
    objType = 'array';
  }
  switch(objType) {

    case 'undefined':
    case 'function':
    case 'symbol':
      return '';
      break;

    case 'number':
    case 'boolean':
    case 'null':
      string += obj;
      break;

    case 'string':
      string += '\"' + obj + '\"';
      break;

    case 'array':
      string += '[';
      var subString;
      var len = obj.length;
      for(var i = 0; i <len; i++) {
        subString = '';
        subString += stringifyJSON(obj[i]);
        if(subString === '') {
          string += 'null';
        } else {
          string += subString;
        }
        if(i !== len - 1) {
          string += ',';
        }
      }
      string += ']';
      break;

    default:
      string += '{';
      var len = obj.length;
      var subString;
      var isFirst = true;
      for(var el in obj) {
        subString = '';
        if(typeof el === 'string') {
          subString += stringifyJSON(obj[el]);
          if(subString !== '') {
            if(isFirst) {
              isFirst = false;
            } else {
              string += ',';
            }
            string += ('\"' + el + '\":' + subString)
          }
        }
      }
      string += '}';

  }
  
  return string;
};
