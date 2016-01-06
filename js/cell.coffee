class HexaCell
  CELL_SIDE: undefined
  CELL_OFFSET: undefined
  color: "#000"
  state: 0
  data: undefined

  # available states
  @HOVER = 1
  @ACTIVE = 2

  constructor: (@app, @x, @y)->
    @_ = HexaCell
    @CELL_SIDE = @app.CELL_SIDE
    @CELL_OFFSET = @app.CELL_OFFSET

  render: (offset = [0, 0])->
    a = @CELL_SIDE
    c = @CELL_SIDE * Math.sin(Math.PI/3)
    g = @app.g
    offset = @app.map.offset

    pos = @cellPosition()
    xx = pos.x + offset.x || 0
    yy = pos.y + offset.y || 0

    if @state & HexaCell.ACTIVE
      g.strokeStyle = "#0F0"
    else if @state & HexaCell.HOVER
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
    # g.fill()
    g.closePath()
    g.stroke()

    g.lineWidth = 1
    g.strokeStyle = "#000"
    g.strokeText("#{@x},#{@y}", xx, yy)
    g.strokeText(@data, xx, yy+10) if @data?

  position: (x, y)->
    a = @CELL_SIDE
    c = @CELL_SIDE * Math.sin(Math.PI/3)
    xx = 1.5 * (a + @CELL_OFFSET) * (x + y)
    yy = (c + @CELL_OFFSET) * (y - x)
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

  onHover: ()->
    # @state |= HexaCell.HOVER
    @state ^= HexaCell.HOVER
  offHover: ()->
    @state ^= HexaCell.HOVER

  onActive: ()->
    # @state |= HexaCell.ACTIVE
    @state ^= HexaCell.ACTIVE
  offActive: ()->
    @state ^= HexaCell.ACTIVE

window.HexaCell = HexaCell
