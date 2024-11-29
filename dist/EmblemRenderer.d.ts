import canvas from 'canvas';
import Datacenter from './Datacenter';
import { EmblemRendererArgs } from './Interfaces/EmblemRenderer';
export default class EmblemRenderer {
    private readonly args;
    private readonly datacenter;
    private readonly symbolScale;
    constructor(args: EmblemRendererArgs, datacenter: Datacenter);
    getSymbolDimensions(symbol: canvas.Image): {
        width: number;
        height: number;
        xOffset: number;
        yOffset: number;
    };
    render(): Promise<Buffer>;
}
