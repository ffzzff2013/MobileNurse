
/* JavaScript content from js/LiquidTourPage.js in folder common */

liquidTourPage = {};

liquidTourPage.init = function(){
	WL.Logger.debug("LiquidTourPage :: init");
	pagesHistory.push("page/LiquidTourPage.html");
	$("#hTitle").text("巡视");
	var dispatchObj = "scanLiquidBtn:LEFTFIXED,dAdCol,tRCol";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid").show();
	$("#dAdCol,#tRCol").hide();
	$("#ltSearchIDTxt").blur(liquidTourPage.lostFocus);
	$("#wrap").trigger("create");
	//liquidTourPage.getPatientLiquidTourRecord("369072","3690721");
};

//扫描病人腕带获取ID号
liquidTourPage.scanStrap = function(){
	WL.Logger.debug("liquidTourPage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	liquidTourPage.getPatientLiquidTourRecord(curPatientInfo.id,result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

//获取病人输液巡视记录
liquidTourPage.getPatientLiquidTourRecord = function(pId,adviceId){
	WL.Logger.debug("liquidTourPage :: getPatientLiquidTourRecord :: " +  adviceId);
	var queryP = {patientId: pId,type: "输液巡视",adviceId:adviceId};
	var queryOptions = {exact: true};
	patrolCollection.find(queryP,queryOptions)
	.then(function(res){
		if (res <= 0){
			alert("没找到相对应医嘱信息");
			return;
		}
		var liquidTourList = "";
		liquidTourList += "<div id='trdTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>记录人</div></div>";
		liquidTourList += "<div id='trdTitle1' class='ui-block-b'><div class='ui-bar ui-bar-d'>巡视时间</div></div>";
		liquidTourList += "<div id='trdTitle1' class='ui-block-c'><div class='ui-bar ui-bar-d'>情况</div></div>";
		for (var i = 0;i < res.length;i++){
			liquidTourList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.userName+"</div></div>";
			liquidTourList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			liquidTourList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.situation+"</div></div>";
			
		}
		$("#tourRecD").text("");
		$("#tourRecD").append(liquidTourList);
	})
	.fail(function(){
		alert("获取病人输液巡视记录失败");
	});
};

//保存病人输液巡视记录
liquidTourPage.savePatientLiquidTourRecord = function(){
	WL.Logger.debug("liquidTourPage :: savePatientLiquidTourRecord");
	//busyIndicator.show();
    var situation="";
	var time="";
	var date = new Date();
	switch ($("#liquidConditionSel").val()){
	case "1":
		situation="正常";
		break;
	case "2":
		situation="不正常";
		break;
	default:
		break;
	};
	
	//curUserInfo.userId="zs001";
	//curUserInfo.chineseName="测试一";
	//curDoctorAdvice.id = "3690721"
	
		time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var liquidTourRecData = {patientId:curPatientInfo.id, patientName:curPatientInfo.name, userName:curUserInfo.chineseName,
			bedNum:curPatientInfo.bedNumber,date:time, situation:situation, type:"输液巡视", adviceId:curDoctorAdvice.id};
	var options = {};
	
	var patroList = "";
	patroList = "[{\"bedNum\":\"" + curPatientInfo.bedNumber + "\",\"patientId\":\"" + curPatientInfo.id + "\",\"patientName\":\"" + curPatientInfo.name + 
	"\",\"userId\":\"" + curUserInfo.userId + "\",\"userName\":\"" + curUserInfo.chineseName + "\",\"date\":\""+ time + "\",\"situation\":\"" + situation + 
	"\",\"type\":\"输液巡视\",\"id\":\"" + "" +"\",\"adviceId\":\"" + curDoctorAdvice.id + "\"}]";
	
	/*patrolCollection.add(liquidTourRecData,options)
	.then(function(){
		var liquidTourRecList = "";
		liquidTourRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+curUserInfo.chineseName+"</div></div>";
		liquidTourRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+time+"</div></div>";
		liquidTourRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+situation+"</div></div>";
		$("#tourRecD").append(liquidTourRecList);
	});*/
	
	$.ajax({
		url:SERVERADDRESS + "updateToUser",
		type:"POST",
		data:{session:curUserInfo.session,discrepancyList:"[]",EMRecordList:"[]"
			,nurseRecordList:"[]",patroList:patroList,recordList:"[]"},
		timeout:5000,
		dataType:"json",
		success:function(data){
			if (data["resultCode"]=="0000"){
				alert("上传成功");
				patrolCollection.add(liquidTourRecData,options)
				.then(function(){
					var liquidTourRecList = "";
					liquidTourRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					liquidTourRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";
					liquidTourRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+situation+"</div></div>";
					$("#tourRecD").append(liquidTourRecList);
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

//相应失去焦点事件
liquidTourPage.lostFocus = function(){
	WL.Logger.debug("checkDrugPage :: lostFocus");
	liquidTourPage.getDoctorAdviceInfo($("#ltSearchIDTxt").val());
};

liquidTourPage.getDoctorAdviceInfo = function(adviceId){
	WL.Logger.debug("liquidTourPage :: getDoctorAdviceInfo ::" + adviceId);
	query = {adviceId:adviceId};
	queryOptions = { exact: true };
	doctorsAdviceCollection.find(query,queryOptions)
	.then(function(res){
		if (res <= 0){
			alert("没找到相关医嘱");
			return;
		}
		$("#dAdCol,#tRCol").show();
		curDoctorAdvice.content = res[0].json.content;
		curDoctorAdvice.way = res[0].json.way;
		curDoctorAdvice.dose = res[0].json.dose;
		curDoctorAdvice.frequency = res[0].json.frequency;
		curDoctorAdvice.startexecTime = res[0].json.startexecTime;
		curDoctorAdvice.doctorName = res[0].json.doctorName;
		curDoctorAdvice.type = res[0].json.type;
		curDoctorAdvice.id = res[0].json.adviceId;
		curDoctorAdvice.patientId = res[0].json.patientId;
		if (curDoctorAdvice.patientId != curPatientInfo.id){
			alert("输液贴医嘱号与病人Id号不对应");
			return;
		}
		$("#dAdPName").html(curPatientInfo.name);
		$("#dAdContent").html(curDoctorAdvice.content);
		$("#dAdWay").html(curDoctorAdvice.way);
		$("#dAdDose").html(curDoctorAdvice.dose);
		$("#dAdFrequency").html(curDoctorAdvice.frequency);
		$("#dAdType").html(curDoctorAdvice.type);
		$("#dAdExecTime").html(curDoctorAdvice.startexecTime);
		$("#dAdDName").html(curDoctorAdvice.doctorName);
		liquidTourPage.getPatientLiquidTourRecord(curPatientInfo.id,adviceId);
	})
	.fail(function(){
		alert("医嘱查找失败");
	});
};	