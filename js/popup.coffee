class PopupButton
  radius: 2
  state: 0
  free: undefined

  # states:
  @DEFAULT: 0
  @HOVER:  1
  @ACTIVE: 2

  LINE_LEN: 20

  constructor: (@root, a, b, c, d)->
    if Number.isFinite(a)
      @rect = { l: a, t: b, r: c, b: d }
    else
      @rect = a

    return

  render: (g, data = {})->
    g.save()
    gradient = g.createLinearGradient(0, @rect.t + 10, 0, @rect.b - 10)
    if @isHover()
      gradient.addColorStop(0,"#888")
      gradient.addColorStop(1,"#EEE")
    else
      gradient.addColorStop(0,"#EEE")
      gradient.addColorStop(1,"#999")

    g.fillStyle = gradient
    # g.fillStyle = "#999"
    @root.roundRect(g, @rect.l, @rect.t, @rect.r, @rect.b, @radius)
    if @isActive()
      g.strokeStyle = "#040"
      g.lineWidth = 2
    else
      g.strokeStyle = "#444"
      g.lineWidth = 1
    g.stroke()
    g.fill()

    g.restore()
    @renderContent(g, data)

  renderContent: (g, data={})->
    h = @rect.b - @rect.t
    w = @rect.r - @rect.l
    cx = @rect.l + w*0.5
    cy = @rect.t + h*0.5
    a = @LINE_LEN
    c = a * Math.sin(Math.PI/3)
    g.save()
    g.strokeStyle = "#080"
    g.lineWidth = 2
    g.beginPath()
    for pos, id in @free
      dx = pos.x - @root.cell.x
      dy = pos.y - @root.cell.y
      ddx = (dx + dy) * 1.5 * a
      ddy = (dy - dx) * c
      g.moveTo(cx, cy)
      g.lineTo(cx + ddx, cy + ddy)
    g.stroke()
    g.strokeStyle = "#800"
    g.beginPath()
    g.arc(cx, cy, 5, 0, 7)
    g.closePath()
    g.fill()

  setHover: (val=true)->
    @state = (@state | PopupButton.HOVER) ^ if val then PopupButton.DEFAULT else PopupButton.HOVER
  isHover: ->
    !!(@state & PopupButton.HOVER)

  setActive: (val=true)->
    @state = (@state | PopupButton.ACTIVE) ^ if val then PopupButton.DEFAULT else PopupButton.ACTIVE
  isActive: ->
    !!(@state & PopupButton.ACTIVE)

  @isOnRect: (x, y, x1, y1, x2, y2)->
    (x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)
  @isOnCircle: (x, y, x1, y1, r)->
    ((x1-x)*(x1-x)+(y1-y)*(y1-y)) <= (r*r)
  isOnElement: (x, y)->
    PopupButton.isOnRect(x, y, @rect.l+@radius, @rect.t, @rect.r-@radius, @rect.b) ||
    PopupButton.isOnRect(x, y, @rect.l, @rect.t+@radius, @rect.r, @rect.b-@radius) ||
    PopupButton.isOnCircle(x, y, @rect.l+@radius, @rect.t+@radius) ||
    PopupButton.isOnCircle(x, y, @rect.r-@radius, @rect.t+@radius) ||
    PopupButton.isOnCircle(x, y, @rect.l+@radius, @rect.b-@radius) ||
    PopupButton.isOnCircle(x, y, @rect.r-@radius, @rect.b-@radius)

  onMove: (e)->
    @setHover(@isOnElement(e.offsetX, e.offsetY))

  onClick: (e)->
    if @isOnElement(e.offsetX, e.offsetY)
      @setActive(true)
      @root.cell?.connectTo(@free)
      @root.app.state = @root.app.GAME
    else
      @setActive(false)

class GamePopup
  rect: undefined
  radius: 5
  buttons: undefined

  @GET_V = 1

  constructor: (@app, vers)->
    @_ = GamePopup
    @buttons = new Array()
    switch vers
      when @_.GET_V
        @width=200
        @height=100+0

        c = @app.c
        @rect =
          t: (c.height - @height) * 0.5
          b: (c.height - @height) * 0.5 + @height
          l: (c.width - @width) * 0.5
          r: (c.width - @width) * 0.5 + @width

        @buttons.push(new PopupButton(this, @rect.l + 10, @rect.t + 10, @rect.l + @width*0.5 - 5, @rect.b - 10))
        @buttons.push(new PopupButton(this, @rect.l + @width*0.5 + 5, @rect.t + 10, @rect.r - 10, @rect.b - 10))
        @free = undefined
        @cell = undefined

  roundRect: (g, x1, y1, x2, y2, radius)->
    g.beginPath()
    g.moveTo(x1, y1 + radius*2)
    g.arcTo(x1, y1, x2, y1, radius*2)
    g.arcTo(x2, y1, x2, y2, radius*2)
    g.arcTo(x2, y2, x1, y2, radius*2)
    g.arcTo(x1, y2, x1, y1, radius*2)
    g.closePath()

  renderPopupBG: (shadow)->
    c = @app.c
    g = @app.g
    g.save()

    g.fillStyle = "#fff"
    g.strokeStyle = "#000"
    g.lineWidth = 2

    @roundRect(g, @rect.l, @rect.t, @rect.r, @rect.b, @radius)

    g.shadowBlur = 0
    g.stroke()

    if shadow
      g.shadowBlur = 5
      g.shadowColor = "#666"
      g.shadowOffsetX = 0
      g.shadowOffsetY = 4
    else
      g.shadowBlur = 0
    g.fill()

    g.restore()

  renderContent: ()->
    g = @app.g
    g.save()
    gradient = g.createLinearGradient(0, @rect.t + 10, 0, @rect.b - 10)
    gradient.addColorStop(0,"#999")
    gradient.addColorStop(1,"#666")
    g.fillStyle = gradient
    # g.fillStyle = "#999"
    for button in @buttons
      button.render(g, {})

    g.restore()

  render: (shadow=true)->
    g = @app.g
    g.save()
    @renderPopupBG(shadow)
    @renderContent()
    g.restore()

  onMove: (e)->
    for button in @buttons
      button.onMove(e)
    return

  onClick: (e)->
    for button in @buttons
      button.onClick(e)
    return

window.PopupButton = PopupButton
window.GamePopup = GamePopup
