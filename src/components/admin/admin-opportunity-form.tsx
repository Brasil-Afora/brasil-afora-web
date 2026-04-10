import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { FaCheck, FaPlus, FaRegCopy } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldConfig {
  key: string
  label: string
  type?: "input" | "textarea"
}

interface AdminOpportunityFormProps {
  accentColor: "amber" | "blue"
  editingId: string | null
  editingName?: string | null
  fields: FormFieldConfig[]
  filterOptions?: Record<string, string[]>
  formData: Record<string, string>
  formMode: "campos" | "texto" | "template"
  jsonInput: string
  onCopyTemplate?: (template: string) => void
  onFormChange: (key: string, value: string) => void
  onJsonInputChange: (value: string) => void
  onReset: () => void
  onSave: (values?: Record<string, string>) => void | Promise<void>
  onSaveText?: () => void
  setFormMode: (mode: "campos" | "texto" | "template") => void
  textareaFields: FormFieldConfig[]
  title: string
}

const AdminOpportunityForm = ({
  title,
  editingId,
  editingName,
  formMode,
  setFormMode,
  formData,
  filterOptions,
  onFormChange,
  jsonInput,
  onJsonInputChange,
  onCopyTemplate,
  onSave,
  onSaveText,
  onReset,
  fields,
  textareaFields,
  accentColor,
}: AdminOpportunityFormProps) => {
  const [templateCopied, setTemplateCopied] = useState(false)

  const { control, handleSubmit, reset } = useForm<Record<string, string>>({
    defaultValues: formData,
  })

  useEffect(() => {
    reset(formData)
  }, [formData, reset])

  const titleColorClass =
    accentColor === "blue" ? "text-blue-400" : "text-amber-500"
  const buttonColorClass =
    accentColor === "blue"
      ? "bg-blue-500 text-white"
      : "bg-amber-500 text-black"
  const modeButtonActiveClass =
    accentColor === "blue"
      ? "bg-blue-500 text-white"
      : "bg-amber-500 text-black"

  const allFieldKeys = [...fields, ...textareaFields]
    .map((f) => f.key)
    .join(", ")

  const templateText = useMemo(() => {
    return [...fields, ...textareaFields]
      .map(({ key }) => `${key}: `)
      .join("\n")
  }, [fields, textareaFields])

  const filterOptionsEntries = useMemo(() => {
    if (!filterOptions) {
      return []
    }

    return Object.entries(filterOptions)
      .filter(([, values]) => values.length > 0)
      .map(([field, values]) => ({
        field,
        values: values.join(", "),
      }))
  }, [filterOptions])

  const handleCopyTemplate = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(templateText)
      } else {
        throw new Error("Clipboard API indisponivel")
      }

      onCopyTemplate?.(templateText)
      setTemplateCopied(true)
      window.setTimeout(() => {
        setTemplateCopied(false)
      }, 2000)
    } catch {
      // Fallback silencioso para manter fluxo sem quebra em browsers restritos.
    }
  }

  const handleSaveFields = handleSubmit(async (values) => {
    for (const [key, value] of Object.entries(values)) {
      onFormChange(key, value ?? "")
    }

    await onSave(values)
  })

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className={`font-bold ${titleColorClass} text-xl`}>
          {editingId && editingName ? editingName : editingId ? "Editando oportunidade" : title}
        </h2>
        <Button
          className="rounded-md bg-slate-800 px-3 py-1 text-sm"
          onClick={onReset}
          type="button"
          variant="ghost"
        >
          Limpar
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          className={`rounded-lg px-3 py-1 font-semibold text-sm ${formMode === "campos" ? modeButtonActiveClass : "bg-slate-800 text-slate-300"}`}
          onClick={() => setFormMode("campos")}
          type="button"
          variant="ghost"
        >
          Campos Separados
        </Button>
        <Button
          className={`rounded-lg px-3 py-1 font-semibold text-sm ${formMode === "texto" ? modeButtonActiveClass : "bg-slate-800 text-slate-300"}`}
          onClick={() => setFormMode("texto")}
          type="button"
          variant="ghost"
        >
          Colar Texto
        </Button>
        <Button
          className={`rounded-lg px-3 py-1 font-semibold text-sm ${formMode === "template" ? modeButtonActiveClass : "bg-slate-800 text-slate-300"}`}
          onClick={() => setFormMode("template")}
          type="button"
          variant="ghost"
        >
          Template
        </Button>
      </div>

      {formMode === "campos" && (
        <>
          <FieldGroup className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields.map(({ key, label }) => (
              <Field className="gap-1" key={key}>
                <FieldLabel className="text-slate-300 text-sm" htmlFor={key}>
                  {label}
                </FieldLabel>
                <Controller
                  control={control}
                  name={key}
                  render={({ field }) => (
                    <Input
                      className="rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                      id={key}
                      onChange={(event) => {
                        field.onChange(event.target.value)
                        onFormChange(key, event.target.value)
                      }}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </Field>
            ))}

            {textareaFields.map(({ key, label }) => (
              <Field className="gap-1 md:col-span-2" key={key}>
                <FieldLabel className="text-slate-300 text-sm" htmlFor={key}>
                  {label}
                </FieldLabel>
                <Controller
                  control={control}
                  name={key}
                  render={({ field }) => (
                    <Textarea
                      className="min-h-24 rounded-md border border-slate-700 bg-slate-950 p-2 text-sm"
                      id={key}
                      onChange={(event) => {
                        field.onChange(event.target.value)
                        onFormChange(key, event.target.value)
                      }}
                      value={field.value ?? ""}
                    />
                  )}
                />
              </Field>
            ))}
          </FieldGroup>

          <Button
            className={`mt-4 rounded-lg ${buttonColorClass} px-4 py-2 font-semibold`}
            onClick={handleSaveFields}
            type="button"
            variant="ghost"
          >
            <span className="inline-flex items-center gap-2">
              <FaPlus /> {editingId ? "Atualizar" : "Criar"}
            </span>
          </Button>
        </>
      )}

      {formMode === "texto" && (
        <>
          <div className="mb-3 rounded-lg bg-slate-800/50 p-3 text-slate-400 text-xs">
            <p className="font-semibold text-slate-300">
              Cole o texto no formato "chave: valor" (uma por linha).
            </p>
            <p className="mt-1 text-slate-500">
              Dica: use a aba "Template" para copiar o modelo completo.
            </p>
          </div>

          <Field className="gap-1">
            <Controller
              control={control}
              name="jsonInput"
              render={() => (
                <Textarea
                  className="min-h-96 rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-sm"
                  onChange={(event) => onJsonInputChange(event.target.value)}
                  placeholder={
                    "nome: Bolsa de Estudos XYZ\npais: Alemanha\ncidade: Berlim\ninstituicao: Universidade de Berlim\ntipo: Mestrado\n..."
                  }
                  value={jsonInput}
                />
              )}
            />
          </Field>

          <Button
            className={`mt-4 rounded-lg ${buttonColorClass} px-4 py-2 font-semibold`}
            onClick={onSaveText}
            type="button"
            variant="ghost"
          >
            <span className="inline-flex items-center gap-2">
              <FaPlus /> {editingId ? "Atualizar" : "Criar"}
            </span>
          </Button>
        </>
      )}

      {formMode === "template" && (
        <div className="mb-3 rounded-lg bg-slate-800/50 p-3 text-slate-400 text-xs">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-slate-300">
              Modelo no formato "chave: valor" (uma por linha):
            </p>
            <Button
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100 text-xs hover:bg-slate-800"
              onClick={handleCopyTemplate}
              type="button"
              variant="ghost"
            >
              <span className="inline-flex items-center gap-2">
                {templateCopied ? <FaCheck /> : <FaRegCopy />}
                {templateCopied ? "Copiado" : "Copiar Template"}
              </span>
            </Button>
          </div>
          <code className="block whitespace-pre-wrap text-slate-500">
            {templateText}
          </code>
          <p className="mt-2 text-slate-500">Campos disponíveis: {allFieldKeys}</p>
          {filterOptionsEntries.length > 0 && (
            <div className="mt-3 rounded-md border border-slate-700/60 bg-slate-900/70 p-2 text-slate-400 text-xs">
              <p className="font-semibold text-slate-300">
                Opcoes validas para campos com filtro:
              </p>
              <ul className="mt-1 space-y-1">
                {filterOptionsEntries.map((entry) => (
                  <li key={entry.field}>
                    <span className="font-semibold text-slate-300">
                      {entry.field}:
                    </span>{" "}
                    {entry.values}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default AdminOpportunityForm
