using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// Singleproject 的摘要说明
    /// </summary>
    public class Singleproject : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private WZGL.BLL.System.SingleprojectBLL projectBll = new BLL.System.SingleprojectBLL();
        private WZGL.BLL.System.DictitemBLL itemBll = new BLL.System.DictitemBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "singleprojecttypeid" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];
            switch (action)
            {
                //获取用户信息
                case "getList":
                    getList(context);
                    break;
                case "getType":
                    getType(context);
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
                case "getListById":
                    getListById(context);
                    break;
                default:
                    break;
            }
        }

        private void Add(HttpContext context)
        {
            string json = "";
            //1.获取参数
            WZGL.MODEL.System.TBL_SINGLEPROJECT project = new MODEL.System.TBL_SINGLEPROJECT();
            project.singleprojectid = Guid.NewGuid().ToString().ToUpper();
            project.remark = context.Request["remark"].ToString();
            project.singleprojectname = context.Request["singleprojectname"].ToString();
            project.singleprojecttypeid = context.Request["singleprojecttypeid"].ToString();
            try
            {
                if (projectBll.Insert(project))
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

        private void Edit(HttpContext context)
        {

            string json = "";
            //1.获取参数
            WZGL.MODEL.System.TBL_SINGLEPROJECT project = new MODEL.System.TBL_SINGLEPROJECT();
            project.singleprojectid = context.Request["singleprojectid"].ToString();
            project.remark = context.Request["remark"].ToString();
            project.singleprojectname = context.Request["singleprojectname"].ToString();
            project.singleprojecttypeid = context.Request["singleprojecttypeid"].ToString();
            try
            {
                if (projectBll.Update(project))
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

        private void getType(HttpContext context)
        {
            string json = "";
            string dictname = context.Request["dictname"].ToString();
            string sql = " and dictid=(select dictid from tbl_dict where dictname='" + dictname + "')";
            IList<MODEL.System.TBL_DICTITEM> itemList = itemBll.GetList(sql);
            if (itemList.Count > 0)
            {
                json = JsonConvert.SerializeObject(itemList);
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        private void getCount(HttpContext context)
        {
            string json = "";
            string sql = "";
            //1.获取参数
            string singleprojecttypeid = context.Request["singleprojecttypeid"].ToString();
            string singleprojectname = context.Request["singleprojectname"].ToString();
            if (!string.IsNullOrEmpty(singleprojecttypeid) && singleprojecttypeid != "全部")
            {
                sql += " and  singleprojecttypeid='" + singleprojecttypeid + "'";
            }
            if (!string.IsNullOrEmpty(singleprojectname))
            {
                sql += " and singleprojectname like '%" + singleprojectname + "%'";
            }
            try
            {
                int count = projectBll.GetCount(sql);
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
        private void getList(HttpContext context)
        {
            //1.获取前端的参数
            string singleprojecttypeid = context.Request["singleprojecttypeid"].ToString();
            string singleprojectname = context.Request["singleprojectname"].ToString();
            string sql = "";
            string json = "";
            if (!string.IsNullOrEmpty(singleprojecttypeid) && singleprojecttypeid != "全部")
            {
                sql += " and  singleprojecttypeid='" + singleprojecttypeid + "'";
            }
            if (!string.IsNullOrEmpty(singleprojectname))
            {
                sql += " and singleprojectname like '%" + singleprojectname + "%'";
            }
            int count = 0;
            int tocount = 0;
            Dictionary<string, object> obj = projectBll.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
            if (obj.Count > 0)
            {
                json = JsonConvert.SerializeObject(obj);
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void Delete(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string singleprojectid = context.Request["singleprojectid"].ToString();
            string sql = "";
            try
            {
                if (!string.IsNullOrEmpty(singleprojectid))
                {
                    sql += " singleprojectid='" + singleprojectid + "'";
                }
                if (projectBll.Delete(sql))
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


        private void getListById(HttpContext context)
        {
            //1.获取前端的参数
            string singleprojecttypeid = context.Request["singleprojecttypeid"].ToString();
            string singleprojectname = context.Request["singleprojectname"].ToString();
            string sql = "";
            string json = "";
            if (!string.IsNullOrEmpty(singleprojecttypeid) && singleprojecttypeid != "全部")
            {
                sql += " and  singleprojecttypeid='" + singleprojecttypeid + "'";
            }
            if (!string.IsNullOrEmpty(singleprojectname))
            {
                sql += " and singleprojectname like '%" + singleprojectname + "%'";
            }
            IList<MODEL.System.TBL_SINGLEPROJECT> projectList = projectBll.GetList(sql);
            if (projectList.Count > 0)
            {
                json = JsonConvert.SerializeObject(projectList);
            }
            else
            {
                json = JsonConvert.SerializeObject(json);
            }
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