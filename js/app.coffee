class GameApp
  CELL_SIDE: 30
  CELL_OFFSET: 2
  map: undefined
  c: undefined
  g: undefined
  hover_cell: undefined
  active_cell: undefined

  constructor: (element)->
    @_ = GameApp
    @c = element
    @g = @c.getContext("2d")
    @map = new HexaMap(@)

    if @c
      _this = @

      $(@c).on "click", (e)->
        new_cell = HexaCell.getCellAt(_this, e.offsetX, e.offsetY)
        if new_cell != @active_cell
          @active_cell?.offActive()
          new_cell?.onActive()
          @active_cell = new_cell
          waves = HexaMap.waves(_this.map.map, @active_cell.x, @active_cell.y)
          for row, iy in _this.map.map
            for cell, ix in row
              cell.data = waves?[iy]?[ix] if cell != undefined
          _this.render()
        # mcell = _this.getCellAt(map, mx, my)
        # wawes = _this.wawes(map, mcell[0], mcell[1])
        # _this.info = wawes
        # console.log(wawes)

      $(@c).on "mousedown touchstart", (e)->
        return true

      $(@c).on "mousemove touchstart", (e)->
        new_cell = HexaCell.getCellAt(_this, e.offsetX, e.offsetY)
        if new_cell != @hover_cell
          @hover_cell?.offHover()
          new_cell?.onHover()
          @hover_cell = new_cell
          _this.render()
    @render()

    return

  render: ()->
    @g.fillStyle = "#eee"
    @g.fillRect(0, 0, @c.width, @c.height)
    @map.render()

$ ->
  game = new GameApp($(".content .canvas")[0])
  # game.render()

window.GameApp = GameApp
