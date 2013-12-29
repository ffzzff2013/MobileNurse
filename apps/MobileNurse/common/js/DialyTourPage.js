dialyTourPage = {};

dialyTourPage.init = function(){
	WL.Logger.debug("DialyTourPage :: init");
	pagesHistory.push("page/DialyTourPage.html");
	$("#hTitle").text("巡视");
	var dispatchObj = "tCCol:LEFTFIXED,tRCol:RIGTHFIXED";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid").show();
	$("#wrap").trigger("create");
	dialyTourPage.getPatientDialyTourRecord(curPatientInfo.id);
};

//获取病人日常巡视记录
dialyTourPage.getPatientDialyTourRecord = function(pId){
	WL.Logger.debug("dialyTourPage :: getPatientDialyTourRecord :: " +  pId);
	var queryP = {patientId: pId,type: "日常巡视"};
	var queryOptions = {exact: true};
	patrolCollection.find(queryP,queryOptions)
	.then(function(res){
		var dialyTourList = "";
		dialyTourList += "<div id='trdTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>记录人</div></div>";
		dialyTourList += "<div id='trdTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>巡视时间</div></div>";
		dialyTourList += "<div id='trdTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>情况</div></div>";
		for (var i = 0;i < res.length;i++){
			dialyTourList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.userName+"</div></div>";
			dialyTourList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			dialyTourList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.situation+"</div></div>";
			
		}
		$("#tourRecD").text("");
		$("#tourRecD").append(dialyTourList);
	})
	.fail(function(){
		alert("获取病人日常巡视记录失败");
	});
};

//保存病人日常巡视记录
dialyTourPage.savePatientDialyTourRecord = function(){
	WL.Logger.debug("dialyTourPage :: savePatientDialyTourRecord");
	//busyIndicator.show();
    var situation="";
	var time="";
	var date = new Date();
	switch ($("#tourConditionSel").val()){
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
	
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var dialyTourRecData = {patientId:curPatientInfo.id, patientName:curPatientInfo.name, userName:curUserInfo.chineseName,
			bedNum:curPatientInfo.bedNumber,date:time, situation:situation, type:"日常巡视", adviceId:""};
	var options = {};
	
	var patroList = "";
	patroList = "[{\"bedNum\":\"" + curPatientInfo.bedNumber + "\",\"patientId\":\"" + curPatientInfo.id + "\",\"patientName\":\"" + curPatientInfo.name + 
	"\",\"userId\":\"" + curUserInfo.userId + "\",\"userName\":\"" + curUserInfo.chineseName + "\",\"date\":\""+ time + "\",\"situation\":\"" + situation + 
	"\",\"type\":\"日常巡视\",\"id\":\"" + "" +"\",\"adviceId\":\"" + "" + "\"}]";
	
	/*patrolCollection.add(dialyTourRecData,options)
	.then(function(){
		var dialyTourRecList = "";
		dialyTourRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+curUserInfo.chineseName+"</div></div>";
		dialyTourRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+time+"</div></div>";
		dialyTourRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+situation+"</div></div>";
		$("#tourRecD").append(dialyTourRecList);
	});*/
	alert(patroList);
	
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
				patrolCollection.add(dialyTourRecData,options)
				.then(function(){
					var dialyTourRecList = "";
					dialyTourRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					dialyTourRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";
					dialyTourRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+situation+"</div></div>";
					$("#tourRecD").append(dialyTourRecList);
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