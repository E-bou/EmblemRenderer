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
const Datacenter_1 = __importDefault(require("./Datacenter"));
const EmblemRenderer_1 = __importDefault(require("./EmblemRenderer"));
class EmblemRendererApp {
    constructor(config) {
        this.isInitialized = false;
        this.config = config;
        this.datacenter = new Datacenter_1.default(this.config);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.datacenter.init();
            this.isInitialized = true;
        });
    }
    renderEmblem(args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                yield this.init();
            }
            const emblemRenderer = new EmblemRenderer_1.default(args, this.datacenter);
            const buffer = yield emblemRenderer.render();
            return buffer;
        });
    }
}
exports.default = EmblemRendererApp;
