
/* JavaScript content from js/NurseRecordPage.js in folder common */
nurseRecordPage={};

nurseRecordPage.init = function(){
	WL.Logger.debug("NurseRecordPage :: init");
	pagesHistory.push("page/NurseRecordPage.html");
	$("#hTitle").text("护理");
	var dispatchObj = "searchCondition:LEFTFIXED,mmList";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
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

//查找护理记录
nurseRecordPage.searchNurseRecord = function(){
	WL.Logger.debug("nurseRecordPage :: searchNurseRecord");
	var pId = $("#patientIDTxt").val();
	var pName = $("#patientNameTxt").val();
	var nurseType = "";
	switch ($("#nurseTypeSelect").val()){
	case "0":
		nurseType = "全部";
		break;
	case "1":
		nurseType = "基础护理";
		break;
	case "2":
		nurseType = "专科护理";
		break;
	default:
		break;
	};
	nurseRecordPage.getPatientBaseInfo(pId,pName,nurseType);
};

//根据查找信息获取病人基本信息
nurseRecordPage.getPatientBaseInfo = function(pId,pName,nurseType){
	WL.Logger.debug("outInRecPage :: getPatientBaseInfo :: " + nurseType);
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
			//alert(curPatientInfo.bedNumber);
			nurseRecordPage.getNurseRecord(pId,nurseType);
		}else{
			alert("找不到病人信息");
		}
	});
};

//根据病人ID号和护理类型查找护理记录
nurseRecordPage.getNurseRecord = function(pId,nurseType){
	WL.Logger.debug("nurseRecordPage :: getNurseRecord :: " + nurseType);
	var query = {patientId: pId}; 
	var queryOptions = {exact: true};
	nurseRecordCollection.find(query,queryOptions)
	.then(function(res){
		var nurseList = "";
		nurseList += "<div id='nrcTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>护理内容</div></div>";
		nurseList += "<div id='nrcTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>执行人</div></div>";
		nurseList += "<div id='nrcTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>护理时间</div></div>";
		for (var i = 0;i < res.length;i++){
			nurseList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.itemContent+"</div></div>";
			nurseList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
			nurseList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";		
		}
		$("#nurseRecordD").text("");
		$("#nurseRecordD").append(nurseList);
	})
	.fail(function(){
		alert("获取病人巡视记录失败");
	});
};