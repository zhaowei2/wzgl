using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IBLL.System;
using WZGL.MODEL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// Coalface 的摘要说明
    /// </summary>
    public class Coalface : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        int Pcount = 0;//返回的分页数   
        int Prowcount = 0;//返回的记录数  

        readonly ILog logger = LogManager.GetLogger(typeof(OrganizationController));
        #endregion

        ICoalfaceBLL coalBll = BllFactory.GetCoalfaceBLL();
        ICoalfacegroupBLL groupBll = BllFactory.GetCoalfacegroupBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "Coalfacecode" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];
            //context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
            switch (action)
            {
                //新增数据
                case "add":
                    Add(context); break;
                //修改数据
                case "edit":
                    Edit(context); break;
                //获取数据列表
                case "getPageList":
                    getPageList(context); break;
                //删除数据
                case "del":
                    Del(context); break;
                case "getList":
                    getList(context); break;
                case "savefz":
                    savefz(context); break;
                case "getfzList":
                    getfzList(context);
                    break;
                case "delfz":
                    delfz(context);
                    break;
            }
        }

        #region 1-------------------新增数据
        private void Add(HttpContext context)
        {
            string Coalfacecode = context.Request["Coalfacecode"];
            string Groupid = context.Request["Groupid"];
            string Mininglength = context.Request["Mininglength"];
            string Coalthick = context.Request["Coalthick"];
            string Mininghigh = context.Request["Mininghigh"];
            string Dip = context.Request["Dip"];
            string Pc = context.Request["Pc"];
            string Monthlyoutputlevel = context.Request["Monthlyoutputlevel"];

            string json = "";
            string coalid = System.Guid.NewGuid().ToString().ToUpper();

            TBL_COALFACE model = new TBL_COALFACE();

            model.Coalfaceid = coalid;
            model.Groupid = Groupid;
            model.Coalfacecode = Coalfacecode;
            model.Mininglength = decimal.Parse(Mininglength);
            model.Coalthick = decimal.Parse(Coalthick);
            model.Mininghigh = decimal.Parse(Mininghigh);
            model.Dip = decimal.Parse(Dip);
            model.Pc = decimal.Parse(Pc);
            model.Monthlyoutputlevel = decimal.Parse(Monthlyoutputlevel);
            //user.LOGINNAME = loginname;
            //user.PASSWORD = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");
            //user.MENUSID = mids;
            try
            {
                bool re = coalBll.Insert(model);
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
                json = "{\"IsSuccess\":\"false\",\"Message\":\"添加出错" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 2-------------------修改数据
        private void Edit(HttpContext context)
        {
            string Coalfaceid = context.Request["Coalfaceid"];
            string Coalfacecode = context.Request["Coalfacecode"];
            string Groupid = context.Request["Groupid"];
            string Mininglength = context.Request["Mininglength"];
            string Coalthick = context.Request["Coalthick"];
            string Mininghigh = context.Request["Mininghigh"];
            string Dip = context.Request["Dip"];
            string Pc = context.Request["Pc"];
            string Monthlyoutputlevel = context.Request["Monthlyoutputlevel"];

            string json = "";


            TBL_COALFACE model = new TBL_COALFACE();

            model.Coalfaceid = Coalfaceid;
            model.Groupid = Groupid;
            model.Coalfacecode = Coalfacecode;
            model.Mininglength = decimal.Parse(Mininglength);
            model.Coalthick = decimal.Parse(Coalthick);
            model.Mininghigh = decimal.Parse(Mininghigh);
            model.Dip = decimal.Parse(Dip);
            model.Pc = decimal.Parse(Pc);
            model.Monthlyoutputlevel = decimal.Parse(Monthlyoutputlevel);
            //user.LOGINNAME = loginname;
            //user.PASSWORD = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");
            //user.MENUSID = mids;
            try
            {
                bool re = coalBll.Update(model);
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
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 3-------------------获取数据
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "";// "  and a.username <>'admin' ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string Coalfacecode = context.Request["Coalfacecode"];
            if (!string.IsNullOrEmpty(Coalfacecode))
            {
                sql += " and  Coalfacecode like '%" + Coalfacecode + "%' ";
            }

            //  List<TBL_COALFACE> list = coalBll.GetPageList(sql, sort + " " + order, page, rows, out Pcount, out Prowcount).ToList<TBL_COALFACE>();

            try
            {
                Dictionary<string, object> lists = coalBll.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
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

            //3.json 返回页面
            //json = JsonConvert.SerializeObject(list);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        #endregion

        #region 4-------------------删除数据
        private void Del(HttpContext context)
        {
            string sql = "", json = string.Empty;
            try
            {
                string Coalfaceid = context.Request["Coalfaceid"];

                bool re = coalBll.Delete(" Coalfaceid= '" + Coalfaceid + "'");
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
            //3.json 返回页面
            //json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        #endregion

        #region 5-------------------获取数据
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = " 1=1";

            try
            {
                List<TBL_COALFACE> lists = coalBll.GetList(sql) as List<TBL_COALFACE>;
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

        #region 6---------------保存分组
        private void savefz(HttpContext context)
        {
            //1.获取参数
            string groupcode = context.Request["groupcode"].ToString();
            string json = "";
            MODEL.System.TBL_COALFACEGROUP group = new TBL_COALFACEGROUP();
            group.groupid = Guid.NewGuid().ToString().ToUpper();
            group.groupcode = groupcode;
            if (groupBll.Insert(group))
            {
                json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"添加失败！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        #endregion

        #region 7-----------获取分组数据
        private void getfzList(HttpContext context)
        {
            string json = "";
            IList<MODEL.System.TBL_COALFACEGROUP> groupList = groupBll.GetList(" 1=1 ");
            json = JsonConvert.SerializeObject(groupList);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        #endregion

        #region 8-----------删除分组
        private void delfz(HttpContext context)
        {
            //1.获取参数
            string groupid = context.Request["groupid"].ToString();
            string json = "";
            //2.删除数据
            if (groupBll.Delete(" groupid='"+groupid+"'"))
            {
                 json = "{\"IsSuccess\":\"true\",\"Message\":\"删除成功！\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败！\"}";
            }
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