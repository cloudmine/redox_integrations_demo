# CloudMine Redox Demo
This repo houses a Postman collection and Javascript snippets which form a Redox demo.

# Getting Started
The following replacements need to be made in order to successfully run the package:

## Postman Collection
Line 30: should be tester's email.

## queryEHR.js
Lines 5,10: should reference your application's Master API Key, standard API key, and App Id.
Lines 15, 16: Set the integrations username/password.
Line 20: Set the integrations_id. 

## redoxSendPtProfileUpdate.js


# JS Snippets

The following endpoints exist to manage the interface between CloudMine's integration engine and the application itself. These snippets are considered best practice, and enable the decoupling of auth/authz concerns between Integrations services and app-level services. Similarly, they also provide a mechanism for your code to determine how to best handle the data transmission. For example, should the message be merged into your application's data model at the patient level, or do you need to notify the patient of updated lab results and perform some outreach?

## `/run/queryEHR`

The `queryEHR.js` file allows for 

## `/run/redoxSendPtProfileUpdate`

