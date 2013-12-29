
/* JavaScript content from js/NursePage.js in folder common */
nursePage = {};
var responsiveNurseData;
var nurseItemArr;
var typeList;
var itemList;
var relationList;
var typeData;
var itemData;
var relationData;

nursePage.init = function(){
	WL.Logger.debug("NursePage :: init");
	pagesHistory.push("page/NursePage.html");
	//patientID = pID;
	nursePage.updateNurseItem();
	$("#hTitle").text("护理");
	$("#wrap").trigger("create");
};

nursePage.updateNurseItem = function(){
	busyIndicator.show();
	/*$("#segmentContent").load("page/BaseNursePage.html", function(){
		baseNursePage.init();
		busyIndicator.hide();	
	});*/
	//alert(curUserInfo.session);
	$.ajax({
		url:SERVERADDRESS + "getNurseInfo",
		type:"GET",
		data:{session:curUserInfo.session},
		timeout:5000,
		dataType:"json",
		success:function(data){
		  //var msgJson = eval(data); dataType为json，就不用转了
			responsiveNurseData = data;
			if (responsiveNurseData["resultCode"] == "0001"){
				//alert(responsiveNurseData["msg"]);
				$("#segmentContent").load("page/BaseNursePage.html", function(){
					baseNursePage.init();
					busyIndicator.hide();	
				});
			}
			else
				nursePage.clearItems();
		  },
		error:function(){
			busyIndicator.hide();
			  alert("超时");
		 }
	});
};

nursePage.clearItems = function(){
	/*var query = {};
	var queryOptions = {};
	nurseCollection.find(query,queryOptions)
	.then(function (arrayResult){
		nurseItemArr = arrayResult;
		nursePage.deleteItem(0);
	})
	.fail(function (errorObject){
	});*/
	nurseCollection.removeCollection()
	.then(function(){
		WL.JSONStore.init(co.getCollection("NurseCollection"))
		.then(function(){
			nurseCollection = WL.JSONStore.get("NurseCollection");
			
			nurseItemCollection.removeCollection()
			.then(function(){
				WL.JSONStore.init(co.getCollection("NurseItemCollection"))
				.then(function(){
					nurseItemCollection = WL.JSONStore.get("NurseItemCollection");
					
					nurseTypeCollection.removeCollection()
					.then(function(){
						WL.JSONStore.init(co.getCollection("NurseTypeCollection"))
						.then(function(){
							nurseTypeCollection = WL.JSONStore.get("NurseTypeCollection");
							busyIndicator.hide();
							if (responsiveNurseData["resultCode"] == "0002")
								alert(responsiveNurseData["msg"]);
							if (responsiveNurseData["resultCode"] == "0000"){
								typeList = responsiveNurseData["type"];
								itemList = responsiveNurseData["item"];
								relationList = responsiveNurseData["relation"];
								//alert("clear All");
								nursePage.addType(0);
							}
								//nursePage.matchItemAndType(responsiveNurseData);
						})
						.fail(function(){
							alert("NurseTypeCollection初始化失败");
						});
					})
					.fail(function(){
						alert("NurseTypeCollection删除数据失败");
					});
				})
				.fail(function(){
					alert("NurseItemCollection初始化失败");
				});
			})
			.fail(function(){
				alert("NurseItemCollection删除数据失败");
			});
		})
		.fail(function(){
			alert("NurseCollection初始化失败");
		});
	})
	.fail(function(){
		alert("NurseCollection删除数据失败");
	});
};

/*nursePage.deleteItem = function(number){
	if (number >= nurseItemArr.length){
		//alert(responsiveNurseData["resultCode"]);
		if (responsiveNurseData["resultCode"] == "0002")
			alert(responsiveNurseData["msg"]);
		if (responsiveNurseData["resultCode"] == "0000")
			nursePage.matchItemAndType(responsiveNurseData);
		return;
	}
	//alert(nurseItemArr[number]._id);
	var querys = {_id:nurseItemArr[number]._id};
	var queryOptionss = {exact:true};
	nurseCollection.remove(querys,queryOptionss)
	.then(function(){
		nursePage.deleteItem(number+1);})
	.fail(function(){
	});
	
	
};*/

//保存类型相关信息
nursePage.addType = function(typeNum){
	if (typeNum >= typeList.length){
		//alert(typeList.length+"type");
		nursePage.addItem(0);
		return;
	}
	var nurseType = typeList[typeNum];
	typeData = {typeContent:nurseType["typeContent"],typeNumber:nurseType["typeNumber"]};
	options = {};
	nurseTypeCollection.add(typeData,options)
	.then(function (res){
		nursePage.addType(typeNum+1);
	});
};

//保存项目相关信息
nursePage.addItem = function(itemNum){
	if (itemNum >= itemList.length){
		//alert(itemList.length+"item");
		nursePage.addRelation(0);
		return;
	}
	var nurseItem = itemList[itemNum];
	itemData = {itemContent:nurseItem["itemContent"],itemNumber:nurseItem["itemNumber"]};
	options = {};
	nurseItemCollection.add(itemData,options)
	.then(function (res){
		nursePage.addItem(itemNum+1);
	});
};

//保存联系
nursePage.addRelation = function(number){
	if (number >= relationList.length){
		//alert(relationList.length+"relation");
		$("#segmentContent").load("page/BaseNursePage.html", function(){
			baseNursePage.init();
			busyIndicator.hide();
		});
		return;
	}
	var item="",type="";
	for (var j = 0;j < typeList.length;j++){
		if (typeList[j]["typeNumber"] == relationList[number]["typeNumber"]){
			type = typeList[j]["typeContent"];
			break;
		}
	}
	for (var j = 0;j < itemList.length;j++){
		if (itemList[j]["itemNumber"] == relationList[number]["itemNumber"]){
			item = itemList[j]["itemContent"];
			break;
		}
	}
	//alert(number + " " + item + " " + type);
	var dataItem = {typeContent: type,itemContent: item};
	var options = {};
	nurseCollection.add(dataItem,options)
	.then(function(){
		nursePage.addRelation(number+1);})
	.fail(function(){
		alert("fail");
	});
};

nursePage.selectNurseSegment = function(segmentNo){
	WL.Logger.debug("TourPage :: selectSegment" + segmentNo);
	if ("1" == segmentNo){
		$("#specialNurseSeg").removeClass('ui-control-active');
		$("#specialNurseSeg").addClass('ui-control-inactive');
		$("#baseNurseSeg").removeClass('ui-control-inactive');
		$("#baseNurseSeg").addClass('ui-control-active');
		$("#nurseRecSeg").removeClass('ui-control-active');
		$("#nurseRecSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/BaseNursePage.html", function(){
			baseNursePage.init();
		});
	}
	if ("2" == segmentNo){
		$("#baseNurseSeg").removeClass('ui-control-active');
		$("#baseNurseSeg").addClass('ui-control-inactive');
		$("#specialNurseSeg").removeClass('ui-control-inactive');
		$("#specialNurseSeg").addClass('ui-control-active');
		$("#nurseRecSeg").removeClass('ui-control-active');
		$("#nurseRecSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/SpecialNursePage.html", function(){
			specialNursePage.init();
		});
	}
	if ("3" == segmentNo){
		$("#specialNurseSeg").removeClass('ui-control-active');
		$("#specialNurseSeg").addClass('ui-control-inactive');
		$("#nurseRecSeg").removeClass('ui-control-inactive');
		$("#nurseRecSeg").addClass('ui-control-active');
		$("#baseNurseSeg").removeClass('ui-control-active');
		$("#baseNurseSeg").addClass('ui-control-inactive');
		$("#page").trigger("create");
		$("#segmentContent").load(ROOTPATH + "page/NurseRecordPage.html", function(){
			nurseRecordPage.init();
		});
	}
	
};