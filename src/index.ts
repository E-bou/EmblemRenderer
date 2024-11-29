import IConfig from './Interfaces/Config';
import Datacenter from './Datacenter';
import EmblemRenderer from './EmblemRenderer';
import { EmblemRendererArgs } from './Interfaces/EmblemRenderer';

export default class EmblemRendererApp {
  private readonly config: IConfig;

  public readonly datacenter: Datacenter;

  private isInitialized = false;

  constructor(config: IConfig) {
    this.config = config;
    this.datacenter = new Datacenter(this.config);
  }

  public async init(): Promise<void> {
    await this.datacenter.init();
    this.isInitialized = true;
  }

  public async renderEmblem(args: EmblemRendererArgs): Promise<Buffer> {
    if (!this.isInitialized) {
      await this.init();
    }

    const emblemRenderer = new EmblemRenderer(args, this.datacenter);
    const buffer = await emblemRenderer.render();
    return buffer;
  }
}
