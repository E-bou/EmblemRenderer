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
const fs_1 = __importDefault(require("fs"));
const canvas_1 = __importDefault(require("canvas"));
class Datacenter {
    constructor(config) {
        this.emblemSymbols = [];
        this.config = config;
        this.cache = {
            EMBLEM_SYMBOL_BY_ICON_ID: new Map(),
            CANVAS_IMAGE_BY_PATH: new Map(),
            IMAGE_BY_PATH: new Map(),
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const emblemSymbolsJsonPath = `${this.config.dataPath}/EmblemSymbols.json`;
            if (!fs_1.default.existsSync(emblemSymbolsJsonPath)) {
                throw new Error(`File not found: ${emblemSymbolsJsonPath}`);
            }
            this.emblemSymbols = JSON.parse(yield fs_1.default.promises.readFile(emblemSymbolsJsonPath, 'utf8'));
        });
    }
    getConfig() {
        return this.config;
    }
    getEmblemsPath() {
        return this.config.emblemsPath;
    }
    getEmblemSymbols() {
        return this.emblemSymbols;
    }
    getEmblemSymbolByIconId(iconId) {
        if (this.cache.EMBLEM_SYMBOL_BY_ICON_ID.has(iconId)) {
            return this.cache.EMBLEM_SYMBOL_BY_ICON_ID.get(iconId);
        }
        const eb = this.getEmblemSymbols().find((emblemSymbol) => emblemSymbol.iconId === iconId);
        this.cache.EMBLEM_SYMBOL_BY_ICON_ID.set(iconId, eb);
        return eb;
    }
    getCanvasImageByPath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.CANVAS_IMAGE_BY_PATH.has(path)) {
                return this.cache.CANVAS_IMAGE_BY_PATH.get(path);
            }
            if (!fs_1.default.existsSync(path)) {
                return undefined;
            }
            const img = yield canvas_1.default.loadImage(path);
            this.cache.CANVAS_IMAGE_BY_PATH.set(path, img);
            return img;
        });
    }
    getImageByPath(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.IMAGE_BY_PATH.has(path)) {
                return this.cache.IMAGE_BY_PATH.get(path);
            }
            if (!fs_1.default.existsSync(path)) {
                return undefined;
            }
            const img = yield fs_1.default.promises.readFile(path);
            this.cache.IMAGE_BY_PATH.set(path, img);
            return img;
        });
    }
    saveImageByPath(path, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(this.config.outputPath)) {
                yield fs_1.default.promises.mkdir(this.config.outputPath, { recursive: true });
            }
            yield fs_1.default.promises.writeFile(path, new Uint8Array(buffer));
            this.cache.IMAGE_BY_PATH.set(path, buffer);
        });
    }
}
exports.default = Datacenter;
