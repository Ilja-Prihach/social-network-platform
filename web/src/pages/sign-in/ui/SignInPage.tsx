'use client';

import { Icon } from '@/shared/ui/Icon';
import { Button } from '@/shared/ui/Button';
import { SignInForm } from '@/features/auth/sign-in-form/ui/SignInForm';
import { useDictionary } from 'next-intlayer';
import signInContent from '../sign-in.content';
import { useOauthLogin } from '@/features/auth/oauth';
import { AuthPageShell } from '@auth-ui/auth-page-shell';

export function SignInPage() {
  const content = useDictionary(signInContent);
  const { startGithubLogin, startGoogleLogin } = useOauthLogin();

  return (
    <AuthPageShell
      variant="sign-in"
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
              color={'white'}
            />
          </a>
        </>
      }
      form={<SignInForm />}
      footerText={content.noAccount}
      footerAction={
        <Button href="/sign-up" variant="text">
          {content.signUp}
        </Button>
      }
    />
  );
}
