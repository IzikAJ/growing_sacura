class GameApp
  CELL_SIDE: 30
  CELL_OFFSET: 2
  map: undefined
  c: undefined
  g: undefined
  hover_cell: undefined
  active_cell: undefined
  state: 1

  controlls: undefined
  resetMapBtn: undefined
  randomMapBtn: undefined

  # states:
  MENU:  0
  GAME:  1
  GET_V: 2

  constructor: (root)->
    @_ = GameApp
    @root = $(root).first()
    @addControls()
    @map = new HexaMap(@)
    # @getv_popup = new GamePopup(@, GamePopup.GET_V)
    @getv_popup = new ArrowsPopup(@)
    @sure_popup = new QueryPopup(@)

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

  addControls: ()->
    console.log "addControls"

    canvas = $("<canvas/>")
    canvas.attr('width', 600)
    canvas.attr('height', 400)
    @c = canvas[0]
    @g = @c.getContext('2d')
    @root.append(canvas)


    @controlls = $("<div></div>")
    @controlls.addClass "controlls"

    @resetMapBtn = $("<a href='javascript:void(0);'>Reset</a>")
    @resetMapBtn.addClass "button reset"
    @controlls.append(@resetMapBtn)
    yes_no_buttons = [
      $("<a href='javascript:void(0);'>No</a>").addClass("button reject")
      $("<a href='javascript:void(0);'>Yes</a>").addClass("button accept")
    ]
    @resetMapBtn.on 'click', (e)=>
      if @map.isDirty()
        @sure_popup.show yes_no_buttons, (key, val)=>
          @map.resetMap() if key
    @randomMapBtn = $("<a href='javascript:void(0);'>Random</a>")
    @randomMapBtn.addClass "button random"
    @controlls.append(@randomMapBtn)
    @randomMapBtn.on 'click', (e)=>
      if @map.isDirty()
        @sure_popup.show yes_no_buttons, (key, val)=>
          @map.randomizeMap() if key
      else
        @map.randomizeMap()

    @root.prepend @controlls

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
            # for cells, id in free
            #   @getv_popup.buttons[id].free = cells
            @state = @GET_V
            @getv_popup.show @getv_popup.items(), (key, val)=>
              cell.connectTo(free[key])
              @state = @GAME

            # cell.connectTo(free[0])
          else if free.length == 1
            cell.connectTo(free)

        @render()

      when @GET_V
        return
        # @getv_popup.onClick(e)
        # @getv_popup.render(false)

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
        return
        # @getv_popup.onMove(e)
        # @getv_popup.render(false)

    return true

  render: ()->
    switch @state
      when @GAME
        @g.fillStyle = "#eee"
        @g.clearRect(0, 0, @c.width, @c.height)
        # @g.fillRect(0, 0, @c.width, @c.height)
        @map.render()

      when @GET_V
        return
        # @g.clearRect(0, 0, @c.width, @c.height)
        # @map.render()
        # @g.fillStyle = "rgba(0, 0, 0, 0.5)"
        # @g.fillRect(0, 0, @c.width, @c.height)
        # @getv_popup.render()


  isState: (state)->
    @state == state

$ ->
  game = new GameApp($(".content .game"))
  window.app = game
  # game.render()

window.GameApp = GameApp
