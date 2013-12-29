
bedInfoPage = {};

bedInfoPage.init = function(bedNo,pId){
	WL.Logger.debug("BedInfoPage :: init :: " + bedNo + "," + pId);
	pagesHistory.push("page/BedInfoPage.html");
	mobileNursePage.changeTopBarIcon("return");
	curPatientInfo.bedNumber = bedNo;
	bedInfoPage.getPatientBaseInfo(pId);
};

bedInfoPage.getPatientBaseInfo = function(pId){
	var queryP = {id: pId};
	var queryOptions = { exact: true };
	patientCollection.find(queryP,queryOptions)
	.then(function (arrayResult){
		if (arrayResult.length > 0){
			var pinfo = arrayResult[0];
			curPatientInfo.name = pinfo.json.name;
			curPatientInfo.sex = pinfo.json.sex;
			curPatientInfo.age = pinfo.json.age;
			curPatientInfo.id = pinfo.json.id;
			curPatientInfo.hospNum = pinfo.json.hospNum;
			curPatientInfo.deparName = pinfo.json.deparName;
			curPatientInfo.nurseLevel = pinfo.json.nurseLevel;
			curPatientInfo.state = pinfo.json.state;
			curPatientInfo.diagnose = pinfo.json.diagnose;
			curPatientInfo.allergyMedic = pinfo.json.allergyMedic;
			curPatientInfo.temperature = pinfo.json.temperature;
			curPatientInfo.admissionDate = pinfo.json.admissionDate;
			curPatientInfo.surgeryDate = pinfo.json.surgeryDate;
			curPatientInfo.doctorName = pinfo.json.doctorName;
			curPatientInfo.doctorPhone = pinfo.json.doctorPhone;
			curPatientInfo.nurseName = pinfo.json.nurseName;
			curPatientInfo.nursePhone = pinfo.json.nursePhone;
			curPatientInfo.familyContact = pinfo.json.familyContact;
			curPatientInfo.familyPhone = pinfo.json.familyPhone;
			curPatientInfo.profession = pinfo.json.profession;
			curPatientInfo.costType = pinfo.json.costType;
			curPatientInfo.prepayment = pinfo.json.prepayment;
			curPatientInfo.payCost = pinfo.json.payCost;
			curPatientInfo.valuationFee = pinfo.json.valuationFee;
			curPatientInfo.dietType = pinfo.json.dietType;
			$('html, body').animate({scrollTop: 0}, 'slow');
			$("#hTitle").text("病床信息");
			$("#wrap").trigger("create");
			$("#segmentContent").load(ROOTPATH + "page/BaseInfoPage.html", function(){
				baseInfoPage.init();
			});
		}else{
			alert("找不到病人信息");
		}
	})
	.fail(function (errorObject){
		alert("fail");
	});
};

bedInfoPage.selectSegment = function(segmentNo){
	WL.Logger.debug("bedInfoPage :: selectSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#baseInfo").removeClass('ui-control-inactive');
		$("#baseInfo").addClass('ui-control-active');
		$("#docInstruct").removeClass('ui-control-active');
		$("#docInstruct").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#sc").remove();
		$("#segmentContent").load(ROOTPATH + "page/BaseInfoPage.html", function(){
			baseInfoPage.init();
		});
	}
	if ("2" == segmentNo){
		$("#baseInfo").removeClass('ui-control-active');
		$("#baseInfo").addClass('ui-control-inactive');
		$("#docInstruct").removeClass('ui-control-inactive');
		$("#docInstruct").addClass('ui-control-active');
		$("#page").trigger("create");
		$("#sc").remove();
		$("#segmentContent").load(ROOTPATH + "page/DocInstructPage.html", function(){
			docInstructPage.init();
		});
	}
};