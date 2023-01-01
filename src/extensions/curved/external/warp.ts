import { Path } from './path';
import { Rect } from './rect';

class Warp {
  public color(O: any) {
    var i = O.toString(16);
    while (i.length < 6)
      i = "0" + i;
    return i
  }

  public tC = new Array(10);

  public Bc_U(O: any, i: any, p: any, V: any) {
    var E = [];
    for (var u = 0; u < 4; u++)
      for (var F = 0; F < 4; F++)
        E.push(O + p * F / 3, i + V * u / 3);
    return E
  }

  public Bc_R_(O: any, i: any) {
    var p = O.slice(0);
    for (var V = 0; V < 4; V++)
      for (var E = 0; E < 4; E++) {
        var u = 2 * (V * 4 + E)
          , F = 2 * (E * 4 + (3 - V));
        if (i) {
          var m = u;
          u = F;
          F = m
        }
        p[F] = O[u];
        p[F + 1] = O[u + 1]
      }
    return p
  }
  ;

  /**
   * 根据变形后的网格调整点集坐标
   * @param O 
   * @param i 
   * @param p 
   */
  public apply(O: any, i: any, p: any) {
    var V = p.x
      , E = p.y
      , u = 1 / p.w
      , F = 1 / p.h
      , m = this.tC;
    for (var y = 0; y < i.length; y += 2) {
      // uv坐标
      var z = (i[y] - V) * u
        , _ = (i[y + 1] - E) * F;
      // O为控制点
      this.dW(O, z, _, m);
      i[y] = m[8];
      i[y + 1] = m[9]
    }
  }
  ;

  /**
   * 根据网格变形来计算字体轮廓坐标
   * @param controls 网格坐标
   * @param u 点的x坐标
   * @param v 点的y坐标
   * @param arr 计算结果收集器
   */
  public dW(controls: any, u: any, v: any, arr: any) {
    this.Ki(arr, 0, v);
    this.Ki(arr, 4, u);
    this.il(controls, arr)
  }

  public Ki(arr: any, i: any, p: any) {
    var V = 1 - p;
    arr[i] = V * (V * V);
    arr[i + 1] = 3 * p * (V * V);
    arr[i + 2] = 3 * (p * p) * V;
    arr[i + 3] = p * p * p
  }

  /**
   * @param O controls
   * @param i arr，包含了控制点
   */
  public il(O: any, i: any) {
    var p = 0
      , V = 0
      , E = 0;
    
    E = i[0] * i[4];
    p += O[0] * E;
    V += O[1] * E;

    E = i[0] * i[5];
    p += O[2] * E;
    V += O[3] * E;

    E = i[0] * i[6];
    p += O[4] * E;
    V += O[5] * E;
    E = i[0] * i[7];
    p += O[6] * E;
    V += O[7] * E;
    E = i[1] * i[4];
    p += O[8] * E;
    V += O[9] * E;
    E = i[1] * i[5];
    p += O[10] * E;
    V += O[11] * E;
    E = i[1] * i[6];
    p += O[12] * E;
    V += O[13] * E;
    E = i[1] * i[7];
    p += O[14] * E;
    V += O[15] * E;
    E = i[2] * i[4];
    p += O[16] * E;
    V += O[17] * E;
    E = i[2] * i[5];
    p += O[18] * E;
    V += O[19] * E;
    E = i[2] * i[6];
    p += O[20] * E;
    V += O[21] * E;
    E = i[2] * i[7];
    p += O[22] * E;
    V += O[23] * E;
    E = i[3] * i[4];
    p += O[24] * E;
    V += O[25] * E;
    E = i[3] * i[5];
    p += O[26] * E;
    V += O[27] * E;
    E = i[3] * i[6];
    p += O[28] * E;
    V += O[29] * E;
    E = i[3] * i[7];
    p += O[30] * E;
    V += O[31] * E;
    i[8] = p;
    i[9] = V
  }

  public checkWarpStyle(O: any) {
    var i = O.warpStyle.v.warpStyle;
    if (i == "warpNone")
      return !0;
    else if (i == "warpCustom") {
      var p = !1
        , V = O.customEnvelopeWarp.v.meshPoints.v.arr
        , E = V[0].arr
        , u = V[1].arr;
      for (var F = 0; F < 4; F++)
        for (var m = 0; m < 4; m++) {
          if (Math.abs(E[F] - E[m * 4 + F]) > 1 || Math.abs(u[F * 4] - u[F * 4 + m]) > 1)
            p = !0
        }
      return !p
    } else
      return O.warpValue.v == 0 && O.warpPerspective.v == 0 && O.warpPerspectiveOther.v == 0
  }

  public initContent(rect?: Rect) {
    var ct: any = {
      classID: "warp",
      warpStyle: {
        t: "enum",
        v: {
          warpStyle: "warpNone"
        }
      },
      warpValue: {
        t: "doub",
        v: 0
      },
      warpPerspective: {
        t: "doub",
        v: 0
      },
      warpPerspectiveOther: {
        t: "doub",
        v: 0
      },
      warpRotate: {
        t: "enum",
        v: {
          Ornt: "Hrzn"
        }
      }
    };
    if (rect) {
      ct.bounds = {
        t: "Objc",
        v: {
          classID: "Rctn",
          Top: {
            t: "UntF",
            v: {
              type: "#Pxl",
              val: rect.y
            }
          },
          Left: {
            t: "UntF",
            v: {
              type: "#Pxl",
              val: rect.x
            }
          },
          Btom: {
            t: "UntF",
            v: {
              type: "#Pxl",
              val: rect.y + rect.h
            }
          },
          Rght: {
            t: "UntF",
            v: {
              type: "#Pxl",
              val: rect.x + rect.w
            }
          }
        }
      };
      ct.uOrder = {
        t: "long",
        v: 4
      };
      ct.vOrder = {
        t: "long",
        v: 4
      }
    }
    return ct
  }


  public warpStyle(O: any, rect: Rect) {
    if (rect == null) {
      var p = O.bounds.v
        , V = p.Left.v.val
        , E = p.Rght.v.val
        , u = p.Top.v.val
        , F = p.Btom.v.val;
      rect = new Rect(V, u, E - V, F - u)
    }
    if (rect.check())
      rect.w = rect.h = 1;
    var m = []
      , y = O.warpStyle.v.warpStyle;
    if (y == "warpCustom") {
      var z = O.customEnvelopeWarp.v.meshPoints.v.arr
        , _ = z[0].arr
        , W = z[1].arr;
      for (var G = 0; G < 16; G++)
        m.push(_[G], W[G])
    } else
      m = this.calculatorWarpStyle(rect, y, O.warpRotate.v.Ornt == "Hrzn", O.warpValue.v / 100, O.warpPerspective.v / 100, O.warpPerspectiveOther.v / 100);
    return m
  }
  ;
  /**
   * 
   * @param rect 矩形
   * @param i 类型
   * @param p 方向
   * @param V warpValue
   * @param E 水平弯曲
   * @param u 竖直弯曲
   * @returns 
   */
  public calculatorWarpStyle(rect: Rect, i: any, p: any, V: any, E: any, u: any) {
    var F = this.Bc_U(rect.x, rect.y, rect.w, rect.h);
    if (i == "warpNone")
      return F;
    var m = JSON.parse(JSON.stringify(rect))
      , y = new Path;
    if (!p) {
      y.translate(-rect.x, -rect.y);
      y.rotate(-Math.PI / 2);
      y.translate(rect.h, 0);
      this.mapPathCurves(F, y, F);
      rect = new Rect(0, 0, rect.h, rect.w);
      F = this.Bc_R_(F, !1)
    }
    this.calculatorWarp(F, rect, i, V, E, u);
    if (!p) {
      F = this.Bc_R_(F, !0);
      rect = m;
      y.setPathXY();
      this.mapPathCurves(F, y, F)
    }
    if (V == 0)
      this.Lq_fuW(F, rect, E, u);
    else {
      var y = new Path(1 / rect.w, 0, 0, 1 / rect.h, -rect.x, -rect.y);
      y.translate(-.5, -.5);
      this.mapPathCurves(F, y, F);
      this.Lq_fnj(F, u, E);
      y.setPathXY();
      this.mapPathCurves(F, y, F)
    }
    return F
  }
  ;
  /**
   * @param O 剖分点数组
   * @param rect 矩形
   * @param p 类型
   * @param V warpValue
   * @param E 水平弯曲
   * @param u 竖直弯曲
   */
  public calculatorWarp(O: any, rect: Rect, p: any, V: any, E: any, u: any) {
    for (var F = 0; F < 4; F++) {
      for (var m = 0; m < 4; m++) {
        var y = 2 * (4 * F + m)
          , z = O[y] - rect.x
          , _ = O[y + 1] - rect.y
          , W = z
          , G = _;
        if (V != 0) {
          // 矩形中心坐标
          var J = rect.w / 2
            , v = rect.h / 2;
          // 相对中心的坐标
          W -= J;
          G -= v;
          var N = Math.abs(V);
          var T = Math.tan((1 - N) * Math.PI / 2);
          var b = Math.sqrt(T * T + 1);
          var a = J * b;
          var g = Math.atan2(1, T);
          var K = Math.cos(g);
          var U = Math.sin(g);
          var x = J * b + rect.h;
          var j = W
            , D = W
            , r = -v
            , P = v
            // W为距矩形中心的水平距离，L的量纲是角度
            , L = W / J * g
            // L = -PI / 2 
            , Y = (4 - K) * (1 / 3)
            // Y = 4 / 3
            , $ = (1 - K) * (3 - K) / (3 * U)
            // $ = 1
            , e = -T * J + Y * a;
            // e = 2 * w / 3
          if (p === 'warpCircle2') {
            j = Math.sin(L) * x;
            D = Math.sin(L) * a;
            r = a + v - x * Math.cos(L)
            P = a + v - a * Math.cos(L);
            if (m === 1 || m === 2) {
              var dd = 2 * Math.sin(g) / (1 + 2 * Math.cos(g))
              j = (m === 1 ? -1 : 1) * (x * dd / 2)
              D = (m === 1 ? -1 : 1) * (a * dd / 2)
              r = v + a - x * (Math.cos(g) +  Math.sin(g) * dd)
              P = v + a - a * (Math.cos(g) +  Math.sin(g) * dd)
            }
          }
          if (p == "warpCircle") {
            j = Math.sin(L) * x;
            r = (T * J - Math.cos(g) * x + v);
            D = Math.sin(L) * a;
            P = (T * J - Math.cos(g) * a + v);
            if (m == 1 || m == 2) {
              j = m == 1 ? (-$ * x) : ($ * x);
              D = m == 1 ? (-$ * a) : ($ * a);
              r = (T * J + v - Y * x);
              P = (T * J + v - Y * a);
            }
            // if (V < 0) {
            //   var o = j;
            //   j = D;
            //   D = o;
            //   o = r;
            //   r = -P;
            //   P = -o
            // }
          }
          if (p == "warpArc") {
            j = Math.sin(L) * x;
            r = T * J - Math.cos(g) * x + v;
            D = Math.sin(L) * a;
            P = T * J - Math.cos(g) * a + v;
            if (m == 1 || m == 2) {
              j = m == 1 ? -$ * x : $ * x;
              D = m == 1 ? -$ * a : $ * a;
              r = T * J + v - Y * x;
              P = T * J + v - Y * a
            }
            if (V < 0) {
              var o = j;
              j = D;
              D = o;
              o = r;
              r = -P;
              P = -o
            }
          }
          if (p == "warpArcLower") {
            if (m == 1 || m == 2) {
              D = m == 1 ? -$ * a : $ * a;
              P = V < 0 ? v - e : v + e
            }
          }
          if (p == "warpArcUpper" || p == "warpArch" || p == "warpBulge") {
            if (m == 1 || m == 2) {
              j = m == 1 ? -$ * a : $ * a;
              r = V < 0 ? -v + e : -v - e
            }
            if (p == "warpArch") {
              D = j;
              P = r + 2 * v
            }
            if (p == "warpBulge") {
              D = j;
              P = -r
            }
          }
          if (p == "warpFish" || p == "warpFlag" || p == "warpWave") {
            if (m == 1) {
              r -= V * 4 * v;
              P += V * 4 * v
            }
            if (m == 2) {
              r += V * 4 * v;
              P -= V * 4 * v
            }
            if (p == "warpFlag" || p == "warpWave")
              r = P - 2 * v
          }
          if (p == "warpRise") {
            if (m < 2)
              r = -v + V * v * 4;
            P = r + 2 * v
          }
          var d = (G + v) / rect.h;
          // 比例
          W = j + d * (D - j)
          G = r + d * (P - r);
          if (p == "warpWave") {
            if (F == 0)
              G = -v;
            if (F == 3)
              G = v;
            if (F == 1 || F == 2)
              G = 2 * v * (F / 3 - .5) * (1 / 3) + G * (2 / 3)
          }
          if (p == "warpFisheye") {
            if ((F == 1 || F == 2) && (m == 1 || m == 2)) {
              W = W + 4 * W * V;
              G = G + 4 * G * V
            }
          }
          if (p == "warpInflate") {
            var Z = 2 / 3;
            if ((F == 1 || F == 2) && (m == 1 || m == 2)) {
              W = W + .5 * W * V;
              G = G + .5 * G * V
            } else if (F == 1 || F == 2)
              W = W + Z * W * V;
            else if (m == 1 || m == 2)
              G = G + Z * G * V
          }
          if (p == "warpSqueeze") {
            var Z = 2 / 3;
            if ((F == 1 || F == 2) && (m == 1 || m == 2)) {
              if (V > 0)
                W = W - Z * W * V;
              else
                G = G + Z * G * V
            } else if (F == 1 || F == 2)
              W = W - Z * W * V;
            else if (m == 1 || m == 2)
              G = G + Z * G * V
          }
          if (p == "warpTwist") {
            if ((F == 1 || F == 2) && (m == 1 || m == 2)) {
              var I = V * Math.PI / 2
                , b = 1 + Math.abs(V) * 2
                , S = W * Math.cos(I) - G * Math.sin(I)
                , H = W * Math.sin(I) + G * Math.cos(I);
              W = S * b;
              G = H * b
            }
          }
          if (p == "warpShellLower" || p == "warpShellUpper") {
            if (p == "warpShellUpper") {
              F = 3 - F;
              G = -G
            }
            if (F > 2 || F == 2 && (m == 0 || m == 3)) {
              if (V > 0) {
                var q = a + F / 3 * 2 * v;
                W = Math.sin(L) * q;
                G = -T * J - v + Math.cos(L) * q;
                if (m == 1 || m == 2) {
                  W = m == 1 ? -$ * q : $ * q;
                  G = -T * J - v + Y * q
                }
              } else {
                if ((m == 1 || m == 2) && F == 3) {
                  W = m == 1 ? -$ * a : $ * a;
                  G = T * J - Y * a + v
                } else if (F == 2) {
                  G = v - v * (2 / 3) * Math.cos(L);
                  W = W + v * (2 / 3) * Math.sin(L)
                }
              }
            }
            if (p == "warpShellUpper") {
              F = 3 - F;
              G = -G
            }
          }
          W += J;
          G += v
        }
        z = W,
        _ = G;
        O[y] = z + rect.x;
        O[y + 1] = _ + rect.y
      }
    }
  }
  
  /**
   * 
   * @param O 网格
   * @param i 竖直扭曲
   * @param p 水平扭曲
   */
  public Lq_fnj(O: any, i: any, p: any) {
    var V = [];
    for (var E = 0; E < 4; E++)
      V.push(1 - p + E / 3 * 2 * p);
    var u = [];
    for (var E = 0; E < 4; E++)
      u.push(1 - i + E / 3 * 2 * i);
    var F = [0, 0, 0, 0]
      , m = [0, 0, 0, 0];
    for (var y = 0; y < 4; y++)
      for (var E = 0; E < 4; E++) {
        var z = 2 * (4 * y + E)
          , _ = O[z]
          , W = O[z + 1];
        F[E] += _ / 4;
        m[E] += W / 4
      }
    for (var y = 0; y < 4; y++)
      for (var E = 0; E < 4; E++) {
        var G = V[E]
          , z = 2 * (4 * y + E)
          , _ = O[z]
          , W = O[z + 1]
          , J = F[E]
          , v = m[E];
        O[z] = J + G * (_ - J);
        O[z + 1] = v + G * (W - v)
      }
    var j = O.slice(0);
    for (var y = 0; y < 4; y++)
      for (var E = 1; E < 3; E++) {
        var z = 2 * (4 * y + E)
          , _ = O[z]
          , W = O[z + 1]
          , D = z + (E == 1 ? -2 : 2)
          , r = O[D]
          , P = O[D + 1];
        O[z] = _ - r;
        O[z + 1] = W - P
      }
    var N = O[0]
      , T = O[1]
      , x = O[24]
      , K = O[25]
      , U = O[6]
      , Y = O[7]
      , Z = O[30]
      , I = O[31]
      , S = U - N
      , H = Y - T
      , t = Z - x
      , X = I - K;
    for (var y = 0; y < 4; y++) {
      var NQ = 2 * y * 4
        , NA = 0
        , NH = 0
        , Nq = y == 1 ? .33 : .66
        , NL = 1 - Nq;
      if (y == 0) {
        NA = S;
        NH = H
      }
      if (y == 1) {
        NA = NL * S + Nq * -t;
        NH = NL * H + Nq * -X
      }
      if (y == 2) {
        NA = NL * S + Nq * -t;
        NH = NL * H + Nq * -X
      }
      if (y == 3) {
        NA = -t;
        NH = -X
      }
      O[NQ] = O[NQ] + NA / 2;
      O[NQ + 1] = O[NQ + 1] + NH / 2;
      O[NQ + 6] = O[NQ + 6] - NA / 2;
      O[NQ + 7] = O[NQ + 7] - NH / 2
    }
    for (var y = 0; y < 4; y++)
      for (var E = 1; E < 3; E++) {
        var z = 2 * (4 * y + E)
          , _ = O[z]
          , W = O[z + 1]
          , D = z + (E == 1 ? -2 : 2)
          , r = O[D]
          , P = O[D + 1]
          , G = 2 * y / 3;
        O[z] = r + G * _;
        O[z + 1] = P + G * W
      }
    for (var y = 1; y < 3; y++)
      for (var E = 1; E < 3; E++) {
        var z = 2 * (4 * y + E)
          , _ = O[z]
          , W = O[z + 1]
          , Ne = y == 1 ? -8 : -16
          , Nh = y == 1 ? 16 : 8
          , fl = O[z + Ne]
          , NI = O[z + Ne + 1]
          , Nl = O[z + Nh]
          , NC = O[z + Nh + 1]
          , G = y / 3;
        _ = (1 - G) * fl + G * Nl;
        W = (1 - G) * NI + G * NC;
        O[z] = _;
        O[z + 1] = W
      }
    this.p_LV(j, O, O, i)
  }
  ;

  public concat(O: any, i: any, p: Path) {
    if (p == null)
      p = new Path;
    for (var V = 0; V < i.b.length; V += 2) {
      var E = i.b[V]
        , u = i.b[V + 1];
      O.b.push(E * p.x + u * p.x1 + p.x2);
      O.b.push(E * p.y + u * p.y1 + p.y2)
    }
    for (var V = 0; V < i.J.length; V++)
      O.J.push(i.J[V])
  }
  ;
  public convertBezierCurveTo(O: any) {
    var i = O.b
      , p = []
      , V = []
      , E = 0
      , u = 0
      , F = 0
      , m = 0
      , y = 0
      , z = 0
      , _ = 0
      , W = 0
      , G = 0;
    for (var J = 0; J < O.J.length; J++) {
      var v = O.J[J];
      if (v == "M") {
        u = i[E];
        F = i[E + 1];
        E += 2;
        V.push(v);
        p.push(u, F)
      } else if (v == "C") {
        m = i[E];
        y = i[E + 1];
        z = i[E + 2];
        _ = i[E + 3];
        W = i[E + 4];
        G = i[E + 5];
        E += 6;
        V.push(v);
        p.push(m, y, z, _, W, G);
        u = W;
        F = G
      } else if (v == "Q") {
        m = i[E];
        y = i[E + 1];
        z = i[E + 2];
        _ = i[E + 3];
        E += 4;
        var j = m - u
          , D = y - F
          , r = z - m
          , P = _ - y;
        V.push("C");
        p.push(u + 2 / 3 * j, F + 2 / 3 * D, m + 1 / 3 * r, y + 1 / 3 * P, z, _);
        u = z;
        F = _
      } else if (v == "L") {
        m = i[E];
        y = i[E + 1];
        E += 2;
        var N = m - u
          , T = y - F;
        V.push("C");
        p.push(u, F, m, y, m, y);
        u = m;
        F = y
      } else
        V.push(v)
    }
    return {
      J: V,
      b: p
    }
  }
  public getRectOfCrds(crds: any, i?: any, p?: any) {
    if (!i)
      i = 0;
    if (!p)
      p = crds.length;
    var V = 99999999999
      , E = -V
      , u = 99999999999
      , F = -u;
    for (var m = i; m < p; m += 2) {
      var y = crds[m]
        , z = crds[m + 1];
      V = Math.min(V, y);
      u = Math.min(u, z);
      E = Math.max(E, y);
      F = Math.max(F, z)
    }
    return new Rect(V, u, E - V, F - u)
  }

  public bezierCurveTo(O: any, i: any) {
    var p = O.b
      , V = []
      , E = []
      , u = 0
      , F = 0
      , m = 0
      , y = 0
      , z = 0
      , _ = 0
      , W = 0
      , G = 0
      , J = 0;
    for (var v = 0; v < O.J.length; v++) {
      var j = O.J[v];
      if (j == "M") {
        F = p[u];
        m = p[u + 1];
        u += 2;
        E.push(j);
        V.push(F, m)
      } else if (j == "C") {
        y = p[u];
        z = p[u + 1];
        _ = p[u + 2];
        W = p[u + 3];
        G = p[u + 4];
        J = p[u + 5];
        u += 6;
        this.calculatorBezierCurveTo(F, m, y, z, _, W, G, J, i, E, V, 0);
        F = G;
        m = J
      } else
        E.push(j)
    }
    return {
      J: E,
      b: V
    }
  }
  public calculatorBezierCurveTo(O: any, i: any, p: any, V: any, E: any, u: any, F: any, m: any, y: any, z: any, _: any, W: any) {
    var G = Math.sqrt((F - O) * (F - O) + (m - i) * (m - i))
      , J = Math.sqrt((F - E) * (F - E) + (m - u) * (m - u)) + Math.sqrt((E - p) * (E - p) + (u - V) * (u - V)) + Math.sqrt((p - O) * (p - O) + (V - i) * (V - i))
      , v = (G + J) / 2;
    if (v <= y) {
      z.push("C");
      _.push(p, V, E, u, F, m)
    } else {
      var j = 0
        , D = 0
        , r = 0
        , P = 0
        , N = 0
        , T = 0
        , b = 0
        , g = 0
        , L = 0
        , a = 0
        , x = 0
        , K = 0
        , U = 0;
      D = (O + p) / 2;
      r = (i + V) / 2;
      P = (p + E) / 2;
      N = (V + u) / 2;
      T = (E + F) / 2;
      b = (u + m) / 2;
      g = (D + P) / 2;
      L = (r + N) / 2;
      a = (P + T) / 2;
      x = (N + b) / 2;
      K = (g + a) / 2;
      U = (L + x) / 2;
      this.calculatorBezierCurveTo(O, i, D, r, g, L, K, U, y, z, _, W + 1);
      this.calculatorBezierCurveTo(K, U, a, x, T, b, F, m, y, z, _, W + 1)
    }
  }

  public mapPathCurves(O: any, i: Path, p: any) {
    for (var V = 0; V < O.length; V += 2) {
      var E = O[V]
        , u = O[V + 1];
      p[V] = E * i.x + u * i.x1 + i.x2;
      p[V + 1] = E * i.y + u * i.y1 + i.y2
    }
  }
  ;

  public p_LV(O: any, i: any, p: any, V: any) {
    for (var E = 0; E < O.length; E += 2) {
      var u = O[E]
        , F = O[E + 1]
        , m = i[E]
        , y = i[E + 1];
      p[E] = u + (m - u) * V;
      p[E + 1] = F + (y - F) * V
    }
  }

  public getRect(rect: Rect) {
    if (rect.check())
      return new Rect(Math.floor(rect.x), Math.floor(rect.y), Math.ceil(rect.w), Math.ceil(rect.h));
    var x = Math.floor(rect.x)
      , y = Math.floor(rect.y)
      , w = Math.ceil(rect.x + rect.w)
      , h = Math.ceil(rect.y + rect.h);
    return new Rect(x, y, w - x, h - y)
  }

  public Lq_fuW(O: any, i: any, p: any, V: any) {
    for (var E = 0; E < O.length; E += 2) {
      var u = O[E]
        , F = O[E + 1]
        , m = (u - i.x) / i.w
        , y = (F - i.y) / i.h
        , z = (1 - p) / 2
        , _ = 1 - z
        , W = z + m * (_ - z);
      y = .5 + (y - .5) * W * 2;
      var G = (1 - V) / 2
        , J = 1 - G
        , v = G + y * (J - G);
      m = .5 + (m - .5) * v * 2;
      u = i.x + m * i.w;
      F = i.y + y * i.h;
      O[E] = u;
      O[E + 1] = F
    }
  }

  public colorType(O: any) {
    var i, p = O.classID;
    if (p == "RGBC")
      i = {
        j: O.Rd.v,
        a: O.Grn.v,
        Z: O.Bl.v
      };
    else if (p == "HSBC") {
      i = this.colorHSBC(O.H.v.val / 360, O.Strt.v / 100, O.Brgh.v / 100);
      i.j *= 255;
      i.a *= 255;
      i.Z *= 255
    } else if (p == "CMYC") {
      var V = 100 - O.Cyn.v
        , E = 100 - O.Mgnt.v
        , u = 100 - O.Ylw.v
        , F = 100 - O.Blck.v
        , m = 255 * V * F * 1e-4
        , y = 255 * (.2 * V + .8 * E) * F * 1e-4
        , z = 255 * (.2 * E + .8 * u) * F * 1e-4;
      i = {
        j: m,
        a: y,
        Z: z
      }
    } else if (p == "Grsc")
      i = {
        j: 255 - O.Gry.v,
        a: 255 - O.Gry.v,
        Z: 255 - O.Gry.v
      };
    else
      console.log(O);
    return i
  }

  public colorHSBC(O: any, i: any, p: any) {
    var V, E, u, F, m, y, z, _;
    F = Math.floor(O * 6);
    m = O * 6 - F;
    y = p * (1 - i);
    z = p * (1 - m * i);
    _ = p * (1 - (1 - m) * i);
    switch (F % 6) {
      case 0:
        V = p,
          E = _,
          u = y;
        break;
      case 1:
        V = z,
          E = p,
          u = y;
        break;
      case 2:
        V = y,
          E = p,
          u = _;
        break;
      case 3:
        V = y,
          E = z,
          u = p;
        break;
      case 4:
        V = _,
          E = y,
          u = p;
        break;
      case 5:
        V = p,
          E = y,
          u = z;
        break
    }
    return {
      j: V,
      a: E,
      Z: u
    }
  }

  public U(O: any, i?: any) {
    if (!i)
      i = !1;
    if (!i)
      O = this.fnF(O);
    try {
      var p = new Uint8Array(O)
    } catch (Ot) {
      // alert("Not enough RAM! (need " + Math.round(O / (1 << 20)) + " MB)", 7e3);
      throw Ot
    }
    return p
  }

  public fnF(O: any) {
    return O + (O % 4 == 0 ? 0 : 4 - O % 4)
  }
}

export default new Warp();