import IConfig from './Interfaces/Config';
import Datacenter from './Datacenter';
import { EmblemRendererArgs } from './Interfaces/EmblemRenderer';
export default class EmblemRendererApp {
    private readonly config;
    readonly datacenter: Datacenter;
    private isInitialized;
    constructor(config: IConfig);
    init(): Promise<void>;
    renderEmblem(args: EmblemRendererArgs): Promise<Buffer>;
}
