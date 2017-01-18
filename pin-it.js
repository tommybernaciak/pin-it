(function ($) {
  "use strict";
  $.fn.pin = function (options) {
    var scrollY = 0, elements = [], disabled = false
    options = options || {};
    var $window = options.windowSelector ? $(options.windowSelector) : $(window);

    var recalculateLimits = function () {
      for (var i=0, len=elements.length; i<len; i++) {
        var $this = elements[i];

        var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
        var pinOffset = $this.offset();
        var containerOffset = $container.offset();
        var windowOffset = $this.offsetParent().offset();

        if (!$this.parent().is(".pin-wrapper")) {
          $this.wrap("<div class='pin-wrapper'>");
        }

        $this.data("pin", {
          from: options.containerSelector ? containerOffset.top : pinOffset.top,
          to: containerOffset.top + $container.height() - $this.outerHeight(),
          end: containerOffset.top + $container.height(),
          windowTop: windowOffset.top
        });

        $this.css({width: $this.outerWidth()});
        $this.parent().css("height", $this.outerHeight());
      }
    };

    var onScroll = function () {
      // if (disabled) { return; }

      scrollY = $window.scrollTop();
      // var windowOffset = $window.offset();

      for (var i=0, len=elements.length; i<len; i++) {
        var $this = $(elements[i]),
            data  = $this.data("pin"),
            from  = data.from,
            to    = data.to,
            windowTop = data.windowTop;

        if (from + $this.outerHeight() > data.end) {
          $this.css('position', '');
          continue;
        }

        if (from - windowTop < scrollY && to - windowTop > scrollY) {
          !($this.css("position") == "fixed") && $this.css({
            left: $this.offset().left,
            top: windowTop
          }).css("position", "fixed");
        } else if (scrollY >= to - windowTop) {
          $this.css({
            left: "auto",
            top: to - windowTop
          }).css("position", "absolute");
        } else {
          $this.css({position: "", top: "", left: ""});
        }
      }
    };

    var update = function () { recalculateLimits(); onScroll(); };

    this.each(function () {
      var $this = $(this),
          data  = $(this).data('pin') || {};

      if (data && data.update) { return; }
      elements.push($this);
      $("img", this).one("load", recalculateLimits);
      data.update = update;
      $(this).data('pin', data);
    });

    $window.scroll(onScroll);
    $window.resize(function () { recalculateLimits(); });
    recalculateLimits();

    $window.on('load', update);

    return this;
  };
})(jQuery);


// $(".pinned").pin({containerSelector: ".container", windowSelector: ".window"})
