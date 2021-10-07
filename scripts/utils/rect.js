class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    scale(scaleInX, scaleInY) {
        this.width *= scaleInX > 0 ? scaleInX : 1;
        this.height *= scaleInY > 0 ? scaleInY : 1;
    }

    clone() {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    toString() {
        return 'rect: ' + this.x + ', ' + this.y + ', ' + this.width + ', ' + this.height;
    }

    isInBounds(x, y){        
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }
}