import { useState } from "react"
import { FaUserShield } from "react-icons/fa"
import useAdminData from "../../hooks/use-admin-data"
import { createNationalOpportunity, type InternationalOpportunityInput, type NationalOpportunityInput } from "../../lib/opportunities-api"
import AdminFeedback from "./admin-feedback"
import AdminOpportunityForm from "./admin-opportunity-form"
import AdminRecordsList from "./admin-records-list"
import AdminTabs, { type AdminTab } from "./admin-tabs"

type FormMode = "campos" | "texto"

const INTERNATIONAL_FIELDS = [
    { key: "nome", label: "Nome" },
    { key: "imagem", label: "Imagem (URL)" },
    { key: "pais", label: "Pais" },
    { key: "cidade", label: "Cidade" },
    { key: "instituicaoResponsavel", label: "Instituicao" },
    { key: "tipo", label: "Tipo" },
    { key: "nivelEnsino", label: "Nivel de ensino" },
    { key: "faixaEtaria", label: "Faixa etaria" },
    { key: "requisitosIdioma", label: "Requisitos de idioma" },
    { key: "taxaAplicacao", label: "Taxa de aplicacao" },
    { key: "tipoBolsa", label: "Tipo de bolsa" },
    { key: "coberturaBolsa", label: "Cobertura da bolsa" },
    { key: "custosExtras", label: "Custos extras" },
    { key: "duracao", label: "Duracao" },
    { key: "prazoInscricao", label: "Prazo (dd/mm/aaaa)" },
    { key: "etapasSelecao", label: "Etapas de selecao" },
    { key: "processoInscricao", label: "Processo de inscricao" },
    { key: "linkOficial", label: "Link oficial" },
    { key: "contato", label: "Contato" },
]

const INTERNATIONAL_TEXTAREA_FIELDS = [
    { key: "descricao", label: "Descricao" },
    { key: "requisitosEspecificos", label: "Requisitos especificos" },
]

const NATIONAL_FIELDS = [
    { key: "nome", label: "Nome" },
    { key: "imagem", label: "Imagem (URL)" },
    { key: "pais", label: "Pais" },
    { key: "tipo", label: "Tipo" },
    { key: "nivelEnsino", label: "Nivel de ensino" },
    { key: "modalidade", label: "Modalidade" },
    { key: "prazoInscricao", label: "Prazo (dd/mm/aaaa)" },
    { key: "duracao", label: "Duracao" },
    { key: "cidadeEstado", label: "Cidade/Estado" },
    { key: "faixaEtaria", label: "Faixa etaria" },
    { key: "instituicaoResponsavel", label: "Instituicao" },
    { key: "taxaAplicacao", label: "Taxa de aplicacao" },
    { key: "beneficios", label: "Beneficios" },
    { key: "custos", label: "Custos" },
    { key: "custosExtras", label: "Custos extras" },
    { key: "etapasSelecao", label: "Etapas de selecao" },
    { key: "linkOficial", label: "Link oficial" },
    { key: "contato", label: "Contato" },
]

const NATIONAL_TEXTAREA_FIELDS = [
    { key: "sobre", label: "Sobre" },
    { key: "requisitos", label: "Requisitos" },
    { key: "requisitosEspecificos", label: "Requisitos especificos (um por linha)" },
]

const AdminPage = () => {
    const {
        session,
        isSessionPending,
        isLoading,
        isAdmin,
        feedback,
        setFeedback,
        internationalList,
        nationalList,
        internationalForm,
        nationalForm,
        editingInternationalId,
        editingNationalId,
        handleInternationalChange,
        handleNationalChange,
        handleEditInternational,
        handleEditNational,
        handleSaveInternational,
        handleSaveNational,
        handleDeleteInternational,
        handleDeleteNational,
        resetInternationalForm,
        resetNationalForm,
        loadData,
    } = useAdminData()

    const [activeTab, setActiveTab] = useState<AdminTab>("internacional")
    const [formMode, setFormMode] = useState<FormMode>("campos")
    const [jsonInput, setJsonInput] = useState("")

    const handleResetInternational = () => {
        resetInternationalForm()
        setFormMode("campos")
        setJsonInput("")
    }

    const handleResetNational = () => {
        resetNationalForm()
        setFormMode("campos")
        setJsonInput("")
    }

    const parseTextInput = (text: string): Record<string, string> => {
        const result: Record<string, string> = {}
        const lines = text.split("\n")
        let currentKey = ""
        let currentValue = ""

        for (const line of lines) {
            const colonIndex = line.indexOf(":")
            if (colonIndex > 0) {
                const potentialKey = line.substring(0, colonIndex).trim().toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "")

                const keyMap: Record<string, string> = {
                    nome: "nome",
                    imagem: "imagem",
                    pais: "pais",
                    cidade: "cidade",
                    cidadeestado: "cidadeEstado",
                    instituicao: "instituicaoResponsavel",
                    instituicaoresponsavel: "instituicaoResponsavel",
                    tipo: "tipo",
                    nivelensino: "nivelEnsino",
                    nivel: "nivelEnsino",
                    faixaetaria: "faixaEtaria",
                    idade: "faixaEtaria",
                    requisitosidioma: "requisitosIdioma",
                    idioma: "requisitosIdioma",
                    taxaaplicacao: "taxaAplicacao",
                    taxa: "taxaAplicacao",
                    tipobolsa: "tipoBolsa",
                    bolsa: "tipoBolsa",
                    coberturaabolsa: "coberturaBolsa",
                    cobertura: "coberturaBolsa",
                    custosextras: "custosExtras",
                    custos: "custos",
                    duracao: "duracao",
                    prazoinscricao: "prazoInscricao",
                    prazo: "prazoInscricao",
                    etapasselecao: "etapasSelecao",
                    etapas: "etapasSelecao",
                    processoinscricao: "processoInscricao",
                    processo: "processoInscricao",
                    linkoficial: "linkOficial",
                    link: "linkOficial",
                    site: "linkOficial",
                    contato: "contato",
                    email: "contato",
                    descricao: "descricao",
                    sobre: "sobre",
                    descricaobreve: "descricaoBreve",
                    requisitos: "requisitos",
                    requisitosespecificos: "requisitosEspecificos",
                    modalidade: "modalidade",
                    beneficios: "beneficios",
                }

                const mappedKey = keyMap[potentialKey]
                if (mappedKey) {
                    if (currentKey && currentValue) {
                        result[currentKey] = currentValue.trim()
                    }
                    currentKey = mappedKey
                    currentValue = line.substring(colonIndex + 1).trim()
                } else {
                    if (currentKey) {
                        currentValue += "\n" + line
                    }
                }
            } else if (currentKey && line.trim()) {
                currentValue += "\n" + line
            }
        }

        if (currentKey && currentValue) {
            result[currentKey] = currentValue.trim()
        }

        return result
    }

    const handleSaveTextInternational = async () => {
        try {
            setFeedback(null)
            const parsed = parseTextInput(jsonInput)

            const formData: InternationalOpportunityInput = {
                nome: parsed.nome || "",
                imagem: parsed.imagem || "",
                pais: parsed.pais || "",
                cidade: parsed.cidade || "",
                instituicaoResponsavel: parsed.instituicaoResponsavel || "",
                tipo: parsed.tipo || "",
                nivelEnsino: parsed.nivelEnsino || "",
                faixaEtaria: parsed.faixaEtaria || "",
                requisitosIdioma: parsed.requisitosIdioma || "",
                taxaAplicacao: parsed.taxaAplicacao || "",
                tipoBolsa: parsed.tipoBolsa || "",
                coberturaBolsa: parsed.coberturaBolsa || "",
                custosExtras: parsed.custosExtras || "",
                duracao: parsed.duracao || "",
                prazoInscricao: parsed.prazoInscricao || "",
                etapasSelecao: parsed.etapasSelecao || "",
                processoInscricao: parsed.processoInscricao || "",
                linkOficial: parsed.linkOficial || "",
                contato: parsed.contato || "",
                descricao: parsed.descricao || "",
                requisitosEspecificos: parsed.requisitosEspecificos || "",
            }

            for (const [key, value] of Object.entries(formData)) {
                handleInternationalChange(key as keyof InternationalOpportunityInput, value)
            }
            await handleSaveInternational()
            handleResetInternational()
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? `Erro ao processar texto: ${error.message}`
                        : "Erro ao processar o texto. Verifique o formato.",
            })
        }
    }

    const handleSaveTextNational = async () => {
        try {
            setFeedback(null)
            const parsed = parseTextInput(jsonInput)

            // Normaliza modalidade para aceitar "Online", "Presencial" ou "Híbrido"
            let modalidade: "Online" | "Presencial" | "Híbrido" = "Online"
            if (parsed.modalidade) {
                const modalidadeLower = parsed.modalidade.toLowerCase()
                if (modalidadeLower.includes("hibrido") || modalidadeLower.includes("híbrido") || modalidadeLower.includes("misto")) {
                    modalidade = "Híbrido"
                } else if (modalidadeLower.includes("presencial")) {
                    modalidade = "Presencial"
                } else if (modalidadeLower.includes("online") || modalidadeLower.includes("remoto") || modalidadeLower.includes("ead")) {
                    modalidade = "Online"
                }
            }

            const payload: NationalOpportunityInput = {
                nome: parsed.nome || "",
                imagem: parsed.imagem || "",
                pais: parsed.pais || "Brasil",
                tipo: parsed.tipo || "",
                nivelEnsino: parsed.nivelEnsino || "",
                modalidade,
                prazoInscricao: parsed.prazoInscricao || "",
                duracao: parsed.duracao || "",
                cidadeEstado: parsed.cidadeEstado || parsed.cidade || "",
                faixaEtaria: parsed.faixaEtaria || "",
                instituicaoResponsavel: parsed.instituicaoResponsavel || "",
                taxaAplicacao: parsed.taxaAplicacao || "",
                beneficios: parsed.beneficios || "",
                custos: parsed.custos || "",
                custosExtras: parsed.custosExtras || "",
                etapasSelecao: parsed.etapasSelecao || "",
                linkOficial: parsed.linkOficial || "",
                contato: parsed.contato || "",
                sobre: parsed.sobre || parsed.descricao || "",
                requisitos: parsed.requisitos || "",
                requisitosEspecificos: (parsed.requisitosEspecificos || "")
                    .split(/\r?\n|;|\|/)
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0),
            }

            await createNationalOpportunity(payload)
            setFeedback({ type: "success", message: "Oportunidade nacional criada." })
            await loadData()
            handleResetNational()
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? `Erro ao processar texto: ${error.message}`
                        : "Erro ao processar o texto. Verifique o formato.",
            })
        }
    }

    if (isSessionPending || isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Carregando painel administrativo...
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                Sessao invalida. Faca login novamente.
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-white">
                <div className="max-w-xl rounded-xl border border-red-500/40 bg-red-950/30 p-6">
                    <h1 className="mb-2 font-bold text-2xl text-red-300">Acesso negado</h1>
                    <p>Somente usuarios administradores podem acessar esta pagina.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 p-6 font-inter text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex items-center gap-3">
                    <FaUserShield className="text-2xl text-amber-500" />
                    <h1 className="font-bold text-3xl text-amber-500">Painel Administrativo</h1>
                </div>

                <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
                <AdminFeedback feedback={feedback} />

                {activeTab === "internacional" ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <AdminRecordsList
                            accentColor="blue"
                            items={internationalList.map((item) => ({
                                id: item.id,
                                name: item.nome,
                                subtitle: item.pais,
                            }))}
                            onDelete={handleDeleteInternational}
                            onEdit={(id) => {
                                const item = internationalList.find((i) => i.id === id)
                                if (item) {
                                    handleEditInternational(item)
                                }
                            }}
                            title="Registros"
                        />

                        <AdminOpportunityForm
                            accentColor="blue"
                            editingId={editingInternationalId}
                            fields={INTERNATIONAL_FIELDS}
                            formData={internationalForm as unknown as Record<string, string>}
                            formMode={formMode}
                            jsonInput={jsonInput}
                            onFormChange={(key, value) =>
                                handleInternationalChange(
                                    key as keyof InternationalOpportunityInput,
                                    value
                                )
                            }
                            onJsonInputChange={setJsonInput}
                            onReset={handleResetInternational}
                            onSave={handleSaveInternational}
                            onSaveText={handleSaveTextInternational}
                            setFormMode={setFormMode}
                            textareaFields={INTERNATIONAL_TEXTAREA_FIELDS}
                            title="Nova Oportunidade"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <AdminRecordsList
                            accentColor="amber"
                            items={nationalList.map((item) => ({
                                id: item.id,
                                name: item.nome,
                                subtitle: item.cidadeEstado,
                            }))}
                            onDelete={handleDeleteNational}
                            onEdit={(id) => {
                                const item = nationalList.find((i) => i.id === id)
                                if (item) {
                                    handleEditNational(item)
                                }
                            }}
                            title="Registros"
                        />

                        <AdminOpportunityForm
                            accentColor="amber"
                            editingId={editingNationalId}
                            fields={NATIONAL_FIELDS}
                            formData={nationalForm as unknown as Record<string, string>}
                            formMode={formMode}
                            jsonInput={jsonInput}
                            onFormChange={(key, value) =>
                                handleNationalChange(key as keyof typeof nationalForm, value)
                            }
                            onJsonInputChange={setJsonInput}
                            onReset={handleResetNational}
                            onSave={handleSaveNational}
                            onSaveText={handleSaveTextNational}
                            setFormMode={setFormMode}
                            textareaFields={NATIONAL_TEXTAREA_FIELDS}
                            title="Nova Oportunidade"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPage
