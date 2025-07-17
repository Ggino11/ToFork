'use client';

declare global {
    interface Window {
      google: any;
    }
  }
  

import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin')!,
        { theme: 'outline', size: 'large' }
      );
    };
  }, []);

  function handleCredentialResponse(response: any) {
    const user = parseJwt(response.credential);
    alert('Login riuscito:\\n' + JSON.stringify(user, null, 2));
  }

  function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`
    ).join(''));
    return JSON.parse(jsonPayload);
  }

  return (
    <main>
      <h2>Login con Google</h2>
      <div id="google-signin"></div>
    </main>
  );
}
