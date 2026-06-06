import { signIn } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // Security check: Only allow in development mode or specifically configured preview environments
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview") {
    return NextResponse.json({ error: "Demo route is disabled in production." }, { status: 403 });
  }

  // NextAuth v5 server-side sign-in usually redirects automatically
  try {
    // We can initiate a credential sign-in using the seeded demo credentials
    // Note: Calling signIn directly like this in a route handler might require handling the response
    // or utilizing a custom setup. For a true "one-click" without a form post, we can return a form
    // that auto-submits, or use the redirect property.
    
    // The cleanest way for a GET request to trigger a credential login in Auth.js is to render
    // an auto-submitting form with the credentials, or if using a custom adapter/session, 
    // manually creating the session token.
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Logging in as Demo User...</title>
          <style>
            body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fafaf9; color: #171717; }
            .loader { border: 4px solid rgba(13,148,136,0.1); border-left-color: #0d9488; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 16px; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <div class="loader"></div>
            <h2>Preparing your Demo Experience...</h2>
            <p style="color: #666;">Logging you in as Arjun Sharma.</p>
          </div>
          <form id="demo-login" action="/api/auth/callback/credentials" method="POST" style="display: none;">
            <input type="hidden" name="email" value="demo@mindease.app" />
            <input type="hidden" name="password" value="Demo@1234" />
            <input type="hidden" name="callbackUrl" value="/dashboard" />
          </form>
          <script>
            // Add CSRF token if NextAuth requires it
            fetch('/api/auth/csrf').then(res => res.json()).then(data => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'csrfToken';
              input.value = data.csrfToken;
              document.getElementById('demo-login').appendChild(input);
              document.getElementById('demo-login').submit();
            });
          </script>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Demo login failed:", error);
    return NextResponse.redirect(new URL("/login?error=DemoLoginFailed", req.url));
  }
}
