
specialNursePage = {};
var specialNurseItem = [];
var specialNurseItemCount = 0;

specialNursePage.init = function(){
	WL.Logger.debug("SpecialNursePage :: init");
	pagesHistory.push("page/SpecialNurse.html");
	$("#snSearchIDTxt").blur(specialNursePage.lostFocus);
	$("#hTitle").text("护理");
	var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,specialNurseD";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#base-info-grid,#specialNurseD").hide();
	$("#sc").trigger("create");
};

specialNursePage.loadBaseItem = function(){
	var query = {typeContent: '专科护理'};
	var queryOptions = { exact: true};
	nurseCollection.find(query,queryOptions)
	.then(function (arrayResult){
		var specialNurseList = "";
		specialNurseItem = arrayResult;
		specialNurseItemCount = arrayResult.length;
		for (var i = 0;i < arrayResult.length;i++)
			specialNurseList += "<input type='checkbox' name='specialnurse' id='special" + i +"' value='0' onclick='specialNursePage.specialItemClick(\"special" + i + "\")'/>" +
							 "<label for='special" + i + "' data-theme='c'>" + arrayResult[i].json.itemContent +"</label>";
		$("#specialNurseCG").text("");
		$("#specialNurseCG").append(specialNurseList);
		$("#specialNurseCG").trigger("create");
	})
	.fail(function (errorObject){
	});
};

//扫描病人腕带获取ID号
specialNursePage.scanStrap = function(){
	WL.Logger.debug("specialNursePage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	specialNursePage.getPatientBaseInfo(result);
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
specialNursePage.specialItemClick = function(id){
	if ($("#"+id).val() == '1')
		$("#"+id).val('0');
	else
		$("#"+id).val('1');
	WL.Logger.debug("specialNursePage :: specialItemClick ::" + $("#"+id).val());
};

//相应确定事件
specialNursePage.confirm = function(){
	WL.Logger.debug("BaseNursePage :: confirm");
	var time="";
	var date = new Date();
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDate())) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var nurseRecordList = "";
	specialNursePage.travelSpecialNurseItem(0,time,nurseRecordList);
};

//生成护理记录列表
specialNursePage.travelSpecialNurseItem = function(bINum,time,nurseRecordList){
	if (bINum >= specialNurseItemCount){
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
	if ($("#special"+bINum).val() == '1'){
		var query = {itemContent: specialNurseItem[bINum].json.itemContent};
		var options = {exact: true};
		nurseItemCollection.find(query,options)
		.then(function(res){
			var nurseRecord = "";
			nurseRecord = "{\"patientId\":\"" + curPatientInfo.id +"\",\"nurseName\":\"" + curUserInfo.chineseName + "\",\"date\":\"" + time + "\",\"item\":{\"itemContent\":\"" + specialNurseItem[bINum].json.itemContent + "\",\"itemNumber\":\"" + res[0].json.itemNumber + "\"}}";
			alert(nurseRecord);
			if (nurseRecordList == "")
				nurseRecordList += "[" + nurseRecord;
			else
				nurseRecordList += "," + nurseRecord;
			specialNursePage.travelSpecialNurseItem(bINum+1,time,nurseRecordList);
		});
	}else{
		specialNursePage.travelSpecialNurseItem(bINum+1,time,nurseRecordList);
	}
};

//相应失去焦点事件
specialNursePage.lostFocus = function(){
	specialNursePage.getPatientBaseInfo($("#snSearchIDTxt").val());
};

//获取病人信息
specialNursePage.getPatientBaseInfo = function(pId){
	WL.Logger.debug("specialNursePage :: getPatientBaseInfo :: " +  pId);
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
			
			$("#base-info-grid,#specialNurseD").show();
			specialNursePage.loadBaseItem();
			
			$("#bedIDS").html(curPatientInfo.bedNumber + "号");
			$("#pNameS").html(curPatientInfo.name);
			$("#pAgeS").html(curPatientInfo.age);
			$("#pSexS").html(curPatientInfo.sex);
			$("#pIDS").html(curPatientInfo.id);
		}else{
			alert("找不到病人信息");
		}
	});
};