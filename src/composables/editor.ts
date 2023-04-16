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
  const {
    data = "",
    lang = "handlebars",
    container,
    minimap = false,
    readOnly = false,
  } = useOptions
  // const options = { minimap: { enabled: false } }

  nextTick(async () => {
    const _container = unref(container)
    if (!_container) return
    instance.value = monaco.editor.create(_container, { readOnly, minimap: { enabled: minimap }, scrollBeyondLastLine: false })
    toggleLoading(false)

    window.addEventListener("resize", resize)
    instance.value.onDidDispose(() => {
      window.removeEventListener("resize", resize)
    })

    // TODO: can do some prompts here
    instance.value.onDidChangeModelContent(() => {
      if (isRef(data)) data.value = instance.value?.getValue() || ""
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

  return {
    data,
    lang,
    instance,
    isLoading,
    resize,
    dispose: instance.value?.dispose,
  }
}