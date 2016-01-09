class GameApp
  CELL_SIDE: 30
  CELL_OFFSET: 2
  map: undefined
  c: undefined
  g: undefined
  hover_cell: undefined
  active_cell: undefined
  state: 1

  # states:
  MENU:  0
  GAME:  1
  GET_V: 2

  constructor: (element)->
    @_ = GameApp
    @c = element
    @g = @c.getContext("2d")
    @map = new HexaMap(@)
    @getv_popup = new GamePopup(@, GamePopup.GET_V)

    if @c
      $(@c).on "click", (e)=>
        @onClick(e)

      $(@c).on "mousedown touchstart", (e)=>
        return true

      $(@c).on "dblclick", (e)=>
        @onDblClick(e)

      $(@c).on "mousemove touchstart", (e)=>
        @onMove(e)

    @render()
    return

  onDblClick: (e)->
    # switch @state
    #   when @GAME
    #     cell = HexaCell.getCellAt(@, e.offsetX, e.offsetY)
    #     if cell
    #       cell.setFilled(!cell.isFilled())
    #       # render changes
    #       @render()
    return false

  onClick: (e)->
    switch @state
      when @GAME
        cell = HexaCell.getCellAt(@, e.offsetX, e.offsetY)
        if cell != @active_cell
          @active_cell?.setActive(false)
          cell?.setActive(true)
          @active_cell = cell

        if cell?.isFilled()

          free = HexaMap.splitFreeCells(@, cell)
          if free.length > 1
            @getv_popup.cell = cell
            @getv_popup.free = free
            for cells, id in free
              @getv_popup.buttons[id].free = cells
            @state = @GET_V
            # cell.connectTo(free[0])
          else if free.length == 1
            cell.connectTo(free)

        @render()

      when @GET_V
        @getv_popup.onClick(e)
        @getv_popup.render(false)

    return true

  onMove: (e)->
    switch @state
      when @GAME
        cell = HexaCell.getCellAt(@, e.offsetX, e.offsetY)
        if cell != @hover_cell
          @hover_cell?.setHover(false)
          cell?.setHover(true)
          @hover_cell = cell
          # render changes
          @render()

      when @GET_V
        @getv_popup.onMove(e)
        @getv_popup.render(false)

    return true

  render: ()->
    switch @state
      when @GAME
        @g.fillStyle = "#eee"
        @g.clearRect(0, 0, @c.width, @c.height)
        # @g.fillRect(0, 0, @c.width, @c.height)
        @map.render()

      when @GET_V
        @g.clearRect(0, 0, @c.width, @c.height)
        @map.render()
        @g.fillStyle = "rgba(0, 0, 0, 0.5)"
        @g.fillRect(0, 0, @c.width, @c.height)
        @getv_popup.render()


  isState: (state)->
    @state == state

$ ->
  game = new GameApp($(".content .canvas")[0])
  window.app = game
  # game.render()

window.GameApp = GameApp
