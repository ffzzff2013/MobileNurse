
/* JavaScript content from js/CollectionObject.js in folder common */
function CollectionObject(){
	this.getCollection = function(collectionName){
		if (collectionName == "LoginCollection"){
			var loginCol = {};
			loginCol["LoginCollection"]={};
			loginCol["LoginCollection"].searchFields = {username:'string',password:'string'};
			return loginCol;
		}
		if (collectionName == "NurseCollection"){
			var nurseCol = {};
			nurseCol["NurseCollection"]={};
			nurseCol["NurseCollection"].searchFields = {typeContent:'string',itemContent:'string'};
			return nurseCol;
		}
		if (collectionName == "NurseTypeCollection"){
			var nurseTypeCol = {};
			nurseTypeCol["NurseTypeCollection"]={};
			nurseTypeCol["NurseTypeCollection"].searchFields = {typeContent:'string',typeNumber:'string'};
			return nurseTypeCol;
		}
		if (collectionName == "NurseItemCollection"){
			var nurseItemCol = {};
			nurseItemCol["NurseItemCollection"]={};
			nurseItemCol["NurseItemCollection"].searchFields = {itemContent:'string',itemNumber:'string'};
			return nurseItemCol;
		}
		if (collectionName == "BedListCollection"){
			var bedListCol = {};
			bedListCol["BedListCollection"]={};
			bedListCol["BedListCollection"].searchFields = {bedNumber:'string',bedState:'string',patientId:'string'};
			return bedListCol;
		}
		if (collectionName == "PatientCollection"){
			var patientCol = {};
			patientCol["PatientCollection"]={};
			patientCol["PatientCollection"].searchFields = {name:'string',sex:'string',age:'string',id:'string',hospName:'string',
															deparName:'string',nurseLevel:'string',state:'string',diagnose:'string',
															allergyMedic:'string',temperature:'string',admissionDate:'string',surgeryDate:'string',
															doctorName:'string',doctorPhone:'string',nurseName:'string',nursePhone:'string',
															familyContact:'string',familyPhone:'string',profession:'string',costType:'string',
															prepayment:'string',payCost:'string',valuationFee:'string',dietType:'string',bedNum:'string'
															};
			return patientCol;
		};
		if (collectionName == "DoctorsAdviceCollection"){
			var doctorsAdviceCol = {};
			doctorsAdviceCol["DoctorsAdviceCollection"]={};
			doctorsAdviceCol["DoctorsAdviceCollection"].searchFields = {content:'string',way:'string',dose:'string',frequency:'string',startexecTime:'string',
																		doctorName:'string',type:'string',adviceId:'string',patientId:'string'};
			return doctorsAdviceCol;
		}
		if (collectionName == "RecordCollection"){
			var recordCol = {};
			recordCol["RecordCollection"]={};
			recordCol["RecordCollection"].searchFields = {item:'string',time:'string',executor:'string',adviceId:'string',recordId:'string'};
			return recordCol;
		}
		if (collectionName == "DiscrepancyCollection"){
			var discrepancyCol = {};
			discrepancyCol["DiscrepancyCollection"]={};
			discrepancyCol["DiscrepancyCollection"].searchFields = {patientId:'string',nurseId:'string',nurseName:'string',date:'string',type:'string',
																	outStyle:'string',describe:'string'};
			return discrepancyCol;
		};
		if (collectionName == "NurseRecordCollection"){
			var nurseRecordCol = {};
			nurseRecordCol["NurseRecordCollection"]={};
			nurseRecordCol["NurseRecordCollection"].searchFields = {patientId:'string',nurseName:'string',date:'string',itemContent:'string',itemNumber:'string'};
			return nurseRecordCol;
		}
		if (collectionName == "PatrolCollection"){
			var patrolCol = {};
			patrolCol["PatrolCollection"]={};
			patrolCol["PatrolCollection"].searchFields = {patientId:'string',type:'string',situation:'string',patientName:'string',date:'string',userName:'string',
														bedNum:'string',adviceId:'string'};
			return patrolCol;
		}
	};
}
