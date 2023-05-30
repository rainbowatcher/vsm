import type { ComponentOptions, DefineComponent } from "vue"

export type DialogOptions = {
  title: string
  comp: DefineComponent<unknown, unknown, any> | ComponentOptions
}

export const dialogInjectKey: InjectionKey<(options: DialogOptions) => void> = Symbol()

export function useGlobalDialog(options: DialogOptions) {
  console.log("invoke")
  const dialogProvider = inject(dialogInjectKey, undefined)
  if (!dialogProvider) {
    throw new Error("VDialogProvider not found")
  }
  dialogProvider(options)
}