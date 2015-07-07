using System.Web.Mvc;

namespace AspNetHistoryApi.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return Request.IsAjaxRequest() ? (ActionResult)PartialView() : View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return Request.IsAjaxRequest() ? (ActionResult)PartialView() : View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return Request.IsAjaxRequest() ? (ActionResult)PartialView() : View();
        }
    }
}