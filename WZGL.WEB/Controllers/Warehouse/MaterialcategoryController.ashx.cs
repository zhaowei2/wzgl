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
    /// MaterialcategoryController 的摘要说明
    /// </summary>
    public class MaterialcategoryController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        #endregion

        IMaterialcategoryBLL Bll = BllFactory.GetCategoryBLL();
        IMaterialBLL mBll = BllFactory.GetMaterialBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "categoryname" : context.Request["sort"].ToString();
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
                //获取材料类别的子节点
                case "getChild": getChild(context); break;
                //判断同级目录下是否重名
                case "isExit": isExit(context); break;
            }
        }

        #region 1.获取材料类别列表
        /// <summary>
        /// 获取材料类别列表
        /// </summary>
        /// <param name="context"></param>
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string categoryname = context.Request["categoryname"];
            string parentcategoryid = context.Request["parentcategoryid"];
            try
            {
                List<TBL_MATERIALCATEGORY> lists = Bll.GetList(sql) as List<TBL_MATERIALCATEGORY>;
                //获取父级根节点
                List<TBL_MATERIALCATEGORY> poList = new List<TBL_MATERIALCATEGORY>();
                if (!string.IsNullOrEmpty(parentcategoryid))
                {
                    poList = lists.Where(o => (o.materialcategoryid == parentcategoryid)).ToList<TBL_MATERIALCATEGORY>();
                }
                if (!string.IsNullOrEmpty(categoryname))
                {
                   // sql += "  and categoryname like '%" + categoryname + "%' ";
                    poList = lists.Where(o => (o.categoryname.Contains(categoryname))).ToList<TBL_MATERIALCATEGORY>();
                }
                if (string.IsNullOrEmpty(categoryname) && string.IsNullOrEmpty(parentcategoryid))
                {
                    poList = lists.Where(o => o.parentcategoryid == "0").ToList<TBL_MATERIALCATEGORY>();
                }
              
                foreach (TBL_MATERIALCATEGORY category in poList)
                {
                    getTree(lists, category);
                }
                json = JsonConvert.SerializeObject(poList);
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
              // json = "{\"IsSuccess\":\"false\",\"Count\":0}";
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        /// <summary>
        /// 获取材料类别的树型结构
        /// </summary>
        /// <param name="toList">材料类别列表</param>
        /// <param name="to">材料类别</param>
        public void getTree(List<TBL_MATERIALCATEGORY> toList, TBL_MATERIALCATEGORY category)
        {
            //获取子集节点
            List<TBL_MATERIALCATEGORY> coList = toList.Where(o => o.parentcategoryid== category.materialcategoryid).ToList<TBL_MATERIALCATEGORY>();

            if (coList.Count > 0)
            {
                category.children = coList;
                foreach (TBL_MATERIALCATEGORY toc in coList)
                {
                    getTree(toList, toc);
                }
            }

        }
        #region 2.获取材料类别列表
        /// <summary>
        /// 获取材料类别列表
        /// </summary>
        /// <param name="context"></param>
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string categoryname = context.Request["categoryname"];
            string parentcategoryid = context.Request["parentcategoryid"];
            if (!string.IsNullOrEmpty(categoryname))
            {
                sql += "  and categoryname like '%" + categoryname + "%' ";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
                sql += "  and parentcategoryid ='" + parentcategoryid + "'";
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

        #region 3.新增材料类别
        /// <summary>
        /// 新增材料类别
        /// </summary>
        /// <param name="context"></param>
        private void add(HttpContext context)
        {
            string json = "";
            TBL_MATERIALCATEGORY model = new TBL_MATERIALCATEGORY();
            model.materialcategoryid = System.Guid.NewGuid().ToString().ToUpper();
            model.parentcategoryid = context.Request["parentcategoryid"];
            model.categoryname = context.Request["categoryname"];
            model.matlevel = context.Request["level"];
            try
            {
                Bll.Add(model);
                json = "{IsSuccess:'true',Message:'保存成功！',id:'" + model.materialcategoryid + "'}";
            }
            catch
            {
                json = "{IsSuccess:'false',Message:'保存失败！'}";
            }
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 4.修改材料类别
        /// <summary>
        /// 修改材料类别
        /// </summary>
        /// <param name="context"></param>
        private void update(HttpContext context)
        {
            string json = "";
            TBL_MATERIALCATEGORY model = new TBL_MATERIALCATEGORY();
            model.materialcategoryid = context.Request["materialcategoryid"];
            model.parentcategoryid =  context.Request["parentcategoryid"];
            model.categoryname = context.Request["categoryname"];
            model.matlevel = context.Request["level"];
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

        #region 5.删除材料类别
        /// <summary>
        /// 删除材料类别
        /// </summary>
        /// <param name="context"></param>
        private void delete(HttpContext context)
        {
            string materialcategoryid = context.Request["materialcategoryid"];
            string json = "";
            string where = " materialcategoryid='" + materialcategoryid + "'";
            try
            {
                List<TBL_MATERIALCATEGORY> list = Bll.GetList(" and parentcategoryid='" + materialcategoryid + "' ").ToList<TBL_MATERIALCATEGORY>();
                List<TBL_MATERIAL> listm = mBll.GetList(" and c.materialcategoryid='" + materialcategoryid + "' ").ToList<TBL_MATERIAL>();
                if (list.Count > 0)
                 {
                     json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'此材料类别有子级不可删除！'}");
                 }
                else if (listm.Count > 0)
                {
                //  json = "{IsSuccess:'false',Message:'保存失败！'}";
                    json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'此材料类别存在材料编码不可删除！'}");
                }
                 else
                 {
                     Bll.Delete(where);
                     json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'删除成功！'}");
                 }
            }
            catch
            {
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'删除失败！'}");
            }
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 6.获取材料类别总个数
        /// <summary>
        /// 获取材料类别总个数
        /// </summary>
        /// <param name="context"></param>
        private void GetCount(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string categoryname = context.Request["categoryname"];
            string parentcategoryid = context.Request["parentcategoryid"];
            if (!string.IsNullOrEmpty(categoryname))
            {
                sql += "  and categoryname like '%" + categoryname + "%' ";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
                sql += "  and parentcategoryid ='" + parentcategoryid + "'";
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

        #region 7.获取材料类别的子节点
        /// <summary>
        /// 获取材料类别的子节点
        /// </summary>
        /// <param name="context"></param>
        private void getChild(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string parentcategoryid = context.Request["parentcategoryid"];
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
                sql += "  and parentcategoryid ='" + parentcategoryid + "'";
            }
            try
            {
                List<TBL_MATERIALCATEGORY> lists = Bll.GetList(sql) as List<TBL_MATERIALCATEGORY>;
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

        #region 8.判断同级目录下是否重名
        /// <summary>
        /// 获取材料类别列表
        /// </summary>
        /// <param name="context"></param>
        private void isExit(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string categoryname = context.Request["categoryname"];
            string parentcategoryid = context.Request["parentcategoryid"];
            string id = context.Request["id"];
            if (!string.IsNullOrEmpty(categoryname))
            {
                sql += "  and  categoryname = '" + categoryname + "'";
            }
            if (!string.IsNullOrEmpty(parentcategoryid))
            {
                sql += "  and   parentcategoryid ='" + parentcategoryid + "'";
            }
            try
            {
                List<TBL_MATERIALCATEGORY> lists = Bll.GetList(sql) as List<TBL_MATERIALCATEGORY>;
                if (lists.Count> 0)
                {
                    if (lists.Count == 1)
                    {
                        TBL_MATERIALCATEGORY model = lists[0];
                        if (model.materialcategoryid==id)
                        {
                            json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'不存在该材料类型！'}");
                        }
                        else
                        {
                            json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'存在该材料类型！'}");
                        }
                    }
                    else
                    {
                        json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'存在该材料类型！'}");
                    }
                }
                else
                {
                    json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'不存在该材料类型！'}");
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