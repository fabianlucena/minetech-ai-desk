import CheckboxSelectField from './CheckboxSelectField.jsx';
import Chips from '../Chips.jsx';

export default function ChippedCheckboxSelectField({
  label,
  value,
  onChange,
  options = [],
  renderValue,
  multiple = false,
}) {
  const defaultRenderValue = multiple
    ? (selected) => <Chips
        chips={options.filter((option) => selected.includes(option.value))}
        mapper={option => ({ id: option.value, label: option.label, title: option.title })}
      />
    : (selected) => <Chips
        chips={options.filter((option) => selected === option.value)}
        mapper={option => ({ id: option.value, label: option.label, title: option.title })}
      />;

  return <CheckboxSelectField
    label={label}
    value={value}
    onChange={onChange}
    options={options}
    renderValue={renderValue || defaultRenderValue}
    multiple={multiple}
  />;
}