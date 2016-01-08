(function() {
  var GamePopup, PopupButton;

  PopupButton = (function() {
    PopupButton.prototype.radius = 5;

    PopupButton.prototype.state = 0;

    PopupButton.prototype.renderContent = void 0;

    PopupButton.DEFAULT = 0;

    PopupButton.HOVER = 1;

    PopupButton.ACTIVE = 2;

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
        gradient.addColorStop(0, "#666");
        gradient.addColorStop(1, "#999");
      } else {
        gradient.addColorStop(0, "#999");
        gradient.addColorStop(1, "#666");
      }
      g.fillStyle = gradient;
      this.root.roundRect(g, this.rect.l, this.rect.t, this.rect.r, this.rect.b, this.radius);
      g.fill();
      g.restore();
      if (this.renderContent) {
        return this.renderContent(g, data);
      }
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

    PopupButton.isOnRect = function(x, y, x1, y1, x2, y2) {
      return (x >= x1) && (x <= x2) && (y >= y1) && (y <= y2);
    };

    PopupButton.isOnCircle = function(x, y, x1, y1, r) {
      return ((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y)) <= (r * r);
    };

    PopupButton.prototype.isOnElement = function(x, y) {
      return PopupButton.isOnRect(x, y, this.rect.l + this.radius, this.rect.t, this.rect.r - this.radius, this.rect.b) || PopupButton.isOnRect(x, y, this.rect.l, this.rect.t + this.radius, this.rect.r, this.rect.b - this.radius) || PopupButton.isOnCircle(x, y, this.rect.l + this.radius, this.rect.t + this.radius) || PopupButton.isOnCircle(x, y, this.rect.r - this.radius, this.rect.t + this.radius) || PopupButton.isOnCircle(x, y, this.rect.l + this.radius, this.rect.b - this.radius) || PopupButton.isOnCircle(x, y, this.rect.r - this.radius, this.rect.b - this.radius);
    };

    PopupButton.prototype.onMove = function(e) {
      return this.setHover(this.isOnElement(e.offsetX, e.offsetY));
    };

    PopupButton.prototype.onClick = function(e) {
      if (this.isOnElement(e.offsetX, e.offsetY)) {
        return this.setActive(true);
      }
    };

    return PopupButton;

  })();

  GamePopup = (function() {
    GamePopup.prototype.rect = void 0;

    GamePopup.prototype.radius = 10;

    GamePopup.prototype.btn_radius = 5;

    GamePopup.prototype.buttons = void 0;

    GamePopup.GET_V = 1;

    function GamePopup(app, vers) {
      var c;
      this.app = app;
      this._ = GamePopup;
      this.buttons = new Array();
      switch (vers) {
        case this._.GET_V:
          console.log('create GET_V version');
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

    GamePopup.prototype.roundRect = function(g, x1, y1, x2, y2, radius) {
      g.beginPath();
      g.moveTo(x1, y1 + radius);
      g.arcTo(x1, y1, x2, y1, radius);
      g.arcTo(x2, y1, x2, y2, radius);
      g.arcTo(x2, y2, x1, y2, radius);
      g.arcTo(x1, y2, x1, y1, radius);
      return g.closePath();
    };

    GamePopup.prototype.renderPopupBG = function(shadow) {
      var c, g;
      c = this.app.c;
      g = this.app.g;
      g.save();
      g.fillStyle = "#fff";
      g.strokeStyle = "#000";
      g.lineWidth = 2;
      this.roundRect(g, this.rect.l, this.rect.t, this.rect.r, this.rect.b, this.radius);
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
