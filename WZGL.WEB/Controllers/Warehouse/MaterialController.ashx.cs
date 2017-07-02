using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IBLL.Warehouse;
using WZGL.MODEL.Warehouse;

namespace WZGL.WEB.Controllers.Warehouse
{
    /// <summary>
    /// MaterialController 的摘要说明
    /// </summary>
    public class MaterialController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式

        #endregion

        IMaterialBLL Bll = BllFactory.GetMaterialBLL();
        IMaterialcategoryBLL cBll = BllFactory.GetCategoryBLL();
        List<TBL_MATERIALCATEGORY> list = new List<TBL_MATERIALCATEGORY>();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "materialid" : context.Request["sort"].ToString();
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
                //判断材料编码是否存在   
               case "isExit": isExit(context); break;


            }
        }

        #region 1.获取材料列表
        /// <summary>
        /// 获取材料列表
        /// </summary>
        /// <param name="context"></param>
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            if (!string.IsNullOrEmpty(categoryid))
            {
                //sql += "  and t.materialcategoryid ='" + categoryid + "'";
                sql += getChildId(categoryid);
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
                List<TBL_MATERIAL> lists = Bll.GetList(sql) as List<TBL_MATERIAL>;
                //json = JsonConvert.SerializeObject(lists);
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
        #endregion

        #region 2.获取材料列表
        /// <summary>
        /// 获取材料列表
        /// </summary>
        /// <param name="context"></param>
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            if (!string.IsNullOrEmpty(categoryid))
            {
               // sql += "  and t.materialcategoryid ='" + categoryid + "'";
                sql += getChildId(categoryid);
             
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

        #region 3.新增材料
        /// <summary>
        /// 新增材料
        /// </summary>
        /// <param name="context"></param>
        private void add(HttpContext context)
        {
            string json = "";
            TBL_MATERIAL model = new TBL_MATERIAL();
            model.materialid = System.Guid.NewGuid().ToString().ToUpper();
            model.materialcategoryid = context.Request["materialcategoryid"];
            model.code = context.Request["code"];
            model.name = context.Request["name"];
            model.standard = context.Request["standard"];
            model.unit = context.Request["unit"];
            model.unitprice =Convert.ToDecimal(context.Request["unitprice"]);
            model.retrievetype = context.Request["retrievetype"];
            model.recovery = Convert.ToDecimal(context.Request["recovery"]);
            model.organizationid = context.Request["organizationid"];
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

        #region 4.修改材料
        /// <summary>
        /// 修改材料
        /// </summary>
        /// <param name="context"></param>
        private void update(HttpContext context)
        {
            string json = "";
            TBL_MATERIAL model = new TBL_MATERIAL();
            model.materialid = context.Request["materialid"];
            model.materialcategoryid = context.Request["materialcategoryid"];
            model.code = context.Request["code"];
            model.name = context.Request["name"];
            model.standard = context.Request["standard"];
            model.unit = context.Request["unit"];
            model.unitprice = Convert.ToDecimal(context.Request["unitprice"]);
            model.retrievetype = context.Request["retrievetype"];
            model.recovery = Convert.ToDecimal(context.Request["recovery"]);
            model.organizationid = context.Request["organizationid"];
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

        #region 5.删除材料
        /// <summary>
        /// 删除材料
        /// </summary>
        /// <param name="context"></param>
        private void delete(HttpContext context)
        {
            string materialid = context.Request["materialid"];
            string json = "";
            string where = " and materialid='" + materialid + "'";
            try
            {
                Bll.Delete(where);
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'删除成功！'}");
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'删除失败！'}");
            }
            //context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 6.获取材料总个数
        /// <summary>
        /// 获取材料总个数
        /// </summary>
        /// <param name="context"></param>
        private void GetCount(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string categoryid = context.Request["categoryid"];
            string name = context.Request["name"];
            string code = context.Request["code"];
            string standard = context.Request["standard"];
            if (!string.IsNullOrEmpty(categoryid))
            {
                //sql += "  and  materialcategoryid ='" + categoryid + "'";
                sql += getChildId(categoryid);
            }
            if (!string.IsNullOrEmpty(name))
            {
                sql += "  and  t.name  like '%" + name + "%'";

            }
            if (!string.IsNullOrEmpty(code))
            {
                sql += "  and   t.code ='" + code + "'";

            }
            if (!string.IsNullOrEmpty(standard))
            {
                sql += "  and   t.standard ='" + standard + "'";

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
                for (int i = 0; i < list.Count; i++)
                {
                    if (list.Count == 1)
                    {
                        sql += " and t.materialcategoryid in ('" + list[i].materialcategoryid + "')";
                    }
                    else
                    {
                        if (i == 0)
                        {
                            sql += " and t.materialcategoryid in ('" + list[i].materialcategoryid + "',";
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

        #region 8.其他
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        #endregion

        #region 9.判断材料编码是否存在
        /// <summary>
        /// 判断材料编码是否存在   
        /// </summary>
        /// <param name="context"></param>
        private void isExit(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string code = context.Request["code"];
            string id = context.Request["id"];
            if (!string.IsNullOrEmpty(code))
            {
                sql += "  and  t.code ='" + code + "'";
            }
        
            try
            {
                List<TBL_MATERIAL> lists = Bll.GetList(sql) as List<TBL_MATERIAL>;
                if (lists.Count > 0)
                {
                    if (lists.Count == 1)
                    {
                        TBL_MATERIAL model = lists[0];
                        if (model.materialid == id)
                        {
                            json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'不存在该材料编码！'}");
                        }
                        else
                        {
                            json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'存在该材料编码！'}");
                        }
                    }
                    else
                    {
                        json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'存在该材料编码！'}");
                    }
                }
                else
                {
                    json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'不存在该材料编码！'}");
                }
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