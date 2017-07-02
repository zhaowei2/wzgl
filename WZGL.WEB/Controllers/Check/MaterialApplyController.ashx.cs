using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.DAO;
using WZGL.IBLL.Check;
using WZGL.IBLL.System;
using WZGL.MODEL.Check;
using WZGL.WEB.Common;
using WZGL.MODEL.System;



namespace WZGL.WEB.Controllers.Check
{
    /// <summary>
    /// MaterialApplyController 的摘要说明
    /// </summary>
    public class MaterialApplyController : IHttpHandler
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式


        readonly ILog logger = LogManager.GetLogger(typeof(MaterialApplyController));
        IMaterialapplicationBLL maBLL = BllFactory.GetMaterialapplicationBLL();
        IMaterialapplication_projectBLL mapBLL = BllFactory.GetMaterialapplication_projectBLL();
        IMaterialapplication_detailBLL madBLL = BllFactory.GetMaterialapplication_detailBLL();
        IDictitemBLL dictBLL = BllFactory.GetDictitemBLL();
        //IUserauthorizationBLL useraBLL = BllFactory.GetUserauthorizationBLL();

        #endregion

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "name" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];

            switch (action)
            {
                //获取分页列表
                case "getPageList":
                    getPageList(context);
                    break;

                //添加
                case "add":
                    add(context);
                    break;

                //修改
                case "update":
                    update(context);
                    break;

                //删除
                case "del":
                    del(context);
                    break;
                //获取材料申请项目权限
                case "getApplicationproject_limits":
                    getApplicationproject_limits(context);
                    break;
                //获取单项工程权限
                case "getSingleproject_limits":
                    getSingleproject_limits(context);
                    break;
                //获取材料申请单列表
                case "getList":
                    getList(context);
                    break;
                //获取材料申请单列表
                case "GetMaterialapplication":
                    GetMaterialapplication(context);
                    break;
                //获取获取流程单
                case "GetTask":
                    GetTask(context);
                    break;


            }
        }

        #region ------------------------------添加材料申请------------------------------
        private void add(HttpContext context)
        {
            string json = "{IsSuccess:'true',Message:'保存成功！'}";
            //List<TBL_MATERIALAPPLICATION_PROJECT> pList = new List<TBL_MATERIALAPPLICATION_PROJECT>();
            //TBL_MATERIALAPPLICATION ma = new TBL_MATERIALAPPLICATION();
            //ma.materialapplicationid = System.Guid.NewGuid().ToString().ToUpper();
            //ma.processnumber = context.Request["processnumber"];
            //ma.organizationid = context.Request["organizationid"];
            //ma.applicantname = context.Request["applicantname"];
            //ma.useinstructions = context.Request["useinstructions"];
            //ma.submitdate = context.Request["submitdate"];
            string flowstate = context.Request["flowstate"];
            try
            {
               

                TBL_MATERIALAPPLICATION ma = CFunctions.JsonDeserialize<TBL_MATERIALAPPLICATION>(context.Request["materialapply"].ToString());
                ma.materialapplicationid = System.Guid.NewGuid().ToString().ToUpper();
                WorkFlow.Model.FLOW_TASK tasks = WorkFlow.BLL.Operate.GetTask(ma.processnumber);
                if (tasks == null)
                {
                    DaoFactory.BeginTransaction();


                    List<TBL_MATERIALAPPLICATION> maList = maBLL.GetList(" and processnumber='" + ma.processnumber + "' ").ToList<TBL_MATERIALAPPLICATION>();
                    if (maList.Count == 0)
                    {

                        if (maBLL.Insert(ma))
                        {
                            foreach (TBL_MATERIALAPPLICATION_PROJECT map in ma.projects)
                            {
                                map.materialapplicationid = ma.materialapplicationid;
                                map.materialapplicationprojectid = System.Guid.NewGuid().ToString().ToUpper();
                                if (mapBLL.Insert(map))
                                {
                                    foreach (TBL_MATERIALAPPLICATION_DETAIL mad in map.madetail)
                                    {
                                        mad.materialapplicationdetailid = System.Guid.NewGuid().ToString().ToUpper();
                                        mad.materialapplicationprojectid = map.materialapplicationprojectid;
                                        madBLL.Insert(mad);
                                    }


                                }
                                else
                                {
                                    json = "{IsSuccess:'false',Message:'保存失败！'}";
                                    DaoFactory.RollBackTransaction();
                                    break;
                                }
                            }


                            if (flowstate == "1")
                            {
                                WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                                task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                                task.DEFINE_CODE = "LCBM20161208100520";
                                task.TASK_CODE = ma.processnumber;
                                task.TASK_TILTE = "材料申请" + DateTime.Now.ToString("yyyyMMddHHmmss");
                                task.STATUS = "0";
                                task.TASK_TYPE = "8CF337E8-08C0-45E7-97C4-1C2E617D06CC";
                                task.ADD_EMP = CFunctions.getUserId(context);
                                task.TASK_JSON = JsonConvert.SerializeObject(ma);
                                bool s = createFlow(task);
                                s = sendFlow(task.TASK_CODE, task.DEFINE_CODE, task.ADD_EMP);
                                json = "{IsSuccess:'true',Message:'提交成功！'}";
                            }

                            DaoFactory.CommitTransaction();
                        }
                        else
                        {
                            json = "{IsSuccess:'false',Message:'保存失败！'}";
                            DaoFactory.RollBackTransaction();
                        }
                    }
                    else
                    {

                        if (flowstate == "1")
                        {
                            WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                            task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                            task.DEFINE_CODE = "LCBM20161208100520";
                            task.TASK_CODE = ma.processnumber;
                            task.TASK_TILTE = "材料申请" + DateTime.Now.ToString("yyyyMMddHHmmss");
                            task.STATUS = "0";
                            task.TASK_TYPE = "8CF337E8-08C0-45E7-97C4-1C2E617D06CC";
                            task.ADD_EMP = CFunctions.getUserId(context);
                            task.TASK_JSON = JsonConvert.SerializeObject(ma);
                            bool s = createFlow(task);
                            s = sendFlow(task.TASK_CODE, task.DEFINE_CODE, task.ADD_EMP);
                            json = "{IsSuccess:'true',Message:'提交成功！'}";
                        }
                        else
                        {
                            json = "{IsSuccess:'false',Message:'申请单号存在！'}";
                        }

                    }

                }
                else
                {
                    json = "{IsSuccess:'true',Message:'此单号已经提交！'}";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'保存失败！'}";
                DaoFactory.RollBackTransaction();
            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region ------------------------------修改材料申请------------------------------
        private void update(HttpContext context)
        {
            string json = "{IsSuccess:'true',Message:'保存成功！'}";

            string flowstate = context.Request["flowstate"];

            try
            {

                DaoFactory.BeginTransaction();

                TBL_MATERIALAPPLICATION ma = new TBL_MATERIALAPPLICATION();
                if (context.Request["materialapply"] != null)
                {
                    ma = CFunctions.JsonDeserialize<TBL_MATERIALAPPLICATION>(context.Request["materialapply"].ToString());
                }
                WorkFlow.Model.FLOW_TASK tasks = WorkFlow.BLL.Operate.GetTask(ma.processnumber);
                if (tasks == null)
                {
                    if (maBLL.Update(ma))
                    {
                        //删除材料申请明细和材料申请项目
                        mapBLL.Delete("  materialapplicationid='" + ma.materialapplicationid + "'  ");
                        foreach (TBL_MATERIALAPPLICATION_PROJECT map in ma.projects)
                        {
                            madBLL.Delete("  materialapplicationprojectid='" + map.materialapplicationprojectid + "'  ");


                        }

                        //新增材料申请明细和材料申请项目
                        foreach (TBL_MATERIALAPPLICATION_PROJECT map in ma.projects)
                        {
                            map.materialapplicationid = ma.materialapplicationid;
                            map.materialapplicationprojectid = System.Guid.NewGuid().ToString().ToUpper();
                            if (mapBLL.Insert(map))
                            {
                                foreach (TBL_MATERIALAPPLICATION_DETAIL mad in map.madetail)
                                {
                                    mad.materialapplicationdetailid = System.Guid.NewGuid().ToString().ToUpper();
                                    mad.materialapplicationprojectid = map.materialapplicationprojectid;
                                    madBLL.Insert(mad);
                                }
                            }
                            else
                            {
                                json = "{IsSuccess:'false',Message:'保存失败！'}";
                                DaoFactory.RollBackTransaction();
                                break;
                            }
                        }

                        DaoFactory.CommitTransaction();

                        if (flowstate == "1")
                        {
                            WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                            task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                            task.DEFINE_CODE = "LCBM20161208100520";
                            task.TASK_CODE = ma.processnumber;
                            task.TASK_TILTE = "材料申请" + DateTime.Now.ToString("yyyyMMddHHmmss");
                            task.STATUS = "0";
                            task.TASK_TYPE = "8CF337E8-08C0-45E7-97C4-1C2E617D06CC";
                            task.ADD_EMP = CFunctions.getUserId(context);
                            task.TASK_JSON = JsonConvert.SerializeObject(ma);
                            bool s = createFlow(task);
                            s = sendFlow(task.TASK_CODE, task.DEFINE_CODE, task.ADD_EMP);
                            json = "{IsSuccess:'true',Message:'提交成功！'}";
                        }
                    }
                    else
                    {
                        json = "{IsSuccess:'false',Message:'保存失败！'}";
                        DaoFactory.RollBackTransaction();
                    }
                }
                else
                {
                    json = "{IsSuccess:'true',Message:'此单号已经提交！'}";
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'保存失败！'}";
                DaoFactory.RollBackTransaction();
            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region ------------------------------删除材料申请------------------------------
        private void del(HttpContext context)
        {
            string json = "{IsSuccess:'true',Message:'删除成功！'}";
            string materialapplicationid = context.Request["materialapplicationid"];
            string processnumber = context.Request["processnumber"];
            List<TBL_MATERIALAPPLICATION_PROJECT> mapList = mapBLL.GetList(" and materialapplicationid='" + materialapplicationid + "' ").ToList<TBL_MATERIALAPPLICATION_PROJECT>();


            try
            {
                WorkFlow.Model.FLOW_TASK tasks = WorkFlow.BLL.Operate.GetTask(processnumber);
                if (tasks == null)
                {
                    DaoFactory.BeginTransaction();

                    foreach (TBL_MATERIALAPPLICATION_PROJECT map in mapList)
                    {
                        madBLL.Delete("  materialapplicationprojectid='" + map.materialapplicationprojectid + "'  ");

                        mapBLL.Delete("  materialapplicationprojectid='" + map.materialapplicationprojectid + "'  ");
                    }

                    maBLL.Delete(" materialapplicationid='" + materialapplicationid + "' ");
                    DaoFactory.CommitTransaction();
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'单号已经提交流程不能删除！'}";
                }
               
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'删除失败！'}";
                DaoFactory.RollBackTransaction();

            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();

        }
        #endregion


        #region ------------------------------获取材料申请项目权限------------------------------
        private void getApplicationproject_limits(HttpContext context)
        {
            string json = "";
            try
            {
                List<TBL_DICTITEM> ApplicationLimits = dictBLL.GetApplicationLimits(" and  organizationid='" + CFunctions.getOrgId(context) + "' ").ToList<TBL_DICTITEM>();
                json = JsonConvert.SerializeObject(ApplicationLimits);
                json = "{IsSuccess:'true',Message:'" + json + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'获取数据失败！'}";

            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();

        }
        #endregion

        #region ------------------------------获取单项工程权限------------------------------
        private void getSingleproject_limits(HttpContext context)
        {
            string json = "";
            try
            {
                List<TBL_DICTITEM> SingleprojectLimits = dictBLL.GetSingleprojectLimits(" and organizationid='" + CFunctions.getOrgId(context) + "' ").ToList<TBL_DICTITEM>();
                json = JsonConvert.SerializeObject(SingleprojectLimits);
                json = "{IsSuccess:'true',Message:'" + json + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'获取数据失败！'}";

            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region ------------------------------创建流程------------------------------
        private bool createFlow(WorkFlow.Model.FLOW_TASK task)
        {
            return WorkFlow.BLL.Operate.AddTask(task);
        }
        #endregion


        #region ------------------------------发起流程------------------------------
        private bool sendFlow(string TASK_CODE, string DEFINE_CODE, string userID)
        {
            return WorkFlow.BLL.Operate.StartFlow(TASK_CODE, DEFINE_CODE, userID, "");
        }
        #endregion

        #region ------------------------------获取流程单列表------------------------------
        private void getList(HttpContext context)
        {
            string json = string.Empty;
            // string sql = "  and a.username <>'admin' ";
            string sql = " and b.userid='" + CFunctions.getUserId(context) + "' ";
            string processnumber = context.Request["processnumber"];
            string organizationid = context.Request["organizationid"];
            string userid = context.Request["userid"];
            string submitdate = context.Request["submitdate"];

            if (!string.IsNullOrEmpty(userid))
            {
                sql += " and b.userid='" + userid + "'";
            }
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += " and  processnumber='" + processnumber + "' ";
            }

            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and a.organizationid in(" + Organization + ")";

            }

            if (!string.IsNullOrEmpty(submitdate))
            {
                sql += " and  submitdate  = '" + submitdate + "' ";
            }

            try
            {
                List<TBL_MATERIALAPPLICATION> maList = maBLL.GetList(sql).ToList<TBL_MATERIALAPPLICATION>();
                json = JsonConvert.SerializeObject(maList);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region ------------------------------获取流程单------------------------------
        private void GetMaterialapplication(HttpContext context)
        {
            string materialapplicationid = context.Request["materialapplicationid"];
            string processnumber = context.Request["processnumber"];
            string sql = "";
            string json = "";
            try
            {
                if (!string.IsNullOrEmpty(materialapplicationid))
                {
                    sql += " and materialapplicationid='" + materialapplicationid + "'  ";
                }

                if (!string.IsNullOrEmpty(processnumber) && string.IsNullOrEmpty(materialapplicationid))
                {
                    sql += " and processnumber='" + processnumber + "'  ";
                }

                TBL_MATERIALAPPLICATION ma = maBLL.GetMaterialapplication(sql);

                if (ma == null)
                {
                    json = "{IsSuccess:'false',Message:'数据不存在！'}";
                }
                else
                {
                    json = JsonConvert.SerializeObject(ma);

                    json = "{IsSuccess:'true',Message:'" + json + "'}";
                }


            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'获取数据失败！'}";

            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region ------------------------------获取流程工作单------------------------------
        private void GetTask(HttpContext context)
        {
            string TaskCode = context.Request["TaskCode"];
            string json = "";

            try
            {
                WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(TaskCode);
                if (task == null)
                {
                    json = "{IsSuccess:'true',Message:'0'}";
                }
                else
                {
                    json = JsonConvert.SerializeObject(task);
                    json = "{IsSuccess:'true',Message:'1'}";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'获取数据失败！'}";
            }


            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }


        #endregion


        #region ------------------------------材料申请分页列表------------------------------
        private void getPageList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            // string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            string organizationid = context.Request["organizationid"];
            string processnumber = context.Request["processnumber"];
            string userid = context.Request["userid"];
            string submitdate = context.Request["submitdate"];

            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and a.organizationid in(" + Organization + ")";
                // sql += " and  a.organizationid = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += " and  processnumber='" + processnumber + "' ";
            }

            if (!string.IsNullOrEmpty(userid))
            {
                sql += "and b.userid='" + userid + "'";
            }

            if (!string.IsNullOrEmpty(submitdate))
            {
                sql += " and  submitdate  = '" + submitdate + "' ";
            }

            try
            {
                Dictionary<string, object> ma = maBLL.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
                json = JsonConvert.SerializeObject(ma);
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}