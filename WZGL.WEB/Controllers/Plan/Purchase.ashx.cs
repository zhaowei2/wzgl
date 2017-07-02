using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.COMMON;
using WZGL.IBLL.Plan;
using WZGL.MODEL.Plan;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Plan
{
    /// <summary>
    /// Purchase 的摘要说明
    /// </summary>
    public class Purchase : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式

        IPurchaseplanBLL purBll = BllFactory.GetPurchaseplanBLL();
        IPurchaseplan_detailBLL detailBll = BllFactory.GetPurchaseplan_detailBLL();
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " processnumber " : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? " desc" : context.Request["order"].ToString();
            string action = context.Request["action"];
            switch (action)
            {
                case "getPurchasePlanList":
                    getPurchasePlanList(context); break;//获取采购计划列表数据
                case "getPurchasePlan"://获取单个采购计划
                    getPurchasePlan(context); break;
                case "editPurchasePlan"://编辑单个采购计划
                    editPurchasePlan(context); break;
                case "addPurchasePlan"://添加单个采购计划
                    addPurchasePlan(context); break;
                case "del"://删除单个采购计划
                    del(context); break;
                    
            }
        }

        //获取采购计划列表数据
        private void getPurchasePlanList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string processnumber = context.Request["processnumber"];
            string Purchaseplantype = context.Request["Purchaseplantype"];
            if (!string.IsNullOrEmpty(processnumber))
            {
                sql += "  and processnumber like'%" + processnumber + "%'";
            }
            if (!string.IsNullOrEmpty(Purchaseplantype))
            {
                sql += "  and  Purchaseplantype ='" + Purchaseplantype + "'";
            }
            try
            {
                Dictionary<string, object> lists = purBll.GetPageList(sql, sort + " " + order, page, rows, out pcount, out totalcount);
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

        //获取单个采购计划
        private void getPurchasePlan(HttpContext context)
        {
            string json = string.Empty;
            string Purchaseplanid = context.Request["Purchaseplanid"];//采购计划ID
            string TASK_CODE = context.Request["TASK_CODE"];//材料计划ID

            List<TBL_PURCHASEPLAN> list = null;
            if (string.IsNullOrEmpty(TASK_CODE))
            {
                list = purBll.GetList(" Purchaseplanid='" + Purchaseplanid + "'").ToList<TBL_PURCHASEPLAN>();
            }
            else
            {
                list = purBll.GetList(" Processnumber='" + TASK_CODE + "'").ToList<TBL_PURCHASEPLAN>();
            }
            //返回数据的格式
            // string sql = "{单号:1,部门1,人员:1,project:[ {工程:1,detail:[{d:1},{d:2}]},{工程:2,detail:[{d:1},{d:2}},{工程:3,detail:[{d:1},{d:2}} ]}";

            TBL_PURCHASEPLAN model = null;

            if (list.Count > 0)
            {
                model = list[0];
                Purchaseplanid = model.Purchaseplanid;
                List<TBL_PURCHASEPLAN_DETAIL> list_detail = detailBll.GetList(" Purchaseplanid='" + Purchaseplanid + "' ").ToList<TBL_PURCHASEPLAN_DETAIL>();
                foreach (TBL_PURCHASEPLAN_DETAIL detail in list_detail)
                {
                    detail.Purchaseplanid = Purchaseplanid;
                }
                model.list_detail = list_detail;
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"该采购计划数据不存在！\"}";
            }

            json = JsonConvert.SerializeObject(model);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 修改采购计划
        /// </summary>
        /// <param name="context"></param>
        private void editPurchasePlan(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式
            WZGL.MODEL.Plan.TBL_PURCHASEPLAN model = new MODEL.Plan.TBL_PURCHASEPLAN();//采购计划

            // string planid = "";// ComFunction.GetId();//计划主键ID

            string project = context.Request["data"];
            string type = context.Request["type"];//是否需要发起操作
            try
            {
                List<WZGL.MODEL.Plan.TBL_PURCHASEPLAN> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Plan.TBL_PURCHASEPLAN>>(project);

                if (list.Count > 0)
                {
                    model = list[0];

                    foreach (TBL_PURCHASEPLAN_DETAIL detail in model.list_detail)
                    {
                        string mpjid = ComFunction.GetId();//计划主键ID
                        detail.Purchaseplanid = model.Purchaseplanid;
                        detail.Purchaseplandetailid = mpjid;
                    }

                    WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.Processnumber);//先获取任务单看看状态是否已启动了
                    bool re = false;
                    if (task == null)
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败，流程任务数据不存在！\"}";
                    }
                    else //if (task.STATUS == "0")
                    {
                        re = WZGL.BLL.BllFactory.GetPurchaseplanBLL().Update(model);//更新数据
                        string message = "";
                        re = WorkFlow.BLL.Operate.UpdateTaskJson(model.Processnumber, project, ref message);//更新任务单保存的业务json数据
                        if (re)
                        {
                            if (type == "send")
                            {
                                //发送流程
                                re = WorkFlow.BLL.Operate.StartFlow(task.TASK_CODE, task.DEFINE_CODE, CFunctions.getUserId(context),"");
                                if (re)
                                {
                                    json = "{\"IsSuccess\":\"true\",\"Message\":\"发起流程成功！\"}";
                                }
                                else
                                {
                                    json = "{\"IsSuccess\":\"false\",\"Message\":\"发起流程失败！\"}";
                                }
                            }
                            else
                            {
                                json = "{\"IsSuccess\":\"true\",\"Message\":\"修改成功！\"}";
                            }
                        }
                        else
                        {
                            json = "{\"IsSuccess\":\"false\",\"Message\":\"修改失败！\"}";
                        }
                    }
                   // else
                    //{
                    //    json = "{\"IsSuccess\":\"false\",\"Message\":\"审批中的流程材料单无法编辑！\"}";
                    //}
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
        /// 新增材料计划
        /// </summary>
        /// <param name="context"></param>
        private void addPurchasePlan(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式

            WZGL.MODEL.Plan.TBL_PURCHASEPLAN model = new MODEL.Plan.TBL_PURCHASEPLAN();//材料计划

            string planid = ComFunction.GetId();//计划主键ID
            string ids = context.Request["ids"];
            string[] strarr = ids.Split(',');
         
            string project = context.Request["data"];
            string type = context.Request["type"];

            try
            {
                List<WZGL.MODEL.Plan.TBL_PURCHASEPLAN> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Plan.TBL_PURCHASEPLAN>>(project);

                if (list.Count > 0)
                {
                    list[0].Purchaseplanid = planid;
                    model = list[0];
                    model.Ids = ids;
                    //model.ADD_EMP = CFunctions.getUserId(context);
                    foreach (TBL_PURCHASEPLAN_DETAIL mpj in model.list_detail)
                    {
                        mpj.Purchaseplanid = planid;
                        mpj.Purchaseplandetailid = ComFunction.GetId();//详细主键ID
                    }

                    bool re = WZGL.BLL.BllFactory.GetPurchaseplanBLL().Insert(model);//插入采购计划数据

                    WorkFlow.Model.FLOW_TASK task = new WorkFlow.Model.FLOW_TASK();
                    task.TASK_ID = Guid.NewGuid().ToString().ToUpper();
                    task.DEFINE_CODE = CFunctions.getFlowDefineId(context, "F7040DE6-522C-4719-8D42-78360A732400"); //"LCBM20161226160709"; "LCBM20170107160708";
                    task.TASK_CODE = model.Processnumber;// "CLJH" + DateTime.Now.ToString("yyyyMMddHHmmss"); ;
                    task.TASK_TILTE = "采购计划" + DateTime.Now.ToString("yyyyMMddHHmmss");
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
                                json = "{\"IsSuccess\":\"true\",\"Message\":\"发起成功！\"}";
                            }
                            else
                            {
                                json = "{\"IsSuccess\":\"false\",\"Message\":\"发起失败！\"}";
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

        private void del(HttpContext context)
        {
            string json = string.Empty;
            string Purchaseplanid = context.Request["Purchaseplanid"];
            List<TBL_PURCHASEPLAN> list = purBll.GetList(" Purchaseplanid='" + Purchaseplanid + "'  ").ToList<TBL_PURCHASEPLAN>();
            if (list.Count > 0)
            {
                TBL_PURCHASEPLAN model = list[0];
                //获取流程单的状态
                WorkFlow.Model.FLOW_TASK task = WorkFlow.BLL.Operate.GetTask(model.Processnumber);
                if (task != null)
                {
                    if (task.STATUS != "0")
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"删除失败,该计划的流程正在审批中，无法删除！\"}";
                    }
                    else
                    {
                        bool re = purBll.Delete(" Purchaseplanid='" + Purchaseplanid + "' ");
                        string message = "";
                        re = WorkFlow.BLL.Operate.DelTask(model.Processnumber, ref message);
                        if (re)
                        {
                            json = "{'IsSuccess':'true','Message':'删除成功！'}";
                        }
                        else
                        {
                            json = "{'IsSuccess':'false','Message':'删除失败！'}";
                        }
                    }
                }
                else
                {
                    bool re = purBll.Delete(" Purchaseplanid='" + Purchaseplanid + "' ");
                    if (re)
                    {
                        json = "{'IsSuccess':'true','Message':'删除成功！'}";
                    }
                    else
                    {
                        json = "{'IsSuccess':'false','Message':'删除失败！'}";
                    }
                }
                //json = "{'IsSuccess':'true','Message':'添加成功！'}";
            }
            else
            {
                json = "{'IsSuccess':'false','Message':'删除失败，数据不存在！'}";
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