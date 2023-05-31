import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss"
import { useSideMenu } from "./src/hooks/app"

export default defineConfig({
  shortcuts: [
    ["btn", "rounded px2 py.5 inline-block dark:bg-#00ACC1 hover:bg-#4DD0E1 active:hover:bg-#00838F outline-(2px solid #4DD0E1) select-none cursor-pointer"],
    ["icon-btn", "rounded px2 py.5 inline-block hover:bg-#4DD0E1 active:hover:bg-#00838F select-none cursor-pointer"],
  ],
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        display: "inline-block",
      },
    }),
    presetAttributify(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  safelist: [...useSideMenu().sideMenuItems.value.map(i => i.icon)],
})