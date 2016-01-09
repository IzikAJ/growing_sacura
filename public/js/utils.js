(function() {
  var GameUtils;

  GameUtils = (function() {
    function GameUtils() {}

    GameUtils.rand = function(arg) {
      if (arg == null) {
        arg = void 0;
      }
      if (Array.isArray(arg)) {
        return arg[this.rand(arg.length)];
      } else if (Number.isFinite(arg)) {
        return ~~(Math.random() * arg);
      } else {
        return Math.random();
      }
    };

    GameUtils.randItems = function(array, count) {
      var ans, q;
      q = $.extend([], array);
      ans = new Array();
      while ((ans.length < count) && (q.length > 0)) {
        ans.push(q.splice(this.rand(q.length), 1)[0]);
      }
      return ans;
    };

    GameUtils.isOnRect = function(x, y, x1, y1, x2, y2) {
      return (x >= x1) && (x <= x2) && (y >= y1) && (y <= y2);
    };

    GameUtils.isOnCircle = function(x, y, x1, y1, r) {
      return ((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) <= (r * r);
    };

    GameUtils.isOnRoundRect = function(x, y, x1, y1, x2, y2, r) {
      return this.isOnRect(x, y, x1 + r, y1, x2 - r, y2) || this.isOnRect(x, y, x1, y1 + r, x2, y2 - r) || this.isOnCircle(x, y, x1 + r, y1 + r) || this.isOnCircle(x, y, x2 - r, y1 + r) || this.isOnCircle(x, y, x1 + r, y2 - r) || this.isOnCircle(x, y, x2 - r, y2 - r);
    };

    GameUtils.roundRect = function(g, x1, y1, x2, y2, radius) {
      g.beginPath();
      g.moveTo(x1, y1 + radius * 2);
      g.arcTo(x1, y1, x2, y1, radius * 2);
      g.arcTo(x2, y1, x2, y2, radius * 2);
      g.arcTo(x2, y2, x1, y2, radius * 2);
      g.arcTo(x1, y2, x1, y1, radius * 2);
      return g.closePath();
    };

    GameUtils.flatten = function(map) {
      return [].concat.apply([], map);
    };

    GameUtils.splitArray = function(arr, func) {
      var ans, v;
      if ($.isArray(arr) && $.isFunction(func)) {
        ans = {};
        v = arr.forEach(function(item) {
          var k;
          k = func(item);
          if (!ans[k]) {
            ans[k] = new Array();
          }
          return ans[k].push(item);
        });
        return $.map(ans, function(val, key) {
          if (val.length > 0) {
            return new Array(val);
          } else {
            return void 0;
          }
        });
      } else {
        return arr;
      }
    };

    return GameUtils;

  })();

  window.GameUtils = GameUtils;

}).call(this);
