
/* JavaScript content from js/MainMenuPage.js in folder common */
mainMenuPage = {};
var bedList = [];
var docAdList = [];
var recordList = [];
var discrepancyList = [];
var patrolList = [];
var nurseRecordList = [];
var bedData;
var patientData;
var doctorAdviceData;
var recordData;
var discrepancyData;
var patrolData;
var nurseRecData;
var options;
var query;
var queryP;
var queryOptions;
var isRefresh;

mainMenuPage.init = function(flag){
	WL.Logger.debug("MainMenuPage :: init");
	pagesHistory.push("page/MainMenuPage.html");
	$("#page").css("background-image","none");
	isRefresh = flag;
	if (isRefresh != "true")
		mainMenuPage.initMenu();
	$("#header").show();
	//mainMenuPage.getBedList();
	//$("#menu").show();
	//$("#nurseInfoS").text(curUserInfo.chineseName + " " + curUserInfo.userId);
	//$("#pageContent").trigger("create");
	$("#page").trigger("create");
	$("#menuPanel").panel( "option", "display", "reveal" );
	$("#page").bind("swiperight",function(){
		$("#menuPanel").panel("open");
	});
	$("#page").bind("swipeleft",function(){
		scrollTop();
		$("#menuPanel").panel("close");
	});
	$('nav#menu').mmenu({
		onClick:{
			close:false					}
	});
};

//初始化菜单
mainMenuPage.initMenu = function(){
	$("#page").append("<div data-role='panel' id='menuPanel'></div>");
	var menuStr = "<ul data-role='listview' data-theme='a'>"
		+ "<li data-role='list-divider' data-theme='a' style='font-size: 1.1em'>菜单</li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"1\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_bedlist.png'/><br/>床位列表</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"2\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_entrysigns.png'/><br/>体征录入</span></a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"3\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_dispense.png'/><br/>配药</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"4\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_inspect.png'/><br/>核药</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"5\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_implement.png'/><br/>执行</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"6\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_patrol.png'/><br/>巡视</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"7\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_care_record.png'/><br/>护理</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"8\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_accessmana.png'/><br/>出入管理</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"9\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_workstatistic.png'/><br/>工作量统计</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"10\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_memo.png'/><br/>备忘录提醒</a></li>"
		+ "<li><a href='#' onclick='memuSelectItem(\"11\")' style='margin:0px;padding:0px;text-align:center'><img src='images/ic_f_setting.png'/><br/>设置</a></li>";
		+ "</ul>";
	//alert(menuStr);
	$("#menuPanel").append(menuStr);
};

mainMenuPage.getBedList = function(){
	busyIndicator.show();
	$.ajax({
		url:SERVERADDRESS + "getBedInforByUser",
		type:"POST",
		data:{userId:curUserInfo.userId,session:curUserInfo.session},
		timeout:50000,
		dataType:"json",
		success:function(data){
		    //var msgJson = eval(data); dataType为json，就不用转了
			if (data["resultCode"]=="0000"){
				mainMenuPage.getBedListSuccess(data);
			};
			if (data["resultCode"]=="0002"){
				alert(data["msg"]);
			};
		  },
		error:function(){
			busyIndicator.hide();
			alert("超时");
			$("#page").trigger("create");
			$("#menuPanel").panel( "option", "display", "reveal" );
			$("#page").bind("swiperight",function(){
				$("#menuPanel").panel("open");
			});
			$("#page").bind("swipeleft",function(){
				scrollTop();
				$("#menuPanel").panel("close");
			});
		}
	});
};

mainMenuPage.getBedListSuccess = function(data){
	bedList = data["bedList"];
	//删除已存在记录信息
	bedListCollection.removeCollection()
	.then(function(){
		WL.JSONStore.init(co.getCollection("BedListCollection"))
		.then(function(){
			bedListCollection = WL.JSONStore.get("BedListCollection");
			
			patientCollection.removeCollection()
			.then(function(){
				WL.JSONStore.init(co.getCollection("PatientCollection"))
				.then(function(){
					patientCollection = WL.JSONStore.get("PatientCollection");
					
					doctorsAdviceCollection.removeCollection()
					.then(function(){
						WL.JSONStore.init(co.getCollection("DoctorsAdviceCollection"))
						.then(function(){
							doctorsAdviceCollection = WL.JSONStore.get("DoctorsAdviceCollection");
							
							recordCollection.removeCollection()
							.then(function(){
								WL.JSONStore.init(co.getCollection("RecordCollection"))
								.then(function(){
									recordCollection = WL.JSONStore.get("RecordCollection");
									
									discrepancyCollection.removeCollection()
									.then(function(){
										WL.JSONStore.init(co.getCollection("DiscrepancyCollection"))
										.then(function(){
											discrepancyCollection = WL.JSONStore.get("DiscrepancyCollection");
											
											patrolCollection.removeCollection()
											.then(function(){
												WL.JSONStore.init(co.getCollection("PatrolCollection"))
												.then(function(){
													patrolCollection = WL.JSONStore.get("PatrolCollection");
													
													nurseRecordCollection.removeCollection()
													.then(function(){
														WL.JSONStore.init(co.getCollection("NurseRecordCollection"))
														.then(function(){
															nurseRecordCollection = WL.JSONStore.get("NurseRecordCollection");
															mainMenuPage.travelBedList(0);
														})
														.fail(function(){
															alert("nurseRecordCollection初始化失败");
														});
													})
													.fail(function(){
														alert("删除nurseRecordCollection失败");
													});
												})
												.fail(function(){
													alert("patrolCollection初始化失败");
												});
											})
											.fail(function(){
												alert("删除patrolCollection失败");
											});
										})
										.fail(function(){
											alert("discrepancyCollection初始化失败");
										});
									})
									.fail(function(){
										alert("删除discrepancyCollection失败");
									});
								})
								.fail(function(){
									alert("recordCollection初始化失败");
								});
							})
							.fail(function(){
								alert("删除recordCollection失败");
							});
						})
						.fail(function(){
							alert("doctorsAdviceCollection初始化失败");
						});
					})
					.fail(function(){
						alert("删除doctorsAdviceCollection失败");
					});
				})
				.fail(function(){
					alert("PatientCollection初始化失败");
				});
			})
			.fail(function(){
				alert("删除patientCollection失败");
			});
		})
		.fail(function(){
			alert("BedListCollection初始化失败");
		});
		
	})
	.fail(function(){
		alert("删除bedListCollection失败");
	});
};

mainMenuPage.travelBedList = function(number){
	//alert("开始保存");
	if (number >= bedList.length){
		busyIndicator.hide();
		if (isRefresh == "false"){
			$("#page").trigger("create");
			$("#menuPanel").panel( "option", "display", "reveal" );
			$("#page").bind("swiperight",function(){
				$("#menuPanel").panel("open");
			});
			$("#page").bind("swipeleft",function(){
				$("#menuPanel").panel("close");
			});
		}
		$("#hTitle").text("主页");
		$("#nurseInfoS").text(curUserInfo.chineseName + " " + curUserInfo.userId);
		return;
	}
	if (bedList[number]["bedState"] == "空床"){
		bedData = {bedNumber:bedList[number]["bedNumber"],bedState:bedList[number]["bedState"],patientId:'null'};
		options = {};
		bedListCollection.add(bedData,options)
		.then(function (res){
			mainMenuPage.travelBedList(number+1);
		});
	}else{
		var patient = bedList[number]["patient"];
		bedData = {bedNumber:bedList[number]["bedNumber"],bedState:bedList[number]["bedState"],patientId:patient["id"]};
		patientData = {name:patient["name"],sex:patient["sex"],age:patient["age"],id:patient["id"],
				hospNum:patient["hospNum"],deparName:patient["deparName"],nurseLevel:patient["nurseLevel"],
				state:patient["state"],diagnose:patient["diagnose"],allergyMedic:patient["allergyMedic"],
				temperature:patient["temperature"],admissionDate:patient["admissionDate"],surgeryDate:patient["surgeryDate"],
				doctorName:patient["doctorName"],doctorPhone:patient["doctorPhone"],nurseName:patient["nurseName"],
				nursePhone:patient["nursePhone"],familyContact:patient["familyContact"],familyPhone:patient["familyPhone"],
				profession:patient["profession"],costType:patient["costType"],prepayment:patient["prepayment"],
				payCost:patient["payCost"],valuationFee:patient["valuationFee"],dietType:patient["dietType"],bedNum:bedList[number]["bedNumber"]};
		docAdList = patient["doctorsAdviceList"];
		discrepancyList = patient["discrepancyList"];
		patrolList = patient["patrolList"];
		nurseRecordList = patient["nurseRecordList"];
		//alert(docAdList.length+" "+discrepancyList.length+" "+patrolList.length+" "+nurseRecordList.length);
		//alert(docAdList.length+" docAdList");
		
		options = {};
		bedListCollection.add(bedData,options)
		.then(function (res){
			mainMenuPage.savePatientInfo(number);
		});
	}
};

mainMenuPage.savePatientInfo = function(number){
	patientCollection.add(patientData,options)
	.then(function (res){
		mainMenuPage.saveDoctorAdviceInfo(number,0);
	});
};

mainMenuPage.saveDoctorAdviceInfo = function(number,docAdNum){
	if (docAdNum >= docAdList.length){
		//alert("医嘱保存结束");
		mainMenuPage.saveDiscrepancyInfo(number,0);
		//mainMenuPage.travelBedList(number+1);
		return;
	}
	var docAd = docAdList[docAdNum];
	doctorAdviceData = {content:docAd["content"],way:docAd["way"],dose:docAd["dose"],frequency:docAd["frequency"],
						 startexecTime:docAd["startexecTime"],doctorName:docAd["doctorName"],type:docAd["type"],
						 adviceId:docAd["id"],patientId:docAd["patientId"]
						 };
	options = {};
	recordList = docAd["recordList"];
	doctorsAdviceCollection.add(doctorAdviceData,options)
	.then(function (res){
		mainMenuPage.saveRecordInfo(number,docAdNum,0);
	});
};

mainMenuPage.saveRecordInfo = function(number,docAdNum,recNum){
	if (recNum >= recordList.length){
		mainMenuPage.saveDoctorAdviceInfo(number,docAdNum+1);
		return;
	}
	var record = recordList[recNum];
	//alert(number+ " " + docAdNum + " " +record["item"]);
	recordData = {item:record["item"],time:record["time"],executor:record["executor"],adviceId:record["adviceId"],recordId:record["id"]};
	options = {};
	recordCollection.add(recordData,options)
	.then(function (res){
		mainMenuPage.saveRecordInfo(number,docAdNum,recNum+1);
	});
};

//递归保存出入管理记录
mainMenuPage.saveDiscrepancyInfo = function(number,discNum){
	//alert(discNum+" "+ discrepancyList.length);
	if (discNum >= discrepancyList.length){
		mainMenuPage.savePatrolInfo(number,0);
		//alert("出入管理保存结束");
		return;
	}
	var disc = discrepancyList[discNum];
	discrepancyData = {patientId:disc["patientId"],nurseId:disc["nurseId"],nurseName:disc["nurseName"],date:disc["date"],
						type:disc["type"],outStyle:disc["outStyle"],describe:disc["describe"]};
	options = {};
	discrepancyCollection.add(discrepancyData,options)
	.then(function (res){
		mainMenuPage.saveDiscrepancyInfo(number,discNum+1);
	});
};

//递归保存巡视记录
mainMenuPage.savePatrolInfo = function(number,patrolNum){
	//alert(patrolNum+" "+ patrolList.length);
	if (patrolNum >= patrolList.length){
		//alert("巡视保存结束");
		mainMenuPage.saveNurseRecord(number,0);
		return;
	}
	var patrol = patrolList[patrolNum];
	patrolData = {patientId:patrol["patientId"],type:patrol["type"],situation:patrol["situation"],patientName:patrol["patientName"],
					date:patrol["date"],userName:patrol["userName"],bedNum:patrol["bedNum"],adviceId:patrol["adviceId"]};
	options = {};
	patrolCollection.add(patrolData,options)
	.then(function (res){
		mainMenuPage.savePatrolInfo(number,patrolNum+1);
	});
};

//递归保存护理记录
mainMenuPage.saveNurseRecord = function(number,nurseRecNum){
	//alert(nurseRecNum+" "+ nurseRecordList.length);
	if (nurseRecNum >= nurseRecordList.length){
		//alert("护理保存结束");
		mainMenuPage.travelBedList(number+1);
		return;
	}
	var nurseRec = nurseRecordList[nurseRecNum];
	nurseRecData = {patientId:nurseRec["patientId"],nurseName:nurseRec["nurseName"],date:nurseRec["date"],
					itemContent:nurseRec["item"]["itemContent"],itemNumber:nurseRec["item"]["itemNumber"]};
	options = {};
	nurseRecordCollection.add(nurseRecData,options)
	.then(function (res){
		mainMenuPage.saveNurseRecord(number,nurseRecNum+1);
	});
};




