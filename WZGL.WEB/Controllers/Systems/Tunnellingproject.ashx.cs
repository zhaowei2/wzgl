using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.COMMON;
using WZGL.IBLL.System;
using WZGL.MODEL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// tunnellingproject 的摘要说明
    /// </summary>
    public class Tunnellingproject : IHttpHandler
    {
        #region ------------------------变量------------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        readonly ILog logger = LogManager.GetLogger(typeof(OrganizationController));
        ITunnellingprojectBLL bll = BllFactory.GetTunnellingprojectBLL();

        #endregion
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " Tunnellingprojectname " : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
            string action = context.Request["action"];
            switch (action)
            {
                case "getPageList": getPageList(context); break;
                case "add": add(context); break;
                case "edit": edit(context); break;
                case "del": del(context); break;
                case "getList": getList(context); break;
            }
        }

        /// <summary>
        /// 获取分页列表数据
        /// </summary>
        /// <param name="context"></param>
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "";// "  and a.username <>'admin' ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string Tunnellingprojectname = context.Request["Tunnellingprojectname"];
            // string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            //string username = context.Request["username"];
            //string role = context.Request["role"];
            //string organizationname = context.Request["organizationname"];
            //string job = context.Request["job"];

            if (!string.IsNullOrEmpty(Tunnellingprojectname))
            {
                sql += " and  Tunnellingprojectname like '%" + Tunnellingprojectname + "%' ";
            }

            //if (!string.IsNullOrEmpty(role))
            //{
            //    sql += " and  d.roleid='" + role + "' ";
            //}

            //if (!string.IsNullOrEmpty(organizationname))
            //{
            //    sql += " and  b.organizationname  like '%" + organizationname + "%' ";
            //}

            //if (!string.IsNullOrEmpty(job))
            //{
            //    sql += " and  a.job  like '%" + job + "%' ";
            //}

            try
            {
                Dictionary<string, object> lists = bll.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
                if (string.IsNullOrEmpty(type))
                {
                    json = JsonConvert.SerializeObject(lists);
                }
                else
                {
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + totalcount + "}";
                }
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

        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="context"></param>
        private void add(HttpContext context)
        {
            string json = string.Empty;
            try
            {
                TBL_TUNNELLINGPROJECT model = new TBL_TUNNELLINGPROJECT();
                model.Tunnellingprojectid = ComFunction.GetId();
                model.Tunnellingprojectname = context.Request["Tunnellingprojectname"];
                model.Section = context.Request["Section"];
                model.Coalrocktype = context.Request["Coalrocktype"];
                model.Supportform = context.Request["Supportform"];
                model.Tunneltype = context.Request["Tunneltype"];
                model.Tunnelnature = context.Request["Tunnelnature"];
                model.Designamount = decimal.Parse(context.Request["Tunnellingprojectname"]);
                bool re = bll.Insert(model);
                if (re)
                {
                    json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"添加失败！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"添加出错"+ex.ToString()+"！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="context"></param>
        private void edit(HttpContext context)
        {
            string json = string.Empty;
            try
            {
                TBL_TUNNELLINGPROJECT model = new TBL_TUNNELLINGPROJECT();
                model.Tunnellingprojectid = context.Request["Tunnellingprojectid"];
                model.Tunnellingprojectname = context.Request["Tunnellingprojectname"];
                model.Section = context.Request["Section"];
                model.Coalrocktype = context.Request["Coalrocktype"];
                model.Supportform = context.Request["Supportform"];
                model.Tunneltype = context.Request["Tunneltype"];
                model.Tunnelnature = context.Request["Tunnelnature"];
                model.Designamount = decimal.Parse(context.Request["Designamount"]);
                bool re = bll.Update(model);
                if (re)
                {
                    json = "{\"IsSuccess\":\"true\",\"Message\":\"修改成功！\"}";
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"修改失败！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"修改出错" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 删除
        /// </summary>
        /// <param name="context"></param>
        private void del(HttpContext context)
        {
            string json = string.Empty;
            try
            {

                string Tunnellingprojectid = context.Request["Tunnellingprojectid"];

                bool re = bll.Delete(" Tunnellingprojectid= '" + Tunnellingprojectid + "'");
                if (re)
                {
                    json = "{\"IsSuccess\":\"true\",\"Message\":\"删除成功！\"}";
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"删除出错" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        #region 5-------------------获取数据
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = " 1=1";

            try
            {
                List<TBL_TUNNELLINGPROJECT> lists = bll.GetList(sql) as List<TBL_TUNNELLINGPROJECT>;
                json = JsonConvert.SerializeObject(lists);

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            //3.json 返回页面
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        #endregion
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}