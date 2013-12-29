
/* JavaScript content from js/MobileNurse.js in folder common */
/**
* @license
* Licensed Materials - Property of IBM
* 5725-G92 (C) Copyright IBM Corp. 2006, 2013. All Rights Reserved.
* US Government Users Restricted Rights - Use, duplication or
* disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
*/

var ROOTPATH = ""; 
var SERVERADDRESS = "http://192.168.0.108:89/Service/";

mobileNursePage = {};

var pagesHistory = [];
var currentPage = {};
var loginCollection; //获取记录密码collection
var nurseCollection; //获取护理项目collection
var bedListCollection;
var patientCollection;
var doctorsAdviceCollection;
var recordCollection;
var discrepancyCollection;
var nurseRecordCollection;
var patrolCollection;
var nurseTypeCollection;
var nurseItemCollection;

var co;
var curClientWidth;  //当前屏幕宽度
var screenWidth;
var screenHeight;
var bedNum;          //病床号
var patientName;     //病人姓名
var patientAge;      //病人年龄
var patientID;       //病人ID号
var curUserInfo;
var curPatientInfo;
var curDoctorAdvice;
var busyIndicator;


function wlCommonInit(){
	/*WL.Logger.debug("MobileNurse :: init");
	$("nav#menu").mmenu({
		onClick:{
			close:true					}
	});*/
	$("#header").hide();
	$.mobile.buttonMarkup.hoverDelay = "false";
	document.addEventListener("backbutton", onBackKeyDown, false);
	$(window).bind("orientationchange", orientationChange);
	WL.Logger.debug("wlCommonInit");
	curUserInfo = new User();
	curPatientInfo = new Patient();
	curDoctorAdvice = new DoctorAdvice();
	busyIndicator = new WL.BusyIndicator('content',{text:"Loading..."});
	util.caculateDeviceHW();
	/*if (document.body.clientHeight > document.body.clientWidth){
		screenHeight = document.body.clientHeight;
		screenWidth = document.body.clientWidth;
	}else{
		screenHeight = document.body.clientWidth;
		screenWidth = document.body.clientHeight;
	}*/
	$("#pageContent").load(ROOTPATH + "page/LoginPage.html", function(){
		loginPage.init();
		initCollections();
	});
}

initCollections = function(){
	WL.Logger.debug("MobileNurseJS::initCollections");
	co = new CollectionObject();
	
	WL.JSONStore.init(co.getCollection("LoginCollection"))
	.then(function(){
		loginCollection = WL.JSONStore.get("LoginCollection");
	})
	.fail(function(){
		alert("loginCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("NurseCollection"))
	.then(function(){
		nurseCollection = WL.JSONStore.get("NurseCollection");
	})
	.fail(function(){
		alert("NurseCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("NurseTypeCollection"))
	.then(function(){
		nurseTypeCollection = WL.JSONStore.get("NurseTypeCollection");
	})
	.fail(function(){
		alert("NurseTypeCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("NurseItemCollection"))
	.then(function(){
		nurseItemCollection = WL.JSONStore.get("NurseItemCollection");
	})
	.fail(function(){
		alert("NurseItemCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("BedListCollection"))
	.then(function(){
		bedListCollection = WL.JSONStore.get("BedListCollection");
	})
	.fail(function(){
		alert("BedListCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("PatientCollection"))
	.then(function(){
		patientCollection = WL.JSONStore.get("PatientCollection");
	})
	.fail(function(){
		alert("PatientCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("DoctorsAdviceCollection"))
	.then(function(){
		doctorsAdviceCollection = WL.JSONStore.get("DoctorsAdviceCollection");
	})
	.fail(function(){
		alert("DoctorsAdviceCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("RecordCollection"))
	.then(function(){
		recordCollection = WL.JSONStore.get("RecordCollection");
	})
	.fail(function(){
		alert("RecordCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("DiscrepancyCollection"))
	.then(function(){
		discrepancyCollection = WL.JSONStore.get("DiscrepancyCollection");
	})
	.fail(function(){
		alert("DiscrepancyCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("NurseRecordCollection"))
	.then(function(){
		nurseRecordCollection = WL.JSONStore.get("NurseRecordCollection");
	})
	.fail(function(){
		alert("NurseRecordCollection初始化失败");
	});
	
	WL.JSONStore.init(co.getCollection("PatrolCollection"))
	.then(function(){
		patrolCollection = WL.JSONStore.get("PatrolCollection");
	})
	.fail(function(){
		alert("PatrolCollection初始化失败");
	});
};

menuClick = function(){
	WL.Logger.debug("MobileNurse :: menuClick");
};

refreshClick = function(){
	$("#wrap").remove();
	$("#pageContent").load(ROOTPATH + "page/MainMenuPage.html", function(){
		mainMenuPage.init("true");
	});
};

mobileNursePage.returnClick = function(){
	WL.Logger.debug("MobileNursePage :: returnClick");
	var ph = pagesHistory.pop();
	
	//返回床位列表
	if (ph == "page/BaseInfoPage.html" || ph == "page/DocInstructPage.html"){
		$("#pageContent").load(ROOTPATH + "page/BedListPage.html", function(){
			bedListPage.init();
		});
	}
	//返回体征录入扫描界面
	if (ph == "page/SignCollectionPage.html" || ph == "page/OutInCollectionPage.html"){
		$("#pageContent").load(ROOTPATH + "page/InputPage.html", function(){
			inputPage.init();
		});
	}
	//返回巡视扫描界面
	if (ph == "page/DialyTourPage.html" || ph == "page/LiquidTourPage.html" || ph == "page/TourRecordPage.html"){
		$("#pageContent").load(ROOTPATH + "page/TourScanPage.html", function(){
			tourScanPage.init();
		});
	}
};

onBackKeyDown = function(){
	WL.Logger.debug("MobileNurse :: onBackKeyDown");
	var dialogTitle  = "提示";
	var dialogText = "确定要退出？";
	WL.SimpleDialog.show(dialogTitle, dialogText, [{
		text: '取消',
		handler: function(){}
	},{
		text: '确定',
		handler: function(){navigator.app.exitApp();}
	}]);
};

orientationChange=function(){
	var orientation = window.orientation;
	/*if (orientation == "0")
		curWidth = document.body.clientWidth;
	else*/
	if (orientation == "0" || orientation == "180")
		curClientWidth = screenWidth;
	else
		curClientWidth = screenHeight;
	//alert(curClientWidth);
	//curClientWidth = document.body.clientWidth;
	var ph = pagesHistory.pop();
	WL.Logger.debug(orientation);
	if (ph == "page/BedListPage.html"){
		bedListPage.getBedListContent();
	}
	if (ph == "page/NurseRecordPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/NurseRecordPage.html");
		var dispatchObj = "searchCondition:LEFTFIXED,mmList";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/ExecutePage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/ExecutePage.html");
		var dispatchObj = "searchContent:LEFTFIXED,scanResContent,doctorAdviceDetailD";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/TourRecordPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/TourRecordPage.html");
		var dispatchObj = "searchCondition:LEFTFIXED,mmList";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/OutInRecPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/OutInRecPage.html");
		var dispatchObj = "searchCondition:LEFTFIXED,mmList";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/MatchMedicinePage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/MatchMedicinePage.html");
		var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,docAdList:LEFTFIXED,doctorAdviceDetailD:RIGHTFIXED";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/OutPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/outPage.html");
		var dispatchObj = "searchContent:LEFTFIXED,oCCol,oRCol";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/InPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/InPage.html");
		var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,iCCol,iRCol";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/CheckDrugPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/CheckDrugPage.html");
		var dispatchObj = "inputBtn:LEFTFIXED,base-info-grid:LEFTFIXED,docAdContent:RIGHTFIXED,docAdRecord";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/DialyTourPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/DialyTourPage.html");
		var dispatchObj = "tCCol:RIGTHFIXED,tRCol:LEFTFIXED";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/LiquidTourPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/LiquidTourPage.html");
		var dispatchObj = "scanLiquidBtn:LEFTFIXED,dAdCol,tRCol";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/BaseNursePage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/BaseNursePage.html");
		var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,baseNurseD";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/SpecialNursePage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/SpecialNursePage.html");
		var dispatchObj = "searchContent:LEFTFIXED,base-info-grid:LEFTFIXED,specialNurseD";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/DocInstructPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/DocInstructPage.html");
		var dispatchObj = "doctorAdviceListD:LEFTFIXED,doctorAdviceDetailD:RIGHTFIXED";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	if (ph == "page/SignCollectionPage.html"){
		WL.Logger.debug("MobileNurse :: orientationChange :: page/SignCollectionPage.html");
		var dispatchObj = "signCol,outInCol,situationCol";
		util.dispatchModel("multiColsModelArea","singleColModelArea",dispatchObj);
	}
	pagesHistory.push(ph);
};

scanInput = function(){
	window.plugins.barcodeScanner.scan( 
            BarcodeScanner.Type.QR_CODE, 
            function(result) {
                $("#ipSearchIDTxt").val(""+result);
                alert(result+"hihi");
            }, 
            function(error) {
                alert("扫描失败");
    		}, 
    		{
    		    installTitle: "安装提示",
    		    installMessage:"是否安装开源免费的ZXing二维码扫描器",
    		    yesString:"确定",
    		    noString:"取消"
    		}
	);
};

//格式化日期，将一位数变成两位数
formateDate = function(x){
	if (x < 10)
		return "0" + x;
	else
		return x;
};

//屏幕滚动到顶部
scrollTop = function(){
	$('html, body').animate({scrollTop: 0}, 'slow');
};

//更换header的图标
mobileNursePage.changeTopBarIcon = function(type){
	WL.Logger.debug("MobileNursePage :: changeTopBarIcon");
	$("#topBarRBtn").remove();
	if (type == "refresh"){
		$("#header").append("<a id='topBarRBtn' onclick='refreshClick()' data-icon='topbar-refresh' data-iconpos='notext' data-theme='f' class='ui-btn-right'></a>");
		$("#page").trigger("create");
	}
	if (type == "return"){
		$("#header").append("<a id='topBarRBtn' onclick='mobileNursePage.returnClick()' data-icon='topbar-return' data-iconpos='notext' data-theme='f' class='ui-btn-right'></a>");
		$("#page").trigger("create");
	}
};

memuSelectItem =function (itemNum){
	WL.Logger.debug("MobileNurse :: selectItem" + itemNum);
	$("#menuPanel").panel("close");
	scrollTop();
	mobileNursePage.changeTopBarIcon("refresh");
	switch(itemNum){
	case "1":
		$("#pageContent").load(ROOTPATH + "page/BedListPage.html", function(){
			bedListPage.init();
		});
		break;
	case "2":
		$("#pageContent").load(ROOTPATH + "page/InputPage.html", function(){
			inputPage.init();
		});
		break;
	case "3":
		$("#pageContent").load(ROOTPATH + "page/MatchMedicinePage.html", function(){
			matchMedicinePage.init();
		});
		break;
	case "4":
		$("#pageContent").load(ROOTPATH + "page/CheckDrugPage.html", function(){
			checkDrugPage.init();
		});
		break;
	case "5":
		$("#pageContent").load(ROOTPATH + "page/ExecutePage.html", function(){
			executePage.init();
		});
		break;
	case "6":
		$("#pageContent").load(ROOTPATH + "page/TourScanPage.html", function(){
			tourScanPage.init();
		});
		break;
	case "7":
		$("#pageContent").load(ROOTPATH + "page/NursePage.html", function(){
			nursePage.init();
		});
		break;
	case "8":
		$("#pageContent").load(ROOTPATH + "page/OutInPage.html", function(){
			outInPage.init();
		});
		break;
	case "9":
		$("#pageContent").load(ROOTPATH + "page/WorkCountPage.html", function(){
			workCountPage.init();
		});
		break;
	default:
		break;
	}
};
/* JavaScript content from js/MobileNurse.js in folder windowsphone8 */
/**
 *  @license
 *  Licensed Materials - Property of IBM
 *  5725-G92 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}