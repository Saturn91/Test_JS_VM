function CompileAndRun(code) {
    simplifiedCode = simplifyCode(code);
    let initInCode = simplifiedCode.includes('function init');
    let updateGameInCode = simplifiedCode.includes('function updateGame');
    let drawGameInCode = simplifiedCode.includes('function drawGame');
    eval(simplifiedCode);

    if(initInCode) GameEnvironement.functions.init = init; 
    if(updateGameInCode) GameEnvironement.functions.update = updateGame;
    if(drawGameInCode) GameEnvironement.functions.draw = drawGame;

    //create Game
    let engine = new Engine();
}

function readCodeFromURI() {
    const queryString = decodeURI(window.location.search);
    if(queryString.length > 0 ){
        let uriCode = queryString.substring(1,queryString.length);
        document.querySelector('[data-codeInput]').value = uriCode;
    }
}

readCodeFromURI();

function getUrlWithoutParameters() {
    return window.location.href.split('?')[0];
}

document.getElementById('exportGameBtn').addEventListener(('click'), () => {
    let simplifiedCode = simplifyCode(document.querySelector('[data-codeInput]').value);
    let url = getUrlWithoutParameters() + "?" + simplifiedCode;
    alert('link was copied to your clipboard: \n \n if that was not the case, copy it below \n \n' + url);
    navigator.clipboard.writeText(url);
});

document.getElementById('startGameBtn').addEventListener(('click'), () => {
    CompileAndRun(document.querySelector('[data-codeInput]').value);
});
