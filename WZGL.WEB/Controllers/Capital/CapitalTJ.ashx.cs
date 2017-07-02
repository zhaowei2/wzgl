using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Capital
{

    /// <summary>
    /// CapitalTJ 的摘要说明
    /// </summary>
    public class CapitalTJ : IHttpHandler
    {
        private WZGL.BLL.Capital.Capitalaccount_flowercordBLL flowBll = new BLL.Capital.Capitalaccount_flowercordBLL();
        public void ProcessRequest(HttpContext context)
        {
            string action = context.Request["action"];
            switch (action)
            {
                //获取用户信息
                case "getContainer":
                    getContainer(context);
                    break;
                default:
                    break;
            }

        }

        private void getContainer(HttpContext context)
        {
            //1.获取参数
            string json = "";
            string organizationid = context.Request["organizationid"].ToString() == "全部" ? "" : context.Request["organizationid"].ToString();
            //2.t_sql语句
            string sql = " select SUM(amount) amount,CONVERT(varchar(7),appeardate,120) appeardate from tbl_capitalaccount_flowrecord  where flowrecordtype='入账'  and CONVERT(varchar(4),appeardate,120)='"+DateTime.Now.Year+"'";
            string sql1 = " select SUM(amount) amount,CONVERT(varchar(7),appeardate,120) appeardate from tbl_capitalaccount_flowrecord  where flowrecordtype='出账'  and CONVERT(varchar(4),appeardate,120)='" + DateTime.Now.Year + "'";
            if (!string.IsNullOrEmpty(organizationid))
	        {
                string organization = CFunctions.getChildByParentId(organizationid);
                sql += " and organizationid in(" + organization + ")";
                sql1 += " and organizationid in(" + organizationid + ")";
	        }
            sql+=" group by CONVERT(varchar(7),appeardate,120) ORDER BY appeardate";
            sql1 += " group by CONVERT(varchar(7),appeardate,120) ORDER BY appeardate";
            IList<MODEL.Capital.TBL_CAPITALACCOUNT_FLOWRECORD> flowList = flowBll.GetListByOrgan(sql);
            IList<MODEL.Capital.TBL_CAPITALACCOUNT_FLOWRECORD> flowList1 = flowBll.GetListByOrgan(sql1);
            Dictionary<string, object> obj = new Dictionary<string, object>();
            //int days = DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month);
           // obj.Add("total", days);
            obj.Add("rows", flowList);
            //obj.Add("total1", days);
            obj.Add("rows1", flowList1);
            json = JsonConvert.SerializeObject(obj);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}