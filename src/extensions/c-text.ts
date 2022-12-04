import { fabric } from "fabric";

const CText = fabric.util.createClass(fabric.IText, {
  type: 'c-text',
  // @ts-ignore
  stateProperties: fabric.Object.prototype.stateProperties.concat(
    'uppercase', 'curved', 'curvedType', 'degrees'
  ),
  originalText: '',
  uppercase: false,
  meta: '',
  curved: false,
  curvedType: null,
  degrees: 0,
  // @ts-ignore
  cacheProperties: fabric.Object.prototype.cacheProperties.concat(
    'uppercase', 'curved', 'curvedType', 'degrees'
  ),
  initialize(text: string, options?: fabric.CorjlTextOptions) {
    const _options = options || {};
    if (!_options.originalText) {
      this.originalText = text;
      _options.originalText = text;
    }
    this.callSuper('initialize', text, _options);
  },

  _uppercase(text: string) {
    var active = this.canvas.getActiveObject();
    if (!active) return;
    
    if (active.isEditing) {
      active.hiddenTextarea.value = this.uppercase ? active.hiddenTextarea.value.toLocaleUpperCase(): text;
      active.updateFromTextArea();
      this.canvas.requestRenderAll();
      return;
    }
    active.text = this.uppercase ? text.toLocaleUpperCase() : text;
    this.canvas.requestRenderAll();
  },


  _setCurvedText(ctx: CanvasRenderingContext2D) {
    this.set('path', null);
    this.set('charSpacing', 0);
    if (this.curved) {
      var active = this.canvas.getActiveObject();
      if (!active) return;
      // this.objectCaching = false
      const rect = this.getBoundingRect();
      const box = {
        x: rect?.left,
        y: rect?.top,
        w: rect?.width,
        h: rect?.height
      }

      const textPath = this._caculatePathCurve(box, this.curvedType || 'circle', this.degrees || 90, this.fontSize);
      const path = new fabric.Path(`${textPath}`);
      // @ts-ignore
      // path.left += 100;
      // path.segmentsInfo[6].x += 10;
      // @ts-ignore
      path.width += this.fontSize
      path.height += this.fontSize
      // @ts-ignore
      this.set('path', path);
      const charSpacing = this._spacingOperation(ctx, this.curvedType || 'circle', this.fontSize);
      this.set('charSpacing', charSpacing);
      
      this.canvas.requestRenderAll();
    }
  },

  _caculatePathCurve(box: any, curvedType: string, degrees = 0, fontSize = 24) {
    let d = [];
    if (String(degrees) === '-') {
      degrees = 0;
    }

    degrees = Number(degrees);
    if (degrees === 0) {
      degrees = 1;
    }
    let w = box.w;
    const h = box.h;
    let x = box.x;
    let y = box.y;
    let r = w;
    switch (curvedType) {
      case 'circle':
        x = x + (w / 2);
        y = y + (h / 2);
        w = w - fontSize;
        r = (w / 2);
        d = [
          'M ' + x + ', ' + y,
          'm -' + r + ', ' + '0',
          'a ' + r + ',' + r + ' 0 0,1 ' + w + ',0',
          'a ' + r + ',' + r + ' 0 0,1 -' + w + ',0'
        ];
        break;
      default:
        // eslint-disable-next-line no-case-declarations
        const up = degrees < 0 ? 0 : 1;
        r = Math.sqrt(
          Math.pow(w / 2, 2) + Math.pow(Math.tan(this._toRadians(90 - Math.abs(degrees) / 2)) * (w / 2), 2)
        );
        y = y + (box.h / 2) + degrees;
        d = [
          'm ' + x + ', ' + y,
          'a ' + r + ',' + r + ' 0 0,' + up + ' ' + w + ',0'
        ];
        break;
    }
    return d.join(' ');
  },

  _toRadians(angle: number) {
    return angle * (Math.PI / 180);
  },

  _spacingOperation(ctx: CanvasRenderingContext2D, curvedType: string, fontSize = 24) {
    // @ts-ignore
    const pathdata: any = this.path;
    let circum;
    let char: any;
    if (curvedType === 'circle') {
      circum = pathdata.segmentsInfo[6].length;
      char = this.text?.length;
    } else {
      circum = pathdata.segmentsInfo[3] ? pathdata.segmentsInfo[3].length : pathdata.segmentsInfo[2].length;
      // @ts-ignore
      char = this.text?.length - 1;
    }
    let spacing = 1;
    ctx.font = fontSize + 'px ' + this.fontFamily;
    // @ts-ignore
    const textWidth = ctx.measureText(this.text).width + (char);
    const diff = circum - textWidth;
    spacing += diff / char;
    return Math.abs(spacing) * 1000 / fontSize
  },

  _render(ctx: CanvasRenderingContext2D) {
    this._uppercase(this.originalText || '');
    this._setCurvedText(ctx);
    this.callSuper('_render', ctx);
    
  },
});

CText.fromObject = function (object: any, callback: any) {
  return fabric.Object._fromObject("CText", object, callback, "text");
};

fabric.CText = CText;