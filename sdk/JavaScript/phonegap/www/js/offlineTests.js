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

        tests.push(new zumo.Test('Insert test', function (test, done) {
            console.log("Running " + test.name);

            var client = createMobileServiceClient();
            var store = new WindowsAzure.MobileServiceSQLiteStore("test6.db");

            client.getSyncContext().initialize(store);

            var rowObject = {
                "id": "101",
                "description": "reynolds pen",
                "price": 10.01
            };

            var syncTable;
            store.defineTable({
                name: testTableName,
                columnDefinitions: {
                    id: WindowsAzure.MobileServiceSQLiteStore.ColumnType.TEXT,
                    description: WindowsAzure.MobileServiceSQLiteStore.ColumnType.TEXT,
                    price: WindowsAzure.MobileServiceSQLiteStore.ColumnType.TEXT
                }
            })
                .then(function () {
                    syncTable = client.getSyncTable(testTableName);
                    return syncTable.del(rowObject);
                })
                .then(function () {
                    syncTable = client.getSyncTable(testTableName);
                    return syncTable.insert(rowObject);
                })
                .then(function () {
                    syncTable = client.getSyncTable(testTableName);
                    return syncTable.del(rowObject);
                })
                .then(function () {
                    rowObject.description = "same ID, but updated value 111";
                    return syncTable.insert(rowObject);
                })
                .then(function () {
                    rowObject.description = "same ID, but updated value 222";
                    return syncTable.update(rowObject);
                })
                .then(function () {
                    return syncTable.lookup(rowObject.id);
                })
                .then(function (result) {
                    done(JSON.stringify(rowObject) === JSON.stringify(result));
                }, function (error) {
                    done(false); // lookup should have succeeded
                });
        }));

        return tests;
    }

    zumo.testGroups.push(new zumo.Group('Offline', getOfflineTests()));
}

zumo.tests.offlineTests = defineOfflineTests();
