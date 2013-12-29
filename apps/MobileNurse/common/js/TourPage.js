tourPage = {};

tourPage.init = function(){
	WL.Logger.debug("TourPage :: init");
	pagesHistory.push("page/TourPage.html");
	//patientID = pID;
	$("#hTitle").text("巡视");
	mobileNursePage.changeTopBarIcon("return");
	$("#wrap").trigger("create");
	$("#bedIDS").html(curPatientInfo.bedNumber + "号");
	$("#pNameS").html(curPatientInfo.name);
	$("#pAgeS").html(curPatientInfo.age);
	$("#pSexS").html(curPatientInfo.sex);
	$("#pIDS").html(curPatientInfo.id);		
	$("#segmentContent").load(ROOTPATH + "page/DialyTourPage.html", function(){
		dialyTourPage.init();
	});
};

tourPage.selectTourSegment = function(segmentNo){
	WL.Logger.debug("TourPage :: selectSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#liquidTourSeg").removeClass('ui-control-active');
		$("#liquidTourSeg").addClass('ui-control-inactive');
		$("#dialyTourSeg").removeClass('ui-control-inactive');
		$("#dialyTourSeg").addClass('ui-control-active');
		$("#tourRecSeg").removeClass('ui-control-active');
		$("#tourRecSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/DialyTourPage.html", function(){
			dialyTourPage.init();
		});
	}
	if ("2" == segmentNo){
		$("#dialyTourSeg").removeClass('ui-control-active');
		$("#dialyTourSeg").addClass('ui-control-inactive');
		$("#liquidTourSeg").removeClass('ui-control-inactive');
		$("#liquidTourSeg").addClass('ui-control-active');
		$("#tourRecSeg").removeClass('ui-control-active');
		$("#tourRecSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/LiquidTourPage.html", function(){
			liquidTourPage.init();
		});
	}
	if ("3" == segmentNo){
		$("#liquidTourSeg").removeClass('ui-control-active');
		$("#liquidTourSeg").addClass('ui-control-inactive');
		$("#tourRecSeg").removeClass('ui-control-inactive');
		$("#tourRecSeg").addClass('ui-control-active');
		$("#dialyTourSeg").removeClass('ui-control-active');
		$("#dialyTourSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/TourRecordPage.html", function(){
			tourRecordPage.init();
		});
	}
	
};