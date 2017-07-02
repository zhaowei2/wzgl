using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WorkFlow.Model;
using WZGL.IBLL.Flow;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Flow
{
    /// <summary>
    /// Flow 的摘要说明
    /// </summary>
    public class Flow : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        string userid = "",roleid="";
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "date" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();

          //  userid=CFunctions.getUserId(context);
           /// roleid = CFunctions.getRoleId(context);
            string action = context.Request["action"];
            switch (action)
            {
                case "getTypeAndFlowList"://获取流程类型和流程list
                    getTypeAndFlowList(context);
                    break;
                case "addTask"://添加申请单
                    addTask(context);
                    break;
                case "sendTask"://发送申请单
                    sendTask(context);
                    break;
                case "addAndSendTask"://添加并发送申请单
                    addAndSendTask(context);
                    break;
                case "Audit": //审核
                    Audit(context);
                    break;
                case "Back": //打回上一步
                    Back(context);
                    break;
                case "getMyTask": //获取我的待办流程
                    getMyTask(context);
                    break;
                case "getMyTaskByParentCode": //获取我的待办流程---通过模板id
                    getMyTaskByParentCode(context);
                    break;
                case "getTypeList"://获取流程类型list
                    getTypeList(context);
                    break;
                case "getTaskList"://获取任务单列表
                    getTaskList(context);
                    break;
                case "getAllTypeList"://获取所有的流程类型和数量
                    getAllTypeList(context);
                    break;
                case "getMyHandledTypeList"://获取我处理过的流程类型和数量
                    getMyHandledTypeList(context);
                    break;
                case "getMyHandledTask"://获取我处理过的任务单列表
                    getMyHandledTask(context);
                    break;
                    
            }
            //     context.Response.ContentType = "text/plain";
            // context.Response.Write("Hello World");
        }
        /// <summary>
        /// 获取流程类型和流程列表
        /// </summary>
        /// <param name="context"></param>
        private void getTypeAndFlowList(HttpContext context)
        {
            try
            {
                List<WorkFlow.Model.FLOW_TYPE> typelist = WorkFlow.BLL.Operate.getFlowType();//获取所有流程类别

                List<WorkFlow.Model.FLOW_DEFINE> lclist = WorkFlow.BLL.Operate.getDefineList("");//获取所有流程定义

                List<FlowTypeData> list = new List<FlowTypeData>();//结构树
                Dictionary<string,string> list_define = CFunctions.getMyFlowDefine(context);//当前登录人有权限的流程
                foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                {
                    List<WorkFlow.Model.FLOW_DEFINE> lclist_temp = lclist.Where(p => (p.TYPE_CODE == type.TYPE_CODE) && (list_define.ContainsKey(p.DEFINE_CODE))).ToList<WorkFlow.Model.FLOW_DEFINE>();
                    FlowTypeData ftd = new FlowTypeData();
                    ftd.type = type;
                    foreach (WorkFlow.Model.FLOW_DEFINE fdi in lclist_temp)
                    {
                        ftd.list.Add(fdi);
                    }
                    list.Add(ftd);
                }

                string json = JsonConvert.SerializeObject(list);
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{'IsSuccess':'false','Message':'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }

        /// <summary>
        /// 获取流程类型列表
        /// </summary>
        /// <param name="context"></param>
        private void getTypeList(HttpContext context)
        {
            try
            {
                List<WorkFlow.Model.FLOW_TYPE> typelist = WorkFlow.BLL.Operate.getFlowType();//获取所有流程类别
                List<WorkFlow.Model.FLOW_DEFINE> definelist = WorkFlow.BLL.Operate.getDefineList("");//获取所有的流程

                List<FlowTypeData> list = new List<FlowTypeData>();//结构树
                IFlow_Derive_RelationBLL reBll=   BLL.BllFactory.GetFlow_Derive_RelationBLL();
              
                foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                {
                    FlowTypeData ftd = new FlowTypeData();
                    ftd.type = type;//流程类型
                    int count = 0;
                    //找到该类型的流程模板
                    List<MODEL.Flow.FLOW_DERIVE_RELATION> list_relation = reBll.GetDistinctList(" and  b.type_code='" + type .TYPE_CODE+ "' ").ToList<MODEL.Flow.FLOW_DERIVE_RELATION>();

                    foreach (MODEL.Flow.FLOW_DERIVE_RELATION relation in list_relation)
                    {
                        //1-----找到模板的流程信息
                        List<WorkFlow.Model.FLOW_DEFINE> lclist_mb = definelist.Where(p => p.DEFINE_CODE == relation.define_code_parent).ToList<WorkFlow.Model.FLOW_DEFINE>();
                        if (lclist_mb.Count > 0)
                        {
                            foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_mb)
                            {
                                FlowData fd = new FlowData();//
                                fd.Name = dmodel.DEFINE_NAME;
                                fd.Code = dmodel.DEFINE_CODE;
                                fd.Count = WorkFlow.BLL.Operate.getMyTaskByParentCode(CFunctions.getUserId(context), CFunctions.getRoleId(context), ftd.type.TYPE_CODE, fd.Code).Count;
                                count += fd.Count;
                                ftd.datalist.Add(fd);
                            }
                        }
                    }
                    ftd.Count = count;
                    list.Add(ftd);
                }
                //foreach (FlowTypeData ftd in list)
                //{
                //    int count0 = 0;
                //    foreach (FlowData fd in ftd.datalist)
                //    {
                //        int count1 = 0;
                //        ////找到模板的子级的流程信息
                //        count1 = WorkFlow.BLL.Operate.getMyTaskByParentCode(CFunctions.getUserId(context), CFunctions.getRoleId(context), ftd.type.TYPE_CODE, fd.Code).Count;
                //        // List<FLOW_DEFINE> list1 = WorkFlow.BLL.Operate.getDefineList(" and DEFINE_CODE in (SELECT DEFINE_CODE_CHILD FROM dbo.FLOW_DERIVE_RELATION WHERE DEFINE_CODE_PARENT='"+fd.Code +"') ").ToList<FLOW_DEFINE>();
                       
                //        //foreach(FLOW_DEFINE define in list1)
                //        //{
                //        //    count1 =count1+ WorkFlow.BLL.Operate.getMyTask(CFunctions.getUserId(context), CFunctions.getRoleId(context), ftd.type.TYPE_CODE, define.DEFINE_CODE).Count;
                //        //}
                //        fd.Count = count1;
                //        count0 += count1;
                //        //List<MODEL.Flow.FLOW_DERIVE_RELATION> list_relation = reBll.GetDistinctList(" and  b.type_code='" + type. + "' ").ToList<MODEL.Flow.FLOW_DERIVE_RELATION>();
                //    }
                //    ftd.Count = count0;
                //}

                //    if(1==1){
                //        //找到模板的子级流程信息
                //        List<WorkFlow.Model.FLOW_DEFINE> lclist_child = definelist.Where(p => p.DEFINE_CODE == relation.define_code_parent).ToList<WorkFlow.Model.FLOW_DEFINE>();

                //        foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_temp)
                //        {
                //            FlowData fd = new FlowData();//
                //            fd.Name = dmodel.DEFINE_NAME;
                //            fd.Code = dmodel.DEFINE_CODE;
                //            //类别和名称下有多少流程
                //            fd.Count = WorkFlow.BLL.Operate.getMyTask(CFunctions.getUserId(context), CFunctions.getRoleId(context), type.TYPE_CODE, dmodel.DEFINE_CODE).Count;
                //            count += fd.Count;
                //            ftd.datalist.Add(fd);

                //        }


                //    }

                //    List<WorkFlow.Model.FLOW_DEFINE> lclist_temp = definelist.Where(p => p.TYPE_CODE == type.TYPE_CODE).ToList<WorkFlow.Model.FLOW_DEFINE>();
                //    FlowTypeData ftd = new FlowTypeData();
                //    int count = 0;
                //    foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_temp)
                //    {
                //        FlowData fd = new FlowData();//
                //        fd.Name = dmodel.DEFINE_NAME;
                //        fd.Code = dmodel.DEFINE_CODE;
                //        //类别和名称下有多少流程
                //        fd.Count = WorkFlow.BLL.Operate.getMyTask(CFunctions.getUserId(context), CFunctions.getRoleId(context), type.TYPE_CODE, dmodel.DEFINE_CODE).Count;
                //        count += fd.Count;
                //        ftd.datalist.Add(fd);

                //    }
                //    ftd.type = type;
                //    ftd.Count = count;

                //    list.Add(ftd);
                //}

                string json = JsonConvert.SerializeObject(list);
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }

        /// <summary>
        /// 添加申请单
        /// </summary>
        /// <param name="context"></param>
        private void addTask(HttpContext context)
        {
            string json = string.Empty;
            WorkFlow.Model.FLOW_TASK model = new WorkFlow.Model.FLOW_TASK();
            model.TASK_ID = Guid.NewGuid().ToString().ToUpper();
            model.DEFINE_CODE = context.Request["DEFINE_CODE"];
            model.TASK_CODE = context.Request["TASK_CODE"];
            model.TASK_TILTE = context.Request["TASK_TILTE"];
            model.STATUS = context.Request["STATUS"];
            model.TASK_TYPE = context.Request["TASK_TYPE"];
            model.ADD_EMP = CFunctions.getUserId(context);//context.Request["ADD_EMP"];
            model.ADD_TIME = DateTime.Now;
            model.TASK_JSON = context.Request["TASK_JSON"];
            //model.ADD_EMP
            bool result = WorkFlow.BLL.Operate.AddTask(model);
            if (result)
            {
                json = "{\"IsSuccess\":\"true\",\"Message\":\"添加成功！\"}";
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"添加失败！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 发送申请单
        /// </summary>
        /// <param name="context"></param>
        private void sendTask(HttpContext context)
        {
            string json = string.Empty;
            string TASK_CODE = context.Request["TASK_CODE"];
            string DEFINE_CODE = context.Request["DEFINE_CODE"];

            try
            {
                WorkFlow.Model.FLOW_TASK model = WorkFlow.BLL.Operate.GetTask(TASK_CODE);
                if (model.STATUS != "0") //状态为0，启动流程
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"流程已经启动，无法再次启动！\"}";
                }
                else
                {
                    bool re = WorkFlow.BLL.Operate.StartFlow(TASK_CODE, DEFINE_CODE,CFunctions.getUserId(context),"");
                    if (re)
                    {
                        json = "{\"IsSuccess\":\"true\",\"Message\":\"发送成功！\"}";
                    }
                    else
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"发送失败！\"}";
                    }
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 添加并发送申请单
        /// </summary>
        /// <param name="context"></param>
        private void addAndSendTask(HttpContext context)
        {
            string json = string.Empty;
            WorkFlow.Model.FLOW_TASK model = new WorkFlow.Model.FLOW_TASK();
            model.TASK_ID = Guid.NewGuid().ToString().ToUpper();
            model.DEFINE_CODE = context.Request["DEFINE_CODE"];
            model.TASK_CODE = context.Request["TASK_CODE"];
            model.TASK_TILTE = context.Request["TASK_TILTE"];
            model.STATUS = "0";// context.Request["STATUS"];
            model.TASK_TYPE = context.Request["TASK_TYPE"];
            model.ADD_EMP = CFunctions.getUserId(context);//context.Request["ADD_EMP"];
            model.ADD_TIME = DateTime.Now;
            model.TASK_JSON = context.Request["TASK_JSON"];
            //model.ADD_EMP
            if (WorkFlow.BLL.Operate.GetTask(model.TASK_CODE) != null)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"该任务单已存在！\"}";
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
                return;
            }
            bool result = WorkFlow.BLL.Operate.AddTask(model);
            if (result)
            {
                bool re = WorkFlow.BLL.Operate.StartFlow(model.TASK_CODE, model.DEFINE_CODE, CFunctions.getUserId(context),"");
                if (re)
                {
                    json = "{\"IsSuccess\":\"true\",\"Message\":\"发送成功！\"}";
                }
                else
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"发送失败！\"}";
                }
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"添加失败！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();

        }

        /// <summary>
        /// 审核流程
        /// </summary>
        /// <param name="context"></param>
        private void Audit(HttpContext context)
        {
            string json = string.Empty;
            string TASK_CODE = context.Request["TASK_CODE"];
            string SEQ = context.Request["SEQ"];
            string reason = context.Request["REASON"];//审批理由
            try
            {
                WorkFlow.Model.FLOW_TASK model = WorkFlow.BLL.Operate.GetTask(TASK_CODE);

                if (model.STATUS == "E")
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"流程已经结束，无法操作！\"}";
                    context.Response.ContentType = "application/json";
                    context.Response.Write(json);
                    context.ApplicationInstance.CompleteRequest();
                    return;
                }

                if (model.SEQ != SEQ) //是否已经处理过了
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"流程已经审核，无法再次操作！\"}";
                }
                else
                {
                    string meesage = "";
                    bool re = WorkFlow.BLL.Operate.AuditStep(TASK_CODE, SEQ, CFunctions.getUserId(context), CFunctions.getRoleId(context), reason, ref meesage);
                    if (re)
                    {
                        json = "{\"IsSuccess\":\"true\",\"Message\":\"审核成功！\"}";
                    }
                    else
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"审核失败," + meesage + "！\"}";
                    }
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 打回上一步
        /// </summary>
        /// <param name="context"></param>
        private void Back(HttpContext context)
        {
            string json = string.Empty;
            string TASK_CODE = context.Request["TASK_CODE"];
            string SEQ = context.Request["SEQ"];
            string reason = context.Request["REASON"];

            try
            {
                WorkFlow.Model.FLOW_TASK model = WorkFlow.BLL.Operate.GetTask(TASK_CODE);
                if (model.STATUS == "E")
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"流程已经结束，无法操作！\"}";
                    context.Response.ContentType = "application/json";
                    context.Response.Write(json);
                    context.ApplicationInstance.CompleteRequest();
                    return;
                }

                if (model.SEQ != SEQ) //是否已经处理过了
                {
                    json = "{\"IsSuccess\":\"false\",\"Message\":\"流程已经打回，无法再次操作！\"}";
                }
                else
                {
                    bool re = WorkFlow.BLL.Operate.BackStep(TASK_CODE, SEQ, CFunctions.getUserId(context), CFunctions.getRoleId(context), reason);
                    if (re)
                    {
                        json = "{\"IsSuccess\":\"true\",\"Message\":\"打回成功！\"}";
                    }
                    else
                    {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"打回失败！\"}";
                    }
                }
            }
            catch (Exception ex)
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"" + ex.ToString() + "！\"}";
            }
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.ApplicationInstance.CompleteRequest();
        }

        /// <summary>
        /// 获取我的待办流程
        /// </summary>
        /// <param name="context"></param>
        private void getMyTask(HttpContext context)
        {
            try
            {
                string json = "";
                string TYPE_CODE = context.Request["TYPE_CODE"];
                string DEFINE_CODE = context.Request["DEFINE_CODE"];
                string type = context.Request["type"];

                List<WorkFlow.Model.FLOW_TASK> list = WorkFlow.BLL.Operate.getMyTask(CFunctions.getUserId(context), CFunctions.getRoleId(context), TYPE_CODE, DEFINE_CODE);//获取我的代办所有流程类别


                if (string.IsNullOrEmpty(type))
                {
                    var total = list.Count;
                    int pcount = 0;
                    int totalcount = list.Count;

                    list = list.Skip((page - 1) * rows).Take(rows).ToList<WorkFlow.Model.FLOW_TASK>();
                    //json = JsonConvert.SerializeObject(list);

                    Dictionary<string, object> obj = new Dictionary<string, object>();
                    obj.Add("total", totalcount);
                    obj.Add("rows", list);
                    json = JsonConvert.SerializeObject(obj);

                }
                else
                {
                    int count = list.Count;
                    // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
                }

                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }
        
                /// <summary>
        /// 获取我的待办流程
        /// </summary>
        /// <param name="context"></param>
        private void getMyTaskByParentCode(HttpContext context)
        {
            try
            {
                string json = "";
                string TYPE_CODE = context.Request["TYPE_CODE"];
                string DEFINE_CODE = context.Request["DEFINE_CODE"];
                string type = context.Request["type"];

                List<WorkFlow.Model.FLOW_TASK> list = WorkFlow.BLL.Operate.getMyTaskByParentCode(CFunctions.getUserId(context), CFunctions.getRoleId(context), TYPE_CODE, DEFINE_CODE);//获取我的代办所有流程类别


                if (string.IsNullOrEmpty(type))
                {
                    var total = list.Count;
                    int pcount = 0;
                    int totalcount = list.Count;

                    list = list.Skip((page - 1) * rows).Take(rows).ToList<WorkFlow.Model.FLOW_TASK>();
                    //json = JsonConvert.SerializeObject(list);

                    Dictionary<string, object> obj = new Dictionary<string, object>();
                    obj.Add("total", totalcount);
                    obj.Add("rows", list);
                    json = JsonConvert.SerializeObject(obj);

                }
                else
                {
                    int count = list.Count;
                    // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
                }

                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }
        /// <summary>
        /// 获取任务单列表
        /// </summary>
        /// <param name="context"></param>
        private void getTaskList(HttpContext context)
        {
            try
            {
                string json = "";
                string TYPE_CODE = context.Request["TYPE_CODE"];
                string DEFINE_CODE = context.Request["DEFINE_CODE"];
                string DEFINE_PARENT_CODE = context.Request["DEFINE_PARENT_CODE"];
                string type = context.Request["type"];
                string user = context.Request["user"];
                string begin = context.Request["begin"];
                string end = context.Request["end"];
                string searchInform = context.Request["searchInform"];
                string where = "";
                if (!string.IsNullOrEmpty(user))
                {
                    where += " and A.SEND_EMP='" + CFunctions.getUserId(context) + "' ";
                }

                if (!string.IsNullOrEmpty(searchInform))
                {
                    where += " and A.TASK_TILTE like'%" + searchInform + "%' ";
                }

                
                if (!string.IsNullOrEmpty(TYPE_CODE))
                {
                    where += " and TASK_TYPE='" + TYPE_CODE + "'";
                }
                if (!string.IsNullOrEmpty(DEFINE_CODE))
                {
                    where += " and DEFINE_CODE='" + DEFINE_CODE + "'";
                }
                if (!string.IsNullOrEmpty(DEFINE_PARENT_CODE))
                {
                    where += " and DEFINE_CODE in (select DEFINE_CODE_CHILD from FLOW_DERIVE_RELATION where DEFINE_CODE_PARENT='" + DEFINE_PARENT_CODE + "') ";
                }
                

                if (!string.IsNullOrEmpty(begin))
                {
                    where += " and ADD_TIME >='" + begin + "'";
                }
                if (!string.IsNullOrEmpty(end))
                {
                    where += " and ADD_TIME <='" + end + "'";
                }
                List<WorkFlow.Model.FLOW_TASK> list = WorkFlow.BLL.Operate.getTaskList(where);//获取所有流程任务单


                if (string.IsNullOrEmpty(type))
                {
                    var total = list.Count;
                    int pcount = 0;
                    int totalcount = list.Count;

                    list = list.Skip((page - 1) * rows).Take(rows).ToList<WorkFlow.Model.FLOW_TASK>();
                    //json = JsonConvert.SerializeObject(list);

                    Dictionary<string, object> obj = new Dictionary<string, object>();
                    obj.Add("total", totalcount);
                    obj.Add("rows", list);
                    json = JsonConvert.SerializeObject(obj);

                }
                else
                {
                    int count = list.Count;
                    // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
                }
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }

        /// <summary>
        /// 获取流程类型列表
        /// </summary>
        /// <param name="context"></param>
        private void getAllTypeList(HttpContext context)
        {
            try
            {
                List<WorkFlow.Model.FLOW_TYPE> typelist = WorkFlow.BLL.Operate.getFlowType();//获取所有流程类别
                List<WorkFlow.Model.FLOW_DEFINE> definelist = WorkFlow.BLL.Operate.getDefineList("");//获取所有的流程

                List<FlowTypeData> list = new List<FlowTypeData>();//结构树

                //foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                //{
                //    List<WorkFlow.Model.FLOW_DEFINE> lclist_temp = definelist.Where(p => p.TYPE_CODE == type.TYPE_CODE).ToList<WorkFlow.Model.FLOW_DEFINE>();
                //    FlowTypeData ftd = new FlowTypeData();
                //    int count = 0;
                //    foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_temp)
                //    {
                //        FlowData fd = new FlowData();//
                //        fd.Name = dmodel.DEFINE_NAME;
                //        fd.Code = dmodel.DEFINE_CODE;
                //        //类别和名称下有多少流程
                //        fd.Count = WorkFlow.BLL.Operate.getMyTask("", "", type.TYPE_CODE, dmodel.DEFINE_CODE).Count;
                //        count += fd.Count;
                //        ftd.datalist.Add(fd);

                //    }
                //    ftd.type = type;
                //    ftd.Count = count;

                //    list.Add(ftd);
                //}
                IFlow_Derive_RelationBLL reBll = BLL.BllFactory.GetFlow_Derive_RelationBLL();

                foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                {
                    FlowTypeData ftd = new FlowTypeData();
                    ftd.type = type;//流程类型
                    int count = 0;
                    //找到该类型的流程模板
                    List<MODEL.Flow.FLOW_DERIVE_RELATION> list_relation = reBll.GetDistinctList(" and  b.type_code='" + type.TYPE_CODE + "' ").ToList<MODEL.Flow.FLOW_DERIVE_RELATION>();

                    foreach (MODEL.Flow.FLOW_DERIVE_RELATION relation in list_relation)
                    {
                        //1-----找到模板的流程信息
                        List<WorkFlow.Model.FLOW_DEFINE> lclist_mb = definelist.Where(p => p.DEFINE_CODE == relation.define_code_parent).ToList<WorkFlow.Model.FLOW_DEFINE>();
                        if (lclist_mb.Count > 0)
                        {
                            foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_mb)
                            {
                                FlowData fd = new FlowData();//
                                fd.Name = dmodel.DEFINE_NAME;
                                fd.Code = dmodel.DEFINE_CODE;
                                fd.Count = WorkFlow.BLL.Operate.getMyTaskByParentCode("", "", ftd.type.TYPE_CODE, fd.Code).Count;
                                count += fd.Count;
                                ftd.datalist.Add(fd);
                            }
                        }
                    }
                    ftd.Count = count;
                    list.Add(ftd);
                }

                string json = JsonConvert.SerializeObject(list);
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }

        /// <summary>
        /// 获取我处理过的流程，经办跟踪
        /// </summary>
        /// <param name="context"></param>
        private void getMyHandledTypeList(HttpContext context)
        {
            try
            {
                List<WorkFlow.Model.FLOW_TYPE> typelist = WorkFlow.BLL.Operate.getFlowType();//获取所有流程类别
                List<WorkFlow.Model.FLOW_DEFINE> definelist = WorkFlow.BLL.Operate.getDefineList("");//获取所有的流程

                List<FlowTypeData> list = new List<FlowTypeData>();//结构树

                IFlow_Derive_RelationBLL reBll = BLL.BllFactory.GetFlow_Derive_RelationBLL();

                foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                {
                    FlowTypeData ftd = new FlowTypeData();
                    ftd.type = type;//流程类型
                    int count = 0;
                    //找到该类型的流程模板
                    List<MODEL.Flow.FLOW_DERIVE_RELATION> list_relation = reBll.GetDistinctList(" and  b.type_code='" + type.TYPE_CODE + "' ").ToList<MODEL.Flow.FLOW_DERIVE_RELATION>();

                    foreach (MODEL.Flow.FLOW_DERIVE_RELATION relation in list_relation)
                    {
                        //1-----找到模板的流程信息
                        List<WorkFlow.Model.FLOW_DEFINE> lclist_mb = definelist.Where(p => p.DEFINE_CODE == relation.define_code_parent).ToList<WorkFlow.Model.FLOW_DEFINE>();
                        if (lclist_mb.Count > 0)
                        {
                            foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_mb)
                            {
                                FlowData fd = new FlowData();//
                                fd.Name = dmodel.DEFINE_NAME;
                                fd.Code = dmodel.DEFINE_CODE;
                                fd.Count = WorkFlow.BLL.Operate.getMyHandledTaskByParentCode(CFunctions.getUserId(context), CFunctions.getRoleId(context), ftd.type.TYPE_CODE, fd.Code).Count;
                                count += fd.Count;
                                ftd.datalist.Add(fd);
                            }
                        }
                    }
                    ftd.Count = count;
                    list.Add(ftd);
                }

                //foreach (WorkFlow.Model.FLOW_TYPE type in typelist)
                //{
                //    List<WorkFlow.Model.FLOW_DEFINE> lclist_temp = definelist.Where(p => p.TYPE_CODE == type.TYPE_CODE).ToList<WorkFlow.Model.FLOW_DEFINE>();
                //    FlowTypeData ftd = new FlowTypeData();
                //    int count = 0;
                //    foreach (WorkFlow.Model.FLOW_DEFINE dmodel in lclist_temp)
                //    {
                //        FlowData fd = new FlowData();//
                //        fd.Name = dmodel.DEFINE_NAME;
                //        fd.Code = dmodel.DEFINE_CODE;
                //        //类别和名称下有多少流程
                //        fd.Count = WorkFlow.BLL.Operate.getMyHandledTaskByParentCode(CFunctions.getUserId(context), "", type.TYPE_CODE, dmodel.DEFINE_CODE).Count;
                //        count += fd.Count;
                //        ftd.datalist.Add(fd);

                //    }
                //    ftd.type = type;
                //    ftd.Count = count;

                //    list.Add(ftd);
                //}

                string json = JsonConvert.SerializeObject(list);
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }


        /// <summary>
        /// 获取我的待办流程
        /// </summary>
        /// <param name="context"></param>
        private void getMyHandledTask(HttpContext context)
        {
            try
            {
                string json = "";
                string TYPE_CODE = context.Request["TYPE_CODE"];
                string DEFINE_CODE = context.Request["DEFINE_CODE"];
                string type = context.Request["type"];

                List<WorkFlow.Model.FLOW_TASK> list = WorkFlow.BLL.Operate.getMyHandledTaskByParentCode(CFunctions.getUserId(context), CFunctions.getRoleId(context), TYPE_CODE, DEFINE_CODE);//获取我处理过的所有流程类别


                if (string.IsNullOrEmpty(type))
                {
                    var total = list.Count;
                    int pcount = 0;
                    int totalcount = list.Count;

                    list = list.Skip((page - 1) * rows).Take(rows).ToList<WorkFlow.Model.FLOW_TASK>();
                    //json = JsonConvert.SerializeObject(list);

                    Dictionary<string, object> obj = new Dictionary<string, object>();
                    obj.Add("total", totalcount);
                    obj.Add("rows", list);
                    json = JsonConvert.SerializeObject(obj);

                }
                else
                {
                    int count = list.Count;
                    // count = (count % 4 == 0 ? count / 4 : (count / 4) + 1);
                    json = "{\"IsSuccess\":\"true\",\"Count\":" + count + "}";
                }
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
            catch (Exception ex)
            {
                string json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
                context.Response.ContentType = "application/json";
                context.Response.Write(json);
                context.ApplicationInstance.CompleteRequest();
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class FlowTypeData
    {
        public WorkFlow.Model.FLOW_TYPE type = new WorkFlow.Model.FLOW_TYPE();
        public List<WorkFlow.Model.FLOW_DEFINE> list = new List<WorkFlow.Model.FLOW_DEFINE>();

        public List<FlowData> datalist = new List<FlowData>();
        public int Count { get; set; }
    }


    public class FlowData
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public int Count { get; set; }
    }

}