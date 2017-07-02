using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Script.Serialization;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Flow
{
    /// <summary>
    /// Flow_Define 的摘要说明
    /// </summary>
    public class Flow_Define : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        string userid = "", roleid = "";
        WorkFlow.BLL.FLOW_DEFINE BLL = new WorkFlow.BLL.FLOW_DEFINE();
        WorkFlow.BLL.FlowStepBLL stepBLL = new WorkFlow.BLL.FlowStepBLL();
        BLL.Flow.Flow_Derive_RelationBLL RelationBLL = new BLL.Flow.Flow_Derive_RelationBLL();
        BLL.System.OrganizationBLL organBLL = new BLL.System.OrganizationBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " d.ADD_TIME " : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
            string action = context.Request["action"];
            switch (action)
            {
                case "getList"://获取流程类型和流程list
                    getList(context);
                    break;
                case "Add":
                    Add(context);
                    break;
                case "getMyTask": //获取代办
                    getMyTask(context);
                    break;
                case "getMyHandledTask": //获取经办
                    getMyHandledTask(context);
                    break;

            }
        }

        private void getList(HttpContext context)
        {

            int count = 0;
            DataSet ds = BLL.GetList(rows, page, " and status='1'", sort + " " + order, out count);
            string json = "{\"total\":" + count + ",\"rows\":";
            json += ToJson(ds.Tables[0]);
            json += "}";
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void Add(HttpContext context)
        {
            //1.获取参数
            string DEFINE_CODE = context.Request["DEFINE_CODE"].ToString();
            //2.获取步骤数据
            IList<WorkFlow.Model.FLOW_STEP> stepList = stepBLL.GetList("  A.DEFINE_CODE='" + DEFINE_CODE + "'");
            //3.获取第一步步骤的部门
            string pWhere = " organizationid in(select organizationid from tbl_user where userid in(select userid from tbl_userauthorization where roleid=(select role from FLOW_STEP where DEFINE_CODE='" + DEFINE_CODE + "' and seq='1')))  ";
            IList<MODEL.System.TBL_ORGANIZATION> fristList = organBLL.GetList(pWhere);
            //4.获取每步的部门
            IList<MODEL.System.TBL_ORGANIZATION> organList = null;
            //存储上一部的执行部门.
            IList<MODEL.System.TBL_ORGANIZATION> upList = fristList;
            string sql = "";
            string DEFINE_CODE1 = "";
            foreach (MODEL.System.TBL_ORGANIZATION tion in fristList)
            {
                //5.根据ID查询该部门是否实例化
                string sqlRelation = " and DEFINE_CODE_PARENT='" + DEFINE_CODE + "' and CHILD_FRISTSTEP_DEPID='" + tion.organizationid + "'";
                if (RelationBLL.GetList(sqlRelation).Count > 0)
                {
                    continue;
                }
                //5.插入实例到流程定义和流程实例关系，流程步骤数据
                WorkFlow.Model.FLOW_DEFINE model = new WorkFlow.Model.FLOW_DEFINE();
                model.DEFINE_ID = Guid.NewGuid().ToString().ToUpper();
                model.DEFINE_CODE = DEFINE_CODE.Substring(0, 4) + getNowFormatDate();
                DEFINE_CODE1 = model.DEFINE_CODE;
                model.DEFINE_NAME = context.Request["DEFINE_NAME"];
                model.ADD_EMP = context.Request["ADD_EMP"];
                model.ADD_TIME = DateTime.Now;
                model.REMARK = context.Request["REMARK"];
                model.STATUS = "0";
                model.TYPE_CODE = context.Request["TYPE_CODE"];
                model.URL = context.Request["URL"];
                model.ISTEMPLATE = "0";
                if (BLL.Add(model))
                {
                    MODEL.Flow.FLOW_DERIVE_RELATION relation = new MODEL.Flow.FLOW_DERIVE_RELATION();
                    relation.relationid = Guid.NewGuid().ToString().ToUpper();
                    relation.define_code_parent = DEFINE_CODE;
                    relation.define_code_child = model.DEFINE_CODE;
                    relation.child_friststep_depid = tion.organizationid;
                    RelationBLL.Insert(relation);
                    for (int i = 0; i < stepList.Count; i++)
                    {
                        int j = i + 1;
                        //5.获取该流程角色没有复用的部门
                        string pWhere1 = "";
                        pWhere1 = " organizationid in(select organizationid from tbl_user where userid in(select userid from tbl_userauthorization where roleid=(select role from FLOW_STEP where DEFINE_CODE='" + DEFINE_CODE + "' and seq='" + j + "')))  ";
                        organList = organBLL.GetList(pWhere1);

                        WorkFlow.Model.FLOW_STEP flow = new WorkFlow.Model.FLOW_STEP();
                        flow.STEP_ID = Guid.NewGuid().ToString().ToUpper();
                        flow.STEP_CODE = "BZBM" + getNowFormatDate();
                        flow.STEP_NAME = stepList[i].STEP_NAME;
                        flow.SEQ = stepList[i].SEQ;
                        flow.REVIEW_EMP_DEFAULT = stepList[i].REVIEW_EMP_DEFAULT;
                        flow.REVIEW_EMP = stepList[i].REVIEW_EMP;
                        flow.ROLE = stepList[i].ROLE;
                        foreach (MODEL.System.TBL_ORGANIZATION organ in upList)
                        {
                            List<MODEL.System.TBL_ORGANIZATION> ti = (from p2 in organList where p2.organizationid == organ.parentid select p2).ToList();
                            if (ti.Count == 0 && j == 2)
                            {
                                flow.DEPARTMENT = tion.organizationid;
                                break;
                            }
                            else if (ti.Count == 0 && j != 2)
                            {
                                flow.DEPARTMENT = organList[0].organizationid;
                                break;
                            }
                            else
                            {
                                flow.DEPARTMENT = ti[0].organizationid;
                                break;
                            }
                        }
                        flow.REMARK = stepList[i].REMARK;
                        flow.DEFINE_CODE = DEFINE_CODE1;
                        flow.REVIEW_EMP_NAME = stepList[i].REVIEW_EMP_NAME;
                        flow.ROLENAME = stepList[i].ROLENAME;
                        sql += " insert into FLOW_STEP values('" + flow.STEP_ID + "','" + flow.STEP_CODE + "','" + flow.STEP_NAME + "','" + flow.SEQ + "','" + flow.REVIEW_EMP_DEFAULT + "','" + flow.REVIEW_EMP + "','" + flow.ROLE + "','" + flow.DEPARTMENT + "','" + flow.REMARK + "','" + flow.DEFINE_CODE + "','" + flow.REVIEW_EMP_NAME + "','" + flow.ROLENAME + "') ";

                    }
                }
            }
            if (sql!="")
            {
                stepBLL.Insert(sql);
            }
            string json = "{\"IsSuccess\":\"true\",\"Message\":\"实例成功！\"}";
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void getMyTask(HttpContext context)
        {
            string json = CFunctions.getMyTask(context);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void getMyHandledTask(HttpContext context)
        {
            string json = CFunctions.getMyHandledTask(context);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }


        //获取当天日期时分秒的字符串形式
        private string getNowFormatDate()
        {
            string data = DateTime.Now.ToString("yyyy-MM-dd");

            string strHour = DateTime.Now.Hour < 10 ? "0" + DateTime.Now.Hour : DateTime.Now.Hour.ToString();//时
            string strMin = DateTime.Now.Minute < 10 ? "0" + DateTime.Now.Minute : DateTime.Now.Minute.ToString();//分
            string strSec = DateTime.Now.Second < 10 ? "0" + DateTime.Now.Second : DateTime.Now.Second.ToString();//分
            int strMill = 0; string Mill = "";
            strMill = DateTime.Now.Millisecond;
            if (strMill >= 0 && strMill <= 9)
            {
                Mill = "00" + strMill;
            }
            else if (strMill >= 10 && strMill <= 99)
            {
                Mill = "0" + strMill;
            }
            else
            {
                Mill = strMill.ToString();
            }

            string currentdate = data.Split('-')[0] + data.Split('-')[1] + data.Split('-')[2] + strHour + strMin + strSec + Mill;
            Thread.Sleep(10);
            return currentdate;
        }


        #region Datatable转换为Json
        /// <summary>     
        /// Datatable转换为Json     
        /// </summary>    
        /// <param name="table">Datatable对象</param>     
        /// <returns>Json字符串</returns>     
        public static string ToJson(DataTable dt)
        {
            StringBuilder jsonString = new StringBuilder();
            jsonString.Append("[");
            DataRowCollection drc = dt.Rows;
            for (int i = 0; i < drc.Count; i++)
            {
                jsonString.Append("{");
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    string strKey = dt.Columns[j].ColumnName;
                    string strValue = drc[i][j].ToString();
                    Type type = dt.Columns[j].DataType;
                    jsonString.Append("\"" + strKey + "\":");
                    strValue = StringFormat(strValue, type);
                    if (j < dt.Columns.Count - 1)
                    {
                        jsonString.Append(strValue + ",");
                    }
                    else
                    {
                        jsonString.Append(strValue);
                    }
                }
                jsonString.Append("},");
            }
            jsonString.Remove(jsonString.Length - 1, 1);
            jsonString.Append("]");
            return jsonString.ToString();
        }
        #endregion


        /// <summary>
        /// 格式化字符型、日期型、布尔型
        /// </summary>
        /// <param name="str"></param>
        /// <param name="type"></param>
        /// <returns></returns>
        private static string StringFormat(string str, Type type)
        {
            if (type == typeof(string))
            {
                str = String2Json(str);
                str = "\"" + str + "\"";
            }
            else if (type == typeof(DateTime))
            {
                str = "\"" + str + "\"";
            }
            else if (type == typeof(bool))
            {
                str = str.ToLower();
            }
            else if (type != typeof(string) && string.IsNullOrEmpty(str))
            {
                str = "\"" + str + "\"";
            }
            return str;
        }

        /// <summary>
        /// 过滤特殊字符
        /// </summary>
        /// <param name="s">字符串</param>
        /// <returns>json字符串</returns>
        private static string String2Json(String s)
        {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < s.Length; i++)
            {
                char c = s.ToCharArray()[i];
                switch (c)
                {
                    case '\"':
                        sb.Append("\\\""); break;
                    case '\\':
                        sb.Append("\\\\"); break;
                    case '/':
                        sb.Append("\\/"); break;
                    case '\b':
                        sb.Append("\\b"); break;
                    case '\f':
                        sb.Append("\\f"); break;
                    case '\n':
                        sb.Append("\\n"); break;
                    case '\r':
                        sb.Append("\\r"); break;
                    case '\t':
                        sb.Append("\\t"); break;
                    default:
                        sb.Append(c); break;
                }
            }
            return sb.ToString();
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