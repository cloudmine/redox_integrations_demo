var cm = require("cloudmine");
var rest = require("restler");
var _= require('lodash'); 

var wsAdmin = new cm.WebService({
    "appid": "<%= app_id  %>",
    "apikey": "<%= master_api_key %> "
});

var ws = new cm.WebService({
    "appid": "<%= app_id %> ",
    "apikey": "<%= api_key %> "
});

var integrationUsername = '<%= integrations_username %> ';
var integrationPassword = '<%= integrations_password %> '; 
var baseAuthUrl = 'https://api.cloudmine.io/v2/auth/developer/login';
var integrationCredentials = {username: integrationUsername, password: integrationPassword}
var authToken = ''; 
var baseIntegrationUrl = 'https://api.cloudmine.io/v2/integrations/<%= integration_id %>/query';

/*var data = {};
data.params = {
    "ptfirstname":"Timothy",
    "ptlastname":"Bixby",
    "ptdob":"2008-01-06",
    "ptsex":"male"
 }
*/
var basePtQueryModel = {
	"Meta": {
		"DataModel": "PatientSearch",
		"EventType": "Query",
		"EventDateTime": null,
		"Test": true,
		"Destinations": [
			{
				"ID": "0f4bd1d1-451d-4351-8cfd-b767d1b488d6",
				"Name": "Patient Search Endpoint"
			}
		],
		"FacilityCode": null
	},
	"Patient": {
		"Identifiers": [],
		"Demographics": {
			"FirstName": null,
			"MiddleName": null,
			"LastName": null,
			"DOB": null,
			"SSN": null,
			"Sex": null,
			"Race": null,
			"IsHispanic": null,
			"MaritalStatus": null,
			"IsDeceased": null,
			"DeathDateTime": null,
			"PhoneNumber": {
				"Home": null,
				"Office": null,
				"Mobile": null
			},
			"EmailAddresses": [],
			"Language": null,
			"Citizenship": [],
			"Address": {
				"StreetAddress": null,
				"City": null,
				"State": null,
				"ZIP": null,
				"County": null,
				"Country": null
			}
		},
		"Notes": []
	}
};

/*function exit(objecttoexit){
    console.log('exit was called: ' + JSON.stringify(objecttoexit));
}*/

function getQueryResponse(searchBody, authHeaders){
    rest.postJson(baseIntegrationUrl, searchBody, {headers:authHeaders})
    .on('success', function(integrationsResponseData, response){
        console.log('got success');
   
        exit({status:'success', data: integrationsResponseData});
    }).on('error', function(err){
        exit({status:'error', error: err});
    });
}


function getIntegrationsAuthHeaders(){
  rest.postJson(baseAuthUrl, integrationCredentials)
    .on('success', function(authResponseData, response){
        //console.log(authResponseData.data.token);
        authToken = authResponseData.data.token;
    	var authHeader = 'Bearer ' + authToken;
        var authHeaders = {"Authorization": authHeader};
        var searchBody = getPtQuerySearchBody();
        getQueryResponse(searchBody, authHeaders);
   }).on('error', function(err){
    	exit({error: err, status:'error'});
  });
}


function getPtQuerySearchBody(){
  var searchQuery = basePtQueryModel;
  
  var jsonMap = {
  "ptfirstname":"Patient.Demographics.FirstName",
  "ptlastname":"Patient.Demographics.LastName",
  "ptdob":"Patient.Demographics.DOB",
  "ptsex":"Patient.Demographics.Sex",
 }

for (param in data.params){
  var targetKey = jsonMap[param];
  console.log(data.params[param]);
  _.set(searchQuery, targetKey, data.params[param]);
}//We have name, dob, sex
  
  return searchQuery; 
}

getIntegrationsAuthHeaders();