TEST_SUITE = {
    lastTitle : {
        element: undefined,
        text: ''
    },
    runAllTestsComplete : true,
    runs_total : {
        testRuns : 0,
        passedTests : 0,
        failedTests : 0
    },
    runs_scope : {
        testRuns : 0,
        passedTests : 0,
        failedTests : 0
    },
    summaryLine : document.getElementById('summary')
};

function testTitle(title) {
    TEST_SUITE.lastTitle.element = document.createElement("h2");
    TEST_SUITE.lastTitle.text = title;
    TEST_SUITE.lastTitle.element.classList.add('green');
    TEST_SUITE.lastTitle.element.classList.add('test-title')
    document.body.appendChild(TEST_SUITE.lastTitle.element);
    TEST_SUITE.runs_scope.testRuns = 0;
    TEST_SUITE.runs_scope.passedTests = 0;
    TEST_SUITE.runs_scope.failedTests = 0;
}

function testResultLine(string, passed) {
    var testLine = document.createElement('p');
    testLine.innerText = string;    
    let cssText = '';
    passed ? cssText = 'green' : cssText = 'red';

    if(TEST_SUITE.lastTitle.element) {
        if(!TEST_SUITE.lastTitle.element.classList.contains(cssText)) {
            TEST_SUITE.lastTitle.element.classList.remove('green');
            TEST_SUITE.lastTitle.element.classList.add(cssText);
            TEST_SUITE.summaryLine.classList.remove('light-green');
            TEST_SUITE.summaryLine.classList.add('red');
        }
    }

    testLine.classList.add('test-line');
    testLine.classList.add(cssText);
    document.body.appendChild(testLine);
}

function assert(testDescription, test, expection) {
    TEST_SUITE.runs_total.testRuns ++;
    TEST_SUITE.runs_scope.testRuns ++;
    let passed = test == expection;
    if(passed){
        TEST_SUITE.runs_total.passedTests ++;
        TEST_SUITE.runs_scope.passedTests ++;
    } else {
        TEST_SUITE.runs_total.failedTests++;
        TEST_SUITE.runs_scope.failedTests++;
        console.error(testDescription + ' -> failed')
    }  
    if(!passed || TEST_SUITE.runAllTestsComplete) {
        testResultLine(testDescription, passed);
    }   
    TEST_SUITE.lastTitle.element.innerText = TEST_SUITE.lastTitle.text +  `: ${TEST_SUITE.runs_scope.testRuns} tests ran, ${TEST_SUITE.runs_scope.passedTests}/${TEST_SUITE.runs_scope.testRuns} passed, ${TEST_SUITE.runs_scope.failedTests} failed` 
    TEST_SUITE.summaryLine.innerText =                                      `${TEST_SUITE.runs_total.testRuns} tests ran, ${TEST_SUITE.runs_total.passedTests}/${TEST_SUITE.runs_total.testRuns} passed, ${TEST_SUITE.runs_total.failedTests} failed`
}

document.getElementById('rerun-test-btn').addEventListener('click', () => {
    location.reload();
});
