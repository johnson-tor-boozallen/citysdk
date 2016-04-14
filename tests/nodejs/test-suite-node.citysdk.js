// using Version 5.4.1
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var jQuery = require('jquery')(window);


var C = require("../../js/citysdk.js");
var F = require("../../js/citysdk.fema.js");

var sdk = new C.CitySDK();
//console.log(sdk.stateNames());


sdk.allowCache = true;
//localStorage.clear();
var testResultStatus = {};
var asyncTestsRunning = 0;



function runCoreTest(){
    var moduleName = "core";
    testResultStatus[moduleName]=true;

    // getStateCapitalCoords
    console.log("Core: Testing State Capital Coords with mispelling");
    if(sdk.getStateCapitalCoords("VirGinia").join() != [37.5333, -77.4667].join()){
        failTest(moduleName,"getStateCapitalCoords","Failed to retrieve state coordinates for Virginia");
    }

    console.log("Core: Testing State Capital Coords with Two-letter Abbr.");
    if(sdk.getStateCapitalCoords("VA").join() != [37.5333, -77.4667].join()){
        failTest(moduleName,"getStateCapitalCoords","Failed to retrieve state coordinates for VA");
    }

    console.log("Core: Testing State Capital Coords with no input");
    if(sdk.getStateCapitalCoords() != false){
        failTest(moduleName,"getStateCapitalCoords","Failed to return fall on empty input");
    }


    console.log("Core: Testing ajaxRequest");
    sdk.ajaxRequest("https://data.ct.gov/resource/y6p2-px98.json?category=Fruit&item=Peaches").done(function(response) {
        //console.log(JSON.parse(response));
        console.log("ajaxRequest Response");
        console.log(response);
    });



    //parseRequestLatLng
    var request = {"latitude":100,"longitude":20};
    console.log("Core: parseRequestLatLng");
    var returnedRequest = sdk.parseRequestLatLng(request);
    if(returnedRequest.lng != 20 && returnedRequest.lat != 100){
        failTest(moduleName,"parseRequestLatLng","Failed to return latitude & longiture");
    }

    updateStatusDisplay();

}//runCoreTest



function failTest(moduleName,functionName,errorMessage){
    testResultStatus[moduleName] = false;
    testResultStatus['all']=false;
    //jQuery(".statusOutput").append("<p>"+moduleName+" : " +functionName+ " : "+errorMessage+"</p>");
}//failTest


function updateStatusDisplay(moduleName){
    if(asyncTestsRunning == 0){
        jQuery.each(testResultStatus,function(index,value) {
            if (testResultStatus[index] === false) {
                console.log(index + " has failed");
                /*jQuery("tr[dataModuleName="+index+"] .testStatus").addClass("bg-danger");
                 jQuery("tr[dataModuleName="+index+"] .testStatus > span").text(" Failed");*/
            } else if (testResultStatus[index] === true) {
                console.log(index + " has passed");
                /*jQuery("tr[dataModuleName="+index+"] .testStatus").addClass("bg-success");
                 jQuery("tr[dataModuleName="+index+"] .testStatus > span").text(" Pass");*/
            }
        });
    }
}//updateStatusDisplay



// FEMA
// FEMA
// FEMA
// FEMA
// FEMA
// FEMA

var fema = sdk.modules.fema;
function testFEMAModule() {
    var moduleName = "fema";
    var request = {};
    var response;
    testResultStatus[moduleName] = true;


    fema.enable();

    if (fema.isIso8601Date("1997-07-16T19:20:30+01:00") != true) {
        failTest(moduleName, "isIso8601Date", "Valid date failed test");
    }
    if (fema.isIso8601Date("1997-07-16") != true) {
        failTest(moduleName, "isIso8601Date", "Valid date failed test");
    }
    if (fema.isIso8601Date("10-12-1997") != false) {
        failTest(moduleName, "isIso8601Date", "Invalid date passed test");
    }
    if (fema.isIso8601Date("05/12/1997") != false) {
        failTest(moduleName, "isIso8601Date", "Invalid date passed test");
    }
    if (fema.isIso8601Date("1997/07/16") != false) {
        failTest(moduleName, "isIso8601Date", "Invalid date passed test");
    }


    var request = {
        /* disasterNumber: 3849, */
        state: "VA",
        county: "Loudoun",
        declarationRangeStart: "1990-07-16T19:20:30-08:00",
        declarationRangeEnd: "2015-07-16T19:20:30+01:00",
        skip: 0,
        take: 1000
    };

    asyncTestsRunning++;

    fema.DisasterDeclarationsSummariesRequest(request,function(response){
        asyncTestsRunning--;
        if(response['DisasterDeclarationsSummaries'][3]['disasterNumber']!="1491"){
            failTest(moduleName, "DisasterDeclarationsSummariesRequest", "Disaster number not found in response");
        }
        updateStatusDisplay();

    });

    updateStatusDisplay();

}// testCensusModule


















// Run the Tests
// Run the Tests
// Run the Tests
// Run the Tests
// Run the Tests
runCoreTest();




//var CitySDK = require("./citysdk/citysdk.arcgis.js");
/*
    */