using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// Singleproject 的摘要说明
    /// </summary>
    public class Dict : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式

        WZGL.IBLL.System.IDictBLL dictBll = BllFactory.GetDictBLL();
        WZGL.IBLL.System.IDictitemBLL itemBLL = BllFactory.GetDictitemBLL();

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " dictid " : context.Request["sort"].ToString();
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

                case "getItemList":
                    getItemList(context);
                    break;
                case "getItemCount":
                    getItemCount(context);
                    break;
                case "DelItem":
                    DelItem(context);
                    break;
                case "AddItem":
                    AddItem(context);
                    break;
                case "EditItem":
                    EditItem(context);
                    break;
                case "up":
                    Up(context);
                    break;
                case "down":
                    Down(context);
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
            WZGL.MODEL.System.TBL_DICT dict = new MODEL.System.TBL_DICT();
            dict.dictid = Guid.NewGuid().ToString().ToUpper();
            dict.dictname = context.Request["name"].ToString();
            try
            {
                if (dictBll.Insert(dict))
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
            WZGL.MODEL.System.TBL_DICT dict = new MODEL.System.TBL_DICT();
            dict.dictid = context.Request["dictid"].ToString();
            dict.dictname = context.Request["name"].ToString();
            try
            {
                if (dictBll.Update(dict))
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
        private void getCount(HttpContext context)
        {
            string json = "";
            string sql = "";
            //1.获取参数
            string dictname = context.Request["dictname"].ToString();
            if (!string.IsNullOrEmpty(dictname))
            {
                sql += " and dictname like '%" + dictname + "%'";
            }
            try
            {
                int count = dictBll.GetCount(sql);
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
            string json = "";
            string sql = "";
            //1.获取参数
            string dictname = context.Request["dictname"].ToString();
            if (!string.IsNullOrEmpty(dictname))
            {
                sql += " and dictname like '%" + dictname + "%'";
            }
            int count = 0;
            int tocount = 0;
            Dictionary<string, object> obj = dictBll.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
            if (obj.Count > 0)
            {
                json = JsonConvert.SerializeObject(obj);
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void getListById(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string dictid = context.Request["dictid"].ToString();
            string pWhere = "";
            if (!string.IsNullOrEmpty(dictid))
            {
                pWhere += " and dictid='" + dictid + "'";

            }
            IList<MODEL.System.TBL_DICTITEM> itemList = itemBLL.GetList(pWhere);
            if (itemList != null && itemList.Count > 0)
            {
                json = JsonConvert.SerializeObject(itemList);
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void Delete(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string dictid = context.Request["dictid"].ToString();
            string sql = "";
            try
            {
                if (!string.IsNullOrEmpty(dictid))
                {
                    sql = " dictid='" + dictid + "'";
                }
                if (itemBLL.Delete(sql) && dictBll.Delete(sql))
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

        private void getItemList(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string dictid = context.Request["dictid"].ToString();
            //string itemname = context.Request["itemname"].ToString();
            string sql = "";
            if (!string.IsNullOrEmpty(dictid))
            {
                sql += " and dictid='" + dictid + "'";
            }
            //if (!string.IsNullOrEmpty(itemname))
            //{
            //    sql += " and itemname='" + itemname + "'";
            //}
            int count = 0;
            int tocount = 0;
            IList<MODEL.System.TBL_DICTITEM> itemList = itemBLL.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
            json = JsonConvert.SerializeObject(itemList);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void getItemCount(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string dictid = context.Request["dictid"].ToString();
            //string itemname = context.Request["itemname"].ToString();
            string sql = "";
            if (!string.IsNullOrEmpty(dictid))
            {
                sql += " and dictid='" + dictid + "'";
            }
            //if (!string.IsNullOrEmpty(itemname))
            //{
            //    sql += " and itemname='" + itemname + "'";
            //}
            try
            {
                int count = itemBLL.GetCount(sql);
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
        private void DelItem(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string itemid = context.Request["itemid"].ToString();
            string sql = "";
            try
            {
                if (!string.IsNullOrEmpty(itemid))
                {
                    sql = " itemid='" + itemid + "'";
                }
                if (itemBLL.Delete(sql))
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
        private void AddItem(HttpContext context)
        {
            string json = "";
            //1.获取参数
            MODEL.System.TBL_DICTITEM item = new MODEL.System.TBL_DICTITEM();
            item.dictid = context.Request["dictid"].ToString();
            item.itemid = Guid.NewGuid().ToString().ToUpper();
            item.itemname = context.Request["name"].ToString();
            item.sort = int.Parse(context.Request["sort"].ToString());
            string itemid = context.Request["itemid"].ToString();
            try
            {
                if (itemBLL.Insert(item))
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
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void EditItem(HttpContext context)
        {
            string json = "";
            //1.获取参数
            MODEL.System.TBL_DICTITEM item = new MODEL.System.TBL_DICTITEM();
            item.dictid = context.Request["dictid"].ToString();
            item.itemid = context.Request["itemid"].ToString();
            item.itemname = context.Request["name"].ToString();
            item.sort = int.Parse(context.Request["sort"].ToString());
            try
            {
                if (itemBLL.Update(item))
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
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void Up(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string itemid = context.Request["itemid"].ToString();
            string dictid = context.Request["dictid"].ToString();
            int sort = int.Parse(context.Request["sort"].ToString());

            //2.初始化实体
            MODEL.System.TBL_DICTITEM dictitem = new MODEL.System.TBL_DICTITEM();
            dictitem.itemid = itemid;
            dictitem.xh = sort;
            //3.组装T_SQL语句
            string sql1 = " update tbl_dictitem set sort=" + sort + " where dictid='"+dictid+"' and sort=" + (sort - 1);
            string sql = "update tbl_dictitem set sort=" + (sort - 1) + " where dictid='" + dictid + "' and itemid='" + itemid + "'";
            if (itemBLL.UpdateXh(sql1))
            {
                if (itemBLL.UpdateXh(sql))
                {
                    json = "{IsSuccess:true,Message:'移动成功'}";
                }
            }
            else
            {
                json = "{IsSuccess:false,Message:'移动失败'}";
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void Down(HttpContext context)
        {
            string json = "";
            //1.获取参数
            string itemid = context.Request["itemid"].ToString();
            string dictid = context.Request["dictid"].ToString();
            int sort = int.Parse(context.Request["sort"].ToString());
            //2.初始化实体
            MODEL.System.TBL_DICTITEM dictitem = new MODEL.System.TBL_DICTITEM();
            dictitem.itemid = itemid;
            dictitem.xh = sort;
            //3.组装T_SQL语句
            string sql1 = " update tbl_dictitem set sort=" + sort + " where dictid='" + dictid + "' and sort=" + (sort + 1);
            string sql = "update tbl_dictitem set sort=" + (sort + 1) + " where dictid='" + dictid + "' and itemid='" + itemid + "'";
            if (itemBLL.UpdateXh(sql1))
            {
                if (itemBLL.UpdateXh(sql))
                {
                    json = "{IsSuccess:true,Message:'移动成功'}";
                }
            }
            else
            {
                json = "{IsSuccess:false,Message:'移动失败'}";
            }
            json = JsonConvert.SerializeObject(json);
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