
docInstructPage = {};
var docAdArr = [];
var insType = "全部";

docInstructPage.init = function(){
	WL.Logger.debug("DocInstructPage :: init ::");
	pagesHistory.push("page/DocInstructPage.html");
	$("#doctorAdviceDetailD").hide();
	var dispatchObj = "doctorAdviceListD:LEFTFIXED,doctorAdviceDetailD:RIGHTFIXED";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#sc").trigger("create");
	docInstructPage.getDocAdByPid();
};

//类型checkbox点击相应
docInstructPage.typeCBClick = function(id){
	if (id == "instruct1")
		insType = "长期医嘱";
	if (id == "instruct2")
		insType = "临时医嘱";
	if (id == "instruct3")
		insType = "作废医嘱";
	if (id == "instruct0")
		insType = "全部";
	$("#docAdList").text("");
	docInstructPage.selectDocAdByType(insType);

};

docInstructPage.getDocAdByPid = function(){
	query = {patientId:curPatientInfo.id};
	queryOptions = { exact: true };
	doctorsAdviceCollection.find(query,queryOptions)
	.then(function(res){
		docAdArr = res;
		//alert(docAdArr.length);
		docInstructPage.selectDocAdByType(insType);
	})
	.fail(function(){
		alert("医嘱查找失败");
	});
};

docInstructPage.selectDocAdByType = function(type){
	var docAdList = "<ul data-role='listview' data-theme='f' data-inset='true' style='margin: 1%'>";
	docAdList += "<li data-role='list-divider' data-theme='f' style='font-size: 1em'>医嘱列表</li>";
	for (var i = 0;i < docAdArr.length;i++){
		if (docAdArr[i].json.type == type || type == "全部"){
			docAdList += "<li><a href='#' onclick='docInstructPage.selectedDocAd("+ i +")'>" + docAdArr[i].json.content + "</a></li>";
		}
	}
	docAdList+="</ul>";
	//alert(docAdList);
	//$("#docAdList").text("");
	//alert(docAdList);
	$("#docAdList").append(docAdList);
	//只有div才能用trigger("create");
	$("#docAdList").trigger("create");
	
};

docInstructPage.selectedDocAd = function(number){
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
		$("#doctorAdviceListD").hide();
	$("#doctorAdviceDetailD").show();
	scrollTop();
	docInstructPage.showExecRecord();
};

docInstructPage.showExecRecord = function(){
	//alert(curDoctorAdvice.id);
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