
/* JavaScript content from js/OutPage.js in folder common */
outPage = {};

outPage.init = function(){
	WL.Logger.debug("OutPage :: init");
	pagesHistory.push("page/OutPage.html");
	$("#hTitle").text("出入管理");
	$("#wrap").trigger("create");
	var dispatchObj = "searchContent:LEFTFIXED,oCCol,oRCol";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#otherTxt").hide();
	$("#base-info-grid,#oCCol,#oRCol").hide();
	$("#opSearchIDTxt").blur(outPage.lostFocus);
	$("#outConditionSel").bind("change",outPage.checkOther);
};

//扫描病人腕带获取ID号
outPage.scanStrap = function(){
	WL.Logger.debug("outPage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	outPage.getPatientBaseInfo(result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

outPage.getPatientBaseInfo = function(pId){
	//alert("hihi");
	WL.Logger.debug("outPage :: getPatientBaseInfo :: " +  pId);
	var queryP = {id: pId};
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
			
			$("#base-info-grid,#oCCol,#oRCol").show();
			$("#bedIDS").html(curPatientInfo.bedNumber + "号");
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
		outPage.getPatientOutRecord(pId);
	});
};

outPage.checkOther = function(){
	if ("3" == $("#outConditionSel").val()){
		$("#otherTxt").show();
	}else{
		$("#otherTxt").hide();
	}
};

//获取病人外出记录
outPage.getPatientOutRecord = function(pId){
	WL.Logger.debug("outPage :: getPatientOutRecord :: " +  pId);
	var queryP = {patientId: pId,type: "外出扫描"};
	var queryOptions = {exact: true};
	discrepancyCollection.find(queryP,queryOptions)
	.then(function(res){
		var outRecList = "";
		outRecList += "<div id='oirTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>记录人</div></div>";
		outRecList += "<div id='oirTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>外出日期</div></div>";
		outRecList += "<div id='oirTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>外出原因</div></div>";
		for (var i = 0;i < res.length;i++){
			outRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.nurseName+"</div></div>";
			outRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			outRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.outStyle+"</div></div>";
			
		}
		$("#outInRecD").text("");
		$("#outInRecD").append(outRecList);
	})
	.fail(function(){
		alert("获取病人出入管理记录失败");
	});
};

//相应失去焦点事件
outPage.lostFocus = function(){
	outPage.getPatientBaseInfo($("#opSearchIDTxt").val());
};

//保存病人外出记录
outPage.savePatientOutRecord = function(){
	WL.Logger.debug("outPage :: savePatientOutRecord");
	busyIndicator.show();
	var outStyle="";
	var otherReason="";
	var time="";
	switch ($("#outConditionSel").val()){
	case "1":
		outStyle="手术";
		break;
	case "2":
		outStyle="检查";
		break;
	case "3":
		outStyle="其他";
		otherReason=$("#otherTxt").val();
		break;
	default:
		break;
	};
	var date = new Date();
	
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var outRecordData = {patientId: curPatientInfo.id,nurseId: curUserInfo.userId,nurseName: curUserInfo.chineseName,
			date: time,type: "外出扫描",outStyle: outStyle,describe: otherReason};
	var options = {};
	
	var discrepancyList = "";
	discrepancyList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"nurseId\":\"" + curUserInfo.userId + 
	"\",\"nurseName\":\"" + curUserInfo.chineseName + "\",\"date\":\""+ time + "\",\"type\":\"外出扫描\",\"outStyle\":\"" +
	outStyle +"\",\"describe\":\"" + otherReason + "\"}]";
	//alert(discrepancyList);
	$.ajax({
		url:SERVERADDRESS + "updateToUser",
		type:"POST",
		data:{session:curUserInfo.session,discrepancyList:discrepancyList,EMRecordList:"[]"
			,nurseRecordList:"[]",patroList:"[]",recordList:"[]"},
		timeout:5000,
		dataType:"json",
		success:function(data){
			if (data["resultCode"]=="0000"){
				alert("上传成功");
				discrepancyCollection.add(outRecordData,options)
				.then(function(){
					var outRecList = "";
					outRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					outRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";
					outRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+outStyle+"</div></div>";
					$("#outInRecD").append(outRecList);
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
