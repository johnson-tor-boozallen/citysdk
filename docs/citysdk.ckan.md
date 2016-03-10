# CitySDK CKAN Module





* * *

## Class: CkanModule
Instantiates an instance of the CitySDK CKAN object.

### CitySDK CKAN Module.CkanModule.enable(apiKey) 

Enable function. Stores the API key for this module and sets it as enabled.  It will also compare the CitySDK core's version number to the minimum number required as specified for this module.

**Parameters**

**apiKey**: `string`, The census API key.

**Returns**: `boolean`, True if enabled, false if not enabled.

### CitySDK CKAN Module.CkanModule.seriesRequest(request, callback) 

Sends a SQL query to a CKAN server.The DataStore extension must be installed to utilise this.

**Parameters**

**request**: `object`, JSON ObjectNote: You can only request ONE of the below (package/group/tag).If you make a request, select a facet, and leave the value blank, then a full list of that facet's possible values will be returned. <pre><code>var request = {    "group": '',    "tag": '',    "package": '',}</code></pre>

**callback**: `function`, Sends a SQL query to a CKAN server.The DataStore extension must be installed to utilise this.

**Returns**: `object`, JSON Object<pre><code></code></pre>

### CitySDK CKAN Module.CkanModule.APIRequest(request, callback) 

Sends a query to a CKAN server.The DataStore extension must be installed to utilise this.

**Parameters**

**request**: `object`, JSON Object <pre><code>var request = {    "url": 'catalog.opendata.city',    "fields": '"name","streetAddress","postalCode"',    "resource_id": '"e4491e0c-ba09-4cb2-97c1-d466e3e976a5"',    "limit": '2'}</code></pre>Note: previous versions of this library used "select" and "from" for "fields" and "resource_id" respectively. These inputs will still work as the code looks for them for legacy installations.This function matches up to CKAN Datastore's search API.  See http://docs.ckan.org/en/ckan-2.0/datastore-api.html#ckanext.datastore.logic.action.datastore_search

**callback**: `function`, Sends a query to a CKAN server.The DataStore extension must be installed to utilise this.

**Returns**: `object`, JSON Object<pre><code>{    "success": true,    "result": {        "records": [            {                "postalCode": "10001",                "streetAddress": "441 WEST 26 STREET",                "name": "Hudson Guild Ccc"            },            {                "postalCode": "10001",                "streetAddress": "459 WEST 26 STREET",                "name": "Hudson Guild Children's Center"            }        ],        "fields": [            {                "type": "text",                "id": "name"            },            {                "type": "text",                "id": "streetAddress"            },            {                "type": "numeric",                "id": "postalCode"            }        ],    }}</code></pre>



* * *










