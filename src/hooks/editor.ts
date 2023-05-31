import type { MaybeRef } from "@vueuse/core"
import type { Ref } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import { isRef, shallowRef, unref } from "vue"

const isDark = useDark()
// function useWorker() {
self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    switch (label) {
      case "json":
        return new jsonWorker()
      case "css":
      case "scss":
      case "less":
        return new cssWorker()
      case "html":
      case "handlebars":
      case "razor":
        return new htmlWorker()
      case "typescript":
      case "javascript":
        return new tsWorker()
      default:
        return new editorWorker()
    }
  },
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
// }


export type EditorOptions = {
  container: Ref<HTMLDivElement | undefined>
  data?: MaybeRef<string>
  lang?: MaybeRef<string>
  hasMinimap?: boolean
  isReadOnly?: boolean
}

export function useMonacoEditor(useOptions: EditorOptions) {
  const instance = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const [isLoading, toggleLoading] = useToggle(true)
  const onValueChange = ref<(e: monaco.editor.IModelContentChangedEvent) => any>()
  const {
    data = "",
    lang = "handlebars",
    container,
    hasMinimap = false,
    isReadOnly = false,
  } = useOptions


  const stop = watch(() => unref(container), () => {
    const containerValue = unref(container)
    if (!containerValue) return
    instance.value = monaco.editor.create(containerValue, { readOnly: isReadOnly, minimap: { enabled: hasMinimap }, scrollBeyondLastLine: false })
    toggleLoading(false)

    // auto resize when window resized
    window.addEventListener("resize", resize)
    instance.value.onDidDispose(() => {
      window.removeEventListener("resize", resize)
    })

    // TODO: can do some prompts here
    instance.value.onDidChangeModelContent((e) => {
      if (isRef(data)) data.value = instance.value?.getValue() || ""
      onValueChange.value?.(e)
    })

    stop()
  })

  watch([isDark, () => instance.value], () => {
    // reactive update theme
    instance.value?.updateOptions({ theme: isDark.value ? "vs-dark" : "vs" })
  })

  watch(() => unref(data), () => {
    if (unref(data) !== instance.value?.getValue()) {
      instance.value?.setValue(unref(data))
    }
  })

  watch(() => unref(lang), () => {
    // reactive update lang
    if (instance.value?.getModel()) {
      setLang(unref(lang))
    }
  })

  const resize = () => {
    setTimeout(() => {
      instance.value?.layout()
    })
  }

  // const useTheme = () => {
  //   monaco.editor.defineTheme("vsm", {
  //     base: "vs-dark",
  //     inherit: true,
  //     rules: [],
  //     colors: {
  //       "editor.background": "#404042",
  //       "editor.lineHighlightBackground": "#00000014",
  //     },
  //   })
  //   monaco.editor.setTheme("vsm")
  // }

  // watchOnce(instance, () => useTheme())

  // /**
  //  * This function should invoke after editor did mounted.
  //  * @example
  //  * ```js
  //  * onMounted(() => {
  //  *   setTimeout(() => {
  //  *     onValueChange((e) => {
  //  *       // do something here
  //  *     })
  //  *   })
  //  * ```
  //  * @param handler Event handler
  //  */
  // function onValueChange(handler: (e: monaco.editor.IModelContentChangedEvent) => any) {
  //   if (!instance.value) {
  //     console.warn("onValueChange must invoke after editor mounted. please place it to onMounted life cycle.")
  //   } else {
  //     instance.value?.onDidChangeModelContent(handler)
  //   }
  // }

  function setLang(lang: string) {
    let targetLang = "handlebars"
    switch (lang) {
      // case "vue":
      //   _lang = "javascript"
      //   break
      default:
        targetLang = lang
    }
    if (instance.value) {
      console.log(targetLang)
      monaco.editor.setModelLanguage(instance.value.getModel()!, targetLang)
    }
  }

  function setValue(value: string) { if (instance.value) instance.value.setValue(value) }
  function getValue() { if (instance.value) return instance.value.getValue() }

  function dispose() { if (instance.value) instance.value.dispose() }

  return {
    data,
    lang,
    instance,
    isLoading,
    resize,
    setLang,
    setValue,
    getValue,
    dispose,
    // event
    onValueChange,
  }
}