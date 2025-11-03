# Environment configuration

This project uses Angular's `src/environments` files to provide environment-specific configuration (API base URL, feature flags, etc.). The repository contains:

- `src/environments/environment.ts` — default (development) values used during `ng serve` and development builds.
- `src/environments/environment.staging.ts` — staging values. Use `--configuration=staging` when serving or building.
- `src/environments/environment.prod.ts` — production values used by production builds.

Each file exports an `environment` object. Typical properties used by this project:

- `apiBaseUrl` (string) — base URL of the backend API, e.g. `https://api.example.com`.
- `captchaEndpoint` or related settings — if your backend returns captcha headers, ensure `apiBaseUrl` points to the correct host.
- `production` (boolean) — standard Angular flag.

Example (minimal) `environment.ts`:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:5001',
};
```

How to use different environments

- Development (default):

  ```bash
  pnpm install
  pnpm start
  # or
  npm install
  npm start
  ```

  The project's `package.json` includes `start` scripts that try to configure SSL certs on macOS/Windows for local ASP.NET Core backends. If you prefer a plain `ng serve` without those scripts, run:

  ```bash
  ng serve --host 127.0.0.1
  ```

- Serve staging config:

  ```bash
  ng serve --configuration=staging
  ```

- Build for production:

  ```bash
  ng build --configuration=production
  ```

Proxying API requests in development

If you want to proxy API calls to a backend during development (to avoid CORS), use the `proxy.conf.js` in the project root. Example:

```bash
ng serve --proxy-config proxy.conf.js
```

CORS and custom response headers

If your frontend needs to read custom response headers (for example `X-CaptchaId` returned by a renew-captcha endpoint), the backend must expose those headers to the browser:

- Add the header name to `Access-Control-Expose-Headers` on the server response.
- Ensure CORS preflight allows any request headers you send (for example `X-Requested-With` or custom headers).

For example (server-side response headers):

```
Access-Control-Allow-Origin: https://localhost:4200
Access-Control-Expose-Headers: X-CaptchaId
```

Where to change settings in code

- The Angular code reads environment values from `src/environments/environment.ts` (and environment-specific files during builds). Update `apiBaseUrl` there.
- If you need to change the captcha handling or TTL behavior, see `src/app/core/services/captcha.service.ts`.

Troubleshooting

- If headers present in server logs are not visible in the browser client, verify `Access-Control-Expose-Headers` is set for that header.
- If you're seeing runtime template errors (e.g. "reading 'control' of undefined"), ensure your form-control bindings are present before PrimeNG components instantiate — this project uses safe template patterns to avoid such errors.

If you want, I can:

- Add a small script to copy a `.env.example` into `src/environments/environment.ts` for easier onboarding.
- Add a short CI/build note for deploying production assets.

