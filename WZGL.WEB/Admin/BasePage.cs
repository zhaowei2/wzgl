using WZGL.MODEL.Admin;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace WZGL.WEB.Admin
{
    public class BasePage : System.Web.UI.Page
    {
       //public static TSP.SERVICE.SSOService.USER user = null;
        //存放登录信息
        //public static TBL_USER user;
        public BasePage()
        {

        }

        private void Page_Init(object sender, EventArgs e)
        {
            this.InitComplete += new EventHandler(ManagePage_Load);
        }

        void ManagePage_Load(object sender, EventArgs e)
        {
            //user = HttpContext.Current.Session["USER"] as TSP.SERVICE.SSOService.USER;
            //if (user == null)
            //{
            //    FormsAuthentication.SignOut();
            //    MyStringHelper.RemoveAllCache();
            //    SSORequest ssoRequest = new SSORequest();
            //    ssoRequest.IASID = "01";
            //    ssoRequest.Logout = "Logout";
            //    ssoRequest.TimeStamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            //    Authentication.CreateAppToken(ssoRequest);
            //    ssoRequest.AppUrl = System.Configuration.ConfigurationManager.AppSettings["ZHLDERROR"].ToString();//"http://localhost:8629/Login.aspx";
            //    Post(ssoRequest);
            //}
            //else
            //{
            //    Hashtable hOnline = (Hashtable)Application["Online"];//获取已经存储的application值
            //    if (hOnline != null)
            //    {
            //        IDictionaryEnumerator idE = hOnline.GetEnumerator();
            //        while (idE.MoveNext())
            //        {
            //            if (idE.Key != null && idE.Key.ToString().Equals(Session.SessionID))
            //            {

            //                if (idE.Value != null && "XX".Equals(idE.Value.ToString()))//说明在别处登录
            //                {
            //                    hOnline.Remove(HttpContext.Current.Session.SessionID);
            //                    Application.Lock();
            //                    Application["Online"] = hOnline;
            //                    Application.UnLock();
            //                    //FormsAuthentication.SignOut();
            //                    //MyStringHelper.RemoveAllCache();
            //                    string js = "<script language=javascript>alert('{0}');parent.location.replace('{1}')</script>";
            //                    Response.Write(string.Format(js, "帐号已在别处登录 ，你将被强迫下线（请保管好自己的用户密码）！", System.Configuration.ConfigurationManager.AppSettings["ZHLDERROR"].ToString() + "?Logout=Logout"));
            //                    return;
            //                }
            //                break;
            //            }
            //        }
            //    }
            //}
        }
        //post请求
        //void Post(SSORequest ssoRequest)
        //{
        //    PostService ps = new PostService();
        //    ps.Url = ssoRequest.AppUrl;
        //    ps.Add("UserCode", ssoRequest.UserCode);
        //    ps.Add("Logout", ssoRequest.Logout);
        //    ps.Add("UserAccount", ssoRequest.UserAccount);
        //    ps.Add("IASID", ssoRequest.IASID);
        //    ps.Add("TimeStamp", ssoRequest.TimeStamp);
        //    ps.Add("AppUrl", ssoRequest.AppUrl);
        //    ps.Add("Authenticator", ssoRequest.Authenticator);
        //    ps.Post();
        //}
        /// <summary>
        /// 判断用户权限
        /// </summary>
        protected void chkLoginLevel(string pagestr)
        {
            string msbox = "";
            int utype = int.Parse(HttpContext.Current.Session["USER"].ToString());
            string ulevel = HttpContext.Current.Session["AdminLevel"].ToString();
            if (utype > 1)
            {
                pagestr += ",";
                if (ulevel.IndexOf(pagestr) == -1)
                {
                    msbox += "<script type=\"text/javascript\">\n";
                    msbox += "parent.jsmsg(350,230,\"警告提示\",\"<b>没有管理权限</b>您没有权限管理该功能，请勿非法进入。\",\"back\")\n";
                    msbox += "</script>\n";
                    Response.Write(msbox);
                    Response.End();
                }
            }
        }

        /// <summary>
        /// 检查Cookie超时
        /// </summary>
        //public void CheckCookieTimeout()
        //{
        //    HttpCookie cookie = HttpContext.Current.Request.Cookies.Get(System.Web.Security.FormsAuthentication.FormsCookieName);
        //    if (FormsAuthentication.Authenticate(cookie.Name, cookie.Value))
        //    {
        //        FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(cookie.Value);
        //        DateTime dt = ticket.IssueDate;
        //        TimeSpan ts = DateTime.Now - dt;
        //        int SessionExpires = GetSessionTimeout();
        //        if (ticket.Expired || ticket.Expiration > DateTime.Now || ts.Days > 0 || ts.Hours > 1 || ts.Minutes > SessionExpires)
        //        {
        //            //调用SSO服务注销用户
        //            System.Security.Authentication.Logout();
        //            FormsAuthentication.SignOut();
        //            HttpContext.Current.Response.Redirect(System.Configuration.ConfigurationManager.AppSettings["ZHLDERROR"].ToString(), false);
        //            HttpContext.Current.ApplicationInstance.CompleteRequest();
        //        }
        //    }
        //}

        /// <summary>
        /// 检查Session超时
        /// </summary>
        //public void CheckSessionTimeout()
        //{
        //    if (HttpContext.Current.Session["USER"] != null || String.IsNullOrEmpty(Convert.ToString(HttpContext.Current.Session["USER"])))
        //    {
        //        //调用SSO服务注销用户
        //        Authentication.Logout();
        //        FormsAuthentication.SignOut();
        //        HttpContext.Current.Response.Redirect(System.Configuration.ConfigurationManager.AppSettings["ZHLDERROR"].ToString(), false);
        //        HttpContext.Current.ApplicationInstance.CompleteRequest();
        //    }
        //}

        /// <summary>
        /// 获取Web.Config中Session的超时分钟
        /// </summary>
        /// <returns></returns>
        public int GetSessionTimeout()
        {
            Configuration conn = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration(null);
            System.Web.Configuration.SessionStateSection sectionSession = (System.Web.Configuration.SessionStateSection)conn.GetSection("system.web/sessionState");
            return sectionSession.Timeout.Minutes;
        }

        /// <summary>
        /// 获取Web.Config中的Cookie的超时分钟
        /// </summary>
        /// <returns></returns>
        public int GetCookieTimeout()
        {
            Configuration conn = System.Web.Configuration.WebConfigurationManager.OpenWebConfiguration(null);
            System.Web.Configuration.AuthenticationSection section = (System.Web.Configuration.AuthenticationSection)conn.SectionGroups.Get("system.web").Sections.Get("authentication");
            return section.Forms.Timeout.Minutes;
        }
    }
}