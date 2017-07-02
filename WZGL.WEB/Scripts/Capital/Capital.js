var isAdd = true;
var pagesize = 15;
var isZZ = false;
var focus = '';
$(function () {
    //1.初始化日期控件
    var Data = new Date();
    calender("#inp2").init({
        format: 'yyyy-MM-dd',
        date: [Data.getFullYear(), Data.getMonth() + 1, Data.getDate()],

    }, function (date) {
        this.value = date
    });
    //calender('#txtend').init({
    //    format: 'yyyy-MM-dd'
    //}, function (date) {
    //    this.value = date;
    //});
    calender("#inp1").init({
        format: 'yyyy-MM-dd',
        date: [Data.getFullYear(), Data.getMonth() + 1, Data.getDate()],

    }, function (date) {
        this.value = date
    });

    //calender("#watetext").init({
    //    format: 'yyyy-MM',
    //    date: [Data.getFullYear(), Data.getMonth() + 1, Data.getDate()],


    //}, function (date) {
    //    this.value = date
    //});
    //2.获取资金账户情况
    $.ajax({
        type: "POST",
        url: "../../Controllers/Capital/Capital.ashx?action=getUserInfo",
        dataType: 'json',
        success: function (msg) {
            if (msg.length != 0) {
                $("#lab_zhlx").text(msg[0].itemname);
                $("#lab_ssbm").text(msg[0].organizationname);
                $("#lab_byys").text("100000");
                $("#lab_zhye").text(msg[0].balance);
                //3.初始化列表数据
                initPagination();
                //4.获取则线图
                isZZ = true;
                getSpline();
                
            }
        }
    });
})

function initPagination() {
    var url = "../../Controllers/Capital/CapitalFlow.ashx?action=getCount&Oneself=1";
    $.ajax({
        type: "POST",
        url: url,
        dataType: 'json',
        data: {
            "flowrecordtype": $("#cmb_type").val(),
            "source": $("#cmb_ly").val(),
            "StartTime": $("#inp2").val(),
            "EndTime": $("#inp1").val(),
        },
        success: function (msg) {
            if (msg != '') {
                if (msg.IsSuccess == "true") {
                    if (msg.Count == 0) {
                        $('#coalmines tbody').empty();
                    }
                    var initPagination = function () {
                        // 创建分页
                        $("#Pagination").pagination(parseInt(msg.Count), {
                            num_edge_entries: 1, //边缘页数
                            num_display_entries: 10, //主体页数
                            callback: pageselectCallback,
                            items_per_page: pagesize, //每页显示页数
                            prev_text: "上一页",
                            next_text: "下一页"
                        });
                    };
                    function pageselectCallback(page_index, jq) {

                        var index = page_index + 1;
                        $.ajax(
                        {
                            url: "../../Controllers/Capital/CapitalFlow.ashx?action=getList&Oneself=1",
                            type: "post",
                            data: {
                                "page": index,
                                "rows": pagesize, //每页显示页数
                                "flowrecordtype": $("#cmb_type").val(),
                                "source": $("#cmb_ly").val(),
                                "StartTime": $("#inp2").val(),
                                "EndTime": $("#inp1").val(),
                            },
                            success: function (data) {
                                $('#coalmines tbody').empty();
                                var row = "";
                                for (var i = 0; i < data.length; i++) {
                                    row += '  <tr class="listDataTr">'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].appeardate + '>' + data[i].appeardate + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].flowrecordtype + '>' + data[i].flowrecordtype + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].source + '>' + data[i].source + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].processnumber + '>' + data[i].processnumber + '</a>'
                                           + ' </td>'
                                           + ' <td class="listDataTrTd" style="word-break: break-all;">'
                                           + ' <a href="javaScript:void(0)" title=' + data[i].amount + '>' + data[i].amount + '</a>'
                                           + ' </td>'
                                           + ' </tr>';
                                }
                                $("#coalmines tbody").append(row);
                            }
                        });
                        return false;
                    }
                    //ajax加载
                    $("#hiddenresult").load("load.html", null, initPagination);
                }
            }
        }
    });
}


function Select() {
    if (!isZZ) {
        return;
    }
    else {
        initPagination();
    }
}

function Reset() {
    $("#cmb_type").val("全部");
    $("#cmb_ly").val("全部");
    $("#inp2").val("");
    $("#inp1").val("");
}


function getSpline() {
    if (isZZ) {
        var url = "../../Controllers/Capital/Capital.ashx?action=getContainer&Date=" + $("#watetext").val();
        $.ajax(
            {
                type: "POST",
                url: url,
                dataType: 'json',
                success: function (msg) {
                    var cz = new Array();
                    var rz = new Array();
                    var data = new Array();
                    for (var z = 0; z < msg.total; z++) {
                        data[z] = (z + 1) + "号";
                        cz[z] = "0";
                        rz[z] = "0";
                    }
                    for (var i = 0; i < msg.rows.length; i++) {
                        var a = msg.rows[i].appeardate.split('-')[2];
                        rz[a - 1] = msg.rows[i].amount;
                    }
                    for (var j = 0; j < msg.rows1.length; j++) {
                        var b = msg.rows1[j].appeardate.split('-')[2];
                        cz[b - 1] = msg.rows1[j].amount;
                    }
                    $('#container').highcharts({
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: '账户流水统计',
                            // x: -20 //center
                        },
                        credits: {
                            enabled: false // 禁用版权信息
                        },
                        subtitle: {
                            text: '',
                            x: -20
                        },
                        xAxis: {
                            type: 'category',
                            min: 1,
                            max: msg.total,
                            title: {
                                text: '日期(日)'
                            },
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
                            min: 1,
                            title: {
                                text: '金额(元)'
                            },
                            lineWidth: 1
                        },
                        legend: {
                            enabled: true
                        },
                        tooltip: {
                            pointFormat: '金额: <b>{point.y:.1f}元</b>'
                        },
                        legend: {
                            //layout: 'vertical',
                            align: 'center',
                            verticalAlign: 'top',
                            borderWidth: 0,
                            y: 25
                        },
                        series: [{
                            name: '入账',
                            data: rz,
                            dataLabels: {
                                enabled: true,
                            }
                        }, {
                            name: '出账',
                            data: cz,
                            dataLabels: {
                                enabled: true,
                            }
                        }]
                    });
                }
            }
        )
    }
}

