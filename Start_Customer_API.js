//Application prerequisite
//-----------------------------------------------------------------------

//Import required NodeJS packages
const express           = require("express");
const axios             = require("axios");
const cors              = require("cors");
const mysql             = require("mysql");
const json              = require("json");
const PDFDocument       = require("pdfkit");
const fs                = require("fs");
const bodyParser        = require('body-parser');
const xmlparser         = require('express-xml-bodyparser');
const xml2json          = require('xml2js');
const xml2json_parser   = require('xml2json');
const request           = require('request');
const ftp               = require("basic-ftp");
const cron              = require("node-cron");
const nodemailer        = require("nodemailer");
const https             = require("https");

//Import the .env variables
require('dotenv').config();

//Assign the express Router to a variable
const router = express.Router();

//Define the application
const app = express();

//Define the application values
const application_port          = 3000;
const application_name          = "Softpak API";
const application_version       = "1.0.0";
const application_version_date  = "06/04/2023";
const application_beta          = true;

let options = {
    key: fs.readFileSync('/etc/apache2/ssl/private.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/server.crt'),
    ca: fs.readFileSync('/etc/apache2/ssl/chain.crt')
};

//Define the database connection
// const con = mysql.createConnection({
//     host: process.env.Softpak_DB_HOST,
//     port: process.env.Softpak_DB_PORT,
//     user: process.env.Softpak_DB_USER,
//     password: process.env.Softpak_DB_PSWD
// });

const con = mysql.createConnection({
    host: "[DB Host here]",
    port: "[DB Host port here]",
    user: "[DB User here]",
    password: "[DB password here]"
});

//Assign the functions to the application
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(xmlparser());
app.use("/", router);

//Application function schedules
//-----------------------------------------------------------------------

//Cron tab timing cheatsheet
//
//             ┌──────────── minute (0 - 59) 
//             │ ┌────────── hour (0 - 23)
//             │ │ ┌──────── day of the month (1 - 31)
//             │ │ │ ┌────── month (1 - 12)
//             │ │ │ │ ┌──── day of the week (0 - 6) (0 and 7 both represent Sunday)
//             │ │ │ │ │
//             │ │ │ │ │
//             * * * * *
cron.schedule("* * * * *", function() {
    console.log("------------------------------------");
    console.log("Running minute tasks");
    console.log("------------------------------------");

    // Retriev_Outbound_Confirmation_files();
});

//Application Endpoints
//-----------------------------------------------------------------------

/** 
 * Inbound announcement endpoint
 * 
 * @version 2.0
 * @author Danny de Snoo
 * @async
 * @type HTTP-Request
 * @method POST
 * @summary This endpoint is for customers who can't send palletlines in their inbound create request.
 * 
 * This endpoint is a customer focused endpoint for customers who can't send palletlines in their inbound order create request.
 * The endpoint first verifies the API-Key and then if the API-Key is valid 
 */
app.post("/inbound/announce", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("INBOUND-ANNOUNCE", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

//Inbound create endpoint
app.post("/inbound/create", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("INBOUND-CREATE", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

//Outbound create endpoint
app.post("/outbound/create", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("OUTBOUND-CREATE", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

//Productlist
app.post("/productlist", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("PRODUCTLIST", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

//Application Endpoints - DEBUG
//-----------------------------------------------------------------------
app.post("/productlist", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("PRODUCTLIST", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

app.post("/productlist", async (req, res) => {
    var auth_key = req.query.apikey;
    var body     = req.body;

    APIKeyCheck(auth_key, function(results){
        var access = results;

        switch (access) {
            //User has access
            case '1':
                //Check if the body has any data
                if (body) {
                    console.log(body);

                    var test = JSON.stringify(body);
                    console.log(test);

                    // var clob_content = body.toString();
                    SaveFile("PRODUCTLIST", "json", auth_key, test, res);
                } else {
                    res.send("<Response><Statuscode>204</Statuscode><statusmessage>No Body message, Please send a Body message for proccessing</statusmessage></Response>");
                }
                break;
            //User has no access
            case '0':
                res.send("<Response><Statuscode>500</Statuscode><statusmessage>Invalid API-Key used!, Please use a valid API-Key</statusmessage></Response>");
                break;
            //There was an error while checking the APIKey
            case '999':
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
            //Default response if their isn't a case for it
            default:
                res.send("<Response><Statuscode>501</Statuscode><statusmessage>Their was a error while checking your API Access key, A e-mail has been send to our technical support staff, Please try again later</statusmessage></Response>");
                break;
        }
    });
});

app.post("/debug/api/main/send/inbound/confirmations", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Send_XML_InConfirmed_Files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"SEND-INBOUND-CONFIRMATIONS\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/main/send/outbound/confirmations", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Send_XML_OutConfirmed_Files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"SEND-OUTBOUND-CONFIRMATIONS\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/softpak/send/inbound", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        // Translate_SoftPak_Inbound();
        Process_Create_SoftPak_Message_Inbound();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"SEND-INBOUNDS-TO-SOFTPAK\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/softpak/send/outbound", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Create_SoftPak_Message_Outbound();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"SEND-OUTBOUNDS-TO-SOFTPAK\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/inbound", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Inbound_Files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"PROCESS-INBOUND-CREATE-REQUESTS\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/inbound/announce", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Announce_Inbound_Files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"PROCESS-INBOUND-ANNOUNCE-REQUESTS\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/outbound", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Outbound_Files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"PROCESS-OUTBOUND-CREATE-REQUESTS\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/inconfirmed", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Read_SoftPak_Message_Inbound();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"PROCESS-INCONFIRMED-MESSAGES\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/outconfirmed", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Process_Read_SoftPak_Message_Outbound();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"PROCESS-OUTCONFIRMED-MESSAGES\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/retriev/outconfirm", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Retriev_Outbound_Confirmation_files();
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"RETRIEV-OUTCONFIRM-MESSAGES\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

app.post("/debug/api/process/inbound/link", async (req, res) => {
    var Manual_Activation_Key = req.query.mak;

    if (Manual_Activation_Key == "107cadb2-9c7e-41a4-bc8d-ce6a92860317") { 
        Link_Inbound_Messages("0180133979", 6, 3 , function(result){
            console.log("done")
        });
        res.send("VALID MANUAL ACTIVATION KEY RECEIVED, COMMAND \"LINK-INBOUND-MESSAGES\" RECEIVED, EXECUTING COMMAND");
    } else {
        res.send("INVALID MANUAL ACTIVATION KEY RECEIVED, NO COMMANDS WILL BE EXECUTED");
    }
});

//Application Functions
//-----------------------------------------------------------------------
function Process_Announce_Inbound_Files() {
    //Create a SQL Select Statement
    var SQL_Select_Statement = "SELECT * FROM `Softpak_ChangeManager`.`processdocuments` WHERE `DocumentName` like '%Inannounce%' AND ID = '379'";

    //Connect to the database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
        } else {
            for (i=0; i<SQL_S1_rows.length; i++){
                var ProcessDocuments_ID             = SQL_S1_rows[i].ID;
                var ProcessDocuments_DocumentName   = SQL_S1_rows[i].DocumentName;
                var ProcessDocuments_FileExtension  = SQL_S1_rows[i].FileExtension;
                var ProcessDocuments_SentInAPIKey   = SQL_S1_rows[i].SentInAPIKey;
                var ProcessDocuments_Processed      = SQL_S1_rows[i].Processed;
                var ProcessDocuments_Errored        = SQL_S1_rows[i].Errored;
                var ProcessDocuments_ErroredAmount  = SQL_S1_rows[i].ErroredAmount;
                var ProcessDocuments_DocumentCLOB   = SQL_S1_rows[i].DocumentCLOB;
                var ProcessDocuments_CreatedBy      = SQL_S1_rows[i].CreatedBy;
                var ProcessDocuments_UpdateBy       = SQL_S1_rows[i].UpdateBy;
                var ProcessDocuments_CreateDateTime = SQL_S1_rows[i].CreateDateTime;
                var ProcessDocuments_UpdateDateTime = SQL_S1_rows[i].UpdateDateTime;

                APICustomerData(ProcessDocuments_SentInAPIKey, function(results){
                    var JSONObject_CustomerData = JSON.parse(results);

                    console.log(JSONObject_CustomerData);

                    var CustomerData_ID                 = JSONObject_CustomerData.ID;
                    var CustomerData_ExternalID         = JSONObject_CustomerData.ExternalID;
                    var CustomerData_CustomerShortName  = JSONObject_CustomerData.CustomerShortName;
                    var CustomerData_CustomerFullName   = JSONObject_CustomerData.CustomerFullName;
                    var CustomerData_Street             = JSONObject_CustomerData.Street;
                    var CustomerData_HouseNumber        = JSONObject_CustomerData.HouseNumber;
                    var CustomerData_Postalcode         = JSONObject_CustomerData.Postalcode;
                    var CustomerData_City               = JSONObject_CustomerData.City;
                    var CustomerData_ResponseMessageLan = JSONObject_CustomerData.ResponseMessageLan;
                    var CustomerData_ResponseMessageLoc = JSONObject_CustomerData.ResponseMessageLoc;
                    var CustomerData_CreateDateTime     = JSONObject_CustomerData.CreateDateTime;
                    var CustomerData_UpdateDateTime     = JSONObject_CustomerData.UpdateDateTime;
                    var CustomerData_CreateBy           = JSONObject_CustomerData.CreateBy;
                    var CustomerData_UpdateBy           = JSONObject_CustomerData.UpdateBy;

                    switch (CustomerData_ExternalID) {
                        case "1953":
                            Translate_Inbound_Announce(ProcessDocuments_ID, CustomerData_ExternalID, ProcessDocuments_DocumentCLOB);
                            break;
                        default:
                            break;
                    }
                });
                
            }
        }
    });

    //Close the connection to the database
    con.end;
}

function Process_Inbound_Files() {
    //Create a SQL Select Statement
    var SQL_Select_Statement = "SELECT * FROM `Softpak_ChangeManager`.`processdocuments` WHERE `DocumentName` like '%Increate%' AND ID = '378'";

    //Connect to the database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
        } else {
            for (i=0; i<SQL_S1_rows.length; i++){
                var ProcessDocuments_ID             = SQL_S1_rows[i].ID;
                var ProcessDocuments_DocumentName   = SQL_S1_rows[i].DocumentName;
                var ProcessDocuments_FileExtension  = SQL_S1_rows[i].FileExtension;
                var ProcessDocuments_SentInAPIKey   = SQL_S1_rows[i].SentInAPIKey;
                var ProcessDocuments_Processed      = SQL_S1_rows[i].Processed;
                var ProcessDocuments_Errored        = SQL_S1_rows[i].Errored;
                var ProcessDocuments_ErroredAmount  = SQL_S1_rows[i].ErroredAmount;
                var ProcessDocuments_DocumentCLOB   = SQL_S1_rows[i].DocumentCLOB;
                var ProcessDocuments_CreatedBy      = SQL_S1_rows[i].CreatedBy;
                var ProcessDocuments_UpdateBy       = SQL_S1_rows[i].UpdateBy;
                var ProcessDocuments_CreateDateTime = SQL_S1_rows[i].CreateDateTime;
                var ProcessDocuments_UpdateDateTime = SQL_S1_rows[i].UpdateDateTime;

                APICustomerData(ProcessDocuments_SentInAPIKey, function(results){
                    var JSONObject_CustomerData = JSON.parse(results);

                    console.log(JSONObject_CustomerData);

                    var CustomerData_ID                 = JSONObject_CustomerData.ID;
                    var CustomerData_ExternalID         = JSONObject_CustomerData.ExternalID;
                    var CustomerData_CustomerShortName  = JSONObject_CustomerData.CustomerShortName;
                    var CustomerData_CustomerFullName   = JSONObject_CustomerData.CustomerFullName;
                    var CustomerData_Street             = JSONObject_CustomerData.Street;
                    var CustomerData_HouseNumber        = JSONObject_CustomerData.HouseNumber;
                    var CustomerData_Postalcode         = JSONObject_CustomerData.Postalcode;
                    var CustomerData_City               = JSONObject_CustomerData.City;
                    var CustomerData_ResponseMessageLan = JSONObject_CustomerData.ResponseMessageLan;
                    var CustomerData_ResponseMessageLoc = JSONObject_CustomerData.ResponseMessageLoc;
                    var CustomerData_CreateDateTime     = JSONObject_CustomerData.CreateDateTime;
                    var CustomerData_UpdateDateTime     = JSONObject_CustomerData.UpdateDateTime;
                    var CustomerData_CreateBy           = JSONObject_CustomerData.CreateBy;
                    var CustomerData_UpdateBy           = JSONObject_CustomerData.UpdateBy;

                    switch (CustomerData_ExternalID) {
                        case "1953":
                            Translate_Inbound_Create(ProcessDocuments_ID, CustomerData_ExternalID, ProcessDocuments_DocumentCLOB);
                            break;
                        default:
                            break;
                    }
                });
                
            }
        }
    });

    //Close the connection to the database
    con.end;
}

function Process_Outbound_Files() {
    //Create a SQL Select Statement
    var SQL_Select_Statement = "SELECT * FROM `Softpak_ChangeManager`.`processdocuments` WHERE `DocumentName` like '%Outcreate%' AND ID = '388'";

    //Connect to the database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
        } else {
            for (i=0; i<SQL_S1_rows.length; i++){
                var ProcessDocuments_ID             = SQL_S1_rows[i].ID;
                var ProcessDocuments_DocumentName   = SQL_S1_rows[i].DocumentName;
                var ProcessDocuments_FileExtension  = SQL_S1_rows[i].FileExtension;
                var ProcessDocuments_SentInAPIKey   = SQL_S1_rows[i].SentInAPIKey;
                var ProcessDocuments_Processed      = SQL_S1_rows[i].Processed;
                var ProcessDocuments_Errored        = SQL_S1_rows[i].Errored;
                var ProcessDocuments_ErroredAmount  = SQL_S1_rows[i].ErroredAmount;
                var ProcessDocuments_DocumentCLOB   = SQL_S1_rows[i].DocumentCLOB;
                var ProcessDocuments_CreatedBy      = SQL_S1_rows[i].CreatedBy;
                var ProcessDocuments_UpdateBy       = SQL_S1_rows[i].UpdateBy;
                var ProcessDocuments_CreateDateTime = SQL_S1_rows[i].CreateDateTime;
                var ProcessDocuments_UpdateDateTime = SQL_S1_rows[i].UpdateDateTime;

                APICustomerData(ProcessDocuments_SentInAPIKey, function(results){
                    var JSONObject_CustomerData = JSON.parse(results);

                    console.log(JSONObject_CustomerData);

                    var CustomerData_ID                 = JSONObject_CustomerData.ID;
                    var CustomerData_ExternalID         = JSONObject_CustomerData.ExternalID;
                    var CustomerData_CustomerShortName  = JSONObject_CustomerData.CustomerShortName;
                    var CustomerData_CustomerFullName   = JSONObject_CustomerData.CustomerFullName;
                    var CustomerData_Street             = JSONObject_CustomerData.Street;
                    var CustomerData_HouseNumber        = JSONObject_CustomerData.HouseNumber;
                    var CustomerData_Postalcode         = JSONObject_CustomerData.Postalcode;
                    var CustomerData_City               = JSONObject_CustomerData.City;
                    var CustomerData_ResponseMessageLan = JSONObject_CustomerData.ResponseMessageLan;
                    var CustomerData_ResponseMessageLoc = JSONObject_CustomerData.ResponseMessageLoc;
                    var CustomerData_CreateDateTime     = JSONObject_CustomerData.CreateDateTime;
                    var CustomerData_UpdateDateTime     = JSONObject_CustomerData.UpdateDateTime;
                    var CustomerData_CreateBy           = JSONObject_CustomerData.CreateBy;
                    var CustomerData_UpdateBy           = JSONObject_CustomerData.UpdateBy;

                    switch (CustomerData_ExternalID) {
                        case "1953":
                            Translate_Outbound_Create(ProcessDocuments_ID, CustomerData_ExternalID, ProcessDocuments_DocumentCLOB);
                            break;
                        default:
                            break;
                    }
                });
                
            }
        }
    });

    //Close the connection to the database
    con.end;
}

//InConfirmed Messages (XML)
//-------------------------------
function Process_Send_XML_InConfirmed_Files() {
    //Create the select statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`intakeorder` WHERE `OrderType` = "INCONFIRM" AND `ConfirmationSend` = "' + 0 + '" AND `ReponseMessageLanguage` = "XML"';

    //Connect to the SQL Database
    con.connect;

    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var IntakeOrder_ID                      = SQL_S1_rows[i].ID;
                    var IntakeOrder_OrderNR                 = SQL_S1_rows[i].OrderNR;
                    var IntakeOrder_CompanyCode             = SQL_S1_rows[i].CompanyCode;
                    var IntakeOrder_ContainerTypeCode       = SQL_S1_rows[i].ContainerTypeCode;
                    var IntakeOrder_ContainerNR             = SQL_S1_rows[i].ContainerNR;
                    var IntakeOrder_CustAddressNR           = SQL_S1_rows[i].CustAddressNR;
                    var IntakeOrder_CustRef1                = SQL_S1_rows[i].CustRef1;
                    var IntakeOrder_CustRef2                = SQL_S1_rows[i].CustRef2;
                    var IntakeOrder_CustRef3                = SQL_S1_rows[i].CustRef3;
                    var IntakeOrder_CustRef4                = SQL_S1_rows[i].CustRef4;
                    var IntakeOrder_CustRef5                = SQL_S1_rows[i].CustRef5;
                    var IntakeOrder_CustRef6                = SQL_S1_rows[i].CustRef6;
                    var IntakeOrder_CustRef7                = SQL_S1_rows[i].CustRef7;
                    var IntakeOrder_CustRef8                = SQL_S1_rows[i].CustRef8;
                    var IntakeOrder_DTCreate                = SQL_S1_rows[i].DTCreate;
                    var IntakeOrder_DTDischarge             = SQL_S1_rows[i].DTDischarge;
                    var IntakeOrder_DTUpdate                = SQL_S1_rows[i].DTUpdate;
                    var IntakeOrder_EDIOrd1                 = SQL_S1_rows[i].EDIOrd1;
                    var IntakeOrder_EDIOrd2                 = SQL_S1_rows[i].EDIOrd2;
                    var IntakeOrder_EDIOrd3                 = SQL_S1_rows[i].EDIOrd3;
                    var IntakeOrder_EDIOrd4                 = SQL_S1_rows[i].EDIOrd4;
                    var IntakeOrder_EDIOrd5                 = SQL_S1_rows[i].EDIOrd5;
                    var IntakeOrder_ExtEDIOrderText         = SQL_S1_rows[i].ExtEDILineText;
                    var IntakeOrder_LineCode                = SQL_S1_rows[i].LineCode;
                    var IntakeOrder_LocTerminal             = SQL_S1_rows[i].LocTerminal;
                    var IntakeOrder_ProjectNR               = SQL_S1_rows[i].ProjectNR;
                    var IntakeOrder_RecAddressNR            = SQL_S1_rows[i].RecAddressNR;
                    var IntakeOrder_SealNO                  = SQL_S1_rows[i].SealNO;
                    var IntakeOrder_StatusCode              = SQL_S1_rows[i].StatusCode;
                    var IntakeOrder_SupplierAddressNR       = SQL_S1_rows[i].SupplierAddressNR;
                    var IntakeOrder_TimCreate               = SQL_S1_rows[i].TimCreate;
                    var IntakeOrder_TimDischarge            = SQL_S1_rows[i].TimDischarge;
                    var IntakeOrder_TimUpdated              = SQL_S1_rows[i].TimUpdated;
                    var IntakeOrder_TransPorterAddressNR    = SQL_S1_rows[i].TransPorterAddressNR;
                    var IntakeOrder_TransPorterNR           = SQL_S1_rows[i].TransPorterNR;
                    var IntakeOrder_ConfirmationSend        = SQL_S1_rows[i].ConfirmationSend;
                    var IntakeOrder_OrderType               = SQL_S1_rows[i].OrderType;
                    var IntakeOrder_ResponseMessageLanguage = SQL_S1_rows[i].ResponseMessageLanguage;
                    var IntakeOrder_CreateDateTime          = SQL_S1_rows[i].CreateDateTime;
                    var IntakeOrder_UpdateDateTime          = SQL_S1_rows[i].UpdateDateTime;
                    var IntakeOrder_CreateBy                = SQL_S1_rows[i].CreateBy;
                    var IntakeOrder_UpdateBy                = SQL_S1_rows[i].UpdateBy;

                    RetrievTemplate(IntakeOrder_CustAddressNR, 1, "Order", function(Template_Order_Request_Result){
                        var Order_Template = Template_Order_Request_Result;
                        RetrievTemplate(IntakeOrder_CustAddressNR, 1, "OrderLine", function(Template_OrderLine_Request_Result){
                            var Orderline_Template = Template_OrderLine_Request_Result;
                            RetrievTemplate(IntakeOrder_CustAddressNR, 1, "PalletLine", function(Template_PalletLine_Request_Result){
                                var PalletLine_Template = Template_PalletLine_Request_Result;

                                if (Order_Template != "SQLError_NoDataFound" || Orderline_Template != "SQLError_NoDataFound" || PalletLine_Template != "SQLError_NoDataFound") {
                                    
                                    Process_XML_InConfirmed_Files_OrderLine(IntakeOrder_ID, IntakeOrder_OrderNR, IntakeOrder_OrderType, Orderline_Template, PalletLine_Template, function(ResponseMessage_Orderline){
                                    
                                        Order_Form = Order_Template;
                                
                                        Order_Form = Order_Form.replace("I_ID", IntakeOrder_ID);
                                        Order_Form = Order_Form.replace("I_ORDERNR", IntakeOrder_OrderNR);
                                        Order_Form = Order_Form.replace("I_COMPANYCODE", IntakeOrder_CompanyCode);
                                        Order_Form = Order_Form.replace("I_CONTAINERTYPECODE", IntakeOrder_ContainerTypeCode);
                                        Order_Form = Order_Form.replace("I_CONTAINERNR", IntakeOrder_ContainerNR);
                                        Order_Form = Order_Form.replace("I_CUSTADDRESSNR", IntakeOrder_CustAddressNR);
                                        Order_Form = Order_Form.replace("I_CUSTREF1", IntakeOrder_CustRef1);
                                        Order_Form = Order_Form.replace("I_CUSTREF2", IntakeOrder_CustRef2);
                                        Order_Form = Order_Form.replace("I_CUSTREF3", IntakeOrder_CustRef3);
                                        Order_Form = Order_Form.replace("I_CUSTREF4", IntakeOrder_CustRef4);
                                        Order_Form = Order_Form.replace("I_CUSTREF5", IntakeOrder_CustRef5);
                                        Order_Form = Order_Form.replace("I_CUSTREF6", IntakeOrder_CustRef6);
                                        Order_Form = Order_Form.replace("I_CUSTREF7", IntakeOrder_CustRef7);
                                        Order_Form = Order_Form.replace("I_CUSTREF8", IntakeOrder_CustRef8);
                                        Order_Form = Order_Form.replace("I_DTCREATE", IntakeOrder_DTCreate);
                                        Order_Form = Order_Form.replace("I_DTDISCHARGE", IntakeOrder_DTDischarge);
                                        Order_Form = Order_Form.replace("I_DTUPDATE", IntakeOrder_DTUpdate);
                                        Order_Form = Order_Form.replace("I_EDIORD1", IntakeOrder_EDIOrd1);
                                        Order_Form = Order_Form.replace("I_EDIORD2", IntakeOrder_EDIOrd2);
                                        Order_Form = Order_Form.replace("I_EDIORD3", IntakeOrder_EDIOrd3);
                                        Order_Form = Order_Form.replace("I_EDIORD4", IntakeOrder_EDIOrd4);
                                        Order_Form = Order_Form.replace("I_EDIORD5", IntakeOrder_EDIOrd5);
                                        Order_Form = Order_Form.replace("I_EXTEDIORDERTEXT", IntakeOrder_ExtEDIOrderText);
                                        Order_Form = Order_Form.replace("I_LINECODE", IntakeOrder_LineCode);
                                        Order_Form = Order_Form.replace("I_LOCTERMINAL", IntakeOrder_LocTerminal);
                                        Order_Form = Order_Form.replace("I_PROJECTNR", IntakeOrder_ProjectNR);
                                        Order_Form = Order_Form.replace("I_RECADDRESSNR", IntakeOrder_RecAddressNR);
                                        Order_Form = Order_Form.replace("I_SEALNO", IntakeOrder_SealNO);
                                        Order_Form = Order_Form.replace("I_STATUSCODE", IntakeOrder_StatusCode);
                                        Order_Form = Order_Form.replace("I_SUPPLIERADDRESSNR", IntakeOrder_SupplierAddressNR);
                                        Order_Form = Order_Form.replace("I_TIMCREATE", IntakeOrder_TimCreate);
                                        Order_Form = Order_Form.replace("I_TIMDISCHARGE", IntakeOrder_TimDischarge);
                                        Order_Form = Order_Form.replace("I_TIMUPDATED", IntakeOrder_TimUpdated);
                                        Order_Form = Order_Form.replace("I_TRANSPORTERADDRESSNR", IntakeOrder_TransPorterAddressNR);
                                        Order_Form = Order_Form.replace("I_TRANSPORTERNR", IntakeOrder_TransPorterNR);
                                        Order_Form = Order_Form.replace("I_CONFIRMATIONSEND", IntakeOrder_ConfirmationSend);
                                        Order_Form = Order_Form.replace("I_ORDERTYPE", IntakeOrder_OrderType);
                                        Order_Form = Order_Form.replace("I_RESPONSEMESSAGELANGUAGE", IntakeOrder_ResponseMessageLanguage);
                                        Order_Form = Order_Form.replace("I_CREATEDATETIME", IntakeOrder_CreateDateTime);
                                        Order_Form = Order_Form.replace("I_UPDATEDATETIME", IntakeOrder_UpdateDateTime);
                                        Order_Form = Order_Form.replace("I_CREATEBY", IntakeOrder_CreateBy);
                                        Order_Form = Order_Form.replace("I_UPDATEBY", IntakeOrder_UpdateBy);
                                        Order_Form = Order_Form.replace("I_ORDERLINES", ResponseMessage_Orderline);

                                        console.log("Order file output:");
                                        console.log("-----------------------------------------------------");
                                        console.log(Order_Form);

                                        Process_Send_File_To_Customer(IntakeOrder_OrderNR, "INCONFIRM", Order_Form, IntakeOrder_CustAddressNR);
                                    });
                                }
                            });
                        });
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f APIKeyCheck - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_XML_InConfirmed_Files_OrderLine(IntakeOrder_ID, IntakeOrder_OrderNR, IntakeOrder_OrderType, Orderline_Template, PalletLine_Template, Order_Callback) {               
    //Create the SQL Select Statement for the orderlines
    var SQL_Select_S2_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`intakeorderline` WHERE `OrderID` = "' + IntakeOrder_ID + '" AND `OrderType` = "' + IntakeOrder_OrderType + '" AND `OrderNR` = "' + IntakeOrder_OrderNR + '"';

    console.log(SQL_Select_S2_Statement);

    con.query(SQL_Select_S2_Statement, async function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
        //Check if there are any error messages
        if (SQL_S2_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S2 Error: " + SQL_S2_err);
        } else {
            try {
                var ResponseMessage_Orderline = '';

                for (var e = 0; e < SQL_S2_rows.length; e++) {

                    var IntakeOrderLine_ID                      = SQL_S2_rows[e].ID;
                    var IntakeOrderLine_OrderID                 = SQL_S2_rows[e].OrderID;
                    var IntakeOrderLine_OrderType               = SQL_S2_rows[e].OrderType;
                    var IntakeOrderLine_OrderNR                 = SQL_S2_rows[e].OrderNR;
                    var IntakeOrderLine_LineNR                  = SQL_S2_rows[e].LineNR;
                    var IntakeOrderLine_Carrier                 = SQL_S2_rows[e].Carrier;
                    var IntakeOrderLine_CarrierCode             = SQL_S2_rows[e].CarrierCode;
                    var IntakeOrderLine_CompanyCode             = SQL_S2_rows[e].CompanyCode;
                    var IntakeOrderLine_ContainerTypeCode       = SQL_S2_rows[e].ContainerTypeCode;
                    var IntakeOrderLine_ContainerNR             = SQL_S2_rows[e].ContainerNR;
                    var IntakeOrderLine_CustAddressNR           = SQL_S2_rows[e].CustAddressNR;
                    var IntakeOrderLine_CustProductCode         = SQL_S2_rows[e].CustProductCode;
                    var IntakeOrderLine_CustRef1                = SQL_S2_rows[e].CustRef1;
                    var IntakeOrderLine_CustRef2                = SQL_S2_rows[e].CustRef2;
                    var IntakeOrderLine_CustRef3                = SQL_S2_rows[e].CustRef3;
                    var IntakeOrderLine_DamageDes               = SQL_S2_rows[e].DamageDes;
                    var IntakeOrderLine_DamageCode              = SQL_S2_rows[e].DamageCode;
                    var IntakeOrderLine_EDILine1                = SQL_S2_rows[e].EDILine1;
                    var IntakeOrderLine_EDILine2                = SQL_S2_rows[e].EDILine2;
                    var IntakeOrderLine_EDILine3                = SQL_S2_rows[e].EDILine3;
                    var IntakeOrderLine_EDILine4                = SQL_S2_rows[e].EDILine4;
                    var IntakeOrderLine_EDILine5                = SQL_S2_rows[e].EDILine5;
                    var IntakeOrderLine_ExtEDILineText          = SQL_S2_rows[e].ExtEDILineText;
                    var IntakeOrderLine_GrossWeight             = SQL_S2_rows[e].GrossWeight;
                    var IntakeOrderLine_GrossWeightCode         = SQL_S2_rows[e].GrossWeightCode;
                    var IntakeOrderLine_NettWeight              = SQL_S2_rows[e].NettWeight;
                    var IntakeOrderLine_NettWeightCode          = SQL_S2_rows[e].NettWeightCode;
                    var IntakeOrderLine_OuterPCK                = SQL_S2_rows[e].OuterPCK;
                    var IntakeOrderLine_OuterPCKCode            = SQL_S2_rows[e].OuterPCKCode;
                    var IntakeOrderLine_PackTypeCode            = SQL_S2_rows[e].PackTypeCode;
                    var IntakeOrderLine_ProdRef1                = SQL_S2_rows[e].ProdRef1;
                    var IntakeOrderLine_ProdRef2                = SQL_S2_rows[e].ProdRef2;
                    var IntakeOrderLine_ProdRef3                = SQL_S2_rows[e].ProdRef3;
                    var IntakeOrderLine_ProdRef4                = SQL_S2_rows[e].ProdRef4;
                    var IntakeOrderLine_ProdRef5                = SQL_S2_rows[e].ProdRef5;
                    var IntakeOrderLine_ProductID               = SQL_S2_rows[e].ProductID;
                    var IntakeOrderLine_ProductGroupCode        = SQL_S2_rows[e].ProductGroupCode;
                    var IntakeOrderLine_QtyControlCode          = SQL_S2_rows[e].QtyControlCode;
                    var IntakeOrderLine_RecAddressNR            = SQL_S2_rows[e].RecAddressNR;
                    var IntakeOrderLine_Remarks                 = SQL_S2_rows[e].Remarks;
                    var IntakeOrderLine_StockRefNR              = SQL_S2_rows[e].StockRefNR;
                    var IntakeOrderLine_SupplierAddressNR       = SQL_S2_rows[e].SupplierAddressNR;
                    var IntakeOrderLine_TermPlace               = SQL_S2_rows[e].TermPlace;
                    var IntakeOrderLine_TermCode                = SQL_S2_rows[e].TermCode;
                    var IntakeOrderLine_TransActionCustomerRef  = SQL_S2_rows[e].TransActionCustomerRef;
                    var IntakeOrderLine_WareHouseRef            = SQL_S2_rows[e].WareHouseRef;
                    var IntakeOrderLine_CreateDateTime          = SQL_S2_rows[e].CreateDateTime;
                    var IntakeOrderLine_UpdateDateTime          = SQL_S2_rows[e].UpdateDateTime;
                    var IntakeOrderLine_CreateBy                = SQL_S2_rows[e].CreateBy;
                    var IntakeOrderLine_UpdateBy                = SQL_S2_rows[e].UpdateBy;

                    // var Date_DeliveryDate       = new Date();
                    // var Year_DeliveryDate       = Date_DeliveryDate.getFullYear();
                    // var Month_DeliveryDate      = Date_DeliveryDate.getMonth() + 1;
                    // var Day_DeliveryDate        = Date_DeliveryDate.getDay();
                    // var STR_Year_DeliveryDate   = Year_DeliveryDate.toString();
                    // var STR_Month_DeliveryDate  = Month_DeliveryDate.toString();
                    // var STR_Day_DeliveryDate    = Day_DeliveryDate.toString();

                    // var OuttakeOrderLine_DeliveryDate_YYYYMMDD = STR_Year_DeliveryDate + STR_Month_DeliveryDate + STR_Day_DeliveryDate;

                    // console.log(Orderline_Template);

                    await Process_XML_InConfirmed_Files_PalletLine(IntakeOrder_ID, IntakeOrder_OrderType, IntakeOrderLine_ID, PalletLine_Template, function(ResponseMessage_PalletLine){
                        var OrderLine_Form = Orderline_Template;

                        // console.log(OrderLine_Form);

                        OrderLine_Form = OrderLine_Form.replace("I_ID", IntakeOrderLine_ID);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERID", IntakeOrderLine_OrderID);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERTYPE", IntakeOrderLine_OrderType);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERNR", IntakeOrderLine_OrderNR);
                        OrderLine_Form = OrderLine_Form.replace("I_LINENR", IntakeOrderLine_LineNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CARRIER", IntakeOrderLine_Carrier);
                        OrderLine_Form = OrderLine_Form.replace("I_CARRIERCODE", IntakeOrderLine_CarrierCode);
                        OrderLine_Form = OrderLine_Form.replace("I_COMPANYCODE", IntakeOrderLine_CompanyCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CONTAINERTYPECODE", IntakeOrderLine_ContainerTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CONTAINERNR", IntakeOrderLine_ContainerNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTADDRESSNR", IntakeOrderLine_CustAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTPRODUCTCODE", IntakeOrderLine_CustProductCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF1", IntakeOrderLine_CustRef1);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF2", IntakeOrderLine_CustRef2);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF3", IntakeOrderLine_CustRef3);
                        OrderLine_Form = OrderLine_Form.replace("I_DAMAGEDES", IntakeOrderLine_DamageDes);
                        OrderLine_Form = OrderLine_Form.replace("I_DAMAGECODE", IntakeOrderLine_DamageCode);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE1", IntakeOrderLine_EDILine1);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE2", IntakeOrderLine_EDILine2);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE3", IntakeOrderLine_EDILine3);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE4", IntakeOrderLine_EDILine4);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE5", IntakeOrderLine_EDILine5);
                        OrderLine_Form = OrderLine_Form.replace("I_EXTEDILINETEXT", IntakeOrderLine_ExtEDILineText);
                        OrderLine_Form = OrderLine_Form.replace("I_GROSSWEIGHT", IntakeOrderLine_GrossWeight);
                        OrderLine_Form = OrderLine_Form.replace("I_GROSSWEIGHTCODE", IntakeOrderLine_GrossWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("I_NETTWEIGHT", IntakeOrderLine_NettWeight);
                        OrderLine_Form = OrderLine_Form.replace("I_NETTWEIGHTCODE", IntakeOrderLine_NettWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("I_OUTERPCK", IntakeOrderLine_OuterPCK);
                        OrderLine_Form = OrderLine_Form.replace("I_OUTERPCKCODE", IntakeOrderLine_OuterPCKCode);
                        OrderLine_Form = OrderLine_Form.replace("I_PACKTYPECODE", IntakeOrderLine_PackTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF1", IntakeOrderLine_ProdRef1);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF2", IntakeOrderLine_ProdRef2);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF3", IntakeOrderLine_ProdRef3);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF4", IntakeOrderLine_ProdRef4);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF5", IntakeOrderLine_ProdRef5);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODUCTID", IntakeOrderLine_ProductID);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODUCTGROUPCODE", IntakeOrderLine_ProductGroupCode);
                        OrderLine_Form = OrderLine_Form.replace("I_QTYCONTROLCODE", IntakeOrderLine_QtyControlCode);
                        OrderLine_Form = OrderLine_Form.replace("I_RECADDRESSNR", IntakeOrderLine_RecAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_REMARKS", IntakeOrderLine_Remarks);
                        OrderLine_Form = OrderLine_Form.replace("I_STOCKREFNR", IntakeOrderLine_StockRefNR);
                        OrderLine_Form = OrderLine_Form.replace("I_SUPPLIERADDRESSNR", IntakeOrderLine_SupplierAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_TERMPLACE", IntakeOrderLine_TermPlace);
                        OrderLine_Form = OrderLine_Form.replace("I_TERMCODE", IntakeOrderLine_TermCode);
                        OrderLine_Form = OrderLine_Form.replace("I_TRANSACTIONCUSTOMERREF", IntakeOrderLine_TransActionCustomerRef);
                        OrderLine_Form = OrderLine_Form.replace("I_WAREHOUSEREF", IntakeOrderLine_WareHouseRef);
                        OrderLine_Form = OrderLine_Form.replace("I_CREATEDATETIME", IntakeOrderLine_CreateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("I_UPDATEDATETIME", IntakeOrderLine_UpdateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("I_CREATEBY", IntakeOrderLine_CreateBy);
                        OrderLine_Form = OrderLine_Form.replace("I_UPDATEBY", IntakeOrderLine_UpdateBy);
                        OrderLine_Form = OrderLine_Form.replace("I_PALLETLINE", ResponseMessage_PalletLine);

                        console.log(OrderLine_Form);
                                               
                        ResponseMessage_Orderline = ResponseMessage_Orderline + OrderLine_Form;

                        if(e == SQL_S2_rows.length) {

                            Order_Callback(ResponseMessage_Orderline);
                        }
                    });
                }

            } catch (TryCatchError_S2) {
                console.error("f APIKeyCheck - TryCatchError_S2: " + TryCatchError_S2);
            }
        }
    });
}

function Process_XML_InConfirmed_Files_PalletLine(IntakeOrder_ID, IntakeOrder_OrderType, IntakeOrderLine_ID, PalletLine_Template, OrderLine_Callback) {
    //Create a SQL Select statement for the Palletlines
    var SQL_Select_S3_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`palletline` WHERE `OrderID` = "' + IntakeOrder_ID + '" AND `OrderLineID` = "' + IntakeOrderLine_ID + '" AND `OrderType` = "' + IntakeOrder_OrderType + '"';

    con.query(SQL_Select_S3_Statement, function (SQL_S3_err, SQL_S3_rows, SQL_S3_fields) {
        //Check if there are any error messages
        if (SQL_S3_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S3 Error: " + SQL_S3_err);
        } else {
            try {
                ResponseMessage_PalletLine = '';

                for (var o = 0; o < SQL_S3_rows.length; o++) {
                    var IntakePalletLine_ID                 = SQL_S3_rows[o].ID;
                    var IntakePalletLine_OrderID            = SQL_S3_rows[o].OrderID;
                    var IntakePalletLine_OrderLineID        = SQL_S3_rows[o].OrderLineID;
                    var IntakePalletLine_OrderType          = SQL_S3_rows[o].OrderType;
                    var IntakePalletLine_InboundOrOutbound  = SQL_S3_rows[o].InboundOrOutbound;
                    var IntakePalletLine_StockNr            = SQL_S3_rows[o].StockNr;
                    var IntakePalletLine_BarcodeEXP         = SQL_S3_rows[o].BarcodeEXP;
                    var IntakePalletLine_BarcodeID          = SQL_S3_rows[o].BarcodeID;
                    var IntakePalletLine_BarcodeIDInternal  = SQL_S3_rows[o].BarcodeIDInternal;
                    var IntakePalletLine_CalcRef1           = SQL_S3_rows[o].CalcRef1;
                    var IntakePalletLine_CalcRef2           = SQL_S3_rows[o].CalcRef2;
                    var IntakePalletLine_CalcRef3           = SQL_S3_rows[o].CalcRef3;
                    var IntakePalletLine_Carrier            = SQL_S3_rows[o].Carrier;
                    var IntakePalletLine_CarrierCode        = SQL_S3_rows[o].CarrierCode;
                    var IntakePalletLine_CompanyCode        = SQL_S3_rows[o].CompanyCode;
                    var IntakePalletLine_DamageNR           = SQL_S3_rows[o].DamageNR;
                    var IntakePalletLine_DT_Create          = SQL_S3_rows[o].DT_Create;
                    var IntakePalletLine_DT_Mutation        = SQL_S3_rows[o].DT_Mutation;
                    var IntakePalletLine_EDIStock1          = SQL_S3_rows[o].EDIStock1;
                    var IntakePalletLine_EDIStock2          = SQL_S3_rows[o].EDIStock2;
                    var IntakePalletLine_EDIStock3          = SQL_S3_rows[o].EDIStock3;
                    var IntakePalletLine_EDIStock4          = SQL_S3_rows[o].EDIStock4;
                    var IntakePalletLine_EDIStock5          = SQL_S3_rows[o].EDIStock5;
                    var IntakePalletLine_GrossWeight        = SQL_S3_rows[o].GrossWeight;
                    var IntakePalletLine_GrossWeightCode    = SQL_S3_rows[o].GrossWeightCode;
                    var IntakePalletLine_InLineNR           = SQL_S3_rows[o].InLineNR;
                    var IntakePalletLine_InOrderNR          = SQL_S3_rows[o].InOrderNR;
                    var IntakePalletLine_IndActive          = SQL_S3_rows[o].IndActive;
                    var IntakePalletLine_IndBlocked         = SQL_S3_rows[o].IndBlocked;
                    var IntakePalletLine_NettWeight         = SQL_S3_rows[o].NettWeight;
                    var IntakePalletLine_NettWeightCode     = SQL_S3_rows[o].NettWeightCode;
                    var IntakePalletLine_OuterPCK           = SQL_S3_rows[o].OuterPCK;
                    var IntakePalletLine_OuterPCKCode       = SQL_S3_rows[o].OuterPCKCode;
                    var IntakePalletLine_PackTypeCode       = SQL_S3_rows[o].PackTypeCode;
                    var IntakePalletLine_ProdRef1           = SQL_S3_rows[o].ProdRef1;
                    var IntakePalletLine_ProdRef2           = SQL_S3_rows[o].ProdRef2;
                    var IntakePalletLine_ProdRef3           = SQL_S3_rows[o].ProdRef3;
                    var IntakePalletLine_ProdRef4           = SQL_S3_rows[o].ProdRef4;
                    var IntakePalletLine_ProdRef5           = SQL_S3_rows[o].ProdRef5;
                    var IntakePalletLine_ProductID          = SQL_S3_rows[o].ProductID;
                    var IntakePalletLine_ProductGroupCode   = SQL_S3_rows[o].ProductGroupCode;
                    var IntakePalletLine_StockRefNR         = SQL_S3_rows[o].StockRefNR;
                    var IntakePalletLine_SupplierAdressNR   = SQL_S3_rows[o].SupplierAdressNR;
                    var IntakePalletLine_TimCreate          = SQL_S3_rows[o].TimCreate;
                    var IntakePalletLine_WareHouseRef       = SQL_S3_rows[o].WareHouseRef;
                    var IntakePalletLine_CreateDateTime     = SQL_S3_rows[o].CreateDateTime;
                    var IntakePalletLine_UpdateDateTime     = SQL_S3_rows[o].UpdateDateTime;
                    var IntakePalletLine_CreateBy           = SQL_S3_rows[o].CreateBy;
                    var IntakePalletLine_UpdateBy           = SQL_S3_rows[o].UpdateBy;

                    var PalletLine_Form = PalletLine_Template;

                    PalletLine_Form = PalletLine_Form.replace("I_ID", IntakePalletLine_ID);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERID", IntakePalletLine_OrderID);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERLINEID", IntakePalletLine_OrderLineID);
                    PalletLine_Form = PalletLine_Form.replace("I_INBOUNDOROUTBOUND", IntakePalletLine_InboundOrOutbound);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERTYPE", IntakePalletLine_OrderType);
                    PalletLine_Form = PalletLine_Form.replace("I_STOCKNR", IntakePalletLine_StockNr);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEEXP", IntakePalletLine_BarcodeEXP);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEID", IntakePalletLine_BarcodeID);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEIDINTERNAL", IntakePalletLine_BarcodeIDInternal);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF1", IntakePalletLine_CalcRef1);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF2", IntakePalletLine_CalcRef2);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF3", IntakePalletLine_CalcRef3);
                    PalletLine_Form = PalletLine_Form.replace("I_CARRIER", IntakePalletLine_Carrier);
                    PalletLine_Form = PalletLine_Form.replace("I_CARRIERCODE", IntakePalletLine_CarrierCode);
                    PalletLine_Form = PalletLine_Form.replace("I_COMPANYCODE", IntakePalletLine_CompanyCode);
                    PalletLine_Form = PalletLine_Form.replace("I_DAMAGENR", IntakePalletLine_DamageNR);
                    PalletLine_Form = PalletLine_Form.replace("I_DT_CREATE", IntakePalletLine_DT_Create);
                    PalletLine_Form = PalletLine_Form.replace("I_DT_MUTATION", IntakePalletLine_DT_Mutation);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK1", IntakePalletLine_EDIStock1);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK2", IntakePalletLine_EDIStock2);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK3", IntakePalletLine_EDIStock3);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK4", IntakePalletLine_EDIStock4);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK5", IntakePalletLine_EDIStock5);
                    PalletLine_Form = PalletLine_Form.replace("I_GROSSWEIGHT", IntakePalletLine_GrossWeight);
                    PalletLine_Form = PalletLine_Form.replace("I_GROSSWEIGHTCODE", IntakePalletLine_GrossWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("I_INLINENR", IntakePalletLine_InLineNR);
                    PalletLine_Form = PalletLine_Form.replace("I_INORDERNR", IntakePalletLine_InOrderNR);
                    PalletLine_Form = PalletLine_Form.replace("I_INDACTIVE", IntakePalletLine_IndActive);
                    PalletLine_Form = PalletLine_Form.replace("I_INDBLOCKED", IntakePalletLine_IndBlocked);
                    PalletLine_Form = PalletLine_Form.replace("I_NETTWEIGHT", IntakePalletLine_NettWeight);
                    PalletLine_Form = PalletLine_Form.replace("I_NETTWEIGHTCODE", IntakePalletLine_NettWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("I_OUTERPCK", IntakePalletLine_OuterPCK);
                    PalletLine_Form = PalletLine_Form.replace("I_OUTERPCKCODE", IntakePalletLine_OuterPCKCode);
                    PalletLine_Form = PalletLine_Form.replace("I_PACKTYPECODE", IntakePalletLine_PackTypeCode);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF1", IntakePalletLine_ProdRef1);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF2", IntakePalletLine_ProdRef2);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF3", IntakePalletLine_ProdRef3);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF4", IntakePalletLine_ProdRef4);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF5", IntakePalletLine_ProdRef5);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODUCTID", IntakePalletLine_ProductID);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODUCTGROUPCODE", IntakePalletLine_ProductGroupCode);
                    PalletLine_Form = PalletLine_Form.replace("I_STOCKREFNR", IntakePalletLine_StockRefNR);
                    PalletLine_Form = PalletLine_Form.replace("I_SUPPLIERADDRESSNR", IntakePalletLine_SupplierAdressNR);
                    PalletLine_Form = PalletLine_Form.replace("I_TIMCREATE", IntakePalletLine_TimCreate);
                    PalletLine_Form = PalletLine_Form.replace("I_WAREHOUSEREF", IntakePalletLine_WareHouseRef);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_CREATEDATETIME", IntakePalletLine_CreateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_UPDATEDATETIME", IntakePalletLine_UpdateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_CREATEBY", IntakePalletLine_CreateBy);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_UPDATEBY", IntakePalletLine_UpdateBy);

                    ResponseMessage_PalletLine = ResponseMessage_PalletLine + PalletLine_Form;
                }

                OrderLine_Callback(ResponseMessage_PalletLine);

            } catch (TryCatchError_S3) {
                console.error("f APIKeyCheck - TryCatchError_S3: " + TryCatchError_S3);
            }
        }
    });
}

function Process_Send_XML_OutConfirmed_Files() {
    //Create the select statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorder` WHERE `OrderType` = "OUTCONFIRM" AND `ConfirmationSend` = "' + 0 + '" AND `ReponseMessageLanguage` = "XML"';

    //Connect to the SQL Database
    con.connect;

    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var OuttakeOrder_ID                     = SQL_S1_rows[i].ID;
                    var OuttakeOrder_OrderNR                = SQL_S1_rows[i].OrderNR;
                    var OuttakeOrder_CompanyCode            = SQL_S1_rows[i].CompanyCode;
                    var OuttakeOrder_ContainerTypeCode      = SQL_S1_rows[i].ContainerTypeCode;
                    var OuttakeOrder_ContainerNR            = SQL_S1_rows[i].ContainerNR;
                    var OuttakeOrder_CustRef1               = SQL_S1_rows[i].CustRef1;
                    var OuttakeOrder_CustRef2               = SQL_S1_rows[i].CustRef2;
                    var OuttakeOrder_CustRef3               = SQL_S1_rows[i].CustRef3;
                    var OuttakeOrder_CustRef4               = SQL_S1_rows[i].CustRef4;
                    var OuttakeOrder_CustRef5               = SQL_S1_rows[i].CustRef5;
                    var OuttakeOrder_CustRef6               = SQL_S1_rows[i].CustRef6;
                    var OuttakeOrder_CustRef7               = SQL_S1_rows[i].CustRef7;
                    var OuttakeOrder_CustRef8               = SQL_S1_rows[i].CustRef8;
                    var OuttakeOrder_DeliveryAddressNR      = SQL_S1_rows[i].DeliveryAddressNR;
                    var OuttakeOrder_DeliveryName           = SQL_S1_rows[i].DeliveryName;
                    var OuttakeOrder_DeliveryZipCode        = SQL_S1_rows[i].DeliveryZipCode;
                    var OuttakeOrder_DestinationCountryCode = SQL_S1_rows[i].DestinationCountryCode;
                    var OuttakeOrder_DTCreate               = SQL_S1_rows[i].DTCreate;
                    var OuttakeOrder_DTDelivery             = SQL_S1_rows[i].DTDelivery;
                    var OuttakeOrder_DTDeliveryTo           = SQL_S1_rows[i].DTDeliveryTo;
                    var OuttakeOrder_TDLoading              = SQL_S1_rows[i].TDLoading;
                    var OuttakeOrder_TDUpdate               = SQL_S1_rows[i].TDUpdate;
                    var OuttakeOrder_EDIOrd1                = SQL_S1_rows[i].EDIOrd1;
                    var OuttakeOrder_EDIOrd2                = SQL_S1_rows[i].EDIOrd2;
                    var OuttakeOrder_EDIOrd3                = SQL_S1_rows[i].EDIOrd3;
                    var OuttakeOrder_EDIOrd4                = SQL_S1_rows[i].EDIOrd4;
                    var OuttakeOrder_EDIOrd5                = SQL_S1_rows[i].EDIOrd5;
                    var OuttakeOrder_ExtEDIOrderText        = SQL_S1_rows[i].ExtEDIOrderText;
                    var OuttakeOrder_LineCode               = SQL_S1_rows[i].LineCode;
                    var OuttakeOrder_LocTerminal            = SQL_S1_rows[i].LocTerminal;
                    var OuttakeOrder_ProjectNR              = SQL_S1_rows[i].ProjectNR;
                    var OuttakeOrder_RecAddressNR           = SQL_S1_rows[i].RecAddressNR;
                    var OuttakeOrder_SealNO                 = SQL_S1_rows[i].SealNO;
                    var OuttakeOrder_StatusCode             = SQL_S1_rows[i].StatusCode;
                    var OuttakeOrder_TimCreate              = SQL_S1_rows[i].TimCreate;
                    var OuttakeOrder_TimDelivery            = SQL_S1_rows[i].TimDelivery;
                    var OuttakeOrder_TimDeliveryTo          = SQL_S1_rows[i].TimDeliveryTo;
                    var OuttakeOrder_TimLoading             = SQL_S1_rows[i].TimLoading;
                    var OuttakeOrder_TimUpdated             = SQL_S1_rows[i].TimUpdated;
                    var OuttakeOrder_TransPorterAddressNR   = SQL_S1_rows[i].TransPorterAddressNR;
                    var OuttakeOrder_TransPortNR            = SQL_S1_rows[i].TransPortNR;
                    var OuttakeOrder_TransPortUnitCode      = SQL_S1_rows[i].TransPortUnitCode;
                    var OuttakeOrder_ConfirmationSend       = SQL_S1_rows[i].ConfirmationSend;
                    var OuttakeOrder_OrderType              = SQL_S1_rows[i].OrderType;
                    var OuttakeOrder_ReponseMessageLanguage = SQL_S1_rows[i].ReponseMessageLanguage;
                    var OuttakeOrder_CreateDateTime         = SQL_S1_rows[i].CreateDateTime;
                    var OuttakeOrder_UpdateDateTime         = SQL_S1_rows[i].UpdateDateTime;
                    var OuttakeOrder_CreateBy               = SQL_S1_rows[i].CreateBy;
                    var OuttakeOrder_UpdateBy               = SQL_S1_rows[i].UpdateBy;

                    RetrievTemplate(OuttakeOrder_RecAddressNR, 0, "Order", function(Template_Order_Request_Result){
                        var Order_Template = Template_Order_Request_Result;
                        RetrievTemplate(OuttakeOrder_RecAddressNR, 0, "OrderLine", function(Template_OrderLine_Request_Result){
                            var Orderline_Template = Template_OrderLine_Request_Result;
                            RetrievTemplate(OuttakeOrder_RecAddressNR, 0, "PalletLine", function(Template_PalletLine_Request_Result){
                                var PalletLine_Template = Template_PalletLine_Request_Result;

                                if (Order_Template != "SQLError_NoDataFound" || Orderline_Template != "SQLError_NoDataFound" || PalletLine_Template != "SQLError_NoDataFound") {

                                    Process_XML_OutConfirmed_Files_OrderLine(OuttakeOrder_ID, OuttakeOrder_OrderNR, OuttakeOrder_OrderType, Orderline_Template, PalletLine_Template, OuttakeOrder_TDLoading, function(ResponseMessage_Orderline){
                                        Order_Form = Order_Template;
                                
                                        Order_Form = Order_Form.replace("O_ID", OuttakeOrder_ID);
                                        Order_Form = Order_Form.replace("O_ORDERNR", OuttakeOrder_OrderNR);
                                        Order_Form = Order_Form.replace("O_COMPANYCODE", OuttakeOrder_CompanyCode);
                                        Order_Form = Order_Form.replace("O_CONTAINERTYPECODE", OuttakeOrder_ContainerTypeCode);
                                        Order_Form = Order_Form.replace("O_CONTAINERNR", OuttakeOrder_ContainerNR);
                                        Order_Form = Order_Form.replace("O_CUSTREF1", OuttakeOrder_CustRef1);
                                        Order_Form = Order_Form.replace("O_CUSTREF2", OuttakeOrder_CustRef2);
                                        Order_Form = Order_Form.replace("O_CUSTREF3", OuttakeOrder_CustRef3);
                                        Order_Form = Order_Form.replace("O_CUSTREF4", OuttakeOrder_CustRef4);
                                        Order_Form = Order_Form.replace("O_CUSTREF5", OuttakeOrder_CustRef5);
                                        Order_Form = Order_Form.replace("O_CUSTREF6", OuttakeOrder_CustRef6);
                                        Order_Form = Order_Form.replace("O_CUSTREF7", OuttakeOrder_CustRef7);
                                        Order_Form = Order_Form.replace("O_CUSTREF8", OuttakeOrder_CustRef8);
                                        Order_Form = Order_Form.replace("O_DELIVERYADDRESSNR", OuttakeOrder_DeliveryAddressNR);
                                        Order_Form = Order_Form.replace("O_DELIVERYNAME", OuttakeOrder_DeliveryName);
                                        Order_Form = Order_Form.replace("O_DELIVERYZIPCODE", OuttakeOrder_DeliveryZipCode);
                                        Order_Form = Order_Form.replace("O_DESTINATIONCOUNTRYCODE", OuttakeOrder_DestinationCountryCode);
                                        Order_Form = Order_Form.replace("O_DTCREATE", OuttakeOrder_DTCreate);
                                        Order_Form = Order_Form.replace("O_DTDELIVERY", OuttakeOrder_DTDelivery);
                                        Order_Form = Order_Form.replace("O_DTDELIVERYTO", OuttakeOrder_DTDeliveryTo);
                                        Order_Form = Order_Form.replace("O_TDLOADING", OuttakeOrder_TDLoading);
                                        Order_Form = Order_Form.replace("O_TDUPDATE", OuttakeOrder_TDUpdate);
                                        Order_Form = Order_Form.replace("O_EDIORD1", OuttakeOrder_EDIOrd1);
                                        Order_Form = Order_Form.replace("O_EDIORD2", OuttakeOrder_EDIOrd2);
                                        Order_Form = Order_Form.replace("O_EDIORD3", OuttakeOrder_EDIOrd3);
                                        Order_Form = Order_Form.replace("O_EDIORD4", OuttakeOrder_EDIOrd4);
                                        Order_Form = Order_Form.replace("O_EDIORD5", OuttakeOrder_EDIOrd5);
                                        Order_Form = Order_Form.replace("O_EXTEDIORDERTEXT", OuttakeOrder_ExtEDIOrderText);
                                        Order_Form = Order_Form.replace("O_LINECODE", OuttakeOrder_LineCode);
                                        Order_Form = Order_Form.replace("O_LOCTERMINAL", OuttakeOrder_LocTerminal);
                                        Order_Form = Order_Form.replace("O_PROJECTNR", OuttakeOrder_ProjectNR);
                                        Order_Form = Order_Form.replace("O_RECADDRESSNR", OuttakeOrder_RecAddressNR);
                                        Order_Form = Order_Form.replace("O_SEALNO", OuttakeOrder_SealNO);
                                        Order_Form = Order_Form.replace("O_STATUSCODE", OuttakeOrder_StatusCode);
                                        Order_Form = Order_Form.replace("O_TIMCREATE", OuttakeOrder_TimCreate);
                                        Order_Form = Order_Form.replace("O_TIMDELIVERY", OuttakeOrder_TimDelivery);
                                        Order_Form = Order_Form.replace("O_TIMDELIVERYTO", OuttakeOrder_TimDeliveryTo);
                                        Order_Form = Order_Form.replace("O_TIMLOADING", OuttakeOrder_TimLoading);
                                        Order_Form = Order_Form.replace("O_TIMUPDATED", OuttakeOrder_TimUpdated);
                                        Order_Form = Order_Form.replace("O_TRANSPORTADDRESSNR", OuttakeOrder_TransPorterAddressNR);
                                        Order_Form = Order_Form.replace("O_TRANSPORTNR", OuttakeOrder_TransPortNR);
                                        Order_Form = Order_Form.replace("O_TRANSPORTUNITCODE", OuttakeOrder_TransPortUnitCode);
                                        Order_Form = Order_Form.replace("O_CONFIRMATIONSEND", OuttakeOrder_ConfirmationSend);
                                        Order_Form = Order_Form.replace("O_ORDERTYPE", OuttakeOrder_OrderType);
                                        Order_Form = Order_Form.replace("O_RESPONSEMESSAGELANGUAGE", OuttakeOrder_ReponseMessageLanguage);
                                        Order_Form = Order_Form.replace("O_CREATEDATETIME", OuttakeOrder_CreateDateTime);
                                        Order_Form = Order_Form.replace("O_UPDATEDATETIME", OuttakeOrder_UpdateDateTime);
                                        Order_Form = Order_Form.replace("O_CREATEBY", OuttakeOrder_CreateBy);
                                        Order_Form = Order_Form.replace("O_UPDATEBY", OuttakeOrder_UpdateBy);

                                        Order_Form = Order_Form.replace("O_ORDERLINES", ResponseMessage_Orderline);

                                        console.log("Order file output:");
                                        console.log("-----------------------------------------------------");
                                        console.log(Order_Form);

                                        Process_Send_File_To_Customer(OuttakeOrder_OrderNR, "OUTCONFIRM", Order_Form, OuttakeOrder_RecAddressNR);
                                    });
                                }
                            });
                        });
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f APIKeyCheck - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_XML_OutConfirmed_Files_OrderLine(OuttakeOrder_ID, OuttakeOrder_OrderNR, OuttakeOrder_OrderType, Orderline_Template, PalletLine_Template, DateTime_Loading, Order_Callback) {               
    //Create the SQL Select Statement for the orderlines
    var SQL_Select_S2_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorderline` WHERE `OrderID` = "' + OuttakeOrder_ID + '" AND `OrderType` = "' + OuttakeOrder_OrderType + '" AND `OrderNR` = "' + OuttakeOrder_OrderNR + '"';

    console.log(SQL_Select_S2_Statement);

    con.query(SQL_Select_S2_Statement, async function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
        //Check if there are any error messages
        if (SQL_S2_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S2 Error: " + SQL_S2_err);
        } else {
            try {
                var ResponseMessage_Orderline = '';

                for (var e = 0; e < SQL_S2_rows.length; e++) {

                    var OuttakeOrderLine_ID                     = SQL_S2_rows[e].ID;
                    var OuttakeOrderLine_OrderID                = SQL_S2_rows[e].OrderID;
                    var OuttakeOrderLine_OrderType              = SQL_S2_rows[e].OrderType;
                    var OuttakeOrderLine_OrderNR                = SQL_S2_rows[e].OrderNR;
                    var OuttakeOrderLine_LineNR                 = SQL_S2_rows[e].LineNR;
                    var OuttakeOrderLine_Carrier                = SQL_S2_rows[e].Carrier;
                    var OuttakeOrderLine_CarrierCode            = SQL_S2_rows[e].CarrierCode;
                    var OuttakeOrderLine_CompanyCode            = SQL_S2_rows[e].CompanyCode;
                    var OuttakeOrderLine_ContainerTypeCode      = SQL_S2_rows[e].ContainerTypeCode;
                    var OuttakeOrderLine_ContainerNR            = SQL_S2_rows[e].ContainerNR;
                    var OuttakeOrderLine_CustAddressNR          = SQL_S2_rows[e].CustAddressNR;
                    var OuttakeOrderLine_CustProductCode        = SQL_S2_rows[e].CustProductCode;
                    var OuttakeOrderLine_CustRef1               = SQL_S2_rows[e].CustRef1;
                    var OuttakeOrderLine_CustRef2               = SQL_S2_rows[e].CustRef2;
                    var OuttakeOrderLine_CustRef3               = SQL_S2_rows[e].CustRef3;
                    var OuttakeOrderLine_DeliveryAddress        = SQL_S2_rows[e].DeliveryAddress;
                    var OuttakeOrderLine_DeliveryAddressNR      = SQL_S2_rows[e].DeliveryAddressNR;
                    var OuttakeOrderLine_DeliveryDate           = SQL_S2_rows[e].DeliveryDate;
                    var OuttakeOrderLine_EDILine1               = SQL_S2_rows[e].EDILine1;
                    var OuttakeOrderLine_EDILine2               = SQL_S2_rows[e].EDILine2;
                    var OuttakeOrderLine_EDILine3               = SQL_S2_rows[e].EDILine3;
                    var OuttakeOrderLine_EDILine4               = SQL_S2_rows[e].EDILine4;
                    var OuttakeOrderLine_EDILine5               = SQL_S2_rows[e].EDILine5;
                    var OuttakeOrderLine_ExtEDILineText         = SQL_S2_rows[e].ExtEDILineText;
                    var OuttakeOrderLine_GrossWeight            = SQL_S2_rows[e].GrossWeight;
                    var OuttakeOrderLine_GrossWeightCode        = SQL_S2_rows[e].GrossWeightCode;
                    var OuttakeOrderLine_NettWeight             = SQL_S2_rows[e].NettWeight;
                    var OuttakeOrderLine_NettWeightCode         = SQL_S2_rows[e].NettWeightCode;
                    var OuttakeOrderLine_OuterPCK               = SQL_S2_rows[e].OuterPCK;
                    var OuttakeOrderLine_OuterPCKCode           = SQL_S2_rows[e].OuterPCKCode;
                    var OuttakeOrderLine_PackTypeCode           = SQL_S2_rows[e].PackTypeCode;
                    var OuttakeOrderLine_ProdRef1               = SQL_S2_rows[e].ProdRef1;
                    var OuttakeOrderLine_ProdRef2               = SQL_S2_rows[e].ProdRef2;
                    var OuttakeOrderLine_ProdRef3               = SQL_S2_rows[e].ProdRef3;
                    var OuttakeOrderLine_ProdRef4               = SQL_S2_rows[e].ProdRef4;
                    var OuttakeOrderLine_ProdRef5               = SQL_S2_rows[e].ProdRef5;
                    var OuttakeOrderLine_ProductID              = SQL_S2_rows[e].ProductID;
                    var OuttakeOrderLine_ProductGroupCode       = SQL_S2_rows[e].ProductGroupCode;
                    var OuttakeOrderLine_QtyControlCode         = SQL_S2_rows[e].QtyControlCode;
                    var OuttakeOrderLine_RecAddressNR           = SQL_S2_rows[e].RecAddressNR;
                    var OuttakeOrderLine_Remarks                = SQL_S2_rows[e].Remarks;
                    var OuttakeOrderLine_StockRefNR             = SQL_S2_rows[e].StockRefNR;
                    var OuttakeOrderLine_SupplierAddressNR      = SQL_S2_rows[e].SupplierAddressNR;
                    var OuttakeOrderLine_TermPlace              = SQL_S2_rows[e].TermPlace;
                    var OuttakeOrderLine_TermCode               = SQL_S2_rows[e].TermCode;
                    var OuttakeOrderLine_TransActionCustomerRef = SQL_S2_rows[e].TransActionCustomerRef;
                    var OuttakeOrderLine_WareHouseRef           = SQL_S2_rows[e].WareHouseRef;
                    var OuttakeOrderLine_CreateDateTime         = SQL_S2_rows[e].CreateDateTime;
                    var OuttakeOrderLine_UpdateDateTime         = SQL_S2_rows[e].UpdateDateTime;
                    var OuttakeOrderLine_CreateBy               = SQL_S2_rows[e].CreateBy;
                    var OuttakeOrderLine_UpdateBy               = SQL_S2_rows[e].UpdateBy;

                    var Date_DeliveryDate       = new Date(DateTime_Loading);
                    var Year_DeliveryDate       = Date_DeliveryDate.getFullYear();
                    var Month_DeliveryDate      = Date_DeliveryDate.getMonth() + 1;
                    var Day_DeliveryDate        = Date_DeliveryDate.getDate();
                    var STR_Year_DeliveryDate   = Year_DeliveryDate.toString();
                    var STR_Month_DeliveryDate  = Month_DeliveryDate.toString();
                    var STR_Day_DeliveryDate    = Day_DeliveryDate.toString();

                    console.log("-----------------------------------------------------");
                    console.log("DateTime_Loading       : " + DateTime_Loading);
                    console.log("Date_DeliveryDate      : " + Date_DeliveryDate);
                    console.log("Year_DeliveryDate      : " + Year_DeliveryDate);
                    console.log("Month_DeliveryDate     : " + Month_DeliveryDate);
                    console.log("Day_DeliveryDate       : " + Day_DeliveryDate);
                    console.log("STR_Year_DeliveryDate  : " + STR_Year_DeliveryDate);
                    console.log("STR_Month_DeliveryDate : " + STR_Month_DeliveryDate);
                    console.log("STR_Day_DeliveryDate   : " + STR_Day_DeliveryDate);
                    console.log("-----------------------------------------------------");

                    var OuttakeOrderLine_DeliveryDate_YYYYMMDD = STR_Year_DeliveryDate + STR_Month_DeliveryDate + STR_Day_DeliveryDate;

                    console.log("OuttakeOrderLine_DeliveryDate_YYYYMMDD : " + OuttakeOrderLine_DeliveryDate_YYYYMMDD);
                    console.log("-----------------------------------------------------");

                    console.log(Orderline_Template);

                    await Process_XML_OutConfirmed_Files_PalletLine(OuttakeOrder_ID, OuttakeOrder_OrderType, OuttakeOrderLine_ID, PalletLine_Template, function(ResponseMessage_PalletLine){
                        var OrderLine_Form = Orderline_Template;

                        // console.log(OrderLine_Form);
                        OrderLine_Form = OrderLine_Form.replace("O_ID", OuttakeOrderLine_ID);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERID", OuttakeOrderLine_OrderID);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERTYPE", OuttakeOrderLine_OrderType);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERNR", OuttakeOrderLine_OrderNR);
                        OrderLine_Form = OrderLine_Form.replace("O_LINENR", OuttakeOrderLine_LineNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CARRIER", OuttakeOrderLine_Carrier);
                        OrderLine_Form = OrderLine_Form.replace("O_CARRIERCODE", OuttakeOrderLine_CarrierCode);
                        OrderLine_Form = OrderLine_Form.replace("O_COMPANYCODE", OuttakeOrderLine_CompanyCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CONTAINERTYPECODE", OuttakeOrderLine_ContainerTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CONTAINERNR", OuttakeOrderLine_ContainerNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTADDRESSNR", OuttakeOrderLine_CustAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTPRODUCTCODE", OuttakeOrderLine_CustProductCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF1", OuttakeOrderLine_CustRef1);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF2", OuttakeOrderLine_CustRef2);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF3", OuttakeOrderLine_CustRef3);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYADDRESS", OuttakeOrderLine_DeliveryAddress);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYADDRESSNR", OuttakeOrderLine_DeliveryAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYDATE", OuttakeOrderLine_DeliveryDate);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE1", OuttakeOrderLine_EDILine1);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE2", OuttakeOrderLine_EDILine2);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE3", OuttakeOrderLine_EDILine3);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE4", OuttakeOrderLine_EDILine4);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE5", OuttakeOrderLine_EDILine5);
                        OrderLine_Form = OrderLine_Form.replace("O_EXTEDILINETEXT", OuttakeOrderLine_ExtEDILineText);
                        OrderLine_Form = OrderLine_Form.replace("O_GROSSWEIGHT", OuttakeOrderLine_GrossWeight);
                        OrderLine_Form = OrderLine_Form.replace("O_GROSSWEIGHTCODE", OuttakeOrderLine_GrossWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("O_NETTWEIGHT", OuttakeOrderLine_NettWeight);
                        OrderLine_Form = OrderLine_Form.replace("O_NETTWEIGHTCODE", OuttakeOrderLine_NettWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("O_OUTERPCK", OuttakeOrderLine_OuterPCK);
                        OrderLine_Form = OrderLine_Form.replace("O_OUTERPCKCODE", OuttakeOrderLine_OuterPCKCode);
                        OrderLine_Form = OrderLine_Form.replace("O_PACKTYPECODE", OuttakeOrderLine_PackTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF1", OuttakeOrderLine_ProdRef1);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF2", OuttakeOrderLine_ProdRef2);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF3", OuttakeOrderLine_ProdRef3);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF4", OuttakeOrderLine_ProdRef4);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF5", OuttakeOrderLine_ProdRef5);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODUCTID", OuttakeOrderLine_ProductID);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODUCTGROUPCODE", OuttakeOrderLine_ProductGroupCode);
                        OrderLine_Form = OrderLine_Form.replace("O_QTYCONTROLCODE", OuttakeOrderLine_QtyControlCode);
                        OrderLine_Form = OrderLine_Form.replace("O_RECADDRESSNR", OuttakeOrderLine_RecAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_REMARKS", OuttakeOrderLine_Remarks);
                        OrderLine_Form = OrderLine_Form.replace("O_STOCKREFNR", OuttakeOrderLine_StockRefNR);
                        OrderLine_Form = OrderLine_Form.replace("O_SUPPLIERADDRESSNR", OuttakeOrderLine_SupplierAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_TERMPLACE", OuttakeOrderLine_TermPlace);
                        OrderLine_Form = OrderLine_Form.replace("O_TERMCODE", OuttakeOrderLine_TermCode);
                        OrderLine_Form = OrderLine_Form.replace("O_TRANSACTIONCUSTOMERREF", OuttakeOrderLine_TransActionCustomerRef);
                        OrderLine_Form = OrderLine_Form.replace("O_WAREHOUSEREF", OuttakeOrderLine_WareHouseRef);
                        OrderLine_Form = OrderLine_Form.replace("O_CREATEDATETIME", OuttakeOrderLine_CreateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("O_UPDATEDATETIME", OuttakeOrderLine_UpdateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("O_CREATEBY", OuttakeOrderLine_CreateBy);
                        OrderLine_Form = OrderLine_Form.replace("O_UPDATEBY", OuttakeOrderLine_UpdateBy);
                        OrderLine_Form = OrderLine_Form.replace("O_YYYYMMDD_DELIVERYDATE", OuttakeOrderLine_DeliveryDate_YYYYMMDD);
                        OrderLine_Form = OrderLine_Form.replace("O_YYYYMMDD_DELIVERYDATE", OuttakeOrderLine_DeliveryDate_YYYYMMDD);
                        OrderLine_Form = OrderLine_Form.replace("O_YYYYMMDD_DELIVERYDATE", OuttakeOrderLine_DeliveryDate_YYYYMMDD);
                        OrderLine_Form = OrderLine_Form.replace("O_YYYYMMDD_DELIVERYDATE", OuttakeOrderLine_DeliveryDate_YYYYMMDD);

                        OrderLine_Form = OrderLine_Form.replace("O_PALLETLINE", ResponseMessage_PalletLine);

                        console.log(OrderLine_Form);
                                               
                        ResponseMessage_Orderline = ResponseMessage_Orderline + OrderLine_Form;

                        if(e == SQL_S2_rows.length) {

                            Order_Callback(ResponseMessage_Orderline);
                        }
                    });
                }

            } catch (TryCatchError_S2) {
                console.error("f APIKeyCheck - TryCatchError_S2: " + TryCatchError_S2);
            }
        }
    });
}

function Process_XML_OutConfirmed_Files_PalletLine(OuttakeOrder_ID, OuttakeOrder_OrderType, OuttakeOrderLine_ID, PalletLine_Template, OrderLine_Callback) {
    //Create a SQL Select statement for the Palletlines
    var SQL_Select_S3_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`palletline` WHERE `OrderID` = "' + OuttakeOrder_ID + '" AND `OrderLineID` = "' + OuttakeOrderLine_ID + '" AND `OrderType` = "' + OuttakeOrder_OrderType + '"';

    con.query(SQL_Select_S3_Statement, function (SQL_S3_err, SQL_S3_rows, SQL_S3_fields) {
        //Check if there are any error messages
        if (SQL_S3_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S3 Error: " + SQL_S3_err);
        } else {
            try {
                ResponseMessage_PalletLine = '';

                for (var o = 0; o < SQL_S3_rows.length; o++) {
                    var OuttakePalletLine_ID                 = SQL_S3_rows[o].ID;
                    var OuttakePalletLine_OrderID            = SQL_S3_rows[o].OrderID;
                    var OuttakePalletLine_OrderLineID        = SQL_S3_rows[o].OrderLineID;
                    var OuttakePalletLine_OrderType          = SQL_S3_rows[o].OrderType;
                    var OuttakePalletLine_InboundOrOutbound  = SQL_S3_rows[o].InboundOrOutbound;
                    var OuttakePalletLine_StockNr            = SQL_S3_rows[o].StockNr;
                    var OuttakePalletLine_BarcodeEXP         = SQL_S3_rows[o].BarcodeEXP;
                    var OuttakePalletLine_BarcodeID          = SQL_S3_rows[o].BarcodeID;
                    var OuttakePalletLine_BarcodeIDInternal  = SQL_S3_rows[o].BarcodeIDInternal;
                    var OuttakePalletLine_CalcRef1           = SQL_S3_rows[o].CalcRef1;
                    var OuttakePalletLine_CalcRef2           = SQL_S3_rows[o].CalcRef2;
                    var OuttakePalletLine_CalcRef3           = SQL_S3_rows[o].CalcRef3;
                    var OuttakePalletLine_Carrier            = SQL_S3_rows[o].Carrier;
                    var OuttakePalletLine_CarrierCode        = SQL_S3_rows[o].CarrierCode;
                    var OuttakePalletLine_CompanyCode        = SQL_S3_rows[o].CompanyCode;
                    var OuttakePalletLine_DamageNR           = SQL_S3_rows[o].DamageNR;
                    var OuttakePalletLine_DT_Create          = SQL_S3_rows[o].DT_Create;
                    var OuttakePalletLine_DT_Mutation        = SQL_S3_rows[o].DT_Mutation;
                    var OuttakePalletLine_EDIStock1          = SQL_S3_rows[o].EDIStock1;
                    var OuttakePalletLine_EDIStock2          = SQL_S3_rows[o].EDIStock2;
                    var OuttakePalletLine_EDIStock3          = SQL_S3_rows[o].EDIStock3;
                    var OuttakePalletLine_EDIStock4          = SQL_S3_rows[o].EDIStock4;
                    var OuttakePalletLine_EDIStock5          = SQL_S3_rows[o].EDIStock5;
                    var OuttakePalletLine_GrossWeight        = SQL_S3_rows[o].GrossWeight;
                    var OuttakePalletLine_GrossWeightCode    = SQL_S3_rows[o].GrossWeightCode;
                    var OuttakePalletLine_InLineNR           = SQL_S3_rows[o].InLineNR;
                    var OuttakePalletLine_InOrderNR          = SQL_S3_rows[o].InOrderNR;
                    var OuttakePalletLine_IndActive          = SQL_S3_rows[o].IndActive;
                    var OuttakePalletLine_IndBlocked         = SQL_S3_rows[o].IndBlocked;
                    var OuttakePalletLine_NettWeight         = SQL_S3_rows[o].NettWeight;
                    var OuttakePalletLine_NettWeightCode     = SQL_S3_rows[o].NettWeightCode;
                    var OuttakePalletLine_OuterPCK           = SQL_S3_rows[o].OuterPCK;
                    var OuttakePalletLine_OuterPCKCode       = SQL_S3_rows[o].OuterPCKCode;
                    var OuttakePalletLine_PackTypeCode       = SQL_S3_rows[o].PackTypeCode;
                    var OuttakePalletLine_ProdRef1           = SQL_S3_rows[o].ProdRef1;
                    var OuttakePalletLine_ProdRef2           = SQL_S3_rows[o].ProdRef2;
                    var OuttakePalletLine_ProdRef3           = SQL_S3_rows[o].ProdRef3;
                    var OuttakePalletLine_ProdRef4           = SQL_S3_rows[o].ProdRef4;
                    var OuttakePalletLine_ProdRef5           = SQL_S3_rows[o].ProdRef5;
                    var OuttakePalletLine_ProductID          = SQL_S3_rows[o].ProductID;
                    var OuttakePalletLine_ProductGroupCode   = SQL_S3_rows[o].ProductGroupCode;
                    var OuttakePalletLine_StockRefNR         = SQL_S3_rows[o].StockRefNR;
                    var OuttakePalletLine_SupplierAdressNR   = SQL_S3_rows[o].SupplierAdressNR;
                    var OuttakePalletLine_TimCreate          = SQL_S3_rows[o].TimCreate;
                    var OuttakePalletLine_WareHouseRef       = SQL_S3_rows[o].WareHouseRef;
                    var OuttakePalletLine_CreateDateTime     = SQL_S3_rows[o].CreateDateTime;
                    var OuttakePalletLine_UpdateDateTime     = SQL_S3_rows[o].UpdateDateTime;
                    var OuttakePalletLine_CreateBy           = SQL_S3_rows[o].CreateBy;
                    var OuttakePalletLine_UpdateBy           = SQL_S3_rows[o].UpdateBy;

                    var PalletLine_Form = PalletLine_Template;

                    PalletLine_Form = PalletLine_Form.replace("O_ID", OuttakePalletLine_ID);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERID", OuttakePalletLine_OrderID);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERLINEID", OuttakePalletLine_OrderLineID);
                    PalletLine_Form = PalletLine_Form.replace("O_INBOUNDOROUTBOUND", OuttakePalletLine_InboundOrOutbound);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERTYPE", OuttakePalletLine_OrderType);
                    PalletLine_Form = PalletLine_Form.replace("O_STOCKNR", OuttakePalletLine_StockNr);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEEXP", OuttakePalletLine_BarcodeEXP);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEID", OuttakePalletLine_BarcodeID);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEIDINTERNAL", OuttakePalletLine_BarcodeIDInternal);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF1", OuttakePalletLine_CalcRef1);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF2", OuttakePalletLine_CalcRef2);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF3", OuttakePalletLine_CalcRef3);
                    PalletLine_Form = PalletLine_Form.replace("O_CARRIER", OuttakePalletLine_Carrier);
                    PalletLine_Form = PalletLine_Form.replace("O_CARRIERCODE", OuttakePalletLine_CarrierCode);
                    PalletLine_Form = PalletLine_Form.replace("O_COMPANYCODE", OuttakePalletLine_CompanyCode);
                    PalletLine_Form = PalletLine_Form.replace("O_DAMAGENR", OuttakePalletLine_DamageNR);
                    PalletLine_Form = PalletLine_Form.replace("O_DT_CREATE", OuttakePalletLine_DT_Create);
                    PalletLine_Form = PalletLine_Form.replace("O_DT_MUTATION", OuttakePalletLine_DT_Mutation);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK1", OuttakePalletLine_EDIStock1);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK2", OuttakePalletLine_EDIStock2);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK3", OuttakePalletLine_EDIStock3);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK4", OuttakePalletLine_EDIStock4);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK5", OuttakePalletLine_EDIStock5);
                    PalletLine_Form = PalletLine_Form.replace("O_GROSSWEIGHT", OuttakePalletLine_GrossWeight);
                    PalletLine_Form = PalletLine_Form.replace("O_GROSSWEIGHTCODE", OuttakePalletLine_GrossWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("O_INLINENR", OuttakePalletLine_InLineNR);
                    PalletLine_Form = PalletLine_Form.replace("O_INORDERNR", OuttakePalletLine_InOrderNR);
                    PalletLine_Form = PalletLine_Form.replace("O_INDACTIVE", OuttakePalletLine_IndActive);
                    PalletLine_Form = PalletLine_Form.replace("O_INDBLOCKED", OuttakePalletLine_IndBlocked);
                    PalletLine_Form = PalletLine_Form.replace("O_NETTWEIGHT", OuttakePalletLine_NettWeight);
                    PalletLine_Form = PalletLine_Form.replace("O_NETTWEIGHTCODE", OuttakePalletLine_NettWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("O_OUTERPCK", OuttakePalletLine_OuterPCK);
                    PalletLine_Form = PalletLine_Form.replace("O_OUTERPCKCODE", OuttakePalletLine_OuterPCKCode);
                    PalletLine_Form = PalletLine_Form.replace("O_PACKTYPECODE", OuttakePalletLine_PackTypeCode);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF1", OuttakePalletLine_ProdRef1);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF2", OuttakePalletLine_ProdRef2);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF3", OuttakePalletLine_ProdRef3);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF4", OuttakePalletLine_ProdRef4);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF5", OuttakePalletLine_ProdRef5);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODUCTID", OuttakePalletLine_ProductID);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODUCTGROUPCODE", OuttakePalletLine_ProductGroupCode);
                    PalletLine_Form = PalletLine_Form.replace("O_STOCKREFNR", OuttakePalletLine_StockRefNR);
                    PalletLine_Form = PalletLine_Form.replace("O_SUPPLIERADDRESSNR", OuttakePalletLine_SupplierAdressNR);
                    PalletLine_Form = PalletLine_Form.replace("O_TIMCREATE", OuttakePalletLine_TimCreate);
                    PalletLine_Form = PalletLine_Form.replace("O_WAREHOUSEREF", OuttakePalletLine_WareHouseRef);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_CREATEDATETIME", OuttakePalletLine_CreateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_UPDATEDATETIME", OuttakePalletLine_UpdateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_CREATEBY", OuttakePalletLine_CreateBy);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_UPDATEBY", OuttakePalletLine_UpdateBy);

                    ResponseMessage_PalletLine = ResponseMessage_PalletLine + PalletLine_Form;
                }

                OrderLine_Callback(ResponseMessage_PalletLine);

            } catch (TryCatchError_S3) {
                console.error("f APIKeyCheck - TryCatchError_S3: " + TryCatchError_S3);
            }
        }
    });
}

function Process_Send_File_To_Customer(OrderNr, OrderType, OrderFile, CustomerNr) {
    Process_Retriev_CustomerData(CustomerNr, function(JSONObject_CustomerData) {
        var CustomerData_DB_ID              = JSONObject_CustomerData.customer_data_db_id;
        var CustomerData_ExternalID         = JSONObject_CustomerData.customer_data_externalid;
        var CustomerData_CustomerShortName  = JSONObject_CustomerData.customer_data_shortname;
        var CustomerData_CustomerFullName   = JSONObject_CustomerData.customer_data_fullname;
        var CustomerData_Street             = JSONObject_CustomerData.customer_data_street;
        var CustomerData_HouseNumber        = JSONObject_CustomerData.customer_data_housenumber;
        var CustomerData_PostalCode         = JSONObject_CustomerData.customer_data_postalcode;
        var CustomerData_City               = JSONObject_CustomerData.customer_data_city;
        var CustomerData_ResponseMessageLan = JSONObject_CustomerData.customer_data_responsemessagelan;
        var CustomerData_ResponseMessageLoc = JSONObject_CustomerData.customer_data_responsemessageloc;
        var CustomerData_ResponseUser       = JSONObject_CustomerData.customer_data_responseuser;
        var CustomerData_ResponseKey        = JSONObject_CustomerData.customer_data_responsekey;
        var CustomerData_CreateDateTime     = JSONObject_CustomerData.customer_data_db_createdatetime;
        var CustomerData_UpdateDateTime     = JSONObject_CustomerData.customer_data_db_updatedatetime;
        var CustomerData_CreateBy           = JSONObject_CustomerData.customer_data_db_createby;
        var CustomerData_UpdateBy           = JSONObject_CustomerData.customer_data_db_updateby;
        Process_Retriev_APIKey(CustomerData_DB_ID, function(CustomerAPIKey) {
            if (CustomerData_ResponseMessageLan == 'JSON') {
                request.post({
                    url: CustomerData_ResponseMessageLoc,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': OrderFile.length
                    },
                    body: OrderFile,
                    method: 'POST',
                    json: false
                }, function (e, r, body) {
                    if (!e && r.statusCode == 200) {
                        console.log("f Process_Send_File_To_Customer - JSON - File upload: File upload has been a succes!");
                        Process_Save_Send_File_Customer_Response(OrderNr, OrderType, OrderFile, "xml", CustomerData_ExternalID, CustomerAPIKey, 0, response, response.statusCode, response.statusMessage, function(ResponseMessage) {
                            console.log(ResponseMessage);
                            
                        });
                    } else {
                        console.error("f Process_Send_File_To_Customer - JSON - File upload: File upload has run into a error!");
                        Process_Save_Send_File_Customer_Response(OrderNr, OrderType, OrderFile, "xml", CustomerData_ExternalID, CustomerAPIKey, 1, response, response.statusCode, response.statusMessage, function(ResponseMessage) {
                            console.log(ResponseMessage);
                        });
                    }
                });
            } else {
                request.post({
                    url: CustomerData_ResponseMessageLoc,
                    headers: {
                        'Content-Type': 'application/xml',
                        'Content-Length': OrderFile.length
                    },
                    body: OrderFile,
                    method: 'POST',
                    json: false
                }, function (e, r, body) {
                    if (!e && r.statusCode == 200) {
                        console.log("f Process_Send_File_To_Customer - XML - File upload: File upload has been a succes!");
                            Process_Save_Send_File_Customer_Response(OrderNr, OrderType, OrderFile, "json", CustomerData_ExternalID, CustomerAPIKey, 0, response, response.statusCode, response.statusMessage, function(ResponseMessage) {
                            console.log(ResponseMessage);

                        });
                    } else {
                        console.log("-----------------------------------------------------------------------------------");
                        console.log("response.statusCode    : " + response.statusCode);
                        console.log("response.statusMessage : " + response.statusMessage);
                        console.log("-----------------------------------------------------------------------------------");
        
                        console.error("f Process_Send_File_To_Customer - XML - File upload: File upload has run into a error!");
        
                        Process_Save_Send_File_Customer_Response(OrderNr, OrderType, OrderFile, "json", CustomerData_ExternalID, CustomerAPIKey, 1, response, response.statusCode, response.statusMessage, function(ResponseMessage) {
                            console.log(ResponseMessage);
                        });
                    }
                });
            }
        })
    });
}

function Process_Retriev_CustomerData(CustomerNr, callback) {
    var SQL_SELECT_STATEMENT = 'SELECT * FROM `Softpak_ChangeManager`.`customer` WHERE `ExternalID` = "' + CustomerNr + '"';
    
    //Connect to the database
    con.connect;

    //Query the SQL database
    con.query(SQL_SELECT_STATEMENT, function (SQL_err, SQL_rows, SQL_fields) {
        //Check if there are any error messages
        if (SQL_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Retriev_CustomerData - SQL Error: " + SQL_err);
        } else {
            try {
                var CustomerData_ID                 = SQL_rows[0].ID;
                var CustomerData_ExternalID         = SQL_rows[0].ExternalID;
                var CustomerData_CustomerShortName  = SQL_rows[0].CustomerShortName;
                var CustomerData_CustomerFullName   = SQL_rows[0].CustomerFullName;
                var CustomerData_Street             = SQL_rows[0].Street;
                var CustomerData_HouseNumber        = SQL_rows[0].HouseNumber;
                var CustomerData_PostalCode         = SQL_rows[0].Postalcode;
                var CustomerData_City               = SQL_rows[0].City;
                var CustomerData_ResponseMessageLan = SQL_rows[0].ResponseMessageLan;
                var CustomerData_ResponseMessageLoc = SQL_rows[0].ResponseMessageLoc;
                var CustomerData_ResponseUser       = SQL_rows[0].ResponseUser;
                var CustomerData_ResponseKey        = SQL_rows[0].ResponseKey;
                var CustomerData_CreateDateTime     = SQL_rows[0].CreateDateTime;
                var CustomerData_UpdateDateTime     = SQL_rows[0].UpdateDateTime;
                var CustomerData_CreateBy           = SQL_rows[0].CreateBy;
                var CustomerData_UpdateBy           = SQL_rows[0].UpdateBy;

                var STR_JSON_CustomerData = '{"customer_data_db_id": "' + CustomerData_ID + '","customer_data_externalid": "' + CustomerData_ExternalID + '","customer_data_shortname": "' + CustomerData_CustomerShortName + '","customer_data_fullname": "' + CustomerData_CustomerFullName + '","customer_data_street": "' + CustomerData_Street + '","customer_data_housenumber": "' + CustomerData_HouseNumber + '","customer_data_postalcode": "' + CustomerData_PostalCode + '","customer_data_city": "' + CustomerData_City + '","customer_data_responsemessagelan": "' + CustomerData_ResponseMessageLan + '","customer_data_responsemessageloc": "' + CustomerData_ResponseMessageLoc + '","customer_data_responseuser": "' + CustomerData_ResponseUser + '","customer_data_responsekey": "' + CustomerData_ResponseKey + '","customer_data_db_createdatetime": "' + CustomerData_CreateDateTime + '","customer_data_db_updatedatetime": "' + CustomerData_UpdateDateTime + '","customer_data_db_createby": "' + CustomerData_CreateBy + '","customer_data_db_updateby": "' + CustomerData_UpdateBy + '"}';
                var JSONObject_CustomerData = JSON.parse(STR_JSON_CustomerData);

                callback(JSONObject_CustomerData);
            } catch (TryCatchError) {
                console.error("f Process_Retriev_CustomerData - TryCatchError: " + TryCatchError);
            }
        }
    });

    //Disconnect from the database
    con.end;
}

function Process_Retriev_APIKey(CustomerData_DB_ID, callback) {
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`apiusers` WHERE `CustomerID` = "' + CustomerData_DB_ID + '"';

    //Connect to the MySQL database
    con.connect;
    
    //Query the SQL statement
    con.query(SQL_Select_Statement, function (SQL_Select_err, SQL_Select_rows, SQL_Select_fields) {
        if (SQL_Select_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f RetrievTemplate - SQL Select Error: " + SQL_Select_err);
        } else {
            try {
                var APIUsers_ID              = SQL_Select_rows[0].ID;
                var APIUsers_CustomerID      = SQL_Select_rows[0].CustomerID;
                var APIUsers_APIKey          = SQL_Select_rows[0].APIKey;
                var APIUsers_ActiveAPIKey    = SQL_Select_rows[0].ActiveAPIKey;
                var APIUsers_CreateDateTime  = SQL_Select_rows[0].CreateDateTime;
                var APIUsers_UpdateDateTime  = SQL_Select_rows[0].UpdateDateTime;
                var APIUsers_CreateBy        = SQL_Select_rows[0].CreateUser;
                var APIUsers_UpdateBy        = SQL_Select_rows[0].UpdateUser;
                
                callback(APIUsers_APIKey);
            } catch (SQL_Select_TryCatchError) {
                console.error(SQL_Select_TryCatchError);
                callback("SQLError_NoDataFound");
            }
        }
    });

    //Disconnect from the MySQL database
    con.end;
}

function Process_Save_Send_File_Customer_Response(OrderNr, OrderType, File, FileExtension, CustomerNr, CustomerAPIKey, Errored, CompleteResponse, ResponseCode, ResponseMessage, callback) {
    var current_dateobject = new Date();
    var current_date = current_dateobject.toISOString().slice(0,10).replace(/-/g,"");
    
    var ProcessDocuments_DocumentName       = "ToCustomerGeneratedFile_" + OrderNr + "_" + OrderType + "_" + current_date + "." + FileExtension;
    var ProcessDocuments_VBELN              = OrderNr;
    var ProcessDocuments_FileExtension      = FileExtension;
    var ProcessDocuments_SentInAPIKey       = CustomerAPIKey;
    var ProcessDocuments_Processed          = 1;
    var ProcessDocuments_Errored            = Errored;
    var ProcessDocuments_ErroredAmount      = Errored;
    var ProcessDocuments_DocumentClob       = File;
    var ProcessDocuments_CustomerNr         = CustomerNr;
    var ProcessDocuments_ResponseComplete   = CompleteResponse;
    var ProcessDocuments_ResponseCode       = ResponseCode;
    var ProcessDocuments_ResponseMessage    = ResponseMessage;
    
    var SQL_INSERT_STATEMENT = 'INSERT INTO `Softpak_ChangeManager`.`processdocuments` (`DocumentName`, `VBELN`, `FileExtension`, `SentInAPIKey`, `Processed`, `Errored`, `ErroredAmount`, `DocumentCLOB`, `CustomerNR`, `ResponseComplete`, `ResponseCode`, `ResponseMessage`) VALUES ("' + ProcessDocuments_DocumentName + '","' + ProcessDocuments_VBELN + '","' + ProcessDocuments_FileExtension + '","' + ProcessDocuments_SentInAPIKey + '","' + ProcessDocuments_Processed + '","' + ProcessDocuments_Errored + '","' + ProcessDocuments_ErroredAmount + '","' + ProcessDocuments_DocumentClob + '","' + ProcessDocuments_CustomerNr + '","' + ProcessDocuments_ResponseComplete + '","' + ProcessDocuments_ResponseCode + '","' + ProcessDocuments_ResponseMessage + '")';

    //Connect to the SQL Database
    con.connect;

    //Insert the SQL Statement
    con.query(SQL_INSERT_STATEMENT, function (SQL_err, SQL_result) {
        if (SQL_err) {
            console.error("f Process_Save_Send_File_Customer_Response - SQL_err: " + SQL_err);
            callback("There was an error while saving the file, please try again later");
        } else {
            console.log("f Process_Save_Send_File_Customer_Response : 1 record inserted, ID: " + SQL_result.insertId);
            callback("File saved!, File saved under ID: " + SQL_result.insertId);
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

//-------------------------------

//Create SoftPak Messages
//-------------------------------
function Process_Create_SoftPak_Message_Inbound() {
    //Create the Select Statement
    //Create the select statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`intakeorder` WHERE `OrderType` = "INCREATE" AND `ConfirmationSend` = "' + 0 + '" AND ID = "6"';

console.log(SQL_Select_S1_Statement);

    //Connect to the SQL Database
    con.connect;

    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Inbound - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var IntakeOrder_ID                      = SQL_S1_rows[i].ID;
                    var IntakeOrder_OrderNR                 = SQL_S1_rows[i].OrderNR;
                    var IntakeOrder_CompanyCode             = SQL_S1_rows[i].CompanyCode;
                    var IntakeOrder_ContainerTypeCode       = SQL_S1_rows[i].ContainerTypeCode;
                    var IntakeOrder_ContainerNR             = SQL_S1_rows[i].ContainerNR;
                    var IntakeOrder_CustAddressNR           = SQL_S1_rows[i].CustAddressNR;
                    var IntakeOrder_CustRef1                = SQL_S1_rows[i].CustRef1;
                    var IntakeOrder_CustRef2                = SQL_S1_rows[i].CustRef2;
                    var IntakeOrder_CustRef3                = SQL_S1_rows[i].CustRef3;
                    var IntakeOrder_CustRef4                = SQL_S1_rows[i].CustRef4;
                    var IntakeOrder_CustRef5                = SQL_S1_rows[i].CustRef5;
                    var IntakeOrder_CustRef6                = SQL_S1_rows[i].CustRef6;
                    var IntakeOrder_CustRef7                = SQL_S1_rows[i].CustRef7;
                    var IntakeOrder_CustRef8                = SQL_S1_rows[i].CustRef8;
                    var IntakeOrder_DTCreate                = SQL_S1_rows[i].DTCreate;
                    var IntakeOrder_DTDischarge             = SQL_S1_rows[i].DTDischarge;
                    var IntakeOrder_DTUpdate                = SQL_S1_rows[i].DTUpdate;
                    var IntakeOrder_EDIOrd1                 = SQL_S1_rows[i].EDIOrd1;
                    var IntakeOrder_EDIOrd2                 = SQL_S1_rows[i].EDIOrd2;
                    var IntakeOrder_EDIOrd3                 = SQL_S1_rows[i].EDIOrd3;
                    var IntakeOrder_EDIOrd4                 = SQL_S1_rows[i].EDIOrd4;
                    var IntakeOrder_EDIOrd5                 = SQL_S1_rows[i].EDIOrd5;
                    var IntakeOrder_ExtEDIOrderText         = SQL_S1_rows[i].ExtEDILineText;
                    var IntakeOrder_LineCode                = SQL_S1_rows[i].LineCode;
                    var IntakeOrder_LocTerminal             = SQL_S1_rows[i].LocTerminal;
                    var IntakeOrder_ProjectNR               = SQL_S1_rows[i].ProjectNR;
                    var IntakeOrder_RecAddressNR            = SQL_S1_rows[i].RecAddressNR;
                    var IntakeOrder_SealNO                  = SQL_S1_rows[i].SealNO;
                    var IntakeOrder_StatusCode              = SQL_S1_rows[i].StatusCode;
                    var IntakeOrder_SupplierAddressNR       = SQL_S1_rows[i].SupplierAddressNR;
                    var IntakeOrder_TimCreate               = SQL_S1_rows[i].TimCreate;
                    var IntakeOrder_TimDischarge            = SQL_S1_rows[i].TimDischarge;
                    var IntakeOrder_TimUpdated              = SQL_S1_rows[i].TimUpdated;
                    var IntakeOrder_TransPorterAddressNR    = SQL_S1_rows[i].TransPorterAddressNR;
                    var IntakeOrder_TransPorterNR           = SQL_S1_rows[i].TransPorterNR;
                    var IntakeOrder_ConfirmationSend        = SQL_S1_rows[i].ConfirmationSend;
                    var IntakeOrder_OrderType               = SQL_S1_rows[i].OrderType;
                    var IntakeOrder_ResponseMessageLanguage = SQL_S1_rows[i].ResponseMessageLanguage;
                    var IntakeOrder_CreateDateTime          = SQL_S1_rows[i].CreateDateTime;
                    var IntakeOrder_UpdateDateTime          = SQL_S1_rows[i].UpdateDateTime;
                    var IntakeOrder_CreateBy                = SQL_S1_rows[i].CreateBy;
                    var IntakeOrder_UpdateBy                = SQL_S1_rows[i].UpdateBy;

                    RetrievTemplate(1, 1, "Order", function(Template_Order_Request_Result){
                        var Order_Template = Template_Order_Request_Result;
                        RetrievTemplate(1, 1, "OrderLine", function(Template_OrderLine_Request_Result){
                            var Orderline_Template = Template_OrderLine_Request_Result;
                            RetrievTemplate(1, 1, "PalletLine", function(Template_PalletLine_Request_Result){
                                var PalletLine_Template = Template_PalletLine_Request_Result;

                                if (Order_Template != "SQLError_NoDataFound" || Orderline_Template != "SQLError_NoDataFound" || PalletLine_Template != "SQLError_NoDataFound") {
                                    
                                    Process_Create_SoftPak_Message_Inbound_OrderLine(IntakeOrder_ID, IntakeOrder_OrderNR, IntakeOrder_OrderType, Orderline_Template, PalletLine_Template, function(ResponseMessage_Orderline){
                                    
                                        Order_Form = Order_Template;
                                
                                        Order_Form = Order_Form.replace("I_ID", IntakeOrder_ID);
                                        Order_Form = Order_Form.replace("I_ORDERNR", IntakeOrder_OrderNR);
                                        Order_Form = Order_Form.replace("I_COMPANYCODE", IntakeOrder_CompanyCode);
                                        Order_Form = Order_Form.replace("I_CONTAINERTYPECODE", IntakeOrder_ContainerTypeCode);
                                        Order_Form = Order_Form.replace("I_CONTAINERNR", IntakeOrder_ContainerNR);
                                        Order_Form = Order_Form.replace("I_CUSTADDRESSNR", IntakeOrder_CustAddressNR);
                                        Order_Form = Order_Form.replace("I_CUSTREF1", IntakeOrder_CustRef1);
                                        Order_Form = Order_Form.replace("I_CUSTREF2", IntakeOrder_CustRef2);
                                        Order_Form = Order_Form.replace("I_CUSTREF3", IntakeOrder_CustRef3);
                                        Order_Form = Order_Form.replace("I_CUSTREF4", IntakeOrder_CustRef4);
                                        Order_Form = Order_Form.replace("I_CUSTREF5", IntakeOrder_CustRef5);
                                        Order_Form = Order_Form.replace("I_CUSTREF6", IntakeOrder_CustRef6);
                                        Order_Form = Order_Form.replace("I_CUSTREF7", IntakeOrder_CustRef7);
                                        Order_Form = Order_Form.replace("I_CUSTREF8", IntakeOrder_CustRef8);
                                        Order_Form = Order_Form.replace("I_DTCREATE", IntakeOrder_DTCreate);
                                        Order_Form = Order_Form.replace("I_DTDISCHARGE", IntakeOrder_DTDischarge);
                                        Order_Form = Order_Form.replace("I_DTUPDATE", IntakeOrder_DTUpdate);
                                        Order_Form = Order_Form.replace("I_EDIORD1", IntakeOrder_EDIOrd1);
                                        Order_Form = Order_Form.replace("I_EDIORD2", IntakeOrder_EDIOrd2);
                                        Order_Form = Order_Form.replace("I_EDIORD3", IntakeOrder_EDIOrd3);
                                        Order_Form = Order_Form.replace("I_EDIORD4", IntakeOrder_EDIOrd4);
                                        Order_Form = Order_Form.replace("I_EDIORD5", IntakeOrder_EDIOrd5);
                                        Order_Form = Order_Form.replace("I_EXTEDIORDERTEXT", IntakeOrder_ExtEDIOrderText);
                                        Order_Form = Order_Form.replace("I_LINECODE", IntakeOrder_LineCode);
                                        Order_Form = Order_Form.replace("I_LOCTERMINAL", IntakeOrder_LocTerminal);
                                        Order_Form = Order_Form.replace("I_PROJECTNR", IntakeOrder_ProjectNR);
                                        Order_Form = Order_Form.replace("I_RECADDRESSNR", IntakeOrder_RecAddressNR);
                                        Order_Form = Order_Form.replace("I_SEALNO", IntakeOrder_SealNO);
                                        Order_Form = Order_Form.replace("I_STATUSCODE", IntakeOrder_StatusCode);
                                        Order_Form = Order_Form.replace("I_SUPPLIERADDRESSNR", IntakeOrder_SupplierAddressNR);
                                        Order_Form = Order_Form.replace("I_TIMCREATE", IntakeOrder_TimCreate);
                                        Order_Form = Order_Form.replace("I_TIMDISCHARGE", IntakeOrder_TimDischarge);
                                        Order_Form = Order_Form.replace("I_TIMUPDATED", IntakeOrder_TimUpdated);
                                        Order_Form = Order_Form.replace("I_TRANSPORTERADDRESSNR", IntakeOrder_TransPorterAddressNR);
                                        Order_Form = Order_Form.replace("I_TRANSPORTERNR", IntakeOrder_TransPorterNR);
                                        Order_Form = Order_Form.replace("I_CONFIRMATIONSEND", IntakeOrder_ConfirmationSend);
                                        Order_Form = Order_Form.replace("I_ORDERTYPE", IntakeOrder_OrderType);
                                        Order_Form = Order_Form.replace("I_RESPONSEMESSAGELANGUAGE", IntakeOrder_ResponseMessageLanguage);
                                        Order_Form = Order_Form.replace("I_CREATEDATETIME", IntakeOrder_CreateDateTime);
                                        Order_Form = Order_Form.replace("I_UPDATEDATETIME", IntakeOrder_UpdateDateTime);
                                        Order_Form = Order_Form.replace("I_CREATEBY", IntakeOrder_CreateBy);
                                        Order_Form = Order_Form.replace("I_UPDATEBY", IntakeOrder_UpdateBy);
                                        Order_Form = Order_Form.replace("I_ORDERLINE", ResponseMessage_Orderline);

                                        console.log("Order file output:");
                                        console.log("-----------------------------------------------------");
                                        console.log(Order_Form);
                                    });
                                }
                            });
                        });
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f Process_Create_SoftPak_Message_Inbound - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_Create_SoftPak_Message_Inbound_OrderLine(IntakeOrder_ID, IntakeOrder_OrderNR, IntakeOrder_OrderType, Orderline_Template, PalletLine_Template, Order_Callback) {
    //Create the SQL Select Statement for the orderlines
    var SQL_Select_S2_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`intakeorderline` WHERE `OrderID` = "' + IntakeOrder_ID + '" AND `OrderType` = "' + IntakeOrder_OrderType + '"';

    console.log(SQL_Select_S2_Statement);

    con.query(SQL_Select_S2_Statement, async function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
        //Check if there are any error messages
        if (SQL_S2_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Inbound_OrderLine - SQL S2 Error: " + SQL_S2_err);
        } else {
            try {
                var ResponseMessage_Orderline = '';

                for (var e = 0; e < SQL_S2_rows.length; e++) {

                    var IntakeOrderLine_ID                      = SQL_S2_rows[e].ID;
                    var IntakeOrderLine_OrderID                 = SQL_S2_rows[e].OrderID;
                    var IntakeOrderLine_OrderType               = SQL_S2_rows[e].OrderType;
                    var IntakeOrderLine_OrderNR                 = SQL_S2_rows[e].OrderNR;
                    var IntakeOrderLine_LineNR                  = SQL_S2_rows[e].LineNR;
                    var IntakeOrderLine_Carrier                 = SQL_S2_rows[e].Carrier;
                    var IntakeOrderLine_CarrierCode             = SQL_S2_rows[e].CarrierCode;
                    var IntakeOrderLine_CompanyCode             = SQL_S2_rows[e].CompanyCode;
                    var IntakeOrderLine_ContainerTypeCode       = SQL_S2_rows[e].ContainerTypeCode;
                    var IntakeOrderLine_ContainerNR             = SQL_S2_rows[e].ContainerNR;
                    var IntakeOrderLine_CustAddressNR           = SQL_S2_rows[e].CustAddressNR;
                    var IntakeOrderLine_CustProductCode         = SQL_S2_rows[e].CustProductCode;
                    var IntakeOrderLine_CustRef1                = SQL_S2_rows[e].CustRef1;
                    var IntakeOrderLine_CustRef2                = SQL_S2_rows[e].CustRef2;
                    var IntakeOrderLine_CustRef3                = SQL_S2_rows[e].CustRef3;
                    var IntakeOrderLine_DamageDes               = SQL_S2_rows[e].DamageDes;
                    var IntakeOrderLine_DamageCode              = SQL_S2_rows[e].DamageCode;
                    var IntakeOrderLine_EDILine1                = SQL_S2_rows[e].EDILine1;
                    var IntakeOrderLine_EDILine2                = SQL_S2_rows[e].EDILine2;
                    var IntakeOrderLine_EDILine3                = SQL_S2_rows[e].EDILine3;
                    var IntakeOrderLine_EDILine4                = SQL_S2_rows[e].EDILine4;
                    var IntakeOrderLine_EDILine5                = SQL_S2_rows[e].EDILine5;
                    var IntakeOrderLine_ExtEDILineText          = SQL_S2_rows[e].ExtEDILineText;
                    var IntakeOrderLine_GrossWeight             = SQL_S2_rows[e].GrossWeight;
                    var IntakeOrderLine_GrossWeightCode         = SQL_S2_rows[e].GrossWeightCode;
                    var IntakeOrderLine_NettWeight              = SQL_S2_rows[e].NettWeight;
                    var IntakeOrderLine_NettWeightCode          = SQL_S2_rows[e].NettWeightCode;
                    var IntakeOrderLine_OuterPCK                = SQL_S2_rows[e].OuterPCK;
                    var IntakeOrderLine_OuterPCKCode            = SQL_S2_rows[e].OuterPCKCode;
                    var IntakeOrderLine_PackTypeCode            = SQL_S2_rows[e].PackTypeCode;
                    var IntakeOrderLine_ProdRef1                = SQL_S2_rows[e].ProdRef1;
                    var IntakeOrderLine_ProdRef2                = SQL_S2_rows[e].ProdRef2;
                    var IntakeOrderLine_ProdRef3                = SQL_S2_rows[e].ProdRef3;
                    var IntakeOrderLine_ProdRef4                = SQL_S2_rows[e].ProdRef4;
                    var IntakeOrderLine_ProdRef5                = SQL_S2_rows[e].ProdRef5;
                    var IntakeOrderLine_ProductID               = SQL_S2_rows[e].ProductID;
                    var IntakeOrderLine_ProductGroupCode        = SQL_S2_rows[e].ProductGroupCode;
                    var IntakeOrderLine_QtyControlCode          = SQL_S2_rows[e].QtyControlCode;
                    var IntakeOrderLine_RecAddressNR            = SQL_S2_rows[e].RecAddressNR;
                    var IntakeOrderLine_Remarks                 = SQL_S2_rows[e].Remarks;
                    var IntakeOrderLine_StockRefNR              = SQL_S2_rows[e].StockRefNR;
                    var IntakeOrderLine_SupplierAddressNR       = SQL_S2_rows[e].SupplierAddressNR;
                    var IntakeOrderLine_TermPlace               = SQL_S2_rows[e].TermPlace;
                    var IntakeOrderLine_TermCode                = SQL_S2_rows[e].TermCode;
                    var IntakeOrderLine_TransActionCustomerRef  = SQL_S2_rows[e].TransActionCustomerRef;
                    var IntakeOrderLine_WareHouseRef            = SQL_S2_rows[e].WareHouseRef;
                    var IntakeOrderLine_CreateDateTime          = SQL_S2_rows[e].CreateDateTime;
                    var IntakeOrderLine_UpdateDateTime          = SQL_S2_rows[e].UpdateDateTime;
                    var IntakeOrderLine_CreateBy                = SQL_S2_rows[e].CreateBy;
                    var IntakeOrderLine_UpdateBy                = SQL_S2_rows[e].UpdateBy;

                    // console.log(Orderline_Template);

                    await Process_Create_SoftPak_Message_Inbound_PalletLine(IntakeOrder_ID, IntakeOrder_OrderType, IntakeOrderLine_ID, PalletLine_Template, function(ResponseMessage_PalletLine){
                        var OrderLine_Form = Orderline_Template;

                        // console.log(OrderLine_Form);

                        OrderLine_Form = OrderLine_Form.replace("I_ID", IntakeOrderLine_ID);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERID", IntakeOrderLine_OrderID);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERTYPE", IntakeOrderLine_OrderType);
                        OrderLine_Form = OrderLine_Form.replace("I_ORDERNR", IntakeOrderLine_OrderNR);
                        OrderLine_Form = OrderLine_Form.replace("I_LINENR", IntakeOrderLine_LineNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CARRIER", IntakeOrderLine_Carrier);
                        OrderLine_Form = OrderLine_Form.replace("I_CARRIERCODE", IntakeOrderLine_CarrierCode);
                        OrderLine_Form = OrderLine_Form.replace("I_COMPANYCODE", IntakeOrderLine_CompanyCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CONTAINERTYPECODE", IntakeOrderLine_ContainerTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CONTAINERNR", IntakeOrderLine_ContainerNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTADDRESSNR", IntakeOrderLine_CustAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTPRODUCTCODE", IntakeOrderLine_CustProductCode);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF1", IntakeOrderLine_CustRef1);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF2", IntakeOrderLine_CustRef2);
                        OrderLine_Form = OrderLine_Form.replace("I_CUSTREF3", IntakeOrderLine_CustRef3);
                        OrderLine_Form = OrderLine_Form.replace("I_DAMAGEDES", IntakeOrderLine_DamageDes);
                        OrderLine_Form = OrderLine_Form.replace("I_DAMAGECODE", IntakeOrderLine_DamageCode);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE1", IntakeOrderLine_EDILine1);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE2", IntakeOrderLine_EDILine2);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE3", IntakeOrderLine_EDILine3);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE4", IntakeOrderLine_EDILine4);
                        OrderLine_Form = OrderLine_Form.replace("I_EDILINE5", IntakeOrderLine_EDILine5);
                        OrderLine_Form = OrderLine_Form.replace("I_EXTEDILINETEXT", IntakeOrderLine_ExtEDILineText);
                        OrderLine_Form = OrderLine_Form.replace("I_GROSSWEIGHT", IntakeOrderLine_GrossWeight);
                        OrderLine_Form = OrderLine_Form.replace("I_GROSSWEIGHTCODE", IntakeOrderLine_GrossWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("I_NETTWEIGHT", IntakeOrderLine_NettWeight);
                        OrderLine_Form = OrderLine_Form.replace("I_NETTWEIGHTCODE", IntakeOrderLine_NettWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("I_OUTERPCK", IntakeOrderLine_OuterPCK);
                        OrderLine_Form = OrderLine_Form.replace("I_OUTERPCKCODE", IntakeOrderLine_OuterPCKCode);
                        OrderLine_Form = OrderLine_Form.replace("I_PACKTYPECODE", IntakeOrderLine_PackTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF1", IntakeOrderLine_ProdRef1);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF2", IntakeOrderLine_ProdRef2);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF3", IntakeOrderLine_ProdRef3);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF4", IntakeOrderLine_ProdRef4);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODREF5", IntakeOrderLine_ProdRef5);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODUCTID", IntakeOrderLine_ProductID);
                        OrderLine_Form = OrderLine_Form.replace("I_PRODUCTGROUPCODE", IntakeOrderLine_ProductGroupCode);
                        OrderLine_Form = OrderLine_Form.replace("I_QTYCONTROLCODE", IntakeOrderLine_QtyControlCode);
                        OrderLine_Form = OrderLine_Form.replace("I_RECADDRESSNR", IntakeOrderLine_RecAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_REMARKS", IntakeOrderLine_Remarks);
                        OrderLine_Form = OrderLine_Form.replace("I_STOCKREFNR", IntakeOrderLine_StockRefNR);
                        OrderLine_Form = OrderLine_Form.replace("I_SUPPLIERADDRESSNR", IntakeOrderLine_SupplierAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("I_TERMPLACE", IntakeOrderLine_TermPlace);
                        OrderLine_Form = OrderLine_Form.replace("I_TERMCODE", IntakeOrderLine_TermCode);
                        OrderLine_Form = OrderLine_Form.replace("I_TRANSACTIONCUSTOMERREF", IntakeOrderLine_TransActionCustomerRef);
                        OrderLine_Form = OrderLine_Form.replace("I_WAREHOUSEREF", IntakeOrderLine_WareHouseRef);
                        OrderLine_Form = OrderLine_Form.replace("I_CREATEDATETIME", IntakeOrderLine_CreateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("I_UPDATEDATETIME", IntakeOrderLine_UpdateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("I_CREATEBY", IntakeOrderLine_CreateBy);
                        OrderLine_Form = OrderLine_Form.replace("I_UPDATEBY", IntakeOrderLine_UpdateBy);
                        OrderLine_Form = OrderLine_Form.replace("I_PALLETLINE", ResponseMessage_PalletLine);

                        console.log(OrderLine_Form);
                                               
                        ResponseMessage_Orderline = ResponseMessage_Orderline + OrderLine_Form;

                        if(e == SQL_S2_rows.length) {

                            Order_Callback(ResponseMessage_Orderline);
                        }
                    });
                }

            } catch (TryCatchError_S2) {
                console.error("f Process_Create_SoftPak_Message_Inbound_OrderLine - TryCatchError_S2: " + TryCatchError_S2);
            }
        }
    });
}

function Process_Create_SoftPak_Message_Inbound_PalletLine(IntakeOrder_ID, IntakeOrder_OrderType, IntakeOrderLine_ID, PalletLine_Template, OrderLine_Callback) {
    //Create a SQL Select statement for the Palletlines
    var SQL_Select_S3_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`palletline` WHERE `OrderID` = "' + IntakeOrder_ID + '" AND `OrderLineID` = "' + IntakeOrderLine_ID + '" AND `OrderType` = "INANNOUNCE"';

    con.query(SQL_Select_S3_Statement, function (SQL_S3_err, SQL_S3_rows, SQL_S3_fields) {
        //Check if there are any error messages
        if (SQL_S3_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Inbound_PalletLine - SQL S3 Error: " + SQL_S3_err);
        } else {
            try {
                ResponseMessage_PalletLine = '';

                for (var o = 0; o < SQL_S3_rows.length; o++) {
                    var IntakePalletLine_ID                 = SQL_S3_rows[o].ID;
                    var IntakePalletLine_OrderID            = SQL_S3_rows[o].OrderID;
                    var IntakePalletLine_OrderLineID        = SQL_S3_rows[o].OrderLineID;
                    var IntakePalletLine_OrderType          = SQL_S3_rows[o].OrderType;
                    var IntakePalletLine_InboundOrOutbound  = SQL_S3_rows[o].InboundOrOutbound;
                    var IntakePalletLine_StockNr            = SQL_S3_rows[o].StockNr;
                    var IntakePalletLine_BarcodeEXP         = SQL_S3_rows[o].BarcodeEXP;
                    var IntakePalletLine_BarcodeID          = SQL_S3_rows[o].BarcodeID;
                    var IntakePalletLine_BarcodeIDInternal  = SQL_S3_rows[o].BarcodeIDInternal;
                    var IntakePalletLine_CalcRef1           = SQL_S3_rows[o].CalcRef1;
                    var IntakePalletLine_CalcRef2           = SQL_S3_rows[o].CalcRef2;
                    var IntakePalletLine_CalcRef3           = SQL_S3_rows[o].CalcRef3;
                    var IntakePalletLine_Carrier            = SQL_S3_rows[o].Carrier;
                    var IntakePalletLine_CarrierCode        = SQL_S3_rows[o].CarrierCode;
                    var IntakePalletLine_CompanyCode        = SQL_S3_rows[o].CompanyCode;
                    var IntakePalletLine_DamageNR           = SQL_S3_rows[o].DamageNR;
                    var IntakePalletLine_DT_Create          = SQL_S3_rows[o].DT_Create;
                    var IntakePalletLine_DT_Mutation        = SQL_S3_rows[o].DT_Mutation;
                    var IntakePalletLine_EDIStock1          = SQL_S3_rows[o].EDIStock1;
                    var IntakePalletLine_EDIStock2          = SQL_S3_rows[o].EDIStock2;
                    var IntakePalletLine_EDIStock3          = SQL_S3_rows[o].EDIStock3;
                    var IntakePalletLine_EDIStock4          = SQL_S3_rows[o].EDIStock4;
                    var IntakePalletLine_EDIStock5          = SQL_S3_rows[o].EDIStock5;
                    var IntakePalletLine_GrossWeight        = SQL_S3_rows[o].GrossWeight;
                    var IntakePalletLine_GrossWeightCode    = SQL_S3_rows[o].GrossWeightCode;
                    var IntakePalletLine_InLineNR           = SQL_S3_rows[o].InLineNR;
                    var IntakePalletLine_InOrderNR          = SQL_S3_rows[o].InOrderNR;
                    var IntakePalletLine_IndActive          = SQL_S3_rows[o].IndActive;
                    var IntakePalletLine_IndBlocked         = SQL_S3_rows[o].IndBlocked;
                    var IntakePalletLine_NettWeight         = SQL_S3_rows[o].NettWeight;
                    var IntakePalletLine_NettWeightCode     = SQL_S3_rows[o].NettWeightCode;
                    var IntakePalletLine_OuterPCK           = SQL_S3_rows[o].OuterPCK;
                    var IntakePalletLine_OuterPCKCode       = SQL_S3_rows[o].OuterPCKCode;
                    var IntakePalletLine_PackTypeCode       = SQL_S3_rows[o].PackTypeCode;
                    var IntakePalletLine_ProdRef1           = SQL_S3_rows[o].ProdRef1;
                    var IntakePalletLine_ProdRef2           = SQL_S3_rows[o].ProdRef2;
                    var IntakePalletLine_ProdRef3           = SQL_S3_rows[o].ProdRef3;
                    var IntakePalletLine_ProdRef4           = SQL_S3_rows[o].ProdRef4;
                    var IntakePalletLine_ProdRef5           = SQL_S3_rows[o].ProdRef5;
                    var IntakePalletLine_ProductID          = SQL_S3_rows[o].ProductID;
                    var IntakePalletLine_ProductGroupCode   = SQL_S3_rows[o].ProductGroupCode;
                    var IntakePalletLine_StockRefNR         = SQL_S3_rows[o].StockRefNR;
                    var IntakePalletLine_SupplierAdressNR   = SQL_S3_rows[o].SupplierAdressNR;
                    var IntakePalletLine_TimCreate          = SQL_S3_rows[o].TimCreate;
                    var IntakePalletLine_WareHouseRef       = SQL_S3_rows[o].WareHouseRef;
                    var IntakePalletLine_CreateDateTime     = SQL_S3_rows[o].CreateDateTime;
                    var IntakePalletLine_UpdateDateTime     = SQL_S3_rows[o].UpdateDateTime;
                    var IntakePalletLine_CreateBy           = SQL_S3_rows[o].CreateBy;
                    var IntakePalletLine_UpdateBy           = SQL_S3_rows[o].UpdateBy;

                    var PalletLine_Form = PalletLine_Template;

                    PalletLine_Form = PalletLine_Form.replace("I_ID", IntakePalletLine_ID);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERID", IntakePalletLine_OrderID);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERLINEID", IntakePalletLine_OrderLineID);
                    PalletLine_Form = PalletLine_Form.replace("I_INBOUNDOROUTBOUND", IntakePalletLine_InboundOrOutbound);
                    PalletLine_Form = PalletLine_Form.replace("I_ORDERTYPE", IntakePalletLine_OrderType);
                    PalletLine_Form = PalletLine_Form.replace("I_STOCKNR", IntakePalletLine_StockNr);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEEXP", IntakePalletLine_BarcodeEXP);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEID", IntakePalletLine_BarcodeID);
                    PalletLine_Form = PalletLine_Form.replace("I_BARCODEIDINTERNAL", IntakePalletLine_BarcodeIDInternal);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF1", IntakePalletLine_CalcRef1);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF2", IntakePalletLine_CalcRef2);
                    PalletLine_Form = PalletLine_Form.replace("I_CALCREF3", IntakePalletLine_CalcRef3);
                    PalletLine_Form = PalletLine_Form.replace("I_CARRIER", IntakePalletLine_Carrier);
                    PalletLine_Form = PalletLine_Form.replace("I_CARRIERCODE", IntakePalletLine_CarrierCode);
                    PalletLine_Form = PalletLine_Form.replace("I_COMPANYCODE", IntakePalletLine_CompanyCode);
                    PalletLine_Form = PalletLine_Form.replace("I_DAMAGENR", IntakePalletLine_DamageNR);
                    PalletLine_Form = PalletLine_Form.replace("I_DT_CREATE", IntakePalletLine_DT_Create);
                    PalletLine_Form = PalletLine_Form.replace("I_DT_MUTATION", IntakePalletLine_DT_Mutation);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK1", IntakePalletLine_EDIStock1);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK2", IntakePalletLine_EDIStock2);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK3", IntakePalletLine_EDIStock3);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK4", IntakePalletLine_EDIStock4);
                    PalletLine_Form = PalletLine_Form.replace("I_EDISTOCK5", IntakePalletLine_EDIStock5);
                    PalletLine_Form = PalletLine_Form.replace("I_GROSSWEIGHT", IntakePalletLine_GrossWeight);
                    PalletLine_Form = PalletLine_Form.replace("I_GROSSWEIGHTCODE", IntakePalletLine_GrossWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("I_INLINENR", IntakePalletLine_InLineNR);
                    PalletLine_Form = PalletLine_Form.replace("I_INORDERNR", IntakePalletLine_InOrderNR);
                    PalletLine_Form = PalletLine_Form.replace("I_INDACTIVE", IntakePalletLine_IndActive);
                    PalletLine_Form = PalletLine_Form.replace("I_INDBLOCKED", IntakePalletLine_IndBlocked);
                    PalletLine_Form = PalletLine_Form.replace("I_NETTWEIGHT", IntakePalletLine_NettWeight);
                    PalletLine_Form = PalletLine_Form.replace("I_NETTWEIGHTCODE", IntakePalletLine_NettWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("I_OUTERPCK", IntakePalletLine_OuterPCK);
                    PalletLine_Form = PalletLine_Form.replace("I_OUTERPCKCODE", IntakePalletLine_OuterPCKCode);
                    PalletLine_Form = PalletLine_Form.replace("I_PACKTYPECODE", IntakePalletLine_PackTypeCode);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF1", IntakePalletLine_ProdRef1);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF2", IntakePalletLine_ProdRef2);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF3", IntakePalletLine_ProdRef3);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF4", IntakePalletLine_ProdRef4);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODREF5", IntakePalletLine_ProdRef5);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODUCTID", IntakePalletLine_ProductID);
                    PalletLine_Form = PalletLine_Form.replace("I_PRODUCTGROUPCODE", IntakePalletLine_ProductGroupCode);
                    PalletLine_Form = PalletLine_Form.replace("I_STOCKREFNR", IntakePalletLine_StockRefNR);
                    PalletLine_Form = PalletLine_Form.replace("I_SUPPLIERADDRESSNR", IntakePalletLine_SupplierAdressNR);
                    PalletLine_Form = PalletLine_Form.replace("I_TIMCREATE", IntakePalletLine_TimCreate);
                    PalletLine_Form = PalletLine_Form.replace("I_WAREHOUSEREF", IntakePalletLine_WareHouseRef);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_CREATEDATETIME", IntakePalletLine_CreateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_UPDATEDATETIME", IntakePalletLine_UpdateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_CREATEBY", IntakePalletLine_CreateBy);
                    PalletLine_Form = PalletLine_Form.replace("I_DB_UPDATEBY", IntakePalletLine_UpdateBy);

                    ResponseMessage_PalletLine = ResponseMessage_PalletLine + PalletLine_Form;
                }

                OrderLine_Callback(ResponseMessage_PalletLine);

            } catch (TryCatchError_S3) {
                console.error("f Process_Create_SoftPak_Message_Inbound_PalletLine - TryCatchError_S3: " + TryCatchError_S3);
            }
        }
    });
}

function Process_Create_SoftPak_Message_Outbound() {
    //Create the select statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorder` WHERE `OrderType` = "OUTCREATE" AND `ConfirmationSend` = "' + 0 + '" AND ID = "23"';

    console.log(SQL_Select_S1_Statement);

    //Connect to the SQL Database
    con.connect;

    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Outbound - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var OuttakeOrder_ID                     = SQL_S1_rows[i].ID;
                    var OuttakeOrder_OrderNR                = SQL_S1_rows[i].OrderNR;
                    var OuttakeOrder_CompanyCode            = SQL_S1_rows[i].CompanyCode;
                    var OuttakeOrder_ContainerTypeCode      = SQL_S1_rows[i].ContainerTypeCode;
                    var OuttakeOrder_ContainerNR            = SQL_S1_rows[i].ContainerNR;
                    var OuttakeOrder_CustRef1               = SQL_S1_rows[i].CustRef1;
                    var OuttakeOrder_CustRef2               = SQL_S1_rows[i].CustRef2;
                    var OuttakeOrder_CustRef3               = SQL_S1_rows[i].CustRef3;
                    var OuttakeOrder_CustRef4               = SQL_S1_rows[i].CustRef4;
                    var OuttakeOrder_CustRef5               = SQL_S1_rows[i].CustRef5;
                    var OuttakeOrder_CustRef6               = SQL_S1_rows[i].CustRef6;
                    var OuttakeOrder_CustRef7               = SQL_S1_rows[i].CustRef7;
                    var OuttakeOrder_CustRef8               = SQL_S1_rows[i].CustRef8;
                    var OuttakeOrder_DeliveryAddressNR      = SQL_S1_rows[i].DeliveryAddressNR;
                    var OuttakeOrder_DeliveryName           = SQL_S1_rows[i].DeliveryName;
                    var OuttakeOrder_DeliveryZipCode        = SQL_S1_rows[i].DeliveryZipCode;
                    var OuttakeOrder_DestinationCountryCode = SQL_S1_rows[i].DestinationCountryCode;
                    var OuttakeOrder_DTCreate               = SQL_S1_rows[i].DTCreate;
                    var OuttakeOrder_DTDelivery             = SQL_S1_rows[i].DTDelivery;
                    var OuttakeOrder_DTDeliveryTo           = SQL_S1_rows[i].DTDeliveryTo;
                    var OuttakeOrder_TDLoading              = SQL_S1_rows[i].TDLoading;
                    var OuttakeOrder_TDUpdate               = SQL_S1_rows[i].TDUpdate;
                    var OuttakeOrder_EDIOrd1                = SQL_S1_rows[i].EDIOrd1;
                    var OuttakeOrder_EDIOrd2                = SQL_S1_rows[i].EDIOrd2;
                    var OuttakeOrder_EDIOrd3                = SQL_S1_rows[i].EDIOrd3;
                    var OuttakeOrder_EDIOrd4                = SQL_S1_rows[i].EDIOrd4;
                    var OuttakeOrder_EDIOrd5                = SQL_S1_rows[i].EDIOrd5;
                    var OuttakeOrder_ExtEDIOrderText        = SQL_S1_rows[i].ExtEDIOrderText;
                    var OuttakeOrder_LineCode               = SQL_S1_rows[i].LineCode;
                    var OuttakeOrder_LocTerminal            = SQL_S1_rows[i].LocTerminal;
                    var OuttakeOrder_ProjectNR              = SQL_S1_rows[i].ProjectNR;
                    var OuttakeOrder_RecAddressNR           = SQL_S1_rows[i].RecAddressNR;
                    var OuttakeOrder_SealNO                 = SQL_S1_rows[i].SealNO;
                    var OuttakeOrder_StatusCode             = SQL_S1_rows[i].StatusCode;
                    var OuttakeOrder_TimCreate              = SQL_S1_rows[i].TimCreate;
                    var OuttakeOrder_TimDelivery            = SQL_S1_rows[i].TimDelivery;
                    var OuttakeOrder_TimDeliveryTo          = SQL_S1_rows[i].TimDeliveryTo;
                    var OuttakeOrder_TimLoading             = SQL_S1_rows[i].TimLoading;
                    var OuttakeOrder_TimUpdated             = SQL_S1_rows[i].TimUpdated;
                    var OuttakeOrder_TransPorterAddressNR   = SQL_S1_rows[i].TransPorterAddressNR;
                    var OuttakeOrder_TransPortNR            = SQL_S1_rows[i].TransPortNR;
                    var OuttakeOrder_TransPortUnitCode      = SQL_S1_rows[i].TransPortUnitCode;
                    var OuttakeOrder_ConfirmationSend       = SQL_S1_rows[i].ConfirmationSend;
                    var OuttakeOrder_OrderType              = SQL_S1_rows[i].OrderType;
                    var OuttakeOrder_ReponseMessageLanguage = SQL_S1_rows[i].ReponseMessageLanguage;
                    var OuttakeOrder_CreateDateTime         = SQL_S1_rows[i].CreateDateTime;
                    var OuttakeOrder_UpdateDateTime         = SQL_S1_rows[i].UpdateDateTime;
                    var OuttakeOrder_CreateBy               = SQL_S1_rows[i].CreateBy;
                    var OuttakeOrder_UpdateBy               = SQL_S1_rows[i].UpdateBy;

                    if (OuttakeOrder_ID == null | OuttakeOrder_ID == "null") {
                        OuttakeOrder_ID = "";
                    }
                    if (OuttakeOrder_OrderNR == null | OuttakeOrder_OrderNR == "null") {
                        OuttakeOrder_OrderNR = "";
                    }
                    if (OuttakeOrder_CompanyCode == null | OuttakeOrder_CompanyCode == "null") {
                        OuttakeOrder_CompanyCode = "";
                    }
                    if (OuttakeOrder_ContainerTypeCode == null | OuttakeOrder_ContainerTypeCode == "null") {
                        OuttakeOrder_ContainerTypeCode = "";
                    }
                    if (OuttakeOrder_ContainerNR == null | OuttakeOrder_ContainerNR == "null") {
                        OuttakeOrder_ContainerNR = "";
                    }
                    if (OuttakeOrder_CustRef1 == null | OuttakeOrder_CustRef1 == "null") {
                        OuttakeOrder_CustRef1 = "";
                    }
                    if (OuttakeOrder_CustRef2 == null | OuttakeOrder_CustRef2 == "null") {
                        OuttakeOrder_CustRef2 = "";
                    }
                    if (OuttakeOrder_CustRef3 == null | OuttakeOrder_CustRef3 == "null") {
                        OuttakeOrder_CustRef3 = "";
                    }
                    if (OuttakeOrder_CustRef4 == null | OuttakeOrder_CustRef4 == "null") {
                        OuttakeOrder_CustRef4 = "";
                    }
                    if (OuttakeOrder_CustRef5 == null | OuttakeOrder_CustRef5 == "null") {
                        OuttakeOrder_CustRef5 = "";
                    }
                    if (OuttakeOrder_CustRef6 == null | OuttakeOrder_CustRef6 == "null") {
                        OuttakeOrder_CustRef6 = "";
                    }
                    if (OuttakeOrder_CustRef7 == null | OuttakeOrder_CustRef7 == "null") {
                        OuttakeOrder_CustRef7 = "";
                    }
                    if (OuttakeOrder_CustRef8 == null | OuttakeOrder_CustRef8 == "null") {
                        OuttakeOrder_CustRef8 = "";
                    }
                    if (OuttakeOrder_DeliveryAddressNR == null | OuttakeOrder_DeliveryAddressNR == "null") {
                        OuttakeOrder_DeliveryAddressNR = "";
                    }
                    if (OuttakeOrder_DeliveryName == null | OuttakeOrder_DeliveryName == "null") {
                        OuttakeOrder_DeliveryName = "";
                    }
                    if (OuttakeOrder_DeliveryZipCode == null | OuttakeOrder_DeliveryZipCode == "null") {
                        OuttakeOrder_DeliveryZipCode = "";
                    }
                    if (OuttakeOrder_DestinationCountryCode == null | OuttakeOrder_DestinationCountryCode == "null") {
                        OuttakeOrder_DestinationCountryCode = "";
                    }
                    if (OuttakeOrder_DTCreate == null | OuttakeOrder_DTCreate == "null") {
                        OuttakeOrder_DTCreate = "";
                    }
                    if (OuttakeOrder_DTDelivery == null | OuttakeOrder_DTDelivery == "null") {
                        OuttakeOrder_DTDelivery = "";
                    }
                    if (OuttakeOrder_DTDeliveryTo == null | OuttakeOrder_DTDeliveryTo == "null") {
                        OuttakeOrder_DTDeliveryTo = "";
                    }
                    if (OuttakeOrder_TDLoading == null | OuttakeOrder_TDLoading == "null") {
                        OuttakeOrder_TDLoading = "";
                    }
                    if (OuttakeOrder_TDUpdate == null | OuttakeOrder_TDUpdate == "null") {
                        OuttakeOrder_TDUpdate = "";
                    }
                    if (OuttakeOrder_EDIOrd1 == null | OuttakeOrder_EDIOrd1 == "null") {
                        OuttakeOrder_EDIOrd1 = "";
                    }
                    if (OuttakeOrder_EDIOrd2 == null | OuttakeOrder_EDIOrd2 == "null") {
                        OuttakeOrder_EDIOrd2 = "";
                    }
                    if (OuttakeOrder_EDIOrd3 == null | OuttakeOrder_EDIOrd3 == "null") {
                        OuttakeOrder_EDIOrd3 = "";
                    }
                    if (OuttakeOrder_EDIOrd4 == null | OuttakeOrder_EDIOrd4 == "null") {
                        OuttakeOrder_EDIOrd4 = "";
                    }
                    if (OuttakeOrder_EDIOrd5 == null | OuttakeOrder_EDIOrd5 == "null") {
                        OuttakeOrder_EDIOrd5 = "";
                    }
                    if (OuttakeOrder_ExtEDIOrderText == null | OuttakeOrder_ExtEDIOrderText == "null") {
                        OuttakeOrder_ExtEDIOrderText = "";
                    }
                    if (OuttakeOrder_LineCode == null | OuttakeOrder_LineCode == "null") {
                        OuttakeOrder_LineCode = "";
                    }
                    if (OuttakeOrder_LocTerminal == null | OuttakeOrder_LocTerminal == "null") {
                        OuttakeOrder_LocTerminal = "";
                    }
                    if (OuttakeOrder_ProjectNR == null | OuttakeOrder_ProjectNR == "null") {
                        OuttakeOrder_ProjectNR = "";
                    }
                    if (OuttakeOrder_RecAddressNR == null | OuttakeOrder_RecAddressNR == "null") {
                        OuttakeOrder_RecAddressNR = "";
                    }
                    if (OuttakeOrder_SealNO == null | OuttakeOrder_SealNO == "null") {
                        OuttakeOrder_SealNO = "";
                    }
                    if (OuttakeOrder_StatusCode == null | OuttakeOrder_StatusCode == "null") {
                        OuttakeOrder_StatusCode = "";
                    }
                    if (OuttakeOrder_TimCreate == null | OuttakeOrder_TimCreate == "null") {
                        OuttakeOrder_TimCreate = "";
                    }
                    if (OuttakeOrder_TimDelivery == null | OuttakeOrder_TimDelivery == "null") {
                        OuttakeOrder_TimDelivery = "";
                    }
                    if (OuttakeOrder_TimDeliveryTo == null | OuttakeOrder_TimDeliveryTo == "null") {
                        OuttakeOrder_TimDeliveryTo = "";
                    }
                    if (OuttakeOrder_TimLoading == null | OuttakeOrder_TimLoading == "null") {
                        OuttakeOrder_TimLoading = "";
                    }
                    if (OuttakeOrder_TimUpdated == null | OuttakeOrder_TimUpdated == "null") {
                        OuttakeOrder_TimUpdated = "";
                    }
                    if (OuttakeOrder_TransPorterAddressNR == null | OuttakeOrder_TransPorterAddressNR == "null") {
                        OuttakeOrder_TransPorterAddressNR = "";
                    }
                    if (OuttakeOrder_TransPortNR == null | OuttakeOrder_TransPortNR == "null") {
                        OuttakeOrder_TransPortNR = "";
                    }
                    if (OuttakeOrder_TransPortUnitCode == null | OuttakeOrder_TransPortUnitCode == "null") {
                        OuttakeOrder_TransPortUnitCode = "";
                    }
                    if (OuttakeOrder_ConfirmationSend == null | OuttakeOrder_ConfirmationSend == "null") {
                        OuttakeOrder_ConfirmationSend = "";
                    }
                    if (OuttakeOrder_OrderType == null | OuttakeOrder_OrderType == "null") {
                        OuttakeOrder_OrderType = "";
                    }
                    if (OuttakeOrder_ReponseMessageLanguage == null | OuttakeOrder_ReponseMessageLanguage == "null") {
                        OuttakeOrder_ReponseMessageLanguage = "";
                    }
                    if (OuttakeOrder_CreateDateTime == null | OuttakeOrder_CreateDateTime == "null") {
                        OuttakeOrder_CreateDateTime = "";
                    }
                    if (OuttakeOrder_UpdateDateTime == null | OuttakeOrder_UpdateDateTime == "null") {
                        OuttakeOrder_UpdateDateTime = "";
                    }
                    if (OuttakeOrder_CreateBy == null | OuttakeOrder_CreateBy == "null") {
                        OuttakeOrder_CreateBy = "";
                    }
                    if (OuttakeOrder_UpdateBy == null | OuttakeOrder_UpdateBy == "null") {
                        OuttakeOrder_UpdateBy = "";
                    }

                    RetrievTemplate(1, 0, "Order", function(Template_Order_Request_Result){
                        var Order_Template = Template_Order_Request_Result;
                        RetrievTemplate(1, 0, "OrderLine", function(Template_OrderLine_Request_Result){
                            var Orderline_Template = Template_OrderLine_Request_Result;
                            RetrievTemplate(1, 0, "PalletLine", function(Template_PalletLine_Request_Result){
                                var PalletLine_Template = Template_PalletLine_Request_Result;

                                if (Order_Template != "SQLError_NoDataFound" || Orderline_Template != "SQLError_NoDataFound" || PalletLine_Template != "SQLError_NoDataFound") {
                                    
                                    Process_Create_SoftPak_Message_Outbound_OrderLine(OuttakeOrder_ID, OuttakeOrder_OrderNR, OuttakeOrder_OrderType, Orderline_Template, PalletLine_Template, function(ResponseMessage_Orderline){
                                        Order_Form = Order_Template;
                                
                                        Order_Form = Order_Form.replace("O_ID", OuttakeOrder_ID);
                                        Order_Form = Order_Form.replace("O_ORDERNR", OuttakeOrder_OrderNR);
                                        Order_Form = Order_Form.replace("O_COMPANYCODE", OuttakeOrder_CompanyCode);
                                        Order_Form = Order_Form.replace("O_CONTAINERTYPECODE", OuttakeOrder_ContainerTypeCode);
                                        Order_Form = Order_Form.replace("O_CONTAINERNR", OuttakeOrder_ContainerNR);
                                        Order_Form = Order_Form.replace("O_CUSTREF1", OuttakeOrder_CustRef1);
                                        Order_Form = Order_Form.replace("O_CUSTREF2", OuttakeOrder_CustRef2);
                                        Order_Form = Order_Form.replace("O_CUSTREF3", OuttakeOrder_CustRef3);
                                        Order_Form = Order_Form.replace("O_CUSTREF4", OuttakeOrder_CustRef4);
                                        Order_Form = Order_Form.replace("O_CUSTREF5", OuttakeOrder_CustRef5);
                                        Order_Form = Order_Form.replace("O_CUSTREF6", OuttakeOrder_CustRef6);
                                        Order_Form = Order_Form.replace("O_CUSTREF7", OuttakeOrder_CustRef7);
                                        Order_Form = Order_Form.replace("O_CUSTREF8", OuttakeOrder_CustRef8);
                                        Order_Form = Order_Form.replace("O_DELIVERYADDRESSNR", OuttakeOrder_DeliveryAddressNR);
                                        Order_Form = Order_Form.replace("O_DELIVERYNAME", OuttakeOrder_DeliveryName);
                                        Order_Form = Order_Form.replace("O_DELIVERYZIPCODE", OuttakeOrder_DeliveryZipCode);
                                        Order_Form = Order_Form.replace("O_DESTINATIONCOUNTRYCODE", OuttakeOrder_DestinationCountryCode);
                                        Order_Form = Order_Form.replace("O_DTCREATE", OuttakeOrder_DTCreate);
                                        Order_Form = Order_Form.replace("O_DTDELIVERY", OuttakeOrder_DTDelivery);
                                        Order_Form = Order_Form.replace("O_DTDELIVERYTO", OuttakeOrder_DTDeliveryTo);
                                        Order_Form = Order_Form.replace("O_TDLOADING", OuttakeOrder_TDLoading);
                                        Order_Form = Order_Form.replace("O_TDUPDATE", OuttakeOrder_TDUpdate);
                                        Order_Form = Order_Form.replace("O_EDIORD1", OuttakeOrder_EDIOrd1);
                                        Order_Form = Order_Form.replace("O_EDIORD2", OuttakeOrder_EDIOrd2);
                                        Order_Form = Order_Form.replace("O_EDIORD3", OuttakeOrder_EDIOrd3);
                                        Order_Form = Order_Form.replace("O_EDIORD4", OuttakeOrder_EDIOrd4);
                                        Order_Form = Order_Form.replace("O_EDIORD5", OuttakeOrder_EDIOrd5);
                                        Order_Form = Order_Form.replace("O_EXTEDIORDERTEXT", OuttakeOrder_ExtEDIOrderText);
                                        Order_Form = Order_Form.replace("O_LINECODE", OuttakeOrder_LineCode);
                                        Order_Form = Order_Form.replace("O_LOCTERMINAL", OuttakeOrder_LocTerminal);
                                        Order_Form = Order_Form.replace("O_PROJECTNR", OuttakeOrder_ProjectNR);
                                        Order_Form = Order_Form.replace("O_RECADDRESSNR", OuttakeOrder_RecAddressNR);
                                        Order_Form = Order_Form.replace("O_SEALNO", OuttakeOrder_SealNO);
                                        Order_Form = Order_Form.replace("O_STATUSCODE", OuttakeOrder_StatusCode);
                                        Order_Form = Order_Form.replace("O_TIMCREATE", OuttakeOrder_TimCreate);
                                        Order_Form = Order_Form.replace("O_TIMDELIVERY", OuttakeOrder_TimDelivery);
                                        Order_Form = Order_Form.replace("O_TIMDELIVERYTO", OuttakeOrder_TimDeliveryTo);
                                        Order_Form = Order_Form.replace("O_TIMLOADING", OuttakeOrder_TimLoading);
                                        Order_Form = Order_Form.replace("O_TIMUPDATED", OuttakeOrder_TimUpdated);
                                        Order_Form = Order_Form.replace("O_TRANSPORTADDRESSNR", OuttakeOrder_TransPorterAddressNR);
                                        Order_Form = Order_Form.replace("O_TRANSPORTNR", OuttakeOrder_TransPortNR);
                                        Order_Form = Order_Form.replace("O_TRANSPORTUNITCODE", OuttakeOrder_TransPortUnitCode);
                                        Order_Form = Order_Form.replace("O_CONFIRMATIONSEND", OuttakeOrder_ConfirmationSend);
                                        Order_Form = Order_Form.replace("O_ORDERTYPE", OuttakeOrder_OrderType);
                                        Order_Form = Order_Form.replace("O_RESPONSEMESSAGELANGUAGE", OuttakeOrder_ReponseMessageLanguage);
                                        Order_Form = Order_Form.replace("O_CREATEDATETIME", OuttakeOrder_CreateDateTime);
                                        Order_Form = Order_Form.replace("O_UPDATEDATETIME", OuttakeOrder_UpdateDateTime);
                                        Order_Form = Order_Form.replace("O_CREATEBY", OuttakeOrder_CreateBy);
                                        Order_Form = Order_Form.replace("O_UPDATEBY", OuttakeOrder_UpdateBy);

                                        Order_Form = Order_Form.replace("O_ORDERLINE", ResponseMessage_Orderline);

                                        console.log("Order file output:");
                                        console.log("-----------------------------------------------------");
                                        console.log(Order_Form);
                                    });
                                }
                            });
                        });
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f Process_Create_SoftPak_Message_Outbound - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_Create_SoftPak_Message_Outbound_OrderLine(OuttakeOrder_ID, OuttakeOrder_OrderNR, OuttakeOrder_OrderType, Orderline_Template, PalletLine_Template, Order_Callback) {
    //Create the SQL Select Statement for the orderlines
    var SQL_Select_S2_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorderline` WHERE `OrderID` = "' + OuttakeOrder_ID + '" AND `OrderType` = "' + OuttakeOrder_OrderType + '"';

    console.log(SQL_Select_S2_Statement);

    con.query(SQL_Select_S2_Statement, async function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
        //Check if there are any error messages
        if (SQL_S2_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Outbound_OrderLine - SQL S2 Error: " + SQL_S2_err);
        } else {
            try {
                var ResponseMessage_Orderline = '';

                for (var e = 0; e < SQL_S2_rows.length; e++) {

                    var OuttakeOrderLine_ID                     = SQL_S2_rows[e].ID;
                    var OuttakeOrderLine_OrderID                = SQL_S2_rows[e].OrderID;
                    var OuttakeOrderLine_OrderType              = SQL_S2_rows[e].OrderType;
                    var OuttakeOrderLine_OrderNR                = SQL_S2_rows[e].OrderNR;
                    var OuttakeOrderLine_LineNR                 = SQL_S2_rows[e].LineNR;
                    var OuttakeOrderLine_Carrier                = SQL_S2_rows[e].Carrier;
                    var OuttakeOrderLine_CarrierCode            = SQL_S2_rows[e].CarrierCode;
                    var OuttakeOrderLine_CompanyCode            = SQL_S2_rows[e].CompanyCode;
                    var OuttakeOrderLine_ContainerTypeCode      = SQL_S2_rows[e].ContainerTypeCode;
                    var OuttakeOrderLine_ContainerNR            = SQL_S2_rows[e].ContainerNR;
                    var OuttakeOrderLine_CustAddressNR          = SQL_S2_rows[e].CustAddressNR;
                    var OuttakeOrderLine_CustProductCode        = SQL_S2_rows[e].CustProductCode;
                    var OuttakeOrderLine_CustRef1               = SQL_S2_rows[e].CustRef1;
                    var OuttakeOrderLine_CustRef2               = SQL_S2_rows[e].CustRef2;
                    var OuttakeOrderLine_CustRef3               = SQL_S2_rows[e].CustRef3;
                    var OuttakeOrderLine_DeliveryAddress        = SQL_S2_rows[e].DeliveryAddress;
                    var OuttakeOrderLine_DeliveryAddressNR      = SQL_S2_rows[e].DeliveryAddressNR;
                    var OuttakeOrderLine_DeliveryDate           = SQL_S2_rows[e].DeliveryDate;
                    var OuttakeOrderLine_EDILine1               = SQL_S2_rows[e].EDILine1;
                    var OuttakeOrderLine_EDILine2               = SQL_S2_rows[e].EDILine2;
                    var OuttakeOrderLine_EDILine3               = SQL_S2_rows[e].EDILine3;
                    var OuttakeOrderLine_EDILine4               = SQL_S2_rows[e].EDILine4;
                    var OuttakeOrderLine_EDILine5               = SQL_S2_rows[e].EDILine5;
                    var OuttakeOrderLine_ExtEDILineText         = SQL_S2_rows[e].ExtEDILineText;
                    var OuttakeOrderLine_GrossWeight            = SQL_S2_rows[e].GrossWeight;
                    var OuttakeOrderLine_GrossWeightCode        = SQL_S2_rows[e].GrossWeightCode;
                    var OuttakeOrderLine_NettWeight             = SQL_S2_rows[e].NettWeight;
                    var OuttakeOrderLine_NettWeightCode         = SQL_S2_rows[e].NettWeightCode;
                    var OuttakeOrderLine_OuterPCK               = SQL_S2_rows[e].OuterPCK;
                    var OuttakeOrderLine_OuterPCKCode           = SQL_S2_rows[e].OuterPCKCode;
                    var OuttakeOrderLine_PackTypeCode           = SQL_S2_rows[e].PackTypeCode;
                    var OuttakeOrderLine_ProdRef1               = SQL_S2_rows[e].ProdRef1;
                    var OuttakeOrderLine_ProdRef2               = SQL_S2_rows[e].ProdRef2;
                    var OuttakeOrderLine_ProdRef3               = SQL_S2_rows[e].ProdRef3;
                    var OuttakeOrderLine_ProdRef4               = SQL_S2_rows[e].ProdRef4;
                    var OuttakeOrderLine_ProdRef5               = SQL_S2_rows[e].ProdRef5;
                    var OuttakeOrderLine_ProductID              = SQL_S2_rows[e].ProductID;
                    var OuttakeOrderLine_ProductGroupCode       = SQL_S2_rows[e].ProductGroupCode;
                    var OuttakeOrderLine_QtyControlCode         = SQL_S2_rows[e].QtyControlCode;
                    var OuttakeOrderLine_RecAddressNR           = SQL_S2_rows[e].RecAddressNR;
                    var OuttakeOrderLine_Remarks                = SQL_S2_rows[e].Remarks;
                    var OuttakeOrderLine_StockRefNR             = SQL_S2_rows[e].StockRefNR;
                    var OuttakeOrderLine_SupplierAddressNR      = SQL_S2_rows[e].SupplierAddressNR;
                    var OuttakeOrderLine_TermPlace              = SQL_S2_rows[e].TermPlace;
                    var OuttakeOrderLine_TermCode               = SQL_S2_rows[e].TermCode;
                    var OuttakeOrderLine_TransActionCustomerRef = SQL_S2_rows[e].TransActionCustomerRef;
                    var OuttakeOrderLine_WareHouseRef           = SQL_S2_rows[e].WareHouseRef;
                    var OuttakeOrderLine_CreateDateTime         = SQL_S2_rows[e].CreateDateTime;
                    var OuttakeOrderLine_UpdateDateTime         = SQL_S2_rows[e].UpdateDateTime;
                    var OuttakeOrderLine_CreateBy               = SQL_S2_rows[e].CreateBy;
                    var OuttakeOrderLine_UpdateBy               = SQL_S2_rows[e].UpdateBy;

                    // console.log(Orderline_Template);

                    await Process_Create_SoftPak_Message_Outbound_PalletLine(OuttakeOrder_ID, OuttakeOrder_OrderType, OuttakeOrderLine_ID, PalletLine_Template, function(ResponseMessage_PalletLine){
                        var OrderLine_Form = Orderline_Template;

                        // console.log(OrderLine_Form);
                        OrderLine_Form = OrderLine_Form.replace("O_ID", OuttakeOrderLine_ID);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERID", OuttakeOrderLine_OrderID);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERTYPE", OuttakeOrderLine_OrderType);
                        OrderLine_Form = OrderLine_Form.replace("O_ORDERNR", OuttakeOrderLine_OrderNR);
                        OrderLine_Form = OrderLine_Form.replace("O_LINENR", OuttakeOrderLine_LineNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CARRIER", OuttakeOrderLine_Carrier);
                        OrderLine_Form = OrderLine_Form.replace("O_CARRIERCODE", OuttakeOrderLine_CarrierCode);
                        OrderLine_Form = OrderLine_Form.replace("O_COMPANYCODE", OuttakeOrderLine_CompanyCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CONTAINERTYPECODE", OuttakeOrderLine_ContainerTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CONTAINERNR", OuttakeOrderLine_ContainerNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTADDRESSNR", OuttakeOrderLine_CustAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTPRODUCTCODE", OuttakeOrderLine_CustProductCode);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF1", OuttakeOrderLine_CustRef1);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF2", OuttakeOrderLine_CustRef2);
                        OrderLine_Form = OrderLine_Form.replace("O_CUSTREF3", OuttakeOrderLine_CustRef3);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYADDRESS", OuttakeOrderLine_DeliveryAddress);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYADDRESSNR", OuttakeOrderLine_DeliveryAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_DELIVERYDATE", OuttakeOrderLine_DeliveryDate);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE1", OuttakeOrderLine_EDILine1);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE2", OuttakeOrderLine_EDILine2);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE3", OuttakeOrderLine_EDILine3);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE4", OuttakeOrderLine_EDILine4);
                        OrderLine_Form = OrderLine_Form.replace("O_EDILINE5", OuttakeOrderLine_EDILine5);
                        OrderLine_Form = OrderLine_Form.replace("O_EXTEDILINETEXT", OuttakeOrderLine_ExtEDILineText);
                        OrderLine_Form = OrderLine_Form.replace("O_GROSSWEIGHT", OuttakeOrderLine_GrossWeight);
                        OrderLine_Form = OrderLine_Form.replace("O_GROSSWEIGHTCODE", OuttakeOrderLine_GrossWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("O_NETTWEIGHT", OuttakeOrderLine_NettWeight);
                        OrderLine_Form = OrderLine_Form.replace("O_NETTWEIGHTCODE", OuttakeOrderLine_NettWeightCode);
                        OrderLine_Form = OrderLine_Form.replace("O_OUTERPCK", OuttakeOrderLine_OuterPCK);
                        OrderLine_Form = OrderLine_Form.replace("O_OUTERPCKCODE", OuttakeOrderLine_OuterPCKCode);
                        OrderLine_Form = OrderLine_Form.replace("O_PACKTYPECODE", OuttakeOrderLine_PackTypeCode);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF1", OuttakeOrderLine_ProdRef1);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF2", OuttakeOrderLine_ProdRef2);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF3", OuttakeOrderLine_ProdRef3);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF4", OuttakeOrderLine_ProdRef4);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODREF5", OuttakeOrderLine_ProdRef5);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODUCTID", OuttakeOrderLine_ProductID);
                        OrderLine_Form = OrderLine_Form.replace("O_PRODUCTGROUPCODE", OuttakeOrderLine_ProductGroupCode);
                        OrderLine_Form = OrderLine_Form.replace("O_QTYCONTROLCODE", OuttakeOrderLine_QtyControlCode);
                        OrderLine_Form = OrderLine_Form.replace("O_RECADDRESSNR", OuttakeOrderLine_RecAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_REMARKS", OuttakeOrderLine_Remarks);
                        OrderLine_Form = OrderLine_Form.replace("O_STOCKREFNR", OuttakeOrderLine_StockRefNR);
                        OrderLine_Form = OrderLine_Form.replace("O_SUPPLIERADDRESSNR", OuttakeOrderLine_SupplierAddressNR);
                        OrderLine_Form = OrderLine_Form.replace("O_TERMPLACE", OuttakeOrderLine_TermPlace);
                        OrderLine_Form = OrderLine_Form.replace("O_TERMCODE", OuttakeOrderLine_TermCode);
                        OrderLine_Form = OrderLine_Form.replace("O_TRANSACTIONCUSTOMERREF", OuttakeOrderLine_TransActionCustomerRef);
                        OrderLine_Form = OrderLine_Form.replace("O_WAREHOUSEREF", OuttakeOrderLine_WareHouseRef);
                        OrderLine_Form = OrderLine_Form.replace("O_CREATEDATETIME", OuttakeOrderLine_CreateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("O_UPDATEDATETIME", OuttakeOrderLine_UpdateDateTime);
                        OrderLine_Form = OrderLine_Form.replace("O_CREATEBY", OuttakeOrderLine_CreateBy);
                        OrderLine_Form = OrderLine_Form.replace("O_UPDATEBY", OuttakeOrderLine_UpdateBy);

                        OrderLine_Form = OrderLine_Form.replace("O_PALLETLINE", ResponseMessage_PalletLine);

                        console.log(OrderLine_Form);
                                               
                        ResponseMessage_Orderline = ResponseMessage_Orderline + OrderLine_Form;

                        if(e == SQL_S2_rows.length) {
                            Order_Callback(ResponseMessage_Orderline);
                        }
                    });
                }

            } catch (TryCatchError_S2) {
                console.error("f Process_Create_SoftPak_Message_Outbound_OrderLine - TryCatchError_S2: " + TryCatchError_S2);
            }
        }
    });
}

function Process_Create_SoftPak_Message_Outbound_PalletLine(OuttakeOrder_ID, OuttakeOrder_OrderType, OuttakeOrderLine_ID, PalletLine_Template, OrderLine_Callback) {
    //Create a SQL Select statement for the Palletlines
    var SQL_Select_S3_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`palletline` WHERE `OrderID` = "' + OuttakeOrder_ID + '" AND `OrderLineID` = "' + OuttakeOrderLine_ID + '" AND `OrderType` = "' + OuttakeOrder_OrderType + '"';

    con.query(SQL_Select_S3_Statement, function (SQL_S3_err, SQL_S3_rows, SQL_S3_fields) {
        //Check if there are any error messages
        if (SQL_S3_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Create_SoftPak_Message_Outbound_PalletLine - SQL S3 Error: " + SQL_S3_err);
        } else {
            try {
                ResponseMessage_PalletLine = '';

                for (var o = 0; o < SQL_S3_rows.length; o++) {
                    var OuttakePalletLine_ID                 = SQL_S3_rows[o].ID;
                    var OuttakePalletLine_OrderID            = SQL_S3_rows[o].OrderID;
                    var OuttakePalletLine_OrderLineID        = SQL_S3_rows[o].OrderLineID;
                    var OuttakePalletLine_OrderType          = SQL_S3_rows[o].OrderType;
                    var OuttakePalletLine_InboundOrOutbound  = SQL_S3_rows[o].InboundOrOutbound;
                    var OuttakePalletLine_StockNr            = SQL_S3_rows[o].StockNr;
                    var OuttakePalletLine_BarcodeEXP         = SQL_S3_rows[o].BarcodeEXP;
                    var OuttakePalletLine_BarcodeID          = SQL_S3_rows[o].BarcodeID;
                    var OuttakePalletLine_BarcodeIDInternal  = SQL_S3_rows[o].BarcodeIDInternal;
                    var OuttakePalletLine_CalcRef1           = SQL_S3_rows[o].CalcRef1;
                    var OuttakePalletLine_CalcRef2           = SQL_S3_rows[o].CalcRef2;
                    var OuttakePalletLine_CalcRef3           = SQL_S3_rows[o].CalcRef3;
                    var OuttakePalletLine_Carrier            = SQL_S3_rows[o].Carrier;
                    var OuttakePalletLine_CarrierCode        = SQL_S3_rows[o].CarrierCode;
                    var OuttakePalletLine_CompanyCode        = SQL_S3_rows[o].CompanyCode;
                    var OuttakePalletLine_DamageNR           = SQL_S3_rows[o].DamageNR;
                    var OuttakePalletLine_DT_Create          = SQL_S3_rows[o].DT_Create;
                    var OuttakePalletLine_DT_Mutation        = SQL_S3_rows[o].DT_Mutation;
                    var OuttakePalletLine_EDIStock1          = SQL_S3_rows[o].EDIStock1;
                    var OuttakePalletLine_EDIStock2          = SQL_S3_rows[o].EDIStock2;
                    var OuttakePalletLine_EDIStock3          = SQL_S3_rows[o].EDIStock3;
                    var OuttakePalletLine_EDIStock4          = SQL_S3_rows[o].EDIStock4;
                    var OuttakePalletLine_EDIStock5          = SQL_S3_rows[o].EDIStock5;
                    var OuttakePalletLine_GrossWeight        = SQL_S3_rows[o].GrossWeight;
                    var OuttakePalletLine_GrossWeightCode    = SQL_S3_rows[o].GrossWeightCode;
                    var OuttakePalletLine_InLineNR           = SQL_S3_rows[o].InLineNR;
                    var OuttakePalletLine_InOrderNR          = SQL_S3_rows[o].InOrderNR;
                    var OuttakePalletLine_IndActive          = SQL_S3_rows[o].IndActive;
                    var OuttakePalletLine_IndBlocked         = SQL_S3_rows[o].IndBlocked;
                    var OuttakePalletLine_NettWeight         = SQL_S3_rows[o].NettWeight;
                    var OuttakePalletLine_NettWeightCode     = SQL_S3_rows[o].NettWeightCode;
                    var OuttakePalletLine_OuterPCK           = SQL_S3_rows[o].OuterPCK;
                    var OuttakePalletLine_OuterPCKCode       = SQL_S3_rows[o].OuterPCKCode;
                    var OuttakePalletLine_PackTypeCode       = SQL_S3_rows[o].PackTypeCode;
                    var OuttakePalletLine_ProdRef1           = SQL_S3_rows[o].ProdRef1;
                    var OuttakePalletLine_ProdRef2           = SQL_S3_rows[o].ProdRef2;
                    var OuttakePalletLine_ProdRef3           = SQL_S3_rows[o].ProdRef3;
                    var OuttakePalletLine_ProdRef4           = SQL_S3_rows[o].ProdRef4;
                    var OuttakePalletLine_ProdRef5           = SQL_S3_rows[o].ProdRef5;
                    var OuttakePalletLine_ProductID          = SQL_S3_rows[o].ProductID;
                    var OuttakePalletLine_ProductGroupCode   = SQL_S3_rows[o].ProductGroupCode;
                    var OuttakePalletLine_StockRefNR         = SQL_S3_rows[o].StockRefNR;
                    var OuttakePalletLine_SupplierAdressNR   = SQL_S3_rows[o].SupplierAdressNR;
                    var OuttakePalletLine_TimCreate          = SQL_S3_rows[o].TimCreate;
                    var OuttakePalletLine_WareHouseRef       = SQL_S3_rows[o].WareHouseRef;
                    var OuttakePalletLine_CreateDateTime     = SQL_S3_rows[o].CreateDateTime;
                    var OuttakePalletLine_UpdateDateTime     = SQL_S3_rows[o].UpdateDateTime;
                    var OuttakePalletLine_CreateBy           = SQL_S3_rows[o].CreateBy;
                    var OuttakePalletLine_UpdateBy           = SQL_S3_rows[o].UpdateBy;

                    var PalletLine_Form = PalletLine_Template;

                    PalletLine_Form = PalletLine_Form.replace("O_ID", OuttakePalletLine_ID);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERID", OuttakePalletLine_OrderID);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERLINEID", OuttakePalletLine_OrderLineID);
                    PalletLine_Form = PalletLine_Form.replace("O_INBOUNDOROUTBOUND", OuttakePalletLine_InboundOrOutbound);
                    PalletLine_Form = PalletLine_Form.replace("O_ORDERTYPE", OuttakePalletLine_OrderType);
                    PalletLine_Form = PalletLine_Form.replace("O_STOCKNR", OuttakePalletLine_StockNr);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEEXP", OuttakePalletLine_BarcodeEXP);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEID", OuttakePalletLine_BarcodeID);
                    PalletLine_Form = PalletLine_Form.replace("O_BARCODEIDINTERNAL", OuttakePalletLine_BarcodeIDInternal);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF1", OuttakePalletLine_CalcRef1);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF2", OuttakePalletLine_CalcRef2);
                    PalletLine_Form = PalletLine_Form.replace("O_CALCREF3", OuttakePalletLine_CalcRef3);
                    PalletLine_Form = PalletLine_Form.replace("O_CARRIER", OuttakePalletLine_Carrier);
                    PalletLine_Form = PalletLine_Form.replace("O_CARRIERCODE", OuttakePalletLine_CarrierCode);
                    PalletLine_Form = PalletLine_Form.replace("O_COMPANYCODE", OuttakePalletLine_CompanyCode);
                    PalletLine_Form = PalletLine_Form.replace("O_DAMAGENR", OuttakePalletLine_DamageNR);
                    PalletLine_Form = PalletLine_Form.replace("O_DT_CREATE", OuttakePalletLine_DT_Create);
                    PalletLine_Form = PalletLine_Form.replace("O_DT_MUTATION", OuttakePalletLine_DT_Mutation);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK1", OuttakePalletLine_EDIStock1);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK2", OuttakePalletLine_EDIStock2);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK3", OuttakePalletLine_EDIStock3);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK4", OuttakePalletLine_EDIStock4);
                    PalletLine_Form = PalletLine_Form.replace("O_EDISTOCK5", OuttakePalletLine_EDIStock5);
                    PalletLine_Form = PalletLine_Form.replace("O_GROSSWEIGHT", OuttakePalletLine_GrossWeight);
                    PalletLine_Form = PalletLine_Form.replace("O_GROSSWEIGHTCODE", OuttakePalletLine_GrossWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("O_INLINENR", OuttakePalletLine_InLineNR);
                    PalletLine_Form = PalletLine_Form.replace("O_INORDERNR", OuttakePalletLine_InOrderNR);
                    PalletLine_Form = PalletLine_Form.replace("O_INDACTIVE", OuttakePalletLine_IndActive);
                    PalletLine_Form = PalletLine_Form.replace("O_INDBLOCKED", OuttakePalletLine_IndBlocked);
                    PalletLine_Form = PalletLine_Form.replace("O_NETTWEIGHT", OuttakePalletLine_NettWeight);
                    PalletLine_Form = PalletLine_Form.replace("O_NETTWEIGHTCODE", OuttakePalletLine_NettWeightCode);
                    PalletLine_Form = PalletLine_Form.replace("O_OUTERPCK", OuttakePalletLine_OuterPCK);
                    PalletLine_Form = PalletLine_Form.replace("O_OUTERPCKCODE", OuttakePalletLine_OuterPCKCode);
                    PalletLine_Form = PalletLine_Form.replace("O_PACKTYPECODE", OuttakePalletLine_PackTypeCode);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF1", OuttakePalletLine_ProdRef1);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF2", OuttakePalletLine_ProdRef2);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF3", OuttakePalletLine_ProdRef3);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF4", OuttakePalletLine_ProdRef4);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODREF5", OuttakePalletLine_ProdRef5);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODUCTID", OuttakePalletLine_ProductID);
                    PalletLine_Form = PalletLine_Form.replace("O_PRODUCTGROUPCODE", OuttakePalletLine_ProductGroupCode);
                    PalletLine_Form = PalletLine_Form.replace("O_STOCKREFNR", OuttakePalletLine_StockRefNR);
                    PalletLine_Form = PalletLine_Form.replace("O_SUPPLIERADDRESSNR", OuttakePalletLine_SupplierAdressNR);
                    PalletLine_Form = PalletLine_Form.replace("O_TIMCREATE", OuttakePalletLine_TimCreate);
                    PalletLine_Form = PalletLine_Form.replace("O_WAREHOUSEREF", OuttakePalletLine_WareHouseRef);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_CREATEDATETIME", OuttakePalletLine_CreateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_UPDATEDATETIME", OuttakePalletLine_UpdateDateTime);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_CREATEBY", OuttakePalletLine_CreateBy);
                    PalletLine_Form = PalletLine_Form.replace("O_DB_UPDATEBY", OuttakePalletLine_UpdateBy);

                    ResponseMessage_PalletLine = ResponseMessage_PalletLine + PalletLine_Form;
                }

                OrderLine_Callback(ResponseMessage_PalletLine);

            } catch (TryCatchError_S3) {
                console.error("f Process_Create_SoftPak_Message_Outbound_PalletLine - TryCatchError_S3: " + TryCatchError_S3);
            }
        }
    });
}
//-------------------------------

//Read SoftPak Messages
//-------------------------------
function Process_Read_SoftPak_Message_Inbound() {
    //Create the SQL Statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`processdocuments` WHERE `DocumentName` LIKE "%Inconfirm%" AND `Processed` = "0" AND ID = "2"';

    //Connect to the SQL Database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Read_SoftPak_Message_Inbound - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var InConfirmFile_ID                = SQL_S1_rows[i].ID;
                    var InConfirmFile_DocumentName      = SQL_S1_rows[i].DocumentName;
                    var InConfirmFile_FileExtension     = SQL_S1_rows[i].FileExtension;
                    var InConfirmFile_SentInAPIKey      = SQL_S1_rows[i].SentInAPIKey;
                    var InConfirmFile_Processed         = SQL_S1_rows[i].Processed;
                    var InConfirmFile_Errored           = SQL_S1_rows[i].Errored;
                    var InConfirmFile_ErroredAmount     = SQL_S1_rows[i].ErroredAmount;
                    var InConfirmFile_DocumentClob      = SQL_S1_rows[i].DocumentCLOB;
                    var InConfirmFile_CreateBy          = SQL_S1_rows[i].CreatedBy;
                    var InConfirmFile_UpdateBy          = SQL_S1_rows[i].UpdateBy;
                    var InConfirmFile_CreateDateTime    = SQL_S1_rows[i].CreateDateTime;
                    var InConfirmFile_UpdateDateTime    = SQL_S1_rows[i].UpdateDateTime;

                    var JSONObject_DocumentClob = xml2json_parser.toJson(InConfirmFile_DocumentClob);
                    var JSONObject_IntakeOrder  = JSONObject_DocumentClob.INTAKE_ORDER;
                    var JSONObject_Order        = JSONObject_DocumentClob.INTAKE_ORDER.ORDER;

                    var Order_InOrderNR             = JSONObject_Order.ord_in_ordnr;
                    var Order_CompanyCode           = JSONObject_Order.ord_companycode;
                    var Order_Container_TypeCode    = JSONObject_Order.ord_container_typecode;
                    var Order_ContainerNR           = JSONObject_Order.ord_containernr;
                    var Order_Cust_AddressNR        = JSONObject_Order.ord_cust_addressnr;
                    var Order_Custref_In1           = JSONObject_Order.ord_custref_in1;
                    var Order_Custref_In2           = JSONObject_Order.ord_custref_in2;
                    var Order_Custref_In3           = JSONObject_Order.ord_custref_in3;
                    var Order_Custref_In4           = JSONObject_Order.ord_custref_in4;
                    var Order_Custref_In5           = JSONObject_Order.ord_custref_in5;
                    var Order_Custref_In6           = JSONObject_Order.ord_custref_in6;
                    var Order_Custref_In7           = JSONObject_Order.ord_custref_in7;
                    var Order_Custref_In8           = JSONObject_Order.ord_custref_in8;
                    var Order_dt_Create             = JSONObject_Order.ord_dt_create;
                    var Order_dt_Discharge          = JSONObject_Order.ord_dt_discharge;
                    var Order_dt_Update             = JSONObject_Order.ord_dt_update;
                    var Order_Edi_InOrder_1         = JSONObject_Order.ord_edi_in_ord_1;
                    var Order_Edi_InOrder_2         = JSONObject_Order.ord_edi_in_ord_2;
                    var Order_Edi_InOrder_3         = JSONObject_Order.ord_edi_in_ord_3;
                    var Order_Edi_InOrder_4         = JSONObject_Order.ord_edi_in_ord_4;
                    var Order_Edi_InOrder_5         = JSONObject_Order.ord_edi_in_ord_5;
                    var Order_ExtEdi_OrderText      = JSONObject_Order.ord_ext_edi_order_text;
                    var Order_LineCode              = JSONObject_Order.ord_linecode;
                    var Order_Loc_TerminalCode      = JSONObject_Order.ord_loc_terminalcode;
                    var Order_ProjectNR             = JSONObject_Order.ord_projectnr;
                    var Order_Rec_AddressNR         = JSONObject_Order.ord_rec_addressnr;
                    var Order_SealNO                = JSONObject_Order.ord_sealno;
                    var Order_StatusCode            = JSONObject_Order.ord_statuscode;
                    var Order_Supplier_AddressNR    = JSONObject_Order.ord_supplier_addressnr;
                    var Order_Tim_Create            = JSONObject_Order.ord_tim_create;
                    var Order_Tim_Discharge         = JSONObject_Order.ord_tim_discharge;
                    var Order_Tim_Updated           = JSONObject_Order.ord_tim_updated;
                    var Order_Transporter_AddressNR = JSONObject_Order.ord_transporter_addressnr;
                    var Order_Transport_NR          = JSONObject_Order.ord_transportnr;
                    var JSONObject_OrderLines       = JSONObject_Order.ORDER_LINE;

                    Process_SoftPak_InConfirm_Order(Order_InOrderNR, Order_CompanyCode, Order_Container_TypeCode, Order_ContainerNR, Order_Cust_AddressNR, Order_Custref_In1, Order_Custref_In2, Order_Custref_In3, Order_Custref_In4, Order_Custref_In5, Order_Custref_In6, Order_Custref_In7, Order_Custref_In8, Order_dt_Create, Order_dt_Discharge, Order_dt_Update, Order_Edi_InOrder_1, Order_Edi_InOrder_2, Order_Edi_InOrder_3, Order_Edi_InOrder_4, Order_Edi_InOrder_5, Order_ExtEdi_OrderText, Order_LineCode, Order_Loc_TerminalCode, Order_ProjectNR, Order_Rec_AddressNR, Order_SealNO, Order_StatusCode, Order_Supplier_AddressNR, Order_Tim_Create, Order_Tim_Discharge, Order_Tim_Updated, Order_Transporter_AddressNR, Order_Transport_NR, function(Order_DB_ID) {
                        for (var e = 0; e < JSONObject_OrderLines.length; e++) {
                            console.log("f Process_Read_SoftPak_Message_Inbound - Order: Order saved!, Order saved under ID: " + OrderLine_DB_ID);

                            var OrderLine_InOrder_Nr                = JSONObject_OrderLines[e].lin_in_ordnr;
                            var OrderLine_InLine_Nr                 = JSONObject_OrderLines[e].lin_in_linenr;
                            var OrderLine_Carrier                   = JSONObject_OrderLines[e].lin_carrier;
                            var OrderLine_CarrierCode               = JSONObject_OrderLines[e].lin_carriercode;
                            var OrderLine_CompanyCode               = JSONObject_OrderLines[e].lin_companycode;
                            var OrderLine_ContainerTypeCode         = JSONObject_OrderLines[e].lin_container_typecode;
                            var OrderLine_ContainerNr               = JSONObject_OrderLines[e].lin_containernr;
                            var OrderLine_Cust_AddressNr            = JSONObject_OrderLines[e].lin_cust_addressnr;
                            var OrderLine_Cust_ProductCode          = JSONObject_OrderLines[e].lin_cust_productcode;
                            var OrderLine_CustRef_1                 = JSONObject_OrderLines[e].lin_custref_in1;
                            var OrderLine_CustRef_2                 = JSONObject_OrderLines[e].lin_custref_in2;
                            var OrderLine_CustRef_3                 = JSONObject_OrderLines[e].lin_custref_in3;
                            var OrderLine_Damage_Des                = JSONObject_OrderLines[e].lin_damage_des;
                            var OrderLine_Damage_Code               = JSONObject_OrderLines[e].lin_damagecode;
                            var OrderLine_EDI_InLine_1              = JSONObject_OrderLines[e].lin_edi_in_line_1;
                            var OrderLine_EDI_InLine_2              = JSONObject_OrderLines[e].lin_edi_in_line_2;
                            var OrderLine_EDI_InLine_3              = JSONObject_OrderLines[e].lin_edi_in_line_3;
                            var OrderLine_EDI_InLine_4              = JSONObject_OrderLines[e].lin_edi_in_line_4;
                            var OrderLine_EDI_InLine_5              = JSONObject_OrderLines[e].lin_edi_in_line_5;
                            var OrderLine_ExtEdiLineText            = JSONObject_OrderLines[e].lin_ext_edi_line_text;
                            var OrderLine_GrossWeight               = JSONObject_OrderLines[e].lin_grossweight;
                            var OrderLine_GrossWeightCode           = JSONObject_OrderLines[e].lin_grossweightcode;
                            var OrderLine_NettWeight                = JSONObject_OrderLines[e].lin_nettweight;
                            var OrderLine_NettWeightCode            = JSONObject_OrderLines[e].lin_nettweightcode;
                            var OrderLine_OuterPCK                  = JSONObject_OrderLines[e].lin_outer_pck;
                            var OrderLine_OuterPCK_Code             = JSONObject_OrderLines[e].lin_outer_pckcode;
                            var OrderLine_PackTypeCode              = JSONObject_OrderLines[e].lin_packtypecode;
                            var OrderLine_ProdRef_1                 = JSONObject_OrderLines[e].lin_prodref1;
                            var OrderLine_ProdRef_2                 = JSONObject_OrderLines[e].lin_prodref2;
                            var OrderLine_ProdRef_3                 = JSONObject_OrderLines[e].lin_prodref3;
                            var OrderLine_ProdRef_4                 = JSONObject_OrderLines[e].lin_prodref4;
                            var OrderLine_ProdRef_5                 = JSONObject_OrderLines[e].lin_prodref5;
                            var OrderLine_ProductID                 = JSONObject_OrderLines[e].lin_product_id;
                            var OrderLine_ProductGroupCode          = JSONObject_OrderLines[e].lin_productgroupcode;
                            var OrderLine_Qty_ControlCode           = JSONObject_OrderLines[e].lin_qty_controlcode;
                            var OrderLine_Rec_AddressNr             = JSONObject_OrderLines[e].lin_rec_addressnr;
                            var OrderLine_Remarks                   = JSONObject_OrderLines[e].lin_remarks;
                            var OrderLine_StockRefNR                = JSONObject_OrderLines[e].lin_stockrefnr;
                            var OrderLine_Supplier_AddressNR        = JSONObject_OrderLines[e].lin_supplier_addressnr;
                            var OrderLine_Term_Place                = JSONObject_OrderLines[e].lin_term_place;
                            var OrderLine_Term_Code                 = JSONObject_OrderLines[e].lin_termcode;
                            var OrderLine_TransAction_CustomerRef   = JSONObject_OrderLines[e].lin_transaction_customsrefnr;
                            var OrderLine_WareHouseRef              = JSONObject_OrderLines[e].lin_warehouseref;
                            var JSONObject_PalletLines              = JSONObject_OrderLines[e].PALLET;

                            Process_SoftPak_InConfirm_OrderLine(Order_DB_ID, "INCONFIRM", OrderLine_InOrder_Nr, OrderLine_InLine_Nr, OrderLine_Carrier, OrderLine_CarrierCode, OrderLine_CompanyCode, OrderLine_ContainerTypeCode, OrderLine_ContainerNr, OrderLine_Cust_AddressNr, OrderLine_Cust_ProductCode, OrderLine_CustRef_1, OrderLine_CustRef_2, OrderLine_CustRef_3, OrderLine_Damage_Des, OrderLine_Damage_Code, OrderLine_EDI_InLine_1, OrderLine_EDI_InLine_2, OrderLine_EDI_InLine_3, OrderLine_EDI_InLine_4, OrderLine_EDI_InLine_5, OrderLine_ExtEdiLineText, OrderLine_GrossWeight, OrderLine_GrossWeightCode, OrderLine_NettWeight, OrderLine_NettWeightCode, OrderLine_OuterPCK, OrderLine_OuterPCK_Code, OrderLine_PackTypeCode, OrderLine_ProdRef_1, OrderLine_ProdRef_2, OrderLine_ProdRef_3, OrderLine_ProdRef_4, OrderLine_ProdRef_5, OrderLine_ProductID, OrderLine_ProductGroupCode, OrderLine_Qty_ControlCode, OrderLine_Rec_AddressNr, OrderLine_Remarks, OrderLine_StockRefNR, OrderLine_Supplier_AddressNR, OrderLine_Term_Place, OrderLine_Term_Code, OrderLine_TransAction_CustomerRef, OrderLine_WareHouseRef, function(OrderLine_DB_ID) {
                                console.log("f Process_Read_SoftPak_Message_Inbound - Orderline: Orderline saved!, Orderline saved under ID: " + OrderLine_DB_ID);

                                for (var j = 0; j < JSONObject_PalletLines.length; j++) {
                                    var PalletLine_StockNr              = JSONObject_PalletLines[j].plt_stocknr;
                                    var PalletLine_Barcode_Exp          = JSONObject_PalletLines[j].plt_barcode_exp;
                                    var PalletLine_Barcode_ID           = JSONObject_PalletLines[j].plt_barcode_id;
                                    var PalletLine_Barcode_ID_Internal  = JSONObject_PalletLines[j].plt_barcode_id_internal;
                                    var PalletLine_CalcRef_1            = JSONObject_PalletLines[j].plt_calcref1;
                                    var PalletLine_CalcRef_2            = JSONObject_PalletLines[j].plt_calcref2;
                                    var PalletLine_CalcRef_3            = JSONObject_PalletLines[j].plt_calcref3;
                                    var PalletLine_Carrier              = JSONObject_PalletLines[j].plt_carrier;
                                    var PalletLine_CarrierCode          = JSONObject_PalletLines[j].plt_carriercode;
                                    var PalletLine_CompanyCode          = JSONObject_PalletLines[j].plt_companycode;
                                    var PalletLine_DamageNr             = JSONObject_PalletLines[j].plt_damagenr;
                                    var PalletLine_dt_create            = JSONObject_PalletLines[j].plt_dt_create;
                                    var PalletLine_dt_mutation          = JSONObject_PalletLines[j].plt_dt_mutation;
                                    var PalletLine_edi_stock_1          = JSONObject_PalletLines[j].plt_edi_stock_1;
                                    var PalletLine_edi_stock_2          = JSONObject_PalletLines[j].plt_edi_stock_2;
                                    var PalletLine_edi_stock_3          = JSONObject_PalletLines[j].plt_edi_stock_3;
                                    var PalletLine_edi_stock_4          = JSONObject_PalletLines[j].plt_edi_stock_4;
                                    var PalletLine_edi_stock_5          = JSONObject_PalletLines[j].plt_edi_stock_5;
                                    var PalletLine_grossweight          = JSONObject_PalletLines[j].plt_grossweight;
                                    var PalletLine_grossweightcode      = JSONObject_PalletLines[j].plt_grossweightcode;
                                    var PalletLine_in_linenr            = JSONObject_PalletLines[j].plt_in_linenr;
                                    var PalletLine_in_ordernr           = JSONObject_PalletLines[j].plt_in_ordnr;
                                    var PalletLine_ind_active           = JSONObject_PalletLines[j].plt_ind_active;
                                    var PalletLine_ind_blocked          = JSONObject_PalletLines[j].plt_ind_blocked;
                                    var PalletLine_nettweight           = JSONObject_PalletLines[j].plt_nettweight;
                                    var PalletLine_nettweightcode       = JSONObject_PalletLines[j].plt_nettweightcode;
                                    var PalletLine_outer_pck            = JSONObject_PalletLines[j].plt_outer_pck;
                                    var PalletLine_outer_pck_code       = JSONObject_PalletLines[j].plt_outer_pckcode;
                                    var PalletLine_packtypecode         = JSONObject_PalletLines[j].plt_packtypecode;
                                    var PalletLine_prodref_1            = JSONObject_PalletLines[j].plt_prodref1;
                                    var PalletLine_prodref_2            = JSONObject_PalletLines[j].plt_prodref2;
                                    var PalletLine_prodref_3            = JSONObject_PalletLines[j].plt_prodref3;
                                    var PalletLine_prodref_4            = JSONObject_PalletLines[j].plt_prodref4;
                                    var PalletLine_prodref_5            = JSONObject_PalletLines[j].plt_prodref5;
                                    var PalletLine_product_id           = JSONObject_PalletLines[j].plt_product_id;
                                    var PalletLine_product_groupcode    = JSONObject_PalletLines[j].plt_productgroupcode;
                                    var PalletLine_stockrefnr           = JSONObject_PalletLines[j].plt_stockrefnr;
                                    var PalletLine_supplier_addressnr   = JSONObject_PalletLines[j].plt_supplier_addressnr;
                                    var PalletLine_tim_create           = JSONObject_PalletLines[j].plt_tim_create;
                                    var PalletLine_warehouse_ref        = JSONObject_PalletLines[j].plt_warehouseref;
                                
                                    Process_SoftPak_InOrOutConfirm_PalletLine(Order_DB_ID, OrderLine_DB_ID, "INCONFIRM", 0, PalletLine_StockNr, PalletLine_Barcode_Exp, PalletLine_Barcode_ID, PalletLine_Barcode_ID_Internal, PalletLine_CalcRef_1, PalletLine_CalcRef_2, PalletLine_CalcRef_3, PalletLine_Carrier, PalletLine_CarrierCode, PalletLine_CompanyCode, PalletLine_DamageNr, PalletLine_dt_create, PalletLine_dt_mutation, PalletLine_edi_stock_1, PalletLine_edi_stock_2, PalletLine_edi_stock_3, PalletLine_edi_stock_4, PalletLine_edi_stock_5, PalletLine_grossweight, PalletLine_grossweightcode, PalletLine_in_linenr, PalletLine_in_ordernr, PalletLine_ind_active, PalletLine_ind_blocked, PalletLine_nettweight, PalletLine_nettweightcode, PalletLine_outer_pck, PalletLine_outer_pck_code, PalletLine_packtypecode, PalletLine_prodref_1, PalletLine_prodref_2, PalletLine_prodref_3, PalletLine_prodref_4, PalletLine_prodref_5, PalletLine_product_id, PalletLine_product_groupcode, PalletLine_stockrefnr, PalletLine_supplier_addressnr, PalletLine_tim_create, PalletLine_warehouse_ref, function(PalletLine_DB_ID) {
                                        console.log("f Process_Read_SoftPak_Message_Inbound - Palletline: Palletline saved!, Palletline saved under ID: " + PalletLine_DB_ID);
                                    })
                                }
                            });
                        }

                        Process_SoftPak_InOrOutConfirm_ProcessDocuments_Update();
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f Process_Read_SoftPak_Message_Inbound - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_SoftPak_InConfirm_Order(OrderNR, CompanyCode, ContainerTypeCode, ContainerNR, CustAddressNR, CustRef1, CustRef2, CustRef3, CustRef4, CustRef5, CustRef6, CustRef7, CustRef8, DtCreate, DtDischarge, DtUpdate, EDIOrd1, EDIOrd2, EDIOrd3, EDIOrd4, EDIOrd5, ExtEDIOrderText, LineCode, LocTerminalCode, ProjectNR, RecAddressNR, SealNo, StatusCode, SupplierAddressNR, TimCreate, TimDischarge, TimUpdated, TransporterAddressNR, TransportNR, callback) {
    // Create the Select Statement
    var SQL_Select_Statement = '';
    var SQL_Update_Statement = '';
    var SQL_Insert_Statement = '';

    console.log(SQL_Select_Statement);
    console.log(SQL_Update_Statement);
    console.log(SQL_Insert_Statement);

    //Connect to the mysql database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
        //Check if there are any error messages
        if (SQL_S_err) {
            //If an error occurs, Log the error
            console.error("f Process_SoftPak_InOrOutConfirm_PalletLine - SQL_S_ERRROR: " + SQL_S_err);
            callback("SQL_ERROR");
        } else {
            try {
                //Retriev the data from the database
                var SQL_ID = SQL_S_rows[0].ID;

                con.query(SQL_Update_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: UPDATE Complete!, Updated under ID: " + SQL_ID);
                    callback(SQL_ID);
                });
            } catch (error) {
                console.error(error);
                
                con.query(SQL_Insert_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                    callback(result.insertId);
                });
            }
        }
    });

    //End the connection to the mysql database
    con.end;
}

function Process_SoftPak_InConfirm_OrderLine(OrderID, OrderType, OrderNR, LineNR, Carrier, CarrierCode, CompanyCode, ContainerTypeCode, ContainerNr, CustAddressNr, CustProductCode, CustRef1, CustRef2, CustRef3, DamageDes, DamageCode, EDILine1, EDILine2, EDILine3, EDILine4, EDILine5, ExtEDILineText, GrossWeight, GrossWeightCode, NettWeight, NettWeightCode, OuterPCK, OuterPCKCode, PackTypeCode, ProdRef1, ProdRef2, ProdRef3, ProdRef4, ProdRef5, ProductID, ProductGroupCode, QtyControlCode, RecAddressNr, Remarks, StockRefNr, SupplierAddressNr, TermPlace, TermCode, TransActionCustomerRef, WarehouseRef, callback) {
    // Create the Select Statement
    var SQL_Select_Statement = '';
    var SQL_Update_Statement = '';
    var SQL_Insert_Statement = '';

    console.log(SQL_Select_Statement);
    console.log(SQL_Update_Statement);
    console.log(SQL_Insert_Statement);

    //Connect to the mysql database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
        //Check if there are any error messages
        if (SQL_S_err) {
            //If an error occurs, Log the error
            console.error("f Process_SoftPak_InOrOutConfirm_PalletLine - SQL_S_ERRROR: " + SQL_S_err);
            callback("SQL_ERROR");
        } else {
            try {
                //Retriev the data from the database
                var SQL_ID = SQL_S_rows[0].ID;

                con.query(SQL_Update_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: UPDATE Complete!, Updated under ID: " + SQL_ID);
                    callback(SQL_ID);
                });
            } catch (error) {
                console.error(error);
                
                con.query(SQL_Insert_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                    callback(result.insertId);
                });
            }
        }
    });

    //End the connection to the mysql database
    con.end;
}

function Process_SoftPak_InOrOutConfirm_PalletLine(OrderID, OrderLineID, OrderType, InOrOut, StockNR, BarcodeEXP, BarcodeID, BarcodeIDInternal, CalcRef1, CalcRef2, CalcRef3, Carrier, CarrierCode, CompanyCode, DamageNR, DTCreate, DTMutation, EDIStock1, EDIStock2, EDIStock3, EDIStock4, EDIStock5, GrossWeight, GrossWeightCode, InLineNR, InOrderNr, IndActive, IndBlocked, NettWeight, NettWeightCode, OuterPCK, OuterPCKCode, PackTypeCode, ProdRef1, ProdRef2, ProdRef3, ProdRef4, ProdRef5, ProductID, ProductGroupCode, StockRefNR, SupplierAddressNR, TimCreate, WareHouseRef, callback) {
    // Create the Select Statement
    var SQL_Select_Statement = '';
    var SQL_Update_Statement = '';
    var SQL_Insert_Statement = '';

    console.log(SQL_Select_Statement);
    console.log(SQL_Update_Statement);
    console.log(SQL_Insert_Statement);

    //Connect to the mysql database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
        //Check if there are any error messages
        if (SQL_S_err) {
            //If an error occurs, Log the error
            console.error("f Process_SoftPak_InOrOutConfirm_PalletLine - SQL_S_ERRROR: " + SQL_S_err);
            callback("SQL_ERROR");
        } else {
            try {
                //Retriev the data from the database
                var SQL_ID = SQL_S_rows[0].ID;

                con.query(SQL_Update_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: UPDATE Complete!, Updated under ID: " + SQL_ID);
                    callback(SQL_ID);
                });
            } catch (error) {
                console.error(error);
                
                con.query(SQL_Insert_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                    callback(result.insertId);
                });
            }
        }
    });

    //End the connection to the mysql database
    con.end;
}

function Process_SoftPak_OutConfirm_Order(OrderNR, CompanyCode, ContainerTypeCode, ContainerNR, CustRef1, CustRef2, CustRef3, CustRef4, CustRef5, CustRef6, CustRef7, CustRef8, DeliveryAddressNr, DeliveryName, DeliveryZipCode, DestinationCountryCode, DT_Create, DT_Delivery, DT_DeliveryTo, TD_Loading, TD_Update, EDIOrd_1, EDIOrd_2, EDIOrd_3, EDIOrd_4, EDIOr_5, ExtEDIOrderText, LineCode, LocTerminal, ProjectNr, RecAddressNr, SealNo, StatusCode, Tim_Create, Tim_Delivery, Tim_DeliveryTo, Tim_Loading, Tim_Updated, TransPorterAddressNR, TransportNR, TransPortUnitCode, ConfirmationSend, OrderType, ResponseMessageLan, callback){
    // Create the Select Statement
    var SQL_Select_Statement = '';
    var SQL_Update_Statement = '';
    var SQL_Insert_Statement = '';
    
    console.log(SQL_Select_Statement);
    console.log(SQL_Update_Statement);
    console.log(SQL_Insert_Statement);
    
    //Connect to the mysql database
    con.connect;
    
    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
        //Check if there are any error messages
        if (SQL_S_err) {
            //If an error occurs, Log the error
            console.error("f Process_SoftPak_InOrOutConfirm_PalletLine - SQL_S_ERRROR: " + SQL_S_err);
            callback("SQL_ERROR");
        } else {
            try {
                //Retriev the data from the database
                var SQL_ID = SQL_S_rows[0].ID;

                con.query(SQL_Update_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: UPDATE Complete!, Updated under ID: " + SQL_ID);
                    callback(SQL_ID);
                });
            } catch (error) {
                console.error(error);
                    
                con.query(SQL_Insert_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                    callback(result.insertId);
                });
            }
        }
    });
    
    //End the connection to the mysql database
    con.end;
}

function Process_SoftPak_OutConfirm_OrderLine(OrderID, OrderType, OrderNr, LineNr, Carrier, CarrierCode, CompanyCode, ContainerTypeCode, ContainerNr, CustAddressNr, CustProductCode, CustRef1, CustRef2, CustRef3, DeliveryAddress, ) {
    // Create the Select Statement
    var SQL_Select_Statement = '';
    var SQL_Update_Statement = '';
    var SQL_Insert_Statement = '';

    console.log(SQL_Select_Statement);
    console.log(SQL_Update_Statement);
    console.log(SQL_Insert_Statement);

    //Connect to the mysql database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
        //Check if there are any error messages
        if (SQL_S_err) {
            //If an error occurs, Log the error
            console.error("f Process_SoftPak_InOrOutConfirm_PalletLine - SQL_S_ERRROR: " + SQL_S_err);
            callback("SQL_ERROR");
        } else {
            try {
                //Retriev the data from the database
                var SQL_ID = SQL_S_rows[0].ID;

                con.query(SQL_Update_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: UPDATE Complete!, Updated under ID: " + SQL_ID);
                    callback(SQL_ID);
                });
            } catch (error) {
                console.error(error);
                
                con.query(SQL_Insert_Statement, function (err, result) {
                    if (err) throw err;
                    console.log("f Process_SoftPak_InOrOutConfirm_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                    callback(result.insertId);
                });
            }
        }
    });

    //End the connection to the mysql database
    con.end;
}



//Reading the OUTCONFIRM messages from SoftPak
function Process_Read_SoftPak_Message_Outbound() {
    //Create the SQL Statement
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`processdocuments` WHERE `DocumentName` LIKE "%Outconfirm%" AND `Processed` = "0"';

    //Connect to the SQL Database
    con.connect;

    //Query the SQL Statement
    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Process_Read_SoftPak_Message_Outbound - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var InConfirmFile_ID                = SQL_S1_rows[i].ID;
                    var InConfirmFile_DocumentName      = SQL_S1_rows[i].DocumentName;
                    var InConfirmFile_FileExtension     = SQL_S1_rows[i].FileExtension;
                    var InConfirmFile_SentInAPIKey      = SQL_S1_rows[i].SentInAPIKey;
                    var InConfirmFile_Processed         = SQL_S1_rows[i].Processed;
                    var InConfirmFile_Errored           = SQL_S1_rows[i].Errored;
                    var InConfirmFile_ErroredAmount     = SQL_S1_rows[i].ErroredAmount;
                    var InConfirmFile_DocumentClob      = SQL_S1_rows[i].DocumentCLOB;
                    var InConfirmFile_CreateBy          = SQL_S1_rows[i].CreatedBy;
                    var InConfirmFile_UpdateBy          = SQL_S1_rows[i].UpdateBy;
                    var InConfirmFile_CreateDateTime    = SQL_S1_rows[i].CreateDateTime;
                    var InConfirmFile_UpdateDateTime    = SQL_S1_rows[i].UpdateDateTime;

                    var JSONObject_DocumentClob = xml2json_parser.toJson(InConfirmFile_DocumentClob);
                    var JSONObject_Document = JSON.parse(JSONObject_DocumentClob);

                    var JSONObject_OrderOuttake = JSONObject_Document.OUTTAKE_ORDER;
                    var JSONObject_Order        = JSONObject_OrderOuttake.ORDER;

                    var Outbound_OrderNr                = JSONObject_Order.ord_out_ordnr;
                    var Outbound_CompanyCode            = JSONObject_Order.ord_companycode;
                    var Outbound_ContainerTypecode      = JSONObject_Order.ord_container_typecode;
                    var Outbound_ContainerNr            = JSONObject_Order.ord_containernr;
                    var Outbound_CustRef1               = JSONObject_Order.ord_custref_out1;
                    var Outbound_CustRef2               = JSONObject_Order.ord_custref_out2;
                    var Outbound_CustRef3               = JSONObject_Order.ord_custref_out3;
                    var Outbound_CustRef4               = JSONObject_Order.ord_custref_out4;
                    var Outbound_CustRef5               = JSONObject_Order.ord_custref_out5;
                    var Outbound_CustRef6               = JSONObject_Order.ord_custref_out6;
                    var Outbound_CustRef7               = JSONObject_Order.ord_custref_out7;
                    var Outbound_CustRef8               = JSONObject_Order.ord_custref_out8;
                    var Outbound_DeliveryAddress        = JSONObject_Order.ord_delivery_address;
                    var Outbound_DeliveryName           = JSONObject_Order.ord_delivery_name;
                    var Outbound_DeliveryZipcode        = JSONObject_Order.ord_delivery_zipcode;
                    var Outbound_DestinationCountryCode = JSONObject_Order.ord_destination_countrycode;
                    var Outbound_DateTimeCreate         = JSONObject_Order.ord_dt_create;
                    var Outbound_DateTimeDelivery       = JSONObject_Order.ord_dt_delivery["xsi:nil"];
                    var Outbound_DateTimeDeliveryTo     = JSONObject_Order.ord_dt_delivery_to["xsi:nil"];
                    var Outbound_DateTimeLoading        = JSONObject_Order.ord_dt_loading;
                    var Outbound_DateTimeUpdate         = JSONObject_Order.ord_dt_update;
                    var Outbound_EDIOrd1                = JSONObject_Order.ord_edi_out_ord_1;
                    var Outbound_EDIOrd2                = JSONObject_Order.ord_edi_out_ord_2;
                    var Outbound_EDIOrd3                = JSONObject_Order.ord_edi_out_ord_3;
                    var Outbound_EDIOrd4                = JSONObject_Order.ord_edi_out_ord_4;
                    var Outbound_EDIOrd5                = JSONObject_Order.ord_edi_out_ord_5;
                    var Outbound_ExtEDIOrdText          = JSONObject_Order.ord_ext_edi_order_text;
                    var Outbound_LineCode               = JSONObject_Order.ord_linecode;
                    var Outbound_TerminalCode           = JSONObject_Order.ord_loc_terminalcode;
                    var Outbound_ProjectNr              = JSONObject_Order.ord_projectnr;
                    var Outbound_RecAddressNr           = JSONObject_Order.ord_rec_addressnr;
                    var Outbound_SealNo                 = JSONObject_Order.ord_sealno;
                    var Outbound_StatusCode             = JSONObject_Order.ord_statuscode;
                    var Outbound_TimCreate              = JSONObject_Order.ord_tim_create;
                    var Outbound_TimDelivery            = JSONObject_Order.ord_tim_delivery;
                    var Outbound_TimDeliveryTo          = JSONObject_Order.ord_tim_delivery_to;
                    var Outbound_TimLoading             = JSONObject_Order.ord_tim_loading;
                    var Outbound_TimUpdated             = JSONObject_Order.ord_tim_updated;
                    var Outbound_TransporterAddressNr   = JSONObject_Order.ord_transporter_addressnr;
                    var Outbound_TransportNr            = JSONObject_Order.ord_transportnr;
                    var Outbound_TransportUnitcode      = JSONObject_Order.ord_transportunitcode;

                    Outbound_OrderNr                = Outbound_OrderNr.toString();
                    Outbound_CompanyCode            = Outbound_CompanyCode.toString();
                    Outbound_ContainerTypecode      = Outbound_ContainerTypecode.toString();
                    Outbound_ContainerNr            = Outbound_ContainerNr.toString();
                    Outbound_CustRef1               = Outbound_CustRef1.toString();
                    Outbound_CustRef2               = Outbound_CustRef2.toString();
                    Outbound_CustRef3               = Outbound_CustRef3.toString();
                    Outbound_CustRef4               = Outbound_CustRef4.toString();
                    Outbound_CustRef5               = Outbound_CustRef5.toString();
                    Outbound_CustRef6               = Outbound_CustRef6.toString();
                    Outbound_CustRef7               = Outbound_CustRef7.toString();
                    Outbound_CustRef8               = Outbound_CustRef8.toString();
                    Outbound_DeliveryAddress        = Outbound_DeliveryAddress.toString();
                    Outbound_DeliveryName           = Outbound_DeliveryName.toString();
                    Outbound_DeliveryZipcode        = Outbound_DeliveryZipcode.toString();
                    Outbound_DestinationCountryCode = Outbound_DestinationCountryCode.toString();
                    Outbound_DateTimeCreate         = Outbound_DateTimeCreate.toString();
                    Outbound_DateTimeDelivery       = Outbound_DateTimeDelivery.toString();
                    Outbound_DateTimeDeliveryTo     = Outbound_DateTimeDeliveryTo.toString();
                    Outbound_DateTimeLoading        = Outbound_DateTimeLoading.toString();
                    Outbound_DateTimeUpdate         = Outbound_DateTimeUpdate.toString();
                    Outbound_EDIOrd1                = Outbound_EDIOrd1.toString();
                    Outbound_EDIOrd2                = Outbound_EDIOrd2.toString();
                    Outbound_EDIOrd3                = Outbound_EDIOrd3.toString();
                    Outbound_EDIOrd4                = Outbound_EDIOrd4.toString();
                    Outbound_EDIOrd5                = Outbound_EDIOrd5.toString();
                    Outbound_ExtEDIOrdText          = Outbound_ExtEDIOrdText.toString();
                    Outbound_LineCode               = Outbound_LineCode.toString();
                    Outbound_TerminalCode           = Outbound_TerminalCode.toString();
                    Outbound_ProjectNr              = Outbound_ProjectNr.toString();
                    Outbound_RecAddressNr           = Outbound_RecAddressNr.toString();
                    Outbound_SealNo                 = Outbound_SealNo.toString();
                    Outbound_StatusCode             = Outbound_StatusCode.toString();
                    Outbound_TimCreate              = Outbound_TimCreate.toString();
                    Outbound_TimDelivery            = Outbound_TimDelivery.toString();
                    Outbound_TimDeliveryTo          = Outbound_TimDeliveryTo.toString();
                    Outbound_TimLoading             = Outbound_TimLoading.toString();
                    Outbound_TimUpdated             = Outbound_TimUpdated.toString();
                    Outbound_TransporterAddressNr   = Outbound_TransporterAddressNr.toString();
                    Outbound_TransportNr            = Outbound_TransportNr.toString();
                    Outbound_TransportUnitcode      = Outbound_TransportUnitcode.toString();

                    if (Outbound_OrderNr == "[object Object]") { Outbound_OrderNr = ""; }
                    if (Outbound_CompanyCode == "[object Object]") { Outbound_CompanyCode = ""; }
                    if (Outbound_ContainerTypecode == "[object Object]") { Outbound_ContainerTypecode = ""; }
                    if (Outbound_ContainerNr == "[object Object]") { Outbound_ContainerNr = ""; }
                    if (Outbound_CustRef1 == "[object Object]") { Outbound_CustRef1 = ""; }
                    if (Outbound_CustRef2 == "[object Object]") { Outbound_CustRef2 = ""; }
                    if (Outbound_CustRef3 == "[object Object]") { Outbound_CustRef3 = ""; }
                    if (Outbound_CustRef4 == "[object Object]") { Outbound_CustRef4 = ""; }
                    if (Outbound_CustRef5 == "[object Object]") { Outbound_CustRef5 = ""; }
                    if (Outbound_CustRef6 == "[object Object]") { Outbound_CustRef6 = ""; }
                    if (Outbound_CustRef7 == "[object Object]") { Outbound_CustRef7 = ""; }
                    if (Outbound_CustRef8 == "[object Object]") { Outbound_CustRef8 = ""; }
                    if (Outbound_DeliveryAddress == "[object Object]") { Outbound_DeliveryAddress = ""; }
                    if (Outbound_DeliveryName == "[object Object]") { Outbound_DeliveryName = ""; }
                    if (Outbound_DeliveryZipcode == "[object Object]") { Outbound_DeliveryZipcode = ""; }
                    if (Outbound_DestinationCountryCode == "[object Object]") { Outbound_DestinationCountryCode = ""; }
                    if (Outbound_DateTimeCreate == "[object Object]") { Outbound_DateTimeCreate = ""; }
                    if (Outbound_DateTimeDelivery == "[object Object]") { Outbound_DateTimeDelivery = ""; }
                    if (Outbound_DateTimeDeliveryTo == "[object Object]") { Outbound_DateTimeDeliveryTo = ""; }
                    if (Outbound_DateTimeLoading == "[object Object]") { Outbound_DateTimeLoading = ""; }
                    if (Outbound_DateTimeUpdate == "[object Object]") { Outbound_DateTimeUpdate = ""; }
                    if (Outbound_EDIOrd1 == "[object Object]") { Outbound_EDIOrd1 = ""; }
                    if (Outbound_EDIOrd2 == "[object Object]") { Outbound_EDIOrd2 = ""; }
                    if (Outbound_EDIOrd3 == "[object Object]") { Outbound_EDIOrd3 = ""; }
                    if (Outbound_EDIOrd4 == "[object Object]") { Outbound_EDIOrd4 = ""; }
                    if (Outbound_EDIOrd5 == "[object Object]") { Outbound_EDIOrd5 = ""; }
                    if (Outbound_ExtEDIOrdText == "[object Object]") { Outbound_ExtEDIOrdText = ""; }
                    if (Outbound_LineCode == "[object Object]") { Outbound_LineCode = ""; }
                    if (Outbound_TerminalCode == "[object Object]") { Outbound_TerminalCode = ""; }
                    if (Outbound_ProjectNr == "[object Object]") { Outbound_ProjectNr = ""; }
                    if (Outbound_RecAddressNr == "[object Object]") { Outbound_RecAddressNr = ""; }
                    if (Outbound_SealNo == "[object Object]") { Outbound_SealNo = ""; }
                    if (Outbound_StatusCode == "[object Object]") { Outbound_StatusCode = ""; }
                    if (Outbound_TimCreate == "[object Object]") { Outbound_TimCreate = ""; }
                    if (Outbound_TimDelivery == "[object Object]") { Outbound_TimDelivery = ""; }
                    if (Outbound_TimDeliveryTo == "[object Object]") { Outbound_TimDeliveryTo = ""; }
                    if (Outbound_TimLoading == "[object Object]") { Outbound_TimLoading = ""; }
                    if (Outbound_TimUpdated == "[object Object]") { Outbound_TimUpdated = ""; }
                    if (Outbound_TransporterAddressNr == "[object Object]") { Outbound_TransporterAddressNr = ""; }
                    if (Outbound_TransportNr == "[object Object]") { Outbound_TransportNr = ""; }
                    if (Outbound_TransportUnitcode == "[object Object]") { Outbound_TransportUnitcode = ""; }

                    Process_Read_SoftPak_Message_Outbound_Insert_Order(Outbound_OrderNr, Outbound_CompanyCode, Outbound_ContainerTypecode, Outbound_ContainerNr, Outbound_CustRef1, Outbound_CustRef2, Outbound_CustRef3, Outbound_CustRef4, Outbound_CustRef5, Outbound_CustRef6, Outbound_CustRef7, Outbound_CustRef8, Outbound_DeliveryAddress, Outbound_DeliveryName, Outbound_DeliveryZipcode, Outbound_DestinationCountryCode, Outbound_DateTimeCreate, Outbound_DateTimeDelivery, Outbound_DateTimeDeliveryTo, Outbound_DateTimeLoading, Outbound_DateTimeUpdate, Outbound_EDIOrd1, Outbound_EDIOrd2, Outbound_EDIOrd3, Outbound_EDIOrd4, Outbound_EDIOrd5, Outbound_ExtEDIOrdText, Outbound_LineCode, Outbound_TerminalCode, Outbound_ProjectNr, Outbound_RecAddressNr, Outbound_SealNo, Outbound_StatusCode, Outbound_TimCreate, Outbound_TimDelivery, Outbound_TimDeliveryTo, Outbound_TimLoading, Outbound_TimUpdated, Outbound_TransporterAddressNr, Outbound_TransportNr, Outbound_TransportUnitcode, function(Result_OrderID) {
                        console.log("f Process_Read_SoftPak_Message_Outbound_Insert_Order - Order: " + Outbound_OrderNr + " has been saved in the database, Order saved under ID: " + Result_OrderID);
                        var JSONObject_OrderLine = JSONObject_Order.ORDER_LINE;

                        console.log(JSONObject_OrderLine);
                        console.log("JSONObject_OrderLine.length: " + JSONObject_OrderLine.length);

                        if (JSONObject_OrderLine.length == "undefined" || JSONObject_OrderLine.length == "" || JSONObject_OrderLine.length == null) {
                            var Outbound_OrderLine_OrderNr                  = JSONObject_OrderLine.lin_out_ordnr;
                            var Outbound_OrderLine_LineNr                   = JSONObject_OrderLine.lin_out_linenr;
                            var Outbound_OrderLine_Carrier                  = JSONObject_OrderLine.lin_carrier;
                            var Outbound_OrderLine_CarrierCode              = JSONObject_OrderLine.lin_carriercode;
                            var Outbound_OrderLine_CompanyCode              = JSONObject_OrderLine.lin_companycode;
                            var Outbound_OrderLine_ContainerTypeCode        = JSONObject_OrderLine.lin_container_typecode;
                            var Outbound_OrderLine_ContainerNr              = JSONObject_OrderLine.lin_containernr;
                            var Outbound_OrderLine_CustAddressNr            = JSONObject_OrderLine.lin_cust_addressnr;
                            var Outbound_OrderLine_ProductCode              = JSONObject_OrderLine.lin_cust_productcode;
                            var Outbound_OrderLine_CustRef1                 = JSONObject_OrderLine.lin_custref_out1;
                            var Outbound_OrderLine_CustRef2                 = JSONObject_OrderLine.lin_custref_out2;
                            var Outbound_OrderLine_CustRef3                 = JSONObject_OrderLine.lin_custref_out3;
                            var Outbound_OrderLine_DeliveryAddress          = JSONObject_OrderLine.lin_delivery_address;
                            var Outbound_OrderLine_DeliveryAddressNr        = JSONObject_OrderLine.lin_delivery_addressnr;
                            var Outbound_OrderLine_DateTimeDelivery         = JSONObject_OrderLine.lin_dt_delivery["xsi:nil"];
                            var Outbound_OrderLine_EDILine1                 = JSONObject_OrderLine.lin_edi_out_line_1;
                            var Outbound_OrderLine_EDILine2                 = JSONObject_OrderLine.lin_edi_out_line_2;
                            var Outbound_OrderLine_EDILine3                 = JSONObject_OrderLine.lin_edi_out_line_3;
                            var Outbound_OrderLine_EDILine4                 = JSONObject_OrderLine.lin_edi_out_line_4;
                            var Outbound_OrderLine_EDILine5                 = JSONObject_OrderLine.lin_edi_out_line_5;
                            var Outbound_OrderLine_ExtEDILineText           = JSONObject_OrderLine.lin_ext_edi_line_text;
                            var Outbound_OrderLine_GrossWeight              = JSONObject_OrderLine.lin_grossweight;
                            var Outbound_OrderLine_GrossWeightCode          = JSONObject_OrderLine.lin_grossweightcode;
                            var Outbound_OrderLine_OuterPCK                 = JSONObject_OrderLine.lin_outer_pck;
                            var Outbound_OrderLine_OuterPCKCode             = JSONObject_OrderLine.lin_outer_pckcode;
                            var Outbound_OrderLine_PackTypeCode             = JSONObject_OrderLine.lin_packtypecode;
                            var Outbound_OrderLine_ProdRef1                 = JSONObject_OrderLine.lin_prodref1;
                            var Outbound_OrderLine_ProdRef2                 = JSONObject_OrderLine.lin_prodref2;
                            var Outbound_OrderLine_ProdRef3                 = JSONObject_OrderLine.lin_prodref3;
                            var Outbound_OrderLine_ProdRef4                 = JSONObject_OrderLine.lin_prodref4;
                            var Outbound_OrderLine_ProdRef5                 = JSONObject_OrderLine.lin_prodref5;
                            var Outbound_OrderLine_ProductID                = JSONObject_OrderLine.lin_product_id;
                            var Outbound_OrderLine_ProductGroupCode         = JSONObject_OrderLine.lin_productgroupcode;
                            var Outbound_OrderLine_QtyControlCode           = JSONObject_OrderLine.lin_qty_controlcode;
                            var Outbound_OrderLine_RecAddressNr             = JSONObject_OrderLine.lin_rec_addressnr;
                            var Outbound_OrderLine_Remarks                  = JSONObject_OrderLine.lin_remarks;
                            var Outbound_OrderLine_StockRefNr               = JSONObject_OrderLine.lin_stockrefnr;
                            var Outbound_OrderLine_SupplierAddressNr        = JSONObject_OrderLine.lin_supplier_addressnr;
                            var Outbound_OrderLine_TermPlace                = JSONObject_OrderLine.lin_term_place;
                            var Outbound_OrderLine_TermCode                 = JSONObject_OrderLine.lin_termcode;
                            var Outbound_OrderLine_TransactionCustomerRefNr = JSONObject_OrderLine.lin_transaction_customsrefnr;
                            var Outbound_OrderLine_WarehouseRef             = JSONObject_OrderLine.lin_warehouseref;

                            Outbound_OrderLine_OrderNr                  = Outbound_OrderLine_OrderNr.toString();
                            Outbound_OrderLine_LineNr                   = Outbound_OrderLine_LineNr.toString();
                            Outbound_OrderLine_Carrier                  = Outbound_OrderLine_Carrier.toString();
                            Outbound_OrderLine_CarrierCode              = Outbound_OrderLine_CarrierCode.toString();
                            Outbound_OrderLine_CompanyCode              = Outbound_OrderLine_CompanyCode.toString();
                            Outbound_OrderLine_ContainerTypeCode        = Outbound_OrderLine_ContainerTypeCode.toString();
                            Outbound_OrderLine_ContainerNr              = Outbound_OrderLine_ContainerNr.toString();
                            Outbound_OrderLine_CustAddressNr            = Outbound_OrderLine_CustAddressNr.toString();
                            Outbound_OrderLine_ProductCode              = Outbound_OrderLine_ProductCode.toString();
                            Outbound_OrderLine_CustRef1                 = Outbound_OrderLine_CustRef1.toString();
                            Outbound_OrderLine_CustRef2                 = Outbound_OrderLine_CustRef2.toString();
                            Outbound_OrderLine_CustRef3                 = Outbound_OrderLine_CustRef3.toString();
                            Outbound_OrderLine_DeliveryAddress          = Outbound_OrderLine_DeliveryAddress.toString();
                            Outbound_OrderLine_DeliveryAddressNr        = Outbound_OrderLine_DeliveryAddressNr.toString();
                            Outbound_OrderLine_DateTimeDelivery         = Outbound_OrderLine_DateTimeDelivery.toString();
                            Outbound_OrderLine_EDILine1                 = Outbound_OrderLine_EDILine1.toString();
                            Outbound_OrderLine_EDILine2                 = Outbound_OrderLine_EDILine2.toString();
                            Outbound_OrderLine_EDILine3                 = Outbound_OrderLine_EDILine3.toString();
                            Outbound_OrderLine_EDILine4                 = Outbound_OrderLine_EDILine4.toString();
                            Outbound_OrderLine_EDILine5                 = Outbound_OrderLine_EDILine5.toString();
                            Outbound_OrderLine_ExtEDILineText           = Outbound_OrderLine_ExtEDILineText.toString();
                            Outbound_OrderLine_GrossWeight              = Outbound_OrderLine_GrossWeight.toString();
                            Outbound_OrderLine_GrossWeightCode          = Outbound_OrderLine_GrossWeightCode.toString();
                            Outbound_OrderLine_OuterPCK                 = Outbound_OrderLine_OuterPCK.toString();
                            Outbound_OrderLine_OuterPCKCode             = Outbound_OrderLine_OuterPCKCode.toString();
                            Outbound_OrderLine_PackTypeCode             = Outbound_OrderLine_PackTypeCode.toString();
                            Outbound_OrderLine_ProdRef1                 = Outbound_OrderLine_ProdRef1.toString();
                            Outbound_OrderLine_ProdRef2                 = Outbound_OrderLine_ProdRef2.toString();
                            Outbound_OrderLine_ProdRef3                 = Outbound_OrderLine_ProdRef3.toString();
                            Outbound_OrderLine_ProdRef4                 = Outbound_OrderLine_ProdRef4.toString();
                            Outbound_OrderLine_ProdRef5                 = Outbound_OrderLine_ProdRef5.toString();
                            Outbound_OrderLine_ProductID                = Outbound_OrderLine_ProductID.toString();
                            Outbound_OrderLine_ProductGroupCode         = Outbound_OrderLine_ProductGroupCode.toString();
                            Outbound_OrderLine_QtyControlCode           = Outbound_OrderLine_QtyControlCode.toString();
                            Outbound_OrderLine_RecAddressNr             = Outbound_OrderLine_RecAddressNr.toString();
                            Outbound_OrderLine_Remarks                  = Outbound_OrderLine_Remarks.toString();
                            Outbound_OrderLine_StockRefNr               = Outbound_OrderLine_StockRefNr.toString();
                            Outbound_OrderLine_SupplierAddressNr        = Outbound_OrderLine_SupplierAddressNr.toString();
                            Outbound_OrderLine_TermPlace                = Outbound_OrderLine_TermPlace.toString();
                            Outbound_OrderLine_TermCode                 = Outbound_OrderLine_TermCode.toString();
                            Outbound_OrderLine_TransactionCustomerRefNr = Outbound_OrderLine_TransactionCustomerRefNr.toString();
                            Outbound_OrderLine_WarehouseRef             = Outbound_OrderLine_WarehouseRef.toString();

                            if (Outbound_OrderLine_OrderNr == "[object Object]") { Outbound_OrderLine_OrderNr = ""; }
                            if (Outbound_OrderLine_LineNr == "[object Object]") { Outbound_OrderLine_LineNr = ""; }
                            if (Outbound_OrderLine_Carrier == "[object Object]") { Outbound_OrderLine_Carrier = ""; }
                            if (Outbound_OrderLine_CarrierCode == "[object Object]") { Outbound_OrderLine_CarrierCode = ""; }
                            if (Outbound_OrderLine_CompanyCode == "[object Object]") { Outbound_OrderLine_CompanyCode = ""; }
                            if (Outbound_OrderLine_ContainerTypeCode == "[object Object]") { Outbound_OrderLine_ContainerTypeCode = ""; }
                            if (Outbound_OrderLine_ContainerNr == "[object Object]") { Outbound_OrderLine_ContainerNr = ""; }
                            if (Outbound_OrderLine_CustAddressNr == "[object Object]") { Outbound_OrderLine_CustAddressNr = ""; }
                            if (Outbound_OrderLine_ProductCode == "[object Object]") { Outbound_OrderLine_ProductCode = ""; }
                            if (Outbound_OrderLine_CustRef1 == "[object Object]") { Outbound_OrderLine_CustRef1 = ""; }
                            if (Outbound_OrderLine_CustRef2 == "[object Object]") { Outbound_OrderLine_CustRef2 = ""; }
                            if (Outbound_OrderLine_CustRef3 == "[object Object]") { Outbound_OrderLine_CustRef3 = ""; }
                            if (Outbound_OrderLine_DeliveryAddress == "[object Object]") { Outbound_OrderLine_DeliveryAddress = ""; }
                            if (Outbound_OrderLine_DeliveryAddressNr == "[object Object]") { Outbound_OrderLine_DeliveryAddressNr = ""; }
                            if (Outbound_OrderLine_DateTimeDelivery == "[object Object]") { Outbound_OrderLine_DateTimeDelivery = ""; }
                            if (Outbound_OrderLine_EDILine1 == "[object Object]") { Outbound_OrderLine_EDILine1 = ""; }
                            if (Outbound_OrderLine_EDILine2 == "[object Object]") { Outbound_OrderLine_EDILine2 = ""; }
                            if (Outbound_OrderLine_EDILine3 == "[object Object]") { Outbound_OrderLine_EDILine3 = ""; }
                            if (Outbound_OrderLine_EDILine4 == "[object Object]") { Outbound_OrderLine_EDILine4 = ""; }
                            if (Outbound_OrderLine_EDILine5 == "[object Object]") { Outbound_OrderLine_EDILine5 = ""; }
                            if (Outbound_OrderLine_ExtEDILineText == "[object Object]") { Outbound_OrderLine_ExtEDILineText = ""; }
                            if (Outbound_OrderLine_GrossWeight == "[object Object]") { Outbound_OrderLine_GrossWeight = ""; }
                            if (Outbound_OrderLine_GrossWeightCode == "[object Object]") { Outbound_OrderLine_GrossWeightCode = ""; }
                            if (Outbound_OrderLine_OuterPCK == "[object Object]") { Outbound_OrderLine_OuterPCK = ""; }
                            if (Outbound_OrderLine_OuterPCKCode == "[object Object]") { Outbound_OrderLine_OuterPCKCode = ""; }
                            if (Outbound_OrderLine_PackTypeCode == "[object Object]") { Outbound_OrderLine_PackTypeCode = ""; }
                            if (Outbound_OrderLine_ProdRef1 == "[object Object]") { Outbound_OrderLine_ProdRef1 = ""; }
                            if (Outbound_OrderLine_ProdRef2 == "[object Object]") { Outbound_OrderLine_ProdRef2 = ""; }
                            if (Outbound_OrderLine_ProdRef3 == "[object Object]") { Outbound_OrderLine_ProdRef3 = ""; }
                            if (Outbound_OrderLine_ProdRef4 == "[object Object]") { Outbound_OrderLine_ProdRef4 = ""; }
                            if (Outbound_OrderLine_ProdRef5 == "[object Object]") { Outbound_OrderLine_ProdRef5 = ""; }
                            if (Outbound_OrderLine_ProductID == "[object Object]") { Outbound_OrderLine_ProductID = ""; }
                            if (Outbound_OrderLine_ProductGroupCode == "[object Object]") { Outbound_OrderLine_ProductGroupCode = ""; }
                            if (Outbound_OrderLine_QtyControlCode == "[object Object]") { Outbound_OrderLine_QtyControlCode = ""; }
                            if (Outbound_OrderLine_RecAddressNr == "[object Object]") { Outbound_OrderLine_RecAddressNr = ""; }
                            if (Outbound_OrderLine_Remarks == "[object Object]") { Outbound_OrderLine_Remarks = ""; }
                            if (Outbound_OrderLine_StockRefNr == "[object Object]") { Outbound_OrderLine_StockRefNr = ""; }
                            if (Outbound_OrderLine_SupplierAddressNr == "[object Object]") { Outbound_OrderLine_SupplierAddressNr = ""; }
                            if (Outbound_OrderLine_TermPlace == "[object Object]") { Outbound_OrderLine_TermPlace = ""; }
                            if (Outbound_OrderLine_TermCode == "[object Object]") { Outbound_OrderLine_TermCode = ""; }
                            if (Outbound_OrderLine_TransactionCustomerRefNr == "[object Object]") { Outbound_OrderLine_TransactionCustomerRefNr = ""; }
                            if (Outbound_OrderLine_WarehouseRef == "[object Object]") { Outbound_OrderLine_WarehouseRef = ""; }

                            console.log("Outbound_OrderLine_OrderNr: " + Outbound_OrderLine_OrderNr);

                            Process_Read_SoftPak_Message_Outbound_Insert_OrderLine(Result_OrderID, Outbound_OrderLine_OrderNr, Outbound_OrderLine_LineNr, Outbound_OrderLine_Carrier, Outbound_OrderLine_CarrierCode, Outbound_OrderLine_CompanyCode, Outbound_OrderLine_ContainerTypeCode, Outbound_OrderLine_ContainerNr, Outbound_OrderLine_CustAddressNr, Outbound_OrderLine_ProductCode, Outbound_OrderLine_CustRef1, Outbound_OrderLine_CustRef2, Outbound_OrderLine_CustRef3, Outbound_OrderLine_DeliveryAddress, Outbound_OrderLine_DeliveryAddressNr, Outbound_OrderLine_DateTimeDelivery, Outbound_OrderLine_EDILine1, Outbound_OrderLine_EDILine2, Outbound_OrderLine_EDILine3, Outbound_OrderLine_EDILine4, Outbound_OrderLine_EDILine5, Outbound_OrderLine_ExtEDILineText, Outbound_OrderLine_GrossWeight, Outbound_OrderLine_GrossWeightCode, Outbound_OrderLine_OuterPCK, Outbound_OrderLine_OuterPCKCode, Outbound_OrderLine_PackTypeCode, Outbound_OrderLine_ProdRef1, Outbound_OrderLine_ProdRef2, Outbound_OrderLine_ProdRef3, Outbound_OrderLine_ProdRef4, Outbound_OrderLine_ProdRef5, Outbound_OrderLine_ProductID, Outbound_OrderLine_ProductGroupCode, Outbound_OrderLine_QtyControlCode, Outbound_OrderLine_RecAddressNr, Outbound_OrderLine_Remarks, Outbound_OrderLine_StockRefNr, Outbound_OrderLine_SupplierAddressNr, Outbound_OrderLine_TermPlace, Outbound_OrderLine_TermCode, Outbound_OrderLine_TransactionCustomerRefNr, Outbound_OrderLine_WarehouseRef, function(Result_OrderLineID) {
                                console.log("f Process_Read_SoftPak_Message_Outbound_Insert_OrderLine - Orderline saved for order: " + Outbound_OrderLine_OrderNr + ", Orderline saved under ID: " + Result_OrderLineID);
                                var JSONObject_PALLET = JSONObject_OrderLine.PALLET;

                                for (var i = 0; i < JSONObject_PALLET.length; i++) {
                                    var JSONObject_OrderLine_Row = JSONObject_PALLET[i];

                                    var Outbound_PalletLine_StockNr             = JSONObject_OrderLine_Row.plt_stocknr;
                                    var Outbound_PalletLine_BarcodeExp          = JSONObject_OrderLine_Row.plt_barcode_exp;
                                    var Outbound_PalletLine_BarcodeID           = JSONObject_OrderLine_Row.plt_barcode_id;
                                    var Outbound_PalletLine_BarcodeIDInternal   = JSONObject_OrderLine_Row.plt_barcode_id_internal;
                                    var Outbound_PalletLine_CalcRef1            = JSONObject_OrderLine_Row.plt_calcref1;
                                    var Outbound_PalletLine_CalcRef2            = JSONObject_OrderLine_Row.plt_calcref2;
                                    var Outbound_PalletLine_CalcRef3            = JSONObject_OrderLine_Row.plt_calcref3;
                                    var Outbound_PalletLine_Carrier             = JSONObject_OrderLine_Row.plt_carrier;
                                    var Outbound_PalletLine_CarrierCode         = JSONObject_OrderLine_Row.plt_carriercode;
                                    var Outbound_PalletLine_CompanyCode         = JSONObject_OrderLine_Row.plt_companycode;
                                    var Outbound_PalletLine_DamageNr            = JSONObject_OrderLine_Row.plt_damagenr;
                                    var Outbound_PalletLine_DateTimeCreate      = JSONObject_OrderLine_Row.plt_dt_create;
                                    var Outbound_PalletLine_DateTimeMutation    = JSONObject_OrderLine_Row.plt_dt_mutation;
                                    var Outbound_PalletLine_EDIStock1           = JSONObject_OrderLine_Row.plt_edi_stock_1;
                                    var Outbound_PalletLine_EDIStock2           = JSONObject_OrderLine_Row.plt_edi_stock_2;
                                    var Outbound_PalletLine_EDIStock3           = JSONObject_OrderLine_Row.plt_edi_stock_3;
                                    var Outbound_PalletLine_EDIStock4           = JSONObject_OrderLine_Row.plt_edi_stock_4;
                                    var Outbound_PalletLine_EDIStock5           = JSONObject_OrderLine_Row.plt_edi_stock_5;
                                    var Outbound_PalletLine_GrossWeight         = JSONObject_OrderLine_Row.plt_grossweight;
                                    var Outbound_PalletLine_GrossWeightCode     = JSONObject_OrderLine_Row.plt_grossweightcode;
                                    var Outbound_PalletLine_InLineNr            = JSONObject_OrderLine_Row.plt_in_linenr;
                                    var Outbound_PalletLine_InOrderNr           = JSONObject_OrderLine_Row.plt_in_ordnr;
                                    var Outbound_PalletLine_IndActive           = JSONObject_OrderLine_Row.plt_ind_active;
                                    var Outbound_PalletLine_IndBlocked          = JSONObject_OrderLine_Row.plt_ind_blocked;
                                    var Outbound_PalletLine_NettWeight          = JSONObject_OrderLine_Row.plt_nettweight;
                                    var Outbound_PalletLine_NettWeightCode      = JSONObject_OrderLine_Row.plt_nettweightcode;
                                    var Outbound_PalletLine_OuterPCK            = JSONObject_OrderLine_Row.plt_outer_pck;
                                    var Outbound_PalletLine_OuterPCKCode        = JSONObject_OrderLine_Row.plt_outer_pckcode;
                                    var Outbound_PalletLine_PackTypeCode        = JSONObject_OrderLine_Row.plt_packtypecode;
                                    var Outbound_PalletLine_ProdRef1            = JSONObject_OrderLine_Row.plt_prodref1;
                                    var Outbound_PalletLine_ProdRef2            = JSONObject_OrderLine_Row.plt_prodref2;
                                    var Outbound_PalletLine_ProdRef3            = JSONObject_OrderLine_Row.plt_prodref3;
                                    var Outbound_PalletLine_ProdRef4            = JSONObject_OrderLine_Row.plt_prodref4;
                                    var Outbound_PalletLine_ProdRef5            = JSONObject_OrderLine_Row.plt_prodref5;
                                    var Outbound_PalletLine_ProductID           = JSONObject_OrderLine_Row.plt_product_id;
                                    var Outbound_PalletLine_ProductGroupCode    = JSONObject_OrderLine_Row.plt_productgroupcode;
                                    var Outbound_PalletLine_StockRefNr          = JSONObject_OrderLine_Row.plt_stockrefnr;
                                    var Outbound_PalletLine_SupplierAddressNr   = JSONObject_OrderLine_Row.plt_supplier_addressnr;
                                    var Outbound_PalletLine_TimCreate           = JSONObject_OrderLine_Row.plt_tim_create;
                                    var Outbound_PalletLine_WarehouseRef        = JSONObject_OrderLine_Row.plt_warehouseref;

                                    Outbound_PalletLine_StockNr             = Outbound_PalletLine_StockNr.toString();
                                    Outbound_PalletLine_BarcodeExp          = Outbound_PalletLine_BarcodeExp.toString();
                                    Outbound_PalletLine_BarcodeID           = Outbound_PalletLine_BarcodeID.toString();
                                    Outbound_PalletLine_BarcodeIDInternal   = Outbound_PalletLine_BarcodeIDInternal.toString();
                                    Outbound_PalletLine_CalcRef1            = Outbound_PalletLine_CalcRef1.toString();
                                    Outbound_PalletLine_CalcRef2            = Outbound_PalletLine_CalcRef2.toString();
                                    Outbound_PalletLine_CalcRef3            = Outbound_PalletLine_CalcRef3.toString();
                                    Outbound_PalletLine_Carrier             = Outbound_PalletLine_Carrier.toString();
                                    Outbound_PalletLine_CarrierCode         = Outbound_PalletLine_CarrierCode.toString();
                                    Outbound_PalletLine_CompanyCode         = Outbound_PalletLine_CompanyCode.toString();
                                    Outbound_PalletLine_DamageNr            = Outbound_PalletLine_DamageNr.toString();
                                    Outbound_PalletLine_DateTimeCreate      = Outbound_PalletLine_DateTimeCreate.toString();
                                    Outbound_PalletLine_DateTimeMutation    = Outbound_PalletLine_DateTimeMutation.toString();
                                    Outbound_PalletLine_EDIStock1           = Outbound_PalletLine_EDIStock1.toString();
                                    Outbound_PalletLine_EDIStock2           = Outbound_PalletLine_EDIStock2.toString();
                                    Outbound_PalletLine_EDIStock3           = Outbound_PalletLine_EDIStock3.toString();
                                    Outbound_PalletLine_EDIStock4           = Outbound_PalletLine_EDIStock4.toString();
                                    Outbound_PalletLine_EDIStock5           = Outbound_PalletLine_EDIStock5.toString();
                                    Outbound_PalletLine_GrossWeight         = Outbound_PalletLine_GrossWeight.toString();
                                    Outbound_PalletLine_GrossWeightCode     = Outbound_PalletLine_GrossWeightCode.toString();
                                    Outbound_PalletLine_InLineNr            = Outbound_PalletLine_InLineNr.toString();
                                    Outbound_PalletLine_InOrderNr           = Outbound_PalletLine_InOrderNr.toString();
                                    Outbound_PalletLine_IndActive           = Outbound_PalletLine_IndActive.toString();
                                    Outbound_PalletLine_IndBlocked          = Outbound_PalletLine_IndBlocked.toString();
                                    Outbound_PalletLine_NettWeight          = Outbound_PalletLine_NettWeight.toString();
                                    Outbound_PalletLine_NettWeightCode      = Outbound_PalletLine_NettWeightCode.toString();
                                    Outbound_PalletLine_OuterPCK            = Outbound_PalletLine_OuterPCK.toString();
                                    Outbound_PalletLine_OuterPCKCode        = Outbound_PalletLine_OuterPCKCode.toString();
                                    Outbound_PalletLine_PackTypeCode        = Outbound_PalletLine_PackTypeCode.toString();
                                    Outbound_PalletLine_ProdRef1            = Outbound_PalletLine_ProdRef1.toString();
                                    Outbound_PalletLine_ProdRef2            = Outbound_PalletLine_ProdRef2.toString();
                                    Outbound_PalletLine_ProdRef3            = Outbound_PalletLine_ProdRef3.toString();
                                    Outbound_PalletLine_ProdRef4            = Outbound_PalletLine_ProdRef4.toString();
                                    Outbound_PalletLine_ProdRef5            = Outbound_PalletLine_ProdRef5.toString();
                                    Outbound_PalletLine_ProductID           = Outbound_PalletLine_ProductID.toString();
                                    Outbound_PalletLine_ProductGroupCode    = Outbound_PalletLine_ProductGroupCode.toString();
                                    Outbound_PalletLine_StockRefNr          = Outbound_PalletLine_StockRefNr.toString();
                                    Outbound_PalletLine_SupplierAddressNr   = Outbound_PalletLine_SupplierAddressNr.toString();
                                    Outbound_PalletLine_TimCreate           = Outbound_PalletLine_TimCreate.toString();
                                    Outbound_PalletLine_WarehouseRef        = Outbound_PalletLine_WarehouseRef.toString();

                                    if (Outbound_PalletLine_StockNr == "[object Object]") { Outbound_PalletLine_StockNr = ""; }
                                    if (Outbound_PalletLine_BarcodeExp == "[object Object]") { Outbound_PalletLine_BarcodeExp = ""; }
                                    if (Outbound_PalletLine_BarcodeID == "[object Object]") { Outbound_PalletLine_BarcodeID = ""; }
                                    if (Outbound_PalletLine_BarcodeIDInternal == "[object Object]") { Outbound_PalletLine_BarcodeIDInternal = ""; }
                                    if (Outbound_PalletLine_CalcRef1 == "[object Object]") { Outbound_PalletLine_CalcRef1 = ""; }
                                    if (Outbound_PalletLine_CalcRef2 == "[object Object]") { Outbound_PalletLine_CalcRef2 = ""; }
                                    if (Outbound_PalletLine_CalcRef3 == "[object Object]") { Outbound_PalletLine_CalcRef3 = ""; }
                                    if (Outbound_PalletLine_Carrier == "[object Object]") { Outbound_PalletLine_Carrier = ""; }
                                    if (Outbound_PalletLine_CarrierCode == "[object Object]") { Outbound_PalletLine_CarrierCode = ""; }
                                    if (Outbound_PalletLine_CompanyCode == "[object Object]") { Outbound_PalletLine_CompanyCode = ""; }
                                    if (Outbound_PalletLine_DamageNr == "[object Object]") { Outbound_PalletLine_DamageNr = ""; }
                                    if (Outbound_PalletLine_DateTimeCreate == "[object Object]") { Outbound_PalletLine_DateTimeCreate = ""; }
                                    if (Outbound_PalletLine_DateTimeMutation == "[object Object]") { Outbound_PalletLine_DateTimeMutation = ""; }
                                    if (Outbound_PalletLine_EDIStock1 == "[object Object]") { Outbound_PalletLine_EDIStock1 = ""; }
                                    if (Outbound_PalletLine_EDIStock2 == "[object Object]") { Outbound_PalletLine_EDIStock2 = ""; }
                                    if (Outbound_PalletLine_EDIStock3 == "[object Object]") { Outbound_PalletLine_EDIStock3 = ""; }
                                    if (Outbound_PalletLine_EDIStock4 == "[object Object]") { Outbound_PalletLine_EDIStock4 = ""; }
                                    if (Outbound_PalletLine_EDIStock5 == "[object Object]") { Outbound_PalletLine_EDIStock5 = ""; }
                                    if (Outbound_PalletLine_GrossWeight == "[object Object]") { Outbound_PalletLine_GrossWeight = ""; }
                                    if (Outbound_PalletLine_GrossWeightCode == "[object Object]") { Outbound_PalletLine_GrossWeightCode = ""; }
                                    if (Outbound_PalletLine_InLineNr == "[object Object]") { Outbound_PalletLine_InLineNr = ""; }
                                    if (Outbound_PalletLine_InOrderNr == "[object Object]") { Outbound_PalletLine_InOrderNr = ""; }
                                    if (Outbound_PalletLine_IndActive == "[object Object]") { Outbound_PalletLine_IndActive = ""; }
                                    if (Outbound_PalletLine_IndBlocked == "[object Object]") { Outbound_PalletLine_IndBlocked = ""; }
                                    if (Outbound_PalletLine_NettWeight == "[object Object]") { Outbound_PalletLine_NettWeight = ""; }
                                    if (Outbound_PalletLine_NettWeightCode == "[object Object]") { Outbound_PalletLine_NettWeightCode = ""; }
                                    if (Outbound_PalletLine_OuterPCK == "[object Object]") { Outbound_PalletLine_OuterPCK = ""; }
                                    if (Outbound_PalletLine_OuterPCKCode == "[object Object]") { Outbound_PalletLine_OuterPCKCode = ""; }
                                    if (Outbound_PalletLine_PackTypeCode == "[object Object]") { Outbound_PalletLine_PackTypeCode = ""; }
                                    if (Outbound_PalletLine_ProdRef1 == "[object Object]") { Outbound_PalletLine_ProdRef1 = ""; }
                                    if (Outbound_PalletLine_ProdRef2 == "[object Object]") { Outbound_PalletLine_ProdRef2 = ""; }
                                    if (Outbound_PalletLine_ProdRef3 == "[object Object]") { Outbound_PalletLine_ProdRef3 = ""; }
                                    if (Outbound_PalletLine_ProdRef4 == "[object Object]") { Outbound_PalletLine_ProdRef4 = ""; }
                                    if (Outbound_PalletLine_ProdRef5 == "[object Object]") { Outbound_PalletLine_ProdRef5 = ""; }
                                    if (Outbound_PalletLine_ProductID == "[object Object]") { Outbound_PalletLine_ProductID = ""; }
                                    if (Outbound_PalletLine_ProductGroupCode == "[object Object]") { Outbound_PalletLine_ProductGroupCode = ""; }
                                    if (Outbound_PalletLine_StockRefNr == "[object Object]") { Outbound_PalletLine_StockRefNr = ""; }
                                    if (Outbound_PalletLine_SupplierAddressNr == "[object Object]") { Outbound_PalletLine_SupplierAddressNr = ""; }
                                    if (Outbound_PalletLine_TimCreate == "[object Object]") { Outbound_PalletLine_TimCreate = ""; }
                                    if (Outbound_PalletLine_WarehouseRef == "[object Object]") { Outbound_PalletLine_WarehouseRef = ""; }

                                    Process_Read_SoftPak_Message_Outbound_Insert_PalletLine(Result_OrderID, Result_OrderLineID, Outbound_PalletLine_StockNr, Outbound_PalletLine_BarcodeExp, Outbound_PalletLine_BarcodeID, Outbound_PalletLine_BarcodeIDInternal, Outbound_PalletLine_CalcRef1, Outbound_PalletLine_CalcRef2, Outbound_PalletLine_CalcRef3, Outbound_PalletLine_Carrier, Outbound_PalletLine_CarrierCode, Outbound_PalletLine_CompanyCode, Outbound_PalletLine_DamageNr, Outbound_PalletLine_DateTimeCreate, Outbound_PalletLine_DateTimeMutation, Outbound_PalletLine_EDIStock1, Outbound_PalletLine_EDIStock2, Outbound_PalletLine_EDIStock3, Outbound_PalletLine_EDIStock4, Outbound_PalletLine_EDIStock5, Outbound_PalletLine_GrossWeight, Outbound_PalletLine_GrossWeightCode, Outbound_PalletLine_InLineNr, Outbound_PalletLine_InOrderNr, Outbound_PalletLine_IndActive, Outbound_PalletLine_IndBlocked, Outbound_PalletLine_NettWeight, Outbound_PalletLine_NettWeightCode, Outbound_PalletLine_OuterPCK, Outbound_PalletLine_OuterPCKCode, Outbound_PalletLine_PackTypeCode, Outbound_PalletLine_ProdRef1, Outbound_PalletLine_ProdRef2, Outbound_PalletLine_ProdRef3, Outbound_PalletLine_ProdRef4, Outbound_PalletLine_ProdRef5, Outbound_PalletLine_ProductID, Outbound_PalletLine_ProductGroupCode, Outbound_PalletLine_StockRefNr, Outbound_PalletLine_SupplierAddressNr, Outbound_PalletLine_TimCreate, Outbound_PalletLine_WarehouseRef, function(Result_PalletLineID) {
                                        console.log("f Process_Read_SoftPak_Message_Outbound_Insert_PalletLine - Palletline saved for order: " + Outbound_OrderLine_OrderNr + ", PalletLine saved under ID: " + Result_PalletLineID);
                                    });                                    
                                }
                            });
                        } else {
                            for (var i = 0; i < JSONObject_OrderLine.length; i++) {
                                var JSONObject_OrderLine_Row = JSONObject_OrderLine[i];

                                var Outbound_OrderLine_OrderNr                  = JSONObject_OrderLine_Row.lin_out_ordnr;
                                var Outbound_OrderLine_LineNr                   = JSONObject_OrderLine_Row.lin_out_linenr;
                                var Outbound_OrderLine_Carrier                  = JSONObject_OrderLine_Row.lin_carrier;
                                var Outbound_OrderLine_CarrierCode              = JSONObject_OrderLine_Row.lin_carriercode;
                                var Outbound_OrderLine_CompanyCode              = JSONObject_OrderLine_Row.lin_companycode;
                                var Outbound_OrderLine_ContainerTypeCode        = JSONObject_OrderLine_Row.lin_container_typecode;
                                var Outbound_OrderLine_ContainerNr              = JSONObject_OrderLine_Row.lin_containernr;
                                var Outbound_OrderLine_CustAddressNr            = JSONObject_OrderLine_Row.lin_cust_addressnr;
                                var Outbound_OrderLine_ProductCode              = JSONObject_OrderLine_Row.lin_cust_productcode;
                                var Outbound_OrderLine_CustRef1                 = JSONObject_OrderLine_Row.lin_custref_out1;
                                var Outbound_OrderLine_CustRef2                 = JSONObject_OrderLine_Row.lin_custref_out2;
                                var Outbound_OrderLine_CustRef3                 = JSONObject_OrderLine_Row.lin_custref_out3;
                                var Outbound_OrderLine_DeliveryAddress          = JSONObject_OrderLine_Row.lin_delivery_address;
                                var Outbound_OrderLine_DeliveryAddressNr        = JSONObject_OrderLine_Row.lin_delivery_addressnr;
                                var Outbound_OrderLine_DateTimeDelivery         = JSONObject_OrderLine_Row.lin_dt_delivery["xsi:nil"];
                                var Outbound_OrderLine_EDILine1                 = JSONObject_OrderLine_Row.lin_edi_out_line_1;
                                var Outbound_OrderLine_EDILine2                 = JSONObject_OrderLine_Row.lin_edi_out_line_2;
                                var Outbound_OrderLine_EDILine3                 = JSONObject_OrderLine_Row.lin_edi_out_line_3;
                                var Outbound_OrderLine_EDILine4                 = JSONObject_OrderLine_Row.lin_edi_out_line_4;
                                var Outbound_OrderLine_EDILine5                 = JSONObject_OrderLine_Row.lin_edi_out_line_5;
                                var Outbound_OrderLine_ExtEDILineText           = JSONObject_OrderLine_Row.lin_ext_edi_line_text;
                                var Outbound_OrderLine_GrossWeight              = JSONObject_OrderLine_Row.lin_grossweight;
                                var Outbound_OrderLine_GrossWeightCode          = JSONObject_OrderLine_Row.lin_grossweightcode;
                                var Outbound_OrderLine_OuterPCK                 = JSONObject_OrderLine_Row.lin_outer_pck;
                                var Outbound_OrderLine_OuterPCKCode             = JSONObject_OrderLine_Row.lin_outer_pckcode;
                                var Outbound_OrderLine_PackTypeCode             = JSONObject_OrderLine_Row.lin_packtypecode;
                                var Outbound_OrderLine_ProdRef1                 = JSONObject_OrderLine_Row.lin_prodref1;
                                var Outbound_OrderLine_ProdRef2                 = JSONObject_OrderLine_Row.lin_prodref2;
                                var Outbound_OrderLine_ProdRef3                 = JSONObject_OrderLine_Row.lin_prodref3;
                                var Outbound_OrderLine_ProdRef4                 = JSONObject_OrderLine_Row.lin_prodref4;
                                var Outbound_OrderLine_ProdRef5                 = JSONObject_OrderLine_Row.lin_prodref5;
                                var Outbound_OrderLine_ProductID                = JSONObject_OrderLine_Row.lin_product_id;
                                var Outbound_OrderLine_ProductGroupCode         = JSONObject_OrderLine_Row.lin_productgroupcode;
                                var Outbound_OrderLine_QtyControlCode           = JSONObject_OrderLine_Row.lin_qty_controlcode;
                                var Outbound_OrderLine_RecAddressNr             = JSONObject_OrderLine_Row.lin_rec_addressnr;
                                var Outbound_OrderLine_Remarks                  = JSONObject_OrderLine_Row.lin_remarks;
                                var Outbound_OrderLine_StockRefNr               = JSONObject_OrderLine_Row.lin_stockrefnr;
                                var Outbound_OrderLine_SupplierAddressNr        = JSONObject_OrderLine_Row.lin_supplier_addressnr;
                                var Outbound_OrderLine_TermPlace                = JSONObject_OrderLine_Row.lin_term_place;
                                var Outbound_OrderLine_TermCode                 = JSONObject_OrderLine_Row.lin_termcode;
                                var Outbound_OrderLine_TransactionCustomerRefNr = JSONObject_OrderLine_Row.lin_transaction_customsrefnr;
                                var Outbound_OrderLine_WarehouseRef             = JSONObject_OrderLine_Row.lin_warehouseref;

                                Outbound_OrderLine_OrderNr                  = Outbound_OrderLine_OrderNr.toString();
                                Outbound_OrderLine_LineNr                   = Outbound_OrderLine_LineNr.toString();
                                Outbound_OrderLine_Carrier                  = Outbound_OrderLine_Carrier.toString();
                                Outbound_OrderLine_CarrierCode              = Outbound_OrderLine_CarrierCode.toString();
                                Outbound_OrderLine_CompanyCode              = Outbound_OrderLine_CompanyCode.toString();
                                Outbound_OrderLine_ContainerTypeCode        = Outbound_OrderLine_ContainerTypeCode.toString();
                                Outbound_OrderLine_ContainerNr              = Outbound_OrderLine_ContainerNr.toString();
                                Outbound_OrderLine_CustAddressNr            = Outbound_OrderLine_CustAddressNr.toString();
                                Outbound_OrderLine_ProductCode              = Outbound_OrderLine_ProductCode.toString();
                                Outbound_OrderLine_CustRef1                 = Outbound_OrderLine_CustRef1.toString();
                                Outbound_OrderLine_CustRef2                 = Outbound_OrderLine_CustRef2.toString();
                                Outbound_OrderLine_CustRef3                 = Outbound_OrderLine_CustRef3.toString();
                                Outbound_OrderLine_DeliveryAddress          = Outbound_OrderLine_DeliveryAddress.toString();
                                Outbound_OrderLine_DeliveryAddressNr        = Outbound_OrderLine_DeliveryAddressNr.toString();
                                Outbound_OrderLine_DateTimeDelivery         = Outbound_OrderLine_DateTimeDelivery.toString();
                                Outbound_OrderLine_EDILine1                 = Outbound_OrderLine_EDILine1.toString();
                                Outbound_OrderLine_EDILine2                 = Outbound_OrderLine_EDILine2.toString();
                                Outbound_OrderLine_EDILine3                 = Outbound_OrderLine_EDILine3.toString();
                                Outbound_OrderLine_EDILine4                 = Outbound_OrderLine_EDILine4.toString();
                                Outbound_OrderLine_EDILine5                 = Outbound_OrderLine_EDILine5.toString();
                                Outbound_OrderLine_ExtEDILineText           = Outbound_OrderLine_ExtEDILineText.toString();
                                Outbound_OrderLine_GrossWeight              = Outbound_OrderLine_GrossWeight.toString();
                                Outbound_OrderLine_GrossWeightCode          = Outbound_OrderLine_GrossWeightCode.toString();
                                Outbound_OrderLine_OuterPCK                 = Outbound_OrderLine_OuterPCK.toString();
                                Outbound_OrderLine_OuterPCKCode             = Outbound_OrderLine_OuterPCKCode.toString();
                                Outbound_OrderLine_PackTypeCode             = Outbound_OrderLine_PackTypeCode.toString();
                                Outbound_OrderLine_ProdRef1                 = Outbound_OrderLine_ProdRef1.toString();
                                Outbound_OrderLine_ProdRef2                 = Outbound_OrderLine_ProdRef2.toString();
                                Outbound_OrderLine_ProdRef3                 = Outbound_OrderLine_ProdRef3.toString();
                                Outbound_OrderLine_ProdRef4                 = Outbound_OrderLine_ProdRef4.toString();
                                Outbound_OrderLine_ProdRef5                 = Outbound_OrderLine_ProdRef5.toString();
                                Outbound_OrderLine_ProductID                = Outbound_OrderLine_ProductID.toString();
                                Outbound_OrderLine_ProductGroupCode         = Outbound_OrderLine_ProductGroupCode.toString();
                                Outbound_OrderLine_QtyControlCode           = Outbound_OrderLine_QtyControlCode.toString();
                                Outbound_OrderLine_RecAddressNr             = Outbound_OrderLine_RecAddressNr.toString();
                                Outbound_OrderLine_Remarks                  = Outbound_OrderLine_Remarks.toString();
                                Outbound_OrderLine_StockRefNr               = Outbound_OrderLine_StockRefNr.toString();
                                Outbound_OrderLine_SupplierAddressNr        = Outbound_OrderLine_SupplierAddressNr.toString();
                                Outbound_OrderLine_TermPlace                = Outbound_OrderLine_TermPlace.toString();
                                Outbound_OrderLine_TermCode                 = Outbound_OrderLine_TermCode.toString();
                                Outbound_OrderLine_TransactionCustomerRefNr = Outbound_OrderLine_TransactionCustomerRefNr.toString();
                                Outbound_OrderLine_WarehouseRef             = Outbound_OrderLine_WarehouseRef.toString();

                                if (Outbound_OrderLine_OrderNr == "[object Object]") { Outbound_OrderLine_OrderNr = ""; }
                                if (Outbound_OrderLine_LineNr == "[object Object]") { Outbound_OrderLine_LineNr = ""; }
                                if (Outbound_OrderLine_Carrier == "[object Object]") { Outbound_OrderLine_Carrier = ""; }
                                if (Outbound_OrderLine_CarrierCode == "[object Object]") { Outbound_OrderLine_CarrierCode = ""; }
                                if (Outbound_OrderLine_CompanyCode == "[object Object]") { Outbound_OrderLine_CompanyCode = ""; }
                                if (Outbound_OrderLine_ContainerTypeCode == "[object Object]") { Outbound_OrderLine_ContainerTypeCode = ""; }
                                if (Outbound_OrderLine_ContainerNr == "[object Object]") { Outbound_OrderLine_ContainerNr = ""; }
                                if (Outbound_OrderLine_CustAddressNr == "[object Object]") { Outbound_OrderLine_CustAddressNr = ""; }
                                if (Outbound_OrderLine_ProductCode == "[object Object]") { Outbound_OrderLine_ProductCode = ""; }
                                if (Outbound_OrderLine_CustRef1 == "[object Object]") { Outbound_OrderLine_CustRef1 = ""; }
                                if (Outbound_OrderLine_CustRef2 == "[object Object]") { Outbound_OrderLine_CustRef2 = ""; }
                                if (Outbound_OrderLine_CustRef3 == "[object Object]") { Outbound_OrderLine_CustRef3 = ""; }
                                if (Outbound_OrderLine_DeliveryAddress == "[object Object]") { Outbound_OrderLine_DeliveryAddress = ""; }
                                if (Outbound_OrderLine_DeliveryAddressNr == "[object Object]") { Outbound_OrderLine_DeliveryAddressNr = ""; }
                                if (Outbound_OrderLine_DateTimeDelivery == "[object Object]") { Outbound_OrderLine_DateTimeDelivery = ""; }
                                if (Outbound_OrderLine_EDILine1 == "[object Object]") { Outbound_OrderLine_EDILine1 = ""; }
                                if (Outbound_OrderLine_EDILine2 == "[object Object]") { Outbound_OrderLine_EDILine2 = ""; }
                                if (Outbound_OrderLine_EDILine3 == "[object Object]") { Outbound_OrderLine_EDILine3 = ""; }
                                if (Outbound_OrderLine_EDILine4 == "[object Object]") { Outbound_OrderLine_EDILine4 = ""; }
                                if (Outbound_OrderLine_EDILine5 == "[object Object]") { Outbound_OrderLine_EDILine5 = ""; }
                                if (Outbound_OrderLine_ExtEDILineText == "[object Object]") { Outbound_OrderLine_ExtEDILineText = ""; }
                                if (Outbound_OrderLine_GrossWeight == "[object Object]") { Outbound_OrderLine_GrossWeight = ""; }
                                if (Outbound_OrderLine_GrossWeightCode == "[object Object]") { Outbound_OrderLine_GrossWeightCode = ""; }
                                if (Outbound_OrderLine_OuterPCK == "[object Object]") { Outbound_OrderLine_OuterPCK = ""; }
                                if (Outbound_OrderLine_OuterPCKCode == "[object Object]") { Outbound_OrderLine_OuterPCKCode = ""; }
                                if (Outbound_OrderLine_PackTypeCode == "[object Object]") { Outbound_OrderLine_PackTypeCode = ""; }
                                if (Outbound_OrderLine_ProdRef1 == "[object Object]") { Outbound_OrderLine_ProdRef1 = ""; }
                                if (Outbound_OrderLine_ProdRef2 == "[object Object]") { Outbound_OrderLine_ProdRef2 = ""; }
                                if (Outbound_OrderLine_ProdRef3 == "[object Object]") { Outbound_OrderLine_ProdRef3 = ""; }
                                if (Outbound_OrderLine_ProdRef4 == "[object Object]") { Outbound_OrderLine_ProdRef4 = ""; }
                                if (Outbound_OrderLine_ProdRef5 == "[object Object]") { Outbound_OrderLine_ProdRef5 = ""; }
                                if (Outbound_OrderLine_ProductID == "[object Object]") { Outbound_OrderLine_ProductID = ""; }
                                if (Outbound_OrderLine_ProductGroupCode == "[object Object]") { Outbound_OrderLine_ProductGroupCode = ""; }
                                if (Outbound_OrderLine_QtyControlCode == "[object Object]") { Outbound_OrderLine_QtyControlCode = ""; }
                                if (Outbound_OrderLine_RecAddressNr == "[object Object]") { Outbound_OrderLine_RecAddressNr = ""; }
                                if (Outbound_OrderLine_Remarks == "[object Object]") { Outbound_OrderLine_Remarks = ""; }
                                if (Outbound_OrderLine_StockRefNr == "[object Object]") { Outbound_OrderLine_StockRefNr = ""; }
                                if (Outbound_OrderLine_SupplierAddressNr == "[object Object]") { Outbound_OrderLine_SupplierAddressNr = ""; }
                                if (Outbound_OrderLine_TermPlace == "[object Object]") { Outbound_OrderLine_TermPlace = ""; }
                                if (Outbound_OrderLine_TermCode == "[object Object]") { Outbound_OrderLine_TermCode = ""; }
                                if (Outbound_OrderLine_TransactionCustomerRefNr == "[object Object]") { Outbound_OrderLine_TransactionCustomerRefNr = ""; }
                                if (Outbound_OrderLine_WarehouseRef == "[object Object]") { Outbound_OrderLine_WarehouseRef = ""; }

                                console.log("Outbound_OrderLine_OrderNr: " + Outbound_OrderLine_OrderNr);

                                Process_Read_SoftPak_Message_Outbound_Insert_OrderLine(Result_OrderID, Outbound_OrderLine_OrderNr, Outbound_OrderLine_LineNr, Outbound_OrderLine_Carrier, Outbound_OrderLine_CarrierCode, Outbound_OrderLine_CompanyCode, Outbound_OrderLine_ContainerTypeCode, Outbound_OrderLine_ContainerNr, Outbound_OrderLine_CustAddressNr, Outbound_OrderLine_ProductCode, Outbound_OrderLine_CustRef1, Outbound_OrderLine_CustRef2, Outbound_OrderLine_CustRef3, Outbound_OrderLine_DeliveryAddress, Outbound_OrderLine_DeliveryAddressNr, Outbound_OrderLine_DateTimeDelivery, Outbound_OrderLine_EDILine1, Outbound_OrderLine_EDILine2, Outbound_OrderLine_EDILine3, Outbound_OrderLine_EDILine4, Outbound_OrderLine_EDILine5, Outbound_OrderLine_ExtEDILineText, Outbound_OrderLine_GrossWeight, Outbound_OrderLine_GrossWeightCode, Outbound_OrderLine_OuterPCK, Outbound_OrderLine_OuterPCKCode, Outbound_OrderLine_PackTypeCode, Outbound_OrderLine_ProdRef1, Outbound_OrderLine_ProdRef2, Outbound_OrderLine_ProdRef3, Outbound_OrderLine_ProdRef4, Outbound_OrderLine_ProdRef5, Outbound_OrderLine_ProductID, Outbound_OrderLine_ProductGroupCode, Outbound_OrderLine_QtyControlCode, Outbound_OrderLine_RecAddressNr, Outbound_OrderLine_Remarks, Outbound_OrderLine_StockRefNr, Outbound_OrderLine_SupplierAddressNr, Outbound_OrderLine_TermPlace, Outbound_OrderLine_TermCode, Outbound_OrderLine_TransactionCustomerRefNr, Outbound_OrderLine_WarehouseRef, function(Result_OrderLineID) {
                                    console.log("f Process_Read_SoftPak_Message_Outbound_Insert_OrderLine - Orderline saved for order: " + Outbound_OrderLine_OrderNr + ", Orderline saved under ID: " + Result_OrderLineID);
                                    var JSONObject_PALLET = JSONObject_OrderLine_Row.PALLET;

                                    for (var i = 0; i < JSONObject_PALLET.length; i++) {
                                        var JSONObject_OrderLine_Row = JSONObject_PALLET[i];

                                        var Outbound_PalletLine_StockNr             = JSONObject_OrderLine_Row.plt_stocknr;
                                        var Outbound_PalletLine_BarcodeExp          = JSONObject_OrderLine_Row.plt_barcode_exp;
                                        var Outbound_PalletLine_BarcodeID           = JSONObject_OrderLine_Row.plt_barcode_id;
                                        var Outbound_PalletLine_BarcodeIDInternal   = JSONObject_OrderLine_Row.plt_barcode_id_internal;
                                        var Outbound_PalletLine_CalcRef1            = JSONObject_OrderLine_Row.plt_calcref1;
                                        var Outbound_PalletLine_CalcRef2            = JSONObject_OrderLine_Row.plt_calcref2;
                                        var Outbound_PalletLine_CalcRef3            = JSONObject_OrderLine_Row.plt_calcref3;
                                        var Outbound_PalletLine_Carrier             = JSONObject_OrderLine_Row.plt_carrier;
                                        var Outbound_PalletLine_CarrierCode         = JSONObject_OrderLine_Row.plt_carriercode;
                                        var Outbound_PalletLine_CompanyCode         = JSONObject_OrderLine_Row.plt_companycode;
                                        var Outbound_PalletLine_DamageNr            = JSONObject_OrderLine_Row.plt_damagenr;
                                        var Outbound_PalletLine_DateTimeCreate      = JSONObject_OrderLine_Row.plt_dt_create;
                                        var Outbound_PalletLine_DateTimeMutation    = JSONObject_OrderLine_Row.plt_dt_mutation;
                                        var Outbound_PalletLine_EDIStock1           = JSONObject_OrderLine_Row.plt_edi_stock_1;
                                        var Outbound_PalletLine_EDIStock2           = JSONObject_OrderLine_Row.plt_edi_stock_2;
                                        var Outbound_PalletLine_EDIStock3           = JSONObject_OrderLine_Row.plt_edi_stock_3;
                                        var Outbound_PalletLine_EDIStock4           = JSONObject_OrderLine_Row.plt_edi_stock_4;
                                        var Outbound_PalletLine_EDIStock5           = JSONObject_OrderLine_Row.plt_edi_stock_5;
                                        var Outbound_PalletLine_GrossWeight         = JSONObject_OrderLine_Row.plt_grossweight;
                                        var Outbound_PalletLine_GrossWeightCode     = JSONObject_OrderLine_Row.plt_grossweightcode;
                                        var Outbound_PalletLine_InLineNr            = JSONObject_OrderLine_Row.plt_in_linenr;
                                        var Outbound_PalletLine_InOrderNr           = JSONObject_OrderLine_Row.plt_in_ordnr;
                                        var Outbound_PalletLine_IndActive           = JSONObject_OrderLine_Row.plt_ind_active;
                                        var Outbound_PalletLine_IndBlocked          = JSONObject_OrderLine_Row.plt_ind_blocked;
                                        var Outbound_PalletLine_NettWeight          = JSONObject_OrderLine_Row.plt_nettweight;
                                        var Outbound_PalletLine_NettWeightCode      = JSONObject_OrderLine_Row.plt_nettweightcode;
                                        var Outbound_PalletLine_OuterPCK            = JSONObject_OrderLine_Row.plt_outer_pck;
                                        var Outbound_PalletLine_OuterPCKCode        = JSONObject_OrderLine_Row.plt_outer_pckcode;
                                        var Outbound_PalletLine_PackTypeCode        = JSONObject_OrderLine_Row.plt_packtypecode;
                                        var Outbound_PalletLine_ProdRef1            = JSONObject_OrderLine_Row.plt_prodref1;
                                        var Outbound_PalletLine_ProdRef2            = JSONObject_OrderLine_Row.plt_prodref2;
                                        var Outbound_PalletLine_ProdRef3            = JSONObject_OrderLine_Row.plt_prodref3;
                                        var Outbound_PalletLine_ProdRef4            = JSONObject_OrderLine_Row.plt_prodref4;
                                        var Outbound_PalletLine_ProdRef5            = JSONObject_OrderLine_Row.plt_prodref5;
                                        var Outbound_PalletLine_ProductID           = JSONObject_OrderLine_Row.plt_product_id;
                                        var Outbound_PalletLine_ProductGroupCode    = JSONObject_OrderLine_Row.plt_productgroupcode;
                                        var Outbound_PalletLine_StockRefNr          = JSONObject_OrderLine_Row.plt_stockrefnr;
                                        var Outbound_PalletLine_SupplierAddressNr   = JSONObject_OrderLine_Row.plt_supplier_addressnr;
                                        var Outbound_PalletLine_TimCreate           = JSONObject_OrderLine_Row.plt_tim_create;
                                        var Outbound_PalletLine_WarehouseRef        = JSONObject_OrderLine_Row.plt_warehouseref;

                                        Outbound_PalletLine_StockNr             = Outbound_PalletLine_StockNr.toString();
                                        Outbound_PalletLine_BarcodeExp          = Outbound_PalletLine_BarcodeExp.toString();
                                        Outbound_PalletLine_BarcodeID           = Outbound_PalletLine_BarcodeID.toString();
                                        Outbound_PalletLine_BarcodeIDInternal   = Outbound_PalletLine_BarcodeIDInternal.toString();
                                        Outbound_PalletLine_CalcRef1            = Outbound_PalletLine_CalcRef1.toString();
                                        Outbound_PalletLine_CalcRef2            = Outbound_PalletLine_CalcRef2.toString();
                                        Outbound_PalletLine_CalcRef3            = Outbound_PalletLine_CalcRef3.toString();
                                        Outbound_PalletLine_Carrier             = Outbound_PalletLine_Carrier.toString();
                                        Outbound_PalletLine_CarrierCode         = Outbound_PalletLine_CarrierCode.toString();
                                        Outbound_PalletLine_CompanyCode         = Outbound_PalletLine_CompanyCode.toString();
                                        Outbound_PalletLine_DamageNr            = Outbound_PalletLine_DamageNr.toString();
                                        Outbound_PalletLine_DateTimeCreate      = Outbound_PalletLine_DateTimeCreate.toString();
                                        Outbound_PalletLine_DateTimeMutation    = Outbound_PalletLine_DateTimeMutation.toString();
                                        Outbound_PalletLine_EDIStock1           = Outbound_PalletLine_EDIStock1.toString();
                                        Outbound_PalletLine_EDIStock2           = Outbound_PalletLine_EDIStock2.toString();
                                        Outbound_PalletLine_EDIStock3           = Outbound_PalletLine_EDIStock3.toString();
                                        Outbound_PalletLine_EDIStock4           = Outbound_PalletLine_EDIStock4.toString();
                                        Outbound_PalletLine_EDIStock5           = Outbound_PalletLine_EDIStock5.toString();
                                        Outbound_PalletLine_GrossWeight         = Outbound_PalletLine_GrossWeight.toString();
                                        Outbound_PalletLine_GrossWeightCode     = Outbound_PalletLine_GrossWeightCode.toString();
                                        Outbound_PalletLine_InLineNr            = Outbound_PalletLine_InLineNr.toString();
                                        Outbound_PalletLine_InOrderNr           = Outbound_PalletLine_InOrderNr.toString();
                                        Outbound_PalletLine_IndActive           = Outbound_PalletLine_IndActive.toString();
                                        Outbound_PalletLine_IndBlocked          = Outbound_PalletLine_IndBlocked.toString();
                                        Outbound_PalletLine_NettWeight          = Outbound_PalletLine_NettWeight.toString();
                                        Outbound_PalletLine_NettWeightCode      = Outbound_PalletLine_NettWeightCode.toString();
                                        Outbound_PalletLine_OuterPCK            = Outbound_PalletLine_OuterPCK.toString();
                                        Outbound_PalletLine_OuterPCKCode        = Outbound_PalletLine_OuterPCKCode.toString();
                                        Outbound_PalletLine_PackTypeCode        = Outbound_PalletLine_PackTypeCode.toString();
                                        Outbound_PalletLine_ProdRef1            = Outbound_PalletLine_ProdRef1.toString();
                                        Outbound_PalletLine_ProdRef2            = Outbound_PalletLine_ProdRef2.toString();
                                        Outbound_PalletLine_ProdRef3            = Outbound_PalletLine_ProdRef3.toString();
                                        Outbound_PalletLine_ProdRef4            = Outbound_PalletLine_ProdRef4.toString();
                                        Outbound_PalletLine_ProdRef5            = Outbound_PalletLine_ProdRef5.toString();
                                        Outbound_PalletLine_ProductID           = Outbound_PalletLine_ProductID.toString();
                                        Outbound_PalletLine_ProductGroupCode    = Outbound_PalletLine_ProductGroupCode.toString();
                                        Outbound_PalletLine_StockRefNr          = Outbound_PalletLine_StockRefNr.toString();
                                        Outbound_PalletLine_SupplierAddressNr   = Outbound_PalletLine_SupplierAddressNr.toString();
                                        Outbound_PalletLine_TimCreate           = Outbound_PalletLine_TimCreate.toString();
                                        Outbound_PalletLine_WarehouseRef        = Outbound_PalletLine_WarehouseRef.toString();

                                        if (Outbound_PalletLine_StockNr == "[object Object]") { Outbound_PalletLine_StockNr = ""; }
                                        if (Outbound_PalletLine_BarcodeExp == "[object Object]") { Outbound_PalletLine_BarcodeExp = ""; }
                                        if (Outbound_PalletLine_BarcodeID == "[object Object]") { Outbound_PalletLine_BarcodeID = ""; }
                                        if (Outbound_PalletLine_BarcodeIDInternal == "[object Object]") { Outbound_PalletLine_BarcodeIDInternal = ""; }
                                        if (Outbound_PalletLine_CalcRef1 == "[object Object]") { Outbound_PalletLine_CalcRef1 = ""; }
                                        if (Outbound_PalletLine_CalcRef2 == "[object Object]") { Outbound_PalletLine_CalcRef2 = ""; }
                                        if (Outbound_PalletLine_CalcRef3 == "[object Object]") { Outbound_PalletLine_CalcRef3 = ""; }
                                        if (Outbound_PalletLine_Carrier == "[object Object]") { Outbound_PalletLine_Carrier = ""; }
                                        if (Outbound_PalletLine_CarrierCode == "[object Object]") { Outbound_PalletLine_CarrierCode = ""; }
                                        if (Outbound_PalletLine_CompanyCode == "[object Object]") { Outbound_PalletLine_CompanyCode = ""; }
                                        if (Outbound_PalletLine_DamageNr == "[object Object]") { Outbound_PalletLine_DamageNr = ""; }
                                        if (Outbound_PalletLine_DateTimeCreate == "[object Object]") { Outbound_PalletLine_DateTimeCreate = ""; }
                                        if (Outbound_PalletLine_DateTimeMutation == "[object Object]") { Outbound_PalletLine_DateTimeMutation = ""; }
                                        if (Outbound_PalletLine_EDIStock1 == "[object Object]") { Outbound_PalletLine_EDIStock1 = ""; }
                                        if (Outbound_PalletLine_EDIStock2 == "[object Object]") { Outbound_PalletLine_EDIStock2 = ""; }
                                        if (Outbound_PalletLine_EDIStock3 == "[object Object]") { Outbound_PalletLine_EDIStock3 = ""; }
                                        if (Outbound_PalletLine_EDIStock4 == "[object Object]") { Outbound_PalletLine_EDIStock4 = ""; }
                                        if (Outbound_PalletLine_EDIStock5 == "[object Object]") { Outbound_PalletLine_EDIStock5 = ""; }
                                        if (Outbound_PalletLine_GrossWeight == "[object Object]") { Outbound_PalletLine_GrossWeight = ""; }
                                        if (Outbound_PalletLine_GrossWeightCode == "[object Object]") { Outbound_PalletLine_GrossWeightCode = ""; }
                                        if (Outbound_PalletLine_InLineNr == "[object Object]") { Outbound_PalletLine_InLineNr = ""; }
                                        if (Outbound_PalletLine_InOrderNr == "[object Object]") { Outbound_PalletLine_InOrderNr = ""; }
                                        if (Outbound_PalletLine_IndActive == "[object Object]") { Outbound_PalletLine_IndActive = ""; }
                                        if (Outbound_PalletLine_IndBlocked == "[object Object]") { Outbound_PalletLine_IndBlocked = ""; }
                                        if (Outbound_PalletLine_NettWeight == "[object Object]") { Outbound_PalletLine_NettWeight = ""; }
                                        if (Outbound_PalletLine_NettWeightCode == "[object Object]") { Outbound_PalletLine_NettWeightCode = ""; }
                                        if (Outbound_PalletLine_OuterPCK == "[object Object]") { Outbound_PalletLine_OuterPCK = ""; }
                                        if (Outbound_PalletLine_OuterPCKCode == "[object Object]") { Outbound_PalletLine_OuterPCKCode = ""; }
                                        if (Outbound_PalletLine_PackTypeCode == "[object Object]") { Outbound_PalletLine_PackTypeCode = ""; }
                                        if (Outbound_PalletLine_ProdRef1 == "[object Object]") { Outbound_PalletLine_ProdRef1 = ""; }
                                        if (Outbound_PalletLine_ProdRef2 == "[object Object]") { Outbound_PalletLine_ProdRef2 = ""; }
                                        if (Outbound_PalletLine_ProdRef3 == "[object Object]") { Outbound_PalletLine_ProdRef3 = ""; }
                                        if (Outbound_PalletLine_ProdRef4 == "[object Object]") { Outbound_PalletLine_ProdRef4 = ""; }
                                        if (Outbound_PalletLine_ProdRef5 == "[object Object]") { Outbound_PalletLine_ProdRef5 = ""; }
                                        if (Outbound_PalletLine_ProductID == "[object Object]") { Outbound_PalletLine_ProductID = ""; }
                                        if (Outbound_PalletLine_ProductGroupCode == "[object Object]") { Outbound_PalletLine_ProductGroupCode = ""; }
                                        if (Outbound_PalletLine_StockRefNr == "[object Object]") { Outbound_PalletLine_StockRefNr = ""; }
                                        if (Outbound_PalletLine_SupplierAddressNr == "[object Object]") { Outbound_PalletLine_SupplierAddressNr = ""; }
                                        if (Outbound_PalletLine_TimCreate == "[object Object]") { Outbound_PalletLine_TimCreate = ""; }
                                        if (Outbound_PalletLine_WarehouseRef == "[object Object]") { Outbound_PalletLine_WarehouseRef = ""; }

                                        Process_Read_SoftPak_Message_Outbound_Insert_PalletLine(Result_OrderID, Result_OrderLineID, Outbound_PalletLine_StockNr, Outbound_PalletLine_BarcodeExp, Outbound_PalletLine_BarcodeID, Outbound_PalletLine_BarcodeIDInternal, Outbound_PalletLine_CalcRef1, Outbound_PalletLine_CalcRef2, Outbound_PalletLine_CalcRef3, Outbound_PalletLine_Carrier, Outbound_PalletLine_CarrierCode, Outbound_PalletLine_CompanyCode, Outbound_PalletLine_DamageNr, Outbound_PalletLine_DateTimeCreate, Outbound_PalletLine_DateTimeMutation, Outbound_PalletLine_EDIStock1, Outbound_PalletLine_EDIStock2, Outbound_PalletLine_EDIStock3, Outbound_PalletLine_EDIStock4, Outbound_PalletLine_EDIStock5, Outbound_PalletLine_GrossWeight, Outbound_PalletLine_GrossWeightCode, Outbound_PalletLine_InLineNr, Outbound_PalletLine_InOrderNr, Outbound_PalletLine_IndActive, Outbound_PalletLine_IndBlocked, Outbound_PalletLine_NettWeight, Outbound_PalletLine_NettWeightCode, Outbound_PalletLine_OuterPCK, Outbound_PalletLine_OuterPCKCode, Outbound_PalletLine_PackTypeCode, Outbound_PalletLine_ProdRef1, Outbound_PalletLine_ProdRef2, Outbound_PalletLine_ProdRef3, Outbound_PalletLine_ProdRef4, Outbound_PalletLine_ProdRef5, Outbound_PalletLine_ProductID, Outbound_PalletLine_ProductGroupCode, Outbound_PalletLine_StockRefNr, Outbound_PalletLine_SupplierAddressNr, Outbound_PalletLine_TimCreate, Outbound_PalletLine_WarehouseRef, function(Result_PalletLineID) {
                                            console.log("f Process_Read_SoftPak_Message_Outbound_Insert_PalletLine - Palletline saved for order: " + Outbound_OrderLine_OrderNr + ", PalletLine saved under ID: " + Result_PalletLineID);
                                        });                                    
                                    }
                                });
                            }
                        }
                    });
                    Update_ProcessDocuments_Status_Processed(InConfirmFile_ID ,function(succes) {
                        if(succes){
                            console.log("f Process_Read_SoftPak_Message_Outbound - ProcessedDocuments row updated for ID: " + InConfirmFile_ID);
                        } else {
                            console.error("f Process_Read_SoftPak_Message_Outbound - ProcessedDocuments row not updated for ID: " + InConfirmFile_ID);
                        }
                    });
                }
            } catch (TryCatchError_S1) {
                console.error("f Process_Read_SoftPak_Message_Outbound - TryCatchError_S1: " + TryCatchError_S1);
            }
        }
    });

    //Disconnect from the SQL Database
    con.end;
}

function Process_Read_SoftPak_Message_Outbound_Insert_Order (Input_OrderNR, Input_CompanyCode, Input_ContainerTypeCode, Input_ContainerNr, Input_CustRef1, Input_CustRef2, Input_CustRef3, Input_CustRef4, Input_CustRef5, Input_CustRef6, Input_CustRef7, Input_CustRef8, Input_DeliveryAddress, Input_DeliveryName, Input_DeliveryZipCode, Input_DestinationCountryCode, Input_DateTimeCreate, Input_DateTimeDelivery, Input_DateTimeDeliveryTo, Input_DateTimeLoading, Input_DateTimeUpdate, Input_EDIOrd1, Input_EDIOrd2, Input_EDIOrd3, Input_EDIOrd4, Input_EDIOrd5, Input_ExtEDIOrdText, Input_LineCode, Input_TerminalCode, Input_ProjectNr, Input_RecAddressNr, Input_SealNo, Input_StatusCode, Input_TimCreate, Input_TimDelivery, Input_TimDeliveryTo, Input_TimLoading, Input_TimUpdated, Input_TransporterAddressNr, Input_TransportNr, Input_TransportUnitCode, callback) {
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorder` WHERE `OrderNR` = "' + Input_OrderNR + '" AND `ConfirmationSend` = "0" AND `OrderType` = "OUTCONFIRM" AND `ReponseMessageLanguage` = "XML"';
    var SQL_Insert_Statement = 'INSERT INTO `Softpak_ChangeManager`.`outtakeorder`(`OrderNR`, `CompanyCode`, `ContainerTypeCode`, `ContainerNR`, `CustRef1`, `CustRef2`, `CustRef3`, `CustRef4`, `CustRef5`, `CustRef6`, `CustRef7`, `CustRef8`, `DeliveryAddressNR`, `DeliveryName`, `DeliveryZipCode`, `DestinationCountryCode`, `DTCreate`, `DTDelivery`, `DTDeliveryTo`, `TDLoading`, `TDUpdate`, `EDIOrd1`, `EDIOrd2`, `EDIOrd3`, `EDIOrd4`, `EDIOrd5`, `ExtEDIOrderText`, `LineCode`, `LocTerminal`, `ProjectNR`, `RecAddressNR`, `SealNO`, `StatusCode`, `TimCreate`, `TimDelivery`, `TimDeliveryTo`, `TimLoading`, `TimUpdated`, `TransPorterAddressNR`, `TransPortNR`, `TransPortUnitCode`, `ConfirmationSend`, `OrderType`, `ReponseMessageLanguage`) VALUES ("' + Input_OrderNR + '", "' + Input_CompanyCode + '", "' + Input_ContainerTypeCode + '", "' + Input_ContainerNr + '", "' + Input_CustRef1 + '", "' + Input_CustRef2 + '", "' + Input_CustRef3 + '", "' + Input_CustRef4 + '", "' + Input_CustRef5 + '", "' + Input_CustRef6 + '", "' + Input_CustRef7 + '", "' + Input_CustRef8 + '", "' + Input_DeliveryAddress + '", "' + Input_DeliveryName + '", "' + Input_DeliveryZipCode + '", "' + Input_DestinationCountryCode + '", "' + Input_DateTimeCreate + '", "' + Input_DateTimeDelivery + '", "' + Input_DateTimeDeliveryTo + '", "' + Input_DateTimeLoading + '", "' + Input_DateTimeUpdate + '", "' + Input_EDIOrd1 + '", "' + Input_EDIOrd2 + '", "' + Input_EDIOrd3 + '", "' + Input_EDIOrd4 + '", "' + Input_EDIOrd5 + '", "' + Input_ExtEDIOrdText + '", "' + Input_LineCode + '", "' + Input_TerminalCode + '", "' + Input_ProjectNr + '", "' + Input_RecAddressNr + '", "' + Input_SealNo + '", "' + Input_StatusCode + '", "' + Input_TimCreate + '", "' + Input_TimDelivery + '", "' + Input_TimDeliveryTo + '", "' + Input_TimLoading + '", "' + Input_TimUpdated + '", "' + Input_TransporterAddressNr + '", "' + Input_TransportNr + '", "' + Input_TransportUnitCode + '", "0", "OUTCONFIRM", "XML")';

    //Connect to the MySQL Database
    con.connect;

    //Execute the insert statement
    try {
        con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
            //Check if there are any error messages
            if (SQL_S_err) {
                //If an error occurs, Log the error
                console.error("f Process_Read_SoftPak_Message_Outbound_Insert_Order - SQL_SELECT_ERRROR: " + SQL_S_err);
                callback("SQL_SELECT_ERROR, LINE: 3185");
            } else {
                try {
                    //Retriev the data from the database
                    var SQL_ID = SQL_S_rows[0].ID;
                    console.log("Row does exist already, continuing readout");
                    callback(SQL_ID);
                } catch (TryCatchError) {
                    console.log(TryCatchError)
                    console.log("Row does not exist, creating row");                    
                
                    con.query(SQL_Insert_Statement, function (err, result) {
                        if (err) throw err;
                        console.log("f Process_Read_SoftPak_Message_Outbound_Insert_Order - Order: INSERT Complete!, Inserted under ID: " + result.insertId);
                        callback(result.insertId);
                    });
                }
            }
        });
    } catch (ProcessError) {
        callback("PROCESS_ERROR, LINE: 3205");
    }

    //Disconnect from the MySQL Database
    con.end;
}

function Process_Read_SoftPak_Message_Outbound_Insert_OrderLine (Input_OrderID, Input_OrderNr, Input_LineNr, Input_Carrier, Input_CarrierCode, Input_CompanyCode, Input_ContainerTypeCode, Input_ContainerNr, Input_CustAddressNr, Input_ProductCode, Input_CustRef1, Input_CustRef2, Input_CustRef3, Input_DeliveryAddress, Input_DeliveryAddressNr, Input_DateTimeDelivery, Input_EDILine1, Input_EDILine2, Input_EDILine3, Input_EDILine4, Input_EDILine5, Input_ExtEDILineText, Input_GrossWeight, Input_GrossWeightCode, Input_OuterPCK, Input_OuterPCKCode, Input_PackTypeCode, Input_ProdRef1, Input_ProdRef2, Input_ProdRef3, Input_ProdRef4, Input_ProdRef5, Input_ProductID, Input_ProductGroupCode, Input_QtyControlCode, Input_RecAddressNr, Input_Remarks, Input_StockRefNr, Input_SupplierAddressNr, Input_TermPlace, Input_TermCode, Input_TransActionCustomerRefNr, Input_WareHouseRef, callback) {
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`outtakeorderline` WHERE `OrderID` = "' + Input_OrderID + '" AND `OrderType` = "OUTCONFIRM" AND `OrderNR` = "' + Input_OrderNr + '" AND `LineNR` = "' + Input_LineNr + '"';
    var SQL_Insert_Statement = 'INSERT INTO `Softpak_ChangeManager`.`outtakeorderline`(`OrderID`, `OrderType`, `OrderNR`, `LineNR`, `Carrier`, `CarrierCode`, `CompanyCode`, `ContainerTypeCode`, `ContainerNR`, `CustAddressNR`, `CustProductCode`, `CustRef1`, `CustRef2`, `CustRef3`, `DeliveryAddress`, `DeliveryAddressNR`, `DeliveryDate`, `EDILine1`, `EDILine2`, `EDILine3`, `EDILine4`, `EDILine5`, `ExtEDILineText`, `GrossWeight`, `GrossWeightCode`, `OuterPCK`, `OuterPCKCode`, `PackTypeCode`, `ProdRef1`, `ProdRef2`, `ProdRef3`, `ProdRef4`, `ProdRef5`, `ProductID`, `ProductGroupCode`, `QtyControlCode`, `RecAddressNR`, `Remarks`, `StockRefNR`, `SupplierAddressNR`, `TermPlace`, `TermCode`, `TransActionCustomerRef`, `WareHouseRef`) VALUES ("' + Input_OrderID + '", "OUTCONFIRM", "' + Input_OrderNr + '", "' + Input_LineNr + '", "' + Input_Carrier + '", "' + Input_CarrierCode + '", "' + Input_CompanyCode + '", "' + Input_ContainerTypeCode + '", "' + Input_ContainerNr + '", "' + Input_CustAddressNr + '", "' + Input_ProductCode + '", "' + Input_CustRef1 + '", "' + Input_CustRef2 + '", "' + Input_CustRef3 + '", "' + Input_DeliveryAddress + '", "' + Input_DeliveryAddressNr + '", "' + Input_DateTimeDelivery + '", "' + Input_EDILine1 + '", "' + Input_EDILine2 + '", "' + Input_EDILine3 + '", "' + Input_EDILine4 + '", "' + Input_EDILine5 + '", "' + Input_ExtEDILineText + '", "' + Input_GrossWeight + '", "' + Input_GrossWeightCode + '", "' + Input_OuterPCK + '", "' + Input_OuterPCKCode + '", "' + Input_PackTypeCode + '", "' + Input_ProdRef1 + '", "' + Input_ProdRef2 + '", "' + Input_ProdRef3 + '", "' + Input_ProdRef4 + '", "' + Input_ProdRef5 + '", "' + Input_ProductID + '", "' + Input_ProductGroupCode + '", "' + Input_QtyControlCode + '", "' + Input_RecAddressNr + '", "' + Input_Remarks + '", "' + Input_StockRefNr + '", "' + Input_SupplierAddressNr + '", "' + Input_TermPlace + '", "' + Input_TermCode + '", "' + Input_TransActionCustomerRefNr + '", "' + Input_WareHouseRef + '")';

    //Connect to the MySQL Database
    con.connect;

    //Execute the insert statement
    try {
        con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
            //Check if there are any error messages
            if (SQL_S_err) {
                //If an error occurs, Log the error
                console.error("f Process_Read_SoftPak_Message_Outbound_Insert_OrderLine - SQL_SELECT_ERRROR: " + SQL_S_err);
                callback("SQL_SELECT_ERROR, LINE: 3226");
            } else {
                try {
                    //Retriev the data from the database
                    var SQL_ID = SQL_S_rows[0].ID;
                    console.log("Row does exist already, continuing readout");
                    callback(SQL_ID);
                } catch (TryCatchError) {
                    console.log(TryCatchError)
                    console.log("Row does not exist, creating row");                    
                
                    con.query(SQL_Insert_Statement, function (err, result) {
                        if (err) throw err;
                        console.log("f Process_Read_SoftPak_Message_Outbound_Insert_OrderLine - OrderLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                        callback(result.insertId);
                    });
                }
            }
        });
    } catch (ProcessError) {
        callback("PROCESS_ERROR, LINE: 3246");
    }

    //Disconnect from the MySQL Database
    con.end;
}

function Process_Read_SoftPak_Message_Outbound_Insert_PalletLine (Input_OrderID, Input_OrderLineID, Input_StockNr, Input_BarcodeEXP, Input_BarcodeID, Input_BarcodeIDInternal, Input_CalcRef1, Input_CalcRef2, Input_CalcRef3, Input_Carrier, Input_CarrierCode, Input_CompanyCode, Input_DamageNr, Input_DateTimeCreate, Input_DateTimeMutation, Input_EDIStock1, Input_EDIStock2, Input_EDIStock3, Input_EDIStock4, Input_EDIStock5, Input_GrossWeight, Input_GrossWeightCode, Input_InLineNr, Input_InOrderNr, Input_IndActive, Input_IndBlocked, Input_NettWeight, Input_NettWeightCode, Input_OuterPCK, Input_OuterPCKCode, Input_PackTypeCode, Input_ProdRef1, Input_ProdRef2, Input_ProdRef3, Input_ProdRef4, Input_ProdRef5, Input_ProductID, Input_ProductGroupCode, Input_StockRefNr, Input_SupplierAddressNr, Input_TimCreate, Input_WarehouseRef, callback) {
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`palletline` WHERE `OrderID` = "' + Input_OrderID + '" AND `OrderLineID` = "' + Input_OrderLineID + '" AND `OrderType` = "OUTCONFIRM" AND `BarcodeID` = "' + Input_BarcodeID + '"';
    var SQL_Insert_Statement = 'INSERT INTO `Softpak_ChangeManager`.`palletline`(`OrderID`, `OrderLineID`, `OrderType`, `InboundOrOutbound`, `StockNr`, `BarcodeEXP`, `BarcodeID`, `BarcodeIDInternal`, `CalcRef1`, `CalcRef2`, `CalcRef3`, `Carrier`, `CarrierCode`, `CompanyCode`, `DamageNR`, `DT_Create`, `DT_Mutation`, `EDIStock1`, `EDIStock2`, `EDIStock3`, `EDIStock4`, `EDIStock5`, `GrossWeight`, `GrossWeightCode`, `InLineNR`, `InOrderNR`, `IndActive`, `IndBlocked`, `NettWeight`, `NettWeightCode`, `OuterPCK`, `OuterPCKCode`, `PackTypeCode`, `ProdRef1`, `ProdRef2`, `ProdRef3`, `ProdRef4`, `ProdRef5`, `ProductID`, `ProductGroupCode`, `StockRefNR`, `SupplierAdressNR`, `TimCreate`, `WareHouseRef`) VALUES ("' + Input_OrderID + '", "' + Input_OrderLineID + '", "OUTCONFIRM", "1", "' + Input_StockNr + '", "' + Input_BarcodeEXP + '", "' + Input_BarcodeID + '", "' + Input_BarcodeIDInternal + '", "' + Input_CalcRef1 + '", "' + Input_CalcRef2 + '", "' + Input_CalcRef3 + '", "' + Input_Carrier + '", "' + Input_CarrierCode + '", "' + Input_CompanyCode + '", "' + Input_DamageNr + '", "' + Input_DateTimeCreate + '", "' + Input_DateTimeMutation + '", "' + Input_EDIStock1 + '", "' + Input_EDIStock2 + '", "' + Input_EDIStock3 + '", "' + Input_EDIStock4 + '", "' + Input_EDIStock5 + '", "' + Input_GrossWeight + '", "' + Input_GrossWeightCode + '", "' + Input_InLineNr + '", "' + Input_InOrderNr + '", "' + Input_IndActive + '", "' + Input_IndBlocked + '", "' + Input_NettWeight + '", "' + Input_NettWeightCode + '", "' + Input_OuterPCK + '", "' + Input_OuterPCKCode + '", "' + Input_PackTypeCode + '", "' + Input_ProdRef1 + '", "' + Input_ProdRef2 + '", "' + Input_ProdRef3 + '", "' + Input_ProdRef4 + '", "' + Input_ProdRef5 + '", "' + Input_ProductID + '", "' + Input_ProductGroupCode + '", "' + Input_StockRefNr + '", "' + Input_SupplierAddressNr + '", "' + Input_TimCreate + '", "' + Input_WarehouseRef + '")';

    //Connect to the MySQL Database
    con.connect;

    //Execute the insert statement
    try {
        con.query(SQL_Select_Statement, function (SQL_S_err, SQL_S_rows, SQL_S_fields) {
            //Check if there are any error messages
            if (SQL_S_err) {
                //If an error occurs, Log the error
                console.error("f Process_Read_SoftPak_Message_Outbound_Insert_PalletLine - SQL_SELECT_ERRROR: " + SQL_S_err);
                callback("SQL_SELECT_ERROR, LINE: 3267");
            } else {
                try {
                    //Retriev the data from the database
                    var SQL_ID = SQL_S_rows[0].ID;
                    console.log("Row does exist already, continuing readout");
                    callback(SQL_ID);
                } catch (TryCatchError) {
                    console.log(TryCatchError)
                    console.log("Row does not exist, creating row");                    
                
                    con.query(SQL_Insert_Statement, function (err, result) {
                        if (err) throw err;
                        console.log("f Process_Read_SoftPak_Message_Outbound_Insert_PalletLine - PalletLine: INSERT Complete!, Inserted under ID: " + result.insertId);
                        callback(result.insertId);
                    });
                }
            }
        });
    } catch (ProcessError) {
        callback("PROCESS_ERROR, LINE: 3287");
    }

    //Disconnect from the MySQL Database
    con.end;
}

//-------------------------------

function Retriev_Inbound_Confirmation_files() {
    //Create SQL Select Statement
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`customer` WHERE `ExternalID` != 1';

    //Connect to the SQL database
    con.connect;

    //Query the SQL statement
    con.query(SQL_Select_Statement, function (SQL_err, SQL_rows, SQL_fields) {
        //Check if there are any error messages
        if (SQL_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL Error: " + SQL_err);
        } else {
            try {
                for (var i = 0; i < SQL_rows.length; i++) {
                    var Customer_ID                 = SQL_rows[i].ID;
                    var Customer_ExternalID         = SQL_rows[i].ExternalID;
                    var Customer_CustomerShortName  = SQL_rows[i].CustomerShortName;
                    var Customer_CustomerFullName   = SQL_rows[i].CustomerFullName;
                    var Customer_Street             = SQL_rows[i].Street;
                    var Customer_HouseNumber        = SQL_rows[i].HouseNumber;
                    var Customer_Postalcode         = SQL_rows[i].Postalcode;
                    var Customer_City               = SQL_rows[i].City;
                    var Customer_ResponseMessageLan = SQL_rows[i].ResponseMessageLan;
                    var Customer_ResponseMessageLoc = SQL_rows[i].ResponseMessageLoc;
                    var Customer_ResponseUser       = SQL_rows[i].ResponseUser;
                    var Customer_ResponseKey        = SQL_rows[i].ResponseKey;
                    var Customer_CreateDateTime     = SQL_rows[i].CreateDateTime;
                    var Customer_UpdateDateTime     = SQL_rows[i].UpdateDateTime;
                    var Customer_CreateBy           = SQL_rows[i].CreateBy;
                    var Customer_UpdateBy           = SQL_rows[i].UpdateBy;

                    //Define the FTP Variables
                    var Host = "10.1.24.2";
                    var Port = "31";
                    var User = "ediftp";
                    var Pswd = "IPgCmiAJYj6FcT01GKCH";

                    var filename = "Inconfirm_";
                    var fileextension = ".xml";

                    //Run the FTP Download and Delete function
                    downloadReportFiles(Host, Port, User, Pswd, filename, fileextension, Customer_ExternalID);
                }
            } catch (SQL_tryCatchError) {
                console.error(SQL_tryCatchError);
            }
        }
    });

    //disconnect from the SQL database
    con.end;
}

function Retriev_Outbound_Confirmation_files() {
    //Create SQL Select Statement
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`customer` WHERE `ExternalID` != 1';

    //Connect to the SQL database
    con.connect;

    //Query the SQL statement
    con.query(SQL_Select_Statement, function (SQL_err, SQL_rows, SQL_fields) {
        //Check if there are any error messages
        if (SQL_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL Error: " + SQL_err);
        } else {
            try {
                for (var i = 0; i < SQL_rows.length; i++) {
                    var Customer_ID                 = SQL_rows[i].ID;
                    var Customer_ExternalID         = SQL_rows[i].ExternalID;
                    var Customer_CustomerShortName  = SQL_rows[i].CustomerShortName;
                    var Customer_CustomerFullName   = SQL_rows[i].CustomerFullName;
                    var Customer_Street             = SQL_rows[i].Street;
                    var Customer_HouseNumber        = SQL_rows[i].HouseNumber;
                    var Customer_Postalcode         = SQL_rows[i].Postalcode;
                    var Customer_City               = SQL_rows[i].City;
                    var Customer_ResponseMessageLan = SQL_rows[i].ResponseMessageLan;
                    var Customer_ResponseMessageLoc = SQL_rows[i].ResponseMessageLoc;
                    var Customer_ResponseUser       = SQL_rows[i].ResponseUser;
                    var Customer_ResponseKey        = SQL_rows[i].ResponseKey;
                    var Customer_CreateDateTime     = SQL_rows[i].CreateDateTime;
                    var Customer_UpdateDateTime     = SQL_rows[i].UpdateDateTime;
                    var Customer_CreateBy           = SQL_rows[i].CreateBy;
                    var Customer_UpdateBy           = SQL_rows[i].UpdateBy;

                    //Define the FTP Variables
                    var Host = "10.1.24.2";
                    var Port = "31";
                    var User = "ediftp";
                    var Pswd = "IPgCmiAJYj6FcT01GKCH";

                    var filename = "Outconfirm_";
                    var fileextension = ".xml";

                    //Run the FTP Download and Delete function
                    downloadReportFiles(Host, Port, User, Pswd, filename, fileextension, Customer_ExternalID);
                }
            } catch (SQL_tryCatchError) {
                console.error(SQL_tryCatchError);
            }
        }
    });

    //disconnect from the SQL database
    con.end;
}

function Update_ProcessDocuments_Status_Processed(DocumentID, callback) {
    var SQL_Update_Statement = 'UPDATE `processdocuments` SET `Processed`="1" WHERE `ID` = "' + DocumentID + '"';

    //Connect to the SQL database
    con.connect;

    //Query the update statement
    con.query(SQL_Update_Statement, function (SQL_err, SQL_result) {
        if (SQL_err) {
            callback(false);                
        } else {
            callback(true);
        }
    });

    //Disconnect from the SQL database
    con.end;
}

function Update_ProcessDocuments_Status_Errored(DocumentID, callback) {
    var SQL_Update_Statement = 'UPDATE `processdocuments` SET `Errored`="1" WHERE `ID` = "' + DocumentID + '"';

    //Connect to the SQL database
    con.connect;

    //Query the update statement
    con.query(SQL_Insert_Statement, function (SQL_err, SQL_result) {
        if (SQL_err) {
            callback(false);                
        } else {
            callback(true);
        }
    });

    //Disconnect from the SQL database
    con.end;
}

async function downloadReportFiles(Local_FTP_Host, Local_FTP_Port, Local_FTP_User, Local_FTP_Pswrd, fileName, fileExtension, customer_nr) {
    const client = new ftp.Client();
    // client.ftp.verbose = true
    try {
        await client.access({
            'host': Local_FTP_Host,
            'port': Local_FTP_Port,
            'user': Local_FTP_User,
            'password': Local_FTP_Pswrd
        });

        var STR_fileName    = fileName.toString();
        var final_path      = "";

        if (STR_fileName.includes("INCONFIRM_")) {
            final_path = "/general/inconfirm";
        } else {
            final_path = "/general/outconfirm";
        }

        await client.cd(final_path);
        var JSONObject_ClientResults = await client.list();
        for (var e = 0; e < JSONObject_ClientResults.length; e++) {
            var ClientResults_Row = JSONObject_ClientResults[e];

            var ClientResults_name          = ClientResults_Row.name;
            var ClientResults_type          = ClientResults_Row.type;
            var ClientResults_size          = ClientResults_Row.size;
            var ClientResults_rawModifiedAt = ClientResults_Row.rawModifiedAt;
            var ClientResults_modifiedAt    = ClientResults_Row.modifiedAt;
            var ClientResults_permissions   = ClientResults_Row.permissions;
            var ClientResults_hardLinkCount = ClientResults_Row.hardLinkCount;
            var ClientResults_link          = ClientResults_Row.link;
            var ClientResults_group         = ClientResults_Row.group;
            var ClientResults_user          = ClientResults_Row.user;
            var ClientResults_uniqueID      = ClientResults_Row.uniqueID;

            var STR_ClientResults_name = ClientResults_name.toString();

            console.log("STR_ClientResults_name: " + STR_ClientResults_name);

                // await client.downloadToDir('./tmp/', final_path);

                // fs.readdirSync("./tmp/").forEach(file => {
                //     //Print file name
                //     console.log("file: " + file);
                
                //     /*
                //     Run this to print the file contents
                //     console.log(readFileSync(".levels/" + file, {encoding: "utf8"}))
                //     */
                // })

                // fs.readdir('/tmp/', function (err, files) {
                //     if (err) {
                //         console.error("Could not list the directory.", err);
                //         process.exit(1);
                //     }
                  
                //     files.forEach(function (file, index) {
                        
                //     });
                //   });


                // var data_raw        = fs.readFileSync('/tmp/' + ClientResults_name);
                // var STR_data_raw    = data_raw.toString();

                // var SQL_Insert_Statement = 'INSERT INTO `Softpak_ChangeManager`.`processdocuments`(`DocumentName`, `FileExtension`, `Processed`, `Errored`, `ErroredAmount`, `DocumentCLOB`) VALUES (\'' + STR_ClientResults_name + '\', \'.xml\', 0,0,0,\'' + STR_data_raw + '\')';

                // //Connect to the MySQL Database
                // con.connect;

                // //Insert the Data
                // con.query(SQL_Insert_Statement, function (SQL_err, SQL_result) {
                //     if (SQL_err) {
                //         console.error("f SaveFile - SQL_err: " + SQL_err);            
                //     } else {
                //         console.log("f SaveFile : 1 record inserted, ID: " + SQL_result.insertId);
                //     }
                // });

                // //Disconnect from the MySQL Database
                // con.end;
        }
    }
    catch(err) {
        console.error(err)
    }
    client.close();

    // 
}

function SaveFile (fromEndpoint, fromEndpointFileExtension, APIKey, bodyResponse, requestResponse) {
    //Generate a timestamp for the file
    var DateObject_Current_date = new Date();
    var Current_Year    = DateObject_Current_date.getFullYear;
    var Current_Month   = DateObject_Current_date.getMonth + 1;
    var Current_Date    = DateObject_Current_date.getDate;
    var Current_Hours   = DateObject_Current_date.getHours;
    var Current_Minutes = DateObject_Current_date.getMinutes;
    var Current_Seconds = DateObject_Current_date.getSeconds;
    var TimeStamp = Current_Date + Current_Month + Current_Year + Current_Hours + Current_Minutes + Current_Seconds;

    //Check from which endpoint the request came from and assign the document a headname
    var DocumentType = null;

    switch (fromEndpoint) {
        case "INBOUND-ANNOUNCE":
            DocumentType = 'Inannounce';
            break;
        case "INBOUND-CREATE":
            DocumentType = 'Increate';
            break;
        case "OUTBOUND-CREATE":
            DocumentType = 'Outcreate';
            break;
        case "PRODUCTLIST":
            DocumentType = 'Productlist';
            break;
        default:
            DocumentType = 'NO_VALID_DOCUMENT_TYPE';
            break;
    }

    //Check if the DocumentType is valid, if not send a error to the API Requester
    if (DocumentType != 'NO_VALID_DOCUMENT_TYPE') {
        RetrievExternalCustomerID(APIKey, function(RECI_result) {
            if (RECI_result != 'NO_EXTERNAL_ID_FOUND') {
                //Prepare the document information
                var Document_Name               = DocumentType + '_' + APIKey + '_' + TimeStamp + '.' + fromEndpointFileExtension;
                var Document_FileExtension      = fromEndpointFileExtension;
                var Document_ExternalCustomerID = RECI_result;
                var Document_UsedAPIKey         = APIKey;
                var Document_Processed          = 0;
                var Document_Errored            = 0;
                var Document_ErroredAmount      = 0;
                var Document_Clob               = bodyResponse;
            } else {
                requestResponse.send();
            }

            //Make the insert statement
            var SQL_Insert_Statement = 'INSERT INTO Softpak_ChangeManager.processdocuments (`DocumentName`, `FileExtension`, `SentInAPIKey`, `Processed`, `Errored`, `ErroredAmount`, `DocumentCLOB`, `ExternalCustomerID`) VALUES (\'' + Document_Name + '\',\'' + Document_FileExtension + '\',\'' + Document_UsedAPIKey + '\',\'' + Document_Processed + '\',\'' + Document_Errored + '\',\'' + Document_ErroredAmount + '\',\'' + Document_Clob + '\',\'' + Document_ExternalCustomerID + '\')';

            //Connect to the database
            con.connect;

            //Execute the insert statement
            con.query(SQL_Insert_Statement, function (SQL_err, SQL_result) {
                if (SQL_err) {
                    console.error("f SaveFile - SQL_err: " + SQL_err);
                    if (fromEndpointFileExtension == 'xml') {
                        requestResponse.send('<?xml version="1.0" encoding="UTF-8" ?><ApiResponse><Status>500</Status><StatusMessage>INTERNAL ERROR, There was a error while trying to save your file. a e-mail has been send to our support technicall support staff. please try again later</StatusMessage></ApiResponse>');
                    } else {
                        requestResponse.send('{"ApiResponse":[{"Status":"500", "StatusMessage":"INTERNAL ERROR, There was a error while trying to save your file. a e-mail has been send to our support technicall support staff. please try again later"}]}');
                    }                
                } else {
                    console.log("f SaveFile : 1 record inserted, ID: " + SQL_result.insertId);

                    if (fromEndpointFileExtension == 'xml') {
                        requestResponse.send('<?xml version="1.0" encoding="UTF-8" ?><ApiResponse><Status>200</Status><StatusMessage>Document saved</StatusMessage></ApiResponse>');
                    } else {
                        requestResponse.send('{"ApiResponse":[{"Status":"200", "StatusMessage":"Document saved"}]}');
                    }
                }
            });

            //Disconect from the database
            con.end;
        });        
    } else {
        if (fromEndpointFileExtension == 'xml') {
            requestResponse.send('<?xml version="1.0" encoding="UTF-8" ?><ApiResponse><Status>400</Status><StatusMessage>Document was send from a invalid endpoint. Please send the document to the endpoint it was ment for.</StatusMessage></ApiResponse>');
        } else {
            requestResponse.send('{"ApiResponse":[{"Status":"400", "StatusMessage":"Document was send from a invalid endpoint. Please send the document to the endpoint it was ment for."}]}');
        }
    }
}

async function APIKeyCheck (APIKey, callback) {
    //Prepare the SQL Select statement
    var SQL_Select_Statement = 'SELECT * FROM Softpak_ChangeManager.apiusers WHERE APIKey = "' + APIKey + '" AND ActiveAPIKey = "' + 1 + '"';

    //Connect to the SQL Database
    con.connect;

    //Query the SQL select statement
    con.query(SQL_Select_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
            var return_code = "999";
            callback(return_code);
        } else {
            try {
                //Retriev the ID from the database
                var SQL_S1_ID = SQL_S1_rows[0].ID;

                //If the ID is not null then send back a succescode, else send back a errorcode
                if (SQL_S1_ID != null) {
                    return_code = "1";
                    console.log("Kom ik hier? 605");
                    callback(return_code);
                } else {
                    return_code = "0";
                    console.log("Kom ik hier? 609");
                    callback(return_code);
                }
            } catch (TryCatchError) {
                console.error("f APIKeyCheck - TryCatchError: " + TryCatchError);
                return_code = "999";
                console.log("Kom ik hier? 615");
                callback(return_code);
            }
        }
    });

    //End the connection to the database
    con.end;
}

function RetrievExternalCustomerID (APIKey, callback) {
    //Connect to the MySQL database
    con.connect;

    //Create the needed SQL query
    let APIUSERS_SELECT_SQL_STATEMENT = 'SELECT * FROM `Softpak_ChangeManager`.`apiusers` WHERE `APIKey` = "' + APIKey + '"';

    //Query the SQL Select statement
    con.query(APIUSERS_SELECT_SQL_STATEMENT, function (APIUSERS_SQL_err, APIUSERS_SQL_rows, APIUSERS_SQL_fields) {
        //Check if there are any error messages
        if (APIUSERS_SQL_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f RetrievExternalCustomerID - SQL Error: " + APIUSERS_SQL_err);
            callback("NO_EXTERNAL_ID_FOUND");
        } else {
            let APIUSERS_ID             = APIUSERS_SQL_rows[0].ID;
            let APIUSERS_CUSTOMERID     = APIUSERS_SQL_rows[0].CustomerID;
            let APIUSERS_APIKEY         = APIUSERS_SQL_rows[0].APIKey;
            let APIUSERS_ActiveAPIKey   = APIUSERS_SQL_rows[0].ActiveAPIKey;
            let APIUSERS_CreateDateTime = APIUSERS_SQL_rows[0].CreateDateTime;
            let APIUSERS_UpdateDateTime = APIUSERS_SQL_rows[0].UpdateDateTime;
            let APIUSERS_CREATEUSER     = APIUSERS_SQL_rows[0].CreateUser;
            let APIUSERS_UPDATEUSER     = APIUSERS_SQL_rows[0].UpdateUser;

            //Create the needed SQL query
            let CUSTOMER_SELECT_SQL_STATEMENT = 'SELECT * FROM `Softpak_ChangeManager`.`customer` WHERE `ID` = "' + APIUSERS_CUSTOMERID + '"';

            con.query(CUSTOMER_SELECT_SQL_STATEMENT, function (CUSTOMER_SQL_err, CUSTOMER_SQL_rows, CUSTOMER_SQL_fields) {
                //Check if there are any error messages
                if (CUSTOMER_SQL_err) {
                    //If an error occurs, Log the error and send a error code back
                    console.error("f RetrievExternalCustomerID - SQL Error: " + CUSTOMER_SQL_err);
                    callback("NO_EXTERNAL_ID_FOUND");
                } else {
                    let CUSTOMER_ID                         = CUSTOMER_SQL_rows[0].ID;
                    let CUSTOMER_ExternalID                 = CUSTOMER_SQL_rows[0].ExternalID;
                    let CUSTOMER_CustomerShortName          = CUSTOMER_SQL_rows[0].CustomerShortName;
                    let CUSTOMER_CustomerFullName           = CUSTOMER_SQL_rows[0].CustomerFullName;
                    let CUSTOMER_Street                     = CUSTOMER_SQL_rows[0].Street;
                    let CUSTOMER_HouseNumber                = CUSTOMER_SQL_rows[0].HouseNumber;
                    let CUSTOMER_Postalcode                 = CUSTOMER_SQL_rows[0].Postalcode;
                    let CUSTOMER_City                       = CUSTOMER_SQL_rows[0].City;
                    let CUSTOMER_ResponseMessageLan         = CUSTOMER_SQL_rows[0].ResponseMessageLan;
                    let CUSTOMER_ResponseMessageLoc         = CUSTOMER_SQL_rows[0].ResponseMessageLoc;
                    let CUSTOMER_ResponseMessageLocOutbound = CUSTOMER_SQL_rows[0].ResponseMessageLocOutbound;
                    let CUSTOMER_ResponseUser               = CUSTOMER_SQL_rows[0].ResponseUser;
                    let CUSTOMER_ResponseKey                = CUSTOMER_SQL_rows[0].ResponseKey;
                    let CUSTOMER_CreateDateTime             = CUSTOMER_SQL_rows[0].CreateDateTime;
                    let CUSTOMER_UpdateDateTime             = CUSTOMER_SQL_rows[0].UpdateDateTime;
                    let CUSTOMER_CreateBy                   = CUSTOMER_SQL_rows[0].CreateBy;
                    let CUSTOMER_UpdateBy                   = CUSTOMER_SQL_rows[0].UpdateBy;

                    callback(CUSTOMER_ExternalID);
                }
            });
        }
    });

    //Disscount from the MySQL database
    con.end;
}

function IsJSONstringCheck (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        // console.log(e);
        return false;
    }

    return true;
}

async function APICustomerData (APIKey, callback) {
    var SQL_Select_S1_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`apiusers` WHERE APIKey = "' + APIKey + '" AND ActiveAPIKey = "' + 1 + '"';
    console.log("TEMP SQL_Select_S1_Statement : " + SQL_Select_S1_Statement);

    //Connect to the SQL Database
    con.connect;

    //Query the SQL select statement
    con.query(SQL_Select_S1_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f APIKeyCheck - SQL S1 Error: " + SQL_S1_err);
            var return_code = '{"error_code":"500", "error_message":"Their was an error while retrieving data from the customer database"}';
            callback(return_code);
        } else {

            var apiusers_ID             = SQL_S1_rows[0].ID;
            var apiusers_CustomerID     = SQL_S1_rows[0].CustomerID;
            var apiusers_APIKey         = SQL_S1_rows[0].APIKey;
            var apiusers_ActiveAPIKey   = SQL_S1_rows[0].ActiveAPIKey;
            var apiusers_CreateDateTime = SQL_S1_rows[0].CreateDateTime;
            var apiusers_UpdateDateTime = SQL_S1_rows[0].UpdateDateTime;
            var apiusers_CreateUser     = SQL_S1_rows[0].CreateUser;
            var apiusers_UpdateUser     = SQL_S1_rows[0].UpdateUser;

            console.log("apiusers_customerid : " + apiusers_CustomerID);

            try {
                var SQL_Select_S2_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`customer` WHERE `ID` = "' + apiusers_CustomerID + '"';

                con.query(SQL_Select_S2_Statement, function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
                    if (SQL_S2_err) {
                        console.error();
                        var return_code = '{"error_code":"500", "error_message":"Their was an error while retrieving data from the customer database"}';
                        callback(return_code);
                    } else {
                        var customer_ID                 = SQL_S2_rows[0].ID;
                        var customer_ExternalID         = SQL_S2_rows[0].ExternalID;
                        var customer_CustomerShortName  = SQL_S2_rows[0].CustomerShortName;
                        var customer_CustomerFullName   = SQL_S2_rows[0].CustomerFullName;
                        var customer_Street             = SQL_S2_rows[0].Street;
                        var customer_HouseNumber        = SQL_S2_rows[0].HouseNumber;
                        var customer_Postalcode         = SQL_S2_rows[0].Postalcode;
                        var customer_City               = SQL_S2_rows[0].City;
                        var customer_ResponseMessageLan = SQL_S2_rows[0].ResponseMessageLan;
                        var customer_ResponseMessageLoc = SQL_S2_rows[0].ResponseMessageLoc;
                        var customer_CreateDateTime     = SQL_S2_rows[0].CreateDateTime;
                        var customer_UpdateDateTime     = SQL_S2_rows[0].UpdateDateTime;
                        var customer_CreateBy           = SQL_S2_rows[0].CreateBy;
                        var customer_UpdateBy           = SQL_S2_rows[0].UpdateBy;

                        var CustomerData = '{"error_code":"200","ID": "' + customer_ID + '","ExternalID": "' + customer_ExternalID + '","CustomerShortName": "' + customer_CustomerShortName + '","CustomerFullName": "' + customer_CustomerFullName + '","Street": "' + customer_Street + '","HouseNumber": "' + customer_HouseNumber + '","Postalcode": "' + customer_Postalcode + '","City": "' + customer_City + '","ResponseMessageLan": "' + customer_ResponseMessageLan + '","ResponseMessageLoc": "' + customer_ResponseMessageLoc + '","CreateDateTime": "' + customer_CreateDateTime + '","UpdateDateTime": "' + customer_UpdateDateTime + '","CreateBy": "' + customer_CreateBy + '","UpdateBy": "' + customer_UpdateBy + '"}';
                        callback(CustomerData);
                    }
                });
            } catch (S1_error) {
                console.error("f APIKeyCheck - S1 Error: " + S1_error);
                var return_value = '{"error_code":"500", "error_message":"Their was an error while retrieving data from the customer database"}';
                callback(return_value);
            }
        }
    });

    //End the connection to the database
    con.end;
}

function Translate_SoftPak_Inbound () {
    var SQL_Select_Statement = 'SELECT * FROM Softpak_ChangeManager.processdocuments';

    //Connect to the SQL Database
    con.connect;

    con.query(SQL_Select_Statement, function (SQL_S1_err, SQL_S1_rows, SQL_S1_fields) {
        //Prepare the Order, Orderline and Palletline
        var Order       = '';
        var Orderline   = '';
        var Palletline  = '';

        //Check if there are any error messages
        if (SQL_S1_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f Translate_SoftPak_Inbound - SQL S1 Error: " + SQL_S1_err);
        } else {
            try {
                for (var i = 0; i < SQL_S1_rows.length; i++) {
                    var Inbound_ID                      = SQL_S1_rows[i].ID;
                    var Inbound_OrderNR                 = SQL_S1_rows[i].OrderNR;
                    var Inbound_CompanyCode             = SQL_S1_rows[i].CompanyCode;
                    var Inbound_ContainerTypeCode       = SQL_S1_rows[i].ContainerTypeCode;
                    var Inbound_ContainerNr             = SQL_S1_rows[i].ContainerNR;
                    var Inbound_CustAddressNr           = SQL_S1_rows[i].CustAddressNR;
                    var Inbound_CustRef1                = SQL_S1_rows[i].CustRef1;
                    var Inbound_CustRef2                = SQL_S1_rows[i].CustRef2;
                    var Inbound_CustRef3                = SQL_S1_rows[i].CustRef3;
                    var Inbound_CustRef4                = SQL_S1_rows[i].CustRef4;
                    var Inbound_CustRef5                = SQL_S1_rows[i].CustRef5;
                    var Inbound_CustRef6                = SQL_S1_rows[i].CustRef6;
                    var Inbound_CustRef7                = SQL_S1_rows[i].CustRef7;
                    var Inbound_CustRef8                = SQL_S1_rows[i].CustRef8;
                    var Inbound_DTCreate                = SQL_S1_rows[i].DTCreate;
                    var Inbound_DTDischarge             = SQL_S1_rows[i].DTDischarge;
                    var Inbound_DTUpdate                = SQL_S1_rows[i].DTUpdate;
                    var Inbound_EDIOrd1                 = SQL_S1_rows[i].EDIOrd1;
                    var Inbound_EDIOrd2                 = SQL_S1_rows[i].EDIOrd2;
                    var Inbound_EDIOrd3                 = SQL_S1_rows[i].EDIOrd3;
                    var Inbound_EDIOrd4                 = SQL_S1_rows[i].EDIOrd4;
                    var Inbound_EDIOrd5                 = SQL_S1_rows[i].EDIOrd5;
                    var Inbound_ExtEDIOrderText         = SQL_S1_rows[i].ExtEDIOrderText;
                    var Inbound_LineCode                = SQL_S1_rows[i].LineCode;
                    var Inbound_LocTerminal             = SQL_S1_rows[i].LocTerminal;
                    var Inbound_ProjectNR               = SQL_S1_rows[i].ProjectNR;
                    var Inbound_RecAddressNR            = SQL_S1_rows[i].RecAddressNR;
                    var Inbound_SealNO                  = SQL_S1_rows[i].SealNO;
                    var Inbound_StatusCode              = SQL_S1_rows[i].StatusCode;
                    var Inbound_SupplierAddressNR       = SQL_S1_rows[i].SupplierAddressNR;
                    var Inbound_TimCreate               = SQL_S1_rows[i].TimCreate;
                    var Inbound_TimDischarge            = SQL_S1_rows[i].TimDischarge;
                    var Inbound_TimUpdated              = SQL_S1_rows[i].TimUpdated;
                    var Inbound_TransPorterAddressNR    = SQL_S1_rows[i].TransPorterAddressNR;
                    var Inbound_TransPorterNR           = SQL_S1_rows[i].TransPorterNR;
                    var Inbound_ConfirmationSend        = SQL_S1_rows[i].ConfirmationSend;
                    var Inbound_CreateDateTime          = SQL_S1_rows[i].CreateDateTime;
                    var Inbound_UpdateDateTime          = SQL_S1_rows[i].UpdateDateTime;
                    var Inbound_CreateBy                = SQL_S1_rows[i].CreateBy;
                    var Inbound_UpdateBy                = SQL_S1_rows[i].UpdateBy;

                    var Order = '<?xml version="1.0"?><INTAKE_ORDER xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><ORDER>';

                    Order += XML_FieldTranslator("ord_in_ordnr", Inbound_OrderNR);
                    Order += XML_FieldTranslator("ord_companycode", Inbound_CompanyCode);
                    Order += XML_FieldTranslator("ord_container_typecode", Inbound_ContainerTypeCode);
                    Order += XML_FieldTranslator("ord_containernr", Inbound_ContainerNr);
                    Order += XML_FieldTranslator("ord_cust_addressnr", Inbound_CustAddressNr);
                    Order += XML_FieldTranslator("ord_custref_in1", Inbound_CustRef1);
                    Order += XML_FieldTranslator("ord_custref_in2", Inbound_CustRef2);
                    Order += XML_FieldTranslator("ord_custref_in3", Inbound_CustRef3);
                    Order += XML_FieldTranslator("ord_custref_in4", Inbound_CustRef4);
                    Order += XML_FieldTranslator("ord_custref_in5", Inbound_CustRef5);
                    Order += XML_FieldTranslator("ord_custref_in6", Inbound_CustRef6);
                    Order += XML_FieldTranslator("ord_custref_in7", Inbound_CustRef7);
                    Order += XML_FieldTranslator("ord_custref_in8", Inbound_CustRef8);
                    Order += XML_FieldTranslator("ord_dt_create", Inbound_DTCreate);
                    Order += XML_FieldTranslator("ord_dt_discharge", Inbound_DTDischarge);
                    Order += XML_FieldTranslator("ord_dt_update", Inbound_DTUpdate);
                    Order += XML_FieldTranslator("ord_edi_in_ord_1", Inbound_EDIOrd1);
                    Order += XML_FieldTranslator("ord_edi_in_ord_2", Inbound_EDIOrd2);
                    Order += XML_FieldTranslator("ord_edi_in_ord_3", Inbound_EDIOrd3);
                    Order += XML_FieldTranslator("ord_edi_in_ord_4", Inbound_EDIOrd4);
                    Order += XML_FieldTranslator("ord_edi_in_ord_5", Inbound_EDIOrd5);
                    Order += XML_FieldTranslator("ord_ext_edi_order_text", Inbound_ExtEDIOrderText);
                    Order += XML_FieldTranslator("ord_linecode", Inbound_LineCode);
                    Order += XML_FieldTranslator("ord_loc_terminalcode", Inbound_LocTerminal);
                    Order += XML_FieldTranslator("ord_projectnr", Inbound_ProjectNR);
                    Order += XML_FieldTranslator("ord_rec_addressnr", Inbound_RecAddressNR);
                    Order += XML_FieldTranslator("ord_sealno", Inbound_SealNO);
                    Order += XML_FieldTranslator("ord_statuscode", Inbound_StatusCode);
                    Order += XML_FieldTranslator("ord_supplier_addressnr", Inbound_SupplierAddressNR);
                    Order += XML_FieldTranslator("ord_tim_create", Inbound_TimCreate);
                    Order += XML_FieldTranslator("ord_tim_discharge", Inbound_TimDischarge);
                    Order += XML_FieldTranslator("ord_tim_updated", Inbound_TimUpdated);
                    Order += XML_FieldTranslator("ord_transporter_addressnr", Inbound_TransPorterAddressNR);
                    Order += XML_FieldTranslator("ord_transportnr", Inbound_TransPorterNR);
                    Order += "REPLACE_INTAKELINES";
                    Order += "</ORDER></INTAKE_ORDER>";

                    var SQL_Select2_Statement = '';

                    OrderLine = '';

                    con.query(SQL_Select2_Statement, function (SQL_S2_err, SQL_S2_rows, SQL_S2_fields) {
                        try {
                            for (var e = 0; e < SQL_S2_rows.length; e++) {
                                var InboundLines_ID                     = SQL_S2_rows[e].ID;
                                var InboundLines_OrderID                = SQL_S2_rows[e].OrderID;
                                var InboundLines_OrderNr                = SQL_S2_rows[e].OrderNR;
                                var InboundLines_LineNr                 = SQL_S2_rows[e].LineNR;
                                var InboundLines_Carrier                = SQL_S2_rows[e].Carrier;
                                var InboundLines_CarrierCode            = SQL_S2_rows[e].CarrierCode;
                                var InboundLines_CompanyCode            = SQL_S2_rows[e].CompanyCode;
                                var InboundLines_ContainerTypeCode      = SQL_S2_rows[e].ContainerTypeCode;
                                var InboundLines_ContainerNr            = SQL_S2_rows[e].ContainerNR;
                                var InboundLines_CustAddressNr          = SQL_S2_rows[e].CustAddressNR;
                                var InboundLines_CustProductCode        = SQL_S2_rows[e].CustProductCode;
                                var InboundLines_CustRef1               = SQL_S2_rows[e].CustRef1;
                                var InboundLines_CustRef2               = SQL_S2_rows[e].CustRef2;
                                var InboundLines_CustRef3               = SQL_S2_rows[e].CustRef3;
                                var InboundLines_DamageDes              = SQL_S2_rows[e].DamageDes;
                                var InboundLines_DamageCode             = SQL_S2_rows[e].DamageCode;
                                var InboundLines_EDILine1               = SQL_S2_rows[e].EDILine1;
                                var InboundLines_EDILine2               = SQL_S2_rows[e].EDILine2;
                                var InboundLines_EDILine3               = SQL_S2_rows[e].EDILine3;
                                var InboundLines_EDILine4               = SQL_S2_rows[e].EDILine4;
                                var InboundLines_EDILine5               = SQL_S2_rows[e].EDILine5;
                                var InboundLines_ExtEDILineText         = SQL_S2_rows[e].ExtEDILineText;
                                var InboundLines_GrossWeight            = SQL_S2_rows[e].GrossWeight;
                                var InboundLines_GrossWeightCode        = SQL_S2_rows[e].GrossWeightCode;
                                var InboundLines_NettWeight             = SQL_S2_rows[e].NettWeight;
                                var InboundLines_NettWeightCode         = SQL_S2_rows[e].NettWeightCode;
                                var InboundLines_OuterPCK               = SQL_S2_rows[e].OuterPCK;
                                var InboundLines_OuterPCKCode           = SQL_S2_rows[e].OuterPCKCode;
                                var InboundLines_PackTypeCode           = SQL_S2_rows[e].PackTypeCode;
                                var InboundLines_ProdRef1               = SQL_S2_rows[e].ProdRef1;
                                var InboundLines_ProdRef2               = SQL_S2_rows[e].ProdRef2;
                                var InboundLines_ProdRef3               = SQL_S2_rows[e].ProdRef3;
                                var InboundLines_ProdRef4               = SQL_S2_rows[e].ProdRef4;
                                var InboundLines_ProdRef5               = SQL_S2_rows[e].ProdRef5;
                                var InboundLines_ProductID              = SQL_S2_rows[e].ProductID;
                                var InboundLines_ProductGroupCode       = SQL_S2_rows[e].ProductGroupCode;
                                var InboundLines_QtyControlCode         = SQL_S2_rows[e].QtyControlCode;
                                var InboundLines_RecAddressNR           = SQL_S2_rows[e].RecAddressNR;
                                var InboundLines_Remarks                = SQL_S2_rows[e].Remarks;
                                var InboundLines_StockRefNR             = SQL_S2_rows[e].StockRefNR;
                                var InboundLines_SupplierAddressNR      = SQL_S2_rows[e].SupplierAddressNR;
                                var InboundLines_TermPlace              = SQL_S2_rows[e].TermPlace;
                                var InboundLines_TermCode               = SQL_S2_rows[e].TermCode;
                                var InboundLines_TransActionCustomerRef = SQL_S2_rows[e].TransActionCustomerRef;
                                var InboundLines_WareHouseRef           = SQL_S2_rows[e].WareHouseRef;
                                var InboundLines_CreateDateTime         = SQL_S2_rows[e].CreateDateTime;
                                var InboundLines_UpdateDateTime         = SQL_S2_rows[e].UpdateDateTime;
                                var InboundLines_CreateBy               = SQL_S2_rows[e].CreateBy;
                                var InboundLines_UpdateBy               = SQL_S2_rows[e].UpdateBy;

                                OrderLine += '<ORDER_LINE>';
                                OrderLine += XML_FieldTranslator("lin_in_ordnr", InboundLines_OrderNr);
                                OrderLine += XML_FieldTranslator("lin_in_linenr", InboundLines_LineNr);
                                OrderLine += XML_FieldTranslator("lin_carrier", InboundLines_Carrier);
                                OrderLine += XML_FieldTranslator("lin_carriercode", InboundLines_CarrierCode);
                                OrderLine += XML_FieldTranslator("lin_companycode", InboundLines_CompanyCode);
                                OrderLine += XML_FieldTranslator("lin_container_typecode", InboundLines_ContainerTypeCode);
                                OrderLine += XML_FieldTranslator("lin_containernr", InboundLines_ContainerNr);
                                OrderLine += XML_FieldTranslator("lin_cust_addressnr", InboundLines_CustAddressNr);
                                OrderLine += XML_FieldTranslator("lin_cust_productcode", InboundLines_CustProductCode);
                                OrderLine += XML_FieldTranslator("lin_custref_in1", InboundLines_CustRef1);
                                OrderLine += XML_FieldTranslator("lin_custref_in2", InboundLines_CustRef2);
                                OrderLine += XML_FieldTranslator("lin_custref_in3", InboundLines_CustRef3);
                                OrderLine += XML_FieldTranslator("lin_damage_des", InboundLines_DamageDes);
                                OrderLine += XML_FieldTranslator("lin_damagecode", InboundLines_DamageCode);
                                OrderLine += XML_FieldTranslator("lin_edi_in_line_1", InboundLines_EDILine1);
                                OrderLine += XML_FieldTranslator("lin_edi_in_line_2", InboundLines_EDILine2);
                                OrderLine += XML_FieldTranslator("lin_edi_in_line_3", InboundLines_EDILine3);
                                OrderLine += XML_FieldTranslator("lin_edi_in_line_4", InboundLines_EDILine4);
                                OrderLine += XML_FieldTranslator("lin_edi_in_line_5", InboundLines_EDILine5);
                                OrderLine += XML_FieldTranslator("lin_ext_edi_line_text", InboundLines_ExtEDILineText);
                                OrderLine += XML_FieldTranslator("lin_grossweight", InboundLines_GrossWeight);
                                OrderLine += XML_FieldTranslator("lin_grossweightcode", InboundLines_GrossWeightCode);
                                OrderLine += XML_FieldTranslator("lin_nettweight", InboundLines_NettWeight);
                                OrderLine += XML_FieldTranslator("lin_nettweightcode", InboundLines_NettWeightCode);
                                OrderLine += XML_FieldTranslator("lin_outer_pck", InboundLines_OuterPCK);
                                OrderLine += XML_FieldTranslator("lin_outer_pckcode", InboundLines_OuterPCKCode);
                                OrderLine += XML_FieldTranslator("lin_packtypecode", InboundLines_PackTypeCode);
                                OrderLine += XML_FieldTranslator("lin_prodref1", InboundLines_ProdRef1);
                                OrderLine += XML_FieldTranslator("lin_prodref2", InboundLines_ProdRef2);
                                OrderLine += XML_FieldTranslator("lin_prodref3", InboundLines_ProdRef3);
                                OrderLine += XML_FieldTranslator("lin_prodref4", InboundLines_ProdRef4);
                                OrderLine += XML_FieldTranslator("lin_prodref5", InboundLines_ProdRef5);
                                OrderLine += XML_FieldTranslator("lin_product_id", InboundLines_ProductID);
                                OrderLine += XML_FieldTranslator("lin_productgroupcode", InboundLines_ProductGroupCode);
                                OrderLine += XML_FieldTranslator("lin_qty_controlcode", InboundLines_QtyControlCode);
                                OrderLine += XML_FieldTranslator("lin_rec_addressnr", InboundLines_RecAddressNR);
                                OrderLine += XML_FieldTranslator("lin_remarks", InboundLines_Remarks);
                                OrderLine += XML_FieldTranslator("lin_stockrefnr", InboundLines_StockRefNR);
                                OrderLine += XML_FieldTranslator("lin_supplier_addressnr", InboundLines_SupplierAddressNR);
                                OrderLine += XML_FieldTranslator("lin_term_place", InboundLines_TermPlace);
                                OrderLine += XML_FieldTranslator("lin_termcode", InboundLines_TermCode);
                                OrderLine += XML_FieldTranslator("lin_transaction_customsrefnr", InboundLines_TransActionCustomerRef);
                                OrderLine += XML_FieldTranslator("lin_warehouseref", InboundLines_WareHouseRef);
                                OrderLine += 'REPLACE_PALLETLINE';
                                OrderLine += '</ORDER_LINE>';

                                var PalletLine = '';

                                var SQL_Select3_Statement = '';

                                con.query(SQL_Select3_Statement, function (SQL_S3_err, SQL_S3_rows, SQL_S3_fields) {
                                    try {
                                        for (var d = 0; d < SQL_S3_rows.length; d++) {
                                            var PalletLine_ID                   = SQL_S3_rows[d].ID;
                                            var PalletLine_OrderID              = SQL_S3_rows[d].OrderID;
                                            var PalletLine_OrderLineID          = SQL_S3_rows[d].OrderLineID;
                                            var PalletLine_InboundOrOutbound    = SQL_S3_rows[d].InboundOrOutbound;
                                            var PalletLine_StockNr              = SQL_S3_rows[d].StockNr;
                                            var PalletLine_BarcodeEXP           = SQL_S3_rows[d].BarcodeEXP;
                                            var PalletLine_BarcodeID            = SQL_S3_rows[d].BarcodeID;
                                            var PalletLine_BarcodeIDInternal    = SQL_S3_rows[d].BarcodeIDInternal;
                                            var PalletLine_CalcRef1             = SQL_S3_rows[d].CalcRef1;
                                            var PalletLine_CalcRef2             = SQL_S3_rows[d].CalcRef2;
                                            var PalletLine_CalcRef3             = SQL_S3_rows[d].CalcRef3;
                                            var PalletLine_Carrier              = SQL_S3_rows[d].Carrier;
                                            var PalletLine_CarrierCode          = SQL_S3_rows[d].CarrierCode;
                                            var PalletLine_CompanyCode          = SQL_S3_rows[d].CompanyCode;
                                            var PalletLine_DamageNR             = SQL_S3_rows[d].DamageNR;
                                            var PalletLine_DT_Create            = SQL_S3_rows[d].DT_Create;
                                            var PalletLine_DT_Mutation          = SQL_S3_rows[d].DT_Mutation;
                                            var PalletLine_EDIStock1            = SQL_S3_rows[d].EDIStock1;
                                            var PalletLine_EDIStock2            = SQL_S3_rows[d].EDIStock2;
                                            var PalletLine_EDIStock3            = SQL_S3_rows[d].EDIStock3;
                                            var PalletLine_EDIStock4            = SQL_S3_rows[d].EDIStock4;
                                            var PalletLine_EDIStock5            = SQL_S3_rows[d].EDIStock5;
                                            var PalletLine_GrossWeight          = SQL_S3_rows[d].GrossWeight;
                                            var PalletLine_GrossWeightCode      = SQL_S3_rows[d].GrossWeightCode;
                                            var PalletLine_InLineNR             = SQL_S3_rows[d].InLineNR;
                                            var PalletLine_InOrderNR            = SQL_S3_rows[d].InOrderNR;
                                            var PalletLine_IndActive            = SQL_S3_rows[d].IndActive;
                                            var PalletLine_IndBlocked           = SQL_S3_rows[d].IndBlocked;
                                            var PalletLine_NettWeight           = SQL_S3_rows[d].NettWeight;
                                            var PalletLine_NettWeightCode       = SQL_S3_rows[d].NettWeightCode;
                                            var PalletLine_OuterPCK             = SQL_S3_rows[d].OuterPCK;
                                            var PalletLine_OuterPCKCode         = SQL_S3_rows[d].OuterPCKCode;
                                            var PalletLine_PackTypeCode         = SQL_S3_rows[d].PackTypeCode;
                                            var PalletLine_ProdRef1             = SQL_S3_rows[d].ProdRef1;
                                            var PalletLine_ProdRef2             = SQL_S3_rows[d].ProdRef2;
                                            var PalletLine_ProdRef3             = SQL_S3_rows[d].ProdRef3;
                                            var PalletLine_ProdRef4             = SQL_S3_rows[d].ProdRef4;
                                            var PalletLine_ProdRef5             = SQL_S3_rows[d].ProdRef5;
                                            var PalletLine_ProductID            = SQL_S3_rows[d].ProductID;
                                            var PalletLine_ProductGroupCode     = SQL_S3_rows[d].ProductGroupCode;
                                            var PalletLine_StockRefNR           = SQL_S3_rows[d].StockRefNR;
                                            var PalletLine_SupplierAdressNR     = SQL_S3_rows[d].SupplierAdressNR;
                                            var PalletLine_TimCreate            = SQL_S3_rows[d].TimCreate;
                                            var PalletLine_WareHouseRef         = SQL_S3_rows[d].WareHouseRef;
                                            var PalletLine_CreateDateTime       = SQL_S3_rows[d].CreateDateTime;
                                            var PalletLine_UpdateDateTime       = SQL_S3_rows[d].UpdateDateTime;
                                            var PalletLine_CreateBy             = SQL_S3_rows[d].CreateBy;
                                            var PalletLine_UpdateBy             = SQL_S3_rows[d].UpdateBy;

                                            PalletLine += '<PALLET>';
                                            PalletLine += XML_FieldTranslator('plt_stocknr', PalletLine_StockNr);
                                            PalletLine += XML_FieldTranslator('plt_barcode_exp', PalletLine_BarcodeEXP);
                                            PalletLine += XML_FieldTranslator('plt_barcode_id', PalletLine_BarcodeID);
                                            PalletLine += XML_FieldTranslator('plt_barcode_id_internal', PalletLine_BarcodeIDInternal);
                                            PalletLine += XML_FieldTranslator('plt_calcref1', PalletLine_CalcRef1);
                                            PalletLine += XML_FieldTranslator('plt_calcref2', PalletLine_CalcRef2);
                                            PalletLine += XML_FieldTranslator('plt_calcref3', PalletLine_CalcRef3);
                                            PalletLine += XML_FieldTranslator('plt_carrier', PalletLine_Carrier);
                                            PalletLine += XML_FieldTranslator('plt_carriercode', PalletLine_CarrierCode);
                                            PalletLine += XML_FieldTranslator('plt_companycode', PalletLine_CompanyCode);
                                            PalletLine += XML_FieldTranslator('plt_damagenr', PalletLine_DamageNR);
                                            PalletLine += XML_FieldTranslator('plt_dt_create', PalletLine_DT_Create);
                                            PalletLine += XML_FieldTranslator('plt_dt_mutation', PalletLine_DT_Mutation);
                                            PalletLine += XML_FieldTranslator('plt_edi_stock_1', PalletLine_EDIStock1);
                                            PalletLine += XML_FieldTranslator('plt_edi_stock_2', PalletLine_EDIStock2);
                                            PalletLine += XML_FieldTranslator('plt_edi_stock_3', PalletLine_EDIStock3);
                                            PalletLine += XML_FieldTranslator('plt_edi_stock_4', PalletLine_EDIStock4);
                                            PalletLine += XML_FieldTranslator('plt_edi_stock_5', PalletLine_EDIStock5);
                                            PalletLine += XML_FieldTranslator('plt_grossweight', PalletLine_GrossWeight);
                                            PalletLine += XML_FieldTranslator('plt_grossweightcode', PalletLine_GrossWeightCode);
                                            PalletLine += XML_FieldTranslator('plt_in_linenr', PalletLine_InLineNR);
                                            PalletLine += XML_FieldTranslator('plt_in_ordnr', PalletLine_InOrderNR);
                                            PalletLine += XML_FieldTranslator('plt_ind_active', PalletLine_IndActive);
                                            PalletLine += XML_FieldTranslator('plt_ind_blocked', PalletLine_IndBlocked);
                                            PalletLine += XML_FieldTranslator('plt_nettweight', PalletLine_NettWeight);
                                            PalletLine += XML_FieldTranslator('plt_nettweightcode', PalletLine_NettWeightCode);
                                            PalletLine += XML_FieldTranslator('plt_outer_pck', PalletLine_OuterPCK);
                                            PalletLine += XML_FieldTranslator('plt_outer_pckcode', PalletLine_OuterPCKCode);
                                            PalletLine += XML_FieldTranslator('plt_packtypecode', PalletLine_PackTypeCode);
                                            PalletLine += XML_FieldTranslator('plt_prodref1', PalletLine_ProdRef1);
                                            PalletLine += XML_FieldTranslator('plt_prodref2', PalletLine_ProdRef2);
                                            PalletLine += XML_FieldTranslator('plt_prodref3', PalletLine_ProdRef3);
                                            PalletLine += XML_FieldTranslator('plt_prodref4', PalletLine_ProdRef4);
                                            PalletLine += XML_FieldTranslator('plt_prodref5', PalletLine_ProdRef5);
                                            PalletLine += XML_FieldTranslator('plt_product_id', PalletLine_ProductID);
                                            PalletLine += XML_FieldTranslator('plt_productgroupcode', PalletLine_ProductGroupCode);
                                            PalletLine += XML_FieldTranslator('plt_stockrefnr', StockRefNR);
                                            PalletLine += XML_FieldTranslator('plt_supplier_addressnr', SupplierAdressNR);
                                            PalletLine += XML_FieldTranslator('plt_tim_create', TimCreate);
                                            PalletLine += '</PALLET>';
                                        }
                                    } catch (palletline_error) {
                                        console.log('Palletline error: ' + palletline_error);
                                    }
                                });

                                OrderLine = OrderLine.replace();
                            }
                        } catch (SQL_S2_Error) {
                            console.error("f Translate_SoftPak_Inbound - SQL_S2_Error : " + SQL_S2_Error)
                        }
                    });

                    Order = Order.replace("REPLACE_INTAKELINES", OrderLine);
                }

                console.log(Order);
            } catch (TryCatchError) {
                console.error("f Translate_SoftPak_Inbound - TryCatchError: " + TryCatchError);
            }
        }
    });

    //end the database connection
    con.end;
}

function XML_FieldTranslator (FieldName, FieldValue) {
    var returnValue;
    if (FieldValue != null) {
        returnValue = '<' + FieldName + '>' + FieldValue + '</' + FieldName + '>';
    } else {
        returnValue = '<' + FieldName + '/>';
    }
    return returnValue;
}

//InOrOut - can hold multiple values: 0 - Outbound, 1 - Inbound
function RetrievTemplate (CustomerNR, InOrOut, TemplateType, callback) {
    //Make the Select statement
    var SQL_Select_Statement = 'SELECT * FROM `Softpak_ChangeManager`.`translationdocuments` WHERE `CustomerID` = "' + CustomerNR + '" AND `InOrOut` = "' + InOrOut + '" AND `LineType` = "' + TemplateType + '"';

    // console.log("SQL_Select_Statement: " + SQL_Select_Statement);

    //Connect to the MySQL database
    con.connect;
    
    //Query the SQL statement
    con.query(SQL_Select_Statement, function (SQL_Select_err, SQL_Select_rows, SQL_Select_fields) {
        if (SQL_Select_err) {
            //If an error occurs, Log the error and send a error code back
            console.error("f RetrievTemplate - SQL Select Error: " + SQL_Select_err);
        } else {
            try {
                var TranslationDocument_ID              = SQL_Select_rows[0].ID;
                var TranslationDocument_CustomerID      = SQL_Select_rows[0].CustomerID;
                var TranslationDocument_InOrOut         = SQL_Select_rows[0].InOrOut;
                var TranslationDocument_LineType        = SQL_Select_rows[0].LineType;
                var TranslationDocument_Text            = SQL_Select_rows[0].Text;
                var TranslationDocument_CreateDateTime  = SQL_Select_rows[0].CreateDateTime;
                var TranslationDocument_UpdateDateTime  = SQL_Select_rows[0].UpdateDateTime;
                var TranslationDocument_CreateBy        = SQL_Select_rows[0].CreateBy;
                var TranslationDocument_UpdateBy        = SQL_Select_rows[0].UpdateBy;
                
                callback(TranslationDocument_Text);
            } catch (SQL_Select_TryCatchError) {
                console.error(SQL_Select_TryCatchError);
                callback("SQLError_NoDataFound");
            }
        }
    });

    //Disconnect from the MySQL database
    con.end;
}

//Applicaion Functions - Customer specifc
//-----------------------------------------------------------------------

//Specific Customer
    //Inbound - Announce
function Translate_Inbound_Announce (ID, CustomerData_RecAddressNR, DocumentCLOB) {
    let Document_ID             = ID;
    let Document_RecAddressNR   = CustomerData_RecAddressNR;
    let Document_DocumentClob   = DocumentCLOB;

    let JSONObject_DocumentClob = JSON.parse(Document_DocumentClob);

    console.log(JSONObject_DocumentClob);

    let JSONObject_IDOC     = JSONObject_DocumentClob.delvry03.idoc[0];
    let JSONObject_e1edl20 = JSONObject_IDOC.e1edl20[0];
    let JSONObject_e1edl37 = JSONObject_e1edl20.e1edl37[0];
    let JSONObject_e1edl44 = JSONObject_e1edl37.e1edl44;

    for (var i = 0; i < JSONObject_e1edl44.length; i++) {
        var e1edl44_row = JSONObject_e1edl44[i];

        let Ordernumber = e1edl44_row.vbeln[0]._;
        console.log("Ordernumber : " + Ordernumber);
        
        let JSONObject_e1edl46 = e1edl44_row.e1edl46;
        for (var i = 0; i < JSONObject_e1edl46.length; i++) {
            var e1edl46_row = JSONObject_e1edl46[i];
            let PalletNr = e1edl46_row.sernr[0]._;

            console.log("PalletNr : " + PalletNr);

            let Palletline_SQL_INSERT_STATEMENT = 'INSERT INTO `Softpak_ChangeManager`.`palletline` (`Ordernumber`, `OrderType`, `InboundOrOutbound`, `BarcodeID`, `Carrier`, `CarrierCode`, `CompanyCode`, `GrossWeightCode`, `InLineNR`, `InOrderNR`, `SupplierAdressNR`) VALUES ("' + Ordernumber + '", "INANNOUNCE", 0, "' + PalletNr + '", 1, "PLT", "OW2", "KGS", 1, "' + Ordernumber + '", "1953")';
        
            SQL_Insert(Palletline_SQL_INSERT_STATEMENT, function (PalletLineInsert_Result) {
            if (PalletLineInsert_Result != "INSERT_ERROR") {
                    console.log("f Translate_Inbound_Announce : Insert succesfull, ID: " + PalletLineInsert_Result);
                } else {
                    console.error("f Translate_Inbound_Announce : There was an error while trying to insert the order, please try again later");
                }
            });
        }
    }
}
    //Inbound - Create
function Translate_Inbound_Create (ID, CustomerData_RecAddressNR, DocumentCLOB) {

    var Document_ID             = ID;
    var Document_RecAddressNR   = CustomerData_RecAddressNR;
    var Document_DocumentClob   = DocumentCLOB;

    console.log(Document_DocumentClob);

    var JSONObject_DocumentClob = JSON.parse(Document_DocumentClob);

    console.log(JSONObject_DocumentClob);

    var JSONObject_IDOC     = JSONObject_DocumentClob.delvry03.idoc[0];
    var JSONObject_EDIDC40  = JSONObject_IDOC.edi_dc40[0];
    var JSONObject_E1EDL20  = JSONObject_IDOC.e1edl20[0];

    var EDIDC40_TABNAM  = JSONObject_EDIDC40.tabnam[0]._;
    var EDIDC40_MANDT   = JSONObject_EDIDC40.mandt[0]._;
    var EDIDC40_DOCNUM  = JSONObject_EDIDC40.docnum[0]._;
    var EDIDC40_DOCREL  = JSONObject_EDIDC40.docrel[0]._;
    var EDIDC40_STATUS  = JSONObject_EDIDC40.status[0]._;
    var EDIDC40_DIRECT  = JSONObject_EDIDC40.direct[0]._;
    var EDIDC40_OUTMOD  = JSONObject_EDIDC40.outmod[0]._;
    var EDIDC40_IDOCTYP = JSONObject_EDIDC40.idoctyp[0]._;
    var EDIDC40_MESTYP  = JSONObject_EDIDC40.mestyp[0]._;
    var EDIDC40_SNDPOR  = JSONObject_EDIDC40.sndpor[0]._;
    var EDIDC40_SNDPRT  = JSONObject_EDIDC40.sndprt[0]._;
    var EDIDC40_SNDPRN  = JSONObject_EDIDC40.sndprn[0]._;
    var EDIDC40_RCVPOR  = JSONObject_EDIDC40.rcvpor[0]._;
    var EDIDC40_RCVPRT  = JSONObject_EDIDC40.rcvprt[0]._;
    var EDIDC40_RCVPFC  = JSONObject_EDIDC40.rcvpfc[0]._;
    var EDIDC40_RCVPRN  = JSONObject_EDIDC40.rcvprn[0]._;
    var EDIDC40_CREDAT  = JSONObject_EDIDC40.credat[0]._;
    var EDIDC40_CRETIM  = JSONObject_EDIDC40.cretim[0]._;
    var EDIDC40_SERIAL  = JSONObject_EDIDC40.serial[0]._;

    var E1EDL20_VBELN                       = JSONObject_E1EDL20.vbeln[0]._;
    var E1EDL20_VSTEL                       = JSONObject_E1EDL20.vstel[0]._;
    var E1EDL20_BTGEW                       = JSONObject_E1EDL20.btgew[0]._;
    var E1EDL20_NTGEW                       = JSONObject_E1EDL20.ntgew[0]._;
    var E1EDL20_VOLUM                       = JSONObject_E1EDL20.volum[0]._;
    var E1EDL20_ANZPK                       = JSONObject_E1EDL20.anzpk[0]._;
    var E1EDL20_BOLNR                       = JSONObject_E1EDL20.bolnr[0]._;
    var E1EDL20_LIFEX                       = JSONObject_E1EDL20.lifex[0]._;
    var E1EDL20_PODAT                       = JSONObject_E1EDL20.podat[0]._;
    var E1EDL20_POTIM                       = JSONObject_E1EDL20.potim[0]._;
    var E1EDL20_E1EDL22_VSTEL_BEZ           = JSONObject_E1EDL20.e1edl22[0].vstel_bez[0]._;
    var E1EDL20_E1EDL21_LFART               = JSONObject_E1EDL20.e1edl21[0].lfart[0]._;
    var E1EDL20_E1EDL21_LPRIO               = JSONObject_E1EDL20.e1edl21[0].lprio[0]._;
    var E1EDL20_E1EDL21_E1EDL23_LFART_BEZ   = JSONObject_E1EDL20.e1edl21[0].e1edl23[0].lfart_bez[0]._;
    var E1EDL20_E1EDL18                     = JSONObject_E1EDL20.e1edl18[0].qualf[0]._;

    // var JSONObject_E1ADRM1 = JSONObject_E1EDL20.e1adrm1;
    // for (var i = 0; i < JSONObject_E1ADRM1.length; i++) {
    //     var E1ADRM1_row = JSONObject_E1ADRM1[i];

    //     var E1ADRM1_PARTNER_Q   = E1ADRM1_row.partner_q._;
    //     var E1ADRM1_PARTNER_ID  = E1ADRM1_row.partner_id._;
    //     var E1ADRM1_LANGUAGE    = E1ADRM1_row.language._;
    //     var E1ADRM1_FORMOFADDR  = E1ADRM1_row.formofaddr._;
    //     var E1ADRM1_NAME1       = E1ADRM1_row.name1._;
    //     var E1ADRM1_POSTL_COD1  = E1ADRM1_row.country1._;
    //     var E1ADRM1_CITY1       = E1ADRM1_row.CITY1._;
    //     var E1ADRM1_COUNTRY1    = E1ADRM1_row.COUNTRY1._;
    //     var E1ADRM1_REGION      = E1ADRM1_row.REGION._;
    // }

    // var JSONObject_E1EDT13 = JSONObject_E1EDL20.E1EDT13;
    // for (var i = 0; i < JSONObject_E1EDT13.length; i++) {
    //     var E1EDT13_row = JSONObject_E1EDT13[i];
    
    //     var E1EDT13_QUALF       = E1EDT13_row.QUALF._;
    //     var E1EDT13_NTANF       = E1EDT13_row.NTANF._;
    //     var E1EDT13_NTANZ       = E1EDT13_row.NTANZ._;
    //     var E1EDT13_NTEND       = E1EDT13_row.NTEND._;
    //     var E1EDT13_NTENZ       = E1EDT13_row.NTENZ._;
    //     var E1EDT13_TZONE_BEG   = E1EDT13_row.TZONE_BEG._;
    //     var E1EDT13_ISDD        = E1EDT13_row.ISDD._;
    //     var E1EDT13_ISDZ        = E1EDT13_row.ISDZ._;
    //     var E1EDT13_IEDD        = E1EDT13_row.IEDD._;
    //     var E1EDT13_IEDZ        = E1EDT13_row.IEDZ._;
    // }

    // var JSONObject_E1TXTH8 = JSONObject_E1EDL20.E1TXTH8;
    // for (var i = 0; i < JSONObject_E1TXTH8.length; i++) {
    //     var E1TXTH8_row = JSONObject_E1TXTH8[i];
    
    //     var E1TXTH8_TDOBJECT            = E1TXTH8_row.TDOBJECT._;
    //     var E1TXTH8_TDOBNAME            = E1TXTH8_row.TDOBNAME._;
    //     var E1TXTH8_TDID                = E1TXTH8_row.TDID._;
    //     var E1TXTH8_TDSPRAS             = E1TXTH8_row.TDSPRAS._;
    //     var E1TXTH8_LANGUA_ISO          = E1TXTH8_row.LANGUA_ISO._;
    //     var E1TXTH8_E1TXTP8_TDFORMAT    = E1TXTH8_row.E1TXTP8.TDFORMAT._;
    //     var E1TXTH8_E1TXTP8_TDLINE      = E1TXTH8_row.E1TXTP8.TDLINE._;
    // }

    // var E1EDL20_E1EDL33_ALAND               = JSONObject_E1EDL20.E1EDL33.ALAND._;
    // var E1EDL20_E1EDL28_VSART               = JSONObject_E1EDL20.E1EDL28.VSART._;
    // var E1EDL20_E1EDL28_E1EDL29_VSART_BEZ   = JSONObject_E1EDL20.E1EDL28.E1EDL29.VSART_BEZ._;

    var E1EDL20_E1EDL24_POSNR               = JSONObject_E1EDL20.e1edl24[0].posnr[0]._;
    var E1EDL20_E1EDL24_MATNR               = JSONObject_E1EDL20.e1edl24[0].matnr[0]._;
    var E1EDL20_E1EDL24_ARKTX               = JSONObject_E1EDL20.e1edl24[0].arktx[0]._;
    var E1EDL20_E1EDL24_MATKL               = JSONObject_E1EDL20.e1edl24[0].matkl[0]._;
    var E1EDL20_E1EDL24_WERKS               = JSONObject_E1EDL20.e1edl24[0].werks[0]._;
    var E1EDL20_E1EDL24_LGORT               = JSONObject_E1EDL20.e1edl24[0].lgort[0]._;
    var E1EDL20_E1EDL24_LFIMG               = JSONObject_E1EDL20.e1edl24[0].lfimg[0]._;
    var E1EDL20_E1EDL24_VRKME               = JSONObject_E1EDL20.e1edl24[0].vrkme[0]._;
    var E1EDL20_E1EDL24_LGMNG               = JSONObject_E1EDL20.e1edl24[0].lgmng[0]._;
    var E1EDL20_E1EDL24_MEINS               = JSONObject_E1EDL20.e1edl24[0].meins[0]._;
    var E1EDL20_E1EDL24_NTGEW               = JSONObject_E1EDL20.e1edl24[0].ntgew[0]._;
    var E1EDL20_E1EDL24_BRGEW               = JSONObject_E1EDL20.e1edl24[0].brgew[0]._;
    var E1EDL20_E1EDL24_GEWEI               = JSONObject_E1EDL20.e1edl24[0].gewei[0]._;
    var E1EDL20_E1EDL24_VOLUM               = JSONObject_E1EDL20.e1edl24[0].volum[0]._;
    var E1EDL20_E1EDL24_GRKOR               = JSONObject_E1EDL20.e1edl24[0].grkor[0]._;
    var E1EDL20_E1EDL24_POSEX               = JSONObject_E1EDL20.e1edl24[0].posex[0]._;
    var E1EDL20_E1EDL24_VFDAT               = JSONObject_E1EDL20.e1edl24[0].vfdat[0]._;
    var E1EDL20_E1EDL24_EXPIRY_DATE_EXT     = JSONObject_E1EDL20.e1edl24[0].expiry_date_ext[0]._;
    var E1EDL20_E1EDL24_VGBEL               = JSONObject_E1EDL20.e1edl24[0].vgbel[0]._;
    var E1EDL20_E1EDL24_VGPOS               = JSONObject_E1EDL20.e1edl24[0].vgpos[0]._;
    var E1EDL20_E1EDL24_ORMNG               = JSONObject_E1EDL20.e1edl24[0].ormng[0]._;
    var E1EDL20_E1EDL24_EXPIRY_DATE_EXT_B   = JSONObject_E1EDL20.e1edl24[0].expiry_date_ext_b[0]._;

    var E1EDL20_E1EDL24_E1EDL25_LGORT_BEZ   = JSONObject_E1EDL20.e1edl24[0].e1edl25[0].lgort_bez[0]._;
    
    var E1EDL20_E1EDL24_E1EDL26_PSTYV               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].pstyv[0]._;
    var E1EDL20_E1EDL24_E1EDL26_MATKL               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].matkl[0]._;
    var E1EDL20_E1EDL24_E1EDL26_UMVKZ               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].umvkz[0]._;
    var E1EDL20_E1EDL24_E1EDL26_UMVKN               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].umvkn[0]._;
    var E1EDL20_E1EDL24_E1EDL26_UEBTO               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].uebto[0]._;
    var E1EDL20_E1EDL24_E1EDL26_UNTTO               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].untto[0]._;
    var E1EDL20_E1EDL24_E1EDL26_XCHBW               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].xchbw[0]._;
    var E1EDL20_E1EDL24_E1EDL26_SOBKZ               = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].sobkz[0]._;
    var E1EDL20_E1EDL24_E1EDL26_MATNR_LONG          = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].matnr_long[0]._;
    var E1EDL20_E1EDL24_E1EDL26_E1EDL27_PSTYV_BEZ   = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].e1edl27[0].pstyv_bez[0]._;
    var E1EDL20_E1EDL24_E1EDL26_E1EDL27_MATKL_BEZ   = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].e1edl27[0].matkl_bez[0]._;
    var E1EDL20_E1EDL24_E1EDL26_E1EDL27_WERKS_BEZ   = JSONObject_E1EDL20.e1edl24[0].e1edl26[0].e1edl27[0].werks_bez[0]._;
    
    var E1EDL20_E1EDL24_E1EDL43_QUALF = JSONObject_E1EDL20.e1edl24[0].e1edl43[0].qualf[0]._;
    var E1EDL20_E1EDL24_E1EDL43_BELNR = JSONObject_E1EDL20.e1edl24[0].e1edl43[0].belnr[0]._;
    var E1EDL20_E1EDL24_E1EDL43_POSNR = JSONObject_E1EDL20.e1edl24[0].e1edl43[0].posnr[0]._;

    // var JSONObject_E1TXTH9 = JSONObject_E1EDL20.E1EDL24.E1TXTH9;
    // for (var i = 0; i < JSONObject_E1TXTH9.length; i++) {
    //     var E1TXTH9_row = JSONObject_E1TXTH9[i];
    
    //     var E1TXTH9_TDOBJECT            = E1TXTH9_row.TDOBJECT._;
    //     var E1TXTH9_TDOBNAME            = E1TXTH9_row.TDOBNAME._;
    //     var E1TXTH9_TDID                = E1TXTH9_row.TDID._;
    //     var E1TXTH9_TDSPRAS             = E1TXTH9_row.TDSPRAS._;
    //     var E1TXTH9_LANGUA_ISO          = E1TXTH9_row.LANGUA_ISO._;
    //     var E1TXTH9_E1TXTP9_TDFORMAT    = E1TXTH9_row.E1TXTP9.TDFORMAT._;
    //     var E1TXTH9_E1TXTP9_TDLINE      = E1TXTH9_row.E1TXTP9.TDLINE._;
    // }

    // var JSONObject_E1EDL37 = JSONObject_E1EDL20.E1EDL37;
    // for (var i = 0; i < JSONObject_E1EDL37.length; i++) {
    //     var E1EDL37_row = JSONObject_E1EDL37[i];
    
    //     var E1EDL37_EXIDV               = E1EDL37_row.EXIDV._;
    //     var E1EDL37_TARAG               = E1EDL37_row.TARAG._;
    //     var E1EDL37_GWEIT               = E1EDL37_row.GWEIT._;
    //     var E1EDL37_BRGEW               = E1EDL37_row.BRGEW._;
    //     var E1EDL37_NTGEW               = E1EDL37_row.NTGEW._;
    //     var E1EDL37_MAGEW               = E1EDL37_row.MAGEW._;
    //     var E1EDL37_BTVOL               = E1EDL37_row.BTVOL._;
    //     var E1EDL37_NTVOL               = E1EDL37_row.NTVOL._;
    //     var E1EDL37_MAVOL               = E1EDL37_row.MAVOL._;
    //     var E1EDL37_TAVOL               = E1EDL37_row.TAVOL._;
    //     var E1EDL37_VHILM               = E1EDL37_row.VHILM._;
    //     var E1EDL37_LAENG               = E1EDL37_row.LAENG._;
    //     var E1EDL37_BREIT               = E1EDL37_row.BREIT._;
    //     var E1EDL37_HOEHE               = E1EDL37_row.HOEHE._;
    //     var E1EDL37_INHALT              = E1EDL37_row.INHALT._;
    //     var E1EDL37_VHART               = E1EDL37_row.VHART._;
    //     var E1EDL37_LADLG               = E1EDL37_row.LADLG._;
    //     var E1EDL37_FARZT               = E1EDL37_row.FARZT._;
    //     var E1EDL37_ENTFE               = E1EDL37_row.ENTFE._;
    //     var E1EDL37_VELTP               = E1EDL37_row.VELTP._;
    //     var E1EDL37_EXIDV2              = E1EDL37_row.EXIDV2._;
    //     var E1EDL37_VHILM_KU            = E1EDL37_row.VHILM_KU._;
    //     var E1EDL37_KDMAT35             = E1EDL37_row.KDMAT35._;
    //     var E1EDL37_ERNAM               = E1EDL37_row.ERNAM._;
    //     var E1EDL37_EXIDA               = E1EDL37_row.EXIDA._;
    //     var E1EDL37_MOVE_STATUS         = E1EDL37_row.MOVE_STATUS._;
    //     var E1EDL37_ZUL_AUFL            = E1EDL37_row.ZUL_AUFL._;
    //     var E1EDL37_VHILM_LONG          = E1EDL37_row.VHILM_LONG._;
    //     var E1EDL37_E1EDL39_QUALF       = E1EDL37_row.E1EDL39.QUALF._;
    //     var E1EDL37_E1EDL38_VHART_BEZ   = E1EDL37_row.E1EDL38.VHART_BEZ._;
    // }

    let IntakeOrder_SQL_INSERT_STATEMENT        = 'INSERT INTO `Softpak_ChangeManager`.`intakeorder` (`CompanyCode`, `ContainerNR`, `CustAddressNR`, `CustRef1`, `RecAddressNR`, `SupplierAddressNR`, `ConfirmationSend`, `OrderType`, `ReponseMessageLanguage`) VALUES ("' + E1EDL20_VBELN + '","OW2","' + E1EDL20_BOLNR + '","1953","' + E1EDL20_BOLNR + '","1953","1953",0,"INCREATE","XML")';
        
    SQL_Insert(IntakeOrder_SQL_INSERT_STATEMENT, function (IntakeOrderInsert_Result) {
        if (IntakeOrderInsert_Result != "INSERT_ERROR") {
            let IntakeOrderLine_SQL_INSERT_STATEMENT    = 'INSERT INTO `Softpak_ChangeManager`.`intakeorderline` (`OrderID`, `OrderType`, `LineNR`, `CompanyCode`, `ContainerNR`, `CustAddressNR`, `CustRef1`, `ProdRef3`, `ProductID`, `RecAddressNR`, `SupplierAddressNR`, `TransActionCustomerRef`) VALUES ("' + IntakeOrderInsert_Result + '","INCREATE",1, "OW2", "' + E1EDL20_BOLNR + '", "1953", "' + E1EDL20_BOLNR + '", "' + E1EDL20_E1EDL24_ARKTX + '", "' + E1EDL20_E1EDL24_MATNR + '", "1953", "1953", 0)';
            SQL_Insert(IntakeOrderLine_SQL_INSERT_STATEMENT, function(IntakeOrderLineInsert_Result) {
                console.log("f Translate_Inbound_Create : Order succesfully stored in database, ID (Order) : " + IntakeOrderInsert_Result + ", ID (Orderline) : " + IntakeOrderLineInsert_Result);
                Link_Inbound_Messages(E1EDL20_VBELN, IntakeOrderInsert_Result, IntakeOrderLineInsert_Result, function () {

                });
            })
        } else {
            console.error("f Translate_Inbound_Create : There was an error while trying to insert the order, please try again later");
        }
    });

}

function Link_Inbound_Messages (OrderNumber, OrderID, OrderLineID, callback) {
    //Connect to the MySQL database
    con.connect;

    // //Create a SQL Select statement to Count the amount of messages
    // let PALLETLINE_CHECK_SQL_SELECT_STATEMENT = 'SELECT COUNT(ID) FROM `Softpak_ChangeManager`.`palletline` WHERE `Ordernumber` = "' + OrderNumber + '" AND `OrderType` = "INANNOUNCE"';

    // //Query the SQL statement
    // con.query(PALLETLINE_CHECK_SQL_SELECT_STATEMENT, function (PLC_SQL_err, PLC_SQL_rows, PLC_SQL_fields) {
    //     if (PLC_SQL_err) {
    //         console.error(PLC_SQL_err);
    //     } else {
    //         let PLC_SQL_row = PLC_SQL_rows[0]
    //         let db_palletamount = PLC_SQL_row["COUNT(ID)"];

    //         if (db_palletamount == CarrierAmount) {
                let PALLETLINE_UPDATE_SQL_SELECT_STATEMENT = 'UPDATE `Softpak_ChangeManager`.`palletline` SET `OrderID` = "' + OrderID + '",`OrderLineID` = "' + OrderLineID + '" WHERE `Ordernumber` = "' + OrderNumber + '" AND `OrderType` = "INANNOUNCE"';
                
                con.query(PALLETLINE_UPDATE_SQL_SELECT_STATEMENT, function (SQL_err, SQL_result) {
                    if (SQL_err) {
                        console.error("f SQL_Insert - SQL_err: " + SQL_err);
                        callback("UPDATE_ERROR");
                    } else {
                        callback("UPDATE_SUCCES");
                    }
                });
    //         } else {
    //             console.error("Saved ammount in database is different than the amount sent by the customer. Please look into the reason");
    //         }
    //     }
    // });

    //Disconnect from the MySQL database
    con.end;
}

    //Outbound
function Translate_Outbound_Create (ID, CustomerData_RecAddressNR, DocumentCLOB) {
    let Document_ID           = ID;
    let Document_RecAddressNR = CustomerData_RecAddressNR;
    let Document_DocumentClob = DocumentCLOB;

    let JSONObject_DocumentClob = JSON.parse(Document_DocumentClob);

    let JSONObject_IDOC     = JSONObject_DocumentClob.delvry03.idoc[0];
    let JSONObject_E1EDL20  = JSONObject_IDOC.e1edl20[0];

    let E1EDL20_VBELN       = JSONObject_E1EDL20.vbeln[0]._;
    let E1EDL20_INCO1       = JSONObject_E1EDL20.inco1[0]._;
    let E1EDL20_INCO2       = JSONObject_E1EDL20.inco2[0]._;
    let COMBO_INCO1_INCO2   = E1EDL20_INCO1 + " " + E1EDL20_INCO2;

    let E1ADRM1_NAME1       = JSONObject_E1EDL20.e1adrm1[0].name1[0]._;
    let E1ADRM1_STREET1     = JSONObject_E1EDL20.e1adrm1[0].street1[0]._;
    let E1ADRM1_POSTL_COD1  = JSONObject_E1EDL20.e1adrm1[0].postl_cod1[0]._;
    let E1ADRM1_CITY1       = JSONObject_E1EDL20.e1adrm1[0].city1[0]._;
    let E1ADRM1_COUNTRY1    = JSONObject_E1EDL20.e1adrm1[0].country1[0]._;

    let COMBO_ADDRESS       = E1ADRM1_NAME1 + " " + E1ADRM1_STREET1 + " " + E1ADRM1_POSTL_COD1 + " " + E1ADRM1_CITY1;

    let E1EDL24_rows = JSONObject_E1EDL20.e1edl24;

    let ORDER_SQL_INSERT_STATEMENT = 'INSERT INTO `Softpak_ChangeManager`.`outtakeorder` (`CompanyCode`, `ContainerTypeCode`, `CustRef1`, `CustRef2`, `DeliveryAddressNR`, `DeliveryName`, `DeliveryZipCode`, `DestinationCountryCode`, `RecAddressNR`, `OrderType`, `ReponseMessageLanguage`) VALUES ("OW2", "TRAILER", "' + E1EDL20_VBELN + '", "' + COMBO_INCO1_INCO2 + '", "' + COMBO_ADDRESS + '", "' + E1ADRM1_NAME1 + '", "' + E1ADRM1_POSTL_COD1 + '", "' + E1ADRM1_COUNTRY1 + '", 1953, "OUTCREATE", "XML")';
    SQL_Insert(ORDER_SQL_INSERT_STATEMENT, function(SQL_RESULT) {
        if (SQL_RESULT != "INSERT_ERROR") {
            for (var i = 0; i < E1EDL24_rows.length; i++) {
                var E1EDL24_row = E1EDL24_rows[i];
            
                let E1EDL24_LFIMG = E1EDL24_row.lfimg[0]._;
                let E1EDL24_MATNR = E1EDL24_row.matnr[0]._;
                let E1EDL24_ARKTX = E1EDL24_row.arktx[0]._;
                let E1EDL24_TDLINE = E1EDL24_row.e1txth9[0].e1txtp9[0].tdline[0]._;
        
                let ORDERLINE_SQL_INSERT_STATEMENT = 'INSERT INTO `Softpak_ChangeManager`.`outtakeorderline`(`OrderID`, `OrderType`, `CarrierCode`, `CompanyCode`, `CustRef1`, `CustRef3`, `OuterPCK`, `OuterPCKCode`, `ProdRef2`, `ProdRef3`, `ProdRef4`, `ProdRef5`, `ProductID`, `ProductGroupCode`, `SupplierAddressNR`, `TermPlace`, `TermCode`) VALUES ("' + SQL_RESULT + '", "OUTCREATE", "PLT", "OW2", "' + E1EDL20_VBELN + '", "' + COMBO_INCO1_INCO2 + '", "' + E1EDL24_LFIMG + '", "PC", "' + E1EDL24_MATNR + '", "' + E1EDL24_ARKTX + '", "' + E1EDL24_TDLINE + '", "PALVX", "10002992", "401", "1953", "' + E1EDL20_INCO2 + '", "' + E1EDL20_INCO1 + '")';
            
                SQL_Insert(ORDERLINE_SQL_INSERT_STATEMENT, function(SQL_ROW_RESULT) {
                    if (SQL_RESULT != "INSERT_ERROR") {
                        console.log("Order + Orderline inserted");
                    }
                });
            }
        }
    });
    
}

//Energy3000
    //Inbound - Announce
    //Inbound - Create
    //Outbound

function SQL_Insert(SQL_Statement, callback) {
    //Connect to the MySQL database
    con.connect
    
    con.query(SQL_Statement, function (SQL_err, SQL_result) {
        if (SQL_err) {
            console.error("f SQL_Insert - SQL_err: " + SQL_err);
            callback("INSERT_ERROR");
        } else {
            console.log("f SQL_Insert : 1 record inserted, ID: " + SQL_result.insertId);
            callback(SQL_result.insertId);
        }
    });
    
    //Disconnect from the MySQL database
    con.end;
}

//Application Functions - DEBUG
//-----------------------------------------------------------------------

//Application Bootup procedure
//-----------------------------------------------------------------------
if (application_beta) {
    console.log("-------------------------------------------------------------------");
    console.log("BETA - BETA - BETA - BETA - BETA - BETA - BETA - BETA - BETA - BETA");
    console.log("-------------------------------------------------------------------");
}
console.log("-------------------------------------------------------------------");
console.log("Application name : " + application_name);
console.log("Booting version  : " + application_version);
console.log("Version date     : " + application_version_date);
console.log("Application port : " + application_port);
console.log("-------------------------------------------------------------------");

// app.listen(application_port, () => console.log('Application bootup succes!, listening at port: ' + application_port));

https.createServer(options, app).listen(3000, function () {
    console.log('Application bootup succes!, listening at port: ' + application_port);
  });