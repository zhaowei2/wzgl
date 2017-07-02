using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using WZGL.BLL;
using WZGL.IBLL.System;
using WZGL.MODEL.System;
using WZGL.WEB.Common;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// UserController 的摘要说明
    /// </summary>
    public class UserController : IHttpHandler, IRequiresSessionState
    {
        #region ------------------变量------------------
        private int page;//页码
        private int rows;//条数
        private string sort;//排序字段
        private string order;//排序方式


        readonly ILog logger = LogManager.GetLogger(typeof(UserController));
        IUserBLL userBLL = BllFactory.GetUserBLL();
        IUserauthorizationBLL useraBLL = BllFactory.GetUserauthorizationBLL();

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
                //获取用户分页列表
                case "getPageList":
                    getPageList(context); break;

                //添加用户
                case "add": add(context); break;

                //修改用户
                case "edit": edit(context); break;

                //删除用户
                case "deluser": delUser(context); break;

                //重置密码
                case "reset": reset(context); break;

                //修改密码
                case "updatepaw": updatepaw(context); break;

                //获取用户列表
                case "getList":
                    getList(context); break;
                //获取登录用户信息
                case "getLoginUser":
                    getLoginUser(context); break;
                //获取修改用户信息
                case "updateUser":
                    updateUser(context); break;

            }
        }


        #region --------------------------获取用户分页列表--------------------------
        private void getPageList(HttpContext context)
        {
            //try
            //{
            //    string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            //    TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);
            //}
            //catch (Exception e)
            //{

            //    throw;
            //}
            string json = string.Empty;
            string sql = "  and a.username <>'admin' ";
            int pcount = 0;
            int totalcount = 0;
            // string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            string username = context.Request["username"];
            string role = context.Request["role"];
            string organizationid = context.Request["organizationid"];
            string job = context.Request["job"];

            if (!string.IsNullOrEmpty(username))
            {
                sql += " and  name like '%" + username + "%' ";
            }

            if (!string.IsNullOrEmpty(role))
            {
                sql += " and  d.roleid='" + role + "' ";
            }

            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
               // sql += " and  b.organizationid  = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(job))
            {
                sql += " and  a.job  like '%" + job + "%' ";
            }

            try
            {
                Dictionary<string, object> users = userBLL.GetPageList(sql, sort, page, rows, out pcount, out totalcount);
                json = JsonConvert.SerializeObject(users);
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

        #region --------------------------获取用户列表--------------------------
        private void getList(HttpContext context)
        {
            string json = string.Empty;
           // string sql = "  and a.username <>'admin' ";
            string sql = "   ";
            string username = context.Request["username"];
            string role = context.Request["role"];
            string organizationid = context.Request["organizationid"];
            string job = context.Request["job"];

            if (!string.IsNullOrEmpty(username))
            {
                sql += " and  name like '%" + username + "%' ";
            }

            if (!string.IsNullOrEmpty(role))
            {
                sql += " and  d.roleid='" + role + "' ";
            }

            if (!string.IsNullOrEmpty(organizationid))
            {
                string Organization = CFunctions.getChildByParentId(organizationid);
                sql += " and b.organizationid in(" + Organization + ")";
               // sql += " and  b.organizationid  = '" + organizationid + "' ";
            }

            if (!string.IsNullOrEmpty(job))
            {
                sql += " and  a.job  like '%" + job + "%' ";
            }
            // string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;

            try
            {
                List<TBL_USER> userList = userBLL.GetList(sql).ToList<TBL_USER>();
                json = JsonConvert.SerializeObject(userList);
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


        #region --------------------------新增用户--------------------------
        private void add(HttpContext context)
        {
            //string mids = context.Request["mids"];
            bool state = false;
            string username = context.Request["username"];
            //string password = context.Request["password"];
            string name = context.Request["name"];
            string Icon = context.Request["Icon"];
            string job = context.Request["job"];
            string phone = context.Request["phone"];
            string organizationid = context.Request["organizationid"];
            string roleid = context.Request["roleid"];

            //byte[] byteArray = System.Text.Encoding.Default.GetBytes ( str );
            //string str = System.Text.Encoding.Default.GetString ( byteArray );

            string json = "{IsSuccess:'false',Message:'保存失败！'}";
            string userid = System.Guid.NewGuid().ToString().ToUpper();
            TBL_USER user = new TBL_USER();
            user.userid = userid;
            user.username = username;
            user.password = FormsAuthentication.HashPasswordForStoringInConfigFile("88888888", "MD5");
            user.name = name;
            user.job = job;
            user.organizationid = organizationid;
            user.phone = phone;
            user.Icon = System.Text.Encoding.Default.GetBytes(Icon);
            List<TBL_USERAUTHORIZATION> tuaList = new List<TBL_USERAUTHORIZATION>();

            //foreach (string roleid in roleids)
            //{
            //    TBL_USERAUTHORIZATION tua = new TBL_USERAUTHORIZATION();
            //    tua.userid = userid;
            //    tua.roleid = roleid;
            //    tuaList.Add(tua);
            //}

            if (username == "admin" || name == "admin")
            {
                json = "{IsSuccess:'false',Message:'登录名或用户名不能为关键字，请重新输入！'}";

            }
            else
            {
                try
                {
                    List<TBL_USER> list = userBLL.GetList(string.Format(" and A.username='{0}' ", username)).ToList<TBL_USER>();
                    if (list.Count > 0)
                    {
                        json = "{IsSuccess:'false',Message:'该登录名已存在，请重新输入！'}";
                    }
                    else
                    {
                        if (userBLL.Insert(user))
                        {
                            TBL_USERAUTHORIZATION tua = new TBL_USERAUTHORIZATION();
                            tua.userid = userid;
                            tua.roleid = roleid;
                            useraBLL.Insert(tua);
                            state = true;
                        }
                    }

                    if (state)
                    {
                        json = "{IsSuccess:'true',Message:'保存成功,初始密码88888888！',id:'" + user.userid + "'}";
                    }
                    
                }
                catch (Exception ex)
                {
                    logger.Error(ex.Message);
                    json = "{IsSuccess:'false',Message:'保存失败！'}";
                }
            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region --------------------------修改用户--------------------------
        private void edit(HttpContext context)
        {
            bool state = false;
            string userid = context.Request["userid"];
            string username = context.Request["username"];
            //string password = context.Request["password"];
            string name = context.Request["name"];
            string Icon = context.Request["Icon"];
            string job = context.Request["job"];
            string phone = context.Request["phone"];
            string organizationid = context.Request["organizationid"];
            string roleid = (context.Request["roleid"]);
            //string[] roleids = (context.Request["roleid"]).Split(',');
            string json = "{IsSuccess:'false',Message:'保存失败！'}";

            TBL_USER user = new TBL_USER();
            user.userid = userid;
            user.username = username;
            //user.password = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");
            user.name = name;
            user.job = job;
            user.organizationid = organizationid;
            user.phone = phone;
            user.Icon = System.Text.Encoding.Default.GetBytes(Icon);
            user.roleid = roleid;
            //List<TBL_USERAUTHORIZATION> tuaList = new List<TBL_USERAUTHORIZATION>();

            //foreach (string roleid in roleids)
            //{
            //    TBL_USERAUTHORIZATION tua = new TBL_USERAUTHORIZATION();
            //    tua.userid = userid;
            //    tua.roleid = roleid;
            //    tuaList.Add(tua);
            //}



            try
            {

                List<TBL_USER> list = userBLL.GetList(string.Format(" and A.username='{0}' AND A.userid !='{1}'", username, userid)).ToList<TBL_USER>();
                if (list.Count > 0)
                {
                    json = "{IsSuccess:'false',Message:'该登录名已存在，请重新输入！'}";
                }
                else
                {
                    if (userBLL.Update(user))
                    {
                        //useraBLL.Delete(" userid='" + userid + "'");
                        //foreach (TBL_USERAUTHORIZATION tua in tuaList)
                        //{
                        //    useraBLL.Insert(tua);
                        //}
                        //if (!string.IsNullOrEmpty(password))
                        //{
                        //    userBLL.UpdatePwd(user);
                        //}
                        

                        TBL_USERAUTHORIZATION tua = new TBL_USERAUTHORIZATION();
                        tua.userid = userid;
                        tua.roleid = roleid;
                        useraBLL.Update(tua);
                        state = true;
                    }

                    if (state)
                    {
                        json = "{IsSuccess:'true',Message:'保存成功！'}";
                    }
                   

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'保存失败！'}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'保存失败！'}");

            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion




        #region --------------------------删除用户--------------------------
        private void delUser(HttpContext context)
        {
            string userid = context.Request["userid"];
            string json = "";

            try
            {
                if (useraBLL.Delete("  userid='" + userid + "' "))
                {
                    if (userBLL.Delete(" userid='" + userid + "'"))
                    {
                        json = "{IsSuccess:'true',Message:'删除成功！'}";
                    }
                    else
                    {
                        json = "{IsSuccess:'false',Message:'删除失败！'}";
                    }
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'删除失败！'}";
                }


            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'删除失败！'}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'保存失败！'}");
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region--------------------------重置密码--------------------------
        private void reset(HttpContext context)
        {
            string userid = context.Request["userid"];
            string json = "";
            TBL_USER user = new TBL_USER();
            user.userid = userid;
            user.password = FormsAuthentication.HashPasswordForStoringInConfigFile("88888888", "MD5");

            try
            {
                if (userBLL.UpdatePwd(user))
                {
                    json = "{IsSuccess:'true',Message:'重置成功，初始密码88888888！'}";
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'操作失败！'}";
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'操作失败！'}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'保存失败！'}");
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region--------------------------修改密码--------------------------
        private void updatepaw(HttpContext context)
        {
            string userid = context.Request["userid"];
            string password = context.Request["password"];
            string json = "";
            TBL_USER user = new TBL_USER();
            user.userid = userid;
            user.password = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");

            try
            {
                if (userBLL.UpdatePwd(user))
                {
                    json = "{IsSuccess:'false',Message:'操作成功！'}";
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'操作失败！'}";
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'操作失败！'}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'保存失败！'}");
            }
            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();

        }
        #endregion

        #region --------------------------获取登录用户信息--------------------------
        private void getLoginUser(HttpContext context)
        {
            string json = "";


            try
            {
                string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
                TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);

                List<TBL_USER> userList = userBLL.GetList(" and a.userid='" + user.userid + "'  ").ToList<TBL_USER>();
                if (userList.Count > 0)
                {
                    user = userList[0];
                    json = "{IsSuccess:'true',Message:'" + JsonConvert.SerializeObject(user) + "'}";
                }
                else
                {
                    json = "{IsSuccess:'false',Message:'无此用户！'}";
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'操作失败！'}";
            }

            json = JsonConvert.SerializeObject(json);
            context.Response.ContentType = "application/json";
            //返回JSON结果
            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region --------------------------修改用户信息--------------------------
        private void updateUser(HttpContext context)
        {

            string userid = context.Request["userid"];
            string name = context.Request["name"];
            string Icon = context.Request["Icon"];
            string phone = context.Request["phone"];
            string password = context.Request["password"];
            string json = "";

            TBL_USER user = new TBL_USER();
            user.userid = userid;
            user.name = name;
            user.phone = phone;
            user.Icon = System.Text.Encoding.Default.GetBytes(Icon);
            user.password = FormsAuthentication.HashPasswordForStoringInConfigFile(password, "MD5");


            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER cuser = JsonConvert.DeserializeObject<TBL_USER>(strUser);
            try
            {
                if (userBLL.UpdateUser(user))
                {
                    if (!string.IsNullOrEmpty(password))
                    {
                        userBLL.UpdatePwd(user);
                        cuser.password = user.password;
                    }
                    cuser.userid = user.userid;
                    cuser.name = user.name;
                    cuser.phone = user.phone;
                    //cuser.Icon = user.Icon;
                    //cuser.password = user.password;
                    FormsAuthentication.SignOut();
                    string userDate = JsonConvert.SerializeObject(cuser);

                    //创建一个身份验证票  
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, "WZGL", DateTime.Now, DateTime.Now.AddMinutes(1440), true, userDate);
                    //将身份验证票加密  
                    string EncrTicket = FormsAuthentication.Encrypt(ticket);
                    //创建一个Cookie  
                    HttpCookie myCookie = new HttpCookie(FormsAuthentication.FormsCookieName, EncrTicket);
                    //将Cookie写入客户端  
                    context.Response.Cookies.Add(myCookie);

                    json = "{IsSuccess:'true',Message:'保存成功！'}";

                }
                else
                {
                    json = "{IsSuccess:'false',Message:'保存失败！'}";
                }


            }
            catch (Exception ex)
            {
                logger.Error(ex.Message);
                json = "{IsSuccess:'false',Message:'保存失败！'}";
                //json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'保存失败！'}");

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