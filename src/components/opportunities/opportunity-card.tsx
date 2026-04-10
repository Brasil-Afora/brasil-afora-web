import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag } from "react-icons/fa"
import { Link } from "react-router-dom"
import {
  getTimeRemaining,
  getTimeRemainingBadgeClass,
} from "../../lib/date-utils"
import type { Opportunity, OpportunityCardConfig } from "./types"
import {
  getOpportunityLocation,
  getScholarshipTagClasses,
  isInternationalOpportunity,
  isNationalOpportunity,
} from "./types"

interface OpportunityCardProps {
  config: OpportunityCardConfig
  index: number
  isVisible: boolean
  opportunity: Opportunity
}

const OpportunityCard = ({
  opportunity,
  config,
  isVisible,
  index,
}: OpportunityCardProps) => {
  const {
    accentColor,
    basePath,
    showScholarship,
    showDuration,
    showModalidade,
  } = config

  const timeRemaining = getTimeRemaining(opportunity.prazoInscricao)
  const deadlineBadgeClass = getTimeRemainingBadgeClass(
    opportunity.prazoInscricao
  )
  const iconColorClass =
    accentColor === "blue" ? "text-blue-400" : "text-amber-500"
  const hoverShadowClass =
    accentColor === "blue"
      ? "hover:shadow-blue-500/30"
      : "hover:shadow-amber-500/30"

  const scholarshipClasses =
    isInternationalOpportunity(opportunity) && showScholarship
      ? getScholarshipTagClasses(opportunity.tipoBolsa)
      : ""

  return (
    <Link
      className={`relative flex transform cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-950 bg-slate-900 shadow-2xl transition-all duration-500 ease-in-out hover:scale-105 ${hoverShadowClass} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      key={opportunity.id}
      to={`${basePath}/${opportunity.id}`}
    >
      {timeRemaining && (
        <div
          className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 font-bold text-xs ${deadlineBadgeClass}`}
        >
          {timeRemaining}
        </div>
      )}

      <div className="relative h-44">
        <img
          alt={`Capa de ${opportunity.nome}`}
          className="h-full w-full object-cover"
          height={176}
          onError={(e) => {
            e.currentTarget.src = "/home.png"
          }}
          src={opportunity.imagem}
          width={400}
        />
      </div>

      <div className="flex grow flex-col p-4">
        <div className="mb-2 flex min-h-14 items-center">
          <h2 className="line-clamp-2 font-bold text-white text-xl">
            {opportunity.nome}
          </h2>
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-2">
          {opportunity.nivelEnsino && (
            <span className="rounded-full bg-slate-950 px-2 py-1 font-semibold text-white text-xs">
              {opportunity.nivelEnsino}
            </span>
          )}
          {isInternationalOpportunity(opportunity) &&
            showScholarship &&
            opportunity.tipoBolsa && (
              <span
                className={`${scholarshipClasses} rounded-full px-2 py-1 font-semibold text-xs`}
              >
                {opportunity.tipoBolsa}
              </span>
            )}
          {isNationalOpportunity(opportunity) && showModalidade && (
            <span className="rounded-full bg-slate-950 px-2 py-1 font-semibold text-white text-xs">
              {opportunity.modalidade}
            </span>
          )}
        </div>

        <div className="flex grow flex-col justify-end text-white">
          <div className="mb-1 flex items-center space-x-2">
            <FaTag className={`${iconColorClass} text-sm`} />
            <span className="text-sm">{opportunity.tipo}</span>
          </div>
          <div className="mb-1 flex items-center space-x-2">
            <FaMapMarkerAlt className={`${iconColorClass} text-sm`} />
            <span className="text-sm">
              {getOpportunityLocation(opportunity)}
            </span>
          </div>
          <div className="mb-1 flex items-center space-x-2">
            <FaCalendarAlt className={`${iconColorClass} text-sm`} />
            <span className="text-sm">Prazo: {opportunity.prazoInscricao}</span>
          </div>
          {showDuration && isInternationalOpportunity(opportunity) && (
            <div className="flex items-center space-x-2">
              <FaClock className={`${iconColorClass} text-sm`} />
              <span className="text-sm">Duração: {opportunity.duracao}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default OpportunityCard
