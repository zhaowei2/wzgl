
$(function () {

    //仓库库存统计
    getColumn();
    //材料统计
    getSpline();
    //材料预算分布图
    getPie();

    getPie1();

    //掘进进度,生产情况
    getRecordSum();

    //材料情况
    clqk();

    //获取流程数据
   //getMyTask();




});
function getSpline() {
    $('#container1').highcharts({
        title: {
            text: '材料统计',
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
            //layout: 'vertical',
            align: 'center',
            verticalAlign: 'top',
            borderWidth: 0,
            y: 25
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


    //$.ajax({
    //    url: "../../Controllers/Warehouse/StockController.ashx?action=getStockTJ",
    //    type: "post",
    //    success: function (data) {
    //        var tj = [];
    //        for (var i = 0; i < data.length; i++) {
    //            tj[i] = [data[i].organizationname, data[i].countprice];
    //        }

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
                    data:[100],
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        format: '{point.y:.1f} 万元'

                    }
                }]
            });

        //},
        //error: function (dd) {
        //}
    //})
}

function getPie() {
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
            text: '材料预算分布图'
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

//本月材料情况
function clqk() {
    //1.获取材料预算数据
    //2.获取材料计划数据
    //3.获取当月材料批控,材料消耗数据
    //$.ajax({
    //    url: "../../Controllers/Warehouse/StockController.ashx?action=getStockTJ",
    //    type: "post",
    //    success: function (data) {
    //    }
    //});

    $('#container4').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: ['材料预算', '材料计划', '材料批控', '材料消耗'],
            title: {
                text: null
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '',
                align: 'high'
            }

        },
        tooltip: {
            valueSuffix: '万元'
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            //verticalAlign: 'top',
            x: -40,
            y: 100,
            floating: true,
            borderWidth: 1,
            backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
            shadow: true
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Month',
            data: [107, 31, 600, 635],
            dataLabels: {
                enabled: true,
                align: 'right',
                format: '{point.y:.1f} 万元'
            }

        }]
    });
}



function getRecordSum() {
    //$.ajax({
        //url: "../../Controllers/Production/TunnellingdailyrecordController.ashx?action=getSumDay",
        //type: "post",
        //success: function (data) {
            $('#container5').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: ['本月计划掘进', '本月实际掘进'],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: '米'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    //verticalAlign: 'top',
                    x: -40,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Month',
                    data: [50, 100],
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        format: '{point.y:.1f} 米'
                    }

                }]
            });
        //},
        //error: function (dd) {
        //    alert(dd);
        //}
    //});


    //$.ajax({
    //    url: "../../Controllers/Production/CoalminedailyrecordController.ashx?action=getSumDay",
    //    type: "post",
    //    success: function (data) {
            $('#container6').highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ' '
                },
                xAxis: {
                    categories: ['本月计划产量', '当月实际产量'],
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '',
                        align: 'high'
                    },
                    labels: {
                        overflow: 'justify'
                    }
                },
                tooltip: {
                    valueSuffix: '万吨'
                },
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    //verticalAlign: 'top',
                    x: -40,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                    shadow: true
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: 'Month',
                    data: [101,120],
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        format: '{point.y:.1f} 万吨'

                    }
                }]
            });
}

//function getMyTask() {
//    $.ajax({
//        url: "../../Controllers/Flow/Flow_Define.ashx?action=getMyTask",
//        type: "post",
//        success: function (data) {
//            var rows = '';
//            for (var i = 0; i < data.length; i++) {
//
//                var data_time = data[i].ADD_TIME.substring(0, 10);
//
//                rows += '<li><div class="tabMessageBox"><p><a href="../../Page/commission/commission.html" class="font-w400 w30">流程名称:' + data[i].DEFINE_NAME + '</a><a href="../../Page/commission/commission.html" class="font-w400 w40">流程单号:' + data[i].DEFINE_CODE + '</a><a href="../../Page/commission/commission.html" class="fs12 w30">发起时间:' + data_time + '</a></p>';
//                rows += '<p><a href="../../Page/commission/commission.html" class="fs12 w30">发起单位:' + data[i].SEND_ORGNAME + '</a><a href="../../Page/commission/commission.html" class="fs12 w40">发起人:' + data[i].SEND_EMPNAME + '</a><a href="../../Page/commission/commission.html" class="fs12 w30">流程状态:' + data[i].STEP_NAME + '</a></p><li>';
//
//
//               // rows += '<li class=""><div class="tabMessageBox"><p><a  href="../../Page/commission/commission.html" class="font-w400">流程名称:' + data[i].DEFINE_NAME + '</a></p>';
//               // rows += '<p><a  href="../../Page/commission/commission.html" class="fs12">流程单号:' + data[i].DEFINE_CODE + '</a></p><li>';
//            }
//            $("#commissionContent").append(rows);
//        }
//    })
//
//    $.ajax({
//        url: "../../Controllers/Flow/Flow_Define.ashx?action=getMyHandledTask",
//        type: "post",
//        success: function (data) {
//            var rows = '';
//            for (var i = 0; i < data.length; i++) {
//                var data_time = data[i].ADD_TIME.substring(0,10);
//                rows += '<li><div class="tabMessageBox"><p><a href="../../Page/handle/handle.html" class="font-w400 w30">流程名称:' + data[i].DEFINE_NAME + '</a><a href="../../Page/handle/handle.html" class="font-w400 w40">流程单号:' + data[i].DEFINE_CODE + '</a><a href="../../Page/handle/handle.html" class="fs12 w30">发起时间:' + data_time + '</a></p>';
//                rows += '<p><a href="../../Page/handle/handle.html" class="fs12 w30">发起单位:' + data[i].SEND_ORGNAME + '</a><a href="../../Page/handle/handle.html" class="fs12 w40">发起人:' + data[i].SEND_EMPNAME + '</a><a href="../../Page/handle/handle.html" class="fs12 w30">流程状态:' + data[i].STEP_NAME + '</a></p><li>';
//            }
//            $("#handleContent").append(rows);
//        }
//    })
//
//}


//点击流程
//$('.transaction').on("click", function (e) {
//    var target = e.target;
//    //console.log($(target).attr("class"));
//    if ($(target).attr("class").indexOf("clickSwitcher") !== -1 && target.id == "handle") {
//        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
//        //console.log(target);
//        $(target).css("border", "1px solid #ddd").css("borderBottom", "transparent");
//        $("#commission").css("border", "1px solid transparent").css("borderBottomColor", "#ddd");
//        $("#handleContent").css("display", "block");
//        $("#commissionContent").css("display", "none");
//    }
//    if ($(target).attr("class").indexOf("clickSwitcher") !== -1 && target.id == "commission") {
//        $(target).removeClass("clickSwitcher").siblings().addClass('clickSwitcher');
//        $(target).css("border", "1px solid #ddd").css("borderBottom", "transparent");
//        $("#handle").css("border", "1px solid transparent").css("borderBottomColor", "#ddd");
//        $("#handleContent").css("display", "none");
//        $("#commissionContent").css("display", "block");
//    }
//
//});