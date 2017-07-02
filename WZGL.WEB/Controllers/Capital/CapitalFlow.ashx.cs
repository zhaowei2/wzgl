using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using WZGL.MODEL.System;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Capital
{
    /// <summary>
    /// CapitalFlow 的摘要说明
    /// </summary>
    public class CapitalFlow : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private WZGL.BLL.Capital.Capitalaccount_flowercordBLL flowBll = new BLL.Capital.Capitalaccount_flowercordBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "appeardate" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];
            switch (action)
            {
                //获取用户信息
                case "getList":
                    getList(context);
                    break;
                case "getCount":
                    getCount(context);
                    break;
                default:
                    break;
            }
        }

        private void getList(HttpContext context)
        {
            //1. 获取前端参数
            string flowrecordtype = context.Request["flowrecordtype"].ToString();
            string source = context.Request["source"].ToString();
            string organization = "";
            if (context.Request["Oneself"].ToString() == "1")
            {
                string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
                TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
                organization = user.organizationid;

            }
            else
            {
                organization = context.Request["Organization"].ToString();
            }
            string appeardate = context.Request["StartTime"].ToString();
            string endDate = context.Request["EndTime"].ToString();
            string json = "";

            string sql = " select A.flowrecordid,A.organizationid,A.capitalaccountid,A.flowrecordtype,A.amount,convert(varchar(11),A.appeardate,120) appeardate,A.processnumber,A.source,B.organizationname from tbl_capitalaccount_flowrecord A inner join  TBL_ORGANIZATION B ON(A.organizationid=B.organizationid)";
            if (!string.IsNullOrEmpty(flowrecordtype) && flowrecordtype != "全部")
            {
                sql += " and  flowrecordtype='" + flowrecordtype + "'";
            }
            if (!string.IsNullOrEmpty(source) && source != "全部")
            {
                sql += " and  source='" + source + "'";
            }
            if (!string.IsNullOrEmpty(organization) && organization != "全部")
            {
                organization = CFunctions.getChildByParentId(organization);
                sql += " and A.organizationid in(" + organization + ")";
            }
            if (!string.IsNullOrEmpty(appeardate))
            {
                sql += " and  Convert(varchar(10),A.appeardate,120)>='" + Convert.ToDateTime(appeardate) + "'";
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                sql += " and  Convert(varchar(10),A.appeardate,120)<='" + Convert.ToDateTime(endDate) + "'";
            }
            int count = 0;
            int tocount = 0;
            IList<MODEL.Capital.TBL_CAPITALACCOUNT_FLOWRECORD> obj = flowBll.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
            if (obj.Count > 0)
            {
                json = JsonConvert.SerializeObject(obj);
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();


        }

        private void getCount(HttpContext context)
        {
            //1. 获取前端参数
            string flowrecordtype=context.Request["flowrecordtype"].ToString();
            string source = context.Request["source"].ToString();
            string organization = "";
            if (context.Request["Oneself"].ToString()=="1")
            {
                string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
                TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
                organization = user.organizationid;
            }
            else
	        {
                organization=context.Request["Organization"].ToString();
	        }
            
            string appeardate=context.Request["StartTime"].ToString();
            string endDate=context.Request["EndTime"].ToString();
            string sql = "";
            string json = "";

            if (!string.IsNullOrEmpty(flowrecordtype)&&flowrecordtype!="全部")
            {
                sql += " and  flowrecordtype='" + flowrecordtype + "'";
            }
            if (!string.IsNullOrEmpty(source) && source!="全部")
            {
                sql += " and  source='" + source + "'";
            }
            if (!string.IsNullOrEmpty(organization)&&organization!="全部")
            {
                organization = CFunctions.getChildByParentId(organization);
                sql += " and organizationid in(" + organization + ")";
            }
            if (!string.IsNullOrEmpty(appeardate))
            {
                sql += " and  Convert(varchar(10),appeardate,120)>='" + Convert.ToDateTime(appeardate) + "'";
            }
            if (!string.IsNullOrEmpty(endDate))
            {
                sql += " and  Convert(varchar(10),appeardate,120)<='" + Convert.ToDateTime(endDate) + "'";
            }
            try
            {
                int count = flowBll.GetCount(sql);
                json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"Count\":0}";
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
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