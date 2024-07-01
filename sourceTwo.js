window.addEventListener('load', setupTwo);

async function setupTwo() {
    const totalDuration = 8500;
    const globalTemps = await getDataTwo();
    const delayBetweenPoints = totalDuration / globalTemps.years.length;
    const previousY = (ctx) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;

    const animation = {
        x: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: NaN, // the point is initially skipped
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.xStarted) {
                    return 0;
                }
                ctx.xStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        },
        y: {
            type: 'number',
            easing: 'linear',
            duration: delayBetweenPoints,
            from: previousY,
            delay(ctx) {
                if (ctx.type !== 'data' || ctx.yStarted) {
                    return 0;
                }
                ctx.yStarted = true;
                return ctx.index * delayBetweenPoints;
            }
        }
    };

    const ctx = document.getElementById('chartTwo').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: globalTemps.years,
            datasets: [
                {
                    data: globalTemps.tempsCelsius,
                    pointBackgroundColor: 'rgb(248, 249, 250)',
                    pointRadius: 1,
                    pointHoverRadius: 7,
                    borderColor: 'rgb(178, 249, 58)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            animation,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Temperatura global em Celsius',
                    color: 'rgb(248, 249, 250)',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 30
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(248, 249, 250, 0.8)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(248, 249, 250, 0.8)',
                        callback: function(value, index, ticks){
                            return value.toFixed(1) + '˚';
                        }
                    }
                }
            }
        }
    });
}

async function getDataTwo() {
    const response = await fetch('data.csv');
    const data = await response.text();
    const years = [];
    const tempsCelsius = [];
    const rows = data.split('\n').slice(1);
    rows.forEach(row => {
        const cols = row.split(',');
        years.push(cols[0]);
        tempsCelsius.push(parseFloat(cols[1]) + 14);
    });
    return { years, tempsCelsius };
}