import { Loca } from './loca';
import { Rect } from './rect';

export class Char {
  public value!: string;
  public styles: any;
  public glyph!: number;
  public path: any;
  public font: any;
  public rect!: Rect;
  public rd!: Rect;
  public loca!: Loca;
  public scale!: Loca;
  public lineHeight!: number;
  public TN!: number;
}