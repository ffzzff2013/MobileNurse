
/* JavaScript content from js/BaseInfoPage.js in folder common */

baseInfoPage = {};

baseInfoPage.init = function(){
	WL.Logger.debug("BaseInfoPage :: init ::");
	pagesHistory.push("page/BaseInfoPage.html");
	$("#bedIDS").html(curPatientInfo.bedNumber + "号");
	$("#pNameS").html(curPatientInfo.name);
	$("#pAgeS").html(curPatientInfo.age);
	$("#pSexS").html(curPatientInfo.sex);
	$("#pIDS").html(curPatientInfo.id);
	
	$("#hospNum").html(curPatientInfo.hospNum);
	$("#deparName").html(curPatientInfo.deparName);
	$("#nurseLevel").html(curPatientInfo.nurseLevel);
	$("#state").html(curPatientInfo.state);
	$("#diagnose").html(curPatientInfo.diagnose);
	$("#allergyMedic").html(curPatientInfo.allergyMedic);
	$("#temperature").html(curPatientInfo.temperature);
	$("#admissionDate").html(curPatientInfo.admissionDate);
	$("#surgeryDate").html(curPatientInfo.surgeryDate);
	if (curPatientInfo.doctorName != null && curPatientInfo.doctorPhone != null)
		$("#docInfo").html(curPatientInfo.doctorName + "  " + curPatientInfo.doctorPhone);
	if (curPatientInfo.familyContact != null && curPatientInfo.familyPhone != null)
		$("#familyInfo").html(curPatientInfo.familyContact + "  " + curPatientInfo.familyPhone);
	$("#profession").html(curPatientInfo.profession);
	$("#costType").html(curPatientInfo.costType);
	$("#prepayment").html(curPatientInfo.prepayment);
	$("#payCost").html(curPatientInfo.payCost);
	
	$("#sc").trigger("create");
};