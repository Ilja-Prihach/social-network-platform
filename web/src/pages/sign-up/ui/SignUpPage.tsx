'use client';

import { Icon } from '@/shared/ui/Icon';
import { SignUpForm } from '@/widgets/auth/sign-up-form';
import { Button } from '@/shared/ui/Button';
import { useDictionary } from 'next-intlayer';
import signUpContent from '../sign-up.content';
import { useOauthLogin } from '@/features/auth/oauth';
import { AuthPageShell } from '@auth-ui/auth-page-shell';

export function SignUpPage() {
  const content = useDictionary(signUpContent);
  const { startGithubLogin, startGoogleLogin } = useOauthLogin();

  return (
    <AuthPageShell
      variant="sign-up"
      title={content.title}
      social={
        <>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              startGoogleLogin();
            }}
          >
            <Icon iconId={'google-svgrepo-com 1'} width={'36px'} height={'36px'} />
          </a>
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              startGithubLogin();
            }}
          >
            <Icon
              iconId={'github-svgrepo-com (3) 1'}
              width={'36px'}
              height={'36px'}
              style={{ color: 'var(--light-100-color)' }}
            />
          </a>
        </>
      }
      form={<SignUpForm />}
      footerText={content.hasAccount}
      footerAction={
        <Button href="/sign-in" variant="text">
          {content.signIn}
        </Button>
      }
    />
  );
}
