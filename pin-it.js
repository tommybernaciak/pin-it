(function ($) {
  "use strict";
  $.fn.pin = function (options) {
    var scrollY  = 0,
        elements = [];
    options = options || {};
    var $window = options.windowSelector ? $(options.windowSelector) : $(window);
    var initScroll = $window.scrollTop();

    function recalculateLimits() {
      for (var i=0, len=elements.length; i<len; i++) {
        var $this = elements[i];
        var $container = options.containerSelector ? $this.closest(options.containerSelector) : $(document.body);
        var pinOffset = $this.offset().top;
        var containerOffset = $container.offset().top;
        var windowOffset = $window.offset().top;

        if (!$this.parent().is(".pin-wrapper")) {
          $this.wrap("<div class='pin-wrapper'>");
        }

        $this.data("pin", {
          from: options.containerSelector ? containerOffset : pinOffset,
          to: containerOffset + $container.height() - $this.outerHeight(),
          end: containerOffset + $container.height(),
          windowTop: windowOffset
        });

        $this.css({width: $this.outerWidth()});
        $this.parent().css("height", $this.outerHeight());
      }
    }

    function onScroll() {
      scrollY = $window.scrollTop() - initScroll;

      for (var i=0, len=elements.length; i<len; i++) {
        var $this = $(elements[i]),
            data  = $this.data("pin");
        if (!data) { continue; }
        var from      = data.from,
            to        = data.to,
            windowTop = data.windowTop,
            end       = data.end;

        if (from + $this.outerHeight() > end) {
          $this.css('position', '');
          continue;
        }

        if (from - windowTop < scrollY && to - windowTop > scrollY) {
          !($this.css("position") == "fixed") && $this.css({
            top: windowTop,
            left: $this.offset().left
          }).css("position", "fixed");
        } else if (scrollY >= to - windowTop) {
          $this.css({
            top: to - windowTop + initScroll,
            left: "auto"
          }).css("position", "absolute");
        } else {
          $this.css({
            position: "",
            top: "",
            left: ""
          });
        }
      }
    }

    function update() { recalculateLimits(); onScroll(); }

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
