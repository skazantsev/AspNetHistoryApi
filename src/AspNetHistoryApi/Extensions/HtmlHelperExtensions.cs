using System.Web.Mvc;

namespace AspNetHistoryApi.Extensions
{
    public static class HtmlHelperExtensions
    {
        public static MvcHtmlString PartialViewTitle(this HtmlHelper html, string title)
        {
            var tag = new TagBuilder("input");
            tag.MergeAttribute("id", "partialViewTitle");
            tag.MergeAttribute("type", "hidden");
            tag.MergeAttribute("value", title);

            return MvcHtmlString.Create(tag.ToString(TagRenderMode.SelfClosing));
        }
    }
}