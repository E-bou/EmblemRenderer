import crypto from 'crypto';
import canvas from 'canvas';
import Datacenter from './Datacenter';
import { EmblemRendererArgs } from './Interfaces/EmblemRenderer';

export default class EmblemRenderer {
  private readonly args: EmblemRendererArgs;

  private readonly datacenter: Datacenter;

  private readonly symbolScale = 0.60;

  constructor(args: EmblemRendererArgs, datacenter: Datacenter) {
    this.args = args;
    this.datacenter = datacenter;
  }

  public getSymbolDimensions(symbol: canvas.Image) {
    return {
      width: symbol.width * this.symbolScale,
      height: symbol.height * this.symbolScale,
      xOffset: (symbol.width - symbol.width * this.symbolScale) / 2,
      yOffset: (symbol.height - symbol.height * this.symbolScale) / 2,
    };
  }

  public async render(): Promise<Buffer> {
    const shasum = crypto.createHash('sha1');
    shasum.update(`${this.args.emblemType}_${this.args.symbolIconId}_${this.args.symbolColor}_${this.args.backgroundIconId}_${this.args.backgroundColor}`);
    const hash = shasum.digest('hex');
    const path = `${this.datacenter.getConfig().outputPath}/${hash}2.png`;

    const cache = await this.datacenter.getImageByPath(path);

    if (cache) {
      return cache;
    }

    const [outline, symbol, backContent] = await Promise.all([
      this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/outline${this.args.emblemType}/${this.args.backgroundIconId}.png`),
      this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/up/${this.args.symbolIconId}.png`),
      this.datacenter.getCanvasImageByPath(`${this.datacenter.getEmblemsPath()}/backcontent/${this.args.backgroundIconId}.png`),
    ]);

    if (!outline || !symbol || !backContent) {
      throw new Error('Failed to load required images');
    }

    const img = canvas.createCanvas(outline.width, outline.height);
    const ctx = img.getContext('2d');

    const coloredBackContent = canvas.createCanvas(backContent.width, backContent.height);
    const backContentCtx = coloredBackContent.getContext('2d');

    backContentCtx.drawImage(backContent, 0, 0);
    backContentCtx.globalCompositeOperation = 'source-in';
    backContentCtx.fillStyle = this.args.backgroundColor;
    backContentCtx.fillRect(0, 0, backContent.width, backContent.height);

    ctx.drawImage(coloredBackContent, 0, 0);
    ctx.drawImage(outline, 0, 0);

    ctx.globalCompositeOperation = 'source-over';
    const coloredSymbol = canvas.createCanvas(symbol.width, symbol.height);
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
  }
}
