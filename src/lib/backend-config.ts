const DEFAULT_BACKEND_URL = "http://localhost:3333"

const normalizeBaseUrl = (value: string | undefined): string => {
    const trimmed = value?.trim()

    if (!trimmed) {
        return DEFAULT_BACKEND_URL
    }

    return trimmed.replace(/\/+$/, "")
}

const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL
const legacyBackendUrl = import.meta.env.VITE_API_URL

export const BACKEND_BASE_URL = normalizeBaseUrl(
    configuredBackendUrl ?? legacyBackendUrl
)

export const buildBackendUrl = (path: string): string => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`
    return `${BACKEND_BASE_URL}${normalizedPath}`
}