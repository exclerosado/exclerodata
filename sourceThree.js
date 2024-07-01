window.addEventListener('load', load);

async function load(){
    const ctx = document.getElementById('chartThree');
    const meanLabels = ['1880-1889', '1890-1899', '1900-1909', '1910-1919', '1920-1929', '1930-1939', '1940-1949', '1950-1959', '1960-1969', '1970-1979', '1980-1989', '1990-1999', '2000-2009', '2010-2019', '2020-2023'];
    const meanValues = [-0.2080, -0.2390, -0.3190, -0.3310, -0.2400, -0.1220, 0.0440, -0.0470, -0.0310, 0.0349, 0.2470, 0.3830, 0.5880, 0.8089, 0.9875];
    let delayed;
        
    new Chart(ctx, {
        type: 'bar',
        data: {
        labels: meanLabels,
        datasets: [{
            data: meanValues,
            backgroundColor(context){
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                return value < 0 ? 'rgb(105, 58, 248)' : 'rgb(250, 36, 103)'
            }
        }]
        },
        options: {
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed){
                        delay = context.dataIndex * 300 + context.datasetIndex * 100;
                    }
                    return delay;
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(248, 249, 250, 0.8)'
                    }
                },
                y: {
                    stacked: true,
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
            },
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Média de cada década',
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
            }
        }
    });
}