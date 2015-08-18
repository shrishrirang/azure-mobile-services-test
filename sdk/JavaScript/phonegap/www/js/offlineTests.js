// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// ----------------------------------------------------------------------------

function getOfflineTests() {
    var tests = [];

    tests.push(new zumo.Test('Offline test 1', function (test, done) {
        console.log("Running " + test.name);

        done(true);
    }));

    tests.push(new zumo.Test('Offline test 2', function (test, done) {
        console.log("Running " + test.name);

        done(false);
    }));

    return tests;
}

zumo.testGroups.push(new zumo.Group('Offline', getOfflineTests()));
