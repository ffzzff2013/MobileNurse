
/* JavaScript content from js/NurseCountPage.js in folder common */

nurseCountPage = {};

nurseCountPage.init = function(){
	WL.Logger.debug("NurseCountPage :: init");
	$("#hTitle").text("工作量统计");
	$("#sc").trigger("create");
};