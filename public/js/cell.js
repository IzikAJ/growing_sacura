(function() {
  var HexaCell;

  HexaCell = (function() {
    HexaCell.prototype.CELL_SIDE = void 0;

    HexaCell.prototype.CELL_OFFSET = void 0;

    HexaCell.prototype.color = "#000";

    HexaCell.prototype.state = 0;

    HexaCell.prototype.data = void 0;

    HexaCell.prototype.connectors = void 0;

    HexaCell.HOVER = 1;

    HexaCell.ACTIVE = 2;

    HexaCell.FILLED = 4;

    HexaCell.__count = 0;

    HexaCell.prototype.id = void 0;

    function HexaCell(app1, x1, y1) {
      this.app = app1;
      this.x = x1;
      this.y = y1;
      this._ = HexaCell;
      this.CELL_SIDE = this.app.CELL_SIDE;
      this.CELL_OFFSET = this.app.CELL_OFFSET;
      this.connectors = new Array();
      this.id = this._.__count++;
    }

    HexaCell.prototype.render = function(offset) {
      var a, c, g, pos, xx, yy;
      if (offset == null) {
        offset = [0, 0];
      }
      a = this.CELL_SIDE;
      c = this.CELL_SIDE * Math.sin(Math.PI / 3);
      g = this.app.g;
      offset = this.app.map.offset;
      pos = this.cellPosition();
      xx = pos.x + offset.x || 0;
      yy = pos.y + offset.y || 0;
      g.fillStyle = "#999";
      if (this.isActive()) {
        g.strokeStyle = "#0F0";
      } else if (this.isHover()) {
        g.strokeStyle = "#F00";
      } else {
        g.strokeStyle = "#000";
      }
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(xx - a, yy);
      g.lineTo(xx - a * 0.5, yy - c);
      g.lineTo(xx + a * 0.5, yy - c);
      g.lineTo(xx + a, yy);
      g.lineTo(xx + a * 0.5, yy + c);
      g.lineTo(xx - a * 0.5, yy + c);
      g.closePath();
      if (this.isFilled()) {
        g.fill();
      }
      g.stroke();
      g.lineWidth = 1;
      g.strokeStyle = "#000";
      g.strokeText(this.x + "," + this.y, xx, yy);
      if (this.data != null) {
        return g.strokeText(this.data, xx, yy + 10);
      }
    };

    HexaCell.prototype.position = function(x, y) {
      var a, c, xx, yy;
      a = this.CELL_SIDE;
      c = this.CELL_SIDE * Math.sin(Math.PI / 3);
      xx = 1.5 * (a + this.CELL_OFFSET) * (x + y);
      yy = (c + this.CELL_OFFSET) * (y - x);
      return {
        x: xx,
        y: yy
      };
    };

    HexaCell.prototype.cellPosition = function() {
      var a, c, xx, yy;
      a = this.CELL_SIDE;
      c = this.CELL_SIDE * Math.sin(Math.PI / 3);
      xx = 1.5 * (a + this.CELL_OFFSET) * (this.x + this.y);
      yy = (c + this.CELL_OFFSET) * (this.y - this.x);
      return {
        x: xx,
        y: yy
      };
    };

    HexaCell.getCellAt = function(app, mouse_x, mouse_y) {
      var pos;
      pos = this.getCellPositionAt(app, mouse_x, mouse_y);
      return app.map.getCell(pos.x, pos.y);
    };

    HexaCell.prototype.closestCellsP = function() {
      return this.app.map.closestCells(null, this.x, this.y);
    };

    HexaCell.prototype.freeCells = function() {
      var blocked, cells;
      cells = this.app.map.getCells(this.app.map.closestCells(null, this.x, this.y));
      cells = cells.filter(function(cell) {
        return !(cell != null ? cell.isFilled() : void 0);
      });
      blocked = [];
      this.connectors.forEach(function(connector) {
        var a, b;
        a = connector.cell_a.closestCellsP();
        b = connector.cell_b.closestCellsP();
        return blocked = blocked.concat(a.filter(function(c1) {
          return b.filter(function(c2) {
            return (c1.x === c2.x) && (c1.y === c2.y);
          }).length > 0;
        }));
      });
      cells = cells.filter(function(c1) {
        return blocked.filter(function(c2) {
          return (c1.x === c2.x) && (c1.y === c2.y);
        }).length === 0;
      });
      return cells;
    };

    HexaCell.prototype.connectTo = function(cell2) {
      if (cell2) {
        if (Array.isArray(cell2)) {
          return cell2.forEach((function(_this) {
            return function(cell) {
              return _this.connectTo(cell);
            };
          })(this));
        } else if (!HexaCell.prototype.isPrototypeOf(cell2)) {
          return this.connectTo(this.app.map.getCell(cell2.x, cell2.y));
        } else {
          if (cell2) {
            this.app.connectors.push(new CellConnector(this.app, this, cell2)).length;
          }
          return cell2.setFilled();
        }
      }
    };

    HexaCell.getCellPositionAt = function(app, mouse_x, mouse_y) {
      var a, c, ta, tb, x, xx, y, yy;
      xx = mouse_x - app.map.offset.x;
      yy = mouse_y - app.map.offset.y;
      a = app.CELL_SIDE + app.CELL_OFFSET;
      c = app.CELL_SIDE * Math.sin(Math.PI / 3) + app.CELL_OFFSET;
      ta = xx / (3 * a) + 0.5;
      tb = yy / (2 * c);
      x = ta - tb;
      y = ta + tb;
      if (x < 0) {
        x = -1;
      }
      if (y < 0) {
        y = -1;
      }
      return {
        x: ~~x,
        y: ~~y
      };
    };

    HexaCell.prototype.getCellOn = function(map, event) {
      return this.getCellAt(map, event.offsetX, event.offsetY);
    };

    HexaCell.prototype.setHover = function(val) {
      if (val == null) {
        val = true;
      }
      return this.state = (this.state | HexaCell.HOVER) ^ (val ? 0 : HexaCell.HOVER);
    };

    HexaCell.prototype.isHover = function() {
      return !!(this.state & HexaCell.HOVER);
    };

    HexaCell.prototype.setActive = function(val) {
      if (val == null) {
        val = true;
      }
      return this.state = (this.state | HexaCell.ACTIVE) ^ (val ? 0 : HexaCell.ACTIVE);
    };

    HexaCell.prototype.isActive = function() {
      return !!(this.state & HexaCell.ACTIVE);
    };

    HexaCell.prototype.setFilled = function(val) {
      if (val == null) {
        val = true;
      }
      return this.state = (this.state | HexaCell.FILLED) ^ (val ? 0 : HexaCell.FILLED);
    };

    HexaCell.prototype.isFilled = function() {
      return !!(this.state & HexaCell.FILLED);
    };

    return HexaCell;

  })();

  window.HexaCell = HexaCell;

}).call(this);
