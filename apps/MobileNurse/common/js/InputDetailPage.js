
inputDetailPage = {};
var patientID;

inputDetailPage.init = function(){
	WL.Logger.debug("InputDetailPage :: init");
	pagesHistory.push("page/InputDetailPage.html");
	$("#bedIDS").html(curPatientInfo.bedNumber + "号");
	$("#pNameS").html(curPatientInfo.name);
	$("#pAgeS").html(curPatientInfo.age);
	$("#pSexS").html(curPatientInfo.sex);
	$("#pIDS").html(curPatientInfo.id);		
	$("#hTitle").text("体征录入");
	mobileNursePage.changeTopBarIcon("return");
	$("#wrap").trigger("create");
	$("#segmentContent").load(ROOTPATH + "page/SignCollectionPage.html", function(){
		signCollectionPage.init();
	});
};

inputDetailPage.selectInputSegment = function(segmentNo){
	WL.Logger.debug("SignCollectionPage :: selectSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#signCollection").removeClass('ui-control-inactive');
		$("#signCollection").addClass('ui-control-active');
		$("#outInCollection").removeClass('ui-control-active');
		$("#outInCollection").addClass('ui-control-inactive');
		$("#statics").removeClass('ui-control-active');
		$("#statics").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/SignCollectionPage.html", function(){
			signCollectionPage.init();
		});
	}
	
	if ("2" == segmentNo){
		$("#signCollection").removeClass('ui-control-active');
		$("#signCollection").addClass('ui-control-inactive');
		$("#outInCollection").removeClass('ui-control-inactive');
		$("#outInCollection").addClass('ui-control-active');
		$("#statics").removeClass('ui-control-active');
		$("#statics").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/OutInCollectionPage.html", function(){
			outInCollectionPage.init();
		});
	}
};