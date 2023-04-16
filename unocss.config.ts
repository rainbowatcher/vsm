import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerVariantGroup,
} from "unocss"

export default defineConfig({
  shortcuts: [
    ["btn", "rounded px2 py.5 inline-block dark:bg-#00ACC1 hover:bg-#4DD0E1 active:hover:bg-#00838F outline-(2px solid #4DD0E1) select-none cursor-pointer"],
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
  ],
})