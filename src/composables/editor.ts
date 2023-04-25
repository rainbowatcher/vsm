import type { MaybeRef } from "@vueuse/core"
import { useDark, useToggle } from "@vueuse/core"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
import type { Ref } from "vue"
import { isRef, nextTick, shallowRef, unref, watchEffect } from "vue"

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

export type EditorOptions = {
  container: Ref<HTMLDivElement | undefined>
  data?: MaybeRef<string>
  lang?: MaybeRef<string>
  minimap?: boolean
  readOnly?: boolean
}

export const useMonacoEditor = (useOptions: EditorOptions) => {
  const instance = shallowRef<monaco.editor.IStandaloneCodeEditor>()
  const [isLoading, toggleLoading] = useToggle(true)
  const onValueChange = ref<(e: monaco.editor.IModelContentChangedEvent) => any>()
  const {
    data = "",
    lang = "handlebars",
    container,
    minimap = false,
    readOnly = false,
  } = useOptions


  watch(container, async () => {
    const _container = unref(container)
    if (!_container) return
    instance.value = monaco.editor.create(_container, { readOnly, minimap: { enabled: minimap }, scrollBeyondLastLine: false })
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
  })

  watchEffect(() => {
    // reactive update theme
    instance.value?.updateOptions({ theme: useDark().value ? "vs-dark" : "vs" })
    // sync data ref
    if (isRef(data) && unref(data) !== instance.value?.getValue()) {
      instance.value?.setValue(unref(data))
    }
    // reactive update lang
    if (instance.value?.getModel()) {
      monaco.editor.setModelLanguage(instance.value.getModel()!, unref(lang))
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
    if (instance.value) {
      monaco.editor.setModelLanguage(instance.value.getModel()!, lang)
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