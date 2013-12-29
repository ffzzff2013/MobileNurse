
/* JavaScript content from js/InPage.js in folder common */

inPage = {};

inPage.init = function(){
	WL.Logger.debug("InPage :: init");
	pagesHistory.push("page/InPage.html");
	$("#base-info-grid,#iRCol,#iCCol").hide();
	$("#ipSearchIDTxt").blur(inPage.lostFocus);
	$("#hTitle").text("出入管理");
	var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,iCCol,iRCol";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#wrap").trigger("create");
};

//扫描病人腕带获取ID号
inPage.scanStrap = function(){
	WL.Logger.debug("inPage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	inPage.getPatientBaseInfo(result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

//相应失去焦点事件
inPage.lostFocus = function(){
	inPage.getPatientBaseInfo($("#ipSearchIDTxt").val());
};

inPage.getPatientBaseInfo = function(pId){
	//alert("hihi");
	WL.Logger.debug("inPage :: getPatientBaseInfo :: " +  pId);
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
			
			$("#base-info-grid,#iRCol,#iCCol").show();
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
		inPage.getPatientInRecord(pId);
	});
};

//获取病人回室记录
inPage.getPatientInRecord = function(pId){
	WL.Logger.debug("inPage :: getPatientInRecord :: " +  pId);
	var queryP = {patientId: pId,type: "回室扫描"};
	var queryOptions = {exact: true};
	discrepancyCollection.find(queryP,queryOptions)
	.then(function(res){
		var inRecList = "";
		inRecList += "<div id='oirTitle1' class='ui-block-a'><div class='ui-bar ui-bar-d'>记录人</div></div>";
		inRecList += "<div id='oirTitle2' class='ui-block-b'><div class='ui-bar ui-bar-d'>回室日期</div></div>";
		inRecList += "<div id='oirTitle3' class='ui-block-c'><div class='ui-bar ui-bar-d'>外出原因</div></div>";
		for (var i = 0;i < res.length;i++){
			inRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.nurseName+"</div></div>";
			inRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.date+"</div></div>";
			inRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.outStyle+"</div></div>";
		}
		$("#outInRecD").text("");
		$("#outInRecD").append(inRecList);
	})
	.fail(function(){
		alert("获取病人出入管理记录失败");
	});
};

//保存病人回室记录
inPage.savePatientInRecord = function(){
	WL.Logger.debug("inPage :: savePatientOutRecord");
	//busyIndicator.show();
	var outStyle="";
	var otherReason="";
	var time="";
	var date = new Date();
	
	//curUserInfo.userId="zs001";
	//curUserInfo.chineseName="测试一";
	
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var inRecordData = {patientId: curPatientInfo.id,nurseId: curUserInfo.userId,nurseName: curUserInfo.chineseName,
			date: time,type: "回室扫描",outStyle: outStyle,describe: otherReason};
	var options = {};
	
	var discrepancyList = "";
	discrepancyList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"nurseId\":\"" + curUserInfo.userId + 
	"\",\"nurseName\":\"" + curUserInfo.chineseName + "\",\"date\":\""+ time + "\",\"type\":\"回室扫描\",\"outStyle\":\"" +
	outStyle +"\",\"describe\":\"" + otherReason + "\"}]";
	
	/*discrepancyCollection.add(inRecordData,options)
	.then(function(){
		var inRecList = "";
		inRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+curUserInfo.chineseName+"</div></div>";
		inRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+time+"</div></div>";
		inRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-e' style='text-align:center;font-size:0.8em;height:2em'>"+outStyle+"</div></div>";
		$("#inRecD").append(inRecList);
	});*/
	
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
				discrepancyCollection.add(inRecordData,options)
				.then(function(){
					var inRecList = "";
					inRecList += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					inRecList += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";
					inRecList += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+outStyle+"</div></div>";
					$("#outInRecD").append(inRecList);
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
