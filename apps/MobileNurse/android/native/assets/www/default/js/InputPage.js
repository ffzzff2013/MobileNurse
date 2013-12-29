
/* JavaScript content from js/InputPage.js in folder common */
inputPage = {};

inputPage.init = function(){
	WL.Logger.debug("InputPage :: init");
	pagesHistory.push("page/InputPage.html");
	$("#hTitle").text("体征输入");
	$("#wrap").trigger("create");
};

inputPage.inputInfo = function(){
	WL.Logger.debug("InputPage :: inputInfo" + patientID);
	var queryP = {id: $("#ipSearchIDTxt").val()};
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
			
			$("#wrap").remove();
			$("#pageContent").load(ROOTPATH + "page/InputDetailPage.html", function(){
				inputDetailPage.init();
			});
		}else{
			alert("找不到病人信息");
		}
	});
};

//扫描病人腕带获取ID号
inputPage.scanStrap = function(){
	WL.Logger.debug("InputPage :: scanStrap");
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
            	$("#ipSearchIDTxt").val(result);
            	//alert("扫描出错");
            },
            /*function(error){
            	//$("#ipSearchIDTxt").val(result+"HIHI");
            	$("#ipSearchIDTxt").val(error);
            	//alert("扫描出错");
            },*/
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};