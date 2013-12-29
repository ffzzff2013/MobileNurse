
/* JavaScript content from js/CureCountPage.js in folder common */
cureCountPage = {};

cureCountPage.init = function(){
	WL.Logger.debug("CureCountPage :: init");
	pagesHistory.push("page/CureCountPage.html");
	$("#hTitle").text("工作量统计");
	$("#sc").trigger("create");
};