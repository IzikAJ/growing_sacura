class HexaMap
  @CLOSEST_CELLS =
    2: { dx:  1, dy: -1, key:  12 }
    5: { dx:  1, dy:  0, key:  2 }
    7: { dx:  0, dy:  1, key:  4 }
    6: { dx: -1, dy:  1, key:  6 }
    3: { dx: -1, dy:  0, key:  8 }
    1: { dx:  0, dy: -1, key: 10 }
  map: undefined
  all: undefined
  map_size: undefined
  seeds: undefined
  connectors: undefined
  offset: undefined

  constructor: (@app, map = undefined)->
    @_ = HexaMap
    @loadMap(map || @generateMap(8))

  getCell: (x, y)->
    @map[y][x] if @map[y] && @map[y][x] != undefined

  loadMap: (map, seedsCount=5)->
    @map = map
    @all = @._.getAllCells(map)
    @map_size = @getMapRect(@map)
    if @app.c.width < @map_size.width + @app.CELL_SIDE*4
      @app.c.width = @map_size.width + @app.CELL_SIDE*4
    if @app.c.height < @map_size.height + @app.CELL_SIDE*4
      @app.c.height = @map_size.height + @app.CELL_SIDE*4
    dw = (@app.c.width - @map_size.width) * 0.5
    dh = (@app.c.height - @map_size.height) * 0.5
    @offset = { x: -@map_size.from.x + dw, y: -@map_size.from.y + dh }
    @seeds = GameUtils.randItems(@all, seedsCount)
    @applySeeds(@seeds)
    @connectors = new Array()

  clearField: ()->
    for cell in @all
      cell.setFilled(false)
      cell.connectors = new Array()
    @connectors = new Array()
    @applySeeds()
    @app.render()

  randomizeMap: (mapSize = 8, seedsCount=5)->
    map = @generateMap(mapSize)
    @loadMap(map, seedsCount)
    @app.render()

  applySeeds: (seeds=undefined)->
    for cell in (seeds || @seeds)
      cell.setFilled()

  getMapRect: ()->
    x_min = y_min = x_max = y_max = 0
    for cell in @all
      p = cell.position()
      x_min = p.x if p.x < x_min
      x_max = p.x if p.x > x_max
      y_min = p.y if p.y < y_min
      y_max = p.y if p.y > y_max
    {
      from:
        x: x_min
        y: y_min
      to:
        x: x_max
        y: y_max
      width:  x_max - x_min
      height: y_max - y_min
    }

  render: ()->
    for cell in @all
      cell.render()

    for conn, i in @connectors
      conn.render()
    return

  countCells: (map, val)->
    map = @map unless map
    @_.countCells(map, val)

  @countCells: (map, val)->
    ans = 0
    for row, iy in map
      for cell, ix in row
        if $.isFunction(val)
          ans++ if val(map[iy][ix])
        else
          ans++ if map[iy][ix] == val
    ans

  waves: (map, x, y)->
    @_.waves(map || @map, x, y)

  @waves: (map, x, y)->
    wmap = new Array(map.length)

    for row, iy in map
      wmap[iy] = (new Array(map[iy].length)).fill(0)
    wmap[y][x] = 1

    iter = wmap.length * wmap[0].length
    while @countCells(wmap, 0) && iter--
      for row, iy in wmap
        for cell, ix in row
          if cell == 0
            closest = undefined
            for clp in @closestCells(map, ix, iy)
              if !closest || (wmap[clp.y][clp.x] > 0 && closest > wmap[clp.y][clp.x])
                closest = wmap[clp.y][clp.x]
            wmap[iy][ix] = closest + 1 if closest

    wmap

  closestCells: (map, x, y)->
    map = @map unless map
    @_.closestCells(map, x, y)

  @closestCells: (map, x, y)->
    ans = []
    for key, closest of @CLOSEST_CELLS
      if map[y + closest.dy] && map[y + closest.dy][x + closest.dx] != undefined
        ans.push({ x: x + closest.dx, y: y + closest.dy })
    ans

  getCell: (x, y)->
    @map?[y]?[x]

  getCells: (pos=[])->
    ans = []
    for p in pos
      ans.push(@map[p.y][p.x]) if @getCell(p.x, p.y) != undefined
    ans

  getAllCells: (map=undefined)->
    map = @map unless map
    @_.getAllCells(map)

  @getAllCells: (map)->
    GameUtils.flatten(map).filter (cell)->
      cell != undefined

  @splitFreeCells: (app, cell)->
    free = cell.freeCells(app)
    GameUtils.splitArray free, (pos)=>
      !(@CLOSEST_CELLS[(cell.y - pos.y + 1)*3 + cell.x - pos.x + 1].key % 4)

  generateMap: (size=5, rate=0.8)->
    for round in [0..10]
      map = new Array(size)
      for iy in [0..size-1]
        temp = new Array(size)
        for ix in [0..size-1]
          temp[ix] = if Math.random() < rate then new HexaCell(@app, ix, iy) else undefined
        map[iy] = temp

      all = @_.getAllCells(map)
      rcell = GameUtils.rand(all)
      empty = size*size
      if rcell
        waves = @waves(map, rcell.x, rcell.y)
        empty = @countCells(waves, 0)

      if empty < size*size*rate*0.5
        for row, iy in waves
          for cell, ix in row
            map[iy][ix] = undefined if cell == 0
        break
    map

window.HexaMap = HexaMap
