using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Capital
{
    /// <summary>
    /// CapitalSelect 的摘要说明
    /// </summary>
    public class CapitalSelect : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private WZGL.BLL.Capital.CapitalapplicantBLL cantBll = new BLL.Capital.CapitalapplicantBLL();

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "submitdate" : context.Request["sort"].ToString();
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
                default:
                    break;
            }
        }


        private void getCount(HttpContext context)
        {
            string State = context.Request["State"].ToString();
            string Organization = context.Request["Organization"].ToString();
            string StartTime = context.Request["StartTime"].ToString();
            string EndTime = context.Request["EndTime"].ToString();
            string sql = " select COUNT(*) from TBL_CAPITALAPPLICANT A left join TBL_ORGANIZATION B ON(A.organizationid=B.organizationid) left join FLOW_TASK t on(A.applicationno=t.TASK_CODE) LEFT JOIN dbo.FLOW_STEP E ON(t.DEFINE_CODE=E.DEFINE_CODE and t.SEQ=E.SEQ) where 1=1 ";
            string json = "";
            if (!string.IsNullOrEmpty(State) && State != "全部")
            {
                sql += " and status='" + State + "'";
            }
            if (!string.IsNullOrEmpty(Organization) && Organization != "全部")
            {
                Organization = CFunctions.getChildByParentId(Organization);
                sql += " and A.organizationid in(" + Organization + ")";
            }
            if (!string.IsNullOrEmpty(StartTime))
            {
                DateTime dt = Convert.ToDateTime(StartTime);
                sql += " AND Convert(varchar(10),submitdate,120)>='"+dt+"'";
            }
            if (!string.IsNullOrEmpty(EndTime))
            {
                DateTime dt1 = Convert.ToDateTime(EndTime);
                sql += " AND Convert(varchar(10),submitdate,120)<='" + dt1 + "'";
            }
            try
            {
                int count = cantBll.getCount(sql);
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
            string State = context.Request["State"].ToString();
            string Organization = context.Request["Organization"].ToString();
            string StartTime = context.Request["StartTime"].ToString();
            string EndTime = context.Request["EndTime"].ToString();
            string sql="";
            string json = "";
            if (!string.IsNullOrEmpty(State) && State != "全部")
            {
                sql += " and status='" + State + "'";
            }
            if (!string.IsNullOrEmpty(Organization) && Organization != "全部")
            {
                Organization = CFunctions.getChildByParentId(Organization);
                sql += " and A.organizationid in(" + Organization + ")";
            }
            if (!string.IsNullOrEmpty(StartTime))
            {
                DateTime dt=Convert.ToDateTime(StartTime);
                sql += " AND Convert(varchar(10),submitdate,120)>='" + dt + "'";
            }
            if (!string.IsNullOrEmpty(EndTime))
            {
                DateTime dt1 = Convert.ToDateTime(EndTime);
                sql += " AND Convert(varchar(10),submitdate,120)<='" + dt1 + "'";
            }
            int count=0;
            int tocount=0;
            Dictionary<string, object> obj = cantBll.GetPageList(sql, sort + " " + order, page, rows, out count, out tocount);
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
            try
            {
                //1.获取参数
                string capitalapplicantid = context.Request["capitalapplicantid"].ToString();
                string sql = " capitalapplicantid='" + capitalapplicantid + "'";
                //2.执行删除
                if (cantBll.Delete(sql))
                {
                    json += "{IsSuccess:true,Message:'删除成功'}";
                }
                else
                {
                    json += "{IsSuccess:false,Message:'删除成功'}";
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

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}