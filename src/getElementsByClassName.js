// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:



var getElementsByClassName = function(className) {
  var nodeList = [];

  var classes = className.split(' ');
  classLen = classes.length;

  var hasClasses = function (node) {
    for(var i = 0; i < classLen; i++) {
      if(!node.classList.contains(classes[i])) {
        return false;
      }
    }
    return true;
  };

  var gebcn = function (node) {
    if(node.nodeType === 1) {
      if(hasClasses(node)) {
        nodeList.push(node);
      }
      var children = node.childNodes;
      var childrenLen = children.length;
      //this loop is effectively my base case because it prevents recursion when there are no children.
      for(var i = 0; i < childrenLen; i++) {
        gebcn(children[i]);
      }
    }
  };

  gebcn(document.body)

  return nodeList

};
