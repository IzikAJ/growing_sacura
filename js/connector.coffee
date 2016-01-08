class CellConnector

  constructor: (@app, @cell_a, @cell_b)->
    @_ = CellConnector
    @CELL_SIDE = @app.CELL_SIDE
    @CELL_OFFSET = @app.CELL_OFFSET

    @cell_a.connectors.push(this)
    @cell_b.connectors.push(this)

  render: ()->
    g = @app.g
    offset = @app.map.offset

    pos1 = @cell_a.cellPosition()
    pos2 = @cell_b.cellPosition()
    x1 = pos1.x + offset.x || 0
    y1 = pos1.y + offset.y || 0
    x2 = pos2.x + offset.x || 0
    y2 = pos2.y + offset.y || 0

    g.fillStyle = "#060"
    g.strokeStyle = "#060"

    g.lineWidth = 2
    g.beginPath()
    g.moveTo(x1, y1)
    g.lineTo(x2 , y2)

    g.stroke()

window.CellConnector = CellConnector
