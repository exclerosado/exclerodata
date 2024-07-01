window.addEventListener('load', setup);

async function setup() {
    function segmentColor(ctx, color1, color2){
        if(ctx.p0.parsed.y < 0 && ctx.p1.parsed.y < 0 ) {
            return color2;
        } else if (ctx.p0.parsed.y < 0){
            var gradient = myChart.ctx.createLinearGradient(ctx.p0.x, ctx.p0.y, ctx.p1.x, ctx.p1.y);
            gradient.addColorStop(.5, color2);
            gradient.addColorStop(1, color1);  
            return gradient
        } else if (ctx.p1.parsed.y < 0){
            var gradient = myChart.ctx.createLinearGradient(ctx.p1.x, ctx.p1.y, ctx.p0.x, ctx.p0.y);
            gradient.addColorStop(.5, color2);
            gradient.addColorStop(1, color1);   
            return gradient
        }
        return color1
    }

    const ctx = document.getElementById('chartOne').getContext('2d');
    const globalTemps = await getData();
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: globalTemps.years,
            datasets: [
                {
                    data: globalTemps.temps,
                    animations: {
                        y: {
                            duration: 1000,
                            delay: 500
                        }
                    },
                    pointBackgroundColor: 'transparent',
                    pointBorderColor: 'transparent',
                    fill: {
                        target: 'origin',
                        above: 'rgba(255, 34, 97, 0.1)',
                        below: 'rgba(162, 223, 253, 0.1)'
                    },
                    borderColor: 'rgb(255, 34, 97)',
                    borderWidth: 1,
                    segment: {
                        borderColor: ctx => segmentColor(ctx, 'rgb(255, 34, 97)', 'rgb(162, 223, 253)')
                    }
                }
            ]
        },
        options: {
            animations: {
                y: {
                    easing: 'easeInOutElastic',
                    from: (ctx) => {
                        if (ctx.type === 'data'){
                            if (ctx.mode === 'default' && !ctx.dropped){
                                ctx.dropped = true;
                                return 0;
                            }
                        }
                    }
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
                    beginAtZero: false,
                    ticks: {
                        color: 'rgba(248, 249, 250, 0.8)',
                        callback: function(value, index, ticks){
                            return value.toFixed(1) + '˚';
                        }
                    }
                }
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Aumento anual da temperatura global',
                    color: 'rgb(248, 249, 250)',
                    font: {
                        size: 14
                    },
                    padding: {
                        bottom: 30
                    }
                },
                legend: false
            }
        }
    });
}

async function getData() {
    const response = await fetch('data.csv');
    const data = await response.text();
    const years = [];
    const temps = [];
    const rows = data.split('\n').slice(1);
    rows.forEach(row => {
        const cols = row.split(',');
        years.push(cols[0]);
        temps.push(cols[1]);
    });
    return { years, temps };
}