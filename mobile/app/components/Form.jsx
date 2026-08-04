import { View } from 'react-native';
import { FormProvider } from "./FormContext";
import Title from './Title.jsx';
import Button from './Button.jsx';

export default function Form({
  title,
  children,
  onSubmit,
  submitLabel = 'Enviar',
  onCancel,
  cancelLabel = 'Cancelar',
  ...props
}) {
  function submitHandler() {
    if (onSubmit)
      onSubmit();
  }

  function cancelHandler() {
    if (onCancel) 
      onCancel();
  }

  return <FormProvider
    onSubmit={submitHandler}
    onCancel={cancelHandler}
  >
    <View
      {...props}
      onKeyDown={(e) => {
        if (e.key === 'Enter') submitHandler();
        if (e.key === 'Escape') cancelHandler();
      }}
    >
      {title && <Title>{title}</Title>}
      {children}
      {onSubmit && <Button onPress={onSubmit} label={submitLabel} />}
      {onCancel && <Button onPress={onCancel} label={cancelLabel} />}
    </View>
  </FormProvider>;
}