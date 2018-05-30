// Generated by CoffeeScript 1.12.7
(function() {
  var $;

  $ = domUtil;

  $(document).on('DOMContentLoaded', function(evt) {
    var changeMiddleInfo, galleryImageInterval, mediaQuery, showBGVideo, showBGVideoBaseOnMedieQuery, text_info_setting;
    mediaQuery = window.matchMedia("(all)");
    galleryImageInterval = void 0;
    text_info_setting = {
      0: {
        title: 'Blender Cycles 室内 interior 高质量作品',
        link: '/2018/05/29/blender-cycles-interior/',
        detail: '点击查看个人作品，<br/>照片级 3D 作品，基于现实设计，真实再现'
      },
      1: {
        title: 'Unreal Engine 4 虚幻四作品 「林中小径」',
        link: '/2017/08/22/UE4-work-forest-path-with-panorama/',
        detail: '点击查看个人作品，<br/>使用UE4构建光影斑驳的森林场景 <br/>包含全景画方式浏览，360° & 180°观看四周'
      },
      2: {
        title: '神经网络算法转变 图画的艺术风格',
        link: '/2017/06/27/image-style-transfer-using-neural-style',
        detail: '点击查看一系列作品，纯粹由卷积神经网络算法生成的作品'
      }
    };
    changeMiddleInfo = (function(key_indices_to_infos) {
      var info, info_dom, text_info, text_info_dom;
      info = $(".gallery-middle-info-wrap .info-wrap .info");
      text_info = $(".gallery-middle-info-wrap .text-info");
      info_dom = info.get();
      text_info_dom = text_info.get();
      return function(key) {
        var item, replace_info, replace_link, replace_text_info;
        item = key_indices_to_infos[key];
        if (item) {
          replace_info = item["title"];
          replace_link = item["link"];
          replace_text_info = item["detail"];
          if (replace_info) {
            info_dom.innerText = replace_info;
          }
          if (replace_link) {
            info.setAttributes({
              href: replace_link
            });
          }
          if (replace_text_info) {
            return text_info_dom.innerHTML = replace_text_info;
          }
        }
      };
    })(text_info_setting);
    showBGVideo = (function() {
      var is_show, time2key;
      is_show = false;
      time2key = {
        0: 1,
        12: 1,
        24: 2
      };
      return function() {
        var gallery, images, ref, v, videoSource;
        if (!is_show) {
          v = document.createElement("video");
          videoSource = 'videos/BookRoom.mkv';
          $(v).setAttributes({
            loop: 'loop',
            muted: 'muted',
            preload: 'auto',
            autoplay: 'autoplay',
            src: videoSource
          }).on('timeupdate', (function(_this) {
            return function(evt) {
              var key, now;
              now = evt.target.currentTime.toFixed(0);
              key = time2key[now];
              if (key) {
                return changeMiddleInfo(key);
              }
            };
          })(this));
          gallery = $(".gallery");
          gallery.get().appendChild(v);
          images = (ref = $("img", gallery)) != null ? ref.css({
            display: 'none'
          }) : void 0;
          if (galleryImageInterval) {
            clearInterval(galleryImageInterval);
          }
          return is_show = true;
        }
      };
    })();
    showBGVideoBaseOnMedieQuery = function(mediaQuery) {
      if (mediaQuery.matches) {
        return showBGVideo();
      } else {

      }
    };
    (function(mediaQuery) {
      var gallery, galleryImageLoop, i, images, img, len, off_css, on_css;
      if (!mediaQuery.matches) {
        on_css = {
          opacity: 1
        };
        off_css = {
          opacity: 0
        };
        gallery = $(".gallery");
        images = $("img.gallery-image", gallery);
        if (!images.length) {
          images = [images];
        }
        images.css(off_css);
        images[0].css(on_css);
        for (i = 0, len = images.length; i < len; i++) {
          img = images[i];
          if (!img.get().getAttribute("src")) {
            img.setAttributes({
              src: img.get().getAttribute("data-src")
            });
          }
        }
        galleryImageLoop = (function() {
          var current_idx;
          current_idx = 0;
          return function() {
            images.css(off_css);
            if (current_idx >= images.length) {
              current_idx = 0;
            }
            $('#gallery-image-' + (current_idx + 1), gallery).css(on_css);
            changeMiddleInfo(current_idx);
            return current_idx += 1;
          };
        })();
        galleryImageLoop();
        galleryImageInterval = setInterval(galleryImageLoop, 7500);
      }
    })(mediaQuery);
  });

}).call(this);
