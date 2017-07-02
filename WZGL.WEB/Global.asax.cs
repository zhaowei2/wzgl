using log4net.Config;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using WZGL.WEB;

namespace WZGL.WEB
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // 在应用程序启动时运行的代码
           // AuthConfig.RegisterOpenAuth();
           // RouteConfig.RegisterRoutes(RouteTable.Routes);
   
            XmlConfigurator.ConfigureAndWatch(new FileInfo(AppDomain.CurrentDomain.BaseDirectory + "log4net.config"));
        }

        void Application_End(object sender, EventArgs e)
        {
            //  在应用程序关闭时运行的代码

        }

        protected void Application_BeginRequest(Object sender, EventArgs e)
        {
            HttpContext.Current.Response.Cache.SetNoStore();
        } 

        void Application_Error(object sender, EventArgs e)
        {
            // 在出现未处理的错误时运行的代码

        }
    }
}
