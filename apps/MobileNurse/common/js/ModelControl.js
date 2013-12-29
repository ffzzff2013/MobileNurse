function ModelControl(areaName){
	this.modelArr = [];
	this.leftArr = [];
	this.rightArr = [];
	this.modelState = [];
	this.divAreaName = areaName;

	$("#"+this.divAreaName).append('<div id="mc_LeftPart"></div>');
	$("#"+this.divAreaName).append('<div id="mc_RightPart"></div>');
	$("#mc_LeftPart").addClass("floatLeft");
	$("#mc_RightPart").addClass("floatRight");

	
	//添加模块
	this.addModel = function(model,state){
		this.modelArr.push(model);
		this.modelState.push(state);
	};
	
	//根据最优决策分配模块布局
	this.dispatchModel = function(){
		if (this.modelArr.length == 0)
			return 0;
		if (this.modelArr.length == 1){
			$("#mc_LeftPart").append($("#"+this.leftArr[0]));
			return 0;
		}
		
		//边界情况处理
		var heightGap = this.fixModel();
		WL.Logger.debug("ModelControl :: " + heightGap + " :: " + this.modelArr.length);
		if (this.modelArr.length == 1){
			if (heightGap >= 0){
				this.rightArr.push(this.modelArr[0]);
				//$("#mc_RightPart").append($("#"+this.modelArr[0]));
			}else{
				this.leftArr.push(this.modelArr[0]);
				//$("#mc_LeftPart").append($("#"+this.modelArr[0]));
			}
				
		}else{
			if (this.modelArr.length > 1)
				this.setModelOrder(heightGap);
		}
		WL.Logger.debug(this.rightArr.length + "::" + this.leftArr.length);
		for (var i = 0;i < this.rightArr.length;i++){
			$("#mc_RightPart").append($("#"+this.rightArr[i]));
			WL.Logger.debug("r" + this.rightArr[i]);
		}
		for (var i = 0;i < this.leftArr.length;i++){
			$("#mc_LeftPart").append($("#"+this.leftArr[i]));
			WL.Logger.debug("l" + this.leftArr[i]);
		}
		
	};
	
	//被dispatchModel调用
	this.setModelOrder = function(heightGap){
		var modelAmount = this.modelArr.length;
		var modelHeightArr = new Array();
		var heightSum = 0;
		for (var i = 0;i < modelAmount;i++){
			modelHeightArr[i] = $("#"+this.modelArr[i]).height();
			heightSum += modelHeightArr[i];
		}
		var f,index;
		f = new Array();
		index = new Array();
		var haltHeightSum = parseInt((heightSum + heightGap)/2);

		//固定浮动在右边高度大于其他模块高度和
		if (haltHeightSum < 0){
			for (var i = 0;i < modelAmount;i++)
				this.leftArr.push(this.modelArr[i]);
			return 0;
		}
		
		for (var i = 0;i <= haltHeightSum;i++){
			f[i] = 0;
			index[i] = new Array();
			for (var j = 0;j < modelAmount;j++)
				index[i][j] = 0; 
		}
	
		//计算最优分组
		for (var i = 0;i < modelAmount;i++){
			for (var j = haltHeightSum;j > 0;j--){
				if (j >= modelHeightArr[i] && f[j-modelHeightArr[i]] + modelHeightArr[i] > f[j]){
					f[j] = f[j-modelHeightArr[i]] + modelHeightArr[i];
					for (var k = 0;k < modelAmount;k++)
						index[j][k] = index[j-modelHeightArr[i]][k];
					index[j][i] = 1;
				}
			}
		}	
		
		//分组
		for (var i = 0;i < modelAmount;i++){
			if (index[haltHeightSum][i] == 1){
				this.rightArr.push(this.modelArr[i]);
			}else{
				this.leftArr.push(this.modelArr[i]);
			}
		}
		return 0;
	};
	
	//处理固定的模块
	this.fixModel = function(){
		var flag = true;
		var heightGap = 0;
		while (flag){
			flag = false;
			WL.Logger.debug(this.modelState.length);
			for (var i = 0;i < this.modelState.length;i++){
				//左固定
				if (this.modelState[i] == "LEFTFIXED"){
					this.leftArr.push(this.modelArr[i]);
					heightGap += $("#"+this.modelArr[i]).height();
					this.modelArr.splice(i,1);
					this.modelState.splice(i,1);
					flag = true;
					WL.Logger.debug("l "+i+" "+this.modelArr[i]+" "+$("#"+this.modelArr[i]).height());
				}
				//右固定
				if (this.modelState[i] == "RIGHTFIXED"){
					this.rightArr.push(this.modelArr[i]);
					heightGap -= $("#"+this.modelArr[i]).height();
					this.modelArr.splice(i,1);
					this.modelState.splice(i,1);
					flag = true;
					WL.Logger.debug("r "+i+" "+this.modelArr[i]+" "+$("#"+this.modelArr[i]).height());
				}
				if (flag) break;
			}
		}
		return heightGap;
	};
};