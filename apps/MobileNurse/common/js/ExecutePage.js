/**
 * 
 */

executePage = {};
executePage.execRecCount = 0;    //表示当前执行记录条数，用于判断执行前是否已经核药
executePage.isMatch = "false";

executePage.init = function(){
	WL.Logger.debug("ExecutePage :: init");
	pagesHistory.push("page/ExecutePage.html");
	$("#hTitle").text("执行");
	//$("#scanTypeSel").bind("change",executePage.scanInput);//手机平板版
	$("#eSearchIDTxt").blur(executePage.lostFocus);
	//$("#doctorAdviceDetailD").hide();
	var dispatchObj = "searchContent:LEFTFIXED,scanResContent,doctorAdviceDetailD";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	/*var scanDocAdId = "3333333";
	var scanPatientId = "368825";
	executePage.getDocAdById(scanDocAdId);
	executePage.getPatientInfoById(scanPatientId);*/
	$("#wrap").trigger("create");
};

//执行医嘱并记录操作
executePage.hasExecuted = function(){
	WL.Logger.debug("executePage :: hasExecuted");
	if (executePage.isMatch == "false"){
		alert("请先匹配信息");
		return;
	}
	if (executePage.execRecCount == 0){
		alert("还未配药，请等待配药");
		return;
	}
	if (executePage.execRecCount == 1){
		alert("还未核药，请等待核药");
		return;
	}
	var date = new Date();
	var time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var matchRecordData = {recordId:"match"+time,item:"已执行",time:time,patientId:curPatientInfo.id,adviceId:curDoctorAdvice.id,
			executor:curUserInfo.chineseName,userId:curUserInfo.userId};
	var options = {};
	var recordList = "";
	recordList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"userId\":\"" + curUserInfo.userId + 
	"\",\"executor\":\"" + curUserInfo.chineseName + "\",\"time\":\""+ time + "\",\"adviceId\":\""+ curDoctorAdvice.id + 
	"\",\"item\":\"已执行\",\"id\":\"" + "match"+time +"\"}]";
	//alert(recordList);
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
					execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+"已执行"+"</div></div>";
					execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";		
					$("#execRecG").append(execRecGrid);	
				});
				var text = "<span style='font-size:1.5em'>已执行</span>";
				$("#executeDocAdD").text("");
				$("#executeDocAdD").append(text);
				$("#executeDocAdD").trigger("create");
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

executePage.scanInput = function(){
	var scanType = $(scanTypeSel).val();
	$("#matchResult").val("未匹配");
	if (scanType == "1")
		executePage.scanStrap();
	if (scanType == "2")
		executePage.scanLiquid();
		
};

executePage.scanStrap = function(){
	WL.Logger.debug("ExecutePage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	executePage.getStrap(result);
            }, 
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

executePage.scanLiquid = function(){
	WL.Logger.debug("ExecutePage :: scanLiquid");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	executePage.getLiquid(result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

executePage.getStrap = function (result){
	WL.Logger.debug("ExecutePage :: getStrap :: " + result);
	scanPatientId = result;
	executePage.getPatientInfoById(scanPatientId);
};

executePage.getLiquid = function (result){
	WL.Logger.debug("ExecutePage :: getStrap :: " + result);
	scanDocAdId = result;
	executePage.getDocAdById(scanDocAdId);
	//$("#pID2S").text(info[1]);
};

executePage.match = function (){
	WL.Logger.debug("ExecutePage :: match");
	if ($("#pIDS").text() == $("#pID2S").text()){
		WL.SimpleDialog.show("匹配结果","匹配成功，可以执行",[{text:"确定",handler:executePage.matchSuccess}]);
	} else {
		WL.SimpleDialog.show("匹配结果","匹配失败，需要重新匹配",[{text:"确定",handler:executePage.matchFail}]);
	}
};

executePage.matchSuccess = function() {
	$("#matchResult").html("匹配成功");
	executePage.isMatch = "true";
	alert("匹配成功");
};

executePage.matchFail = function() {
	$("#matchResult").html("匹配失败");
	executePage.isMatch = "false";
	alert("匹配失败");
};

//根据医嘱Id找到对应的医嘱信息
executePage.getDocAdById = function(scanDocAdId){
	WL.Logger.debug("executePage :: getDocAdById");
	var query = {adviceId: scanDocAdId};
	var queryOptions = { exact: true };
	doctorsAdviceCollection.find(query,queryOptions)
	.then(function(res){
		if (res.length > 0){
			var docAdInfo = res[0];
			curDoctorAdvice.content = docAdInfo.json.content;
			curDoctorAdvice.way = docAdInfo.json.way;
			curDoctorAdvice.dose = docAdInfo.json.dose;
			curDoctorAdvice.frequency = docAdInfo.json.frequency;
			curDoctorAdvice.startexecTime = docAdInfo.json.startexecTime;
			curDoctorAdvice.doctorName = docAdInfo.json.doctorName;
			curDoctorAdvice.type = docAdInfo.json.type;
			curDoctorAdvice.id = docAdInfo.json.adviceId;
			curDoctorAdvice.patientId = docAdInfo.json.patientId;
			
			//展示医嘱信息
			$("#pID2S").html(curDoctorAdvice.patientId);
			$("#dAdPName").html(curDoctorAdvice.patientId);
			$("#dAdContent").html(curDoctorAdvice.content);
			$("#dAdWay").html(curDoctorAdvice.way);
			$("#dAdDose").html(curDoctorAdvice.dose);
			$("#dAdFrequency").html(curDoctorAdvice.frequency);
			$("#dAdType").html(curDoctorAdvice.type);
			$("#dAdExecTime").html(curDoctorAdvice.startexecTime);
			$("#dAdDName").html(curDoctorAdvice.doctorName);
			
			$("#doctorAdviceDetailD").show();
			executePage.showExecRecord();
		}else{
			alert("找不到扫描输液贴所属的医嘱");
		}
	})
	.fail(function(){
		alert("医嘱查找失败");
	});
};

//展示医嘱的相关记录
executePage.showExecRecord = function(){
	//alert(curDoctorAdvice.id);
	WL.Logger.debug("executePage :: showExecRecord");
	query = {adviceId:curDoctorAdvice.id};
	queryOptions = { exact: true };
	recordCollection.find(query,queryOptions)
	.then(function(res){
		//alert(res.length);
		var execRecGrid = "";
		execRecGrid += "<div id='ergTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>项目</div></div>";
		execRecGrid += "<div id='ergTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>执行人</div></div>";
		execRecGrid += "<div id='ergTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>执行时间</div></div>";
		//判断是否已经核药
		var btn = "<input type='button' value='执行' onclick='executePage.hasExecuted()' data-theme='g'/>";
		var text = "<span style='font-size:1.5em'>已执行</span>";
		executePage.execRecCount = res.length;
		if (res.length > 2){
			$("#executeDocAdD").text("");
			$("#executeDocAdD").append(text);
		}else{
			$("#executeDocAdD").text("");
			$("#executeDocAdD").append(btn);
			$("#executeDocAdD").trigger("create");
		}
		
		for (var i = 0;i <res.length;i++){
			execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.item+"</div></div>";
			execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.executor+"</div></div>";
			execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.time+"</div></div>";	
		}
		//alert(executePage.execRecCount);
		$("#execRecG").text("");
		$("#execRecG").append(execRecGrid);
		$("#doctorAdviceDetailD").trigger("create");
		
	})
	.fail(function(){
		alert("查找执行记录出错");
	});
};

//相应失去焦点事件
executePage.lostFocus = function(){
	executePage.isMatch == "false";
	var scanType = $(scanTypeSel).val();
	$("#matchResult").val("未匹配");
	if (scanType == "1"){
		executePage.getPatientInfoById($("#eSearchIDTxt").val());
		return;
	}
	if (scanType == "2"){
		executePage.getDocAdById($("#eSearchIDTxt").val());
		return;
	}
	alert("请选择扫描类型!");
	//executePage.getPatientInfoById($("#eSearchIDTxt").val());//手机平板版
};

//根据医嘱所属病人的ID号找到病人信息
executePage.getPatientInfoById = function(pId){
	WL.Logger.debug("executePage :: getPatientInfoById ::" + pId);
	var query = {id: pId};
	var queryOptions = { exact: true };
	patientCollection.find(query,queryOptions)
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
			
			$("#pBedNoS").html(curPatientInfo.bedNumber + "号");
			$("#pNameS").html(curPatientInfo.name);
			$("#pAgeS").html(curPatientInfo.age);
			$("#pSexS").html(curPatientInfo.sex);
			$("#pIDS").html(curPatientInfo.id);
		}else{
			alert("找不到病人信息");
			$("#bedIDS").html("");
			$("#pNameS").html("");
			$("#pAgeS").html("");
			$("#pSexS").html("");
			$("#pIDS").html("");
		}
	});
};