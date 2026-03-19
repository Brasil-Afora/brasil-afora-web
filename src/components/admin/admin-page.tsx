import { useEffect, useMemo, useState } from "react"
import { FaEdit, FaPlus, FaTrash, FaUserShield } from "react-icons/fa"
import { useSession } from "../../lib/auth-client"
import {
    createInternationalOpportunity,
    createNationalOpportunity,
    deleteInternationalOpportunity,
    deleteNationalOpportunity,
    getInternationalOpportunities,
    getNationalOpportunities,
    type InternationalOpportunity,
    type InternationalOpportunityInput,
    type NationalOpportunity,
    type NationalOpportunityInput,
    updateInternationalOpportunity,
    updateNationalOpportunity,
} from "../../lib/opportunities-api"

type AdminTab = "internacional" | "nacional"

interface FeedbackState {
    message: string
    type: "error" | "success"
}

interface NationalFormState extends Omit<NationalOpportunityInput, "requisitosEspecificos"> {
    requisitosEspecificos: string
}

const initialInternationalForm: InternationalOpportunityInput = {
    cidade: "",
    coberturaBolsa: "",
    contato: "",
    custosExtras: "",
    descricao: "",
    duracao: "",
    etapasSelecao: "",
    faixaEtaria: "",
    imagem: "",
    instituicaoResponsavel: "",
    linkOficial: "",
    nivelEnsino: "",
    nome: "",
    pais: "",
    prazoInscricao: "",
    processoInscricao: "",
    requisitosEspecificos: "",
    requisitosIdioma: "",
    taxaAplicacao: "",
    tipo: "",
    tipoBolsa: "",
}

const initialNationalForm: NationalFormState = {
    beneficios: "",
    cidadeEstado: "",
    contato: "",
    custos: "",
    custosExtras: "",
    descricaoBreve: "",
    duracao: "",
    etapasSelecao: "",
    faixaEtaria: "",
    imagem: "",
    instituicaoResponsavel: "",
    linkOficial: "",
    modalidade: "Online",
    nivelEnsino: "",
    nome: "",
    pais: "Brasil",
    prazoInscricao: "",
    requisitos: "",
    requisitosEspecificos: "",
    sobre: "",
    taxaAplicacao: "",
    tipo: "",
}

const splitRequirements = (value: string): string[] =>
    value
        .split(/\r?\n|;|\|/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

const AdminPage = () => {
    const { data: session, isPending } = useSession()
    const [activeTab, setActiveTab] = useState<AdminTab>("internacional")
    const [isLoading, setIsLoading] = useState(true)
    const [feedback, setFeedback] = useState<FeedbackState | null>(null)

    const [internationalList, setInternationalList] = useState<InternationalOpportunity[]>([])
    const [nationalList, setNationalList] = useState<NationalOpportunity[]>([])

    const [internationalForm, setInternationalForm] =
        useState<InternationalOpportunityInput>(initialInternationalForm)
    const [nationalForm, setNationalForm] =
        useState<NationalFormState>(initialNationalForm)

    const [editingInternationalId, setEditingInternationalId] = useState<string | null>(null)
    const [editingNationalId, setEditingNationalId] = useState<string | null>(null)

    const isAdmin = useMemo(() => {
        const role = (session?.user as { role?: string } | undefined)?.role
        return role === "admin"
    }, [session?.user])

    const loadData = async () => {
        try {
            setIsLoading(true)
            setFeedback(null)

            const [international, national] = await Promise.all([
                getInternationalOpportunities(),
                getNationalOpportunities(),
            ])

            setInternationalList(international)
            setNationalList(national)
        } catch {
            setFeedback({
                type: "error",
                message: "Nao foi possivel carregar os dados administrativos.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void loadData()
    }, [])

    const resetInternationalForm = () => {
        setEditingInternationalId(null)
        setInternationalForm(initialInternationalForm)
    }

    const resetNationalForm = () => {
        setEditingNationalId(null)
        setNationalForm(initialNationalForm)
    }

    const handleInternationalChange = (
        field: keyof InternationalOpportunityInput,
        value: string
    ) => {
        setInternationalForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleNationalChange = (field: keyof NationalFormState, value: string) => {
        setNationalForm((prev) => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleEditInternational = (item: InternationalOpportunity) => {
        setActiveTab("internacional")
        setEditingInternationalId(item.id)
        setInternationalForm({
            cidade: item.cidade,
            coberturaBolsa: item.coberturaBolsa,
            contato: item.contato,
            custosExtras: item.custosExtras,
            descricao: item.descricao,
            duracao: item.duracao,
            etapasSelecao: item.etapasSelecao,
            faixaEtaria: item.faixaEtaria,
            imagem: item.imagem,
            instituicaoResponsavel: item.instituicaoResponsavel,
            linkOficial: item.linkOficial,
            nivelEnsino: item.nivelEnsino,
            nome: item.nome,
            pais: item.pais,
            prazoInscricao: item.prazoInscricao,
            processoInscricao: item.processoInscricao,
            requisitosEspecificos: item.requisitosEspecificos,
            requisitosIdioma: item.requisitosIdioma,
            taxaAplicacao: item.taxaAplicacao,
            tipo: item.tipo,
            tipoBolsa: item.tipoBolsa,
        })
    }

    const handleEditNational = (item: NationalOpportunity) => {
        setActiveTab("nacional")
        setEditingNationalId(item.id)
        setNationalForm({
            beneficios: item.beneficios,
            cidadeEstado: item.cidadeEstado,
            contato: item.contato,
            custos: item.custos,
            custosExtras: item.custosExtras,
            descricaoBreve: item.descricaoBreve,
            duracao: item.duracao,
            etapasSelecao: item.etapasSelecao,
            faixaEtaria: item.faixaEtaria,
            imagem: item.imagem,
            instituicaoResponsavel: item.instituicaoResponsavel,
            linkOficial: item.linkOficial,
            modalidade: item.modalidade,
            nivelEnsino: item.nivelEnsino,
            nome: item.nome,
            pais: item.pais,
            prazoInscricao: item.prazoInscricao,
            requisitos: item.requisitos,
            requisitosEspecificos: item.requisitosEspecificos.join("\n"),
            sobre: item.sobre,
            taxaAplicacao: item.taxaAplicacao,
            tipo: item.tipo,
        })
    }

    const handleSaveInternational = async () => {
        try {
            setFeedback(null)
            if (editingInternationalId) {
                await updateInternationalOpportunity(editingInternationalId, internationalForm)
                setFeedback({ type: "success", message: "Oportunidade internacional atualizada." })
            } else {
                await createInternationalOpportunity(internationalForm)
                setFeedback({ type: "success", message: "Oportunidade internacional criada." })
            }

            await loadData()
            resetInternationalForm()
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel salvar a oportunidade internacional.",
            })
        }
    }

    const handleSaveNational = async () => {
        try {
            setFeedback(null)
            const payload: NationalOpportunityInput = {
                ...nationalForm,
                requisitosEspecificos: splitRequirements(nationalForm.requisitosEspecificos),
            }

            if (editingNationalId) {
                await updateNationalOpportunity(editingNationalId, payload)
                setFeedback({ type: "success", message: "Oportunidade nacional atualizada." })
            } else {
                await createNationalOpportunity(payload)
                setFeedback({ type: "success", message: "Oportunidade nacional criada." })
            }

            await loadData()
            resetNationalForm()
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel salvar a oportunidade nacional.",
            })
        }
    }

    const handleDeleteInternational = async (id: string) => {
        const confirmed = window.confirm("Deseja realmente excluir esta oportunidade internacional?")
        if (!confirmed) {
            return
        }

        try {
            await deleteInternationalOpportunity(id)
            setFeedback({ type: "success", message: "Oportunidade internacional removida." })
            await loadData()
            if (editingInternationalId === id) {
                resetInternationalForm()
            }
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel excluir a oportunidade internacional.",
            })
        }
    }

    const handleDeleteNational = async (id: string) => {
        const confirmed = window.confirm("Deseja realmente excluir esta oportunidade nacional?")
        if (!confirmed) {
            return
        }

        try {
            await deleteNationalOpportunity(id)
            setFeedback({ type: "success", message: "Oportunidade nacional removida." })
            await loadData()
            if (editingNationalId === id) {
                resetNationalForm()
            }
        } catch (error) {
            setFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Nao foi possivel excluir a oportunidade nacional.",
            })
        }
    }

    if (isPending || isLoading) {
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

                <div className="mb-4 flex gap-2">
                    <button
                        className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "internacional" ? "bg-blue-500 text-white" : "bg-slate-900 text-slate-200"}`}
                        onClick={() => setActiveTab("internacional")}
                        type="button"
                    >
                        Internacionais
                    </button>
                    <button
                        className={`rounded-lg px-4 py-2 font-semibold ${activeTab === "nacional" ? "bg-amber-500 text-black" : "bg-slate-900 text-slate-200"}`}
                        onClick={() => setActiveTab("nacional")}
                        type="button"
                    >
                        Nacionais
                    </button>
                </div>

                {feedback && (
                    <div
                        className={`mb-4 rounded-lg p-3 ${feedback.type === "success" ? "bg-green-900/40 text-green-200" : "bg-red-900/40 text-red-200"}`}
                    >
                        {feedback.message}
                    </div>
                )}

                {activeTab === "internacional" ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                            <h2 className="mb-3 font-bold text-blue-400 text-xl">Registros</h2>
                            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                                {internationalList.map((item) => (
                                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3" key={item.id}>
                                        <p className="font-semibold text-white">{item.nome}</p>
                                        <p className="text-sm text-slate-400">{item.pais}</p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="rounded-md bg-slate-800 px-3 py-1 text-sm"
                                                onClick={() => handleEditInternational(item)}
                                                type="button"
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <FaEdit /> Editar
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-md bg-red-700 px-3 py-1 text-sm text-white"
                                                onClick={() => handleDeleteInternational(item.id)}
                                                type="button"
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <FaTrash /> Excluir
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="font-bold text-blue-400 text-xl">
                                    {editingInternationalId ? "Editar Oportunidade" : "Nova Oportunidade"}
                                </h2>
                                <button
                                    className="rounded-md bg-slate-800 px-3 py-1 text-sm"
                                    onClick={resetInternationalForm}
                                    type="button"
                                >
                                    Limpar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {[
                                    ["nome", "Nome"],
                                    ["imagem", "Imagem (URL)"],
                                    ["pais", "Pais"],
                                    ["cidade", "Cidade"],
                                    ["instituicaoResponsavel", "Instituicao"],
                                    ["tipo", "Tipo"],
                                    ["nivelEnsino", "Nivel de ensino"],
                                    ["faixaEtaria", "Faixa etaria"],
                                    ["requisitosIdioma", "Requisitos de idioma"],
                                    ["taxaAplicacao", "Taxa de aplicacao"],
                                    ["tipoBolsa", "Tipo de bolsa"],
                                    ["coberturaBolsa", "Cobertura da bolsa"],
                                    ["custosExtras", "Custos extras"],
                                    ["duracao", "Duracao"],
                                    ["prazoInscricao", "Prazo (dd/mm/aaaa)"],
                                    ["etapasSelecao", "Etapas de selecao"],
                                    ["processoInscricao", "Processo de inscricao"],
                                    ["linkOficial", "Link oficial"],
                                    ["contato", "Contato"],
                                ].map(([key, label]) => (
                                    <label className="flex flex-col gap-1" key={key}>
                                        <span className="text-slate-300 text-sm">{label}</span>
                                        <input
                                            className="rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                            onChange={(e) =>
                                                handleInternationalChange(
                                                    key as keyof InternationalOpportunityInput,
                                                    e.target.value
                                                )
                                            }
                                            value={internationalForm[key as keyof InternationalOpportunityInput]}
                                        />
                                    </label>
                                ))}

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">Descricao</span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) => handleInternationalChange("descricao", e.target.value)}
                                        value={internationalForm.descricao}
                                    />
                                </label>

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">Requisitos especificos</span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) =>
                                            handleInternationalChange("requisitosEspecificos", e.target.value)
                                        }
                                        value={internationalForm.requisitosEspecificos}
                                    />
                                </label>
                            </div>

                            <button
                                className="mt-4 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white"
                                onClick={handleSaveInternational}
                                type="button"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FaPlus /> {editingInternationalId ? "Atualizar" : "Criar"}
                                </span>
                            </button>
                        </section>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                            <h2 className="mb-3 font-bold text-amber-500 text-xl">Registros</h2>
                            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                                {nationalList.map((item) => (
                                    <div className="rounded-lg border border-slate-800 bg-slate-950 p-3" key={item.id}>
                                        <p className="font-semibold text-white">{item.nome}</p>
                                        <p className="text-sm text-slate-400">{item.cidadeEstado}</p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="rounded-md bg-slate-800 px-3 py-1 text-sm"
                                                onClick={() => handleEditNational(item)}
                                                type="button"
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <FaEdit /> Editar
                                                </span>
                                            </button>
                                            <button
                                                className="rounded-md bg-red-700 px-3 py-1 text-sm text-white"
                                                onClick={() => handleDeleteNational(item.id)}
                                                type="button"
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <FaTrash /> Excluir
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="font-bold text-amber-500 text-xl">
                                    {editingNationalId ? "Editar Oportunidade" : "Nova Oportunidade"}
                                </h2>
                                <button
                                    className="rounded-md bg-slate-800 px-3 py-1 text-sm"
                                    onClick={resetNationalForm}
                                    type="button"
                                >
                                    Limpar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {[
                                    ["nome", "Nome"],
                                    ["imagem", "Imagem (URL)"],
                                    ["pais", "Pais"],
                                    ["tipo", "Tipo"],
                                    ["nivelEnsino", "Nivel de ensino"],
                                    ["modalidade", "Modalidade"],
                                    ["prazoInscricao", "Prazo (dd/mm/aaaa)"],
                                    ["duracao", "Duracao"],
                                    ["cidadeEstado", "Cidade/Estado"],
                                    ["faixaEtaria", "Faixa etaria"],
                                    ["instituicaoResponsavel", "Instituicao"],
                                    ["taxaAplicacao", "Taxa de aplicacao"],
                                    ["beneficios", "Beneficios"],
                                    ["custos", "Custos"],
                                    ["custosExtras", "Custos extras"],
                                    ["etapasSelecao", "Etapas de selecao"],
                                    ["linkOficial", "Link oficial"],
                                    ["contato", "Contato"],
                                ].map(([key, label]) => (
                                    <label className="flex flex-col gap-1" key={key}>
                                        <span className="text-slate-300 text-sm">{label}</span>
                                        <input
                                            className="rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                            onChange={(e) =>
                                                handleNationalChange(
                                                    key as keyof NationalFormState,
                                                    e.target.value
                                                )
                                            }
                                            value={nationalForm[key as keyof NationalFormState]}
                                        />
                                    </label>
                                ))}

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">Sobre</span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) => handleNationalChange("sobre", e.target.value)}
                                        value={nationalForm.sobre}
                                    />
                                </label>

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">Descricao breve</span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) => handleNationalChange("descricaoBreve", e.target.value)}
                                        value={nationalForm.descricaoBreve}
                                    />
                                </label>

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">Requisitos</span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) => handleNationalChange("requisitos", e.target.value)}
                                        value={nationalForm.requisitos}
                                    />
                                </label>

                                <label className="md:col-span-2 flex flex-col gap-1">
                                    <span className="text-slate-300 text-sm">
                                        Requisitos especificos (um por linha)
                                    </span>
                                    <textarea
                                        className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                                        onChange={(e) =>
                                            handleNationalChange("requisitosEspecificos", e.target.value)
                                        }
                                        value={nationalForm.requisitosEspecificos}
                                    />
                                </label>
                            </div>

                            <button
                                className="mt-4 rounded-lg bg-amber-500 px-4 py-2 font-semibold text-black"
                                onClick={handleSaveNational}
                                type="button"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FaPlus /> {editingNationalId ? "Atualizar" : "Criar"}
                                </span>
                            </button>
                        </section>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminPage
