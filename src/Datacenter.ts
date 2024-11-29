import fs from 'fs';
import canvas from 'canvas';
import IConfig from './Interfaces/Config';
import IEmblemSymbols from './Interfaces/EmblemSymbols';
import ICache from './Interfaces/Cache';

export default class Datacenter {
  private readonly config: IConfig;

  private readonly cache: ICache;

  private emblemSymbols: IEmblemSymbols[] = [];

  constructor(config: IConfig) {
    this.config = config;
    this.cache = {
      EMBLEM_SYMBOL_BY_ICON_ID: new Map(),
      CANVAS_IMAGE_BY_PATH: new Map(),
      IMAGE_BY_PATH: new Map(),
    };
  }

  public async init(): Promise<void> {
    const emblemSymbolsJsonPath = `${this.config.dataPath}/EmblemSymbols.json`;

    if (!fs.existsSync(emblemSymbolsJsonPath)) {
      throw new Error(`File not found: ${emblemSymbolsJsonPath}`);
    }

    this.emblemSymbols = JSON.parse(await fs.promises.readFile(emblemSymbolsJsonPath, 'utf8'));
  }

  public getConfig(): IConfig {
    return this.config;
  }

  public getEmblemsPath(): string {
    return this.config.emblemsPath;
  }

  public getEmblemSymbols(): IEmblemSymbols[] {
    return this.emblemSymbols;
  }

  public getEmblemSymbolByIconId(iconId: number): IEmblemSymbols | undefined {
    if (this.cache.EMBLEM_SYMBOL_BY_ICON_ID.has(iconId)) {
      return this.cache.EMBLEM_SYMBOL_BY_ICON_ID.get(iconId);
    }

    const eb = this.getEmblemSymbols().find((emblemSymbol) => emblemSymbol.iconId === iconId);
    this.cache.EMBLEM_SYMBOL_BY_ICON_ID.set(iconId, eb);

    return eb;
  }

  public async getCanvasImageByPath(path: string): Promise<canvas.Image | undefined> {
    if (this.cache.CANVAS_IMAGE_BY_PATH.has(path)) {
      return this.cache.CANVAS_IMAGE_BY_PATH.get(path);
    }

    if (!fs.existsSync(path)) {
      return undefined;
    }

    const img = await canvas.loadImage(path);
    this.cache.CANVAS_IMAGE_BY_PATH.set(path, img);

    return img;
  }

  public async getImageByPath(path: string): Promise<Buffer | undefined> {
    if (this.cache.IMAGE_BY_PATH.has(path)) {
      return this.cache.IMAGE_BY_PATH.get(path);
    }

    if (!fs.existsSync(path)) {
      return undefined;
    }

    const img = await fs.promises.readFile(path);

    this.cache.IMAGE_BY_PATH.set(path, img);
    return img;
  }

  public async saveImageByPath(path: string, buffer: Buffer): Promise<void> {
    if (!fs.existsSync(this.config.outputPath)) {
      await fs.promises.mkdir(this.config.outputPath, { recursive: true });
    }

    await fs.promises.writeFile(path, new Uint8Array(buffer));
    this.cache.IMAGE_BY_PATH.set(path, buffer);
  }
}
