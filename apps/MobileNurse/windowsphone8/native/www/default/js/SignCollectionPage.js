
/* JavaScript content from js/SignCollectionPage.js in folder common */

signCollectionPage = {};

signCollectionPage.init = function(){
	WL.Logger.debug("SignCollectionPage :: init");
	pagesHistory.push("page/SignCollectionPage.html");
	var dispatchObj = "signCol,outInCol,situationCol";
	util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	$("#surgeryTimeTxt").mobiscroll().date({
		theme: 'jqm',
		display: 'bottom',
		mode: 'scroller',
		dateOrder: 'mmD ddyy',
		onClose: function(val, inst) {
		}
    });
	$("#sc").trigger("create");
};

//保存体征采集信息
signCollectionPage.saveSignCollection = function(){
	WL.Logger.debug("SignCollectionPage :: saveSignCollection");
	var time = "";
	var date = new Date();
	time = date.getFullYear() + "-" + (formateDate(date.getMonth()+1)) + "-" + (formateDate(date.getDay()+1)) + " " + formateDate(date.getHours()) + ":" + formateDate(date.getMinutes()) + ":" + formateDate(date.getSeconds());
	var consciousness = "";
	switch ($("#consciousnessSel").val()){
	case "1":
		consciousness = "清醒";
		break;
	case "2":
		consciousness = "不清醒";
		break;
	default:
		break;
	}
	var eMRItemList = "";
	eMRItemList = "[{\"content\":\"T℃\",\"number\":\"101\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#tT").val() + "\"},";
	eMRItemList += "{\"content\":\"R 节律\",\"number\":\"107\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#rT").val() + "\"},";
	eMRItemList += "{\"content\":\"SP02 %\",\"number\":\"11\",\"unit\":\"\",\"parentNum\":\"0\",\"vaule\":\"" + $("#sPO2T").val() + "\"},";
	eMRItemList += "{\"content\":\"意识GCS\",\"number\":\"12\",\"unit\":\"\",\"parentNum\":\"0\",\"vaule\":\"" + consciousness + "\"},";
	eMRItemList += "{\"content\":\"P次/分\",\"number\":\"102\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#pHRHeightT").val() + "\"},";
	eMRItemList += "{\"content\":\"HR次/分\",\"number\":\"103\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#pHRLowT").val() + "\"},";
	eMRItemList += "{\"content\":\"SBp mmHg\",\"number\":\"105\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#bPHeightT").val() + "\"},";
	eMRItemList += "{\"content\":\"DBp mmHg\",\"number\":\"106\",\"unit\":\"\",\"parentNum\":\"10\",\"vaule\":\"" + $("#bPLowT").val() + "\"}]";
	alert(eMRItemList);
	var eMRecordList = "[{\"patientId\":\"" + curPatientInfo.id + "\",\"date\":\"" + time + "\",\"userName\":\"" + 
	curUserInfo.chineseName + "\",\"userId\":\"" + curUserInfo.userId + "\",\"itemList\":" + eMRItemList + "}]";
	alert(eMRecordList);
	$.ajax({
		url:SERVERADDRESS + "updateToUser",
		type:"POST",
		data:{session:curUserInfo.session,discrepancyList:"[]",EMRecordList:eMRecordList
			,nurseRecordList:"[]",patroList:"[]",recordList:"[]"},
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
};