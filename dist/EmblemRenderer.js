"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const canvas_1 = __importDefault(require("canvas"));
class EmblemRenderer {
    constructor(args, datacenter) {
        this.symbolScale = 0.60;
        this.args = args;
        this.datacenter = datacenter;
    }
    getSymbolDimensions(symbol) {
        return {
            width: symbol.width * this.symbolScale,
            height: symbol.height * this.symbolScale,
            xOffset: (symbol.width - symbol.width * this.symbolScale) / 2,
            yOffset: (symbol.height - symbol.height * this.symbolScale) / 2,
        };
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            const shasum = crypto_1.default.createHash('sha1');
            shasum.update(`${this.args.emblemType}_${this.args.symbolIconId}_${this.args.symbolColor}_${this.args.backgroundIconId}_${this.args.backgroundColor}`);
            const hash = shasum.digest('hex');
            const path = `${this.datacenter.getConfig().outputPath}/${hash}2.png`;
            const cache = yield this.datacenter.getImageByPath(path);
            if (cache) {
                return cache;
            }
            const [outline, symbol, backContent] = yield Promise.all([
                this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/outline${this.args.emblemType}/${this.args.backgroundIconId}.png`),
                this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/up/${this.args.symbolIconId}.png`),
                this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/backcontent/${this.args.backgroundIconId}.png`),
            ]);
            if (!outline || !symbol || !backContent) {
                throw new Error('Failed to load required images');
            }
            const img = canvas_1.default.createCanvas(outline.width, outline.height);
            const ctx = img.getContext('2d');
            const coloredBackContent = canvas_1.default.createCanvas(backContent.width, backContent.height);
            const backContentCtx = coloredBackContent.getContext('2d');
            backContentCtx.drawImage(backContent, 0, 0);
            backContentCtx.globalCompositeOperation = 'source-in';
            backContentCtx.fillStyle = this.args.backgroundColor;
            backContentCtx.fillRect(0, 0, backContent.width, backContent.height);
            ctx.drawImage(coloredBackContent, 0, 0);
            ctx.drawImage(outline, 0, 0);
            ctx.globalCompositeOperation = 'source-over';
            const coloredSymbol = canvas_1.default.createCanvas(symbol.width, symbol.height);
            const symbolCtx = coloredSymbol.getContext('2d');
            symbolCtx.drawImage(symbol, 0, 0);
            symbolCtx.globalCompositeOperation = 'source-in';
            const symbolData = this.datacenter.getEmblemSymbolByIconId(this.args.symbolIconId);
            if (symbolData && symbolData.colorizable) {
                symbolCtx.fillStyle = this.args.symbolColor;
                symbolCtx.fillRect(0, 0, symbol.width, symbol.height);
            }
            const symbolDim = this.getSymbolDimensions(symbol);
            ctx.drawImage(coloredSymbol, 0, 0, symbol.width, symbol.height, symbolDim.xOffset, symbolDim.yOffset, symbolDim.width, symbolDim.height);
            const buffer = img.toBuffer();
            this.datacenter.saveImageByPath(path, buffer);
            return buffer;
        });
    }
}
exports.default = EmblemRenderer;
