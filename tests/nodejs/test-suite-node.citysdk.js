// using Version 5.4.1
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var jQuery = require('jquery')(window);


var C = require("../../js/citysdk.js");
var F = require("../../js/citysdk.fema.js");

var CitySDK = new C.CitySDK();
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




// Run the Tests
runCoreTest();




//var CitySDK = require("./citysdk/citysdk.arcgis.js");
/*
    */