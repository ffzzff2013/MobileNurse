
/* JavaScript content from js/LoginPage.js in folder common */
/**
 * 
 */

loginPage = {};
var ifRem = true;
var userInfo;
var PEOPLE_COLLECTION_NAME = 'people';

loginPage.init = function(){
	WL.Logger.debug("LoginPage :: init");
	pagesHistory.push("page/LoginPage.html");
	$("#uname").blur(loginPage.checkRemember);
	//$("#page").css("background-image","url(images/ic_bg.png)");
	//$("#page").css("background-size","100% 100%");
	//alert("url(" + ROOTPATH  + "images/ic_bg.png)");
	//$("#content").css("background-img","url(" + ROOTPATH  + "images/ic_bg.png)");
	$("#page").trigger("create");
};

loginPage.checkRemember = function(){
	var username = $('#uname').val();
	var query = {username: username};
	var queryOptions = { exact: true};
	if (username == "")
		return 0;
	loginCollection.find(query,queryOptions)
	.then(function (arrayResult){
		if (arrayResult.length > 0){
			userInfo = arrayResult[0];
			$('#pwd').val(userInfo.json.password);
		}
		else{
			$('#pwd').val("");
		}
	})
	.fail(function (errorObject){
		alert("failFind");
	});
};

loginPage.rememberPwd = function(){
	if (ifRem==false)
		ifRem=true;
	else
		ifRem=false;
};

loginPage.login = function(){
	WL.Logger.debug("LoginPage :: login");
	var username = $('#uname').val();
	var password = $('#pwd').val();
	if (username == "" || password == ""){
		alert("用户名和密码不能为空");
		return 0;
	}
	/*$("#wrap").remove();
	$("#pageContent").load(ROOTPATH + "page/MainMenuPage.html", function(){
		mainMenuPage.init("false");
	});
};*/
	busyIndicator.show();
	$.ajax({
		url:SERVERADDRESS + "login",
		type:"POST",
		data:{userName:username,passWord:password},
		timeout:5000,
		dataType:"json",
		success:function(data){
		    //var msgJson = eval(data); dataType为json，就不用转了
			busyIndicator.hide();
			if (data["resultCode"]=="0000"){
				loginPage.loginSuccess(data);
			};
			if (data["resultCode"]=="0002"){
				alert(data["msg"]);
			};
		  },
		error:function(){
			busyIndicator.hide();
			alert("超时");
		}
	});
};

loginPage.loginSuccess = function(data){
	if (ifRem){
		var username = $('#uname').val();
		var password = $('#pwd').val();
		//判断用户名是否已存在
		var query = {username: username};
		var queryOptions = { exact: true};
		loginCollection.find(query,queryOptions)
		.then(function (arrayResult){
			if (arrayResult.length > 0){
				userInfo = arrayResult[0];
				userInfo.json.password = password;
				var options = {};
				loginCollection.replace(userInfo,options)
				.then(function(){
				})
				.fail(function(){
					alert("修改失败");
				});
			}
			else{
				var data = {username: username,password: password};
				var options = {};
				loginCollection.add(data,options)
				.then(function(){
				})
				.fail(function(){
					alert("存储失败");
				});
			}
		})
		.fail(function (errorObject){
			alert("failFind");
		});
	}else{
	}
	var user = data["user"];
	curUserInfo.userId = user["userId"];
	curUserInfo.chineseName = user["cineseName"];
	curUserInfo.employeeId = user["employeeId"];
	curUserInfo.departmentName = user["departmentName"];
	curUserInfo.departmentCode = user["departmentCode"];
	curUserInfo.session = data["session"];
	//alert(curUserInfo.session+" "+curUserInfo.chineseName);
	$("#wrap").remove();
	$("#pageContent").load(ROOTPATH + "page/MainMenuPage.html", function(){
		mainMenuPage.init("false");
	});
};