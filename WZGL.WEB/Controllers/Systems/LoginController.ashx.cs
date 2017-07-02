using log4net;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using WZGL.BLL;
using WZGL.IBLL.System;
using WZGL.MODEL.System;

namespace WZGL.WEB.Controllers.Systems
{
    /// <summary>
    /// LoginController 的摘要说明
    /// </summary>
    public class LoginController : IHttpHandler
    {
        #region 变量
        readonly ILog logger = LogManager.GetLogger(typeof(OrganizationController));
        IUserBLL userBLL = BllFactory.GetUserBLL();
        #endregion
        
        public void ProcessRequest(HttpContext context)
        {
            string action = context.Request["action"];
            switch (action)
            {
                //登录
                case "login": login(context); break;
                //退出登录
                case "logOut": logOut(context); break;
                    
            }
        }

        #region ------------------------登录------------------------
        private void login(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            string json = "";
            try
            {
                string username = context.Request["username"];
                string password = FormsAuthentication.HashPasswordForStoringInConfigFile(context.Request["password"], "MD5");
                string code = context.Request["code"];
                IList<TBL_USER> userList = userBLL.GetList(string.Format(" and username='{0}' and password='{1}' ", username, password));
                if (userList.Count > 0)
                {
                    TBL_USER user = userList[0] as TBL_USER;
                    user.Icon = null;
                    user.icons = "";
                    string userDate = JsonConvert.SerializeObject(user);

                    //创建一个身份验证票  
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, "WZGL", DateTime.Now, DateTime.Now.AddMinutes(1440), true, userDate);
                    //将身份验证票加密  
                    string EncrTicket = FormsAuthentication.Encrypt(ticket);
                    //创建一个Cookie  
                    HttpCookie myCookie = new HttpCookie(FormsAuthentication.FormsCookieName, EncrTicket);
                    //将Cookie写入客户端  
                    context.Response.Cookies.Add(myCookie);
                    //跳转到初始请求页或默认页面  
                    //context.Response.Redirect(FormsAuthentication.GetRedirectUrl("NHJF", false));  

                    json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'登录成功！'}");

                }

                else
                {
                    json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'用户名或密码错误！'}");
                }
            }
            catch (Exception ception)
            {
                logger.Error(ception.Message);
                json = JsonConvert.SerializeObject("{IsSuccess:'false',Message:'" + ception.Message + "'}");
            }

            context.Response.Write(json);
            context.Response.End();
        }
        #endregion


        #region ------------------------退出登录------------------------
        /// <summary>
        /// 退出登录
        /// </summary>
        /// <param name="context"></param>
        public void logOut(HttpContext context)
        {
            string json ="";
            try
            {

                FormsAuthentication.SignOut();
                json = JsonConvert.SerializeObject("{IsSuccess:'true',Message:'注销成功！'}");
                context.Response.Write(json);
                context.Response.End();
            }
            catch (Exception ception)
            {
                logger.Error(ception);
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