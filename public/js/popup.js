(function() {
  var ArrowsPopup, BasePopup, QueryPopup,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BasePopup = (function() {
    function BasePopup(app) {
      this.app = app;
      this.popup = $("<div class='popup_overlay'><div class='popup'><div class='popup_content'></div></div></div>");
      this["class"] = this.constructor.name.replace(/[A-Z]/g, function(a, b, c, d, e) {
        if (b > 0) {
          return '_' + a;
        } else {
          return a;
        }
      }).toLowerCase();
      this.popup.addClass(this["class"]);
      this.app.root.find('.popup_overlay').filter("." + this["class"]).detach();
      this.app.root.append(this.popup);
      this.container = this.popup.find('.popup_content');
      this.container.empty();
      this.setContent();
      this.popup.on('click touchstart', (function(_this) {
        return function(e) {
          if ($(e.target).closest('.popup_content').length === 0) {
            _this.hide();
            return false;
          }
        };
      })(this));
    }

    BasePopup.prototype.setContent = function() {
      this.container.append('<input type="submit" value="True" />');
      return this.container.append('<input type="submit" value="False" />');
    };

    BasePopup.prototype.show = function() {
      return this.popup.show();
    };

    BasePopup.prototype.hide = function() {
      return this.popup.hide();
    };

    return BasePopup;

  })();

  QueryPopup = (function(superClass) {
    extend(QueryPopup, superClass);

    function QueryPopup() {
      return QueryPopup.__super__.constructor.apply(this, arguments);
    }

    QueryPopup.prototype.setContent = function() {};

    QueryPopup.prototype.show = function(elements, callback, default_result) {
      this.elements = elements != null ? elements : void 0;
      this.callback = callback != null ? callback : void 0;
      if (default_result == null) {
        default_result = void 0;
      }
      this.result = {
        undefined: default_result
      };
      this.container.html("<ul class='query-list'></ul>");
      $.each(this.elements, (function(_this) {
        return function(key, element) {
          var item;
          if (element instanceof jQuery) {
            item = element;
          } else {
            item = $("<li></li>").append(element);
          }
          _this.container.append(item);
          item.attr("data-query-key", key);
          return item.on('click', function() {
            _this.result = {
              key: key,
              value: element
            };
            _this.hide();
          });
        };
      })(this));
      return QueryPopup.__super__.show.call(this);
    };

    QueryPopup.prototype.hide = function() {
      if ($.isFunction(this.callback)) {
        this.callback(this.result.key, this.result.value);
      }
      return QueryPopup.__super__.hide.call(this);
    };

    return QueryPopup;

  })(BasePopup);

  ArrowsPopup = (function(superClass) {
    extend(ArrowsPopup, superClass);

    function ArrowsPopup() {
      return ArrowsPopup.__super__.constructor.apply(this, arguments);
    }

    ArrowsPopup.prototype.button_size = 60;

    ArrowsPopup.prototype.cell = void 0;

    ArrowsPopup.prototype.free = void 0;

    ArrowsPopup.prototype.items = function() {
      return [$("<canvas/>").attr('width', this.button_size).attr('height', this.button_size), $("<canvas/>").attr('width', this.button_size).attr('height', this.button_size)];
    };

    ArrowsPopup.prototype.renderArrows = function(btn, free, cell) {
      var a, c, cx, cy, ddx, ddy, dx, dy, g, i, id, len, pos;
      g = btn.getContext('2d');
      g.clearRect(0, 0, this.button_size, this.button_size);
      cx = cy = this.button_size * 0.5;
      a = this.button_size * 0.25;
      c = a * Math.sin(Math.PI / 3);
      g.strokeStyle = "#080";
      g.lineWidth = 2;
      g.beginPath();
      for (id = i = 0, len = free.length; i < len; id = ++i) {
        pos = free[id];
        dx = pos.x - cell.x;
        dy = pos.y - cell.y;
        ddx = (dx + dy) * 1.5 * a;
        ddy = (dy - dx) * c;
        g.moveTo(cx, cy);
        g.lineTo(cx + ddx, cy + ddy);
      }
      g.stroke();
      g.strokeStyle = "#800";
      g.beginPath();
      g.arc(cx, cy, 5, 0, 7);
      g.closePath();
      return g.fill();
    };

    ArrowsPopup.prototype.show = function(elements, callback, default_result) {
      this.elements = elements != null ? elements : void 0;
      this.callback = callback != null ? callback : void 0;
      if (default_result == null) {
        default_result = void 0;
      }
      ArrowsPopup.__super__.show.call(this, this.elements, this.callback, default_result);
      if ((this.cell != null) && (this.free != null)) {
        return this.container.find('canvas').each((function(_this) {
          return function(index, item) {
            return _this.renderArrows(item, _this.free[index], _this.cell);
          };
        })(this));
      }
    };

    return ArrowsPopup;

  })(QueryPopup);

  window.BasePopup = BasePopup;

  window.QueryPopup = QueryPopup;

  window.ArrowsPopup = ArrowsPopup;

}).call(this);
