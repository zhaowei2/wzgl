
$(function () {
    getOrganization("treeOrganization1", 1);
    getSpline("全部");
})

//加载部门
function getOrganization(name, type) {
    $.ajax({
        type: "POST",
        url: "../../Controllers/Systems/OrganizationController.ashx?action=getList",
        dataType: 'json',
        success: function (msg) {
            if (msg != '') {
                $('#' + name).empty();
                var html = '';
                //html += ' <li><a data-label="全部" data-id="#"  onclick="getId(全部,全部)">全部</a>';
                $.each(msg, function (index, org) {
                    html += ' <li><a data-label="' + org.organizationname + '" data-id="#"  onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\')">' + org.organizationname + '</a>';
                    if (org.children != null) {
                        html += getTree(org.children, type);
                    }
                    html += '</li>';

                });
                html = '<li ><a data-label="全部" href="#" onclick="getId(\'\',\'全部 \',' + type + ')">全部</a> <ul style="height:204px;overflow-y:auto;">' + html + '  </ul> </li>';
                $('#' + name).html(html);
                initTree();
                $(".tree").treemenu({ delay: 300 }).openActive();
            }
        }
    });
}

//生成树
function getTree(orgs, type) {
    var html = ' <ul>';
    for (var i = 0; i < orgs.length; i++) {
        var org = orgs[i];
        html += ' <li><a data-label="' + org.organizationname + '" href="#" onclick="getId(\'' + org.organizationid + '\',\'' + org.organizationname + '\',' + type + ')">' + org.organizationname + '</a>';
        if (org.children != null) {
            html += getTree(org.children);
        }
        html += '</li>';
    }
    html += '</ul>';
    return html;
}

//获取下拉树的id
function getId(id, category) {
    $("#selorganizationid").val(id)
    $('#label-active1').text(category);
    getSpline(id);
}




function getSpline(organizationid) {
    var url = "../../Controllers/Capital/CapitalTJ.ashx?action=getContainer&organizationid=" +  encodeURI(organizationid);
    $.ajax(
        {
            type: "POST",
            url: url,
            dataType: 'json',
            success: function (msg) {
                var cz = new Array();
                var rz = new Array();
                for (var z = 0; z < 12; z++) {
                    cz[z] = "0";
                    rz[z] = "0";
                }
                for (var i = 0; i < msg.rows.length; i++) {
                    var a = msg.rows[i].appeardate.split('-')[1];
                    rz[a - 1] = msg.rows[i].amount;
                }
                for (var j = 0; j < msg.rows1.length; j++) {
                    var b = msg.rows1[j].appeardate.split('-')[1];
                    cz[b - 1] = msg.rows1[j].amount;
                }
                $('#container').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '账户流水图标',
                        //x: -20 //center
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
                        y:25
                    },
                    series: [{
                        name: '入账',
                        dataLabels: {
                            enabled: true,
                        },
                        data: rz
                    }, {
                        name: '出账',
                        dataLabels: {
                            enabled: true,
                        },
                        data: cz
                    }]
                });
            }
        }
     )
}