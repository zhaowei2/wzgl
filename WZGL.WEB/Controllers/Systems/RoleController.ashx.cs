using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WZGL.BLL;
using WZGL.IBLL.System;
using WZGL.MODEL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// RoleController 的摘要说明
    /// </summary>
    public class RoleController : IHttpHandler
    {
        #region ------------------------变量------------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式
        readonly ILog logger = LogManager.GetLogger(typeof(RoleController));
        IRoleBLL roBLL = BllFactory.GetRoleBLL();
        IRoleauthorizationBLL roaBLL = BllFactory.GetRoleauthorizationBLL();
        ISystemlimitsBLL sBLL = BllFactory.GetSystemlimitsBLL();
        #endregion
        public void ProcessRequest(HttpContext context)
        {
            page = (context.Request["page"] == null) ? 1 : int.Parse(context.Request["page"].ToString());
            rows = (context.Request["rows"] == null) ? 20 : int.Parse(context.Request["rows"].ToString());
            sort = (context.Request["sort"] == null) ? "rolename" : context.Request["sort"].ToString();
            order = (context.Request["order"] == null) ? "desc" : context.Request["order"].ToString();
            string action = context.Request["action"];
            switch (action)
            {
                //获取列表
                //case "getPageList": getPageList(context); break;
                //获取列表
                case "getList": getList(context); break;
                //添加
                case "add": add(context); break;
                //修改
                case "update": update(context); break;
                //删除
                case "delete": delete(context); break;
                //获取权限列表
                case "getSystemlimitsList": getSystemlimitsList(context); break;
                //获取授权列表
                case "getRoleauthorizationList": getRoleauthorizationList(context); break;
                //获取分页列表
                case "getPageList": getPageList(context); break; 

                    
            }
        }

        #region ------------------------新增角色------------------------
        private void add(HttpContext context)
        {
            string json = "";
            string [] limitids = context.Request["limitids"].Split(',');
            string rolename = context.Request["rolename"];
            string isreuse = context.Request["isreuse"];
            TBL_ROLE tr = new TBL_ROLE();
            tr.roleid = System.Guid.NewGuid().ToString().ToUpper();
            tr.rolename = rolename;
            tr.isreuse = isreuse == "true" ? true : false;
            
            

            try
            {

                List<TBL_ROLE> roleList = roBLL.GetList(" rolename='" + rolename + "' ").ToList<TBL_ROLE>();
                if (roleList.Count>0)
                {
                    json = "{IsSuccess:'false',Message:'角色名称已经存在！'}";
                }
                else
                {
                    if (roBLL.Insert(tr))
                    {
                        foreach (string limitid in limitids)
                        {
                            if (string.IsNullOrEmpty(limitid))
                            {
                                continue;
                            }
                            TBL_ROLEAUTHORIZATION tra = new TBL_ROLEAUTHORIZATION();
                            tra.roleid = tr.roleid;
                            tra.limitid = limitid;
                            roaBLL.Insert(tra);
                        }
                        json = "{IsSuccess:'true',Message:'保存成功！',id:'" + tr.roleid + "'}";
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

        #region ------------------------修改角色------------------------
        private void update(HttpContext context)
        {
            string json = "";
            string[] limitids = context.Request["limitids"].Split(',');
            string rolename = context.Request["rolename"];
            string roleid = context.Request["roleid"];
            string isreuse = context.Request["isreuse"];
            TBL_ROLE tr = new TBL_ROLE();
            tr.roleid = roleid;
            tr.rolename = rolename;
            tr.isreuse = isreuse == "true" ? true : false;

            try
            {

               
                if (roBLL.Update(tr))
                {
                    roaBLL.Delete(" roleid='" + roleid + "' ");
                    foreach (string limitid in limitids)
                    {
                        if (string.IsNullOrEmpty(limitid))
                        {
                            continue;
                        }
                        TBL_ROLEAUTHORIZATION tra = new TBL_ROLEAUTHORIZATION();
                        tra.roleid = tr.roleid;
                        tra.limitid = limitid;
                        roaBLL.Insert(tra);
                    }
                    json = "{IsSuccess:'true',Message:'保存成功！'}";
                }
                else
                {
                    json = "{IsSuccess:'true',Message:'保存失败！'}";
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

        #region ------------------------删除角色------------------------
        private void delete(HttpContext context)
        {
            string json = "";
            string where = " roleid='" + context.Request["roleid"] + "'";

            try
            {
                if (roaBLL.Delete(where))
                {
                    roBLL.Delete(where);
                    json = "{IsSuccess:'true',Message:'删除成功！'}";
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'删除失败！'}";
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

        #region ------------------------获取角色分页列表------------------------
        private void getPageList(HttpContext context)
        {
            string sql="  ";
            string json = "";
            int pcount = 0;
            int totalcount = 0;
            string rolename = context.Request["rolename"];
            string   isreuse = context.Request["isreuse"];
            if (!string.IsNullOrEmpty(rolename))
            {
                sql += " and rolename like '%" + rolename + "%' ";
            }

            if (!string.IsNullOrEmpty(isreuse))
            {
                isreuse = isreuse == "true" ? "1" : "0";
                sql += " and isreuse = " + isreuse;
            }

            try
            {
                Dictionary<string, object> roList = roBLL.GetPageList(sql, sort, page, rows, out pcount, out totalcount); 



                json = JsonConvert.SerializeObject(roList);
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


        #region ------------------------获取角色列表------------------------
        private void getList(HttpContext context)
        {
            string sql = " 1=1 ";
            string json = "";
            string rolename = context.Request["rolename"];
            string isreuse = context.Request["isreuse"];
            if (!string.IsNullOrEmpty(rolename))
            {
                sql += " and rolename like '%" + rolename + "%' ";
            }

            if (!string.IsNullOrEmpty(isreuse))
            {
                isreuse = isreuse == "true" ? "1" : "0";
                sql += " and isreuse = " + isreuse;
            }
            try
            {
                List<TBL_ROLE> roList = roBLL.GetList(sql).ToList<TBL_ROLE>();



                json = JsonConvert.SerializeObject(roList);
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

        #region ------------------------获取权限列表------------------------
        private void getSystemlimitsList(HttpContext context)
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

        #region ------------------------获取角色授权列表------------------------
        private void getRoleauthorizationList(HttpContext context)
        {
            string json = "";
            string ids = "";
            string roleid = context.Request["roleid"];

          
            try
            {
                List<TBL_ROLEAUTHORIZATION> traList = roaBLL.GetList(" roleid='" + roleid + "'").ToList<TBL_ROLEAUTHORIZATION>();

                foreach (TBL_ROLEAUTHORIZATION tr in traList)
                {
                    ids += tr.limitid + ",";
                }

                json = "{IsSuccess:'true',ids:'" + ids + "'}";
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'服务器交互失败！'}");
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();

        }
        #endregion

        #region ------------------------获取权限的树型结构------------------------
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