class BasePopup
  constructor: (@app)->
    @popup = $("<div class='popup_overlay'><div class='popup'><div class='popup_content'></div></div></div>")
    @class = @.constructor.name.replace(/[A-Z]/g, (a,b,c,d,e)->
        if b > 0 then '_' + a else a
      ).toLowerCase()
    @popup.addClass(@class)
    @app.root.find('.popup_overlay').filter(".#{@class}").detach()
    @app.root.append @popup
    @container = @popup.find('.popup_content')
    @container.empty()
    @setContent()
    # close popup on miss-click
    @popup.on 'click touchstart', (e)=>
      if $(e.target).closest('.popup_content').length == 0
        @hide()
        return false

  setContent: ->
    @container.append('<input type="submit" value="True" />')
    @container.append('<input type="submit" value="False" />')

  show: ->
    @popup.show()
  hide: ->
    @popup.hide()

class QueryPopup extends BasePopup
  setContent: ()->
    return

  show: (@elements=undefined, @callback=undefined, default_result=undefined)->
    @result = { undefined: default_result }
    @container.html("<ul class='query-list'></ul>")
    $.each @elements, (key, element)=>
      if element instanceof jQuery
        item = element
      else
        item = $("<li></li>").append(element)
      @container.append(item)
      item.attr("data-query-key", key)
      item.on 'click', =>
        @result = {key: key, value: element}
        @hide()
        return
    super()

  hide: ->
    @callback(@result.key, @result.value) if $.isFunction(@callback)
    super()

class ArrowsPopup extends QueryPopup
  button_size: 60
  cell: undefined
  free: undefined

  items: ->
    [
      $("<canvas/>").attr('width', @button_size).attr('height', @button_size)
      $("<canvas/>").attr('width', @button_size).attr('height', @button_size)
    ]

  renderArrows: (btn, free, cell)->
    g = btn.getContext('2d')
    g.clearRect(0, 0, @button_size, @button_size)
    cx = cy = @button_size*0.5
    a = @button_size*0.25
    c = a * Math.sin(Math.PI/3)
    g.strokeStyle = "#080"
    g.lineWidth = 2
    g.beginPath()
    for pos, id in free
      dx = pos.x - cell.x
      dy = pos.y - cell.y
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

  show: (@elements=undefined, @callback=undefined, default_result=undefined)->
    super(@elements, @callback, default_result)
    if @cell? && @free?
      @container.find('canvas').each (index, item)=>
        @renderArrows(item, @free[index], @cell)

window.BasePopup = BasePopup
window.QueryPopup = QueryPopup
window.ArrowsPopup = ArrowsPopup
