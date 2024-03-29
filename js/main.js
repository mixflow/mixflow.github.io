(function() {
  var $, timer;

  $ = domUtil;

  timer = function(callback, delay) {
    var destory, destroyed, pause, paused, remain, resume, start, that, timerId;
    timerId = null;
    start = null;
    remain = delay;
    paused = false;
    destroyed = false;
    that = {};
    pause = function() {
      clearTimeout(timerId);
      if (!destroyed) {
        remain -= new Date() - start;
        return paused = true;
      }
    };
    resume = function() {
      start = new Date();
      clearTimeout(timerId);
      if (!destroyed) {
        timerId = setTimeout(callback, remain);
        return paused = false;
      }
    };
    destory = function() {
      clearTimeout(timerId);
      destroyed = true;
      return paused = false;
    };
    that.pause = pause;
    that.resume = resume;
    that.is_paused = function() {
      return paused;
    };
    that.destory = destory;
    resume();
    return that;
  };

  $(document).on('DOMContentLoaded', function(evt) {

    /*
      'currentResetHeaderFixedTimer' is the timer reset header which shows at top of screen
      it is generated in callback function of scroll event.
      the timer is exposed variable. because the close and open navigator will affect fixed header
      so the nav events callback function will use the timer
      pause reset timer when open navigator, resume this when close navigator.
     */
    var EMPTY_IMAGE, LOADING_CLASS, MICRODATA_ENABLE, addSmallClass, bLazy, blazyImg, blazyImgs, bookmarkLinks, changeMainLogo, currentResetHeaderFixedTimer, desktopMinResolution, i, imageWrapper, j, len, len1, link, mediaQuery, registerLinkScrollEvent, scrollCallback, scrollCallbackBaseOnMediaQuery, smallMediaQuery, target, targetId, verticalOffset;
    currentResetHeaderFixedTimer = null;
    $("#main-nav-switch").on('click', (function(_this) {
      return function(evt) {
        var navMenu, switchIcon;
        switchIcon = $("#main-nav-switch>.css-icon");
        navMenu = $("#main-nav-menu");
        if (switchIcon.hasClass("menu")) {
          navMenu.css({
            'z-index': 6,
            opacity: 1,
            display: 'block'
          });
          switchIcon.replaceClass('menu', 'X');
          return currentResetHeaderFixedTimer != null ? currentResetHeaderFixedTimer.pause() : void 0;
        } else {
          navMenu.css({
            'z-index': -1,
            opacity: 0,
            display: 'none'
          });
          switchIcon.replaceClass('X', 'menu');
          return currentResetHeaderFixedTimer != null ? currentResetHeaderFixedTimer.resume() : void 0;
        }
      };
    })(this));
    desktopMinResolution = 720;
    $("a#force-desktop").on('click', (function(_this) {
      return function(evt) {
        return $('meta[name="viewport"]').setAttributes({
          content: "width=" + desktopMinResolution + " initial-scale=1"
        });
      };
    })(this));
    mediaQuery = window.matchMedia("(min-width:" + desktopMinResolution + "px)");
    smallMediaQuery = window.matchMedia("(max-width: " + (desktopMinResolution - 1) + "px)");
    changeMainLogo = function(mq) {
      var logo;
      logo = $('body>header img.logo');
      return logo.setAttributes({
        src: mq.matches ? "/images/text-logo-v.png" : "/images/text-logo-h.png"
      });
    };
    changeMainLogo(mediaQuery);
    mediaQuery.addListener(changeMainLogo);
    verticalOffset = function() {
      return window.pageYOffset || document.documentElement.scrollTop;
    };
    scrollCallback = (function(lastVerticalOffset) {
      var activeHeaderFixed, header, resetHeaderFixed;
      header = $('body>header');
      activeHeaderFixed = function() {
        return header.addClass('fixed');
      };
      resetHeaderFixed = function() {
        return header.removeClass('fixed');
      };
      return function() {
        var currentVerticalOffset;
        currentVerticalOffset = verticalOffset();
        if (currentVerticalOffset < lastVerticalOffset) {
          activeHeaderFixed();
          if (!currentResetHeaderFixedTimer) {
            currentResetHeaderFixedTimer = timer(resetHeaderFixed, 2600);

            /*
              mouseover and mouseout may work fine on desktop(because there is mouse).
              BUT may NOT work fine on touch device(mobile and tablet)
            
               * header.on 'mouseover', -> currentResetHeaderFixedTimer?.pause()
               * header.on 'mouseout', -> currentResetHeaderFixedTimer?.resume()
             */
          }
        } else if (currentVerticalOffset > lastVerticalOffset) {
          if (currentResetHeaderFixedTimer && !currentResetHeaderFixedTimer.is_paused()) {
            resetHeaderFixed();
            if (currentResetHeaderFixedTimer != null) {
              currentResetHeaderFixedTimer.destory();
            }
            currentResetHeaderFixedTimer = null;
          }
        }
        return lastVerticalOffset = currentVerticalOffset;
      };
    })(verticalOffset());
    scrollCallbackBaseOnMediaQuery = function(mq) {
      return $(window).on('scroll', function() {
        if (mq.matches) {
          return scrollCallback();
        }
      });
    };
    scrollCallbackBaseOnMediaQuery(smallMediaQuery);
    addSmallClass = (function(selectors) {
      var els, selector, smallClz;
      els = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = selectors.length; i < len; i++) {
          selector = selectors[i];
          results.push($(selector));
        }
        return results;
      })();
      smallClz = 'small';
      return function(mq) {
        var el, i, j, len, len1, results, results1;
        if (mq.matches) {
          results = [];
          for (i = 0, len = els.length; i < len; i++) {
            el = els[i];
            results.push(el.addClass(smallClz));
          }
          return results;
        } else {
          results1 = [];
          for (j = 0, len1 = els.length; j < len1; j++) {
            el = els[j];
            results1.push(el.removeClass(smallClz));
          }
          return results1;
        }
      };
    })(['body>header']);
    addSmallClass(smallMediaQuery);
    smallMediaQuery.addListener(addSmallClass);
    bookmarkLinks = $('article .article-body a[href^="#"]');
    if (bookmarkLinks.length === void 0) {
      bookmarkLinks = [bookmarkLinks];
    }
    registerLinkScrollEvent = function(link, target) {
      return function(evt) {
        evt.preventDefault();
        return $.scrollToY({
          scrollTargetY: target.get().scrollTop || target.get().offsetTop
        });
      };
    };
    for (i = 0, len = bookmarkLinks.length; i < len; i++) {
      link = bookmarkLinks[i];
      targetId = link.get().getAttribute('href');
      target = $("article .article-body " + targetId);
      link.on('click', registerLinkScrollEvent(link, target));
    }
    blazyImgs = $(".b-lazy");
    if (blazyImgs.length === void 0) {
      blazyImgs = [blazyImgs];
    }
    EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    LOADING_CLASS = "loading";
    for (j = 0, len1 = blazyImgs.length; j < len1; j++) {
      blazyImg = blazyImgs[j];
      if (!blazyImg.getAttribute("src")) {
        blazyImg.setAttributes({
          "src": EMPTY_IMAGE
        });
        imageWrapper = document.createElement("div");
        imageWrapper = $(imageWrapper).addClass(LOADING_CLASS).addClass("image-wrapper");
        blazyImg.wrap(imageWrapper);
      }
    }
    bLazy = new Blazy({
      success: function(ele) {
        return $(ele.parentNode).removeClass(LOADING_CLASS);
      }
    });
    MICRODATA_ENABLE = true;
    if (MICRODATA_ENABLE) {
      return $('article .article-tag .article-tag-list-item').setAttributes({
        itemprop: 'keywords'
      });
    }
  });

}).call(this);
