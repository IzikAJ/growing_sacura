(function() {
  var CellConnector;

  CellConnector = (function() {
    function CellConnector(app, cell_a, cell_b) {
      this.app = app;
      this.cell_a = cell_a;
      this.cell_b = cell_b;
      this._ = CellConnector;
      this.CELL_SIDE = this.app.CELL_SIDE;
      this.CELL_OFFSET = this.app.CELL_OFFSET;
      this.cell_a.connectors.push(this);
      this.cell_b.connectors.push(this);
    }

    CellConnector.prototype.render = function() {
      var g, offset, pos1, pos2, x1, x2, y1, y2;
      g = this.app.g;
      offset = this.app.map.offset;
      pos1 = this.cell_a.cellPosition();
      pos2 = this.cell_b.cellPosition();
      x1 = pos1.x + offset.x || 0;
      y1 = pos1.y + offset.y || 0;
      x2 = pos2.x + offset.x || 0;
      y2 = pos2.y + offset.y || 0;
      g.fillStyle = "#060";
      g.strokeStyle = "#060";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(x1, y1);
      g.lineTo(x2, y2);
      return g.stroke();
    };

    return CellConnector;

  })();

  window.CellConnector = CellConnector;

}).call(this);
