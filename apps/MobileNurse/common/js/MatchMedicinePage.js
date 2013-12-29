
matchMedicinePage={};
var docAdArr = [];

matchMedicinePage.init = function(){
	WL.Logger.debug("MatchMedicinePage :: init");
	pagesHistory.push("page/MatchMedicinePage.html");
	$("#doctorAdviceDetailD,#docAdList,#base-info-grid").hide();
	$("#hTitle").text("配药");
	$("#fromDate,#toDate").mobiscroll().date({
		theme: 'jqm',
		display: 'bottom',
		mode: 'scroller',
		dateOrder: 'mmD ddyy',
		onClose: function(val, inst) {
		}
    });
	//var dispatchObj = "docAdList:LEFTFIXED,base-info-grid:LEFTFIXED,doctorAdviceDetailD:RIGHTFIXED";
	var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,docAdList:LEFTFIXED,doctorAdviceDetailD:RIGHTFIXED";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#pageContent").trigger("create");
};

matchMedicinePage.searchDocAd = function(){
	WL.Logger.debug("MatchMedicinePage :: searchDocAd");
	var pId = $("#patientIDTxt").val();
	var pName = $("#patientNameTxt").val();
	var docAdType = "";
	switch ($("#docTypeSelect").val()){
	case "0":
		docAdType = "全部";
		break;
	case "1":
		docAdType = "长期医嘱";
		break;
	case "2":
		docAdType = "临时医嘱";
		break;
	case "3":
		docAdType = "作废医嘱";
		break;
	default:
		break;
	};
	$("#docAdList").text("");
	$("#docAdList").show();
	$("#doctorAdviceDetailD").hide();
	matchMedicinePage.getPatientBaseInfo(pId,pName,docAdType);
};

//确认配药完成并记录操作
matchMedicinePage.hasMatchedMedicine = function(){
	var date = new Date();
	var time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var matchRecordData = {recordId:"match"+time,item:"配药",time:time,patientId:curPatientInfo.id,adviceId:curDoctorAdvice.id,
			executor:curUserInfo.chineseName,userId:curUserInfo.userId};
	var options = {};
	var recordList = "";
	recordList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"userId\":\"" + curUserInfo.userId + 
	"\",\"executor\":\"" + curUserInfo.chineseName + "\",\"time\":\""+ time + "\",\"adviceId\":\""+ curDoctorAdvice.id + 
	"\",\"item\":\"配药\",\"id\":\"" + "match"+time +"\"}]";
	busyIndicator.show();
	$.ajax({
		url:SERVERADDRESS + "updateToUser",
		type:"POST",
		data:{session:curUserInfo.session,discrepancyList:"[]",EMRecordList:"[]"
			,nurseRecordList:"[]",patroList:"[]",recordList:recordList},
		timeout:5000,
		dataType:"json",
		success:function(data){
			if (data["resultCode"]=="0000"){
				alert("上传成功");
				recordCollection.add(matchRecordData,options)
				.then(function(){
					var execRecGrid = "";
					execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+"配药"+"</div></div>";
					execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";		
					$("#execRecG").append(execRecGrid);	
					//取消配药按钮
					var text = "<span style='font-size:1.5em'>已配药</span>";
					$("#matchMedicineD").text("");
					$("#matchMedicineD").append(text);
				});
			};
			if (data["resultCode"]=="0002"){
				alert(data["msg"]);
			};
			busyIndicator.hide();
		  },
		error:function(){
			busyIndicator.hide();
			alert("登记信息失败");
		}
	});
};

//根据查找信息获取病人基本信息
matchMedicinePage.getPatientBaseInfo = function(pId,pName,docAdType){
	WL.Logger.debug("MatchMedicinePage :: getPatientBaseInfo :: " + docAdType);
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
			
			$("#base-info-grid,#docAdList").show();
			$("#bedIDS").html(curPatientInfo.bedNumber + "号");
			$("#pNameS").html(curPatientInfo.name);
			$("#pAgeS").html(curPatientInfo.age);
			$("#pSexS").html(curPatientInfo.sex);
			$("#pIDS").html(curPatientInfo.id);
			matchMedicinePage.getDocAdByPid(docAdType);
		}else{
			alert("找不到病人信息");
			$("#bedIDS").text("");
			$("#pNameS").text("");
			$("#pAgeS").text("");
			$("#pSexS").text("");
			$("#pIDS").text("");
		}
	});
	
	
};

//根据病人ID获取病人医嘱
matchMedicinePage.getDocAdByPid = function(insType){
	WL.Logger.debug("MatchMedicinePage :: getDocAdByPid :: "+insType);
	var query = {patientId:curPatientInfo.id};
	var queryOptions = { exact: true };
	doctorsAdviceCollection.find(query,queryOptions)
	.then(function(res){
		docAdArr = res;
		matchMedicinePage.selectDocAdByType(insType);
	})
	.fail(function(){
		alert("医嘱查找失败");
	});
};

//根据医嘱类型筛选医嘱
matchMedicinePage.selectDocAdByType = function(insType){
	WL.Logger.debug("MatchMedicinePage :: selectDocAdByType :: insType");
	var docAdList = "<ul data-role='listview' data-theme='f' data-inset='true' style='margin:1%'>";
	docAdList += "<li data-role='list-divider' data-theme='f'  style='font-size: 1em'>医嘱列表</li>";
	for (var i = 0;i < docAdArr.length;i++){
		if (docAdArr[i].json.type == insType || insType == "全部"){
			docAdList += "<li><a href='#' onclick='matchMedicinePage.selectedDocAd("+ i +")'>" + docAdArr[i].json.content + "</a></li>";
		}
	}
	docAdList += "</ul>";
	$("#docAdList").append(docAdList);
	//只有div才能用trigger("create");
	$("#docAdList").trigger("create");
	
};

//查看医嘱具体信息
matchMedicinePage.selectedDocAd = function(number){
	WL.Logger.debug("MatchMedicinePage :: selectedDocAd :: number");
	curDoctorAdvice.content = docAdArr[number].json.content;
	curDoctorAdvice.way = docAdArr[number].json.way;
	curDoctorAdvice.dose = docAdArr[number].json.dose;
	curDoctorAdvice.frequency = docAdArr[number].json.frequency;
	curDoctorAdvice.startexecTime = docAdArr[number].json.startexecTime;
	curDoctorAdvice.doctorName = docAdArr[number].json.doctorName;
	curDoctorAdvice.type = docAdArr[number].json.type;
	curDoctorAdvice.id = docAdArr[number].json.adviceId;
	curDoctorAdvice.patientId = docAdArr[number].json.patientId;
	
	if (util.isWideScreen() == "false")
		$("#docAdList").hide();
	$("#doctorAdviceDetailD").show();
	scrollTop();
	matchMedicinePage.showExecRecord();
};

//展示医嘱的相关记录
matchMedicinePage.showExecRecord = function(){
	//alert(curDoctorAdvice.id);
	WL.Logger.debug("MatchMedicinePage :: showExecRecord");
	query = {adviceId:curDoctorAdvice.id};
	queryOptions = { exact: true };
	recordCollection.find(query,queryOptions)
	.then(function(res){
		$("#dAdPName").html(curPatientInfo.name);
		$("#dAdContent").html(curDoctorAdvice.content);
		$("#dAdWay").html(curDoctorAdvice.way);
		$("#dAdDose").html(curDoctorAdvice.dose);
		$("#dAdFrequency").html(curDoctorAdvice.frequency);
		$("#dAdType").html(curDoctorAdvice.type);
		$("#dAdExecTime").html(curDoctorAdvice.startexecTime);
		$("#dAdDName").html(curDoctorAdvice.doctorName);
		
		//alert(res.length);
		var execRecGrid = "";
		execRecGrid += "<div id='ergTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>项目</div></div>";
		execRecGrid += "<div id='ergTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>执行人</div></div>";
		execRecGrid += "<div id='ergTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>执行时间</div></div>";

		var btn = "<input type='button' value='配药' onclick='matchMedicinePage.hasMatchedMedicine()'/>";
		var text = "<span style='font-size:1.5em'>已配药</span>";
		if (res.length > 0){
			$("#matchMedicineD").text("");
			$("#matchMedicineD").append(text);
		}else{
			$("#matchMedicineD").text("");
			$("#matchMedicineD").append(btn);
		}
		for (var i = 0;i <res.length;i++){
			execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.item+"</div></div>";
			execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.executor+"</div></div>";
			execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.time+"</div></div>";	
		}
		$("#execRecG").text("");
		$("#execRecG").append(execRecGrid);	
		
		$("#doctorAdviceDetailD").trigger("create");
		
	})
	.fail(function(){
		alert("查找执行记录出错");
	});
};