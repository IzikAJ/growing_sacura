class HexaMap
  @CLOSEST_CELLS =
    0:  { dx:  1, dy: -1 }
    2:  { dx:  1, dy:  0 }
    4:  { dx:  0, dy:  1 }
    6:  { dx: -1, dy:  1 }
    8:  { dx: -1, dy:  0 }
    10: { dx:  0, dy: -1 }
  map: undefined
  offset: undefined

  constructor: (@app, map = undefined)->
    @_ = HexaMap

    @map = map || @generateMap()
    map_size = @getMapRect(@map)
    dw = (@app.c.width - map_size.width) * 0.5
    dh = (@app.c.height - map_size.height) * 0.5
    @offset = { x: -map_size.from.x + dw, y: -map_size.from.y + dh }

  getCell: (x, y)->
    @map[y][x] if @map[y] && @map[y][x] != undefined

  getMapRect: (map=undefined)->
    map = @map unless map
    x_min = y_min = x_max = y_max = 0
    for row, iy in map
      for cell, ix in row
        if cell != undefined
          p = cell.position(ix, iy)
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
    @renderMap()

  renderMap: ()->
    for row, iy in @map
      for cell, ix in row
        if cell != undefined
          cell.render()

    return

  countCells: (map, val)->
    map = @map unless map
    @_.countCells(map, val)

  @countCells: (map, val)->
    ans = 0
    for row, iy in map
      for cell, ix in row
        ans++ if map[iy][ix] == val
    ans

  waves: (map, x, y)->
    map = @map unless map
    @_.waves(map, x, y)

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
      ans.push(@map[p.y][p.x]) if @map[p.y] && @map[p.y][p.x] != undefined
    ans

  getAllCells: (map=undefined)->
    map = @map unless map
    @_.getAllCells(map)

  @getAllCells: (map)->
    shovel = []
    for row, iy in map
      shovel = shovel.concat(map[iy])

    shovel.filter (cell)->
      cell != undefined

  generateMap: (size=5, rate=0.8, deep = 0)->
    map = []
    for iy in [0..size]
      temp = []
      for ix in [0..size]
        temp.push( if Math.random() < rate then new HexaCell(@app, ix, iy) else undefined )
      map.push(temp)
      pmap = @map

    return null if deep>10

    times = 3
    rcell = @_.getAllCells(map)[0]
    empty = size*size
    if rcell
      waves = @waves(map, rcell.x, rcell.y)
      empty = @countCells(waves, 0)

    if empty > size*size*rate*0.5
      map = @generateMap(size, rate, deep+1)
    else
      for row, iy in waves
        for cell, ix in row
          map[iy][ix] = undefined if cell == 0
    map

window.HexaMap = HexaMap
