using log4net;
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
    /// InoroutrecordController 的摘要说明
    /// </summary>
    public class InoroutrecordController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        readonly ILog logger = LogManager.GetLogger(typeof(InoroutrecordController));
        #endregion

        IInoroutrecordBLL Bll = BllFactory.GetDrecordBLL();
        TBL_USER user = new TBL_USER();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "inoroutdate desc" : context.Request["sort"].ToString();
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
                //添加
                case "add": add(context); break;
                //修改
                case "update": update(context); break;
                //删除
                case "delete": delete(context); break;
                //个数
                case "getCount": GetCount(context); break;
                //获取出入库分页列表
                case "getInOutPageList": getInOutPageList(context); break;
                //获取入库分页列表
               // case "getInPageList": getInPageList(context); break;
               //获取入库列表
                case "GetInOutList": GetInOutList(context); break;
                    
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
            string org = user.organizationid;
            string sql = "  and b. organizationid='" + org + "'";
            string processnumber = context.Request["processnumber"];
            string inorout = context.Request["inorout"];
            string state = context.Request["state"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
            }
            if (!string.IsNullOrEmpty(inorout))
            {
                sql += "  and  t.inorout  = '" + inorout + "'";
            }
            if (!string.IsNullOrEmpty(state))
            {
                sql += "  and  t.state  = '" + state + "'";
            }
            try
            {
                List<TBL_DEPARTMENT_INOROUTRECORD> lists = Bll.GetList(sql) as List<TBL_DEPARTMENT_INOROUTRECORD>;
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
            string json = string.Empty;
            string org = user.organizationid;
            string orgtype = user.organizationtype; //部门类型
            string sql = "  and b. organizationid='"+org+"'";
            int pcount = 0;
            int totalcount = 0;
            string processnumber = context.Request["processnumber"];
            string inorout = context.Request["inorout"];
            string state = context.Request["state"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
            }
            if (!string.IsNullOrEmpty(inorout))
            {
                sql += "  and  t.inorout  = '" + inorout + "'";
            }
            if (!string.IsNullOrEmpty(state))
            {
                sql += "  and  t.state  = '" + state + "'";
            }
            if (orgtype == "2067DC4D-D0D1-4239-880E-9D7BE2EABE07") //用料单位仓库
            {
                sql += "  and (( t.inorout='入库' and  t.source  = '驻矿站') or t.inorout='出库')";
            }
            try
            {
                Dictionary<string, object> lists = Bll.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
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

        #region 3.新增库存
        /// <summary>
        /// 新增库存
        /// </summary>
        /// <param name="context"></param>
        private void add(HttpContext context)
        {
            string json = "";
            TBL_DEPARTMENT_INOROUTRECORD model = new TBL_DEPARTMENT_INOROUTRECORD();
            model.department_inoroutrecordid = System.Guid.NewGuid().ToString().ToUpper();
            model.inorout = context.Request["inorout"];
            model.inoroutdate = context.Request["inoroutdate"];
            model.handleperson = context.Request["handleperson"];
            model.processnumber = context.Request["processnumber"];
            model.pickingperson = context.Request["pickingperson"];
            try
            {
                Bll.Add(model);
                json = "{IsSuccess:'true',Message:'保存成功！'}";
            }
            catch
            {
                json = "{IsSuccess:'false',Message:'保存失败！'}";
            }
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 4.修改库存
        /// <summary>
        /// 修改库存
        /// </summary>
        /// <param name="context"></param>
        private void update(HttpContext context)
        {
            string json = "";
            TBL_DEPARTMENT_INOROUTRECORD model = new TBL_DEPARTMENT_INOROUTRECORD();
            model.department_inoroutrecordid = context.Request["department_inoroutrecordid"];
            model.inorout = context.Request["inorout"];
            model.inoroutdate =context.Request["inoroutdate"];
            model.handleperson = context.Request["handleperson"];
            model.processnumber = context.Request["processnumber"];
            model.pickingperson = context.Request["pickingperson"];
            try
            {
                Bll.Update(model);
                json = "{IsSuccess:'true',Message:'保存成功！'}";
            }
            catch
            {
                json = "{IsSuccess:'false',Message:'保存失败！'}";
            }
            // context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 5.删除库存
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

        #region 6.获取库存总个数
        /// <summary>
        /// 获取库存总个数
        /// </summary>
        /// <param name="context"></param>
        private void GetCount(HttpContext context)
        {
            string json = string.Empty;
            string org = user.organizationid;
            string sql = "  and b. organizationid='" + org + "'";
            string processnumber = context.Request["processnumber"];
            string inorout = context.Request["inorout"];
            string state = context.Request["state"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
            }
            if (!string.IsNullOrEmpty(inorout))
            {
                sql += "  and  t.inorout  = '" + inorout + "'";

            }
            if (!string.IsNullOrEmpty(state))
            {
                sql += "  and  t.state  = '" + state + "'";
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

        #region 7.其他
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        #endregion

        #region 8获取出库分页列表
        private void getOutPageList(HttpContext context)
        {
            string sql = " and inorout='出库'  "; //state='已完成' and b.organizationtype='2067DC4D-D0D1-4239-880E-9D7BE2EABE07'
            string json = "";
            int pcount = 0;
            int totalcount = 0;
            string organizationid = context.Request["organizationid"];
            string processnumber = context.Request["processnumber"];
            string inoroutdate = context.Request["inoroutdate"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
               // sql += " and b.organizationid = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(processnumber))
            {

                sql += " and processnumber = '" + processnumber + "'";
            }

            if (!string.IsNullOrEmpty(inoroutdate))
            {

                sql += " and CONVERT(varchar(20),inoroutdate,23) = '" + inoroutdate + "'";
            }

            try
            {
                Dictionary<string, object> irList = Bll.GetInOutPageList(sql, sort, page, rows, out pcount, out totalcount);



                json = JsonConvert.SerializeObject(irList);
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'" + json + "'}");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 9获取出入库分页列表
        private void getInOutPageList(HttpContext context)
        {
            string sql = "   "; // and inorout='入库' state='已完成' and b.organizationtype='2067DC4D-D0D1-4239-880E-9D7BE2EABE07'
            string json = "";
            int pcount = 0;
            int totalcount = 0;
            string organizationid = context.Request["organizationid"];
            string processnumber = context.Request["processnumber"];
            string begindate = context.Request["begindate"];
            string enddate = context.Request["enddate"];
            string inorout = context.Request["inorout"];
            string state = context.Request["state"];
            string organizationtype = context.Request["organizationtype"];
            string userId = context.Request["userId"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
               // sql += " and b.organizationid = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(processnumber))
            {

                sql += " and processnumber = '" + processnumber + "'";
            }

            if (!string.IsNullOrEmpty(begindate))
            {

                sql += " and CONVERT(varchar(20),inoroutdate,23) >= '" + begindate + "'";
            }

            if (!string.IsNullOrEmpty(enddate))
            {

                sql += " and CONVERT(varchar(20),inoroutdate,23) <= '" + enddate + "'";
            }

            if (!string.IsNullOrEmpty(inorout))
            {

                sql += " and inorout = '" + inorout + "'";
            }

            if (!string.IsNullOrEmpty(state))
            {

                sql += " and state = '" + state + "'";
            }

            if (!string.IsNullOrEmpty(organizationtype))
            {

                sql += " and b.organizationtype = '" + organizationtype + "'";
            }
            if (!string.IsNullOrEmpty(userId))
            {

                sql += " and b.organizationid = '" + user.organizationid+ "'";
            }
            try
            {
                Dictionary<string, object> irList = Bll.GetInOutPageList(sql, sort, page, rows, out pcount, out totalcount);



                json = JsonConvert.SerializeObject(irList);
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'" + json + "'}");
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 10获取出入库列表
        private void GetInOutList(HttpContext context)
        {
            string sql = "  "; //and inorout='入库'  state='已完成' and b.organizationtype='2067DC4D-D0D1-4239-880E-9D7BE2EABE07'
            string json = "";
            string organizationid = context.Request["organizationid"];
            string processnumber = context.Request["processnumber"];
            string begindate = context.Request["begindate"];
            string enddate = context.Request["enddate"];
            string inorout = context.Request["inorout"];
            string state = context.Request["state"];
            string organizationtype = context.Request["organizationtype"];
            string userId = context.Request["userId"];
            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
               // sql += " and b.organizationid = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(processnumber))
            {

                sql += " and processnumber = '" + processnumber + "'";
            }

            if (!string.IsNullOrEmpty(begindate))
            {
                sql += " and CONVERT(varchar(20),inoroutdate,23) >= '" + begindate + "'";
            }

            if (!string.IsNullOrEmpty(enddate))
            {
                sql += " and CONVERT(varchar(20),inoroutdate,23) <= '" + enddate + "'";
            }

            if (!string.IsNullOrEmpty(inorout))
            {

                sql += " and CONVERT(varchar(20),inoroutdate,23) > = '" + inorout + "'";
            }

            if (!string.IsNullOrEmpty(state))
            {

                sql += " and state = '" + state + "'";
            }

            if (!string.IsNullOrEmpty(organizationtype))
            {

                sql += " and b.organizationtype = '" + organizationtype + "'";
            }
            if (!string.IsNullOrEmpty(userId))
            {
                sql += " and b.organizationid = '" + user.organizationid + "'";
            }
            try
            {
                List<TBL_DEPARTMENT_INOROUTRECORD> lists = Bll.GetInOutList(sql) as List<TBL_DEPARTMENT_INOROUTRECORD>;
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

        

    }
}