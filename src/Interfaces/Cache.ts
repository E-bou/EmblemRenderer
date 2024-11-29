import canvas from 'canvas';
import IEmblemSymbols from './EmblemSymbols';

export default interface ICache {
  EMBLEM_SYMBOL_BY_ICON_ID: Map<number, IEmblemSymbols | undefined>;
  CANVAS_IMAGE_BY_PATH: Map<string, canvas.Image>;
  IMAGE_BY_PATH: Map<string, Buffer>;
}
