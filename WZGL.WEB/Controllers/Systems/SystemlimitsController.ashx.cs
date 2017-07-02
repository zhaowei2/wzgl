using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IBLL.System;
using WZGL.MODEL.System;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// SystemlimitsController 的摘要说明
    /// </summary>
    public class SystemlimitsController : IHttpHandler
    {
        #region ------------------------变量------------------------

        readonly ILog logger = LogManager.GetLogger(typeof(SystemlimitsController));
        ISystemlimitsBLL sBLL = BllFactory.GetSystemlimitsBLL();
        #endregion
        public void ProcessRequest(HttpContext context)
        {

            string action = context.Request["action"];
            switch (action)
            {
                //获取列表
                case "getList": getList(context); break;
                //获取用户权限列表
                case "getUserRoleList": getUserRoleList(context); break;
                    
            }
        }

        #region ------------------------获取权限列表------------------------
        private void getList(HttpContext context)
        {
            string json = "";
            //有子父级关系的部门
            List<TBL_SYSTEMLIMITS> pcoList = new List<TBL_SYSTEMLIMITS>();
            try
            {
                List<TBL_SYSTEMLIMITS> toList = sBLL.GetList(" 1=1 ").ToList<TBL_SYSTEMLIMITS>();

                //获取父级根节点
                List<TBL_SYSTEMLIMITS> poList = toList.Where(o => string.IsNullOrEmpty(o.parentid)).ToList<TBL_SYSTEMLIMITS>();

                foreach (TBL_SYSTEMLIMITS to in poList)
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
        #endregion

        #region ------------------------获取用户权限------------------------
          private void getUserRoleList(HttpContext context)
        {
            string json = "";
            string sql = " 1=1 ";
            string userid = CFunctions.getRoleId(context);
            //有子父级关系的部门
            List<TBL_SYSTEMLIMITS> pcoList = new List<TBL_SYSTEMLIMITS>();

            if (!string.IsNullOrEmpty(sql))
            {
                sql += " and roleid='" + userid + "' ";
            }

            try
            {
                List<TBL_SYSTEMLIMITS> toList = sBLL.GetUserRoleList(sql).ToList<TBL_SYSTEMLIMITS>();

                //获取父级根节点
                List<TBL_SYSTEMLIMITS> poList = toList.Where(o => string.IsNullOrEmpty(o.parentid)).ToList<TBL_SYSTEMLIMITS>();

               // poList=   poList.OrderBy(a => a.orders).ToList();
                foreach (TBL_SYSTEMLIMITS to in poList)
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
        #endregion


        /// <summary>
        /// 获取权限的树型结构
        /// </summary>
        /// <param name="toList">权限列表</param>
        /// <param name="to">权限</param>
        public void getTree(List<TBL_SYSTEMLIMITS> toList, TBL_SYSTEMLIMITS to)
        {
            //获取子集节点
            List<TBL_SYSTEMLIMITS> coList = toList.Where(o => o.parentid == to.limitid).ToList<TBL_SYSTEMLIMITS>();

            if (coList.Count > 0)
            {
                to.children = coList;
                foreach (TBL_SYSTEMLIMITS toc in coList)
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