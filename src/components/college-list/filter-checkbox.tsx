interface FilterCheckboxProps {
  isChecked: boolean
  onChange: () => void
  value: string
}

const FilterCheckbox = ({
  value,
  isChecked,
  onChange,
}: FilterCheckboxProps) => (
  <label className="flex cursor-pointer items-center space-x-2 rounded p-1 text-sm text-white hover:bg-slate-800">
    <input
      checked={isChecked}
      className="h-4 w-4 rounded border-slate-900 bg-slate-950 text-amber-500"
      onChange={onChange}
      type="checkbox"
    />
    <span>{value}</span>
  </label>
)

export default FilterCheckbox
