using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;
using WZGL.BLL;
using WZGL.MODEL.Flow;
using WZGL.MODEL.System;

namespace WZGL.WEB.Common
{
    public class CFunctions : IRequiresSessionState
    {
        /// <summary>
        /// 获取当前登陆人的id
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string getUserId(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);  //获取当前用户信息

            return user.userid;
        }

        public static TBL_USER getUser(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);  //获取当前用户信息

            return user;
        }

        /// <summary>
        /// 获取当前登陆人的角色id
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string getRoleId(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);  //获取当前用户信息

            return user.roleid;
        }

        /// <summary>
        /// 获取当前登陆人的部门类型id
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string getOrgTypeId(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);  //获取当前用户信息

            return user.organizationtype;
        }

        /// <summary>
        /// 获取当前登陆人的部门id
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public static string getOrgId(HttpContext context)
        {
            string strUser = ((FormsIdentity)context.User.Identity).Ticket.UserData;
            TBL_USER user = JsonConvert.DeserializeObject<TBL_USER>(strUser);  //获取当前用户信息

            return user.organizationid;
        }


        //json 转换实体类List
        public static T JsonDeserialize<T>(string jsonString)
        {
            DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(T));
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(jsonString));
            T obj = (T)ser.ReadObject(ms);
            return obj;
        }

        //获取传入部门的子部门ID
        public static string getChildByParentId(string organizationid)
        {
            //1.获取所有部门数据
            BLL.System.OrganizationBLL BLL = new BLL.System.OrganizationBLL();
            IList<MODEL.System.TBL_ORGANIZATION> List = BLL.GetList(" 1=1 ");
            string organid = "";
            if (List.Count > 0)
            {
                //查询传入的部门id是否有数据
                IList<MODEL.System.TBL_ORGANIZATION> tion = (from p in List where p.organizationid == organizationid select p).ToList();
                if (tion.Count > 0)
                {
                    //递归获取子集数据
                    getChildId(List, tion[0].organizationid, ref organid);
                    organid = organid.Substring(0, organid.Length - 1);
                }
            }
            return organid;
        }
        private static void getChildId(IList<MODEL.System.TBL_ORGANIZATION> list, string organizationid, ref string organid)
        {
            organid += "'" + organizationid + "',";
            IList<MODEL.System.TBL_ORGANIZATION> organList = (from p1 in list where p1.parentid == organizationid select p1).ToList();
            if (organList.Count > 0)
            {
                foreach (MODEL.System.TBL_ORGANIZATION item in organList)
                {
                    getChildId(list, item.organizationid, ref organid);
                }
            }
        }

        public static Dictionary<string, string> getMyFlowDefine(HttpContext context)
        {
            string orgid = getOrgId(context);
            //WorkFlow.BLL.Operate.get

            List<FLOW_DERIVE_RELATION> list = BllFactory.GetFlow_Derive_RelationBLL().GetList(" and  CHILD_FRISTSTEP_DEPID='" + orgid + "'").ToList<FLOW_DERIVE_RELATION>();

            Dictionary<string, string> dclist = new Dictionary<string, string>();
            foreach (FLOW_DERIVE_RELATION model in list)
            {
                dclist.Add(model.define_code_child, model.TYPE_CODE);
            }

            return dclist;
        }

        /// <summary>
        /// 根据流程类型获取当前登录人对应的流程
        /// </summary>
        /// <param name="context"></param>
        /// <param name="TYPE_CODE"></param>
        /// <returns></returns>
        public static string getFlowDefineId(HttpContext context, string TYPE_CODE)
        {
            string orgid = getOrgId(context);
            List<FLOW_DERIVE_RELATION> list = BllFactory.GetFlow_Derive_RelationBLL().GetList(" and  CHILD_FRISTSTEP_DEPID='" + orgid + "' and TYPE_CODE='" + TYPE_CODE + "'").ToList<FLOW_DERIVE_RELATION>();
            if (list.Count > 0)
            {
                return list[0].define_code_child;
            }
            else
            {
                return "";
            }
        }

        //获取登录人的代办
        public static string getMyTask(HttpContext context)
        {
           
            TBL_USER user = getUser(context);
            List<WorkFlow.Model.FLOW_TASK> taskList = WorkFlow.BLL.Operate.getMyTask(user.userid, "", "", "");
            List<WorkFlow.Model.FLOW_TASK> fiveList = (from p in taskList select p).Take(4).ToList();
            string json = JsonConvert.SerializeObject(fiveList);
            return json;
        }

        //获取登录人的经办
        public static string getMyHandledTask(HttpContext context)
        {
            TBL_USER user = getUser(context);
            List<WorkFlow.Model.FLOW_TASK> taskList = WorkFlow.BLL.Operate.getMyHandledTask(user.userid, "", "", "");
            List<WorkFlow.Model.FLOW_TASK> fiveList = (from p in taskList select p).Take(4).ToList();
            string json = JsonConvert.SerializeObject(fiveList);
            return json;
        }
    }
}