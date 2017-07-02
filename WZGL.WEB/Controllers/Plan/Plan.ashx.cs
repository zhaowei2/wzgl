using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.COMMON;
using WZGL.IBLL.Plan;
using WZGL.IBLL.Warehouse;
using WZGL.MODEL.Plan;
using WZGL.MODEL.System;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Plan
{
    /// <summary>
    /// Plan 的摘要说明
    /// </summary>
    public class Plan : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式

        IMaterialplanBLL Bll = BllFactory.GetMaterialplanBLL();
        IMaterialplanprojectBLL projBll = BllFactory.GetMaterialplanprojectBLL();
        IMaterialplanprojectdetailBLL detailBll = BllFactory.GetMaterialplanprojectdetailBLL();
        IMaterialBLL matBll = BllFactory.GetMaterialBLL();

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " Submitdate " : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

            string action = context.Request["action"];
            switch (action)
            {
                case "addMaterialPlan"://添加材料计划
                    addMaterialPlan(context);
                    break;
                case "editMaterialPlan"://修改材料计划
                    editMaterialPlan(context);
                    break;

                case "getMaterialPlan"://获取流程类型和流程list
                    getMaterialPlan(context);
                    break;
                case "getMaterialPlanList"://获取流程类型和流程list
                    getMaterialPlanList(context);
                    break;
                case "del"://删除
                    del(context);
                    break;
                case "delMaterialPlanList"://删除材料计划
                    delMaterialPlanList(context);
                    break;
                case "sendMaterialPlanList"://发起材料计划流程
                    sendMaterialPlanList(context);
                    break;
                case "getMaterialList"://获取材料裂裂表
                    getMaterialList(context);
                    break;
                case "getUserOrgName"://获取材料裂裂表
                    getUserOrgName(context);
                    break;
                case "getPlanDetailList"://获取计划的详细材料列表
                    getPlanDetailList(context);
                    break;
                case "getFlowDetails"://获取流程任务单的步骤审核状态
                    getFlowDetails(context);
                    break;
                case "getFlowDetailsLog"://获取流程任务单审核日志
                    getFlowDetailsLog(context);
                    break;
            }
        }
        /// <summary>
        /// 新增材料计划
        /// </summary>
        /// <param name="context"></param>
        private void addMaterialPlan(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式
            // string sql = "{单号:1,部门1,人员:1,project:[ {工程:1,detail:[{d:1},{d:2}]},{工程:2,detail:[{d:1},{d:2}},{工程:3,detail:[{d:1},{d:2}} ]}";
            WZGL.MODEL.Plan.TBL_MATERIALPLAN model = new MODEL.Plan.TBL_MATERIALPLAN();//材料计划
            // List<TBL_MATERIALPLANPROJECT> list_project = new List<TBL_MATERIALPLANPROJECT>();//材料计划项目
            // List<TBL_MATERIALPLANPROJECTDETAIL> list_detail = new List<TBL_MATERIALPLANPROJECTDETAIL>(); //材料计划项目材料明细

            string planid = ComFunction.GetId();//计划主键ID

            string project = context.Request["data"];
            string type = context.Request["type"];

            try
            {
                List<WZGL.MODEL.Plan.TBL_MATERIALPLAN> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Plan.TBL_MATERIALPLAN>>(project);

                if (list.Count > 0)
                {
                    list[0].Materialplanid = planid;
                    model = list[0];
                    model.ADD_EMP = CFunctions.getUserId(context);
                    foreach (TBL_MATERIALPLANPROJECT mpj in model.list_project)
                    {
                        string mpjid = ComFunction.GetId();//计划主键ID
                        mpj.Materialplanid = planid;
                        mpj.Materialplanprojectid = mpjid;
                        foreach (TBL_MATERIALPLANPROJECTDETAIL mpjd in mpj.list_detail)
                        {
                            mpjd.Materialplanprojectdetailid = ComFunction.GetId();//计划主键ID
                            mpjd.Materialplanprojectid = mpjid;
                        }
                    }

                    bool re = WZGL.BLL.BllFactory.GetMaterialplanBLL().Add(model, model.list_project, null);
                    WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                    task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                    task.DEFINE_CODE = CFunctions.getFlowDefineId(context, "F7040DE6-522C-4719-8D42-78360A732400"); //"LCBM20161226160709";
                    task.TASK_CODE = model.Processnumber;// "CLJH" + DateTime.Now.ToString("yyyyMMddHHmmss"); ;
                    task.TASK_TILTE = "材料计划" + DateTime.Now.ToString("yyyyMMddHHmmss");
                    task.STATUS = "0";
                    task.TASK_TYPE = "F7040DE6-522C-4719-8D42-78360A732400";
                    task.ADD_EMP = CFunctions.getUserId(context);// "1";//context.Request["ADD_EMP"];
                    //task.ADD_TIME = DateTime.Now;
                    task.TASK_JSON = project;// context.Request["TASK_JSON"];
                    //model.ADD_EMP
                    bool result = WorkFlow.BLL.Operate.AddTask(task);

                    if (result)
                    {
                        if (type == "send")
                        {
                            //发送流程
                            re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, CFunctions.getUserId(context),"");
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
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据失败！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"保存失败！\"}";
            }
            //json = json;// JsonConvert.SerializeObject(project);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 修改材料计划
        /// </summary>
        /// <param name="context"></param>
        private void editMaterialPlan(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式
            WZGL.MODEL.Plan.TBL_MATERIALPLAN model = new MODEL.Plan.TBL_MATERIALPLAN();//材料计划

            // string planid = "";// ComFunction.GetId();//计划主键ID

            string project = context.Request["data"];
            string reason = context.Request["reason"];
            string type = context.Request["type"];//是否需要发起操作
            try
            {
                List<WZGL.MODEL.Plan.TBL_MATERIALPLAN> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Plan.TBL_MATERIALPLAN>>(project);

                if (list.Count > 0)
                {
                    //list[0].Materialplanid = planid;
                    model = list[0];


                    foreach (TBL_MATERIALPLANPROJECT mpj in model.list_project)
                    {
                        string mpjid = ComFunction.GetId();//计划主键ID
                        mpj.Materialplanid = model.Materialplanid;
                        mpj.Materialplanprojectid = mpjid;
                        foreach (TBL_MATERIALPLANPROJECTDETAIL mpjd in mpj.list_detail)
                        {
                            mpjd.Materialplanprojectdetailid = ComFunction.GetId();//计划主键ID
                            mpjd.Materialplanprojectid = mpjid;
                        }
                    }
                    WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.Processnumber);
                    bool re = false;
                    re = WZGL.BLL.BllFactory.GetMaterialplanBLL().Update(model);
                    // if (task != null && task.STATUS == "0")
                    //{
                    re = WZGL.BLL.BllFactory.GetMaterialplanBLL().Update(model);
                    string message = "";
                    re = WorkFlow.BLL.Operate.UpdateTaskJson(model.Processnumber, project, ref message);
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
                                    re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, CFunctions.getUserId(context),reason);
                                    if (re)
                                    {
                                        json = "{\"IsSuccess\":\"true\",\"Message\":\"发起成功！\"}";
                                    }
                                    else
                                    {
                                        json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败！\"}";
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
                    // }
                    // else
                    // {
                    //  json = "{\"IsSuccess\":\"false\",\"Message\":\"审批中的流程材料单无法编辑！\"}";
                    //  }



                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"解析数据失败！\"}";
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"保存失败！\"}";
            }
            //json = json;// JsonConvert.SerializeObject(project);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 获取材料计划
        /// </summary>
        /// <param name="context"></param>
        private void getMaterialPlan(HttpContext context)
        {
            string json = string.Empty;
            string Materialplanid = context.Request["Materialplanid"];//材料计划ID
            string TASK_CODE = context.Request["TASK_CODE"];//材料计划ID

            List<TBL_MATERIALPLAN> list = null;
            if (string.IsNullOrEmpty(TASK_CODE))
            {
                list = Bll.GetList(" Materialplanid='" + Materialplanid + "'").ToList<TBL_MATERIALPLAN>();
            }
            else
            {
                list = Bll.GetList(" Processnumber='" + TASK_CODE + "'").ToList<TBL_MATERIALPLAN>();
            }
            //返回数据的格式
            // string sql = "{单号:1,部门1,人员:1,project:[ {工程:1,detail:[{d:1},{d:2}]},{工程:2,detail:[{d:1},{d:2}},{工程:3,detail:[{d:1},{d:2}} ]}";

            TBL_MATERIALPLAN model = null;

            if (list.Count > 0)
            {
                model = list[0];
                Materialplanid = model.Materialplanid;
                List<TBL_MATERIALPLANPROJECT> list_proj = projBll.GetList(" Materialplanid='" + Materialplanid + "' ").ToList<TBL_MATERIALPLANPROJECT>();
                foreach (TBL_MATERIALPLANPROJECT pro in list_proj)
                {
                    List<TBL_MATERIALPLANPROJECTDETAIL> list_detail = detailBll.GetList(" Materialplanprojectid='" + pro.Materialplanprojectid + "' ").ToList<TBL_MATERIALPLANPROJECTDETAIL>();
                    pro.list_detail = list_detail;
                }
                model.list_project = list_proj;
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"材料数据计划不存在！\"}";
            }

            json = JsonConvert.SerializeObject(model);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 获取材料计划列表
        /// </summary>
        /// <param name="context"></param>
        private void getMaterialPlanList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string processnumber = context.Request["processnumber"];
            string plantype = context.Request["plantype"];

            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += " and processnumber='" + processnumber + "'";
            }
            if (!string.IsNullOrEmpty(plantype))
            {
                sql += " and plantype='" + plantype + "'";
            }

            try
            {
                Dictionary<string, object> lists = Bll.GetPageList(sql, sort + " " + order, page, rows, out pcount, out totalcount);
                if (string.IsNullOrEmpty(type))
                {
                    json = JsonConvert.SerializeObject(lists);
                }
                else
                {
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + totalcount + "}";
                    //json = JsonConvert.SerializeObject("{IsSuccess:'true',Count:'" + totalcount + "'}");
                }
            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":服务器交互失败}";
                // json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'服务器交互失败！'}");
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }


        private void delMaterialPlanList(HttpContext context)
        {
            string json = string.Empty;
            string Materialplanid = context.Request["Materialplanid"];
            List<TBL_MATERIALPLAN> list = Bll.GetList(" Materialplanid='" + Materialplanid + "'  ").ToList<TBL_MATERIALPLAN>();
            if (list.Count > 0)
            {
                TBL_MATERIALPLAN model = list[0];
                //获取流程单的状态
                WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.Processnumber);
                if (task != null)
                {
                    if (task.STATUS != "0")
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败，该计划的流程正在审批中，无法删除！\"}";
                    }
                    else
                    {
                        bool re = Bll.Delete(Materialplanid);
                        if (re)
                        {
                            json = "{\"IsSuccess\":\"true\",\"Message\":\"删除成功！\"}";
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败！\"}";
                        }
                    }
                }
                else
                {
                    bool re = Bll.Delete(Materialplanid);
                    if (re)
                    {
                        json = "{\"IsSuccess\":\"true\",\"Message\":\"删除成功！\"}";
                    }
                    else
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败！\"}";
                    }
                }
                //json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败，数据不存在！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 发起材料审批流程
        /// </summary>
        /// <param name="context"></param>
        private void sendMaterialPlanList(HttpContext context)
        {
            string json = string.Empty;
            string Materialplanid = context.Request["Materialplanid"];


            List<TBL_MATERIALPLAN> list = Bll.GetList(" Materialplanid='" + Materialplanid + "'  ").ToList<TBL_MATERIALPLAN>();
            if (list.Count > 0)
            {
                TBL_MATERIALPLAN model = list[0];
                //获取流程单的状态
                WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.Processnumber);
                if (task != null)
                {
                    if (task.STATUS != "0")
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，该计划已经发起审批！\"}";
                    }
                    else
                    {
                        //发送流程
                        bool re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, CFunctions.getUserId(context),"");
                        if (re)
                        {
                            json = "{\"IsSuccess\":\"true\",\"Message\":\"发起流程成功！\"}";
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"false\",\"Message\":\"发起流程失败！\"}";
                        }
                    }
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，流程任务数据不存在！\"}";
                }
                //json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，数据不存在！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 删除计划
        /// </summary>
        /// <param name="context"></param>
        private void del(HttpContext context)
        {
            string json = string.Empty;

            string materialplanid = context.Request["materialplanid"];
            List<WZGL.MODEL.Plan.TBL_MATERIALPLAN> list = Bll.GetList("  materialplanid='" + materialplanid + "'").ToList<WZGL.MODEL.Plan.TBL_MATERIALPLAN>();
            if (list.Count > 0)
            {
                WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(list[0].Processnumber);
                if (task != null && task.STATUS != "0")
                {
                    //未启动的可以删除
                    json = "{'IsSuccess':'false','Message':'该计划已处在流程之中，无法删除!'}";

                }
                else
                {
                    try
                    {
                        bool re = Bll.Delete(materialplanid);
                        string message = "";
                        re = WorkFlow.BLL.Operate.DelTask(list[0].Processnumber, ref message);
                        if (re)
                        {
                            json = "{'IsSuccess':'true','Message':'删除成功'}";
                        }
                        else
                        {
                            json = "{'IsSuccess':'false','Message':'删除失败'}";
                        }
                    }
                    catch
                    {

                        json = "{'IsSuccess':'false','Message':'服务器交互失败'}";
                    }
                }
            }
            else
            {
                json = "{'IsSuccess':'false','Message':'未查询到该计划，请刷新页面后重试!'}";
                context.Response.ContentType = "application/json";
                //返回JSON结果
                context.Response.Write(json);
                context.Response.End();
                return;
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果

            context.Response.Write(json);

            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 获取材料列表
        /// </summary>
        /// <param name="context"></param>
        private void getMaterialList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string caterotyid = context.Request["caterotyid"];
            string searchtype = context.Request["searchtype"];
            string namecode = context.Request["namecode"];

            if (!string.IsNullOrEmpty(caterotyid))
            {
                sql += "  and t.materialcategoryid ='" + caterotyid + "' ";
            }
            if (!string.IsNullOrEmpty(namecode))
            {
                if (searchtype == "name")
                {
                    sql += "  and  name like'%" + namecode + "%'";
                }
                else
                {
                    sql += "  and  code like'%" + namecode + "%'";
                }
            }


            try
            {
                sort = " name ";
                Dictionary<string, object> lists = matBll.GetPageList(sql, sort + " " + order, page, rows, out pcount, out totalcount);
                if (string.IsNullOrEmpty(type))
                {
                    json = JsonConvert.SerializeObject(lists);
                }
                else
                {
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + totalcount + "}";
                    //json = JsonConvert.SerializeObject("{IsSuccess:'true',Count:'" + totalcount + "'}");
                }
            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":服务器交互失败}";
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        /// <summary>
        /// 获取当前登陆人的信息
        /// </summary>
        /// <param name="context"></param>
        private void getUserOrgName(HttpContext context)
        {
            string json = string.Empty;
            TBL_USER user = CFunctions.getUser(context);
            if (user == null)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"获取当前用户失败\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"true\",\"Message\":\"获取成功\",\"userid\":\"" + user.userid + "\",\"name\":\"" + user.name + "\",\"organizationid\":\"" + user.organizationid + "\",\"organizationname\":\"" + user.organizationname + "\"}";
            }

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
        }

        /// <summary>
        /// 获取材料详细信息
        /// </summary>
        /// <param name="context"></param>
        private void getPlanDetailList(HttpContext context)
        {
            string json = "";
            string ids = context.Request["ids"];
            string[] strarr = ids.Split(',');
            string planids = "";
            try
            {
                foreach (string tr in strarr)
                {
                    if (!string.IsNullOrEmpty(tr))
                    {
                        planids += "'" + tr + "',";
                    }
                }
                planids = planids.Substring(0, planids.Length - 1);

                string sql = @"  materialplanprojectid IN ( SELECT materialplanprojectid FROM dbo.tbl_materialplanproject 
                                WHERE materialplanid IN (" + planids + "))  GROUP BY a.Materialid,A.Unitprice,A.Unit,b.name,b.code ";
                List<TBL_MATERIALPLANPROJECTDETAIL> list_detail = detailBll.GetSumList(sql).ToList<TBL_MATERIALPLANPROJECTDETAIL>();

                json = JsonConvert.SerializeObject(list_detail);

            }
            catch
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"获取失败\"}";
            }
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        /// <summary>
        /// 获取流程任务单的审核记录
        /// </summary>
        /// <param name="context"></param>
        private void getFlowDetails(HttpContext context)
        {
            string json = "";
            string tarkcode = context.Request["TASK_CODE"];

            List<WorkFlow.Model.FLOW_DETAILS> list = WorkFlow.BLL.Operate.getDetailList(tarkcode);
            json = JsonConvert.SerializeObject(list);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        /// <summary>
        /// 获取流程任务单审核日志
        /// </summary>
        /// <param name="context"></param>
        private void getFlowDetailsLog(HttpContext context)
        {
            string json = "";
            string tarkcode = context.Request["TASK_CODE"];

            List<WorkFlow.Model.FLOW_DETAILS_LOG> list = WorkFlow.BLL.Operate.getDetailLogList(tarkcode);
            json = JsonConvert.SerializeObject(list);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class TClass
    {
        public string Name { get; set; }

        public List<TClass1> detail { get; set; }
    }
    public class TClass1
    {
        public string Name { get; set; }
    }
}