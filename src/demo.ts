import { Typr, TyprU } from "typr-ts";

class DemoHandler {
  public font: any;
  public off = 0;
  public num = 100;
  public gid = 0;
  public uncd = null;

  public start() {
    //load("Cabin-Bold.otf",fontLoaded);
    this.load(
      require("./assets/fonts/LiberationSans-Bold.ttf"),
      this.fontLoaded
    );

    const node = document.body;
    node.addEventListener("drop", this.onDrop.bind(this), false);
    node.addEventListener("dragenter", this.cancel.bind(this), false);
    node.addEventListener("dragleave", this.cancel.bind(this), false);
    node.addEventListener("dragover", this.cancel.bind(this), false);
  }

  public load(path: any, resp: any) {
    const request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = function(e: any) {
      resp(e.target.response);
    };
    request.send();
  }

  public cancel(e: any) {
    e.stopPropagation();
    e.preventDefault();
  }

  public onDrop(e: any) {
    this.cancel(e);
    const r = new FileReader();
    r.onload = (e: any) => {
      this.fontLoaded(e.target.result);
    };
    r.readAsArrayBuffer(e.dataTransfer.files[0]);
  }

  public glyphCnt() {
    return this.font.maxp.numGlyphs;
  }

  public fontLoaded = (resp: any) => {
    this.font = Typr.parse(resp);
    // @ts-ignore
    this.uncd = new Array(this.glyphCnt());
    for (let i = 0; i < 130000; i++) {
      let gid = TyprU.codeToGlyph(this.font, i);
      if (gid == 0) continue;
      // @ts-ignore
      if (this.uncd[gid] == null) this.uncd[gid] = [i];
      // @ts-ignore
      else this.uncd[gid].push(i);
    }

    this.off = 0;
    this.gid = 0;

    this.drawGlyphs();
    this.drawGlyph();
    this.drawWord();
  };

  public drawGlyphs() {
    const cont = document.getElementById("glyphcont");
    // @ts-ignore
    cont.innerHTML = "";

    const cnv = document.createElement("canvas");
    cnv.width = Math.floor(this.getDPR() * 40);
    cnv.height = Math.floor(this.getDPR() * 60);

    const ctx = cnv.getContext("2d");
    // @ts-ignore
    ctx.font = "20px sans";

    let lim = Math.min(this.off + this.num, this.glyphCnt());
    let scale = (32 * this.getDPR()) / this.font.head.unitsPerEm;
    for (let i: any = this.off; i < lim; i++) {
      let path = TyprU.glyphToPath(this.font, i);

      cnv.width = cnv.width;
      //ctx.scale(getDPR(), getDPR());
      // @ts-ignore
      ctx.translate(10 * this.getDPR(), Math.round(36 * this.getDPR()));
      // @ts-ignore
      ctx.fillStyle = "#ff0000";
      // @ts-ignore
      ctx.fillRect(0, 0, cnv.width, 1);
      // @ts-ignore
      ctx.fillStyle = "#333333";
      // @ts-ignore
      ctx.fillText(i, 0, 20);
      // @ts-ignore
      ctx.scale(scale, -scale);
      TyprU.pathToContext(path, ctx);
      // @ts-ignore
      ctx.fill();

      let img: any = document.createElement("img");
      img.setAttribute(
        "style",
        "width:" +
          cnv.width / this.getDPR() +
          "px; height:" +
          cnv.height / this.getDPR() +
          "px"
      );
      img.gid = i;
      img.onclick = this.glyphClick.bind(this);
      img.src = cnv.toDataURL();
      // @ts-ignore
      cont.appendChild(img);
    }
  }
  public drawGlyph() {
    const cnv: any = document.getElementById("maincanvas");
    cnv.width = Math.floor(this.getDPR() * 400);
    cnv.height = Math.floor(this.getDPR() * 400);
    this.scaleCnv(cnv);

    const ctx = cnv.getContext("2d");
    ctx.font = "20px sans";

    let scale = (340 * this.getDPR()) / this.font.head.unitsPerEm;

    let path = TyprU.glyphToPath(this.font, this.gid);

    cnv.width = cnv.width;
    ctx.translate(50, 320);

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, cnv.width, 1);
    ctx.fillRect(0, -Math.round(this.font.hhea.ascender * scale), cnv.width, 1);
    ctx.fillRect(
      0,
      -Math.round(this.font.hhea.descender * scale),
      cnv.width,
      1
    );

    ctx.scale(scale, -scale);

    ctx.lineWidth = 5 / scale;
    ctx.strokeStyle = "#003377";
    ctx.fillStyle = "#999999";
    TyprU.pathToContext(path, ctx);
    ctx.fill();
    ctx.stroke();

    this.drawOutline(path, ctx);

    let props = document.getElementById("properties");

    let hex = "---",
      str = "---";
    // @ts-ignore
    let ucode = this.uncd[this.gid];
    if (ucode != null) {
      hex = ucode[0].toString(16);
      while (hex.length < 4) hex = "0" + hex;
      str = String["fromCodePoint"](ucode[0]);
    }
    // @ts-ignore
    props.innerHTML =
      "Unicode: #" +
      hex +
      ' <span style="font-size:2em; margin-left:1em;"> ' +
      str +
      "</span>";

    let tarea = document.getElementById("textarea");
    // @ts-ignore
    tarea.innerHTML =
      '{\n"cmds" : \n' +
      JSON.stringify(path.cmds) +
      ',\n\n"crds" : \n' +
      JSON.stringify(path.crds) +
      "\n}";
  }
  public drawWord(e?: any) {
    let cnv: any = document.getElementById("wordcanvas");
    cnv.width = Math.floor(800 * this.getDPR());
    cnv.height = Math.floor(130 * this.getDPR());
    this.scaleCnv(cnv);
    let ctx = cnv.getContext("2d");

    let scale = (80 * this.getDPR()) / this.font.head.unitsPerEm;

    let gls = TyprU.stringToGlyphs(
      this.font,
      (document.getElementById("word") as any).value
    );
    let path = TyprU.glyphsToPath(this.font, gls, "#333333");

    //var spath = document.getElementById("svgp");  spath.setAttribute("d", Typr.U.pathToSVG(path));

    cnv.width = cnv.width;
    ctx.translate(4, 100);

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, cnv.width, 1);
    ctx.fillRect(0, -Math.round(this.font.hhea.ascender * scale), cnv.width, 1);
    ctx.fillRect(
      0,
      -Math.round(this.font.hhea.descender * scale),
      cnv.width,
      1
    );

    ctx.scale(scale, -scale);

    TyprU.pathToContext(path, ctx); // setting color and calling fill() already in path
  }
  public drawOutline(path: any, ctx: any) {
    let ci = 0,
      x = 0,
      y = 0;
    let crds = path.crds;
    let w = 0.0025 * this.font.head.unitsPerEm;

    ctx.lineWidth = w;
    ctx.strokeStyle = "#00ffff";
    TyprU.pathToContext(path, ctx);

    ctx.stroke();

    let ss = w * 4;
    ctx.fillStyle = "#ff0055";
    for (let i = 0; i < crds.length; i += 2)
      ctx.fillRect(crds[i] - ss, crds[i + 1] - ss, 2 * ss, 2 * ss);
  }

  public drawPrev() {
    if (this.off > 0) {
      this.off = this.off - this.num;
      this.drawGlyphs();
    }
  }
  public drawNext() {
    if (this.off + this.num < this.glyphCnt()) {
      this.off = this.off + this.num;
      this.drawGlyphs();
    }
  }
  public glyphClick(e: any) {
    this.gid = e.target.gid;
    this.drawGlyph();
  }
  public getDPR() {
    return window["devicePixelRatio"] || 1;
  }
  public scaleCnv(cnv: any) {
    cnv.setAttribute(
      "style",
      "width:" +
        cnv.width / this.getDPR() +
        "px; height:" +
        cnv.height / this.getDPR() +
        "px"
    );
  }
}

export default new DemoHandler();

(<any>window).Demo = new DemoHandler();
