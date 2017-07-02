using log4net;
using Newtonsoft.Json;
/*************************************************
  Copyright (C), 2015, Hoswing Tech. Co., Ltd.
  File name:   OrganizationController.ashx
  Author:  王鹏飞   
  Version: 1.0       
  Date: 2016/12/22
  Description:   部门管理逻辑处理
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
using System.Web.Security;
using WZGL.BLL;
using WZGL.IBLL.Capital;
using WZGL.IBLL.System;
using WZGL.MODEL.Capital;
using WZGL.MODEL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// OrganizationController 的摘要说明
    /// </summary>
    public class OrganizationController : IHttpHandler
    {
        #region ------------------------变量------------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        readonly ILog logger = LogManager.GetLogger(typeof(OrganizationController));
        IOrganizationBLL oBLL = BllFactory.GetOrganizationBLL();
        IDictitemBLL dBLL = BllFactory.GetDictitemBLL();
        ICapitalaccountBLL cBLL = BllFactory.GetCapitalaccountBLL();
        #endregion
        public void ProcessRequest(HttpContext context)
        {
          
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "date" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
           string action = context.Request["action"];
            switch (action)
            {
                //获取列表
                //case "getPageList": getPageList(context); break;
                //获取列表
                case "getList": getList(context); break;

                case "getListBywhere": getListBywhere(context); break;
                //添加
                case "add": add(context); break;
                //修改
                case "update": update(context); break;
                //删除
                case "delete": delete(context); break;
                //获取部门类型
                case "getOrgType": getOrgType(context); break;
                    
            }
        }

        #region ------------------------新增部门------------------------
        private void add(HttpContext context)
        {
            string json = "";
            TBL_ORGANIZATION to = new TBL_ORGANIZATION();
            to.organizationid = System.Guid.NewGuid().ToString().ToUpper();
            to.organizationname = context.Request["organizationname"];
            to.organizationtype = context.Request["organizationtype"];
            to.parentid = context.Request["parentid"];
            to.orglevel = context.Request["orglevel"];

            try
            {
                List<TBL_ORGANIZATION> orgList = oBLL.GetList("  organizationname='" + to.organizationname + "' ").ToList<TBL_ORGANIZATION>();

                if (orgList.Count>0)
                {
                    json = "{IsSuccess:'false',Message:'部门名称已经存在！'}";
                }
                else
                {
                    if (oBLL.Insert(to))
                    {
                        //为专业主管部门创建资金账户
                        if (to.organizationtype=="B933AF9E-B57E-40F5-9284-E24BE8EA21FF")
                        {
                            TBL_CAPITALACCOUNT tca = new TBL_CAPITALACCOUNT();
                            tca.capitalaccountid = System.Guid.NewGuid().ToString().ToUpper();
                            tca.capitalaccounttype = "E483C545-362D-47CF-AEE3-4E3B22E9F277";
                            tca.organizationid = to.organizationid;
                            tca.balance =0;
                            cBLL.Insert(tca);
                        }

                        //为材料使用单位创建资金账户
                        if (to.organizationtype == "FFA21F13-BD0C-4312-BDAB-952C78DC39EE")
                        {
                            TBL_CAPITALACCOUNT tca = new TBL_CAPITALACCOUNT();
                            tca.capitalaccountid = System.Guid.NewGuid().ToString().ToUpper();
                            tca.capitalaccounttype = "9BF8F1BE-9074-47B1-9123-B3486B65871D";
                            tca.organizationid = to.organizationid;
                            tca.balance =0;
                            cBLL.Insert(tca);
                        }

                        
                        json = "{IsSuccess:'true',Message:'保存成功！',id:'" + to.organizationid + "'}";
                    }
                    else
                    {
                        json = "{IsSuccess:'false',Message:'保存失败！'}";
                    }
                }
                
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'服务器交互失败！'}";
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region ------------------------修改部门------------------------
        private void update(HttpContext context)
        {
            string json = "";
            TBL_ORGANIZATION to = new TBL_ORGANIZATION();
            to.organizationid = context.Request["organizationid"]; ;
            to.organizationname = context.Request["organizationname"];
            to.organizationtype = context.Request["organizationtype"];
            string oldname = context.Request["oldName"]; 
            //to.parentid = context.Request["parentid"];
            //to.orglevel = context.Request["orglevel"];

            try
            {
                List<TBL_ORGANIZATION> orgList = oBLL.GetList("  organizationname='" + to.organizationname + "' and  organizationname<>'" + oldname + "' ").ToList<TBL_ORGANIZATION>();

                if (orgList.Count > 0)
                {
                    json = "{IsSuccess:'false',Message:'部门名称已经存在！'}";
                }
                else
                {
                    if (oBLL.Update(to))
                    {
                        json = "{IsSuccess:'true',Message:'保存成功！'}";
                    }
                    else
                    {
                        json = "{IsSuccess:'true',Message:'保存失败！'}";
                    }   
                }
                
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json ="{IsSuccess:'false',Message:'服务器交互失败！'}";
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region ------------------------删除部门------------------------
        private void delete(HttpContext context)
        {
            string json = "";
            string organizationid = context.Request["organizationid"];
            string where = " organizationid='" + organizationid + "'";

            try
            {
                List<TBL_ORGANIZATION> orgList = oBLL.GetList(" parentid='" + organizationid + "' ").ToList<TBL_ORGANIZATION>();

                if (orgList.Count >0)
                {
                    json = "{IsSuccess:'false',Message:'此部门有子级不可删除！'}"; 
                }
                else
                {
                    //cBLL.Delete(" organizationid='" + organizationid + "' ");
                    if (oBLL.Delete(where))
                    {
                        json = "{IsSuccess:'true',Message:'删除成功！'}";
                    }
                    else
                    {
                        json = "{IsSuccess:'true',Message:'删除失败！'}";
                    }
                }
                
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json ="{IsSuccess:'false',Message:'服务器交互失败！'}";
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region ------------------------获取部门列表------------------------
        private void getList(HttpContext context)
        {
            string json = "";
            //有子父级关系的部门
            List<TBL_ORGANIZATION> pcoList = new List<TBL_ORGANIZATION>();
            try
            {
                List<TBL_ORGANIZATION> toList = oBLL.GetList(" 1=1 ").ToList<TBL_ORGANIZATION>();
                //获取父级根节点
                List<TBL_ORGANIZATION> poList = toList.Where(o => string.IsNullOrEmpty(o.parentid)).ToList<TBL_ORGANIZATION>();

                foreach (TBL_ORGANIZATION to in poList)
                {
                    getTree(toList, to);
                }

                json = JsonConvert.SerializeObject(poList);
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

        private void getListBywhere(HttpContext context)
        {
            string json = "";
            string where = " 1=1 ";
            string dictid= context.Request["dictid"]; ;
            if (!string.IsNullOrEmpty(dictid))
            {
                where += " and a.organizationtype='" + dictid + "'";
            }
            try
            {
                List<TBL_ORGANIZATION> toList = oBLL.GetList(where).ToList<TBL_ORGANIZATION>();
                //获取父级根节点


                json = JsonConvert.SerializeObject(toList);
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

        #region ------------------------获取部门类型------------------------
        private void getOrgType(HttpContext context)
        {
            string json = "";
       
            try
            {
                List<TBL_DICTITEM> dictList = dBLL.GetList(" and dictid='46321984-C488-452D-8656-5F9B5D86CBB1' ").ToList<TBL_DICTITEM>();

                json = JsonConvert.SerializeObject(dictList);
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
       



        /// <summary>
        /// 获取部门的树型结构
        /// </summary>
        /// <param name="toList">部门列表</param>
        /// <param name="to">部门</param>
        public void getTree(List<TBL_ORGANIZATION> toList, TBL_ORGANIZATION to)
        {
            //获取子集节点
            List<TBL_ORGANIZATION> coList = toList.Where(o => o.parentid == to.organizationid).ToList<TBL_ORGANIZATION>();

            if (coList.Count > 0)
            {
                to.children = coList;
                foreach (TBL_ORGANIZATION toc in coList)
                {
                    getTree(toList, toc);
                }
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
}