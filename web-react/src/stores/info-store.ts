import { create } from 'zustand'
import { systemApi } from '@/apis/system'

interface Organization {
  name: string
  logo: string
  avatar: string
}

interface Branding {
  name: string
  title: string
  subtitle: string
  subtitles: string[]
}

interface Footer {
  copyright: string
  user_agreement_url: string
  privacy_policy_url: string
}

function deriveOrganization(config: Record<string, unknown>): Organization {
  return (config.organization as Organization) || { name: '', logo: '', avatar: '' }
}

function deriveBranding(config: Record<string, unknown>): Branding {
  return (config.branding as Branding) || { name: '', title: '', subtitle: '', subtitles: [] }
}

function deriveFooter(config: Record<string, unknown>): Footer {
  return {
    copyright: '',
    user_agreement_url: '',
    privacy_policy_url: '',
    ...(config.footer as Partial<Footer> || {})
  }
}

interface InfoState {
  infoConfig: Record<string, unknown>
  isLoading: boolean
  isLoaded: boolean
  debugMode: boolean
  organization: Organization
  branding: Branding
  footer: Footer
  toggleDebugMode: () => void
  loadInfoConfig: (force?: boolean) => Promise<Record<string, unknown> | null>
}

export const useInfoStore = create<InfoState>()((set, get) => ({
  infoConfig: {},
  isLoading: false,
  isLoaded: false,
  debugMode: false,
  organization: { name: '', logo: '', avatar: '' },
  branding: { name: '', title: '', subtitle: '', subtitles: [] },
  footer: { copyright: '', user_agreement_url: '', privacy_policy_url: '' },

  toggleDebugMode: () => set((s) => ({ debugMode: !s.debugMode })),

  loadInfoConfig: async (force = false) => {
    const { isLoaded } = get()
    if (isLoaded && !force) {
      return get().infoConfig
    }

    set({ isLoading: true })
    try {
      const response = await systemApi.getInfo()
      if (response) {
        set({
          infoConfig: response,
          isLoaded: true,
          organization: deriveOrganization(response),
          branding: deriveBranding(response),
          footer: deriveFooter(response)
        })
        return response
      }
      console.warn('信息配置加载失败，使用默认配置')
      return null
    } catch (error) {
      console.error('加载信息配置时发生错误:', error)
      return null
    } finally {
      set({ isLoading: false })
    }
  }
}))