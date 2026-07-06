import { useState, useEffect } from 'react';
import TextField from './TextField';
import {ShowButton, HideButton } from '../buttons';

export default function PasswordField({
  showHidePassword,
  showPassword = false,
  type = 'password',
  tools,
  ...props
}) {
  const [effectiveType, setEffectiveType] = useState(type || 'password');
  const [effectiveShowPassword, setEffectiveShowPassword] = useState(showPassword);
  const [effectiveTools, setEffectiveTools] = useState(null);

  useEffect(() => {
    if (!showHidePassword)
      return;

    if (effectiveShowPassword) {
      setEffectiveType('text');
      setEffectiveTools(<>
        {tools}
        <HideButton
          onClick={() => setEffectiveShowPassword(false)}
        />
      </>);
    } else {
      setEffectiveType(type);
      setEffectiveTools(<>
        {tools}
        <ShowButton
          onClick={() => setEffectiveShowPassword(true)}
        />
      </>);
    }
  }, [showHidePassword, effectiveShowPassword]);

  return <TextField
    type={effectiveType}
    tools={effectiveTools}
    {...props}
  />
}