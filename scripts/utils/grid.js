class Grid {
    constructor(rect, tileSize) {
        this.tileSize = tileSize;
        this.initialize(rect);        
        this.zoom = 1;
    }

    initialize(rect) {
        this.rect = rect;
        this.field = [rect.height];
        for(let i = 0; i < rect.height; i++) {
            this.field[i] = [rect.width]; 
            for(let x = 0; x < rect.width; x++) {
                this.field[i][x] = undefined;
            }
        }
        this.scaledRect = rect.clone();
        this.scaledRect.scale(this.tileSize, this.tileSize);
    }

    setFieldData(x, y, data) {
        if(!this.gridCoordinateInBounds(x, y)) {
            debug('grid ccordinates not in bounds!', 'grid.js.setFieldData(x, y)', 'error');
            return;
        }
        this.field[y][x] = data;
    }

    getDataInFieldByGridCoordinates(x, y) {
        if(!this.gridCoordinateInBounds(x, y)) {
            debug('grid coordinates not in bounds!', 'grid.js.getDataInFieldByGridCoordinates(x, y)', 'error');
            return undefined;
        }
        return this.field[y][x];
    }

    getDataInFieldByPosCoordinates(x, y) {
        let posOnGrid = this.getGridCoordinateFromPosition(x, y);
        if(!posOnGrid) {
            debug('invalid pos, not on grid', 'grid.js.getDataInFieldByPosCoordinates(x, y)', 'error');
            return undefined;
        }
        
        return this.getDataInFieldByGridCoordinates(posOnGrid.x, posOnGrid.y);
    }

    gridCoordinateInBounds(x, y) {
         return this.rect.isInBounds(x + this.rect.x, y + this.rect.y);
    }

    positionCoordinateInBounds(x, y) {
        return this.scaledRect.isInBounds(x / this.zoom, y / this.zoom);
    }

    calcPositionInGridFromOffsetedAndUnscaledPos(offset, posWithOffset, scale) {
        return Math.round(((posWithOffset - offset) - (posWithOffset - offset) % scale) / scale);
    }

    getGridCoordinateFromPosition(x, y) {
        if(!this.positionCoordinateInBounds(x, y)) {
            debug('grid position coordinates not in bounds!', 'grid.js.getGridCoordinateFromPosition(x, y)', 'error');
            return undefined;
        }

        return new Vector2f(
            this.calcPositionInGridFromOffsetedAndUnscaledPos(this.scaledRect.x, x / this.zoom, this.tileSize),
            this.calcPositionInGridFromOffsetedAndUnscaledPos(this.scaledRect.y, y / this.zoom, this.tileSize)
        )
    }

    setZoom(zoom) {
        this.zoom = zoom;
    }

    setField(fields) {
        this.field = fields;
    }

    loopGrid(callback, tileSize, zoom, offset) {
        if(!tileSize) tileSize = 1;
        if(!zoom) zoom = 1;
        if(!offset) offset = {x: 0, y: 0}
        this.field.forEach((line, y) => line.forEach((field, x) => callback(
            offset.x + x * tileSize * zoom,
            offset.y + y * tileSize * zoom, 
            field, 
            this.tileSize*zoom, 
            this.rect.x + offset.x + x * tileSize * zoom, 
            this.rect.y + offset.y + y * tileSize * zoom)
        ));
    }
    
    loopGridWithTileSize(callback, offset) {
        this.loopGrid(callback, this.tileSize, 1, offset);
    }

    loopGridScaled(callback, offset) {
        this.loopGrid(callback, this.tileSize, this.zoom, offset);
    }
}
