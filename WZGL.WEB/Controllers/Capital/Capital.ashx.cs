using System.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using WZGL.MODEL.System;
using Newtonsoft.Json;
using System.Web.Security;
using System.Text;
using WZGL.COMMON;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Capital
{
    /// <summary>
    /// Capital 的摘要说明
    /// </summary>
    public class Capital : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        private WZGL.BLL.Capital.CapitalapplicantBLL cantBll = new BLL.Capital.CapitalapplicantBLL();
        private WZGL.BLL.Capital.CapitalaccountBLL countBll = new BLL.Capital.CapitalaccountBLL();
        private WZGL.BLL.Capital.Capitalaccount_flowercordBLL flowBll = new BLL.Capital.Capitalaccount_flowercordBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "balance" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];
            switch (action)
            {
                //获取用户信息
                case "getUserInfo":
                    getUserInfo(context);
                    break;
                case "update":
                    Update(context);
                    break;

                case "add":
                    Add(context);
                    break;

                case "getContainer":
                    getContainer(context);
                    break;

                case "getUser":
                    getUser(context);
                    break;

                case "getList":
                    getList(context);
                    break;

                case "addFlow":
                    addFlow(context);
                    break;

                case "updateFlow":
                    updateFlow(context);
                    break;
                default:
                    break;
            }
        }

        private void getList(HttpContext context)
        {
            string capitalapplicantid = context.Request["capitalapplicantid"].ToString();
            string json = "";
            string sql = "";
            if (!string.IsNullOrEmpty(capitalapplicantid))
            {
                sql += " and capitalapplicantid='" + capitalapplicantid + "'";
            }
            int count = 0;
            int toc = 0;
            Dictionary<string, object> dic = cantBll.GetPageList(sql, " capitalapplicantid ", page, rows, out count, out toc);
            json = JsonConvert.SerializeObject(dic);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void getUserInfo(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);

            StringBuilder sb = new StringBuilder();
            sb.Append(" select C.*,A.itemname,O.organizationname from tbl_capitalaccount C inner join tbl_dictitem A on(C.capitalaccounttype=itemid) inner join tbl_organization O on(C.organizationid=O.organizationid) where C.organizationid='" + user.organizationid + "'");
            int count = 0; int total = 0;
            IList<MODEL.Capital.TBL_CAPITALACCOUNT> countList = countBll.GetPageList(sb.ToString(), sort + " " + order, page, rows, out count, out total);


            string json = JsonConvert.SerializeObject(countList);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void getUser(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
            string json = JsonConvert.SerializeObject(user);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void Update(HttpContext context)
        {
            string json = "";
            try
            {
                //1.获取参数
                string ApplicantName = context.Request["ApplicantName"].ToString();
                //string OrganizationName = context.Request["OrganizationName"].ToString();
                string Organizationid = context.Request["Organizationid"].ToString();
                //string Submitdate = context.Request["Submitdate"].ToString();
                string Applicantamount = context.Request["Applicantamount"].ToString();
                string Approveamount = context.Request["Approveamount"].ToString();
                string Instructions = context.Request["Instructions"].ToString();
                string ApplicationNo = context.Request["ApplicationNo"].ToString();
                //2.实例化实体类对象
                WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT cant = new MODEL.Capital.TBL_CAPITALAPPLICANT();
                cant.capitalapplicantid = context.Request["capitalapplicantid"].ToString();
                cant.applicantname = ApplicantName;
                cant.applicantamount = decimal.Parse(Applicantamount);
                cant.applicationno = ApplicationNo;
                cant.approveamount = decimal.Parse(Approveamount);
                cant.instructions = Instructions;
                cant.organizationid = Organizationid;
                cant.remitdate = context.Request["submitdate"].ToString();
                cant.submitdate = context.Request["submitdate"].ToString();
                if (cantBll.Update(cant))
                {
                    json = "{IsSuccess:true,Message:'编辑成功'}";
                }
                else
                {
                    json = "{IsSuccess:true,Message:'编辑失败'}";
                }
            }
            catch (Exception ex)
            {
                json = "{IsSuccess:true,Message:'" + ex.Message + "'}";
                throw;
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }
        private void Add(HttpContext context)
        {
            string json = "";
            try
            {   //1.获取参数
                string ApplicationNo = context.Request["ApplicationNo"].ToString();
                //2.判断申请单号是否存在
                string sql = "";
                if (!string.IsNullOrEmpty(ApplicationNo))
                {
                    sql += " and applicationno='" + ApplicationNo + "'";
                }
                if (cantBll.GetList(sql).Count > 0)
                {
                    json = "{IsSuccess:false,Message:'申请单号已经存在'}";
                }
                else
                {
                    string ApplicantName = context.Request["ApplicantName"].ToString();
                    string OrganizationName = context.Request["OrganizationName"].ToString();
                    string Organizationid = context.Request["Organizationid"].ToString();
                    string Submitdate = context.Request["Submitdate"].ToString();
                    string Applicantamount = context.Request["Applicantamount"].ToString();
                    string Approveamount = context.Request["Approveamount"].ToString();
                    string Instructions = context.Request["Instructions"].ToString();

                    //2.实例化实体类对象
                    WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT cant = new MODEL.Capital.TBL_CAPITALAPPLICANT();
                    cant.capitalapplicantid = Guid.NewGuid().ToString().ToUpper();
                    //cant.Applicantname = ApplicantName;
                    cant.applicantname = ApplicantName;
                    cant.applicantamount = decimal.Parse(Applicantamount);
                    cant.applicationno = ApplicationNo;
                    cant.approveamount = decimal.Parse(Approveamount);
                    cant.instructions = Instructions;
                    //cant.Organizationid = Organizationid;
                    cant.organizationid = Organizationid;
                    cant.remitdate = DateTime.Now.ToString();
                    cant.submitdate = DateTime.Now.ToString();
                    if (cantBll.Insert(cant))
                    {
                        json = "{IsSuccess:true,Message:'添加成功'}";
                    }
                    else
                    {
                        json = "{IsSuccess:true,Message:'添加失败'}";
                    }
                }
            }
            catch (Exception ex)
            {
                json = "{IsSuccess:true,Message:'" + ex.Message + "'}";
                throw;
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void addFlow(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式
            WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT model = new MODEL.Capital.TBL_CAPITALAPPLICANT();//材料计划
            string cantid = ComFunction.GetId();//计划主键ID
            string cant = context.Request["data"];
            string type = context.Request["type"];
            try
            {
                List<WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT>>(cant);

                if (list.Count > 0)
                {
                    list[0].capitalapplicantid = cantid;
                    model = list[0];
                    string sql = "";
                    if (!string.IsNullOrEmpty(model.applicationno))
                    {
                        sql += " and applicationno='" + model.applicationno + "'";
                    }
                    if (cantBll.GetList(sql).Count > 0)
                    {
                        if (type == "send")
                        {
                            string code = model.applicationno;
                            string def_code = CFunctions.getFlowDefineId(context, "63211695-E9DD-4977-912F-0E5A04DD6F01");
                            //发送流程
                            bool re = WorkFlow.BLL.Operate.StartFlow(code, def_code, WZGL.WEB.Common.CFunctions.getUserId(context), "");
                            if (re)
                            {
                                json = "{\"IsSuccess\":\"true\",\"Message\":\"发起流程成功！\"}";
                            }
                            else
                            {
                                json = "{\"IsSuccess\":\"false\",\"Message\":\"该流程已经启动！\"}";
                            }
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"false\",\"Message\":\"申请单号已经存在！\"}";
                        }
                    }
                    else
                    {
                        bool result = cantBll.Insert(model);
                        WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                        task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                        task.DEFINE_CODE = CFunctions.getFlowDefineId(context, "63211695-E9DD-4977-912F-0E5A04DD6F01");
                        task.TASK_CODE = model.applicationno;// "CLJH" + DateTime.Now.ToString("yyyyMMddHHmmss"); ;
                        task.TASK_TILTE = "资金申请" + DateTime.Now.ToString("yyyyMMddHHmmss");
                        task.STATUS = "0";
                        task.TASK_TYPE = "63211695-E9DD-4977-912F-0E5A04DD6F01";
                        task.ADD_EMP = WZGL.WEB.Common.CFunctions.getUserId(context);// "1";//context.Request["ADD_EMP"];
                        task.TASK_JSON = cant;// context.Request["TASK_JSON"];
                        result = WorkFlow.BLL.Operate.AddTask(task);
                        if (result)
                        {
                            if (type == "send")
                            {
                                //发送流程
                                bool re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, WZGL.WEB.Common.CFunctions.getUserId(context), "");
                                if (re)
                                {
                                    json = "{\"IsSuccess\":\"true\",\"Message\":\"保存发起&流程成功！\"}";
                                }
                                else
                                {
                                    json = "{\"IsSuccess\":\"false\",\"Message\":\"保存发起&流程失败！\"}";
                                }

                            }
                            else
                            {

                                json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
                            }
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"false\",\"Message\":\"添加失败！\"}";
                        }
                    }
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据失败！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        private void updateFlow(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式
            WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT model = new MODEL.Capital.TBL_CAPITALAPPLICANT();//材料计划

            string cant = context.Request["data"];

            string type = context.Request["type"];

            try
            {
                List<WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Capital.TBL_CAPITALAPPLICANT>>(cant);

                if (list.Count > 0)
                {
                    model = list[0];
                  
                    WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.applicationno);

                    bool result = cantBll.Update(model);

                    string message = "";
                    bool re = WorkFlow.BLL.Operate.UpdateTaskJson(model.applicationno, cant, ref message);


                    if (re)
                    {
                        if (type == "send")
                        {
                            if (task != null)
                            {
                                if (task.STATUS != "0")
                                {
                                    json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，该计划的流程正在审批中！\"}";
                                }
                                else
                                {
                                    //发送流程
                                    re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, CFunctions.getUserId(context), "");
                                    if (re)
                                    {
                                        json = "{\"IsSuccess\":\"true\",\"Message\":\"发起成功！\"}";
                                    }
                                    else
                                    {
                                        json = "{\"IsSuccess\":\"false\",\"Message\":\"该流程已经启动！\"}";
                                    }
                                }
                            }
                            else
                            {
                                json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，流程任务数据不存在！\"}";
                            }
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"true\",\"Message\":\"修改成功！\"}";
                        }

                    }
                    else
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"操作失败！\"}";
                    }
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据失败！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }


        //获取图标需要的数据
        private void getContainer(HttpContext context)
        {
            string json = "";

            //1.获取当前登录用户数据
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
            //2.获取则线图时间
            string Data = context.Request["Date"].ToString() == "" ? DateTime.Now.ToString("yyyy-MM") : context.Request["Date"].ToString();
            //string Data = "2016-12";
            //出入账sql语句.
            string sql = "select SUM(amount) amount,CONVERT(varchar(10),appeardate,120) appeardate from tbl_capitalaccount_flowrecord  where flowrecordtype='入账' and organizationid='" + user.organizationid + "' and CONVERT(varchar(7),appeardate,120)='" + Data + "'  group by CONVERT(varchar(10),appeardate,120) ORDER BY appeardate";
            string sql1 = " select SUM(amount) amount,CONVERT(varchar(10),appeardate,120) appeardate from tbl_capitalaccount_flowrecord  where flowrecordtype='出账' and organizationid='" + user.organizationid + "' and CONVERT(varchar(7),appeardate,120)='" + Data + "' group by CONVERT(varchar(10),appeardate,120) ORDER BY appeardate";
            IList<MODEL.Capital.TBL_CAPITALACCOUNT_FLOWRECORD> flowList = flowBll.GetListByOrgan(sql);
            IList<MODEL.Capital.TBL_CAPITALACCOUNT_FLOWRECORD> flowList1 = flowBll.GetListByOrgan(sql1);
            Dictionary<string, object> obj = new Dictionary<string, object>();
            int days = DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month);
            obj.Add("total", days);
            obj.Add("rows", flowList);
            obj.Add("total1", days);
            obj.Add("rows1", flowList1);
            json = JsonConvert.SerializeObject(obj);
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