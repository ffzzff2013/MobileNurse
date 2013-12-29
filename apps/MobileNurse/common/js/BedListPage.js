/**
 * 
 */

bedListPage = {};
var bedListContent;
var bedInfo;
var bedListArr = [];

bedListPage.init = function(){
	WL.Logger.debug("BedListPage :: init");
	pagesHistory.push("page/BedListPage.html");
	$("#hTitle").text("床位列表");
	mobileNursePage.changeTopBarIcon("refresh");
	bedListPage.getBedListContent();
	$("#wrap").trigger("create");
};

bedListPage.checkBedInfo = function (bnApId){
	WL.Logger.debug("BedListPage :: checkBedInfo" + bnApId);
	var arr = bnApId.split(",");
	var bedNo = arr[0];
	var pId = arr[1]; 
	$("#wrap").remove();
	$("#pageContent").load(ROOTPATH + "page/BedInfoPage.html", function(){
		bedInfoPage.init(bedNo,pId);
	});
};

bedListPage.getBedList = function(){
	WL.Logger.debug("BedListPage :: getBedList");
	var bedListD = $("#bedListD");
	var colNum;
	if (curClientWidth >900)
		colNum = 4;
	else if (curClientWidth > 450)
		colNum = 3;
	else 
		colNum = 2;
	var gridClass = "";
	if (colNum == 2) gridClass = "ui-grid-a";
	if (colNum == 3) gridClass = "ui-grid-b";
	if (colNum == 4) gridClass = "ui-grid-c";
	if (colNum == 5) gridClass = "ui-grid-d";
	var col = -1;
	var bedList = "";
	//alert(bedListArr.length);
	for (var i = 0;i < bedListArr.length;i++){
		var curEle = bedListArr[i];
		var unitArray = curEle.split(",");
		var flag = "";
		col++;
		if (col == colNum) {
			col = 0;
			bedList += "</div>";
		}
		if (col == 0) {
			flag = 'a';
			bedList += "<div class='" + gridClass + "'>";
		}
		if (col == 1) flag = 'b';
		if (col == 2) flag = 'c';
		if (col == 3) flag = 'd';
		if (col == 4) flag = 'e';
		if (unitArray[2] == "null")
			bedList+= bedListPage.getBedUnit(unitArray[0],unitArray[2],"空床"," ",flag);
		else
			bedList += bedListPage.getBedUnit(unitArray[0],unitArray[2],unitArray[3],unitArray[4],flag,unitArray[5]);
	}
	bedListD.text("");
	bedListD.append(bedList);
};

bedListPage.getBedUnit = function(bedNumber,patientId,name,sex,unitNum,nurseLevel){
	WL.Logger.debug("BedListPage :: getBedUnit" + name + "_" + sex + "_" + unitNum);
	var bedUnit="";
	if (patientId == "null")
		bedUnit = "<div class='ui-block-" + unitNum +"'>" +
		  "<div class='ui-bar' style='height:4em;text-align:center;background-image:url(images/ic_bedcolor_gray.png);background-size:100% 100%;'><br/>&nbsp&nbsp" + name +"<br/>" + bedNumber + "号床" + "</div>" +
		  "</div>";
	else{
		if (nurseLevel == "特级护理")
			bedUnit = "<div class='ui-block-" + unitNum +"' onclick=\"bedListPage.checkBedInfo('"+ bedNumber + "," + patientId +"')\">" +
			  "<div class='ui-bar' style='height:4em;text-align:center;background-image:url(images/ic_bedcolor_red2.png);background-size:100% 100%;'><br/>&nbsp&nbsp" + name + "<br/>" + bedNumber + "床&nbsp&nbsp" + sex + "</div>" +
			  "</div>";
		if (nurseLevel == "一级护理")
			bedUnit = "<div class='ui-block-" + unitNum +"' onclick=\"bedListPage.checkBedInfo('"+ bedNumber + "," + patientId +"')\">" +
			  "<div class='ui-bar' style='height:4em;text-align:center;background-image:url(images/ic_bedcolor_red.png);background-size:100% 100%;'><br/>&nbsp&nbsp" + name + "<br/>" + bedNumber + "床&nbsp&nbsp" + sex + "</div>" +
			  "</div>";
		if (nurseLevel == "二级护理")
			bedUnit = "<div class='ui-block-" + unitNum +"' onclick=\"bedListPage.checkBedInfo('"+ bedNumber + "," + patientId +"')\">" +
			  "<div class='ui-bar' style='height:4em;text-align:center;background-image:url(images/ic_bedcolor_blue.png);background-size:100% 100%;'><br/>&nbsp&nbsp" + name + "<br/>" + bedNumber + "床&nbsp&nbsp" + sex + "</div>" +
			  "</div>";
		if (nurseLevel == "三级护理")
			bedUnit = "<div class='ui-block-" + unitNum +"' onclick=\"bedListPage.checkBedInfo('"+ bedNumber + "," + patientId +"')\">" +
			  "<div class='ui-bar' style='height:4em;text-align:center;background-image:url(images/ic_bedcolor_yellow.png);background-size:100% 100%;'><br/>&nbsp&nbsp" + name + "<br/>" + bedNumber + "床&nbsp&nbsp" + sex + "</div>" +
			  "</div>";
	}
	return bedUnit;
};

bedListPage.getBedListContent = function(){
	var options = {};
	bedListArr = [];
	bedListCollection.findAll(options)
	.then(function (res) {
		bedListContent = res;
		bedListPage.createContent(0);
	})
	.fail(function (errorObject) {
		alert("获取病床类表内容失败");
	});
};

bedListPage.createContent = function(number){
	if (number >= bedListContent.length){
		bedListPage.getBedList();
		return;
	}
	var info = bedListContent[number];
	bedInfo = info.json.bedNumber;
	bedInfo += ","+info.json.bedState;
	if (info.json.bedState == "空床"){
		bedInfo += ","+"null";
		bedListArr.push(bedInfo);
		bedListPage.createContent(number+1);
	}else{
		bedInfo += ","+info.json.patientId;
		//alert(info.json.patientId);
		var queryP = {id: info.json.patientId};
		var queryOptions = { exact: true };
		patientCollection.find(queryP,queryOptions)
		.then(function (arrayResult){
			if (arrayResult.length > 0){
				var pinfo = arrayResult[0];
				bedInfo += ","+pinfo.json.name;
				bedInfo += ","+pinfo.json.sex;
				bedInfo += ","+pinfo.json.nurseLevel;
				//alert(bedInfo);
			}else{
				bedInfo += ","+" ";
				bedInfo += ","+" ";
				bedInfo += ","+" ";
			}
			bedListArr.push(bedInfo);
			bedListPage.createContent(number+1);
		})
		.fail(function (errorObject){
			alert("fail");
			bedListPage.createContent(number+1);
		});
	}
};