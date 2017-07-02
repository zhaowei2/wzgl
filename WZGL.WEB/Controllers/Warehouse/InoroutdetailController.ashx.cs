using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IDAO.Warehouse;
using WZGL.MODEL.Warehouse;

namespace WZGL.WEB.Controllers.Warehouse
{
    /// <summary>
    /// InoroutdetailController 的摘要说明
    /// </summary>
    public class InoroutdetailController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        #endregion

        IInoroutdetailBLL Bll = BllFactory.GetDetailBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "amountmoney desc" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
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
            string sql = "  "; //+当前用户的部门编码
            string processnumber = context.Request["processnumber"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
            }
            try
            {
                List<TBL_DEPARTMENT_INOROUTDETAIL> lists = Bll.GetList(sql) as List<TBL_DEPARTMENT_INOROUTDETAIL>;
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
            string sql = "  "; //+当前用户的部门编码  t.organizationid=''
            int pcount = 0;
            int totalcount = 0;
            string processnumber = context.Request["processnumber"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
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
            TBL_DEPARTMENT_INOROUTDETAIL model = new TBL_DEPARTMENT_INOROUTDETAIL();
            model.department_inoroutdetailid = System.Guid.NewGuid().ToString().ToUpper();
            model.department_inoroutrecordid = context.Request["department_inoroutrecordid"];
            model.materialid = context.Request["materialid"];
            model.num = Convert.ToDecimal(context.Request["num"]);
            model.unitprice = Convert.ToDecimal(context.Request["unitprice"]);
            model.amountmoney = Convert.ToDecimal(context.Request["amountmoney"]);
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
            TBL_DEPARTMENT_INOROUTDETAIL model = new TBL_DEPARTMENT_INOROUTDETAIL();
            model.department_inoroutdetailid = context.Request["department_inoroutdetailid"];
            model.department_inoroutrecordid = context.Request["department_inoroutrecordid"];
            model.materialid = context.Request["materialid"];
            model.num = Convert.ToDecimal(context.Request["num"]);
            model.unitprice = Convert.ToDecimal(context.Request["unitprice"]);
            model.amountmoney = Convert.ToDecimal(context.Request["amountmoney"]);
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
            string sql = "  "; //+当前用户的部门编码  t.organizationid=''
            string processnumber = context.Request["processnumber"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and t.processnumber ='" + processnumber + "'";
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
    }
}