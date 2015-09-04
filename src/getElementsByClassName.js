// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:



var getElementsByClassName = function(className) {
  var nodeList = [];
  var nodeListLength = 0;

  var classes = className.split(' ');
  classLen = classes.length;

  var hasClasses = function (node) {
    var cl = node.classList;
    clLen = cl.length;
    if(clLen >= classLen) {
      for(var i = 0; i < classLen; i++) {
        var classInList = false;
        for(var j = 0; j < clLen; j++) {
          if(classes[i] === cl[j]) {
            classInList = true;
          }
        }
        if(!classInList) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };

  var gebcn = function (node) {
    if(node.nodeType === 1) {
      if(hasClasses(node)) {
        nodeList[nodeListLength]= node;
        nodeListLength++;
      }
      var children = node.childNodes;
      var childrenLen = children.length;
      //this loop is effectively my base case because it prevents recursion when there are no children.
      for(var i = 0; i < childrenLen; i++) {
        gebcn(children[i]);
      }
    }
  };

  gebcn(document.body);

  return nodeList;

};
