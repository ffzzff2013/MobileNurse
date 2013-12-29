workCountPage = {};

workCountPage.init = function(){
	WL.Logger.debug("WorkCountPage :: init");
	pagesHistory.push("page/WorkCoutPage.html");
	//patientID = pID;
	$("#hTitle").text("工作量统计");
	$("#page").trigger("create");
	$("#segmentContent").load(ROOTPATH + "page/CureCountPage.html", function(){
		cureCountPage.init();
	});
};

workCountPage.selectWorkCountSegment = function(segmentNo){
	WL.Logger.debug("TourPage :: WorkCountSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#WSNSeg").attr({"class":"ui-control-inactive"});
		$("#WSCSeg").attr({"class":"ui-control-active"});
		$("#wrap").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/CureCountPage.html", function(){
			cureCountPage.init();
		});
	}
	if ("2" == segmentNo){
		$("#WSCSeg").attr({"class":"ui-control-inactive"});
		$("#WSNSeg").attr({"class":"ui-control-active"});
		$("#wrap").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/NurseCountPage.html", function(){
			nurseCountPage.init();
		});
	}
};