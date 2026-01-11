import { useState } from 'react';

export function useSignUpForm() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({
    userName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agree: false,
  });

  const validate = () => {
    const nextErrors = {
      userName: userName ? '' : 'Username required',
      email: /\S+@\S+\.\S+/.test(email) ? '' : 'Invalid email',
      password: password.length >= 6 ? '' : 'Min 6 chars',
      passwordConfirm: password === passwordConfirm ? '' : 'Passwords do not match',
      agree: !agree,
    };

    setErrors(nextErrors);

    return !Object.values(nextErrors).some(Boolean);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    console.log({
      login: userName,
      email,
      password,
    });
  };

  return {
    values: {
      userName,
      setUserName,
      email,
      setEmail,
      password,
      setPassword,
      passwordConfirm,
      setPasswordConfirm,
    },
    errors,
    agree,
    setAgree,
    submit,
  };
}
