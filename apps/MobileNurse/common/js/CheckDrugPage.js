
checkDrugPage = {};
checkDrugPage.execRecCount = 0;    //表示当前执行记录条数，用于判断核药前是否已经配药

checkDrugPage.init = function(){
	WL.Logger.debug("CheckDrugPage :: init");
	pagesHistory.push("page/CheckDrugPage.html");
	$("#hTitle").text("核药");
	var dispatchObj = "inputBtn:LEFTFIXED,base-info-grid:LEFTFIXED,docAdContent:RIGHTFIXED,docAdRecord";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid,#docAdRecord,#docAdContent").hide();
	$("#cdSearchIDTxt").blur(checkDrugPage.lostFocus);
	$("#wrap").trigger("create");
};

checkDrugPage.inputInfo = function(patientID){
	WL.Logger.debug("CheckDrugPage :: inputInfo" + patientID);
	$("#wrap").remove();	
};

//扫描医嘱ID号
checkDrugPage.scanDocAd = function(){
	WL.Logger.debug("checkDrugPage :: scanDocAd");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	checkDrugPage.getDocAdById(result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

//核药正确并记录操作
checkDrugPage.hasCheckedDrug = function(){
	WL.Logger.debug("CheckDrugPage :: hasCheckedDrug");
	if (checkDrugPage.execRecCount == 0){
		alert("还未配药，请等待配药");
		return;
	}
	var date = new Date();
	var time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var matchRecordData = {recordId:"match"+time,item:"核药",time:time,patientId:curPatientInfo.id,adviceId:curDoctorAdvice.id,
			executor:curUserInfo.chineseName,userId:curUserInfo.userId};
	var options = {};
	var recordList = "";
	recordList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"userId\":\"" + curUserInfo.userId + 
	"\",\"executor\":\"" + curUserInfo.chineseName + "\",\"time\":\""+ time + "\",\"adviceId\":\""+ curDoctorAdvice.id + 
	"\",\"item\":\"核药\",\"id\":\"" + "match"+time +"\"}]";
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
					execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+"核药"+"</div></div>";
					execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";		
					$("#execRecG").append(execRecGrid);	
				});
				var text = "<span style='font-size:1.5em'>已核药</span>";
				$("#checkDrugD").text("");
				$("#checkDrugD").append(text);
				$("#checkDrugD").trigger("create");
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

//重新配药并记录操作
checkDrugPage.rematchMedicine = function(){
	WL.Logger.debug("CheckDrugPage :: rematchMedicine");
	if (checkDrugPage.execRecCount == 0){
		alert("还未配药，请等待配药");
		return;
	}
	var date = new Date();
	var time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDay()+1)) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var matchRecordData = {recordId:"match"+time,item:"重配",time:time,patientId:curPatientInfo.id,adviceId:curDoctorAdvice.id,
			executor:curUserInfo.chineseName,userId:curUserInfo.userId};
	var options = {};
	var recordList = "";
	recordList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"userId\":\"" + curUserInfo.userId + 
	"\",\"executor\":\"" + curUserInfo.chineseName + "\",\"time\":\""+ time + "\",\"adviceId\":\""+ curDoctorAdvice.id + 
	"\",\"item\":\"重配\",\"id\":\"" + "match"+time +"\"}]";
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
					execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+"重配"+"</div></div>";
					execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+curUserInfo.chineseName+"</div></div>";
					execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+time+"</div></div>";		
					$("#execRecG").append(execRecGrid);	
				});
				var text = "<span style='font-size:1.5em'>已核药</span>";
				$("#checkDrugD").text("");
				$("#checkDrugD").append(text);
				$("#checkDrugD").trigger("create");
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


//根据医嘱Id找到对应的医嘱信息
checkDrugPage.getDocAdById = function(scanDocAdId){
	WL.Logger.debug("checkDrugPage :: getDocAdById");
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
			//alert(curDoctorAdvice.id);
			
			//展示医嘱信息
			$("#base-info-grid,#docAdRecord,#docAdContent").show();
			$("#dAdPName").html(curPatientInfo.name);
			$("#dAdContent").html(curDoctorAdvice.content);
			$("#dAdWay").html(curDoctorAdvice.way);
			$("#dAdDose").html(curDoctorAdvice.dose);
			$("#dAdFrequency").html(curDoctorAdvice.frequency);
			$("#dAdType").html(curDoctorAdvice.type);
			$("#dAdExecTime").html(curDoctorAdvice.startexecTime);
			$("#dAdDName").html(curDoctorAdvice.doctorName);

			checkDrugPage.showExecRecord();
		}else{
			alert("找不到扫描输液贴所属的医嘱");
		}
	})
	.fail(function(){
		alert("医嘱查找失败");
	});
};

//展示医嘱的相关记录
checkDrugPage.showExecRecord = function(){
	WL.Logger.debug("checkDrugPage :: showExecRecord");
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
		var btn = "<div class='ui-grid-a'>" +
				  "<div class='ui-block-a'><div class='ui-bar'><input type='button' id='correctBtn' data-theme='g' data-inline='false' onclick='checkDrugPage.hasCheckedDrug()' value='正确'/></div></div>" +
				  "<div class='ui-block-b'><div class='ui-bar'><input type='button' id='reMatchBtn' data-theme='g' data-inline='false' onclick='checkDrugPage.rematchMedicine()' value='重配'/></div></div>" +
				  "</div>";
		var text = "<span style='font-size:1.5em'>已核药</span>";
		checkDrugPage.execRecCount = res.length;
		if (res.length > 1){
			$("#checkDrugD").text("");
			$("#checkDrugD").append(text);
		}else{
			$("#checkDrugD").text("");
			$("#checkDrugD").append(btn);
		}
		$("#checkDrugD").trigger("create");
		for (var i = 0;i <res.length;i++){
			execRecGrid += "<div class='ui-block-a'><div class='ui-bar ui-bar-c'>"+res[i].json.item+"</div></div>";
			execRecGrid += "<div class='ui-block-b'><div class='ui-bar ui-bar-c'>"+res[i].json.executor+"</div></div>";
			execRecGrid += "<div class='ui-block-c'><div class='ui-bar ui-bar-c'>"+res[i].json.time+"</div></div>";		
		}
		$("#execRecG").text("");
		$("#execRecG").append(execRecGrid);	
		
		$("#execRecG").trigger("create");
		checkDrugPage.getPatientInfoById(curDoctorAdvice.patientId);
		
	})
	.fail(function(){
		alert("查找执行记录出错");
	});
};

//相应失去焦点事件
checkDrugPage.lostFocus = function(){
	WL.Logger.debug("checkDrugPage :: lostFocus");
	checkDrugPage.getDocAdById($("#cdSearchIDTxt").val());
};

//根据医嘱所属病人的ID号找到病人信息
checkDrugPage.getPatientInfoById = function(pId){
	WL.Logger.debug("checkDrugPage :: getPatientInfoById");
	var query = {id: pId};
	var queryOptions = { exact: true };
	var query2 = {patientId: pId};
	bedListCollection.find(query2,queryOptions)
	.then(function(res){
		if (res.length<=0){
			alert("找不到病人所在病床号");
			return;
		}
		curPatientInfo.bedNumber = res[0].json.bedNumber;
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
		});
	})
	.fail(function (errorObject){
		alert("fail");
	});
};