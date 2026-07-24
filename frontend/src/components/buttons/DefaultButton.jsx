import Button from './Button';

export default function DefaultButton({ ...props }) {
  return <Button {...{ ...props, default: true }} />;
}