import { icon, geoCoordMap } from '../js/variables'
var thisPerior = 6
const randomConfig = () => {
  thisPerior = 6 + Math.random() * 6
}
const convertData = data => {
  var res = []
  for (var i = 0; i < data.length; i++) {
    var dataItem = data[i]
    var fromCoord = geoCoordMap[dataItem[0].name]
    var toCoord = geoCoordMap[dataItem[1].name]
    if (fromCoord && toCoord) {
      res.push({
        fromName: dataItem[0].name,
        toName: dataItem[1].name,
        coords: [fromCoord, toCoord],
        value: dataItem[1].value
      })
    }
  }
  return res
}

export function createLine(item, color, data) {
  if (!data) data = convertData(item[1])
  return {
    name: item[0],
    type: 'lines',
    zlevel: 1,
    effect: {
      show: true,
      period: thisPerior,
      trailLength: 0.7,
      color: '#ffffffcc',
      symbolSize: 3
    },
    lineStyle: {
      normal: {
        color: color,
        width: 0,
        curveness: 0.2
      }
    },
    data: convertData(item[1])
  }
}
export function createTrace(item, color, data) {
  if (!data) data = convertData(item[1])
  return {
    name: item[0],
    type: 'lines',
    zlevel: 2,
    symbol: ['none', 'arrow'],
    symbolSize: 10,
    effect: {
      show: true,
      period: thisPerior,
      trailLength: 0,
      symbol: icon.planePath,
      symbolSize: 15
    },
    lineStyle: {
      normal: {
        color: color,
        width: 1,
        opacity: 0.6,
        curveness: 0.2
      }
    },
    data: data
  }
}
export function createPos(item, color) {
  return {
    name: item[0],
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    rippleEffect: {
      brushType: 'stroke'
    },
    label: {
      normal: {
        show: true,
        position: 'right',
        formatter: '{b}'
      }
    },
    symbolSize: val => {
      return val[2] * 0.8
    },
    itemStyle: {
      normal: {
        color: color
      },
      emphasis: {
        areaColor: '#2B91B7'
      }
    },
    data: item[1].map(dataItem => {
      return {
        name: dataItem[1].name,
        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
        // [posX,posY,value]
      }
    })
  }
}
export function createSingleItem(item, color) {
  randomConfig()
  var data = convertData(item[1])
  return [
    createTrace(item, color, data),
    createLine(item, color, data),
    createPos(item, color)
  ]
}
