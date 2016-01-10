class HexaCell
  CELL_SIDE: undefined
  CELL_OFFSET: undefined
  color: "#000"
  state: 0
  data: undefined
  connectors: undefined

  # available states
  @HOVER = 1
  @ACTIVE = 2
  @FILLED = 4

  # unique ids
  @__count = 0
  id: undefined

  constructor: (@app, @x, @y)->
    @_ = HexaCell
    @CELL_SIDE = @app.CELL_SIDE
    @CELL_OFFSET = @app.CELL_OFFSET
    @connectors = new Array()
    @id = @_.__count++

  render: (offset = [0, 0])->
    a = @CELL_SIDE
    c = @CELL_SIDE * Math.sin(Math.PI/3)
    g = @app.g
    offset = @app.map.offset

    pos = @cellPosition()
    xx = pos.x + offset.x || 0
    yy = pos.y + offset.y || 0


    g.fillStyle = "#999"
    if @isActive()
      g.strokeStyle = "#0F0"
    else if @isHover()
      g.strokeStyle = "#F00"
    else
      g.strokeStyle = "#000"

    g.lineWidth = 2
    g.beginPath();
    g.moveTo(xx - a, yy);
    g.lineTo(xx - a * 0.5 , yy - c);
    g.lineTo(xx + a * 0.5 , yy - c);
    g.lineTo(xx + a, yy);
    g.lineTo(xx + a * 0.5 , yy + c);
    g.lineTo(xx - a * 0.5 , yy + c);

    g.closePath()
    if @isFilled()
      g.fill()
    g.stroke()

    g.lineWidth = 1
    g.strokeStyle = "#000"
    # g.strokeText("#{@x},#{@y}", xx, yy)
    # g.strokeText(@data, xx, yy+10) if @data?

  position: (x=undefined, y=undefined)->
    a = @CELL_SIDE
    c = @CELL_SIDE * Math.sin(Math.PI/3)
    xx = 1.5 * (a + @CELL_OFFSET) * ((x||@x) + (y||@y))
    yy = (c + @CELL_OFFSET) * ((y||@y) - (x||@x))
    {x: xx, y: yy}

  cellPosition: ()->
    a = @CELL_SIDE
    c = @CELL_SIDE * Math.sin(Math.PI/3)
    xx = 1.5 * (a + @CELL_OFFSET) * (@x + @y)
    yy = (c + @CELL_OFFSET) * (@y - @x)
    {x: xx, y: yy}

  @getCellAt: (app, mouse_x, mouse_y)->
    pos = @getCellPositionAt(app, mouse_x, mouse_y)
    app.map.getCell(pos.x, pos.y)

  closestCellsP: ()->
    @app.map.closestCells(null, @x, @y)

  freeCells: ()->
    # only closest cells
    cells = @app.map.getCells(@app.map.closestCells(null, @x, @y))
    # only not filled cells
    cells = cells.filter (cell)->
      !cell?.isFilled()
    # not near connected cells
    blocked = []
    @connectors.forEach (connector)->
      a = connector.cell_a.closestCellsP()
      b = connector.cell_b.closestCellsP()
      blocked = blocked.concat(
        a.filter (c1)->
          b.filter( (c2)->
            return (c1.x==c2.x) && (c1.y==c2.y)
          ).length > 0
      )
    cells = cells.filter (c1)->
      blocked.filter( (c2)->
        return (c1.x==c2.x) && (c1.y==c2.y)
      ).length == 0
    cells

  connectTo: (cell2)->
    if cell2
      if Array.isArray(cell2)
        cell2.forEach (cell)=>
          @connectTo(cell)
      else if !HexaCell.prototype.isPrototypeOf(cell2)
        @connectTo(@app.map.getCell(cell2.x, cell2.y))
      else
        @app.map.connectors.push(new CellConnector(@app, @, cell2)).length if cell2
        @app.map.setDirty()
        cell2.setFilled()

  @getCellPositionAt: (app, mouse_x, mouse_y)->
    xx = mouse_x - app.map.offset.x
    yy = mouse_y - app.map.offset.y
    a = app.CELL_SIDE + app.CELL_OFFSET
    c = app.CELL_SIDE * Math.sin(Math.PI/3) + app.CELL_OFFSET

    ta = xx/(3 * a) + 0.5
    tb = yy/(2 * c)
    x = ta - tb
    y = ta + tb
    x = -1 if x < 0
    y = -1 if y < 0
    { x: ~~x, y: ~~y }

  getCellOn: (map, event)->
    @getCellAt(map, event.offsetX, event.offsetY)

  setHover: (val=true)->
    @state = (@state | HexaCell.HOVER) ^ if val then 0 else HexaCell.HOVER
  isHover: ->
    !!(@state & HexaCell.HOVER)

  setActive: (val=true)->
    @state = (@state | HexaCell.ACTIVE) ^ if val then 0 else HexaCell.ACTIVE
  isActive: ->
    !!(@state & HexaCell.ACTIVE)

  setFilled: (val=true)->
    @state = (@state | HexaCell.FILLED) ^ if val then 0 else HexaCell.FILLED
  isFilled: ->
    !!(@state & HexaCell.FILLED)

window.HexaCell = HexaCell
