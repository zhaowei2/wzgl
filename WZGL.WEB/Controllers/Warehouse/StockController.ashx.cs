using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using WZGL.BLL;
using WZGL.IBLL.Warehouse;
using WZGL.MODEL.System;
using WZGL.MODEL.Warehouse;

namespace WZGL.WEB.Controllers.Warehouse
{
    /// <summary>
    /// StockController 的摘要说明
    /// </summary>
    public class StockController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        #endregion

        IStockBLL Bll = BllFactory.GetStockBLL();
        IMaterialcategoryBLL cBll = BllFactory.GetCategoryBLL();
        List<TBL_MATERIALCATEGORY> list = new List<TBL_MATERIALCATEGORY>();
        TBL_USER user = new TBL_USER();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "department_stockid desc" : context.Request["sort"].ToString();
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
                //统计
                case "getStockByCategory": GetStockByCategory(context); break;
                case "getStockByOrg": GetStockByOrg(context); break;
                case "getStockTJ": GetStockTJ(context); break; //
            
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
            string sql = "  "; //+当前用户的部门编码  t.organizationid=''
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            if (!string.IsNullOrEmpty(categoryid))
            {
                sql += "  and t.materialcategoryid ='" + categoryid + "'";
            }
            if (!string.IsNullOrEmpty(name))
            {
                sql += "  and  t.name  like '%" + name + "%'";
            }
            if (!string.IsNullOrEmpty(code))
            {
                sql += "  and  t.code ='" + code + "'";
            }
            if (!string.IsNullOrEmpty(standard))
            {
                sql += "  and  t.standard ='" + standard + "'";

            }
            try
            {
                List<TBL_DEPARTMENT_STOCK> lists = Bll.GetList(sql) as List<TBL_DEPARTMENT_STOCK>;
                json = JsonConvert.SerializeObject(lists);
                int count = lists.Count;
                // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
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

        private void GetStockByCategory(HttpContext context)
        {
            string json = string.Empty;
            //string sql = "  "; //+当前用户的部门编码  t.organizationid=''   
            string organizationid = context.Request["organizationid"];
            string organizationtype = context.Request["organizationtype"];
            string parentcategoryid = context.Request["parentcategoryid"];
            try
            {
                List<TBL_DEPARTMENT_STOCK> lists = Bll.GetStockByCategory(parentcategoryid, organizationid, organizationtype) as List<TBL_DEPARTMENT_STOCK>;
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

        private void GetStockByOrg(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  "; //+当前用户的部门编码  t.organizationid=''
            string materialid = context.Request["materialid"];
            string organizationtype = context.Request["organizationtype"];
            string parentcategoryid = context.Request["parentcategoryid"];
            if (!string.IsNullOrEmpty(materialid))
            {
                sql += "  and t.materialid ='" + materialid + "'";
            }
            if (!string.IsNullOrEmpty(organizationtype))
            {
                sql += "  and b.organizationtype ='" + organizationtype + "'";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
               // sql += "  and m.parentcategoryid ='" + parentcategoryid + "'";
                sql += getChildId(parentcategoryid);
            }
            try
            {
                List<TBL_DEPARTMENT_STOCK> lists = Bll.GetStockByOrg(sql) as List<TBL_DEPARTMENT_STOCK>;
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
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            //------------------------------//
            string organizationid = context.Request["organizationid"];
            string organizationtype = context.Request["organizationtype"];
            string parentcategoryid = context.Request["parentcategoryid"];
            string materialname = context.Request["materialname"];

            string userId = context.Request["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                sql += "  and a.organizationid ='" + user.organizationid + "'";
            }


            if (!string.IsNullOrEmpty(categoryid))
            {
                sql += "  and t.materialcategoryid ='" + categoryid + "'";
            }
            if (!string.IsNullOrEmpty(name))
            {
                sql += "  and  t.name  like '%" + name + "%'";
            }
            if (!string.IsNullOrEmpty(code))
            {
                sql += "  and  t.code  like'%" + code + "%'";
            }
            if (!string.IsNullOrEmpty(standard))
            {
                sql += "  and  t.standard ='" + standard + "'";
            }
            //--------------------------------
            if (!string.IsNullOrEmpty(organizationid))
            {
                sql += "  and b.organizationid ='" + organizationid + "'";
            }
            if (!string.IsNullOrEmpty(organizationtype))
            {
                sql += "  and  b.organizationtype ='" + organizationtype + "'";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
               // sql += "  and m.parentcategoryid ='" + parentcategoryid + "'";
                sql+=  getChildId(parentcategoryid);
            }
            if (!string.IsNullOrEmpty(materialname))
            {
                sql += "  and t.name ='" + materialname + "'";
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
            TBL_DEPARTMENT_STOCK model = new TBL_DEPARTMENT_STOCK();
            model.department_stockid = System.Guid.NewGuid().ToString().ToUpper();
            model.materialid = context.Request["materialid"];
            model.organizationid = context.Request["organizationid"];
            model.num =Convert.ToInt32(context.Request["num"]);
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
            TBL_DEPARTMENT_STOCK model = new TBL_DEPARTMENT_STOCK();
            model.department_stockid = context.Request["department_stockid"];
            model.materialid = context.Request["materialid"];
            model.organizationid = context.Request["organizationid"];
            model.num = Convert.ToInt32(context.Request["num"]);
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
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            //------------------------------//
            string organizationid = context.Request["organizationid"];
            string organizationtype = context.Request["organizationtype"];
            string parentcategoryid = context.Request["parentcategoryid"];
            string materialname = context.Request["materialname"];

            string userId = context.Request["userId"];

            if (!string.IsNullOrEmpty(userId))
            {
                sql += "  and a.organizationid ='" + user.organizationid + "'";
            }

            if (!string.IsNullOrEmpty(categoryid))
            {
                sql += "  and t.materialcategoryid ='" + categoryid + "'";
            }
            if (!string.IsNullOrEmpty(name))
            {
                sql += "  and  t.name  like '%" + name + "%'";

            }
            if (!string.IsNullOrEmpty(code))
            {
                sql += "  and  t.code ='" + code + "'";

            }
            if (!string.IsNullOrEmpty(standard))
            {
                sql += "  and  t.standard ='" + standard + "'";

            }
            //--------------------------------
            if (!string.IsNullOrEmpty(organizationid))
            {
                sql += "  and b.organizationid ='" + organizationid + "'";
            }
            if (!string.IsNullOrEmpty(organizationtype))
            {
                sql += "  and  b.organizationtype ='" + organizationtype + "'";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
               // sql += "  and m.parentcategoryid ='" + parentcategoryid + "'";
                sql += getChildId(parentcategoryid);
            }
            if (!string.IsNullOrEmpty(materialname))
            {
                sql += "  and t.name ='" + materialname + "'";
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

        #region 7.获取材料类别的子节点的ID
        /// <summary>
        /// 获取材料类别的子节点
        /// </summary>
        /// <param name="context"></param>
        private string getChildId(string parentcategoryid)
        {
            string json = string.Empty;
            string sql = "  ";
           
            try
            {
                List<TBL_MATERIALCATEGORY> lists = cBll.GetList(sql) as List<TBL_MATERIALCATEGORY>;
                //获取父级根节点
                List<TBL_MATERIALCATEGORY> poList = new List<TBL_MATERIALCATEGORY>();
                if (!string.IsNullOrEmpty(parentcategoryid))
                {
                    poList = lists.Where(o => (o.materialcategoryid == parentcategoryid)).ToList<TBL_MATERIALCATEGORY>();
                }
                foreach (TBL_MATERIALCATEGORY category in poList)
                {
                    list.Add(category);
                    getTree(lists, category);
                }
            //    string  max = list.Max(x => x.matlevel); //找出最大的
                //list = list.Where(o => (o.matlevel == max)).ToList<TBL_MATERIALCATEGORY>();
                for (int i = 0; i < list.Count; i++)
                {
                    if ( list.Count==1)
                    {
                        sql += " and m.materialcategoryid in ('" + list[i].materialcategoryid + "')";
                    }
                    else
                    {
                        if (i == 0)
                        {
                            sql += " and m.materialcategoryid in ('" + list[i].materialcategoryid + "',";
                        }
                        else if (i == list.Count - 1)
                        {
                            sql += "'" + list[i].materialcategoryid + "')";
                        }
                        else
                        {
                            sql += "'" + list[i].materialcategoryid + "',";
                        }  
                    }
                 
                }
            }
            catch
            {
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                sql = "";
            }
            return sql;

        }

        /// <summary>
        /// 获取材料类别的树型结构
        /// </summary>
        /// <param name="toList">材料类别列表</param>
        /// <param name="to">材料类别</param>
        public void getTree(List<TBL_MATERIALCATEGORY> toList, TBL_MATERIALCATEGORY category)
        {
            //获取子集节点
            List<TBL_MATERIALCATEGORY> coList = toList.Where(o => o.parentcategoryid == category.materialcategoryid).ToList<TBL_MATERIALCATEGORY>();
            if (coList.Count > 0)
            {
                //category.children = coList;
                foreach (TBL_MATERIALCATEGORY toc in coList)
                {
                    list.Add(toc);
                    getTree(toList, toc);
                }
            }

        }
        #endregion

        #region 8.获取库存统计数据
        public void GetStockTJ(HttpContext context)
        {
            string json = "";
            try
            {
                IList<MODEL.Warehouse.TBL_DEPARTMENT_STOCK> stockList = Bll.GetStockTJ("");
                json = JsonConvert.SerializeObject(stockList);
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

        #region 9.其他

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