import Button from './Button';

export default function SecondaryButton({
  secondary = true,
  ...props
}) {
  return <Button secondary={secondary} {...props } />;
}