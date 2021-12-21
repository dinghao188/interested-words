import {TextEditorDecorationType, window} from 'vscode';

//============================Highlight Color====================================
class Color {
    constructor
    (
        private readonly red: number,
        private readonly green: number,
        private readonly blue: number
    ) {}

    ToRGB() {
        return `rgb(${this.red}, ${this.green}, ${this.blue})`;
    }

    Reserve() {
        return new Color(255-this.red, 255-this.green, 255-this.blue);
    }
};

class ColorPicker {
    private colors_: Color[];
    private index_: number;

    constructor() {
        this.colors_ = [];
        this.index_ = 0;

        [
            [22, 133, 169],  [80, 97, 109],   [255, 242, 223], [255, 198, 75],  [132, 90, 51],
            [243, 104, 56],  [106, 172, 161], [195, 255, 0],   [255, 71, 119],  [195, 230, 164],
            [230, 169, 164], [0, 88, 131],    [138, 172, 106], [192, 192, 175], [106, 133, 172],
            [0, 255, 127],   [255, 70, 56],   [230, 170, 72],  [68, 206, 246],  [230, 209, 164],
            [0, 161, 156],   [15, 57, 70],    [205, 230, 229], [80, 109, 102],  [113, 230, 226],
            [22, 169, 81],   [131, 37, 172],  [55, 37, 172],   [110, 118, 73],  [128, 94, 91]
        ].forEach((rgbValue) => {
            this.colors_.push(new Color(rgbValue[0], rgbValue[1], rgbValue[2]));
        });
    }

    getOneColor(): Color {
        const color = this.colors_[this.index_];
        this.index_ += 1;
        this.index_ %= this.colors_.length;
        return color;
    }
};
//============================================================================================

const decorationTypes: TextEditorDecorationType[] = [];
const colorPicker = new ColorPicker();

//获取高亮样式
export function getHighlightStyle() {
    let ret: TextEditorDecorationType;

    if (decorationTypes.length > 0) {
        ret = decorationTypes[decorationTypes.length-1];
        decorationTypes.pop();
    } else {
        const bgColor = colorPicker.getOneColor();
        ret = window.createTextEditorDecorationType({
            backgroundColor: bgColor.ToRGB(),
            color: bgColor.Reserve().ToRGB(),
            fontWeight: "bolder",
            borderRadius: '0.5em'
        });
    }
    return ret;
}

//返还高亮样式待用
export function backHighlightStyle(hs: TextEditorDecorationType) {
    decorationTypes.push(hs);
}