(function() {
  var GamePopup;

  GamePopup = (function() {
    GamePopup.prototype.rect = void 0;

    GamePopup.prototype.radius = 10;

    GamePopup.prototype.btn_radius = 5;

    GamePopup.GET_V = 1;

    function GamePopup(app, vers) {
      var c;
      this.app = app;
      this._ = GamePopup;
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

    GamePopup.prototype.renderPopupBG = function() {
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
      g.shadowBlur = 5;
      g.shadowColor = "#666";
      g.shadowOffsetX = 0;
      g.shadowOffsetY = 4;
      g.fill();
      g.restore();
      return this.renderContent();
    };

    GamePopup.prototype.renderContent = function() {
      var g, gradient;
      g = this.app.g;
      g.save();
      gradient = g.createLinearGradient(0, this.rect.t + 10, 0, this.rect.b - 10);
      gradient.addColorStop(0, "#999");
      gradient.addColorStop(1, "#666");
      g.fillStyle = gradient;
      this.roundRect(g, this.rect.l + 10, this.rect.t + 10, this.rect.l + this.width * 0.5 - 5, this.rect.b - 10, this.btn_radius);
      g.fill();
      this.roundRect(g, this.rect.l + this.width * 0.5 + 5, this.rect.t + 10, this.rect.r - 10, this.rect.b - 10, this.btn_radius);
      g.fill();
      return g.restore();
    };

    GamePopup.prototype.render = function() {
      var g;
      g = this.app.g;
      g.save();
      this.renderPopupBG();
      g.restore();
      return {
        onClick: function(e) {}
      };
    };

    return GamePopup;

  })();

  window.GamePopup = GamePopup;

}).call(this);
