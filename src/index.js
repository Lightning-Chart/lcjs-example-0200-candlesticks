/*
 * LightningChartJS example that showcases creation of a Candlestick-chart.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Import xydata
const xydata = require('@lightningchart/xydata')

// Extract required parts from LightningChartJS.
const { lightningChart, AxisTickStrategies, OHLCSeriesTypes, emptyLine, AxisScrollStrategies, Themes } = lcjs

// Import data-generator from 'xydata'-library.
const { createOHLCGenerator } = xydata

// Decide on an origin for DateTime axis.
const dateOrigin = new Date(2018, 0, 1)
const dateOriginTime = dateOrigin.getTime()

// Create a XY Chart.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        }).ChartXY({
    theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
})
// Use DateTime X-axis using with above defined origin.
chart.getDefaultAxisX().setTickStrategy(AxisTickStrategies.DateTime, (tickStrategy) => tickStrategy.setDateOrigin(dateOrigin))

chart.setTitle('Candlesticks Chart')
// Style AutoCursor using preset.
chart.setCursor((cursor) => {
    cursor.setTickMarkerYVisible(false)
    cursor.setGridStrokeYStyle(emptyLine)
})

// Change the title and behavior of the default Y Axis
chart
    .getDefaultAxisY()
    .setTitle('USD')
    .setInterval({ start: 90, end: 110, stopAxisAfter: false })
    .setScrollStrategy(AxisScrollStrategies.expansion)

// Add a OHLC series with Candlestick as type of figures.
const series = chart.addOHLCSeries({ 
    type: OHLCSeriesTypes.Candlestick 
})
// Generate some points using 'xydata'-library.
const dataSpan = 10 * 24 * 60 * 60 * 1000
const dataFrequency = 1000 * 60
createOHLCGenerator()
    .setNumberOfPoints(dataSpan / dataFrequency)
    .setStart(100)
    .generate()
    .toPromise()
    // Map x datapoints to start from date origin with the frequency of dataFrequency
    .then((data) =>
        data.map((innerArray) => {
            innerArray[0] = dateOriginTime + innerArray[0] * dataFrequency
            return innerArray
        }),
    )
    // Shift the data by dateOriginTime
    .then((data) =>
        data.map((innerArray) => {
            innerArray[0] = innerArray[0] - dateOriginTime
            return innerArray
        }),
    )
    .then((data) => {
        series.add(data)
    })
