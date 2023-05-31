import type { MaybeRef } from "@vueuse/core"
// import type { Ref } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import * as monaco from "monaco-editor"
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker"
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker"
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker"
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
// @ts-expect-error type
import { StandaloneServices } from "monaco-editor/esm/vs/editor/standalone/browser/standaloneServices"
// @ts-expect-error type
import { WorkerBasedDocumentDiffProvider } from "monaco-editor/esm/vs/editor/browser/widget/workerBasedDocumentDiffProvider"
import { isRef, shallowRef, unref } from "vue"

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


const provider = StandaloneServices.initialize().createInstance(WorkerBasedDocumentDiffProvider, {})

export function useMonacoDiffEditor(container: MaybeRef<HTMLDivElement | undefined>, options?: monaco.editor.IDiffEditorOptions) {
  const instance = shallowRef<monaco.editor.IDiffEditor>()
  const [isLoading, toggleLoading] = useToggle(true)
  const onValueChange = ref<(e: monaco.editor.IModelContentChangedEvent) => any>()

  const stop = watch(() => unref(container), () => {
    const containerValue = unref(container)
    if (!containerValue) return
    const innerOptions = Object.assign({
      // minimap: { enabled: false },
      scrollBeyondLastLine: false,
      diffAlgorithm: {
        onDidChange: () => ({ dispose: () => {} }),
        computeDiff: async (original: any, modified: any, options: any) => {
          const result = await provider.computeDiff(original, modified, options)
          return result
        },
      },
    }, options)
    instance.value = monaco.editor.createDiffEditor(containerValue, innerOptions)
    toggleLoading(false)

    // auto resize when window resized
    window.addEventListener("resize", resize)
    instance.value.onDidDispose(() => {
      window.removeEventListener("resize", resize)
    })

    // TODO: can do some prompts here
    // instance.value.onDidChangeModelContent((e) => {
    //   if (isRef(data)) data.value = instance.value?.getValue() || ""
    //   onValueChange.value?.(e)
    // })

    stop()
  })

  watch([useDark(), () => instance.value], () => {
    // reactive update theme
    // instance.value?.updateOptions({""})
    // const model = instance.value?.getModel()
    monaco.editor.setTheme(useDark().value ? "vs-dark" : "vs")
  })

  // watch(() => unref(data), () => {
  //   if (unref(data) !== instance.value?.getValue()) {
  //     instance.value?.setValue(unref(data))
  //   }
  // })

  // watch(() => unref(lang), () => {
  //   // reactive update lang
  //   if (instance.value?.getModel()) {
  //     setLang(unref(lang))
  //   }
  // })

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
      monaco.editor.setModelLanguage(instance.value.getModifiedEditor().getModel()!, targetLang)
      monaco.editor.setModelLanguage(instance.value.getOriginalEditor().getModel()!, targetLang)
    }
  }

  function setValue(originalValue: string, modifiedValue: string, lang?: string) {
    if (instance.value) {
      const originalModel = monaco.editor.createModel(originalValue, lang)
      const modifiedModel = monaco.editor.createModel(modifiedValue, lang)
      instance.value.setModel({
        original: originalModel,
        modified: modifiedModel,
      })
    }
  }
  function setRightValue(value: string) { if (instance.value) instance.value.getModifiedEditor().setValue(value) }
  function getLeftValue() { if (instance.value) return instance.value.getOriginalEditor().getValue() }
  function getRightValue() { if (instance.value) return instance.value.getModifiedEditor().getValue() }

  function dispose() { if (instance.value) instance.value.dispose() }

  return {
    instance,
    isLoading,
    resize,
    setLang,
    setValue,
    setRightValue,
    getLeftValue,
    getRightValue,
    dispose,
    // event
    onValueChange,
  }
}