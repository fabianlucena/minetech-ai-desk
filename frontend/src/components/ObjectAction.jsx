export default function ObjectAction({
  icon,
  label,
  onClick,
  ...props
}) {
  return <div
    onClick={onClick}
    title={label}
    {...props}
  >
    {icon}
  </div>;
}