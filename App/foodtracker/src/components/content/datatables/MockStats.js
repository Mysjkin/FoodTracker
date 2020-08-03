

class MockFoodData {
    constructor(){
        this.chartData = {
            options: {
                chart: {
                    id: 'apexchart-example'
                },
                xaxis: {
                    categories: [1, 2, 3, 4, 5, 6, 7]
                },
                fill: {
                    colors: ["#82bef6"]
                }
            },
            series: [{
                name: 'Indtaget',
                type: 'column',
                data: [30, 40, 45, 50, 49, 60, 70]
            },
            {
                name: 'Mål',
                type: 'line',
                markers: {
                    size: 0,
                },
                data: [50,50,50,50,50,50,50]
            }]
        }
    }

    getData(){ return this.chartData};
}

export default MockFoodData;