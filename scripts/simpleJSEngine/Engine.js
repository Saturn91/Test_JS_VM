const GameEnvironement = {
    gameName: "Saturn91-Engine",
    canvasID: 'canvasObject',

    initialized: {
        ready: false,
        canvas: false
    },

    graphics: {
        windowWidth: 640,
        windowHeight: 512,
        autoFitScreen: false,
        resolutionX: 160,
        resolutionY: 128,
        scale: 1,
        fps: 60,
        clearColor: '#000000',
        pixelPerfect: false,
        maps: {},
        spriteSheets: {}
    },  

    sounds: {
        sfx: {}
    },

    functions: {
        init: undefined,
        update: undefined,
        draw: undefined
    },  

    input: {
        cmdsOnKeys: [
            {name: 'up', keys: ['w', 'ArrowUp']},
            {name: 'right', keys: ['d', 'ArrowRight']},
            {name: 'down', keys: ['s', 'ArrowDown']},
            {name: 'left', keys: ['a', 'ArrowLeft']},
            {name: 'jump', keys: [' ', 'x']},
            {name: 'fire1', keys: ['c', 'mouseLeft']},
            {name: 'fire2', keys: ['y', 'mouseRight']}
        ],
        mousePosition: {x: 0, y: 0},
        cmdsUp: {},
        keyMap: {},
        cmdDown: {}
    },

    properties: {
        debug: false,
        debugMsg: undefined,
        actual_fps: 0,
        fps_update_rate_ms: 1000,
        last_fps_update: 0
    },

    internaly: {
        loop: undefined,
        lastUpdate: 0,
        canvas: undefined,
        engine: undefined
    }
}

class Engine {
    constructor() {
        GameEnvironement.internaly.engine = this;        
        new Renderer(new CanvasHandler(GameEnvironement.canvasID, GameEnvironement.graphics.windowWidth, GameEnvironement.graphics.windowHeight));
        GameEnvironement.loop = this.loop;
        if(GameEnvironement.graphics.fps > 60) {
            console.warn('60 fps is the maximal value possible [' + GameEnvironement.graphics.fps + "] gets clamped to 60!");
        }
        setTimeout(this.waitForInitialization(), 100);

        let title = document.getElementById('game-name');
        if(title) title.innerText = GameEnvironement.gameName;
        document.title = GameEnvironement.gameName;        
    }

    /**
    * !!engine internal do not call!! 
    * main Game loop calling the functions which are defined in GameEnvironement.functions (draw / update)
    */
    loop(timestamp) {
        GameEnvironement.time = timestamp;
        let inputFPS = 120;
        if(GameEnvironement.graphics.fps < 60) {
            inputFPS = GameEnvironement.graphics.fps;
        }

        if(timestamp - GameEnvironement.internaly.lastUpdate >= 1000/(inputFPS)) {
            let timeDelta = timestamp - GameEnvironement.internaly.lastUpdate
            if(GameEnvironement.functions.update) GameEnvironement.functions.update(timeDelta)
            GameEnvironement.internaly.canvas.ctx.save();
            if(GameEnvironement.functions.draw) GameEnvironement.functions.draw(GameEnvironement.internaly.renderer)
            GameEnvironement.internaly.canvas.ctx.restore();
            GameEnvironement.internaly.lastUpdate = timestamp

            GameEnvironement.properties.actual_fps = ((GameEnvironement.properties.actual_fps) * 0.99 + 0.01 *  1000/timeDelta); 

            if(timestamp - GameEnvironement.properties.last_fps_update > GameEnvironement.properties.fps_update_rate_ms && GameEnvironement.properties.debug) {
                GameEnvironement.properties.last_fps_update = timestamp;
                console.log("actual fps: " + Math.floor(GameEnvironement.properties.actual_fps) + " last timeDelta: " + Math.floor(timeDelta) + "ms");
            }
        }      
        
        updateControls();
        
        window.requestAnimationFrame(GameEnvironement.loop)
    }

    /**
    * !!engine internal do not call!! 
    * gets fired right after all resources are loaded, calls the in GameEnvironement.functions defined "init" function
    */
    start() {        
        GameEnvironement.properties.actual_fps = GameEnvironement.graphics.fps;
        GameEnvironement.internaly.lastUpdate = 0
        SetupControls();
        if(GameEnvironement.functions.init) GameEnvironement.functions.init();
        window.requestAnimationFrame(GameEnvironement.loop)
    }

    /**
    * !!engine internal do not call!! 
    * Wait until all resources are loaded
    */
    waitForInitialization() {
        GameEnvironement.initialized.ready = GameEnvironement.initialized.canvas;

        if(!GameEnvironement.initialized.ready) {
            if(GameEnvironement.properties.debug) {
                console.log('loading resources');
            }
            setTimeout(this.waitForInitialization, 100);
        } else {
            if(GameEnvironement.properties.debug) {
                console.log('Engine initialized!');
            }            
            GameEnvironement.internaly.engine.start();
        }        
    }

    /**
     * add a new Map to GameEnvironement.
     *
     * @param {string} mapName: the id of the added Map
     * @param {string} spriteSheetName: name of an already defined spriteSheet
     * @param {Array} mapData: twodimensional array i.e. [[0,0,0],[-1,-1,-1],[1,1,1]] this results in a 3x3 Map first line would be 3x Sprite 0 of spriteSheetName, 2nd line empty, 3rd line 3x sprite 1
     * @return {void} creates map Object in GameEnvironement
     */
    addMap(mapName, spriteSheetName, mapData) {
        GameEnvironement.internaly.canvas.loadMapAsResource(mapName, mapData, spriteSheetName);        
    }

    /**
     * change a Tile within a map
     *
     * @param {string} mapName: the id of a defined Map you want to edit
     * @param {number} x: x-position in grid (should be an integer) 
     * @param {number} y: y-position in grid (should be an integer) 
     * @param {number} sprite: sprite to be drawn on the map (0 = top left sprite in this maps spritesheet, (SpriteSheetWidth/TileSize)*(SpriteSheetHeight/TileSize))-1 = lower right sprite
     */
    setMap(mapName, x, y, sprite) {
        let ctx = GameEnvironement.graphics.maps[mapName].texture.getContext('2d');
        let spriteSheetName = GameEnvironement.graphics.maps[mapName].spriteSheetName;
        let tileSize = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.tileSize;
        
        ctx.clearRect(x*tileSize, y*tileSize, tileSize, tileSize);        

        if (sprite >= 0) {
            GameEnvironement.internaly.canvas.drawSpriteOnContext(
                ctx, spriteSheetName, 
                GameEnvironement.internaly.canvas.getSpriteData(sprite, spriteSheetName),
                x*tileSize, y*tileSize);   
                GameEnvironement.graphics.maps[mapName].mapData[y][x] = sprite;
        }        
    }

    /**
     * get Tile(Number) from the connected Spritesheet of a Map at a specific location
     *
     * @param {string} mapName: the id of a defined Map you want to get the sprite from
     * @param {number} x: x-position in grid (should be an integer) 
     * @param {number} y: y-position in grid (should be an integer) 
     * @return {number}: the sprite at location mapData[y][x]
     */
    getMap(mapName, x, y) {
        return GameEnvironement.graphics.maps[mapName].mapData[y][x];
    }

    /**
     * Add Sfx to GameEnvironement
     *
     * @param {string} audioName: the id of the defined Sound get the initialized Audio by calling: GameEnvironement.sounds.shx[audioName] -> get {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement HTMLAudioElement}
     * @param {string} pathToFile: path to sound file
     */
    addAudio(audioName, pathToFile) {
        GameEnvironement.sounds.sfx[audioName] = new Audio(pathToFile);
    }   
    
    playAudio(audioName) {
        const sfx = GameEnvironement.sounds.sfx[audioName];
        if (!sfx.isPaused) sfx.play();
    }
}

/**
     * Preload Tileset, Use this befor you create engine with 'new Engine()'!
     *
     * @param {string} spriteSheetName: the id of the defined SpriteSheet
     * @param {string} path: path to sound file
     * @param {array} flagData: array[width*height] of numbers, width: spriteSheet.with/tileSize, height: spriteSheet.height/tileSize, 0 = no flags, 1 = 1st flag true, 2 = 2nd flag true, 3 = 1st and 2nd flag true ... 256 = all 8 flags true 
     * @param {number} tileSize: (optional) default 8
     */
function addSpriteSheet(spriteSheetName, path, flagData, tileSize) {

    if(!tileSize) tileSize = 8;
    GameEnvironement.graphics.spriteSheets[spriteSheetName] = {};
    GameEnvironement.graphics.spriteSheets[spriteSheetName].path = path;
    GameEnvironement.graphics.spriteSheets[spriteSheetName].data = {original: undefined, spriteSheet: undefined};
    GameEnvironement.graphics.spriteSheets[spriteSheetName].data.tileSize = tileSize;

    if(flagData) {
        GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags = flagData;
    }

    GameEnvironement.graphics.spriteSheetNames ? 0 : GameEnvironement.graphics.spriteSheetNames = [];
    GameEnvironement.graphics.spriteSheetNames.push(spriteSheetName);

    if(!is2Component(tileSize)) console.warn('Tile size should be [1,2,4,8,16,32,64...!]: but is ' + tileSize);
}

/**
 * Get sprite Flags of a specific Sprite within Spritesheet
 * @param {number} sprite sprite number 
 * @param {string} spriteSheetName id of a defined SpriteSheet
 * @param {number} flag [1..8] or undefined (flag which gets returned) if undefined sum of all flags
 * @returns {number} sprite flag, if flag parameter was undefined -> sum of all flags (256: all flags true), else true or false if flag enabled
 */
function getSpriteFlag(sprite, spriteSheetName, flag) {
    if(GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags) {
        if(flag >= 0) {
            return (GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite] & Math.pow(2,flag)) === Math.pow(2,flag);
        } else {
            return GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite];
        }
    } else {
        return false;
    }
}

/**
 * Use this function to change SpriteFlags at runtime (after initialisation -> in init function, or in update)
 * @param {number} sprite: sprite ID of the sprite which will be edited 
 * @param {string} spriteSheetName: spritesheet ID which includes the selected Sprite
 * @param {number} flag: [1..8] + value (bool) (set flag as value) or undefined: -> value (number) will override flag number
 * @param {number} value: if flag is a number -> bool (new value of chosen flag), if flag is undefined -> numeric value which sumerizes all flags (0 = no flag, 256 = all 8 flags)
 */
function setSpriteFlag(sprite, spriteSheetName, flag, value) {
    if(!GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags) {
        GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags = [
            GameEnvironement.graphics.spriteSheets[spriteSheetName].data.numSpriteX*
            GameEnvironement.graphics.spriteSheets[spriteSheetName].data.numSpriteY
        ]
    }

    if(flag) {
        let actualValue = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite];
        if(value > 0 || value === true) {
            GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite] = actualValue | Math.pow(2,flag);
        } else {
            GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite] = actualValue & (256-Math.pow(2,flag));
        }        
    } else {
        GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flags[sprite] = value;
    }    
}

/**
* !!engine internal do not call!! 
* updates control flags so they can be used
*/
function updateControls() {
    for(let i = 0; i < GameEnvironement.input.cmdsOnKeys.length; i++) {
        let oldValue = GameEnvironement.input.cmdDown[GameEnvironement.input.cmdsOnKeys[i].name];
        let value = false;
        for(let j = 0; j < GameEnvironement.input.cmdsOnKeys[i].keys.length; j++) {
            value = GameEnvironement.input.keyMap[GameEnvironement.input.cmdsOnKeys[i].keys[j]] || value;
        }        
        GameEnvironement.input.cmdDown[GameEnvironement.input.cmdsOnKeys[i].name] = value;
        oldValue &! value ? GameEnvironement.input.cmdsUp[GameEnvironement.input.cmdsOnKeys[i].name] = true: GameEnvironement.input.cmdsUp[GameEnvironement.input.cmdsOnKeys[i].name] = false;
    }

    GameEnvironement.input.keyMap['mouseLeft'] = false;
    GameEnvironement.input.keyMap['mouseRight'] = false;
}

/**
* !!engine internal do not call!! 
*/
onkeydown = onkeyup = function(e){
    GameEnvironement.input.keyMap[e.key] = e.type == 'keydown';
}
/**
 * !!engine internal do not call!!
 */
function onMouseMove(e) {
    GameEnvironement.input.mousePosition.x = (e.pageX - this.offsetLeft) / GameEnvironement.graphics.scale; 
    GameEnvironement.input.mousePosition.y = (e.pageY - this.offsetTop) / GameEnvironement.graphics.scale; 
}

/**
* !!engine internal do not call!! 
* initial setup of controls
*/
function SetupControls() {
    
    document.addEventListener('keydown', (e) => {
        onkeydown(e);
    });

    document.addEventListener('keyup', (e) => {
        onkeyup(e);
    });

    GameEnvironement.internaly.canvas.canvas.onmousemove = onMouseMove;

    GameEnvironement.internaly.canvas.canvas.addEventListener('mouseleave', e => {
        GameEnvironement.input.mousePosition.x = -1; 
        GameEnvironement.input.mousePosition.y = -1; 
    });

    GameEnvironement.internaly.canvas.canvas.addEventListener('click', (e) => {
        GameEnvironement.input.keyMap['mouseLeft'] = true;
    });

    GameEnvironement.internaly.canvas.canvas.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        GameEnvironement.input.keyMap['mouseRight'] = true;
    });
}

/**
 * Internal debugger if type = undefined msg's are default console.log's but hidden until the GameEnvironement.properties.debug is set to true
 * @param {string} msg: the displayed text of the log
 * @param {string} component: component name i.e. main.js/update(), this helps to identify where in the code the msg was fired/**
 * @param {string} type: (optional) ['undefined': (normal), 'warning': warning, 'error': error]
*/
function debug(msg, component, type) {
    if(!component) {
        console.warn('please set componentName!');
        component = 'unknown Component!';
    }
    let output = component + ': ' + msg;

    if(GameEnvironement.properties.debugMsg) GameEnvironement.properties.debugMsg(output, type);

    if(!type && GameEnvironement.properties.debug)
    {
        console.log(output);
        return;
    } 
    if(type==='warning') {
        console.warn(output);
        
        return
    }
    if(type==='error') {
        console.error(output);
        return
    }

    
}

/**
 * Clear all defined (also the default up, left etc...) cmds
 */
function clearAllCMS() {
    GameEnvironement.input.cmdsOnKeys = [];
}

/**
 * Add a new Keyboard CMD
 * @param {string} cmdName: the cmd name i.e. 'up' you can check if key is pressed with: GameEnvironement.input.onkeydown['up'] and if key up with: GameEnvironement.input.onkeyup['up']
 * @param {string} keyCodes: the event.key value of the desired key: i.e. 'w', checkout this websites {@link https://keycode.info/ here} and {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/ here} for help on that 
 */
function AddCMD(cmdName, keyCodes) {
    let cmd = undefined;
    for(let i = 0; i < GameEnvironement.input.cmdsOnKeys.length; i++) {
        if(GameEnvironement.input.cmdsOnKeys[i]. name === cmdName) {
            cmd = GameEnvironement.input.cmdsOnKeys[i];
            break;
        }
    }
    
    if(!cmd) {
        GameEnvironement.input.cmdsOnKeys.push({name: cmdName, keys: keyCodes});
    } else {
        for(let i = 0; i < keyCodes.length; i++) {
            let exists = false;
            for(let j = 0; j < cmd.keys.length; j++) {
                if(cmd.keys[j] === keyCodes[i]) {
                    exists = true;
                    console.warn('cmd: ' + cmd.keys[j] + ' does already exist in ' + cmd.name);
                    break;
                }
            }

            if(!exists) GameEnvironement.input.cmdsOnKeys.push(keyCodes[i]);
        }
    }
}

/**
 * clear one cmd which is no longer used from the cmd set
 * @param {string} cmdName: the cmd name i.e. 'up' you would like to remove
 */
function RemCMD(cmdName) {
    for(let i = 0; i < GameEnvironement.input.cmdsOnKeys.length; i++) {
        if(GameEnvironement.input.cmdsOnKeys[i].name === cmdName) {
            GameEnvironement.input.cmdsOnKeys.splice(i,1);
            return;
        }
    }
    let definedCMDs = '[';
    for(let i = 0; i < GameEnvironement.input.cmdsOnKeys.length; i++) {
        definedCMDs += GameEnvironement.input.cmdsOnKeys[i].name + ','
    }
    definedCMDs += ']';

    console.error('cmd: ' + cmdName + ' does not exist, or was already removed... defined cmds: ' + definedCMDs);
}
