(function() {
  var GameApp;

  GameApp = (function() {
    GameApp.prototype.CELL_SIDE = 30;

    GameApp.prototype.CELL_OFFSET = 2;

    GameApp.prototype.map = void 0;

    GameApp.prototype.connectors = void 0;

    GameApp.prototype.c = void 0;

    GameApp.prototype.g = void 0;

    GameApp.prototype.hover_cell = void 0;

    GameApp.prototype.active_cell = void 0;

    GameApp.prototype.state = 1;

    GameApp.prototype.MENU = 0;

    GameApp.prototype.GAME = 1;

    GameApp.prototype.GET_V = 2;

    function GameApp(element) {
      this._ = GameApp;
      this.c = element;
      this.g = this.c.getContext("2d");
      this.connectors = new Array();
      this.map = new HexaMap(this);
      this.getv_popup = new GamePopup(this, GamePopup.GET_V);
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

    GameApp.prototype.onDblClick = function(e) {
      var cell;
      switch (this.state) {
        case this.GAME:
          cell = HexaCell.getCellAt(this, e.offsetX, e.offsetY);
          if (cell) {
            cell.setFilled(!cell.isFilled());
            this.render();
          }
      }
      return false;
    };

    GameApp.prototype.onClick = function(e) {
      var cell, cell2, free, ref;
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
              cell.connectTo(free[0]);
            } else if (free.length === 1) {
              cell.connectTo(free);
            }
            cell2 = free[~~(free.length * Math.random())];
            console.log((free.map(function(v) {
              return (v.map(function(c) {
                return [c.x, c.y].join();
              })).join('; ');
            })).join(' | '));
          }
          this.render();
          break;
        case this.GET_V:
          this.getv_popup.onClick(e);
          this.getv_popup.render(false);
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
          this.getv_popup.onMove(e);
          this.getv_popup.render(false);
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
          this.g.clearRect(0, 0, this.c.width, this.c.height);
          this.map.render();
          this.g.fillStyle = "rgba(0, 0, 0, 0.5)";
          this.g.fillRect(0, 0, this.c.width, this.c.height);
          return this.getv_popup.render();
      }
    };

    GameApp.prototype.isState = function(state) {
      return this.state === state;
    };

    return GameApp;

  })();

  $(function() {
    var game;
    return game = new GameApp($(".content .canvas")[0]);
  });

  window.GameApp = GameApp;

}).call(this);
