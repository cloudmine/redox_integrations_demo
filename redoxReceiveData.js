var cm = require('cloudmine'); 

var ws = new cm.WebService({
    "appid": "<%= app_id  %>",
    "apikey": "<%= api_key %>"
});

var wsAdmin = new cm.WebService({
    "appid": "<%= app_id  %>",
    "apikey": "<%= master_api_key  %>"
});

var redoxMessage = data.params || null; 
var redoxMessagePatientFirstName = data.params.Patient.Demographics.FirstName;;
var redoxMessagePatientLastName = data.params.Patient.Demographics.LastName;
var redoxMessageInsurances = data.params.Patient.Insurances;
var redoxMessagePCP = data.params.Patient.PCP;

var queryString = '[FirstName=\"' + redoxMessagePatientFirstName + '\", LastName=\"' + redoxMessagePatientLastName + '\"]';

ws.searchUsers(queryString, {limit: 1})
  .on('success', function(searchUserResponse, response){
  	var userId =  Object.keys(searchUserResponse)[0]; 
	ws.set('redox-testing', {userid: userId}); 


  	wsAdmin.update('ptdemographics_' + userId, {PCP: redoxMessagePCP, Insurances: redoxMessageInsurances}, {applevel:false,userid: userId})
      .on('complete', function(updateUserProfileResponse, response){
    	  ws.set('redox-testing2', {updateUserProfileResponse: updateUserProfileResponse, userid: userId}); 
    }); 
    
});