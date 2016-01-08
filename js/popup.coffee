class GamePopup
  rect: undefined
  radius: 10
  btn_radius: 5

  @GET_V = 1

  constructor: (@app, vers)->
    @_ = GamePopup
    switch vers
      when @_.GET_V
        console.log 'create GET_V version'
        @width=200
        @height=100+0

        c = @app.c
        @rect =
          t: (c.height - @height) * 0.5
          b: (c.height - @height) * 0.5 + @height
          l: (c.width - @width) * 0.5
          r: (c.width - @width) * 0.5 + @width

        @free = undefined
        @cell = undefined

  roundRect: (g, x1, y1, x2, y2, radius)->
    g.beginPath()
    g.moveTo(x1, y1 + radius)
    g.arcTo(x1, y1, x2, y1, radius)
    g.arcTo(x2, y1, x2, y2, radius)
    g.arcTo(x2, y2, x1, y2, radius)
    g.arcTo(x1, y2, x1, y1, radius)
    g.closePath()

  renderPopupBG: ()->
    c = @app.c
    g = @app.g
    g.save()

    g.fillStyle = "#fff"
    g.strokeStyle = "#000"
    g.lineWidth = 2

    @roundRect(g, @rect.l, @rect.t, @rect.r, @rect.b, @radius)

    g.shadowBlur = 0
    g.stroke()

    g.shadowBlur = 5
    g.shadowColor = "#666"
    g.shadowOffsetX = 0
    g.shadowOffsetY = 4
    g.fill()

    g.restore()
    @renderContent()

  renderContent: ()->
    g = @app.g
    g.save()
    gradient = g.createLinearGradient(0, @rect.t + 10, 0, @rect.b - 10)
    gradient.addColorStop(0,"#999")
    gradient.addColorStop(1,"#666")
    g.fillStyle = gradient
    # g.fillStyle = "#999"
    @roundRect(g, @rect.l + 10, @rect.t + 10, @rect.l + @width*0.5 - 5, @rect.b - 10, @btn_radius)
    g.fill()
    @roundRect(g, @rect.l + @width*0.5 + 5, @rect.t + 10, @rect.r - 10, @rect.b - 10, @btn_radius)
    g.fill()

    g.restore()

  render: ()->
    g = @app.g

    g.save()

    @renderPopupBG()

    # g.lineWidth = 1
    # g.strokeStyle = "#000"
    # g.strokeText("#{@x},#{@y}", xx, yy)
    # g.strokeText(@data, xx, yy+10) if @data?
    g.restore()

    onClick: (e)->


window.GamePopup = GamePopup
