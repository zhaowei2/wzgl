using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.COMMON;
using WZGL.IBLL.Plan;
using WZGL.MODEL.Plan;

namespace WZGL.WEB.Controllers.Plan
{
    /// <summary>
    /// Check 的摘要说明
    /// </summary>
    public class Check : IHttpHandler
    {
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式

        IMaterialcheckandacceptBLL checkBll = BllFactory.GetMaterialcheckandacceptBLL();//材料验收BLL
        IMaterialcheckandaccept_detailBLL detailBLL = BllFactory.GetMaterialcheckandaccept_detailBLL();//材料验收详细BLL

        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? " checkandacceptdate " : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? " desc" : context.Request["order"].ToString();
            string action = context.Request["action"];

            switch (action)
            {
                case "getMaterialCheckList":
                    getMaterialCheckList(context); break;//获取采购计划列表数据

                case "addMaterialCheck":
                    addMaterialCheck(context); break;//添加采购计划数据
                case "getMaterialCheck":
                    getMaterialCheck(context); break;//获取采购计划数据
                    
            }
        }


        //获取采购计划列表数据
        private void getMaterialCheckList(HttpContext context)
        {
            string json = string.Empty;
            string sql = "  ";
            int pcount = 0;
            int totalcount = 0;
            string type = context.Request["type"];
            string checkname = context.Request["checkname"];
            //string Purchaseplantype = context.Request["Purchaseplantype"];
            if (!string.IsNullOrEmpty(checkname))
            {
                sql += "  and  b.username='" + checkname + "' ";
            }
            //if (!string.IsNullOrEmpty(Purchaseplantype))
            //{
            //    sql += "  and  Purchaseplantype ='" + Purchaseplantype + "'";
            //}
            try
            {
                Dictionary<string, object> lists = checkBll.GetPageList(sql, sort + " " + order, page, rows, out pcount, out totalcount);
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
        /// 新增材料验收计划
        /// </summary>
        /// <param name="context"></param>
        private void addMaterialCheck(HttpContext context)
        {
            string json = string.Empty;
            //返回数据的格式

            WZGL.MODEL.Plan.TBL_MATERIALCHECKANDACCEPT model = new MODEL.Plan.TBL_MATERIALCHECKANDACCEPT();//材料计划

            string checkid = ComFunction.GetId();//计划主键ID
            
            string project = context.Request["data"];
            string type = context.Request["type"];

            try
            {
                List<TBL_MATERIALCHECKANDACCEPT> list = JsonConvert.DeserializeObject<List<WZGL.MODEL.Plan.TBL_MATERIALCHECKANDACCEPT>>(project);

                if (list.Count > 0)
                {
                    list[0].Materialcheckandacceptid = checkid;
                    model = list[0];

                    //model.ADD_EMP = CFunctions.getUserId(context);
                    foreach (TBL_MATERIALCHECKANDACCEPT_DETAIL mpj in model.list_detail)
                    {
                        mpj.Materialcheckandacceptid = checkid;
                        mpj.Materialcheckandaccept_detailid = ComFunction.GetId();//详细主键ID
                    }

                    bool re = WZGL.BLL.BllFactory.GetMaterialcheckandacceptBLL().Insert(model);//插入采购计划数据

                    if (re)
                    {
                        json = "{\"IsSuccess\":\"true\",\"Message\":\"保存成功！\"}";
                    }
                    else {
                        json = "{\"IsSuccess\":\"false\",\"Message\":\"保存失败！\"}";
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


        //获取单个采购计划
        private void getMaterialCheck(HttpContext context)
        {
            string json = string.Empty;
            string Materialcheckandacceptid = context.Request["Materialcheckandacceptid"];//采购计划ID
            string TASK_CODE = context.Request["TASK_CODE"];//材料计划ID

            List<TBL_MATERIALCHECKANDACCEPT> list = null;
            if (string.IsNullOrEmpty(TASK_CODE))
            {
                list = checkBll.GetList(" Materialcheckandacceptid='" + Materialcheckandacceptid + "'").ToList<TBL_MATERIALCHECKANDACCEPT>();
            }
            else
            {
                list = checkBll.GetList(" Processnumber='" + TASK_CODE + "'").ToList<TBL_MATERIALCHECKANDACCEPT>();
            }
            //返回数据的格式
            // string sql = "{单号:1,部门1,人员:1,project:[ {工程:1,detail:[{d:1},{d:2}]},{工程:2,detail:[{d:1},{d:2}},{工程:3,detail:[{d:1},{d:2}} ]}";

            TBL_MATERIALCHECKANDACCEPT model = null;

            if (list.Count > 0)
            {
                model = list[0];
               // Purchaseplanid = model.Purchaseplanid;
                List<TBL_MATERIALCHECKANDACCEPT_DETAIL> list_detail = detailBLL.GetList(" Materialcheckandacceptid='" + Materialcheckandacceptid + "' ").ToList<TBL_MATERIALCHECKANDACCEPT_DETAIL>();
                foreach (TBL_MATERIALCHECKANDACCEPT_DETAIL detail in list_detail)
                {
                    detail.Materialcheckandacceptid = Materialcheckandacceptid;
                }
                model.list_detail = list_detail;
            }
            else
            {
                json = "{\"IsSuccess\":\"false\",\"Message\":\"该验收数据不存在！\"}";
            }

            json = JsonConvert.SerializeObject(model);
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