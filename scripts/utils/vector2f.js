class Vector2f {
    constructor(x, y, scale) {
        if(!x) x = 0;
        if(!y) y = 0;
        this.setValue(x, y, scale);
    }

    setScale(value) {
        this.x = this.internal_x * value;
        this.y = this.internal_y * value;
    }

    getValuesScaled(scale) {
        if(!scale) return undefined;
        return this.clone(scale);
    }

    setValue(x, y, scale) {
        if(!scale) scale = 1;
        this.internal_x = x;
        this.internal_y = y;
        this.setScale(scale);
    }

    clone(scale) {
        return new Vector2f(this.x, this.y, scale);
    }
}