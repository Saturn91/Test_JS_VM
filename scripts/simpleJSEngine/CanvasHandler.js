function is2Component(value) {
    let log = Math.log(value) / Math.log(2);
    let pow = Math.pow(2, Math.round(log));
    return pow == value;
}

class CanvasHandler {
    constructor(canvasID, windowWidth,  windowHeight) {

        this.canvas = document.getElementById(canvasID);        

        this.ctx = this.canvas.getContext('2d');

        window.addEventListener('resize', () => {
            this.resizeCanvas(this);
        });
        
        this.resizeCanvas(this);

        this.setBackgroundColor(GameEnvironement.graphics.clearColor);
        
        this.loadOriginalSpriteSheet = new Image();
        
        GameEnvironement.initialized.canvas = false;

        if(GameEnvironement.properties.debug) console.log(`Canvas: [${this.windowWidth}x${this.windowHeight}] initialized!`);
        GameEnvironement.internaly.canvas = this;

        if(GameEnvironement.graphics.spriteSheetNames) {
            GameEnvironement.internaly.canvas.loadResources(() => {
                GameEnvironement.initialized.canvas = true;
            })
        } else {
            GameEnvironement.initialized.canvas = true;
        }
        
    }

    resizeCanvas(canvas) {
        if(GameEnvironement.graphics.windowWidth == undefined) { GameEnvironement.graphics.windowWidth = window.innerWidth-4 }
        if(GameEnvironement.graphics.windowHeight == undefined) { GameEnvironement.graphics.windowHeight = window.innerHeight-4 }

        if(GameEnvironement.graphics.autoFitScreen) {
            if (window.innerWidth > window.innerHeight) {
                GameEnvironement.graphics.scale = Math.round((window.innerHeight-200)/GameEnvironement.graphics.resolutionY);
                GameEnvironement.graphics.windowHeight = GameEnvironement.graphics.scale * GameEnvironement.graphics.resolutionY
                GameEnvironement.graphics.windowWidth = GameEnvironement.graphics.scale * GameEnvironement.graphics.resolutionX
            } else {
                GameEnvironement.graphics.scale = Math.round((window.innerWidth-50)/GameEnvironement.graphics.resolutionX);
                GameEnvironement.graphics.windowHeight = GameEnvironement.graphics.scale * GameEnvironement.graphics.resolutionY
                GameEnvironement.graphics.windowWidth = GameEnvironement.graphics.scale * GameEnvironement.graphics.resolutionX
            }
        }

        if(Math.abs(GameEnvironement.graphics.windowWidth / GameEnvironement.graphics.resolutionX-GameEnvironement.graphics.windowHeight / GameEnvironement.graphics.resolutionY) > 0.01) {
            console.warn('resolutionX / windowWithd should be the same value as resolutionY / windowHeight! elswhise the image gets stretched!')
        }

        canvas.setCanvasSize(GameEnvironement.graphics.windowWidth,GameEnvironement.graphics.windowHeight);
        canvas.ctx.scale(GameEnvironement.graphics.windowWidth / GameEnvironement.graphics.resolutionX, GameEnvironement.graphics.windowHeight / GameEnvironement.graphics.resolutionY)
        canvas.ctx.imageSmoothingEnabled = false;
        canvas.ctx.font = '6px serif';
    }

    loadResources(callBack) {   
        this.loadSpriteSheet(callBack);
    }

    loadSpriteSheet(callBack) {  
        if(!GameEnvironement.graphics.spriteSheetNames) return
        
        GameEnvironement.graphics.ready = GameEnvironement.graphics.spriteSheetNames.length;

        for(let i = 0; i < GameEnvironement.graphics.spriteSheetNames.length; i++) {
            let currentID = GameEnvironement.graphics.spriteSheetNames[i];
            GameEnvironement.graphics.spriteSheets[currentID].data.original = new Image();
            GameEnvironement.graphics.spriteSheets[currentID].data.original.onload = () => {
                /*
                The following code imports the original spritesheet and adds a 2 pixel gap between the different sprites.
                this gap gets filled with the pixels on the border of the original sprites.
                (you can check the result by calling: canvasHandler.ctx.drawImage(canvasHandler.spriteSheet,0,0); ),
                without this it can happen that a small portion of the neibouring tile's pixel appear as a line on the border of a drawn sprite, by adding the
                equally collorized gap this "line" has the same color as the sprite itself, which hides this side effect completly            
                */
                this.spriteSheet = document.createElement('img');
                let canvas = document.createElement('canvas');
    
                let originalImageWidth = GameEnvironement.graphics.spriteSheets[currentID].data.original.width;
                let originalImageHeight = GameEnvironement.graphics.spriteSheets[currentID].data.original.height;

                let tileNumX = originalImageWidth / GameEnvironement.graphics.spriteSheets[currentID].data.tileSize;
                let tileNumY = originalImageHeight / GameEnvironement.graphics.spriteSheets[currentID].data.tileSize;
                
                canvas.width = originalImageWidth + (tileNumX-1)*2 + 2;
                canvas.height = originalImageHeight + (tileNumX-1)*2 + 2;

                GameEnvironement.graphics.spriteSheets[currentID].data.numSpriteX = tileNumX;
                GameEnvironement.graphics.spriteSheets[currentID].data.numSpriteY = tileNumY;
    
                let spriteSheetCTX = canvas.getContext('2d');
    
                let tileSize = GameEnvironement.graphics.spriteSheets[currentID].data.tileSize;
                   
                for(let x = 0; x < tileNumX; x++) {
                    for(let y = 0; y < tileNumY; y++) {

                        let posInSheetx = x*tileSize;
                        let posInSheety = y*tileSize;
    
                        let posXOnCanvas = x*(tileSize+2)+1;
                        let posYOnCanvas = y*(tileSize+2)+1;
    
                        //left
                        spriteSheetCTX.drawImage(
                            GameEnvironement.graphics.spriteSheets[currentID].data.original,
                            posInSheetx,
                            posInSheety,
                            1,
                            tileSize,
                            posXOnCanvas-1,
                            posYOnCanvas,
                            1,
                            tileSize);
                        
                        //right
                        spriteSheetCTX.drawImage(
                            GameEnvironement.graphics.spriteSheets[currentID].data.original,
                            posInSheetx+tileSize-1,
                            posInSheety,
                            1,
                            tileSize,
                            posXOnCanvas+tileSize,
                            posYOnCanvas,
                            1,
                            tileSize);
    
                        //top
                        spriteSheetCTX.drawImage(
                            GameEnvironement.graphics.spriteSheets[currentID].data.original,
                            posInSheetx,
                            posInSheety,
                            tileSize,
                            1,
                            posXOnCanvas,
                            posYOnCanvas-1,
                            tileSize,
                            1);
    
                         //down
                         spriteSheetCTX.drawImage(
                            GameEnvironement.graphics.spriteSheets[currentID].data.original,
                            posInSheetx,
                            posInSheety+tileSize-1,
                            tileSize,
                            1,
                            posXOnCanvas,
                            posYOnCanvas+tileSize,
                            tileSize,
                            1);
                        
                        //draw original
                        spriteSheetCTX.drawImage(
                            GameEnvironement.graphics.spriteSheets[currentID].data.original,
                            posInSheetx,
                            posInSheety,
                            tileSize,
                            tileSize,
                            posXOnCanvas,
                            posYOnCanvas,
                            tileSize,
                            tileSize);
                    }
                }
    
                GameEnvironement.graphics.spriteSheets[currentID].data.spriteSheet = document.createElement('canvas');
                GameEnvironement.graphics.spriteSheets[currentID].data.spriteSheet.getContext('2d').drawImage(canvas, 0, 0);
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedX = document.createElement('canvas');
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedX.getContext('2d').scale(-1,1);
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedX.getContext('2d').drawImage(canvas, -canvas.width, 0);
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedY = document.createElement('canvas');
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedY.getContext('2d').scale(1,-1);
                GameEnvironement.graphics.spriteSheets[currentID].data.flippedY.getContext('2d').drawImage(canvas, 0, -canvas.height);
                
                GameEnvironement.graphics.ready --;
                if(GameEnvironement.graphics.ready <= 0) {
                    callBack();
                }
            }

            GameEnvironement.graphics.spriteSheets[currentID].data.original.src = GameEnvironement.graphics.spriteSheets[currentID].path;
        }
    }

    loadMapAsResource(name, mapData, spriteSheetName) {
        let mapCanvas = document.createElement('canvas');

        let tileSize = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.tileSize;

        mapCanvas.width = mapData[0].length*tileSize;
        mapCanvas.height = mapData.length*tileSize;

        let mapContext = mapCanvas.getContext('2d');
        
        for(let x = 0; x < mapData[0].length; x++) {
            for( let y = 0; y < mapData.length; y++) {
                if (mapData[y][x] >= 0) { 
                    let spriteData = this.getSpriteData(mapData[y][x], spriteSheetName);      

                    this.drawSpriteOnContext(mapContext, spriteSheetName, spriteData, x*tileSize, y*tileSize);
                }             
            }
        }
        GameEnvironement.graphics.maps[name] = {
            texture: mapCanvas,
            spriteSheetName: spriteSheetName,
            mapData: mapData
        }
    }

    setCanvasSize(windowWidth, windowHeight) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;        
        
        this.canvas.width = this.windowWidth;
        this.canvas.height = windowHeight;
    }

    setBackgroundColor(color) {
        this.canvas.style.background = color;
    }

    setColor(color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeSytle = color;
    }

    cls() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRect(x, y, w, h, color) {
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(Math.round(x),Math.round(y),w,h);
    }

    fillRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.round(x),Math.round(y),w,h);
    }

    drawSprite(sprite, spriteSheetName, x, y, flipX, flipY, targetSize) { 
        
        let xPos = x;
        let yPos = y;

        if(GameEnvironement.graphics.pixelPerfect) {
            xPos = Math.round(x);
            yPos = Math.round(y)
        }

        this.drawSpriteOnContext(this.ctx, spriteSheetName, this.getSpriteData(sprite, spriteSheetName), xPos, yPos, flipX, flipY, targetSize);
    }

    drawSpriteOnContext(context, spriteSheetName, spriteData, x, y, flipX, flipY, targetSize) {  
        let spriteSheet =  GameEnvironement.graphics.spriteSheets[spriteSheetName].data.spriteSheet;
        let xOff = spriteData.spriteOffX;
        let yOff = spriteData.spriteOffY;
        if(flipX) {
            spriteSheet = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flippedX;
            xOff = (GameEnvironement.graphics.spriteSheets[spriteSheetName].data.numSpriteX*spriteData.tileSize + spriteData.tileSize) - (spriteData.spriteOffX + spriteData.tileSize)

            if(flipY) {
                debug('flipX and flipY can not be true both...', 'CanvasHandler.drawSpriteOnContext', 'warning');
            }
        } else if(flipY) {
            yOff = (GameEnvironement.graphics.spriteSheets[spriteSheetName].data.numSpriteY*spriteData.tileSize + spriteData.tileSize) - (spriteData.spriteOffY + spriteData.tileSize)
            spriteSheet = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.flippedY;            
        }  
        
        if(!targetSize) targetSize = spriteData.tileSize;

        context.drawImage(
            spriteSheet,
            xOff,
            yOff,
            spriteData.tileSize,
            spriteData.tileSize,
            x,
            y,
            targetSize,
            targetSize);
    }

    getSpriteData(sprite, spriteSheetName) {
        let tileSize = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.tileSize;

        let spritesInX = GameEnvironement.graphics.spriteSheets[spriteSheetName].data.numSpriteX;
        
        return {
            tileSize: tileSize,
            spriteOffX: (sprite%(spritesInX))*(tileSize+2)+1,
            spriteOffY: ((sprite-(sprite%(spritesInX)))/spritesInX)*(tileSize+2)+1
        }
    }

    drawText(text, x, y, color, maxWidth) {
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y, maxWidth)
    }

    setUpdate(update_function) {
        this.update_function = update_function;
    }

    setDraw(draw_function) {
        this.draw_function = draw_function;
    }  
    
    /**
     * 
     * @param {string} mapName: map id of an already defined map 
     * @param {number} screenX: Location on screenX
     * @param {number} screenY: Location on ScreenY
     * @param {number} mapWidthInPixel: (optional) how many pixels of the map to draw in X (default: map-width)
     * @param {number} mapHeightInPixel: (optional) how many pixels of the map to draw in Y (default: map-height)
     * @param {number} mapTextureOffsetInPixelX: (optional) startPixels in X of the offset of the selected subMap (default 0)
     * @param {number} mapTextureOffsetInPixelY: (optional) startPixels in y of the offset of the selected subMap (default 0)
     * @param {number} targetSizeX: (optional) drawingSize in X of the selected suMap (use this to stretch image) (default mapWidthInPixels)
     * @param {number} targetSizeY: (optional) drawingSize in Y of the selected suMap (use this to stretch image) (default mapHeightInPixels)
     */
    drawMap(mapName, screenX, screenY, mapWidthInPixel, mapHeightInPixel, mapTextureOffsetInPixelX, mapTextureOffsetInPixelY, targetSizeX, targetSizeY) {
        this.ctx.drawImage(
            GameEnvironement.graphics.maps[mapName].texture,
            mapTextureOffsetInPixelX,
            mapTextureOffsetInPixelY,            
            mapWidthInPixel,
            mapHeightInPixel,
            screenX,
            screenY,
            targetSizeX,
            targetSizeY);
    }
}