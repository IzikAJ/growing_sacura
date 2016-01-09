(function() {
  var GamePopup, PopupButton;

  PopupButton = (function() {
    PopupButton.prototype.radius = 2;

    PopupButton.prototype.state = 0;

    PopupButton.prototype.free = void 0;

    PopupButton.DEFAULT = 0;

    PopupButton.HOVER = 1;

    PopupButton.ACTIVE = 2;

    PopupButton.prototype.LINE_LEN = 20;

    function PopupButton(root, a, b, c, d) {
      this.root = root;
      if (Number.isFinite(a)) {
        this.rect = {
          l: a,
          t: b,
          r: c,
          b: d
        };
      } else {
        this.rect = a;
      }
      return;
    }

    PopupButton.prototype.render = function(g, data) {
      var gradient;
      if (data == null) {
        data = {};
      }
      g.save();
      gradient = g.createLinearGradient(0, this.rect.t + 10, 0, this.rect.b - 10);
      if (this.isHover()) {
        gradient.addColorStop(0, "#888");
        gradient.addColorStop(1, "#EEE");
      } else {
        gradient.addColorStop(0, "#EEE");
        gradient.addColorStop(1, "#999");
      }
      g.fillStyle = gradient;
      GameUtils.roundRect(g, this.rect.l, this.rect.t, this.rect.r, this.rect.b, this.radius);
      if (this.isActive()) {
        g.strokeStyle = "#040";
        g.lineWidth = 2;
      } else {
        g.strokeStyle = "#444";
        g.lineWidth = 1;
      }
      g.stroke();
      g.fill();
      g.restore();
      return this.renderContent(g, data);
    };

    PopupButton.prototype.renderContent = function(g, data) {
      var a, c, cx, cy, ddx, ddy, dx, dy, h, i, id, len, pos, ref, w;
      if (data == null) {
        data = {};
      }
      h = this.rect.b - this.rect.t;
      w = this.rect.r - this.rect.l;
      cx = this.rect.l + w * 0.5;
      cy = this.rect.t + h * 0.5;
      a = this.LINE_LEN;
      c = a * Math.sin(Math.PI / 3);
      g.save();
      g.strokeStyle = "#080";
      g.lineWidth = 2;
      g.beginPath();
      ref = this.free;
      for (id = i = 0, len = ref.length; i < len; id = ++i) {
        pos = ref[id];
        dx = pos.x - this.root.cell.x;
        dy = pos.y - this.root.cell.y;
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

    PopupButton.prototype.setHover = function(val) {
      if (val == null) {
        val = true;
      }
      return this.state = (this.state | PopupButton.HOVER) ^ (val ? PopupButton.DEFAULT : PopupButton.HOVER);
    };

    PopupButton.prototype.isHover = function() {
      return !!(this.state & PopupButton.HOVER);
    };

    PopupButton.prototype.setActive = function(val) {
      if (val == null) {
        val = true;
      }
      return this.state = (this.state | PopupButton.ACTIVE) ^ (val ? PopupButton.DEFAULT : PopupButton.ACTIVE);
    };

    PopupButton.prototype.isActive = function() {
      return !!(this.state & PopupButton.ACTIVE);
    };

    PopupButton.prototype.isOnElement = function(x, y) {
      return GameUtils.isOnRoundRect(x, y, this.rect.l, this.rect.t, this.rect.r, this.rect.b, this.radius);
    };

    PopupButton.prototype.onMove = function(e) {
      return this.setHover(this.isOnElement(e.offsetX, e.offsetY));
    };

    PopupButton.prototype.onClick = function(e) {
      var ref;
      if (this.isOnElement(e.offsetX, e.offsetY)) {
        this.setActive(true);
        if ((ref = this.root.cell) != null) {
          ref.connectTo(this.free);
        }
        return this.root.app.state = this.root.app.GAME;
      } else {
        return this.setActive(false);
      }
    };

    return PopupButton;

  })();

  GamePopup = (function() {
    GamePopup.prototype.rect = void 0;

    GamePopup.prototype.radius = 5;

    GamePopup.prototype.buttons = void 0;

    GamePopup.GET_V = 1;

    function GamePopup(app, vers) {
      var c;
      this.app = app;
      this._ = GamePopup;
      this.buttons = new Array();
      switch (vers) {
        case this._.GET_V:
          this.width = 200;
          this.height = 100 + 0;
          c = this.app.c;
          this.rect = {
            t: (c.height - this.height) * 0.5,
            b: (c.height - this.height) * 0.5 + this.height,
            l: (c.width - this.width) * 0.5,
            r: (c.width - this.width) * 0.5 + this.width
          };
          this.buttons.push(new PopupButton(this, this.rect.l + 10, this.rect.t + 10, this.rect.l + this.width * 0.5 - 5, this.rect.b - 10));
          this.buttons.push(new PopupButton(this, this.rect.l + this.width * 0.5 + 5, this.rect.t + 10, this.rect.r - 10, this.rect.b - 10));
          this.free = void 0;
          this.cell = void 0;
      }
    }

    GamePopup.prototype.renderPopupBG = function(shadow) {
      var c, g;
      c = this.app.c;
      g = this.app.g;
      g.save();
      g.fillStyle = "#fff";
      g.strokeStyle = "#000";
      g.lineWidth = 2;
      GameUtils.roundRect(g, this.rect.l, this.rect.t, this.rect.r, this.rect.b, this.radius);
      g.shadowBlur = 0;
      g.stroke();
      if (shadow) {
        g.shadowBlur = 5;
        g.shadowColor = "#666";
        g.shadowOffsetX = 0;
        g.shadowOffsetY = 4;
      } else {
        g.shadowBlur = 0;
      }
      g.fill();
      return g.restore();
    };

    GamePopup.prototype.renderContent = function() {
      var button, g, gradient, i, len, ref;
      g = this.app.g;
      g.save();
      gradient = g.createLinearGradient(0, this.rect.t + 10, 0, this.rect.b - 10);
      gradient.addColorStop(0, "#999");
      gradient.addColorStop(1, "#666");
      g.fillStyle = gradient;
      ref = this.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        button.render(g, {});
      }
      return g.restore();
    };

    GamePopup.prototype.render = function(shadow) {
      var g;
      if (shadow == null) {
        shadow = true;
      }
      g = this.app.g;
      g.save();
      this.renderPopupBG(shadow);
      this.renderContent();
      return g.restore();
    };

    GamePopup.prototype.onMove = function(e) {
      var button, i, len, ref;
      ref = this.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        button.onMove(e);
      }
    };

    GamePopup.prototype.onClick = function(e) {
      var button, i, len, ref;
      ref = this.buttons;
      for (i = 0, len = ref.length; i < len; i++) {
        button = ref[i];
        button.onClick(e);
      }
    };

    return GamePopup;

  })();

  window.PopupButton = PopupButton;

  window.GamePopup = GamePopup;

}).call(this);
