class GameUtils
  @rand: (arg=undefined)->
    if Array.isArray(arg)
      arg[@rand(arg.length)]
    else if Number.isFinite(arg)
      ~~(Math.random()*arg)
    else
      Math.random()

  @randItems: (array, count)->
    q = $.extend [], array
    ans = new Array()
    while (ans.length < count) && (q.length > 0)
      ans.push(q.splice(@rand(q.length), 1)[0])
    ans

  @isOnRect: (x, y, x1, y1, x2, y2)->
    (x >= x1) && (x <= x2) && (y >= y1) && (y <= y2)
  @isOnCircle: (x, y, x1, y1, r)->
    ((x1-x)*(x1-x)+(y1-y)*(y1-y)) <= (r*r)

  @isOnRoundRect: (x, y, x1, y1, x2, y2, r)->
    @isOnRect(x, y, x1+r, y1, x2-r, y2) ||
    @isOnRect(x, y, x1, y1+r, x2, y2-r) ||
    @isOnCircle(x, y, x1+r, y1+r) ||
    @isOnCircle(x, y, x2-r, y1+r) ||
    @isOnCircle(x, y, x1+r, y2-r) ||
    @isOnCircle(x, y, x2-r, y2-r)

  @roundRect: (g, x1, y1, x2, y2, radius)->
    g.beginPath()
    g.moveTo(x1, y1 + radius*2)
    g.arcTo(x1, y1, x2, y1, radius*2)
    g.arcTo(x2, y1, x2, y2, radius*2)
    g.arcTo(x2, y2, x1, y2, radius*2)
    g.arcTo(x1, y2, x1, y1, radius*2)
    g.closePath()

  @flatten: (map)->
    [].concat.apply([], map)

  @splitArray: (arr, func)->
    if $.isArray(arr) && $.isFunction(func)
      ans = {}
      v = arr.forEach (item)->
        k = func(item)
        ans[k] = new Array() if !ans[k]
        ans[k].push(item)

      $.map ans, (val, key) ->
        if val.length > 0 then new Array(val) else undefined
    else
      arr

window.GameUtils = GameUtils
