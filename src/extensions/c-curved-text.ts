import { fabric } from 'fabric';
import curved from './curved';
import { Txt } from './curved/external/txt';

declare global {
  namespace fabric {
    interface CurvedTextOptions extends CorjlTextOptions {
      curvedType?: string;
      radius?: number;
      range?: number;
      spacing?: number;
      reverse?: boolean;
      uppercase?: boolean;
      meta?: any;
      warpStyle?: string;
      warpValue?: number;
      warpPerspective?: number;
      warpPerspectiveOther?: number;
    }
  }
}

class CorjlCurvedText extends fabric.IText {
  type = 'curved-text';

  curvedType!: string;

  radius!: number;

  range!: number;

  spacing!: number;

  reverse = false;

  uppercase?: boolean;

  meta: any;

  originalText?: string;

  warpStyle?: string;

  warpValue?: number;

  warpPerspective?: number;

  warpPerspectiveOther?: number;

  // @ts-ignore
  stateProperties = fabric.Object.prototype.cacheProperties.concat('warpStyle', 'warpValue', 'warpPerspective', 'warpPerspectiveOther');

  // @ts-ignore
  cacheProperties = fabric.Object.prototype.cacheProperties.concat('warpStyle', 'warpValue', 'warpPerspective', 'warpPerspectiveOther')

  constructor(text: string, options?: fabric.CurvedTextOptions) {
    super(text, options);
  }

  complexity(): number {
    return super.complexity();
  }

  // @ts-ignore
  initialize(text: string, options?: any) {
    const _options = options || {};
    if (!_options.originalText) {
      this.originalText = text;
      _options.originalText = text;
    }
    this.warpStyle = options?.warpStyle ?? 'warpCircle2'
    this.warpValue = options?.warpValue ?? 0
    this.warpPerspective = options?.warpPerspective ?? 0
    this.warpPerspectiveOther = options?.warpPerspectiveOther ?? 0;
    // @ts-ignore
    super.initialize(text, options);
    if (this.canvas) this.canvas.requestRenderAll();
  }

  setText(text: string) {
    let _text = text;
    if (this.uppercase) {
      _text = text.toLocaleUpperCase();
    }
    this.set('text', _text);
  }

  isReloadText() {
    return true;
  }

  pathToContext(path: any, ctx: any) {
    var c = 0, cmds = path["cmds"], crds = path["crds"];
    for (var j = 0; j < cmds.length; j++) {
      var cmd = cmds[j];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      }
      else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      }
      else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      }
      else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      }
      else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      }
      else if (cmd == "Z") {
        ctx.closePath();
      }
      else if (cmd == "X") {
        ctx.fill();
      }
    }
  }

  // 复写Fabric的方法
  async _renderChar(method: any, ctx: CanvasRenderingContext2D, lineIndex: any, charIndex: any, _char: any) {
    // load font
    ctx.save();
    const font = await curved.load("fonts/Siyuan.ttf");
    const x = this.left || 0;
    const y = this.top || 0;
    let txt = new Txt();
    curved.initTySh(x, y, txt);
    let obj = {
      warpStyle: this.warpStyle,
      warpValue: this.warpValue,
      warpPerspective: this.warpPerspective,
      warpPerspectiveOther: this.warpPerspectiveOther
    }
    curved.onChangeTySh(obj);
    const fonts: any = {};
    fonts[this.fontFamily || 'DejaVuSans'] = font;
    let input = {
      selectionStart: _char.length,
      value: _char
    }
    curved.renderChar(input);
    const { path, rect } = curved.startCurved(fonts);
    if (path && path.b.length > 0) {
      this.width = rect.w;
      this.height = rect.h;
      ctx.translate(-(rect.x + rect.w / 2), -(rect.y + rect.h / 2));
      this.pathToContext({
        crds: path.b,
        cmds: path.J
      }, ctx);
      ctx.restore();
      if (this.canvas) this.canvas.renderAll();
    }
  }

  toObject(propertiesToInclude?: string[]): any {
    return super.toObject([
      'uppercase', 'meta',
      'originalText', 'radius', 'range',
      'spacing', 'reverse', 'curvedType',
      'warpStyle', 'warpValue', 'warpPerspective', 'warpPerspectiveOther'
    ].concat(propertiesToInclude || []));
  }
}


declare global {
  namespace fabric {
    class CJCurvedText extends CorjlCurvedText { }
  }
}

fabric.CJCurvedText = CorjlCurvedText;
fabric.CJCurvedText.fromObject = (object: any, callback: any): any => {
  return <any>fabric.Object._fromObject('CJCurvedText', object, callback, 'text');
};
