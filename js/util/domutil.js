/*
  A simple DOM utility in JavaScript. JQuery is big for my small project.

  @Usage Example:
    var firstDiv = DomUtil("#first");
    firstDiv.addClass("big");


  Follow the thoughts of Douglas(who writes the book <JavaScript: The Good Parts>)
  1. Use the good parts of JavaScript.
  2. Class-Free oriented programming. (use closure)

  一个简单的DOM操作工具。 JQuery对我的小项目有时候太大了。

  编写基本追寻Douglas的思想。
  第一，尽量使用JS的精粹部分。
  第二，面向 无类 编程class free oriented 。使用闭包。

  @author: MixFlow
  @Date: 2016
*/

function domUtil (selector, baseElement) {
  // @param: selector -> the CSS selector (string, e.g "#menu-button")
  baseElement = (typeof baseElement !== "undefined") ? baseElement: document; // # baseElement default value is the document
  var els;
  if (typeof selector === "string"){
    if(baseElement.get)
      baseElement = baseElement.get();

    els = baseElement.querySelectorAll(selector);
  }else if (selector.length){
    els = selector;
  }else{
    els = [selector];
  }

  function domel (el) {// the object for one dom element

    // the regural expression to match the class name
    var classReg = function (cls) {
      return new RegExp('(\\s|^)' + cls + '(\\s|$)');
    };

    function hasClass(cls){
      //String.match, there are no matches will return null.
      var matches = el.className.match(classReg(cls));
      if(matches){
        return true;
      }
      return false;
    };

    function addClass(cls){
      if (!hasClass(cls)){
        if (el.className.length > 0) {
          el.className += " " + cls;
        }else{
          // empty class before
          el.className = cls;
        }
      }
      return this;
    };

    function removeClass(cls) {
      el.className = el.className.replace(classReg(cls), '');
      return this;
    };

    function replaceClass(oldCls, newCls){
      removeClass(oldCls);
      addClass(newCls);
      return this;
    };

    function toggleClass(c1, c2){
      // switch the class between 'c1' and 'c2'
      // if there aren't 'c1' and 'c2' in original classname, then add 'c1' to the clazz;
      if(hasClass(c1)){
        replaceClass(c1, c2);
      }else if (hasClass(c2)) {
        replaceClass(c2, c1);
      }else{
        addClass(c1);
      }
      return this;
    };

    function get(){

      return el; // return DOM element.
    };

    // the exposed properties and functions.
    return {
      // the duplication is used for old browser capacity(IE11, old mobile browser).
      // get: get,/*get the DOM element*/ hasClass, addClass, removeClass, replaceClass, toggleClass,
      get: get,/*get the DOM element*/

      hasClass: hasClass, addClass: addClass,
      removeClass: removeClass,
      replaceClass: replaceClass, toggleClass: toggleClass,

      // wrap the element with the wrapper.
      wrap: function(wrapper) {
        var wrapperElement;
        if (wrapper.get){
          wrapperElement = wrapper.get;
        }else{
          // DOM element
          wrapperElement = wrapper;
        }

        var originalParent = el.parentNode;
        originalParent.replaceChild(wrapperElement, el); // replace original element with the wrapper.
        wrapperElement.appendChild(el); // make original element the child of wrapper.
      },

      // set multi attributes.
      setAttributes: function(attrs){
        /*
          @param attrs: the object, key-value map.
        */
        for(var key in attrs){
          if(attrs.hasOwnProperty(key)) {
            // Only 'attrs' object's properties itself. Exclude the prototype chain's properties
            el.setAttribute (key, attrs[key]);
          }
        }
        return this;
      },

      css: function(attrs){
        /*
          @param attrs: css parameters to values, e.g. {display:block, background-color:#000}
        */
        for(var key in attrs){
          if(attrs.hasOwnProperty(key))
            el.style[key] = attrs[key]
        }
        return this;
      },

      // register events
      on: function(evt, callback){
        /*
          @param evt: event string.
          @param callback: the callback function when the event(s) is(are) fired.
        */
        var evts = evt.split(" "); // multiply events defined in the string with space
        for (var i = 0; i < evts.length; i = i + 1){
          el.addEventListener(evts[i], callback, false);
        }
        return this;
      }

    }; // [end] return the object (expose the properties and functions)
  }// [end] domel object

  // the helper function.
  // domels (array) call the open(public) functions. apply to each domel of the array.
  var map = function(domels, fnStr, args){
    /*
     @param fn: function name (string)
    */

    for (var i = 0; i < domels.length; i += 1) {
      domels[i][fnStr].apply(domels[i], args)
    }
    // TODO; need improvement. should return values instead of domels when the map function return value
    return domels;
  }
  // the open(public) function of domels (array)
  var publicFunctions = ['css', 'setAttributes'];

  // return one domel object OR return domel objects array
  if (els.length === 1){
    return domel(els[0]);
  }else{
    var domels = [];
    //for (var i = els.length - 1; i >= 0; i= i-1){ // reverse order
    for (var i = 0; i < els.length; i += 1){
      domels.push( domel(els[i]) );
    }

    // the helper function
    var map_helper = function(fnStr) {
      return function() {
        return map(domels, fnStr, arguments)
      };
    };

    // register the public funtions to the domels (array)
    for (var j = 0; j < publicFunctions.length; j += 1) {
      var publicFn = publicFunctions[j];
      domels[publicFn] = map_helper(publicFn);

      // bad example. confuse result. Should avoid create function in loop.
      // domels[publicFn] = function(){
      //   map(domels, publicFn, arguments);
      // };
      // bad example [end]
    }

    return domels;
  }

}

var mixUtil = (function (){

  /*
    scroll to Y with animation solution
    http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation#answer-26808520
  */
  // first add raf shim
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);  // 1000 ms / 60 frames
            };
  })();

  // main function
  function scrollToY(options) {
      // scrollTargetY: the target scrollY property of the window
      // speed: time in pixels per second
      // easing: easing equation to use
      options = options || {}

      var scrollY = window.scrollY || document.documentElement.scrollTop,
          scrollTargetY = options.scrollTargetY || 0,
          speed = options.speed || 2000, // ms
          easing = options.easing || 'easeOutSine',
          currentTime = 0;

      // min time .1, max time .8 seconds
      var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

      // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
      var easingEquations = {
              easeOutSine: function (pos) {
                  return Math.sin(pos * (Math.PI / 2));
              },
              easeInOutSine: function (pos) {
                  return (-0.5 * (Math.cos(Math.PI * pos) - 1));
              },
              easeInOutQuint: function (pos) {
                  if ((pos /= 0.5) < 1) {
                      return 0.5 * Math.pow(pos, 5);
                  }
                  return 0.5 * (Math.pow((pos - 2), 5) + 2);
              }
          };

      // add animation loop
      function tick() {
          currentTime += 1 / 60;

          var p = currentTime / time;
          var t = easingEquations[easing](p);

          if (p < 1) {
              requestAnimFrame(tick);

              window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
          } else {
              // console.log('scroll done');
              window.scrollTo(0, scrollTargetY);
          }
      }

      // call it once to get started
      tick();
  }; // [end] scrollToY

  return {
    scrollToY: scrollToY
  }; // return public object
})(); // call anonymous function which returns the util object

if (true) { // bind mixUtil helper function in domUtil
  for (var key in mixUtil) {
    if (mixUtil.hasOwnProperty(key)){
      // domUtil is Function instance, also Object
      domUtil[key] = mixUtil[key]
    }

  }
}
