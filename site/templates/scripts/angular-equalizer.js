angular.module('directive.equalizer', []);

//equalizer and equalizerInner directives for primomo
//both directives should be the same, calling function equalize, but the equalizer directive uses the pre thing within the link bit, the means it is processed before equalizerInner

//equalizerInner directive
angular.module('directive.equalizer').directive('equalizerInner', ['$window', function ($window, link) {
    return {
        link: link,
        restrict: 'A',
		link: {
		    pre: function(scope, element, attrs){
				equalizeInner(element);
				angular.element($window).bind('resize', function(){
					equalizeInner(element);
					// manuall $digest required as resize event is outside of angular
					scope.$digest();
       			});
	   		}
		}
    };
 }]);
 
//equalizer directive
angular.module('directive.equalizer').directive('equalizer', ['$window', function ($window, link) {
    return {
        link: link,
        restrict: 'A',
		link: {
		    pre: function(scope, element, attrs){
				equalize(element);
				angular.element($window).bind('resize', function(){
					equalize(element);
					// manuall $digest required as resize event is outside of angular
					scope.$digest();
       			});
	   		}
		}
    };
 }]);
 
function equalizeInner(element) {
	
//console.log('equalize');

//set all nested heights to auto before processing
var nodes = Array.prototype.slice.call(element[0].querySelectorAll("*"), 0); 
for(var i=0; i<nodes.length; i++) {
 if (nodes[i].nodeName.toLowerCase() == 'div') {
//nodes[i].style.background = 'green';
nodes[i].style.height = 'auto';
 }
}

//set variables
var els = Array.prototype.slice.call(element.children());  
var row = [];
var max;
var top;
var containerHeight = element[0].offsetHeight;

//setHeights
function setHeights() {
row.forEach(function(e) {
  e.style.height = max + 'px';
});
}

//setHeightsLastRow
function setHeightsLastRow() {
row.forEach(function(e) {
var verticalOffset = e.offsetTop; 
var childHeight = containerHeight - e.offsetTop;
e.style.height = childHeight + "px";   
});
}

//process all except last row
for (var i=0; i < (els.length); i++) {
var el = els[i];
el.style.height = 'auto';
if (el.offsetTop !== top) {
  // new row detected
  setHeights();
  top = el.offsetTop;      
  max = 0;
  row = [];
}
row.push(el);
max = Math.max(max, el.offsetHeight);
}

//process last row
setHeightsLastRow(); // last row
}


function equalize(element) {
	
//console.log('equalize');

//set all nested heights to auto before processing
var nodes = Array.prototype.slice.call(element[0].querySelectorAll("*"), 0); 
for(var i=0; i<nodes.length; i++) {
 if (nodes[i].nodeName.toLowerCase() == 'div') {
//nodes[i].style.background = 'green';
nodes[i].style.height = 'auto';
 }
}

//set variables
var els = Array.prototype.slice.call(element.children());  
var row = [];
var max;
var top;
var containerHeight = element[0].offsetHeight;

//setHeights
function setHeights() {
row.forEach(function(e) {
  e.style.height = max + 'px';
});
}

//setHeightsLastRow (same as setHeights)
function setHeightsLastRow() {
row.forEach(function(e) {
  e.style.height = max + 'px';
});
}

//process all except last row
for (var i=0; i < (els.length); i++) {
var el = els[i];
el.style.height = 'auto';
if (el.offsetTop !== top) {
  // new row detected
  setHeights();
  top = el.offsetTop;      
  max = 0;
  row = [];
}
row.push(el);
max = Math.max(max, el.offsetHeight);
}

//process last row
setHeightsLastRow(); // last row
}