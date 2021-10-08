{
    TEST_SUITE.runAllTestsComplete = false;

    function helper_replaceAllWhiteSpacesFromString(string_value) {
        return string_value.replace(/\s+/g, " ");
    }

    function helper_functionEquals(fun1, fun2) {
        if(! fun1 |! fun2) return false;
        let compare = helper_replaceAllWhiteSpacesFromString(fun1.toString()) == helper_replaceAllWhiteSpacesFromString(fun2.toString());
        if(!compare) {
            console.log(helper_replaceAllWhiteSpacesFromString(fun1.toString()));
            console.log('!=');
            console.log(helper_replaceAllWhiteSpacesFromString(fun2.toString()));
        } 
        return compare;
    }

    let code = '';
    let memory = {}

    //before:
    function beforeTest() {
        code = `
            function init() {
                console.log('initialize');
            }

            function update(deltaTime) {
                console.log('update!');
            }

            function draw(renderer) {
                renderer.drawText('hello', 10, 10, 'white', 300); 
            }
        `

        memory.init = () => {
            console.log('initialize');
        }

        memory.update = (deltaTime) => {
            console.log('update!');
        }

        memory.draw = (renderer) => {
            renderer.drawText('hello', 10, 10, 'white', 300);
        } 
    }    

    testTitle('test Game Compiler');


    beforeTest();
    let compiled = compileGameFromCode(code);
    assert(
        'compiles default function code init function is correct',
        helper_functionEquals(compiled.init, memory.init),
        true
    );

    assert(
        'compiles default function code update function is correct',
        helper_functionEquals(compiled.update, memory.update),
        true
    );

    assert(
        'compiles default function code draw function is correct',
        helper_functionEquals(compiled.draw, memory.draw),
        true
    );
    
    

    let commentCode = `
        code
        //comment
    `;

    let shoudBeCommentCode = `
        code
    `;

    let compiledCommentCode = deleteCommentsFromCode(commentCode);

    assert(
        'gets rid of full commentlines',
        replaceAllMultipleWhiteSpacesFromString(compiledCommentCode) == replaceAllMultipleWhiteSpacesFromString(shoudBeCommentCode),
        true
    )
    
    commentCode = `
        code //comment
    `;

    shoudBeCommentCode = `
        code 
    `;

    compiledCommentCode = deleteCommentsFromCode(commentCode);

    assert(
        'gets rid of end line comments',
        replaceAllMultipleWhiteSpacesFromString(compiledCommentCode) == replaceAllMultipleWhiteSpacesFromString(shoudBeCommentCode),
        true
    )

    commentCode = `
        code = '// no comment';
    `;

    shoudBeCommentCode = `
        code = '// no comment';
    `;

    compiledCommentCode = deleteCommentsFromCode(commentCode);

    assert(
        'comments within strings get ignored!',
        replaceAllMultipleWhiteSpacesFromString(compiledCommentCode) == replaceAllMultipleWhiteSpacesFromString(shoudBeCommentCode),
        true
    )

    
    
    let functionCode = ``;

    assert(
        'failes on empty code',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `init function(){}`;

    assert(
        'failes on "function" is not the first word',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `function init){} m`;

    assert(
        'failes on no first (',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `function init({
        test
    }`;

    assert(
        'failes on no second )',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `function init()} m`;

    assert(
        'failes on no first {',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `function init(){
        test
    ;`;

    assert(
        'failes on no second }',
        getOneFunctionFromCode(functionCode) == undefined,
        true
    )

    functionCode = `function init(){}`;

    assert(
        'identifes function name',
        getOneFunctionFromCode(functionCode).name == 'init',
        true
    )

    functionCode = `function init(){test}`;

    assert(
        'gets simple code',
        getOneFunctionFromCode(functionCode).code == 'test',
        true
    )

    functionCode = `function init(){
        console.log('hello world);
        console.log('hello world2);
    }`;

    assert(
        'gets more advanced code',
        getOneFunctionFromCode(functionCode).code == "console.log('hello world); console.log('hello world2);",
        true
    )

    functionCode = `function init(){
        console.log('hello world');  //comment at end line
        console.log('hello world2');
        //full comment line
    }`;

    assert(
        'gets more advanced code with comments',
        getOneFunctionFromCode(functionCode).code == "console.log('hello world'); console.log('hello world2');",
        true
    )

    functionCode = `function init(){}`;
    compiled = getOneFunctionFromCode(functionCode);

    assert(
        'no parameters but valid function',
        compiled.parameters.length == 0,
        true
    )

    functionCode = `function init(value1,value2){}`;
    compiled = getOneFunctionFromCode(functionCode);

    assert(
        'Num of compiled parameters is correct',
        compiled.parameters.length == 2,
        true
    )

    assert(
        'parameters have right values',
        compiled.parameters[0] == 'value1' && compiled.parameters[1] == 'value2',
        true
    )
}