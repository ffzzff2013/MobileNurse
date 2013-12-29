/**
 * 
 */
tourRecordPage={};

tourRecordPage.init = function(){
	WL.Logger.debug("TourRecordPage :: init");
	pagesHistory.push("page/TourRecordPage.html");
	$("#hTitle").text("巡视");
	var dispatchObj = "searchCondition:LEFTFIXED,mmList";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid").hide();
	$("#fromDate,#toDate").mobiscroll().date({
		theme: 'jqm',
		display: 'bottom',
		mode: 'scroller',
		dateOrder: 'mmD ddyy',
		onClose: function(val, inst) {
		}
    });
	$("#wrap").trigger("create");
};

//查找巡视记录
tourRecordPage.searchTourRecord = function(){
	WL.Logger.debug("tourRecordPage :: searchTourRecord");
	var pId = $("#patientIDTxt").val();
	var pName = $("#patientNameTxt").val();
	var tourType = "";
	switch ($("#tourTypeSelect").val()){
	case "1":
		tourType = "日常巡视";
		break;
	case "2":
		tourType = "输液巡视";
		break;
	default:
		break;
	};
	tourRecordPage.getTourRecord(pId,pName,tourType);
};

/*//根据查找信息获取病人基本信息
tourRecordPage.getPatientBaseInfo = function(pId,pName,tourType){
	WL.Logger.debug("tourRecordPage :: getPatientBaseInfo :: " + docAdType);
	var queryP = {id: pId,name: pName};
	var queryOptions = {exact: true};
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
			curPatientInfo.bedNumber = pinfo.json.bedNum;
			tourRecordPage.getTourRecord(tourType);
		}else{
			alert("找不到病人信息");
		}
	});
};*/

//根据病人ID号和巡视类型查找巡视记录
tourRecordPage.getTourRecord = function(pId,pName,tourType){
	WL.Logger.debug("tourRecordPage :: getTourRecord :: " + tourType);
	var query = {patientId: pId,patientName: pName,type :tourType};
	var queryOptions = {exact: true};
	patrolCollection.find(query,queryOptions)
	.then(function(res){
		var tourList = "";
		tourList += "<div id='trdTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>姓名</div></div>";
		tourList += "<div id='trdTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>床号</div></div>";
		tourList += "<div id='trdTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>巡视人</div></div>";
		tourList += "<div id='trdTitle4' class='ui-block-d'><div class='ui-bar ui-bar-d'>巡视时间</div></div>";
		tourList += "<div id='trdTitle5' class='ui-block-e'><div class='ui-bar ui-bar-d'>情况</div></div>";
		for (var i = 0;i < res.length;i++){
			tourList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.patientName+"</div></div>";
			tourList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.bedNum+"</div></div>";
			tourList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.userName+"</div></div>";
			tourList += "<div class='ui-block-d'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			tourList += "<div class='ui-block-e'><div class='ui-bar ui-bar-c'>"+res[i].json.situation+"</div></div>";
		}
		$("#tourRecordD").text("");
		$("#tourRecordD").append(tourList);
	})
	.fail(function(){
		alert("获取病人巡视记录失败");
	});
};