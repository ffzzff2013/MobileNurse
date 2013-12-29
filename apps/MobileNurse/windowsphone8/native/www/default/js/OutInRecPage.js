
/* JavaScript content from js/OutInRecPage.js in folder common */
outInRecPage={};

outInRecPage.init = function(){
	WL.Logger.debug("OutInRecPage :: init");
	pagesHistory.push("page/OutInRecPage.html");
	$("#hTitle").text("进出管理");
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

//查找出入记录
outInRecPage.searchOutInRecord = function(){
	WL.Logger.debug("outInRecPage :: searchOutInRecord");
	var pId = $("#patientIDTxt").val();
	var pName = $("#patientNameTxt").val();
	var outInType = "";
	switch ($("#outInTypeSelect").val()){
	case "0":
		outInType = "全部";
		break;
	case "1":
		outInType = "外出扫描";
		break;
	case "2":
		outInType = "回室扫描";
		break;
	default:
		break;
	};
	outInRecPage.getPatientBaseInfo(pId,pName,outInType);
};

//根据查找信息获取病人基本信息
outInRecPage.getPatientBaseInfo = function(pId,pName,outInType){
	WL.Logger.debug("outInRecPage :: getPatientBaseInfo :: " + outInType);
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
			outInRecPage.getOutInRecord(pId,outInType);
		}else{
			alert("找不到病人信息");
		}
	});
};

//根据病人ID号和出入类型查找出入记录
outInRecPage.getOutInRecord = function(pId,outInType){
	WL.Logger.debug("outInRecPage :: getOutInRecord :: " + outInType);
	var query;
	if (outInType == "全部")
		query = {patientId: pId};
	else
		query = {patientId: pId,type :outInType}; 
	var queryOptions = {exact: true};
	discrepancyCollection.find(query,queryOptions)
	.then(function(res){
		var outInList = "";
		outInList += "<div id='oirTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>记录人</div></div>";
		outInList += "<div id='oirTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>床号</div></div>";
		outInList += "<div id='oirTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>类型</div></div>";
		outInList += "<div id='oirTitle4' class='ui-block-d'><div class='ui-bar ui-bar-d'>出入时间</div></div>";
		outInList += "<div id='oirTitle5' class='ui-block-e'><div class='ui-bar ui-bar-d'>外出原因</div></div>";
		for (var i = 0;i < res.length;i++){
			outInList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.nurseName+"</div></div>";
			outInList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curPatientInfo.bedNumber+"</div></div>";
			outInList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.type+"</div></div>";
			outInList += "<div class='ui-block-d'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			outInList += "<div class='ui-block-e'><div class='ui-bar ui-bar-c'>"+res[i].json.outStyle+"</div></div>";
		}
		$("#outInRecordD").text("");
		$("#outInRecordD").append(outInList);
	})
	.fail(function(){
		alert("获取病人巡视记录失败");
	});
};