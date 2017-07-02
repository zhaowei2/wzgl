using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using WZGL.BLL;
using WZGL.IDAO.Warehouse;
using WZGL.MODEL.System;
using WZGL.MODEL.Warehouse;
using WZGL.WEB.Common;
namespace WZGL.WEB.Controllers.Warehouse
{
    /// <summary>
    /// WarehousetaskController 的摘要说明
    /// </summary>
    public class WarehousetaskController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        #endregion

        IWarehousetaskBLL Bll = BllFactory.GetTaskBLL();
        TBL_USER user = new TBL_USER();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "processnumber desc" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
            string action = context.Request["action"];
            switch (action)
            {
                //获取列表
                case "getPageList": getPageList(context); break;
                //获取列表
                case "getList": getList(context); break;
                //删除
                case "delete": delete(context); break;
                //个数
                case "getCount": GetCount(context); break; 
              //出入库操作
                case "GetInoroutStock":  GetInoroutStock(context); break;
            }
        }

        #region 1.获取库存列表
        /// <summary>
        /// 获取库存列表
        /// </summary>
        /// <param name="context"></param>
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = " and a.state='未处理'  and   a. organizationid=' " + user.organizationid + "'"; 
            string organizationid = context.Request["organizationid"];
            string linliaor = context.Request["linliaor"];
            string begindate = context.Request["begindate"];
            string enddate = context.Request["enddate"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
                // sql += " and b.organizationid = '" + organizationid + "' ";
            }
            if (!string.IsNullOrEmpty(linliaor))
            {
                sql += " and c.name like  '%" + linliaor + "%'";
            }

            if (!string.IsNullOrEmpty(begindate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) >= '" + begindate + "'";
            }

            if (!string.IsNullOrEmpty(enddate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) <= '" + enddate + "'";
            }
            try
            {
                List<TBL_WAREHOUSE_TASK> lists = Bll.GetList(sql) as List<TBL_WAREHOUSE_TASK>;
                json = JsonConvert.SerializeObject(lists);
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        #endregion

        #region 2.获取库存列表
        /// <summary>
        /// 获取库存列表
        /// </summary>
        /// <param name="context"></param>
        private void getPageList(HttpContext context)
        {
            int pcount = 0;
            int totalcount = 0;
            string json = string.Empty;
            string sql = " and a.state='未处理'  and   a. organizationid=' "+user.organizationid+"'"; 
            string organizationid = context.Request["organizationid"];
            string linliaor = context.Request["linliaor"];
            string begindate = context.Request["begindate"];
            string enddate = context.Request["enddate"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
                // sql += " and b.organizationid = '" + organizationid + "' ";
            }
            if (!string.IsNullOrEmpty(linliaor))
            {
                sql += " and c.name like  '%" + linliaor + "%'";
            }

            if (!string.IsNullOrEmpty(begindate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) >= '" + begindate + "'";
            }

            if (!string.IsNullOrEmpty(enddate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) <= '" + enddate + "'";
            }
            try
            {
                Dictionary<string, object> lists = Bll.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
                json = JsonConvert.SerializeObject(lists);
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'" + json + "'}");
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 3.删除库存
        /// <summary>
        /// 删除库存
        /// </summary>
        /// <param name="context"></param>
        private void delete(HttpContext context)
        {
            string userid = context.Request["userid"];
            string json = "";

            try
            {
                Bll.Delete(userid);
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'删除成功！'}");
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'删除失败！'}");
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 4.获取库存总个数
        /// <summary>
        /// 获取库存总个数
        /// </summary>
        /// <param name="context"></param>
        private void GetCount(HttpContext context)
        {
            string json = string.Empty;
            string sql = " and a.state='未处理'  and   a. organizationid=' " + user.organizationid + "'"; 

            string organizationid = context.Request["organizationid"];
            string linliaor = context.Request["linliaor"];
            string begindate = context.Request["begindate"];
            string enddate = context.Request["enddate"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
                // sql += " and b.organizationid = '" + organizationid + "' ";
            }
            if (!string.IsNullOrEmpty(linliaor))
            {
                sql += " and c.name like  '%" + linliaor + "%'";
            }

            if (!string.IsNullOrEmpty(begindate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) >= '" + begindate + "'";
            }

            if (!string.IsNullOrEmpty(enddate))
            {
                sql += " and CONVERT(varchar(20),b.submitdate,23) <= '" + enddate + "'";
            }
            try
            {
                int count = Bll.GetCount(sql);
                json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
            }
            catch
            {
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                json = "{\"IsSuccess\":\"false\",\"Count\":0}";
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        #endregion

        #region 5.出入库操作
        /// <summary>
        /// 出入库操作
        /// </summary>
        /// <param name="context"></param>
        private void GetInoroutStock(HttpContext context)
        {
            string json = string.Empty;
            string processnumber = context.Request["processnumber"];
            try
            {
                int Rvalue = 0;
                Bll.GetInoroutStock(processnumber, out Rvalue);
                json = "{\"IsSuccess\":\"true\",\"result\":" + Rvalue + "}";
            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"result\":-1}";
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        #endregion

        #region 6.其他

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        #endregion
    }
}