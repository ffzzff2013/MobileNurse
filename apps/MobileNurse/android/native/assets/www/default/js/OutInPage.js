
/* JavaScript content from js/OutInPage.js in folder common */

outInPage = {};

outInPage.init = function(){
	WL.Logger.debug("OutInPage :: init");
	pagesHistory.push("page/OutInPage.html");
	//patientID = pID;
	$("#hTitle").text("出入管理");
	$("#pageContent").trigger("create");
	$("#segmentContent").load(ROOTPATH + "page/OutPage.html", function(){
		outPage.init();
	});
};

outInPage.selectOutInSegment = function(segmentNo){
	WL.Logger.debug("TourPage :: selectOutInSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#InScanSeg").removeClass('ui-control-active');
		$("#InScanSeg").addClass('ui-control-inactive');
		$("#OutScanSeg").removeClass('ui-control-inactive');
		$("#OutScanSeg").addClass('ui-control-active');
		$("#OutInRecSeg").removeClass('ui-control-active');
		$("#OutInRecSeg").addClass('ui-control-inactive');
		$("#wrap").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/OutPage.html", function(){
			outPage.init();
		});
	}
	if ("2" == segmentNo){
		//alert("hihi");
		$("#OutScanSeg").removeClass('ui-control-active');
		$("#OutScanSeg").addClass('ui-control-inactive');
		$("#InScanSeg").removeClass('ui-control-inactive');
		$("#InScanSeg").addClass('ui-control-active');
		$("#OutInRecSeg").removeClass('ui-control-active');
		$("#OutInRecSeg").addClass('ui-control-inactive');
		$("#wrap").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/InPage.html", function(){
			inPage.init();
		});
	}
	if ("3" == segmentNo){
		$("#InScanSeg").removeClass('ui-control-active');
		$("#InScanSeg").addClass('ui-control-inactive');
		$("#OutInRecSeg").removeClass('ui-control-inactive');
		$("#OutInRecSeg").addClass('ui-control-active');
		$("#OutScanSeg").removeClass('ui-control-active');
		$("#OutScanSeg").addClass('ui-control-inactive');
		$("#wrap").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/OutInRecPage.html", function(){
			outInRecPage.init();
		});
	}
	
};