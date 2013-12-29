util = {};

//分配模块
util.dispatchModel = function(multiColModelArea,singleColModelArea,dispatchObj){
	var obj = dispatchObj.split(',');
	WL.Logger.debug(obj + " " + curClientWidth);
	if (util.isWideScreen() == "true"){
		var mc = new ModelControl(multiColModelArea);
		for (var i = 0;i < obj.length;i++){
			var objP = obj[i].split(':');
			WL.Logger.debug(objP[0] + " " + objP[1]);
			if (objP.length > 1)
				mc.addModel(objP[0],objP[1]);
			else
				mc.addModel(objP[0]);
		}
		mc.dispatchModel();
	}else{
		for (var i = 0;i < obj.length;i++){
			var objP = obj[i].split(':');
			$("#"+singleColModelArea).append($("#"+objP[0]));
		} 
	}
};

//是否宽屏
util.isWideScreen = function(){
	if (curClientWidth < 900)
		return "false";
	else
		return "true";
};

//计算当前设备正放的时候长和宽
util.caculateDeviceHW = function(){
	var orientation = window.orientation;
	if (orientation == "0" || orientation == "180"){
		screenHeight = document.body.clientHeight;
		screenWidth = document.body.clientWidth;
		curClientWidth = screenWidth;
	}else{
		screenHeight = document.body.clientWidth;
		screenWidth = document.body.clientHeight;
		curClientWidth = screenHeight;
	}
};