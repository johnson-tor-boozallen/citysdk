// using Version 5.4.1
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var jQuery = require('jquery')(window);


var CitySDK = require("../../js/citysdk.js");
var FM = require("../../js/citysdk.fema.js");
var CM = require("../../js/citysdk.census.js");
var GA = require("../../js/citysdk.arcgis.js");

var sdk = new CitySDK();




sdk.allowCache = true;
var censusAPIkey = "21ca50e1a3e22cf2b18083748c278199395408ec";

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
        //console.log(response);
    });

    sdk.ajaxRequest("https://data.ct.gov/resource/y6p2-px98.json?category=Fruit&item=Peaches").done(function(response) {
        //console.log(JSON.parse(response));
        console.log("ajaxRequest Response 2");
        //console.log(response);
    });

    sdk.ajaxRequest("https://data.ct.gov/resource/y6p2-px98.json?category=Fruit&item=Apples").done(function(moo) {
        //console.log(JSON.parse(response));
        console.log("ajaxRequest Response 3");
        //console.log(response);
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
    console.log("Failing Test " + moduleName + " :: "+functionName+ " :: "+errorMessage);
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


    asyncTestsRunning++;

    fema.DisasterDeclarationsSummariesRequest(request,function(response){
        asyncTestsRunning--;
        console.log("Fema response 2");
        if(response['DisasterDeclarationsSummaries'][3]['disasterNumber']!="1491"){
            failTest(moduleName, "DisasterDeclarationsSummariesRequest", "Disaster number not found in response");
        }
        updateStatusDisplay();

    });

    updateStatusDisplay();

}// testFemaModule

census = sdk.modules.census;
function testCensusModule() {
    console.log("Census: Testing Census Module");
    var moduleName = "census";
    var request = {};
    testResultStatus[moduleName] = true;

    census.enable(censusAPIkey);


    // Convert Alias to Variable
    console.log("Census: Testing parseToVariable");
    if (census.parseToVariable("employment_labor_force") != "B23025_002E") {
        failTest(moduleName, "parseToVariable", "Failed to get variable from alias name");
    }

    console.log("Testing isNormalizable");
    if (census.isNormalizable("commute_time_other") != true && census.isNormalizable("education_none") != false) {
        failTest(moduleName, "isNormalizable", "Incorrect values returned by function");
    }


    request = {
        "level": "state",
        "state": "VA",
        "variables": [
            "education_masters"
        ]
    };

    console.log("Census: Testing parseRequestStateCode");
    request = census.parseRequestStateCode(request);
    if (request.lat != 37.5333 && request.lng != -77.4667) {
        failTest(moduleName, "parseRequestStateCode", "Failed to get stat capital coordinates");
    }else{
        console.log("Census: Success parseRequestStateCode");
    }



    // ESRItoGEO

    // GEOtoESRI


    // getACSVariableDictionary
    asyncTestsRunning++;
    console.log("Census: Testing getVariableDictionary 2013");
    census.getVariableDictionary("acs5", 2013, function (result) {
        asyncTestsRunning--;
        console.log("Census: Testing getACSVariableDictionary 2013 Response");
        if (typeof result.variables != undefined) {
            if (typeof result.variables.B23025_006E == undefined) {
                failTest(moduleName, "getACSVariableDictionary", "ACS5 2013 Variable array exists but one or more variables is missing.");
            }
        } else {
            failTest(moduleName, "getACSVariableDictionary", "ACS5 2013 Variable array does not exist.");
        }
    });

    asyncTestsRunning++;
    console.log("Census: Testing getACSVariableDictionary 2014");
    census.getACSVariableDictionary("acs1", 2014, function (result) {
        asyncTestsRunning--;
        console.log("Census: Testing getACSVariableDictionary 2014 Response");
        if (typeof result.variables != undefined) {
            if (typeof result.variables.B24126_438E == undefined) {
                failTest(moduleName, "getACSVariableDictionary", "ACS5 2013 Variable array exists but one or more variables is missing.");
            }
        } else {
            failTest(moduleName, "getACSVariableDictionary", "ACS5 2013 Variable array does not exist.");
        }
        updateStatusDisplay();
    });


    // latLngToFIPS
    asyncTestsRunning++;
    console.log("Census: latLngToFIPS");
    census.latLngToFIPS("25.7753", "-80.2089", function (moo) {
        asyncTestsRunning--;
        console.log("Census: latLngToFIPS response");

        if (moo.States === null || moo["2010 Census Blocks"] === null) {
            failTest(moduleName, "latLngToFIPS", "Failed to get FIPS information from coordinate points. Note: it is possible that the Geocoder service may not be returning the valid data. Re-run test.");
        } else if (moo.States[0].BASENAME.toLowerCase() != "florida") {
            failTest(moduleName, "latLngToFIPS", "Failed to get FIPS information from coordinate points");
        }
        updateStatusDisplay();
    });

    // addressToFIPS
    asyncTestsRunning++;
    console.log("Census: addressToFIPS response");

    census.addressToFIPS("777 Lynn Street", "Herndon", "VA", function (response) {
        console.log("Census: addressToFIPS");

        asyncTestsRunning--;
        if (response[0].geographies.States === null) {
            failTest(moduleName, "addressToFIPS", "Failed to get FIPS information from address. Note: it is possible that the Geocoder service may not be returning the valid data. Re-run test.");
        } else if (response[0].geographies.States[0].BASENAME.toLowerCase() != "virginia") {
            failTest(moduleName, "addressToFIPS", "Unexpected values returned by function.. Note: it is possible that the Geocoder service may not be returning the valid data. Re-run test.");
        }
        updateStatusDisplay();
    });


    // ZIPtoLatLng
    asyncTestsRunning++;
    console.log("Census: ZIPtoLatLng Start");
    census.ZIPtoLatLng("20190", function (response) {
        asyncTestsRunning--;
        console.log("Census: ZIPtoLatLng Response");

        if (parseFloat(response.lat) != 38.9597752 && parseFloat(response.lng) != -77.3368607) {
            failTest(moduleName, "ZIPtoLatLng", "Failed to get coordinates from zip code. Note: it is possible that the Geocoder service may not be returning the valid data. Re-run test.");
        }
        updateStatusDisplay();
    });

    asyncTestsRunning++;
    request = {
        "level": "state",
        "lat": "25.7753",
        "lng": "-80.2089",
        "year": 2013,
        "api": "acs1",
        "sublevel": true,
        "variables": [
            "commute_time",
            "commute_time_carpool",
            "commute_time_other"
        ]
    };


    // Tests that require valid FIPS location
    console.log("Census: latLngToFIPS Outer Test Start");
    census.latLngToFIPS("25.7753", "-80.2089", function (geographies) {
        console.log("Census: latLngToFIPS Outer Test Response");
        var fipsData = geographies["2010 Census Blocks"][0];
        request["state"] = fipsData["STATE"];
        request["county"] = fipsData["COUNTY"];
        request["tract"] = fipsData["TRACT"];
        request["blockGroup"] = fipsData["BLKGRP"];
        request["place"] = ("Incorporated Places" in geographies) ? (geographies["Incorporated Places"].length > 0) ? geographies["Incorporated Places"][0]["PLACE"] : null : null;
        request["place_name"] = ("Incorporated Places" in geographies) ? (geographies["Incorporated Places"].length > 0) ? geographies["Incorporated Places"][0]["NAME"] : null : null;

        request.geocoded = true;

        census.validateRequestGeographyVariables(request, function(response){
            console.log("validateRequestGeographyVariables")
        });


        console.log("Census: SummaryRequest");
        census.summaryRequest(request, function (response) {
            asyncTestsRunning--;
            console.log("Census: SummaryRequest Responses");
            if (response[1][2] != "189255") {
                failTest(moduleName, "acsSummaryRequest", "2013 ACS1 State Level with sublevel Request Failed");
            }
            updateStatusDisplay();
        });

        asyncTestsRunning++;
        request.level = "county";
        request.sublevel = false;
        request.year = 2014;
        request.api = "acs5";
        request.variables = [
            "commute_time",
            "commute_time_carpool",
            "commute_time_other"
        ];

        census.acsSummaryRequest(request, function (response) {
            asyncTestsRunning--;

            if (response[1][4] != "2600861") {
                failTest(moduleName, "acsSummaryRequest", "2014 ACS5 County Level Request Failed: Population variable not included in data");
            }
            updateStatusDisplay();

        });


        asyncTestsRunning++;

        census.GEORequest(request, function (response) {
            asyncTestsRunning--;
            if (response['features'][0]['properties']['COUNTY'] != "086" && response['features'][0]['geometry']['coordinates'][1][0] != "-80.44061099982213") {
                failTest(moduleName, "GEORequest", "Failed to retrieve GEO Request");
            }
            updateStatusDisplay();

        });


        asyncTestsRunning++;
        request.level = "county";
        request.sublevel = false;
        request.year = 2010;
        request.api = "sf1";
        request.variables = [
            "population_1990",
            "age_75_to_79_1990",
            "race_south_american_uruguayan_2010"
        ];

        console.log("SummaryRequest");
        census.summaryRequest(request, function (response) {
            console.log("SummaryRequest Response");
            asyncTestsRunning--;
            if (response[1][1] != "2496435") {
                failTest(moduleName, "summaryRequest", "2010 SF1 County Level Request Failed: Population variable not included in data or not correct");
            }
            updateStatusDisplay();

        });


        asyncTestsRunning++;
        request.level = "state";
        request.sublevel = false;
        request.year = 1990;
        request.api = "sf3";
        request.variables = [
            "age_under_1_1990",
            "age_3_to_4_1990"
        ];

        census.summaryRequest(request, function (response) {

            asyncTestsRunning--;
            if (response[1][1] != "11382895") {
                failTest(moduleName, "summaryRequest", "1990 SF1 State Level Request Failed: Population variable not included in data or not correct");
            }
            updateStatusDisplay();

        });







        asyncTestsRunning++;
        request.level = "state";
        request.sublevel = false;
        request.year = 2007;
        request.api = "ewks";
        request.variables = [
            "EMP",
            "ESTAB"
        ];

        census.summaryRequest(request, function (response) {
            asyncTestsRunning--;
            if (response[1][0] != "4238403" && response[1][2] != "55") {
                failTest(moduleName, "summaryRequest", "2007 Economic Census Request Failed: Population variable not included in data or not correct");
            }
            updateStatusDisplay();

        });


        asyncTestsRunning++;
        request.level = "state";
        request.sublevel = false;
        request.year = 2007;
        request.api = "ewks";
        request.variables = [
            "EMP",
            "ESTAB"
        ];

        census.APIRequest(request, function (response) {
            asyncTestsRunning--;
            if (response['data'][0]['EMP'] != "0" && response['data'][0]['ESTAB'] != "55") {
                failTest(moduleName, "APIRequest", "APIRequest 2007 Economic Census Request Failed: ESTAB variable not included in data or not correct");
            }
            updateStatusDisplay();

        });


        asyncTestsRunning++;
        // Note - this is INVALID input.  The function is SUPPOSED to fail.
        request.level = "tract";
        request.sublevel = false;
        request.year = 2007;
        request.api = "ewks";
        request.variables = [
            "EMP",
            "ESTAB"
        ];
        census.GEORequest(request, function (response) {
            asyncTestsRunning--;
            if(response != false){
                failTest(moduleName, "GEORequest", "Function returned data with invalid geographic specification.");

            }
            updateStatusDisplay();

        });




    });


    //tigerwebRequest


    updateStatusDisplay();

} // end testCensusModule


var arcgis = sdk.modules.arcgis;
function testArcGISModule() {
    sdk.allowCache = false;

    var moduleName = "arcgis";
    var request = {};
    var response;
    testResultStatus[moduleName] = true;


    arcgis.enable();

    arcgis.DEFAULT_ENDPOINTS.apiURL = "http://services.arcgis.com/VTyQ9soqVukalItT/";
    asyncTestsRunning++;
    arcgis.seriesRequest(request,function(response){
        asyncTestsRunning--;
        if(!('services' in response)){
            failTest(moduleName, "seriesRequest", "Failed to retrieve service list from " + arcgis.DEFAULT_ENDPOINTS.apiURL);
        }
        updateStatusDisplay();
    });

    var request = {
        'api' : "Jobs_Proximity_Index",
        'level' : 0
    };
    asyncTestsRunning++;
    arcgis.getVariableDictionary(request,function(response){
        asyncTestsRunning--;
        if(!('fields' in response)){
            failTest(moduleName, "getVariableDictionary", "Failed to retrieve variable list and layer description from " + arcgis.DEFAULT_ENDPOINTS.apiURL + " :: " + request.api);
        }
        updateStatusDisplay();

    });

    asyncTestsRunning++;
    arcgis.getLevelDictionary(request,function(response){
        asyncTestsRunning--;
        if(!('layers' in response)){
            failTest(moduleName, "getLevelDictionary", "Failed to retrieve variable list and layer description from " + arcgis.DEFAULT_ENDPOINTS.apiURL + " :: " + request.api);
        }
        updateStatusDisplay();

    });


    request = {
        "api": "Jobs_Proximity_Index",
        "level": "0",
        "where": "JOBS_IDX > 50 AND JOBS_IDX < 52",
        "variables": [
            "BLOCKGROUPID",
            "JOBS_IDX",
            "AVariableThatDoesNotExist"
        ],
        'limit': 50
    };
    asyncTestsRunning++;
    arcgis.APIRequest(request,function(response){
        asyncTestsRunning--;
        if(!('features' in response)){
            failTest(moduleName, "APIRequest", "Failed to retrieve features from " + arcgis.DEFAULT_ENDPOINTS.apiURL + " :: " + request.api);
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
testCensusModule();
testFEMAModule();
testArcGISModule();
//var CitySDK = require("./citysdk/citysdk.arcgis.js");
/*
    */