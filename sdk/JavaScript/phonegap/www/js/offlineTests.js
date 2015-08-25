// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

function defineOfflineTests() {

    var testServiceUrl = "http://test.com";
    var testServiceKey = "key";
    var testTableName = "items";

    function createMobileServiceClient() {

        var client = new WindowsAzure.MobileServiceClient(testServiceUrl, testServiceKey);

        return client;
    }

    function getOfflineTests() {
        var tests = [];

        tests.push(new zumo.Test('Offline test 1', function (test, done) {
            console.log("Running " + test.name);

            var client = createMobileServiceClient();
            var store = new WindowsAzure.MobileServiceSQLiteStore("test.db");
            client.getSyncContext().initialize(store);

            store.defineTable({
                    name: "FirstTable",
                    columnDefinitions: {
                        id: "TEXT",
                        description: "INTEGER",
                        misc: "REAL"
                    }
                })
                .then(function() {
                    var syncTable = client.getSyncTable(testTableName);

                    var rowObject = {
                        "id": "pen",
                        "description": "reynolds",
                        "price": 51
                    };

                    return syncTable.insert(rowObject).then(function() {
                        return syncTable.lookup(rowObject.id);
                    }, function() {
                        $assert.fail("Expected insert to be successful");
                    });
                })
                .then(function(result) {
                    //$assert.isTrue(JSON.stringify(rowObject) === JSON.stringify(result), "MobileServiceSyncTable lookup failed");
                    done(JSON.stringify(rowObject) === JSON.stringify(result));
                }, function() {
                    //$assert.fail("Lookup should have succeeded");
                    done(false);
                });
        }));

        return tests;
    }

    zumo.testGroups.push(new zumo.Group('Offline', getOfflineTests()));
}

zumo.tests.offlineTests = defineOfflineTests();
