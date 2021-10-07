class Renderer {
    constructor(canvasHandler) {
        GameEnvironement.internaly.renderer = this;
        this.canvasHandler = canvasHandler;
    }

    cls() {
        this.canvasHandler.cls();
    }

    drawSprite(sprite, spriteSheetName, x, y, flipX, flipY, targetSize) {
        let drawSize = targetSize;
        if(!targetSize) drawSize = this.canvasHandler.getSpriteData(sprite, spriteSheetName).tileSize;
        if(this.areaIsOnScreen(x, y, drawSize, drawSize)) this.canvasHandler.drawSprite(sprite, spriteSheetName, x, y, flipX, flipY, drawSize)
    }

    drawMap(mapName, screenX, screenY, mapWidthInPixel, mapHeightInPixel, mapTextureOffsetInPixelX, mapTextureOffsetInPixelY, targetSizeX, targetSizeY) {
        let map = GameEnvironement.graphics.maps[mapName];
        let tileSize = GameEnvironement.graphics.spriteSheets[map.spriteSheetName].data.tileSize

        if(!mapWidthInPixel) mapWidthInPixel = map.mapData[0].length*tileSize
        if(!mapHeightInPixel) mapHeightInPixel = map.mapData.length*tileSize
        if(!mapTextureOffsetInPixelX) mapTextureOffsetInPixelX = 0;
        if(!mapTextureOffsetInPixelY) mapTextureOffsetInPixelY = 0;
        if(!targetSizeX) targetSizeX = mapWidthInPixel;
        if(!targetSizeY) targetSizeY = mapHeightInPixel;

        if(this.areaIsOnScreen(screenX, screenY, targetSizeX, targetSizeY)) this.canvasHandler.drawMap(mapName, screenX, screenY, mapWidthInPixel, mapHeightInPixel, mapTextureOffsetInPixelX, mapTextureOffsetInPixelY, targetSizeX, targetSizeY);
    }

    drawText(text, x, y, color, maxWidth) {
        this.canvasHandler.drawText(text, x, y, color, maxWidth);
    }

    drawRect(x, y, w, h, color) {
        if(this.areaIsOnScreen(x, y, w, h)) this.canvasHandlerdrawRect(x, y, w, h, color);
    }

    fillRect(x, y, w, h, color) {
        if(this.areaIsOnScreen(x, y, w, h)) this.fillRect(x, y, w, h, color);
    }

    positionIsOnScreen(x, y) {
        return x >= 0 && x < GameEnvironement.graphics.resolutionX && y >= 0 && y < GameEnvironement.graphics.resolutionY;
    }

    areaIsOnScreen(x, y, width, height) {
        return  this.positionIsOnScreen(x, y) || 
                this.positionIsOnScreen(x + width, y + height) || 
                (x < 0 && x + width > GameEnvironement.graphics.resolutionX && y < 0 && y + height > GameEnvironement.graphics.resolutionY)
    }
}