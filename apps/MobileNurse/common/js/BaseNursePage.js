
baseNursePage = {};
var baseNurseItemCount = 0;
var baseNurseItem = [];

baseNursePage.init = function(){
	WL.Logger.debug("BaseNursePage :: init");
	pagesHistory.push("page/BaseNursePage.html");
	$("#bnSearchIDTxt").blur(baseNursePage.lostFocus);
	$("#hTitle").text("护理");
	var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,baseNurseD";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid,#baseNurseD").hide();
	$("#sc").trigger("create");
};

baseNursePage.loadBaseItem = function(){
	var query = {typeContent: '基础护理'};
	var queryOptions = { exact: true};
	nurseCollection.find(query,queryOptions)
	.then(function (arrayResult){
		var baseNurseList = "";
		baseNurseItem = arrayResult;
		baseNurseItemCount = arrayResult.length;
		for (var i = 0;i < arrayResult.length;i++)
			baseNurseList += "<input type='checkbox' name='basenurse' id='base" + i +"' value='0' onclick='baseNursePage.baseItemClick(\"base" + i + "\")'/>" +
							 "<label for='base" + i + "' data-theme='c'>" + arrayResult[i].json.itemContent +"</label>";
		$("#baseNurseCG").text("");
		$("#baseNurseCG").append(baseNurseList);
		$("#baseNurseCG").trigger("create");
	})
	.fail(function (errorObject){
	});
};

//扫描病人腕带获取ID号
baseNursePage.scanStrap = function(){
	WL.Logger.debug("baseNursePage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	baseNursePage.getPatientBaseInfo(result);
            },
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

//标志选中护理项目
baseNursePage.baseItemClick = function(id){
	if ($("#"+id).val() == '1')
		$("#"+id).val('0');
	else
		$("#"+id).val('1');
	WL.Logger.debug("BaseNursePage :: baseItemClick ::" + $("#"+id).val());
};

//相应确定事件
baseNursePage.confirm = function(){
	WL.Logger.debug("BaseNursePage :: confirm");
	var time="";
	var date = new Date();
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var nurseRecordList = "";
	WL.Logger.debug(time);
	baseNursePage.travelBaseNurseItem(0,time,nurseRecordList);
};

//生成护理记录列表
baseNursePage.travelBaseNurseItem = function(bINum,time,nurseRecordList){
	if (bINum >= baseNurseItemCount){
		nurseRecordList += "]";
		alert(nurseRecordList);
		$.ajax({
			url:SERVERADDRESS + "updateToUser",
			type:"POST",
			data:{session:curUserInfo.session,discrepancyList:"[]",EMRecordList:"[]"
				,nurseRecordList:nurseRecordList,patroList:"[]",recordList:"[]"},
			timeout:5000,
			dataType:"json",
			success:function(data){
				if (data["resultCode"]=="0000"){
					alert("上传成功");
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
		return;
	}
	if ($("#base"+bINum).val() == '1'){
		var query = {itemContent: baseNurseItem[bINum].json.itemContent};
		var options = {exact: true};
		nurseItemCollection.find(query,options)
		.then(function(res){
			var nurseRecord = "";
			nurseRecord = "{\"patientId\":\"" + curPatientInfo.id +"\",\"nurseName\":\"" + curUserInfo.chineseName + "\",\"date\":\"" + time + "\",\"item\":{\"itemContent\":\"" + baseNurseItem[bINum].json.itemContent + "\",\"itemNumber\":\"" + res[0].json.itemNumber + "\"}}";
			alert(nurseRecord);
			if (nurseRecordList == "")
				nurseRecordList += "[" + nurseRecord;
			else
				nurseRecordList += "," + nurseRecord;
			baseNursePage.travelBaseNurseItem(bINum+1,time,nurseRecordList);
		});
	}else{
		baseNursePage.travelBaseNurseItem(bINum+1,time,nurseRecordList);
	}
};

//相应失去焦点事件
baseNursePage.lostFocus = function(){
	baseNursePage.getPatientBaseInfo($("#bnSearchIDTxt").val());
};

//获取病人信息
baseNursePage.getPatientBaseInfo = function(pId){
	//alert("hihi");
	WL.Logger.debug("BaseNursePage :: getPatientBaseInfo :: " +  pId);
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
			
			$("#base-info-grid,#baseNurseD").show();
			
			$("#bedIDS").html(curPatientInfo.bedNumber + "号");
			$("#pNameS").html(curPatientInfo.name);
			$("#pAgeS").html(curPatientInfo.age);
			$("#pSexS").html(curPatientInfo.sex);
			$("#pIDS").html(curPatientInfo.id);
			baseNursePage.loadBaseItem();
		}else{
			alert("找不到病人信息");
		}
	});
};