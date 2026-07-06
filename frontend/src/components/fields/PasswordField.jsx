import { useState, useEffect } from 'react';
import TextField from './TextField';
import {ShowButton, HideButton } from '../buttons';

export default function PasswordField({
  showHidePassword,
  type = 'password',
  tools,
  ...props
}) {
  const [effectiveType, setEffectiveType] = useState(type || 'password');
  const [showPassword, setShowPassword] = useState(effectiveType === 'text');
  const [effectiveTools, setEffectiveTools] = useState(null);

  useEffect(() => {
    if (!showHidePassword)
      return;

    if (showPassword) {
      setEffectiveType(type);
      setEffectiveTools(<>
        {tools}
        <HideButton
          onClick={() => setShowPassword(false)}
        />
      </>);
    } else {
      setEffectiveType('text');
      setEffectiveTools(<>
        {tools}
        <ShowButton
          onClick={() => setShowPassword(true)}
        />
      </>);
    }
  }, [showHidePassword, showPassword]);

  return <TextField
    type={effectiveType}
    tools={effectiveTools}
    {...props}
  />
}