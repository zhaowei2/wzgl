using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Capital
{

    /// <summary>
    /// AllCapital 的摘要说明
    /// </summary>
    public class AllCapital : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private WZGL.BLL.System.DictitemBLL dictBll = new BLL.System.DictitemBLL();
        private WZGL.BLL.Capital.CapitalaccountBLL countBll = new BLL.Capital.CapitalaccountBLL();

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "capitalaccounttype" : context.Request["sort"].ToString();
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
                case "getDictItem":
                    getDictItem(context);
                    break;
            }
        }

        private void getList(HttpContext context)
        {
            //1.获取前端的参数
            string capitalaccounttype = context.Request["capitalaccounttype"].ToString();
            string organizationid = context.Request["organizationid"].ToString();
            string sql = " ";
            string json = "";
            if (!string.IsNullOrEmpty(capitalaccounttype) && capitalaccounttype != "全部")
            {
                sql += " and A.capitalaccounttype='" + capitalaccounttype + "'";
            }
            if (!string.IsNullOrEmpty(organizationid))
            {
                organizationid = CFunctions.getChildByParentId(organizationid);
                sql += " and A.organizationid in(" + organizationid + ")";

            }
            int count = 0;
            int tocount = 0;
            Dictionary<string, object> obj  = countBll.GetPageListL(sql, sort + " " + order, page, rows, out count, out tocount);
            if (obj!=null)
            {
                json = JsonConvert.SerializeObject(obj);
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void getCount(HttpContext context)
        {
            string capitalaccounttype = context.Request["capitalaccounttype"].ToString();
            string organizationid = context.Request["organizationid"].ToString();
            string sql = "";
            string json = "";
            if (!string.IsNullOrEmpty(capitalaccounttype) && capitalaccounttype != "全部")
            {
                sql += " and capitalaccounttype='" + capitalaccounttype + "'";
            }

            if (!string.IsNullOrEmpty(organizationid))
            {
                organizationid = CFunctions.getChildByParentId(organizationid);
                sql += " and organizationid in(" + organizationid + ")";
              
            }
            try
            {
                int count = countBll.GetCount(sql);
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

        private void getDictItem(HttpContext context)
        {
            string json = "";
            IList<MODEL.System.TBL_DICTITEM> itemList=dictBll.GetList(" and dictid=(select dictid from tbl_dict where dictname='账户类型')  ");
            json = JsonConvert.SerializeObject(itemList);
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