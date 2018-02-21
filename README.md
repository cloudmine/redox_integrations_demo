# CloudMine Redox Demo
This repo houses a Postman collection and Javascript snippets which form a Redox demo.

## Getting Started
This demo is comprised of multiple components, incorporating tools such as Postman and the CloudMine Logic Engine API. Postman allows us to mock out a standard client flow, and the JS Snippets/Logic Engine package enable communication between CloudMine's Redox Connector and your client application. 

### Redox Source and Destination

-- need a source
-- need a destination
-- configure  the source
-- configure the destination 

### `CloudMine-Redox-Postman-Collection.json`
The Postman collection itself allows customers to demo a prepackaged use case that achieves the following:

1) Creates a Patient
2) Logs the Patient In
3) Queries the patient-level data store on CloudMine in order to show that no data has been created already. 
4) Queries the Redox-Integration service for known data about this patient.
5) Updates the patient record in both CloudMine and Redox with a new phone number. 
6) Verifies the updated data locally on CloudMine to ensure it has been saved as part of the patient-level data store. 
7) Asynchronously receives a CCD-style patient update (as a response to the query), and merges this data with the existing patient record. 

In order to prepare the environment, you will need to add some configuration to the various Snippets and Postman collections so that it matches your environment. 

#### Replacements
Line 30: should be tester's email. 

### `CloudMine-Redox-Demo-Environment.postman_environment_json`
The Postman environment file serves as a template, indicating which of KV pairs which are required for the Postman collection to execute successfully. The following items need to be present, otherwise the Postman collection might fail to run. 

`appid`: required, available from the CloudMine CHC dashboard. 
`apikey`: required, available from the CloudMine CHC dashboard.
`ptname`: required. 
`ptsex`: required.
`ptfirstname`: required.
`ptlastname`: required.
`ptdob`: required. 

Note: Timothy Bixby is a standard user within Redox's test tools environment. Changing the `ptname`, `ptdob`, `ptsex`, `ptfirstname`, or `ptlastname` to a patient other than those listed in Redox's dev tools could cause the demo to fail as no users will be found in the EHR environment. Other patients within Redox's development tools include: 

*) Barbara Bixby
*) Walter Carthwright
*) Elizabeth Carthwright 

#### Replacements

Please ensure the above KV pairs exist in your environment file, and for an end-to-end demo, that the referenced patient exists within the Redox development tools EHR. 

### `queryEHR.js`

This snippet manages the communication between your CloudMine application in Logic Engine (or JS Snippets), and the CloudMine integration engine.

#### Replacements
Line 6: your application's `appid`, available within the CHC dashboard. 
Line 7: your application's `master api key`, available within the CHC dashboard.
Line 11: your application's `appid`, available within the CHC dashboard. 
Line 12: your application's `api key`, available within the CHC dashboard.
Line 15: the CloudMine organization developer username.
Line 16: the CloudMine organixation developer password. 
Line 20: the CloudMine `integration_id` representing the Redox Source.

### `redoxSendPtProfileUpdate.js`

This snippet takes an updated phone number for the patient, sends it to the Integrations service for dispatch to the EHR, and upon successful respose from the Integrations API, updates the patient-level profile data ith the new phone number. 

#### Replacements
Line 21: your application's `appid`, available within the CHC dashboard. 
Line 22: your application's `master api key`, available within the CHC dashboard.
Line 27: the CloudMine organization developer username.
Line 28: the CloudMine organixation developer password. 
Line 32: the CloudMine `integration_id` representing the Redox Source.

### `redoxReceiveData.js`

#### Replacements
Line 4: your application's `appid`, available within the CHC dashboard. 
Line 5: your application's `api key`, available within the CHC dashboard.
Line 9: your application's `appid`, available within the CHC dashboard. 
Line 10: your application's `master api key`, available within the CHC dashboard.