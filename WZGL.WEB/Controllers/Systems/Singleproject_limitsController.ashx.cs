using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.DAO;
using WZGL.IBLL.System;
using WZGL.MODEL.System;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// Singleproject_limitsController 的摘要说明
    /// </summary>
    public class Singleproject_limitsController : IHttpHandler
    {
        #region ------------------------变量------------------------

        readonly ILog logger = LogManager.GetLogger(typeof(OrganizationController));
        IOrganizationBLL oBLL = BllFactory.GetOrganizationBLL();
        ISingleproject_limitsBLL slBLL = BllFactory.GetSingleproject_limitsBLL();
        IDictitemBLL dictBLL = BllFactory.GetDictitemBLL();
        #endregion
        public void ProcessRequest(HttpContext context)
        {
            string action = context.Request["action"];
            switch (action)
            {
                //获取部门类型为矿属仓库、用料单位的数据
                case "getOrgList": 
                    getOrgList(context); 
                    break;
                //获取部门单项工程权限
                case "getOrgLimitsList":
                    getOrgLimitsList(context);
                    break;
                //获取部门单项工程类型
                case "getSingleprojectType":
                    getSingleprojectType(context);
                    break;
                //配置单项工程权限
                case "configSingleprojectLimits":
                    configSingleprojectLimits(context);
                    break;

                    

            }
        }


        #region -----------------------------------配置单项功能权限-----------------------------------
        private void configSingleprojectLimits(HttpContext context)
        {
            string json = "";
            try
            {

                List<string> slList = CFunctions.JsonDeserialize<List<string>>(context.Request["SingleprojectLimits"].ToString());
                DaoFactory.BeginTransaction();

                slBLL.Delete(" 1=1 ");

                foreach (string sl in slList)
                {
                    string [] sls = sl.Split(',');
                    string[] Limitss = sls[1].Split('+');
                    foreach (string Limits in Limitss)
                    {
                        if (Limits=="")
                        {
                            continue;
                        }
                        TBL_SINGLEPROJECT_LIMITS tsl = new TBL_SINGLEPROJECT_LIMITS();
                        tsl.singleproject_limitid = System.Guid.NewGuid().ToString().ToUpper();
                        tsl.organizationid = sls[0];
                        tsl.singleprojecttypeid = Limits;
                        slBLL.Insert(tsl);
                    }        
                }

                DaoFactory.CommitTransaction();
                json = "{IsSuccess:'true',Message:'保存成功！'}";
            }
            catch (Exception ex)
            {
                DaoFactory.RollBackTransaction();
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'服务器交互失败！'}";
            }
          


            json = JsonConvert.SerializeObject(json);

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region -----------------------------------获取部门类型为矿属仓库、用料单位的数据-----------------------------------
        private void getOrgList(HttpContext context)
        {
            string json = "";

            
            try
            {
                List<TBL_ORGANIZATION> orgList = oBLL.GetList(" a.organizationtype='C70CEDCC-FB20-436E-B35A-AA5A7BD8C488'   or a.organizationtype='FFA21F13-BD0C-4312-BDAB-952C78DC39EE' order by organizationname  ").ToList<TBL_ORGANIZATION>();
                json = JsonConvert.SerializeObject(orgList);
                json = "{IsSuccess:'true',Message:'" + json + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'服务器交互失败！'}";
            }

            json = JsonConvert.SerializeObject(json);

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region -----------------------------------获取部门单项工程权限-----------------------------------
        private void getOrgLimitsList(HttpContext context)
        {
        
            string json = "";
            try
            {
                List<TBL_SINGLEPROJECT_LIMITS> slList = slBLL.GetList(" 1=1 ").ToList<TBL_SINGLEPROJECT_LIMITS>();
                json = JsonConvert.SerializeObject(slList);
                json = "{IsSuccess:'true',Message:'" + json + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'服务器交互失败！'}";
            }

            json = JsonConvert.SerializeObject(json);

            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion

        #region -----------------------------------获取单项工程类型-----------------------------------
        private void getSingleprojectType(HttpContext context)
        {
            string json = "";
            try
            {
                List<TBL_DICTITEM> stList = dictBLL.GetList(" and dictid='DC194DA5-EFC6-4EAB-A652-2537AEFFFADC'  ").ToList<TBL_DICTITEM>();
                 json = JsonConvert.SerializeObject(stList);
                 json = "{IsSuccess:'true',Message:'" + json + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'服务器交互失败！'}";
            }
            json = JsonConvert.SerializeObject(json);

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