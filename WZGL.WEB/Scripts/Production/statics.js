
$(function () { 
    getColumn();
    getSpline();
    getPie();
    getPie1();
});
function getSpline() {
    $('#container1').highcharts({
        title: {
            text: '2016年度材料统计',
            x: -20 //center
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        subtitle: {
            text: '',
            x: -20
        },
        xAxis: {
            categories: ['一月', '二月', '三月', '四月', '五月', '六月',
                         '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
            title: {
                text: '万元'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }],
            lineWidth: 1
        },
        tooltip: {
            valueSuffix: '万元'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: '材料预算',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: '材料消耗',
            data: [0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: '材料审批',
            data: [0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }]
    });
}


function getColumn() {

    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '仓库库存统计'
        },
        subtitle: {
            text: ' '
        },
        xAxis: {
            type: 'category',
            labels: {

                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        yAxis: {
            min: 0,
            title: {
                text: '（万元）'
            },
            lineWidth: 1
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: '总额: <b>{point.y:.1f} 万元</b>'
        },
        series: [{
            name: 'Population',
            data: [
                ['三铁库', 23.7],
                ['大型材料库', 16.1],
                ['坑木场', 14.2],
                ['油库', 14.0],
                ['开掘工厂', 12.5],
                ['火工品', 12.1],
                ['井口库', 11.8]

            ],
            dataLabels: {
                enabled: true,
                align: 'right',
                format: '{point.y:.1f} 万元'
              
            }
        }]
    });
  

}

function getPie()
{
    $('#container2').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        title: {
            text: '2016年12月材料预算分布图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}'
                    
                }
            }
        },
        series: [{
            type: 'pie',
            name: '',
            data: [
                ['定额指标', 26.8],
                ['限额指标', 8.5],
                ['单项工程', 6.2]
            ]
        }]
    });
}
function getPie1() {
    $('#container3').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        credits: {
            enabled: false // 禁用版权信息
        },
        title: {
            text: '2016年12月材料消耗分布图'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f}'

                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
              
                ['定额指标', 21.8],
                ['限额指标', 10.5],
                ['单项工程', 4.2]
            ]
        }]
    });
}
