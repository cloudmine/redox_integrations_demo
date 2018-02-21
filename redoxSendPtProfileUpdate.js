var cm = require("cloudmine");
var rest = require("restler");
var _= require('lodash');


/*-------------------------------------------------------------------------------------------------Begin Local Config 
var data = {};
data.params = {};
data["session_token"] = '//';
data["user_id"] = '//';
var ptProfileKey = 'ptdemographics_' + data.user_id; 
data.params[ptProfileKey] =
    {"FirstName":"Timothy","MiddleName":"Paul","LastName":"Bixby","Nickname":"Timmy","DOB":"2008-01-06","SSN":"101-01-0001","Sex":"Male","Race":"Asian","MaritalStatus":"Single","PhoneNumber":{"Home":"+18088675301","Mobile":"+12155555555"},"EmailAddresses":[],"Language":"en","Address":{"StreetAddress":"4762 Hickory Street","City":"Monroe","State":"WI","ZIP":"53566","County":"Green","Country":"US"}}

 function exit(object1){
     console.log(JSON.stringify(object1));
 }
//------------------------------------------------------------------------------------------------End Loal Config*/

var ws = new cm.WebService({
    "appid": "<%= master_api_key %> ",
    "apikey": "<%= master_api_key %> ",
    "session_token": data.session_token
});

var ptProfileKey = 'ptdemographics_' + data.user_id; 
var integrationUsername = '<%= integrations_username %> ';
var integrationPassword = '<%= integrations_password %> '; 
var baseAuthUrl = 'https://api.cloudmine.io/v2/auth/developer/login';
var integrationCredentials = {username: integrationUsername, password: integrationPassword}
var authToken = ''; 
var baseIntegrationUrl = 'https://api.cloudmine.io/v2/integrations/<%= integration_id %> /send';
var basePtUpdateModel =
  {
	"Meta": {
		"DataModel": "PatientAdmin",
		"EventType": "PatientUpdate",
		"EventDateTime": "2018-02-14T03:58:21.795Z",
		"Test": true,
		"Destinations": [
			{
				"ID": "af394f14-b34a-464f-8d24-895f370af4c9",
				"Name": "Redox EMR"
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
				"City":null,
				"State": null,
				"ZIP": null,
				"County": null,
				"Country": null
			}
		},
		"Notes": [],
		"Contacts": [
			{
				"FirstName": null,
				"MiddleName": null,
				"LastName": null,
				"Address": {
					"StreetAddress": null,
					"City": null,
					"State": null,
					"ZIP": null,
					"County": null,
					"Country":null
				},
				"PhoneNumber": {
					"Home":null,
					"Office":null,
					"Mobile": null
				},
				"RelationToPatient": null,
				"EmailAddresses": [],
				"Roles": []
			}
        ],
		"Diagnoses": [
			{
				"Code": null,
				"Codeset": null,
				"Name": null,
				"Type": null
			}
		],
		"Allergies": [
			{
				"Code": null,
				"Codeset": null,
				"Name": null,
				"OnsetDateTime": null,
				"Reaction": []
			}
		],
		"PCP": {
			"NPI": null,
			"FirstName": null,
			"LastName": null,
			"Credentials": [],
			"Address": {
				"StreetAddress":null,
				"City": null,
				"State": null,
				"ZIP": null,
				"County": null,
				"Country": null
			},
			"Location": {
				"Type": null,
				"Facility": null,
				"Department": null,
				"Room": null
			},
			"ID":null,
			"IDType": null
		},
		"Insurances": [
			{
				"Plan": {
					"ID": null,
					"IDType": null,
					"Name": null,
					"Type": null
				},
				"MemberNumber": null,
				"Company": {
					"ID": null,
					"IDType": null,
					"Name": null,
					"Address": {
						"StreetAddress": null,
						"City": null,
						"State": null,
						"ZIP": null,
						"County": null,
						"Country":null
					},
					"PhoneNumber": null
				},
				"GroupNumber": null,
				"GroupName": null,
				"EffectiveDate": null,
				"ExpirationDate": null,
				"PolicyNumber": null,
				"AgreementType": null,
				"CoverageType": null,
				"Insured": {
					"LastName": null,
					"FirstName": null,
					"Relationship": null,
					"DOB": null,
					"Address": {
						"StreetAddress": null,
						"City": null,
						"State": null,
						"ZIP": null,
						"County": null,
						"Country": null
					}
				}
			}
		]
	}
  
}

function updatePtProfile(updateBody){
    ws.update(ptProfileKey, {"Demographics": updateBody["Patient"]["Demographics"]})
        .on('complete', function(ptUpdateClmResponse, response){
            exit({success: ptUpdateClmResponse});
        });
}


function sendPtUpdate(updateBody, authHeaders){
    rest.postJson(baseIntegrationUrl, updateBody, {headers:authHeaders})
    .on('success', function(updateResponseData, response){
        console.log('got success');
        updatePtProfile(updateBody);
    }).on('error', function(err){
        exit({status:'error', error: err});
    });
}


function getIntegrationsAuthHeaders(){
  rest.postJson(baseAuthUrl, integrationCredentials)
    .on('success', function(authResponseData, response){
        authToken = authResponseData.data.token;
    	var authHeader = 'Bearer ' + authToken;
        var authHeaders = {"Authorization": authHeader};
        var updateBody = getPtUpdateBody();
        sendPtUpdate(updateBody, authHeaders);
   }).on('error', function(err){
    	exit({error: err, status:'error'});
  });
}


function getPtUpdateBody(){
    var ptUpdateBody = basePtUpdateModel;
    console.log('params key values: ' + JSON.stringify(data.params[ptProfileKey]));
  	console.log('before lodash: ' + JSON.stringify(ptUpdateBody));
    _.set(ptUpdateBody, "Patient.Demographics", data.params[ptProfileKey]);
  	console.log('after lodash: ' + JSON.stringify(ptUpdateBody)); 
    return ptUpdateBody; 
}

getIntegrationsAuthHeaders();