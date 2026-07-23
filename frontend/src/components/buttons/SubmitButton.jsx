import Button from './Button';

export default function SubmitButton({ ...props }) {
  return <Button {...{ ...props, type: 'submit' }} />;
}