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

    HexaMap.prototype.all = void 0;

    HexaMap.prototype.map_size = void 0;

    HexaMap.prototype.seeds = void 0;

    HexaMap.prototype.connectors = void 0;

    HexaMap.prototype.offset = void 0;

    function HexaMap(app1, map) {
      this.app = app1;
      if (map == null) {
        map = void 0;
      }
      this._ = HexaMap;
      this.loadMap(map || this.generateMap(8));
    }

    HexaMap.prototype.getCell = function(x, y) {
      if (this.map[y] && this.map[y][x] !== void 0) {
        return this.map[y][x];
      }
    };

    HexaMap.prototype.loadMap = function(map, seedsCount) {
      var dh, dw;
      if (seedsCount == null) {
        seedsCount = 5;
      }
      this.map = map;
      this.all = this._.getAllCells(map);
      this.map_size = this.getMapRect(this.map);
      if (this.app.c.width < this.map_size.width + this.app.CELL_SIDE * 4) {
        this.app.c.width = this.map_size.width + this.app.CELL_SIDE * 4;
      }
      if (this.app.c.height < this.map_size.height + this.app.CELL_SIDE * 4) {
        this.app.c.height = this.map_size.height + this.app.CELL_SIDE * 4;
      }
      dw = (this.app.c.width - this.map_size.width) * 0.5;
      dh = (this.app.c.height - this.map_size.height) * 0.5;
      this.offset = {
        x: -this.map_size.from.x + dw,
        y: -this.map_size.from.y + dh
      };
      this.seeds = GameUtils.randItems(this.all, seedsCount);
      this.applySeeds(this.seeds);
      return this.connectors = new Array();
    };

    HexaMap.prototype.clearField = function() {
      var cell, j, len, ref;
      ref = this.all;
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        cell.setFilled(false);
        cell.connectors = new Array();
      }
      this.connectors = new Array();
      this.applySeeds();
      return this.app.render();
    };

    HexaMap.prototype.randomizeMap = function(mapSize, seedsCount) {
      var map;
      if (mapSize == null) {
        mapSize = 8;
      }
      if (seedsCount == null) {
        seedsCount = 5;
      }
      map = this.generateMap(mapSize);
      this.loadMap(map, seedsCount);
      return this.app.render();
    };

    HexaMap.prototype.applySeeds = function(seeds) {
      var cell, j, len, ref, results;
      if (seeds == null) {
        seeds = void 0;
      }
      ref = seeds || this.seeds;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        results.push(cell.setFilled());
      }
      return results;
    };

    HexaMap.prototype.getMapRect = function() {
      var cell, j, len, p, ref, x_max, x_min, y_max, y_min;
      x_min = y_min = x_max = y_max = 0;
      ref = this.all;
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        p = cell.position();
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
      var cell, conn, i, j, k, len, len1, ref, ref1;
      ref = this.all;
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        cell.render();
      }
      ref1 = this.connectors;
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
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
          if ($.isFunction(val)) {
            if (val(map[iy][ix])) {
              ans++;
            }
          } else {
            if (map[iy][ix] === val) {
              ans++;
            }
          }
        }
      }
      return ans;
    };

    HexaMap.prototype.waves = function(map, x, y) {
      return this._.waves(map || this.map, x, y);
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
        if (this.getCell(p.x, p.y) !== void 0) {
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
      return GameUtils.flatten(map).filter(function(cell) {
        return cell !== void 0;
      });
    };

    HexaMap.splitFreeCells = function(app, cell) {
      var free;
      free = cell.freeCells(app);
      return GameUtils.splitArray(free, (function(_this) {
        return function(pos) {
          return !(_this.CLOSEST_CELLS[(cell.y - pos.y + 1) * 3 + cell.x - pos.x + 1].key % 4);
        };
      })(this));
    };

    HexaMap.prototype.generateMap = function(size, rate) {
      var all, cell, empty, ix, iy, j, k, l, len, len1, m, map, n, rcell, ref, ref1, round, row, temp, waves;
      if (size == null) {
        size = 5;
      }
      if (rate == null) {
        rate = 0.8;
      }
      for (round = j = 0; j <= 10; round = ++j) {
        map = new Array(size);
        for (iy = k = 0, ref = size - 1; 0 <= ref ? k <= ref : k >= ref; iy = 0 <= ref ? ++k : --k) {
          temp = new Array(size);
          for (ix = l = 0, ref1 = size - 1; 0 <= ref1 ? l <= ref1 : l >= ref1; ix = 0 <= ref1 ? ++l : --l) {
            temp[ix] = Math.random() < rate ? new HexaCell(this.app, ix, iy) : void 0;
          }
          map[iy] = temp;
        }
        all = this._.getAllCells(map);
        rcell = GameUtils.rand(all);
        empty = size * size;
        if (rcell) {
          waves = this.waves(map, rcell.x, rcell.y);
          empty = this.countCells(waves, 0);
        }
        if (empty < size * size * rate * 0.5) {
          for (iy = m = 0, len = waves.length; m < len; iy = ++m) {
            row = waves[iy];
            for (ix = n = 0, len1 = row.length; n < len1; ix = ++n) {
              cell = row[ix];
              if (cell === 0) {
                map[iy][ix] = void 0;
              }
            }
          }
          break;
        }
      }
      return map;
    };

    return HexaMap;

  })();

  window.HexaMap = HexaMap;

}).call(this);
