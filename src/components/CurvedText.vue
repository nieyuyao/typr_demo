<template>
  <div>
    <!-- <input type="checkbox" name="" id="" @change="changeColor" /> -->
    <label for="">Uppercase</label>
    <input type="checkbox" v-model="uppercase" @change="changeUppercase" />
    <label for="Curved text">Curved text</label>
    <input type="checkbox" v-model="curved" @change="changeCurvedText" />
    <input type="range" id="volume" name="volume" min="-180" max="180" v-model="degrees" @change="changeCurvedText" />
    <canvas id="canvas" width="800" height="800"></canvas>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from "vue";
import { fabric } from "fabric";
import { CorjlFabricCanvas } from "@/extensions";
import TyprVue from "./Typr.vue";
import { Typr, TyprU } from "typr-ts";

export default {
  setup() {
    let _canvas: CorjlFabricCanvas | null = null;
    const canvas = computed<CorjlFabricCanvas>(() => {
      if (!_canvas) {
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerStrokeColor = "#0066ff";
        _canvas = new CorjlFabricCanvas("canvas", {
          preserveObjectStacking: true,
          fireRightClick: true,
          stopContextMenu: true,
          perPixelTargetFind: true,
          targetFindTolerance: 10,
        });
      }
      return _canvas as CorjlFabricCanvas;
    });
    const uppercase = ref(false);
    const curved = ref(false);
    const degrees = ref(180);

    const changeColor = () => {
      const obj =  canvas.value.getActiveObject();
      if(obj) {
        obj.set('fill', 'red')
      }
      canvas.value.requestRenderAll();
    }

    const changeUppercase = () => {
      const obj =  canvas.value.getActiveObject();
      if(obj) {
        // @ts-ignore
        obj.set('uppercase', uppercase.value)
      }
      canvas.value.requestRenderAll();
    }
    const changeCurvedText = () => {
      const obj =  canvas.value.getActiveObject();
      if(obj) {
        // @ts-ignore
        obj.set('curvedType', 'circle')
        // @ts-ignore
        obj.set('degrees', degrees.value)
        // @ts-ignore
        obj.set('curved', curved.value)

      }
      canvas.value.requestRenderAll();
    }
    onMounted(() => {
      canvas.value.setWidth(800);
      canvas.value.setHeight(800);
      // @ts-ignore
      // load("fonts/LiberationSans-Bold.ttf", fontLoaded);

      const text1 = new fabric.CJCurvedText('nguyen anh van', {
        top: 200,
        left: 200,
        fontSize: 32,
        fontFamily: 'DejaVuSans',
        fontWeight: 'bold',
        textAlign: 'center'
      })
      // @ts-ignore
      canvas.value.add(text1);
      canvas.value.requestRenderAll();
      canvas.value.setActiveObject(canvas.value.getObjects()[0])

      setTimeout(() => {
        // @ts-ignore
        const warpPoints = window.warpPoints as Array<number>

        if (!warpPoints) {
          return
        }

        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 4; j++) {
            const x = warpPoints[2 * (4 * i + j)]
            const y = warpPoints[2 * (4 * i + j) + 1]
            if (j <= 2) {
              const rightX = warpPoints[2 * (4 * i + j + 1)]
              const rightY = warpPoints[2 * (4 * i + j + 1) + 1]
              const line = new fabric.Line([x + 220, y + 280, rightX + 220, rightY + 280], {
                stroke: 'red',
              });
              canvas.value.add(line)
            }
            if (i <= 2) {
              const bottomX = warpPoints[2 * (4 * (i + 1) + j)]
              const bottomY = warpPoints[2 * (4 * (i + 1) + j) + 1]
              const line = new fabric.Line([x + 220, y + 280, bottomX + 220, bottomY + 280], {
                stroke: 'red',
              });
              canvas.value.add(line)
            }
          }
        }
      }, 2000)
    });
    return {
      uppercase,
      curved,
      degrees,
      canvas,
      changeColor,
      changeUppercase,
      changeCurvedText,
    };
  },
};
</script>