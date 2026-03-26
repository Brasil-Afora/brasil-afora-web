export interface InternationalOpportunity {
    cidade: string
    coberturaBolsa: string
    contato: string
    custosExtras: string
    descricao: string
    duracao: string
    etapasSelecao: string
    faixaEtaria: string
    id: string
    imagem: string
    instituicaoResponsavel: string
    linkOficial: string
    nivelEnsino: string
    nome: string
    pais: string
    prazoInscricao: string
    processoInscricao: string
    requisitosEspecificos: string
    requisitosIdioma: string
    taxaAplicacao: string
    tipo: string
    tipoBolsa: string
}

export interface NationalOpportunity {
    beneficios: string
    cidadeEstado: string
    contato: string
    custos: string
    custosExtras: string
    duracao: string
    etapasSelecao: string
    faixaEtaria: string
    id: string
    imagem: string
    instituicaoResponsavel: string
    linkOficial: string
    modalidade: "Online" | "Presencial" | "Híbrido"
    nivelEnsino: string
    nome: string
    pais: string
    prazoInscricao: string
    requisitos: string
    requisitosEspecificos: string[]
    sobre: string
    taxaAplicacao: string
    tipo: string
}

export type InternationalOpportunityInput = Omit<InternationalOpportunity, "id">
export type NationalOpportunityInput = Omit<NationalOpportunity, "id">

interface RawInternationalOpportunity {
    ageRange?: string
    applicationDeadline?: string | number | Date
    applicationFee?: string
    applicationProcess?: string
    city?: string
    contact?: string
    country?: string
    description?: string
    duration?: string
    educationLevel?: string
    extraCosts?: string
    id?: string | number
    image?: string
    languageRequirements?: string
    name?: string
    officialLink?: string
    responsibleInstitution?: string
    scholarshipCoverage?: string
    scholarshipType?: string
    selectionSteps?: string
    specificRequirements?: string
    type?: string
}

interface RawNationalOpportunity {
    about?: string
    ageRange?: string
    applicationDeadline?: string | number | Date
    applicationFee?: string
    benefits?: string
    cityState?: string
    contact?: string
    costs?: string
    country?: string
    duration?: string
    educationLevel?: string
    extraCosts?: string
    id?: string | number
    image?: string
    modality?: string
    name?: string
    officialLink?: string
    requirements?: string
    responsibleInstitution?: string
    selectionSteps?: string
    shortDescription?: string
    specificRequirements?: string
    type?: string
}

interface InternationalOpportunitiesResponse {
    opportunities?: RawInternationalOpportunity[]
}

interface NationalOpportunitiesResponse {
    nationalOpportunities?: RawNationalOpportunity[]
}

const importMetaWithEnv = import.meta as ImportMeta & {
    env?: Record<string, string | undefined>
}

const API_BASE_URL =
    importMetaWithEnv.env?.VITE_BACKEND_URL ?? "http://localhost:3333"

const API_BASE_URL_WITHOUT_TRAILING_SLASH = API_BASE_URL.replace(/\/$/, "")

const normalizeImageUrl = (value: string | undefined): string => {
    if (!value) {
        return ""
    }

    const image = value.trim()

    if (
        image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:") ||
        image.startsWith("blob:")
    ) {
        return image
    }

    if (image.startsWith("/")) {
        return `${API_BASE_URL_WITHOUT_TRAILING_SLASH}${image}`
    }

    return `${API_BASE_URL_WITHOUT_TRAILING_SLASH}/${image}`
}

const toDateString = (value: string | number | Date | undefined): string => {
    if (value === undefined || value === null) {
        return ""
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
        return ""
    }

    const day = String(parsed.getDate()).padStart(2, "0")
    const month = String(parsed.getMonth() + 1).padStart(2, "0")
    const year = parsed.getFullYear()

    return `${day}/${month}/${year}`
}

const toApiDateString = (value: string): string => {
    const parts = value.split("/")
    if (parts.length !== 3) {
        return value
    }

    const [day, month, year] = parts
    if (!day || !month || !year) {
        return value
    }

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

const splitSpecificRequirements = (value: string | undefined): string[] => {
    if (!value) {
        return []
    }

    return value
        .split(/\r?\n|;|\|/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
}

const mapInternationalOpportunity = (
    item: RawInternationalOpportunity
): InternationalOpportunity => ({
    id: String(item.id ?? ""),
    nome: item.name ?? "",
    imagem: normalizeImageUrl(item.image),
    pais: item.country ?? "",
    cidade: item.city ?? "",
    instituicaoResponsavel: item.responsibleInstitution ?? "",
    tipo: item.type ?? "",
    descricao: item.description ?? "",
    nivelEnsino: item.educationLevel ?? "",
    faixaEtaria: item.ageRange ?? "",
    requisitosIdioma: item.languageRequirements ?? "",
    requisitosEspecificos: item.specificRequirements ?? "",
    taxaAplicacao: item.applicationFee ?? "",
    tipoBolsa: item.scholarshipType ?? "",
    coberturaBolsa: item.scholarshipCoverage ?? "",
    custosExtras: item.extraCosts ?? "",
    duracao: item.duration ?? "",
    prazoInscricao: toDateString(item.applicationDeadline),
    etapasSelecao: item.selectionSteps ?? "",
    processoInscricao: item.applicationProcess ?? "",
    linkOficial: item.officialLink ?? "",
    contato: item.contact ?? "",
})

const normalizeModality = (
    modality: string | undefined
): "Online" | "Presencial" | "Híbrido" => {
    if (!modality) return "Presencial"

    const modalityLower = modality.toLowerCase()

    if (modalityLower.includes("hibrido") || modalityLower.includes("híbrido") || modalityLower.includes("misto")) {
        return "Híbrido"
    }

    if (modalityLower.includes("online") || modalityLower.includes("remoto") || modalityLower.includes("ead")) {
        return "Online"
    }

    return "Presencial"
}

const mapNationalOpportunity = (
    item: RawNationalOpportunity
): NationalOpportunity => ({
    id: String(item.id ?? ""),
    nome: item.name ?? "",
    imagem: normalizeImageUrl(item.image),
    pais: item.country ?? "Brasil",
    tipo: item.type ?? "",
    nivelEnsino: item.educationLevel ?? "",
    modalidade: normalizeModality(item.modality),
    prazoInscricao: toDateString(item.applicationDeadline),
    sobre: item.about ?? "",
    duracao: item.duration ?? "",
    cidadeEstado: item.cityState ?? "",
    faixaEtaria: item.ageRange ?? "",
    requisitos: item.requirements ?? "",
    requisitosEspecificos: splitSpecificRequirements(item.specificRequirements),
    instituicaoResponsavel: item.responsibleInstitution ?? "",
    taxaAplicacao: item.applicationFee ?? "",
    beneficios: item.benefits ?? "",
    custos: item.costs ?? "",
    custosExtras: item.extraCosts ?? "",
    etapasSelecao: item.selectionSteps ?? "",
    linkOficial: item.officialLink ?? "",
    contato: item.contact ?? "",
})

const mapInternationalInputToApi = (payload: InternationalOpportunityInput) => ({
    name: payload.nome,
    image: payload.imagem,
    country: payload.pais,
    city: payload.cidade,
    responsibleInstitution: payload.instituicaoResponsavel,
    type: payload.tipo,
    description: payload.descricao,
    educationLevel: payload.nivelEnsino,
    ageRange: payload.faixaEtaria,
    languageRequirements: payload.requisitosIdioma,
    specificRequirements: payload.requisitosEspecificos,
    applicationFee: payload.taxaAplicacao,
    scholarshipType: payload.tipoBolsa,
    scholarshipCoverage: payload.coberturaBolsa,
    extraCosts: payload.custosExtras,
    duration: payload.duracao,
    applicationDeadline: toApiDateString(payload.prazoInscricao),
    selectionSteps: payload.etapasSelecao,
    applicationProcess: payload.processoInscricao,
    officialLink: payload.linkOficial,
    contact: payload.contato,
})

const mapNationalInputToApi = (payload: NationalOpportunityInput) => ({
    name: payload.nome,
    image: payload.imagem,
    country: payload.pais,
    type: payload.tipo,
    educationLevel: payload.nivelEnsino,
    modality: payload.modalidade,
    applicationDeadline: toApiDateString(payload.prazoInscricao),
    about: payload.sobre,
    shortDescription: payload.sobre,
    duration: payload.duracao,
    cityState: payload.cidadeEstado,
    ageRange: payload.faixaEtaria,
    requirements: payload.requisitos,
    specificRequirements: payload.requisitosEspecificos.join("; "),
    responsibleInstitution: payload.instituicaoResponsavel,
    applicationFee: payload.taxaAplicacao,
    benefits: payload.beneficios,
    costs: payload.custos,
    extraCosts: payload.custosExtras,
    selectionSteps: payload.etapasSelecao,
    officialLink: payload.linkOficial,
    contact: payload.contato,
})

const fetchFromApi = async <T>(path: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
    })

    if (!response.ok) {
        let errorMessage = `Falha ao buscar ${path}: ${response.status}`

        try {
            const errorBody = (await response.json()) as { message?: string }
            if (errorBody.message) {
                errorMessage = errorBody.message
            }
        } catch {
            // Keep default message when backend error body is not JSON.
        }

        throw new Error(errorMessage)
    }

    return (await response.json()) as T
}

const sendToApi = async (
    path: string,
    method: "POST" | "PUT" | "DELETE",
    body?: unknown
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
        let errorMessage = `Falha ao executar ${method} em ${path}: ${response.status}`

        try {
            const errorBody = (await response.json()) as { message?: string }
            if (errorBody.message) {
                errorMessage = errorBody.message
            }
        } catch {
            // Keep default message when backend error body is not JSON.
        }

        throw new Error(errorMessage)
    }
}

export const getInternationalOpportunities = async (): Promise<
    InternationalOpportunity[]
> => {
    const data = await fetchFromApi<InternationalOpportunitiesResponse>(
        "/opportunities"
    )

    return (data.opportunities ?? []).map(mapInternationalOpportunity)
}

export const getInternationalOpportunityById = async (
    id: string
): Promise<InternationalOpportunity | null> => {
    const opportunities = await getInternationalOpportunities()

    return opportunities.find((item) => item.id === id) ?? null
}

export const getNationalOpportunities = async (): Promise<
    NationalOpportunity[]
> => {
    const data = await fetchFromApi<NationalOpportunitiesResponse>(
        "/national-opportunities"
    )

    return (data.nationalOpportunities ?? []).map(mapNationalOpportunity)
}

export const getNationalOpportunityById = async (
    id: string
): Promise<NationalOpportunity | null> => {
    const opportunities = await getNationalOpportunities()

    return opportunities.find((item) => item.id === id) ?? null
}

export const createInternationalOpportunity = async (
    payload: InternationalOpportunityInput
): Promise<void> => {
    await sendToApi("/opportunities", "POST", mapInternationalInputToApi(payload))
}

export const updateInternationalOpportunity = async (
    id: string,
    payload: InternationalOpportunityInput
): Promise<void> => {
    await sendToApi(
        `/opportunities/${id}`,
        "PUT",
        mapInternationalInputToApi(payload)
    )
}

export const deleteInternationalOpportunity = async (id: string): Promise<void> => {
    await sendToApi(`/opportunities/${id}`, "DELETE")
}

export const createNationalOpportunity = async (
    payload: NationalOpportunityInput
): Promise<void> => {
    await sendToApi(
        "/national-opportunities",
        "POST",
        mapNationalInputToApi(payload)
    )
}

export const updateNationalOpportunity = async (
    id: string,
    payload: NationalOpportunityInput
): Promise<void> => {
    await sendToApi(
        `/national-opportunities/${id}`,
        "PUT",
        mapNationalInputToApi(payload)
    )
}

export const deleteNationalOpportunity = async (id: string): Promise<void> => {
    await sendToApi(`/national-opportunities/${id}`, "DELETE")
}

export const getInternationalFavorites = async (): Promise<
    InternationalOpportunity[]
> => {
    const data = await fetchFromApi<InternationalOpportunitiesResponse>(
        "/opportunities/favorites"
    )

    return (data.opportunities ?? []).map(mapInternationalOpportunity)
}

export const addInternationalFavorite = async (id: string): Promise<void> => {
    await sendToApi(`/opportunities/${id}/favorite`, "POST")
}

export const removeInternationalFavorite = async (id: string): Promise<void> => {
    await sendToApi(`/opportunities/${id}/favorite`, "DELETE")
}

export const getNationalFavorites = async (): Promise<NationalOpportunity[]> => {
    const data = await fetchFromApi<NationalOpportunitiesResponse>(
        "/national-opportunities/favorites"
    )

    return (data.nationalOpportunities ?? []).map(mapNationalOpportunity)
}

export const addNationalFavorite = async (id: string): Promise<void> => {
    await sendToApi(`/national-opportunities/${id}/favorite`, "POST")
}

export const removeNationalFavorite = async (id: string): Promise<void> => {
    await sendToApi(`/national-opportunities/${id}/favorite`, "DELETE")
}
