class SacuraGame
  CELL_SIDE = 30
  CELL_OFFSET = 2
  info: undefined
  map: undefined

  constructor: ()->
    return

  cellPosition: (x, y)->
    a = CELL_SIDE
    c = CELL_SIDE * Math.sin(Math.PI/3)
    xx = 1.5 * (a + CELL_OFFSET) * (x + y)
    yy = (c + CELL_OFFSET) * (y - x)
    [xx, yy]

  getMapRect: (map=[])->
    x_min = y_min = x_max = y_max = 0
    for row, iy in map
      for cell, ix in row
        if cell != undefined
          p = @cellPosition(ix, iy)
          x_min = p[0] if p[0] < x_min
          x_max = p[0] if p[0] > x_max
          y_min = p[1] if p[1] < y_min
          y_max = p[1] if p[1] > y_max
    [x_min, y_min, x_max, y_max]

  drawCell: (g, x, y, offset = [0, 0])->
    a = CELL_SIDE
    c = CELL_SIDE * Math.sin(Math.PI/3)

    pos = @cellPosition(x, y)
    xx = pos[0] + offset[0] || 0
    yy = pos[1] + offset[1] || 0

    g.beginPath();
    g.moveTo(xx - a, yy);
    g.lineTo(xx - a * 0.5 , yy - c);
    g.lineTo(xx + a * 0.5 , yy - c);
    g.lineTo(xx + a, yy);
    g.lineTo(xx + a * 0.5 , yy + c);
    g.lineTo(xx - a * 0.5 , yy + c);
    g.closePath();
    # g.fill()
    g.stroke()

    g.lineWidth = 1
    g.strokeText("#{x},#{y}", xx, yy)
    if @info
      g.strokeText("#{@info[y][x]}", xx, yy+10)
    g.lineWidth = 2

  getCellAt: (map, mx, my)->
    map_size = @getMapRect(map)
    c = $(".content .canvas")[0]
    cw = c.width
    ch = c.height
    mw = map_size[2]-map_size[0]
    mh = map_size[3]-map_size[1]
    offset = [-map_size[0] + (cw-mw)*0.5, -map_size[1] + (ch-mh)*0.5]

    xx = mx - offset[0]
    yy = my - offset[1]

    a = CELL_SIDE
    c = CELL_SIDE * Math.sin(Math.PI/3)
    y = ~~((xx/(1.5 * (a + CELL_OFFSET)) + yy/(c + CELL_OFFSET) + 1) * 0.5)
    x = ~~(xx/(1.5 * (a + CELL_OFFSET)) - y + 0.5)
    [x, y]

  getCellOn: (map, event)->
    @getCellAt(map, event.offsetX, event.offsetY)

  renderMap: (g, map=[])->
    c = $(".content .canvas")[0]

    g.fillStyle = "#eee"
    g.fillRect(0, 0, c.width, c.height)

    map_size = @getMapRect(map)
    cw = c.width
    ch = c.height
    mw = map_size[2]-map_size[0]
    mh = map_size[3]-map_size[1]
    # console.log(cw,ch, mw, mh)

    offset = [-map_size[0] + (cw-mw)*0.5, -map_size[1] + (ch-mh)*0.5]
    for row, iy in map
      for cell, ix in row
        if cell != undefined
          # console.log(cell)
          g.strokeStyle = "#000" if cell == 1
          g.strokeStyle = "#f00" if cell == 2
          @drawCell(g, ix, iy, offset)

  countCells: (map, val)->
    ans = 0
    for row, iy in map
      for cell, ix in row
        ans++ if map[iy][ix] == val
    ans

  wawes: (map, x, y)->
    wmap = $.extend(true, [], map)

    for row, iy in wmap
      for cell, ix in row
        if cell != undefined
          wmap[iy][ix] = 0

    wmap[y][x] = 1

    iter = wmap.length * wmap[0].length
    while @countCells(wmap, 0) && iter--
      for row, iy in wmap
        for cell, ix in row
          if cell == 0
            closest = undefined
            for clp in @closest(map, ix, iy)
              if !closest || (wmap[clp[1]][clp[0]] > 0 && closest > wmap[clp[1]][clp[0]])
                closest = wmap[clp[1]][clp[0]]
            wmap[iy][ix] = closest + 1 if closest

    wmap

  closest: (map, x, y)->
    diff = [-1, 0, 1]
    ans = []
    for dx in diff
      for dy in diff
        if dx!=dy && map[y+dy] && map[y+dy][x+dx]!=undefined
          ans.push([x+dx, y+dy])
    ans

  render: ()->
    c = $(".content .canvas")[0]
    g = c.getContext("2d")
    map = @map
    _this = @

    # g.fillStyle = "#fff"
    g.lineWidth = 2

    $(c).on "click", (e)->
      mx = e.offsetX
      my = e.offsetY
      mcell = _this.getCellAt(map, mx, my)
      wawes = _this.wawes(map, mcell[0], mcell[1])
      _this.info = wawes
      # console.log(wawes)

    $(c).on "mousedown touchstart", (e)->
      return true

    $(c).on "mousemove touchstart", (e)->
      mx = e.offsetX
      my = e.offsetY
      mcell = _this.getCellAt(map, mx, my)
      for row, iy in map
        for cell, ix in row
          if cell != undefined
            map[iy][ix] = 1
      map[mcell[1]][mcell[0]] = 2 if map[mcell[1]] && map[mcell[1]][mcell[0]]
      _this.renderMap(g, map)

      # console.log(mx, my, mcell)

    @renderMap(g, map)

  generateMap: (size=5, rate=0.8)->
    map = []
    for ix in [0..size]
      temp = []
      for iy in [0..size]
        temp.push(if Math.random() < rate then 1 else undefined)
      map.push(temp)
      pmap = @map

    times = 10
    cl = @closest(map, ~~Math.random()*size, ~~Math.random()*size)[0] while !cl && times--
    empty = size*size
    if cl && cl.length == 2
      wawes = @wawes(map, cl[0], cl[1])
      empty = @countCells(wawes, 0)
    if empty > size*size*rate*0.5
      map = @generateMap(size, rate)
    else
      for row, iy in wawes
        for cell, ix in row
          map[iy][ix] = undefined if cell == 0
    map

$ ->
  game = new SacuraGame()
  game.map = game.generateMap(5, 0.8)
  game.render()
