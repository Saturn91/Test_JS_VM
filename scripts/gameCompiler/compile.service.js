function compileGameFromCode(code) {
    let memory = {};
    let functions = getAllFunctionsFromCode(code);

    memory.init = functions.init;

    memory.update = functions.update;

    memory.draw = functions.draw;

    return memory
}

function getAllFunctionsFromCode(code) {
    let functions = {};
    functions = {
        'init': () => {
            console.log('initialize');
        },
        'update': (deltaTime) => {
            console.log('update!');
        },
        'draw': (renderer) => {
            renderer.drawText('hello', 10, 10, 'white', 300); 
        }
    }
    return functions;
}

function deleteCommentsFromCode(code) {
    let lines = code.split('\n');
    let output = '';
    let commentIdentifier = '[saturn91-commentLine!]';
    lines.forEach(line => {
        let tempLine = replaceAllMultipleWhiteSpacesFromString(line);
        
        let check = tempLine.replace('//', commentIdentifier);
        
        if(check == tempLine) {
            //no comment signs found as check is identical to the code before repalcing the comment char
            output += line + "\n";
        } else {
            let parts = check.split(commentIdentifier);
            let code = '';
            let openString = false;
            //check if comment is within string
            for(let i = 0; i < parts.length; i++) {
                if(countSubStringInString(parts[i], '\'')%2 == 0 && countSubStringInString(parts[i], '\"')%2 == 0 && countSubStringInString(parts[i], '\`')%2 == 0) {
                    code += parts[i];
                    break;
                } else {
                    openString = !openString;
                    code += parts[i];
                    if(openString) code += "//";
                }
            }

            //get right side comments after code in line
            output += code + "\n";
        }
    })
    return output;
}

function spaceOutAllSpecialCaractersInCode(code) {
    let specialCharacters = ['(',')','{','}',','];
    let output = code;
    specialCharacters.forEach(char => {
        output = output.replace(char, ' ' + char + ' ');
    })
    return output;
}

function simplifyCode(code) {
    let noCommentsCode = deleteCommentsFromCode(code);
    return replaceAllMultipleWhiteSpacesFromString(spaceOutAllSpecialCaractersInCode(noCommentsCode));
    
}

function getOneFunctionFromCode(code) {
    let easierFromatedCode = simplifyCode(code);
    let words = easierFromatedCode.split(' ');

    //check length for minimal function pattern is matched
    if(words.length < 6) return undefined;

    //check first word is function
    if(words[0] != 'function') return undefined;

    //check for round brackets
    if(words[2] != '(') return undefined;

    //check for second round bracket
    let valid = false;
    let curvedBracketsEnd = 3;
    for(let i = curvedBracketsEnd; i < words.length; i++) {
        if(words[i] == ')') {
            valid = true;
            curvedBracketsEnd = i;
            break;
        }
    }

    //check for round brackets
    let curlyBracketsStart = curvedBracketsEnd+1;
    if(words[curlyBracketsStart] != '{') return undefined;

    //check for second round bracket
    valid = false;
    let curlyBracketsEnd = curlyBracketsStart+1;
    for(let i = curlyBracketsEnd; i < words.length; i++) {
        if(words[i] == '}') {
            valid = true;
            curlyBracketsEnd = i;
            break;
        }
    }

    if(!valid) return undefined;

    //get funcion name
    let name = words[1];

    //get parameters
    let parameters = [];
    for(let i = 3; i < curvedBracketsEnd; i++) {
        if(words[i] != ',') parameters.push(words[i].replace(',', ''));
    }

    //get function code
    let functionCode = "";
    for(let i=curlyBracketsStart+1; i < curlyBracketsEnd; i++) {
        functionCode += words[i];
        if(i < curlyBracketsEnd-1) functionCode += " ";
    }

    functionCode = replaceAllMultipleWhiteSpacesFromString(functionCode);

    return {
        name,
        parameters,
        code: functionCode
    };
}