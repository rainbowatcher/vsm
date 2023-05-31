import { ref } from "vue"

function useLayout() {
  const hasNativeHeader = ref(true)
  // void getCurrent().isDecorated().then(did => hasNativeHeader.value = did)
  return {
    hasNativeHeader,
  }
}

type MenuItem = {
  icon: string
  label: string
  link: string
}

export function useSideMenu() {
  const sideMenuItems = ref<MenuItem[]>([
    { icon: "i-mdi-set", label: "Snippets", link: "/" },
    { icon: "i-mdi-vector-difference", label: "Conflict", link: "/import" },
    { icon: "i-mdi-movie-roll", label: "Test", link: "/test" },
  ])

  return {
    sideMenuItems,
  }
}

function useTheme() {
  const preferDark = usePreferredDark()
  const isDark = useDark()
  const themeOptions = [
    { label: "dark", value: "dark" },
    { label: "light", value: "light" },
    { label: "system", value: "system" },
  ]
  const vsmTheme = useStorage<typeof themeOptions[number]["label"]>("vsm-theme", preferDark.value ? "dark" : "light")

  const changeTheme = (val: string) => {
    vsmTheme.value = val
    switch (val) {
      case "dark":
        isDark.value = true
        break
      case "light":
        isDark.value = false
        break
      case "system":
        isDark.value = preferDark.value
        break
    }
  }

  return {
    vsmTheme,
    themeOptions,
    changeTheme,
  }
}

export function useSettings() {
  const { vsmTheme, themeOptions, changeTheme } = useTheme()
  const { hasNativeHeader } = useLayout()
  const { sideMenuItems } = useSideMenu()
  return {
    sideMenuItems,
    hasNativeHeader,
    vsmTheme,
    themeOptions,
    changeTheme,
  }
}