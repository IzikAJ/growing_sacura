(function() {
  var HexaMap;

  HexaMap = (function() {
    HexaMap.CLOSEST_CELLS = {
      2: {
        dx: 1,
        dy: -1,
        key: 12
      },
      5: {
        dx: 1,
        dy: 0,
        key: 2
      },
      7: {
        dx: 0,
        dy: 1,
        key: 4
      },
      6: {
        dx: -1,
        dy: 1,
        key: 6
      },
      3: {
        dx: -1,
        dy: 0,
        key: 8
      },
      1: {
        dx: 0,
        dy: -1,
        key: 10
      }
    };

    HexaMap.prototype.map = void 0;

    HexaMap.prototype.offset = void 0;

    function HexaMap(app1, map) {
      var dh, dw, map_size;
      this.app = app1;
      if (map == null) {
        map = void 0;
      }
      this._ = HexaMap;
      this.map = map || this.generateMap();
      map_size = this.getMapRect(this.map);
      dw = (this.app.c.width - map_size.width) * 0.5;
      dh = (this.app.c.height - map_size.height) * 0.5;
      this.offset = {
        x: -map_size.from.x + dw,
        y: -map_size.from.y + dh
      };
    }

    HexaMap.prototype.getCell = function(x, y) {
      if (this.map[y] && this.map[y][x] !== void 0) {
        return this.map[y][x];
      }
    };

    HexaMap.prototype.getMapRect = function(map) {
      var cell, ix, iy, j, k, len, len1, p, row, x_max, x_min, y_max, y_min;
      if (map == null) {
        map = void 0;
      }
      if (!map) {
        map = this.map;
      }
      x_min = y_min = x_max = y_max = 0;
      for (iy = j = 0, len = map.length; j < len; iy = ++j) {
        row = map[iy];
        for (ix = k = 0, len1 = row.length; k < len1; ix = ++k) {
          cell = row[ix];
          if (cell !== void 0) {
            p = cell.position(ix, iy);
            if (p.x < x_min) {
              x_min = p.x;
            }
            if (p.x > x_max) {
              x_max = p.x;
            }
            if (p.y < y_min) {
              y_min = p.y;
            }
            if (p.y > y_max) {
              y_max = p.y;
            }
          }
        }
      }
      return {
        from: {
          x: x_min,
          y: y_min
        },
        to: {
          x: x_max,
          y: y_max
        },
        width: x_max - x_min,
        height: y_max - y_min
      };
    };

    HexaMap.prototype.render = function() {
      return this.renderMap();
    };

    HexaMap.prototype.renderMap = function() {
      var cell, conn, i, ix, iy, j, k, l, len, len1, len2, ref, ref1, row;
      ref = this.map;
      for (iy = j = 0, len = ref.length; j < len; iy = ++j) {
        row = ref[iy];
        for (ix = k = 0, len1 = row.length; k < len1; ix = ++k) {
          cell = row[ix];
          if (cell !== void 0) {
            cell.render();
          }
        }
      }
      ref1 = this.app.connectors;
      for (i = l = 0, len2 = ref1.length; l < len2; i = ++l) {
        conn = ref1[i];
        conn.render();
      }
    };

    HexaMap.prototype.countCells = function(map, val) {
      if (!map) {
        map = this.map;
      }
      return this._.countCells(map, val);
    };

    HexaMap.countCells = function(map, val) {
      var ans, cell, ix, iy, j, k, len, len1, row;
      ans = 0;
      for (iy = j = 0, len = map.length; j < len; iy = ++j) {
        row = map[iy];
        for (ix = k = 0, len1 = row.length; k < len1; ix = ++k) {
          cell = row[ix];
          if (map[iy][ix] === val) {
            ans++;
          }
        }
      }
      return ans;
    };

    HexaMap.prototype.waves = function(map, x, y) {
      if (!map) {
        map = this.map;
      }
      return this._.waves(map, x, y);
    };

    HexaMap.waves = function(map, x, y) {
      var cell, closest, clp, iter, ix, iy, j, k, l, len, len1, len2, len3, m, ref, row, wmap;
      wmap = new Array(map.length);
      for (iy = j = 0, len = map.length; j < len; iy = ++j) {
        row = map[iy];
        wmap[iy] = (new Array(map[iy].length)).fill(0);
      }
      wmap[y][x] = 1;
      iter = wmap.length * wmap[0].length;
      while (this.countCells(wmap, 0) && iter--) {
        for (iy = k = 0, len1 = wmap.length; k < len1; iy = ++k) {
          row = wmap[iy];
          for (ix = l = 0, len2 = row.length; l < len2; ix = ++l) {
            cell = row[ix];
            if (cell === 0) {
              closest = void 0;
              ref = this.closestCells(map, ix, iy);
              for (m = 0, len3 = ref.length; m < len3; m++) {
                clp = ref[m];
                if (!closest || (wmap[clp.y][clp.x] > 0 && closest > wmap[clp.y][clp.x])) {
                  closest = wmap[clp.y][clp.x];
                }
              }
              if (closest) {
                wmap[iy][ix] = closest + 1;
              }
            }
          }
        }
      }
      return wmap;
    };

    HexaMap.prototype.closestCells = function(map, x, y) {
      if (!map) {
        map = this.map;
      }
      return this._.closestCells(map, x, y);
    };

    HexaMap.closestCells = function(map, x, y) {
      var ans, closest, key, ref;
      ans = [];
      ref = this.CLOSEST_CELLS;
      for (key in ref) {
        closest = ref[key];
        if (map[y + closest.dy] && map[y + closest.dy][x + closest.dx] !== void 0) {
          ans.push({
            x: x + closest.dx,
            y: y + closest.dy
          });
        }
      }
      return ans;
    };

    HexaMap.prototype.getCell = function(x, y) {
      var ref, ref1;
      return (ref = this.map) != null ? (ref1 = ref[y]) != null ? ref1[x] : void 0 : void 0;
    };

    HexaMap.prototype.getCells = function(pos) {
      var ans, j, len, p;
      if (pos == null) {
        pos = [];
      }
      ans = [];
      for (j = 0, len = pos.length; j < len; j++) {
        p = pos[j];
        if (this.map[p.y] && this.map[p.y][p.x] !== void 0) {
          ans.push(this.map[p.y][p.x]);
        }
      }
      return ans;
    };

    HexaMap.prototype.getAllCells = function(map) {
      if (map == null) {
        map = void 0;
      }
      if (!map) {
        map = this.map;
      }
      return this._.getAllCells(map);
    };

    HexaMap.getAllCells = function(map) {
      var iy, j, len, row, shovel;
      shovel = [];
      for (iy = j = 0, len = map.length; j < len; iy = ++j) {
        row = map[iy];
        shovel = shovel.concat(map[iy]);
      }
      return shovel.filter(function(cell) {
        return cell !== void 0;
      });
    };

    HexaMap.splitFreeCells = function(app, cell) {
      var ans, free, v;
      ans = new Array();
      free = cell.freeCells(app);
      v = free.filter((function(_this) {
        return function(pos) {
          return !!(_this.CLOSEST_CELLS[(cell.y - pos.y + 1) * 3 + cell.x - pos.x + 1].key % 4);
        };
      })(this));
      if (v.length > 0) {
        ans.push(v);
      }
      v = free.filter((function(_this) {
        return function(pos) {
          return !(_this.CLOSEST_CELLS[(cell.y - pos.y + 1) * 3 + cell.x - pos.x + 1].key % 4);
        };
      })(this));
      if (v.length > 0) {
        ans.push(v);
      }
      return ans;
    };

    HexaMap.prototype.generateMap = function(size, rate, deep) {
      var cell, empty, ix, iy, j, k, l, len, len1, m, map, pmap, rcell, ref, ref1, row, temp, times, waves;
      if (size == null) {
        size = 5;
      }
      if (rate == null) {
        rate = 0.8;
      }
      if (deep == null) {
        deep = 0;
      }
      map = [];
      for (iy = j = 0, ref = size; 0 <= ref ? j <= ref : j >= ref; iy = 0 <= ref ? ++j : --j) {
        temp = [];
        for (ix = k = 0, ref1 = size; 0 <= ref1 ? k <= ref1 : k >= ref1; ix = 0 <= ref1 ? ++k : --k) {
          temp.push(Math.random() < rate ? new HexaCell(this.app, ix, iy) : void 0);
        }
        map.push(temp);
        pmap = this.map;
      }
      if (deep > 10) {
        return null;
      }
      times = 3;
      rcell = this._.getAllCells(map)[0];
      empty = size * size;
      if (rcell) {
        waves = this.waves(map, rcell.x, rcell.y);
        empty = this.countCells(waves, 0);
      }
      if (empty > size * size * rate * 0.5) {
        map = this.generateMap(size, rate, deep + 1);
      } else {
        for (iy = l = 0, len = waves.length; l < len; iy = ++l) {
          row = waves[iy];
          for (ix = m = 0, len1 = row.length; m < len1; ix = ++m) {
            cell = row[ix];
            if (cell === 0) {
              map[iy][ix] = void 0;
            }
          }
        }
      }
      return map;
    };

    return HexaMap;

  })();

  window.HexaMap = HexaMap;

}).call(this);
