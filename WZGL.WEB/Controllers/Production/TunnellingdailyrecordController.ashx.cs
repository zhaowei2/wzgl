/*************************************************
  Copyright (C), 2016, Hoswing Tech. Co., Ltd.
  File name:   TunnellingdailyrecordController.ashx
  Author:  程唯   
  Version: 1.0       
  Date: 2016/12/15
  Description:   开拓掘进日记录逻辑处理
  History:        // 修改历史记录列表，每条修改记录应包括修改日期、修改作者及修改内容简述 
    1. Date:
       Author:
       Modification:
 
    2. ...
*************************************************/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IBLL;
using Newtonsoft.Json;
using WZGL.MODEL;
using WZGL.IBLL.Production;
using WZGL.MODEL.Production;

namespace WZGL.WEB.Controllers.Production
{
    /// <summary>
    /// 开拓掘进日记录
    /// </summary>
    public class TunnellingdailyrecordController : IHttpHandler
    {

        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        #endregion

        ITunnellingdailyrecordBLL Bll = BllFactory.GetlineRecordBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "date desc" : context.Request["sort"].ToString();
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
                //当月掘进总长度
                case "getSumDay": GetSumDay(context); break;
            }
        }

        #region 1.获取开拓掘进日记录列表
        /// <summary>
        /// 获取开拓掘进日记录列表
        /// </summary>
        /// <param name="context"></param>
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string start = context.Request["start"];
            string end = context.Request["end"];
            string organizationid = context.Request["organizationid"];
            string miningwellprojectid = context.Request["miningwellprojectid"];
            string date = "";
            if (!string.IsNullOrEmpty(organizationid))
            {
                sql += "  and t.organizationid ='" + organizationid + "'";
            }
            if (!string.IsNullOrEmpty(miningwellprojectid))
            {
                sql += "  and  t.miningwellprojectid ='" + miningwellprojectid + "'";
            }
            if (!string.IsNullOrEmpty(start))
            {
                sql += "  and t.date >='" + start + "'";
                date += "  and t.date ='" + start + "'";
            }
            if (!string.IsNullOrEmpty(end))
            {
                sql += "  or  t.date <='" + end + "'";
                date += "  and t.date ='" + end + "'";
            }
            sql = sql + date;
           
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

        #region 2.获取开拓掘进日记录列表
        /// <summary>
        /// 获取开拓掘进日记录列表
        /// </summary>
        /// <param name="context"></param>
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string start = context.Request["start"];
            string end = context.Request["end"];
            string organizationid = context.Request["organizationid"];
            string miningwellprojectid = context.Request["miningwellprojectid"];
            string date = "";
            if (!string.IsNullOrEmpty(organizationid))
            {
                sql += "  and t.organizationid ='" + organizationid + "'";

            }
            if (!string.IsNullOrEmpty(miningwellprojectid))
            {
                sql += "  and  t.miningwellprojectid ='" + miningwellprojectid + "'";

            }
            if (!string.IsNullOrEmpty(start))
            {
                sql += "  and t.date >='" + start + "'";
                date += "  and t.date ='" + start + "'";
            }
            if (!string.IsNullOrEmpty(end))
            {
                sql += "  or  t.date <='" + end + "'";
                date += "  and t.date ='" + end + "'";
            }
            sql = sql + date;
           
            try
            {
                List<TBL_TUNNELLINGDAILYRECORD> lists = Bll.GetList(sql) as List<TBL_TUNNELLINGDAILYRECORD>;
                //json = JsonConvert.SerializeObject(lists);
                int count = lists.Count;
                // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
                json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"Count\":0}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region 3.新增开拓掘进日记录
        /// <summary>
        /// 新增开拓掘进日记录
        /// </summary>
        /// <param name="context"></param>
        private void add(HttpContext context)
        {
            string json = "";
            TBL_TUNNELLINGDAILYRECORD model = new TBL_TUNNELLINGDAILYRECORD();
            model.tunnellingdailyrecordid = System.Guid.NewGuid().ToString().ToUpper();
            model.organizationid = context.Request["organizationid"];
            model.miningwellprojectid = context.Request["miningwellprojectid"];
            model.daycompletion = Convert.ToDecimal(context.Request["daycompletion"]);
            model.addupcompletion = Convert.ToDecimal(context.Request["addupcompletion"]);
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

        #region 4.修改开拓掘进日记录
        /// <summary>
        /// 修改开拓掘进日记录
        /// </summary>
        /// <param name="context"></param>
        private void update(HttpContext context)
        {
            string json = "";
            TBL_TUNNELLINGDAILYRECORD model = new TBL_TUNNELLINGDAILYRECORD();
            model.tunnellingdailyrecordid = context.Request["Tunnellingdailyrecordid"];
            model.organizationid = context.Request["organizationid"];
            model.miningwellprojectid = context.Request["miningwellprojectid"];
            model.daycompletion = Convert.ToDecimal(context.Request["daycompletion"]);
            model.addupcompletion = Convert.ToDecimal(context.Request["addupcompletion"]);
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

        #region 5.删除开拓掘进日记录
        /// <summary>
        /// 删除开拓掘进日记录
        /// </summary>
        /// <param name="context"></param>
        private void delete(HttpContext context)
        {
            string id = context.Request["id"];
            string json = "";
            string where = " and tunnellingdailyrecordid='" + id + "'";
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

        #region 6.获取开拓掘进日记录总个数
        /// <summary>
        /// 获取开拓掘进日记录总个数
        /// </summary>
        /// <param name="context"></param>
        private void GetCount(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            string start = context.Request["start"];
            string end = context.Request["end"];
            string organizationid = context.Request["organizationid"];
            string miningwellprojectid = context.Request["miningwellprojectid"];
            string date = "";
            if (!string.IsNullOrEmpty(organizationid))
            {
                sql += "  and organizationid ='" + organizationid + "'";

            }
            if (!string.IsNullOrEmpty(miningwellprojectid))
            {
                sql += "  and  miningwellprojectid ='" + miningwellprojectid + "'";

            }
            if (!string.IsNullOrEmpty(start))
            {
                sql += "  and date >='" + start + "'";
                date += "  and date ='" + start + "'";
            }
            if (!string.IsNullOrEmpty(end))
            {
                sql += "  or  date <='" + end + "'";
                date += "  and date ='" + end + "'";
            }
            sql = sql + date;
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

        #region 7.获取当月开拓掘进总长度
        private void GetSumDay(HttpContext context)
        {
            string json = "";
            string data = DateTime.Now.ToString("yyyy-MM");
            string where=" convert(varchar(7),date,120)='"+data+"'";
            IList<TBL_TUNNELLINGDAILYRECORD> recordList=Bll.GetSumDay(where);
            if (recordList.Count>0)
            {
                json = JsonConvert.SerializeObject(recordList);
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
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
    }
}