using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.BLL.System;
using WZGL.IBLL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// OtherprojectController 的摘要说明
    /// </summary>
    public class OtherprojectController : IHttpHandler
    {

        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private IOtherprojectBLL BLL = BllFactory.GetOtherprojectBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " otherprojecttypeid " : context.Request["sort"].ToString();
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
                case "Del":
                    Delete(context);
                    break;
                case "Add":
                    Add(context);
                    break;
                case "Edit":
                    Edit(context);
                    break;
                default:
                    break;

            }
        }

        public void getList(HttpContext context)
        {
            string json = "";
            string sql = "";
            //1.获取参数
            string otherprojecttypeid = context.Request["otherprojecttypeid"].ToString();
            string otherprojectname = context.Request["otherprojectname"].ToString();
            if (!string.IsNullOrEmpty(otherprojecttypeid) && otherprojecttypeid != "全部")
            {
                sql += " and  otherprojecttypeid='" + otherprojecttypeid + "'";
            }
            if (!string.IsNullOrEmpty(otherprojectname))
            {
                sql += " and otherprojectname like '%" + otherprojectname + "%'";
            }
            try
            {
                int count = 0;
                int tocount = 0;
                IList<MODEL.System.TBL_OTHERPROJECT> projectList= BLL.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
                if (projectList.Count > 0)
                {
                    json = JsonConvert.SerializeObject(projectList);
                }
                else
                {
                    json = JsonConvert.SerializeObject(json);
                }
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
        public void getCount(HttpContext context)
        {

            string json = "";
            string sql = "";
            //1.获取参数
            string otherprojecttypeid = context.Request["otherprojecttypeid"].ToString();
            string otherprojectname = context.Request["otherprojectname"].ToString();
            if (!string.IsNullOrEmpty(otherprojecttypeid) && otherprojecttypeid != "全部")
            {
                sql += " and  otherprojecttypeid='" + otherprojecttypeid + "'";
            }
            if (!string.IsNullOrEmpty(otherprojectname))
            {
                sql += " and otherprojectname like '%" + otherprojectname + "%'";
            }
            try
            {
                int count = BLL.GetCount(sql);
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
        public void Delete(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string otherprojectid = context.Request["otherprojectid"].ToString();
            string sql = "";
            try
            {
                if (!string.IsNullOrEmpty(otherprojectid))
                {
                    sql += " otherprojectid='" + otherprojectid + "'";
                }
                if (BLL.Delete(sql))
                {
                    json = "{IsSuccess:true,Message:'删除成功'}";
                }
                else
                {
                    json = "{IsSuccess:false,Message:'删除失败'}";
                }
            }
            catch (Exception)
            {

                throw;
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        public void Add(HttpContext context)
        {
            string json = "";
            //1.获取参数
            WZGL.MODEL.System.TBL_OTHERPROJECT project = new MODEL.System.TBL_OTHERPROJECT();
            project.otherprojectid = Guid.NewGuid().ToString().ToUpper();
            project.otherprojectname = context.Request["otherprojectname"].ToString();
            project.otherprojecttypeid = context.Request["otherprojecttypeid"].ToString();
            project.projectdescription = context.Request["projectdescription"].ToString();
            try
            {
                if (BLL.Insert(project))
                {
                    json = "{IsSuccess:true,Message:'新增成功'}";
                }
                else
                {
                    json = "{IsSuccess:false,Message:'新增失败'}";
                }
            }
            catch (Exception)
            {

                throw;
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        public void Edit(HttpContext context)
        {
            string json = "";
            //1.获取参数
            WZGL.MODEL.System.TBL_OTHERPROJECT project = new MODEL.System.TBL_OTHERPROJECT();
            project.otherprojectid = context.Request["otherprojectid"].ToString();
            project.otherprojectname = context.Request["otherprojectname"].ToString();
            project.otherprojecttypeid = context.Request["otherprojecttypeid"].ToString();
            project.projectdescription = context.Request["projectdescription"].ToString();
            try
            {
                if (BLL.Update(project))
                {
                    json = "{IsSuccess:true,Message:'编辑成功'}";
                }
                else
                {
                    json = "{IsSuccess:false,Message:'编辑失败'}";
                }
            }
            catch (Exception)
            {

                throw;
            }
            json = JsonConvert.SerializeObject(json);
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