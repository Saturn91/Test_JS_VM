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

document.getElementById('startGameBtn').addEventListener(('click'), () => {
    //console.log(document.querySelector('[data-codeInput]').value);
    CompileAndRun(document.querySelector('[data-codeInput]').value);
});
