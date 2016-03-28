// using Version 5.4.1
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;
var jQuery = require('jquery')(window);


var C = require("../../js/citysdk.js");
var CitySDK = new C.CitySDK();
console.log(CitySDK.stateNames());

//var CitySDK = require("./citysdk/citysdk.arcgis.js");
/*
    */