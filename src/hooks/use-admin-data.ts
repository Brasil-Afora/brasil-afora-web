import { useCallback, useEffect, useMemo, useState } from "react"
import { useSession } from "../lib/auth-client"
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
} from "../lib/opportunities-api"

interface FeedbackState {
  message: string
  type: "error" | "success"
}

interface NationalFormState
  extends Omit<NationalOpportunityInput, "requisitosEspecificos"> {
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

function useAdminData() {
  const { data: session, isPending: isSessionPending } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const [internationalList, setInternationalList] = useState<
    InternationalOpportunity[]
  >([])
  const [nationalList, setNationalList] = useState<NationalOpportunity[]>([])

  const [internationalForm, setInternationalForm] =
    useState<InternationalOpportunityInput>(initialInternationalForm)
  const [nationalForm, setNationalForm] =
    useState<NationalFormState>(initialNationalForm)

  const [editingInternationalId, setEditingInternationalId] = useState<
    string | null
  >(null)
  const [editingNationalId, setEditingNationalId] = useState<string | null>(null)

  const isAdmin = useMemo(() => {
    const role = (session?.user as { role?: string } | undefined)?.role
    return role === "admin"
  }, [session?.user])

  const loadData = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const resetInternationalForm = useCallback(() => {
    setEditingInternationalId(null)
    setInternationalForm(initialInternationalForm)
  }, [])

  const resetNationalForm = useCallback(() => {
    setEditingNationalId(null)
    setNationalForm(initialNationalForm)
  }, [])

  const handleInternationalChange = useCallback(
    (field: keyof InternationalOpportunityInput, value: string) => {
      setInternationalForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleNationalChange = useCallback(
    (field: keyof NationalFormState, value: string) => {
      setNationalForm((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleEditInternational = useCallback(
    (item: InternationalOpportunity) => {
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
    },
    []
  )

  const handleEditNational = useCallback((item: NationalOpportunity) => {
    setEditingNationalId(item.id)
    setNationalForm({
      beneficios: item.beneficios,
      cidadeEstado: item.cidadeEstado,
      contato: item.contato,
      custos: item.custos,
      custosExtras: item.custosExtras,
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
  }, [])

  const handleSaveInternational = useCallback(async () => {
    try {
      setFeedback(null)
      if (editingInternationalId) {
        await updateInternationalOpportunity(
          editingInternationalId,
          internationalForm
        )
        setFeedback({
          type: "success",
          message: "Oportunidade internacional atualizada.",
        })
      } else {
        await createInternationalOpportunity(internationalForm)
        setFeedback({
          type: "success",
          message: "Oportunidade internacional criada.",
        })
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
  }, [
    editingInternationalId,
    internationalForm,
    loadData,
    resetInternationalForm,
  ])

  const handleSaveNational = useCallback(async () => {
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
  }, [editingNationalId, nationalForm, loadData, resetNationalForm])

  const handleDeleteInternational = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        "Deseja realmente excluir esta oportunidade internacional?"
      )
      if (!confirmed) {
        return
      }

      try {
        await deleteInternationalOpportunity(id)
        setFeedback({
          type: "success",
          message: "Oportunidade internacional removida.",
        })
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
    },
    [editingInternationalId, loadData, resetInternationalForm]
  )

  const handleDeleteNational = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        "Deseja realmente excluir esta oportunidade nacional?"
      )
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
    },
    [editingNationalId, loadData, resetNationalForm]
  )

  return {
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
  }
}

export default useAdminData
export { initialInternationalForm, initialNationalForm }
export type { FeedbackState, NationalFormState }
