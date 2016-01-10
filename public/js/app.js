(function() {
  var GameApp;

  GameApp = (function() {
    GameApp.prototype.CELL_SIDE = 30;

    GameApp.prototype.CELL_OFFSET = 2;

    GameApp.prototype.map = void 0;

    GameApp.prototype.c = void 0;

    GameApp.prototype.g = void 0;

    GameApp.prototype.hover_cell = void 0;

    GameApp.prototype.active_cell = void 0;

    GameApp.prototype.state = 1;

    GameApp.prototype.controlls = void 0;

    GameApp.prototype.resetMapBtn = void 0;

    GameApp.prototype.randomMapBtn = void 0;

    GameApp.prototype.MENU = 0;

    GameApp.prototype.GAME = 1;

    GameApp.prototype.GET_V = 2;

    function GameApp(root) {
      this._ = GameApp;
      this.root = $(root).first();
      this.addControls();
      this.map = new HexaMap(this);
      this.getv_popup = new ArrowsPopup(this);
      this.sure_popup = new QueryPopup(this);
      if (this.c) {
        $(this.c).on("click", (function(_this) {
          return function(e) {
            return _this.onClick(e);
          };
        })(this));
        $(this.c).on("mousedown touchstart", (function(_this) {
          return function(e) {
            return true;
          };
        })(this));
        $(this.c).on("dblclick", (function(_this) {
          return function(e) {
            return _this.onDblClick(e);
          };
        })(this));
        $(this.c).on("mousemove touchstart", (function(_this) {
          return function(e) {
            return _this.onMove(e);
          };
        })(this));
      }
      this.render();
      return;
    }

    GameApp.prototype.addControls = function() {
      var canvas, yes_no_buttons;
      console.log("addControls");
      canvas = $("<canvas/>");
      canvas.attr('width', 600);
      canvas.attr('height', 400);
      this.c = canvas[0];
      this.g = this.c.getContext('2d');
      this.root.append(canvas);
      this.controlls = $("<div></div>");
      this.controlls.addClass("controlls");
      this.resetMapBtn = $("<a href='javascript:void(0);'>Reset</a>");
      this.resetMapBtn.addClass("button reset");
      this.controlls.append(this.resetMapBtn);
      yes_no_buttons = [$("<a href='javascript:void(0);'>No</a>").addClass("button reject"), $("<a href='javascript:void(0);'>Yes</a>").addClass("button accept")];
      this.resetMapBtn.on('click', (function(_this) {
        return function(e) {
          if (_this.map.isDirty()) {
            return _this.sure_popup.show(yes_no_buttons, function(key, val) {
              if (key) {
                return _this.map.resetMap();
              }
            });
          }
        };
      })(this));
      this.randomMapBtn = $("<a href='javascript:void(0);'>Random</a>");
      this.randomMapBtn.addClass("button random");
      this.controlls.append(this.randomMapBtn);
      this.randomMapBtn.on('click', (function(_this) {
        return function(e) {
          if (_this.map.isDirty()) {
            return _this.sure_popup.show(yes_no_buttons, function(key, val) {
              if (key) {
                return _this.map.randomizeMap();
              }
            });
          } else {
            return _this.map.randomizeMap();
          }
        };
      })(this));
      return this.root.prepend(this.controlls);
    };

    GameApp.prototype.onDblClick = function(e) {
      return false;
    };

    GameApp.prototype.onClick = function(e) {
      var cell, free, ref;
      switch (this.state) {
        case this.GAME:
          cell = HexaCell.getCellAt(this, e.offsetX, e.offsetY);
          if (cell !== this.active_cell) {
            if ((ref = this.active_cell) != null) {
              ref.setActive(false);
            }
            if (cell != null) {
              cell.setActive(true);
            }
            this.active_cell = cell;
          }
          if (cell != null ? cell.isFilled() : void 0) {
            free = HexaMap.splitFreeCells(this, cell);
            if (free.length > 1) {
              this.getv_popup.cell = cell;
              this.getv_popup.free = free;
              this.state = this.GET_V;
              this.getv_popup.show(this.getv_popup.items(), (function(_this) {
                return function(key, val) {
                  cell.connectTo(free[key]);
                  return _this.state = _this.GAME;
                };
              })(this));
            } else if (free.length === 1) {
              cell.connectTo(free);
            }
          }
          this.render();
          break;
        case this.GET_V:
          return;
      }
      return true;
    };

    GameApp.prototype.onMove = function(e) {
      var cell, ref;
      switch (this.state) {
        case this.GAME:
          cell = HexaCell.getCellAt(this, e.offsetX, e.offsetY);
          if (cell !== this.hover_cell) {
            if ((ref = this.hover_cell) != null) {
              ref.setHover(false);
            }
            if (cell != null) {
              cell.setHover(true);
            }
            this.hover_cell = cell;
            this.render();
          }
          break;
        case this.GET_V:
          return;
      }
      return true;
    };

    GameApp.prototype.render = function() {
      switch (this.state) {
        case this.GAME:
          this.g.fillStyle = "#eee";
          this.g.clearRect(0, 0, this.c.width, this.c.height);
          return this.map.render();
        case this.GET_V:
      }
    };

    GameApp.prototype.isState = function(state) {
      return this.state === state;
    };

    return GameApp;

  })();

  $(function() {
    var game;
    game = new GameApp($(".content .game"));
    return window.app = game;
  });

  window.GameApp = GameApp;

}).call(this);
