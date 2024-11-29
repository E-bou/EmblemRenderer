import canvas from 'canvas';
import IConfig from './Interfaces/Config';
import IEmblemSymbols from './Interfaces/EmblemSymbols';
export default class Datacenter {
    private readonly config;
    private readonly cache;
    private emblemSymbols;
    constructor(config: IConfig);
    init(): Promise<void>;
    getConfig(): IConfig;
    getEmblemsPath(): string;
    getEmblemSymbols(): IEmblemSymbols[];
    getEmblemSymbolByIconId(iconId: number): IEmblemSymbols | undefined;
    getCanvasImageByPath(path: string): Promise<canvas.Image | undefined>;
    getImageByPath(path: string): Promise<Buffer | undefined>;
    saveImageByPath(path: string, buffer: Buffer): Promise<void>;
}
