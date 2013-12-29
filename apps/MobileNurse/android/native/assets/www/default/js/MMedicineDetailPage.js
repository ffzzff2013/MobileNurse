
/* JavaScript content from js/MMedicineDetailPage.js in folder common */

mMedicineDetailPage={};

mMedicineDetailPage.init = function(){
	WL.Logger.debug("MMedicineDetailPage :: init");
	pagesHistory.push("page/MMedicineDetailPage.html");
	$("#hTitle").text("配药");
	$('html, body').animate({scrollTop: 0}, 'slow');
	$("#wrap").trigger("create");
};