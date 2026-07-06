import CheckboxSelectField from './CheckboxSelectField.jsx';
import Chips from '../Chips.jsx';

export default function ChippedCheckboxSelectField({
  value,
  onChange,
  options = [],
  renderValue,
  multiple = false,
}) {
  const defaultRenderValue = selected => <Chips
    chips={options.filter((option) => selected.includes(option.value))}
    mapper={option => ({ id: option.value, label: option.label, title: option.title })}
  />;
    
  return <CheckboxSelectField
    value={value}
    onChange={onChange}
    options={options}
    renderValue={renderValue || defaultRenderValue}
    multiple={multiple}
  />;
}