# 03 — About Page + Contact Form (Resend)

- **Estado:** Implemented
- **Fecha:** 2026-06-20
- **Dependencias:** 02-home-page (Navbar ya incluye el link "About" → `/about`;
  tokens CSS y patrón scroll-reveal `.reveal`/`.in` ya establecidos)
- **Objetivo:** Implementar la ruta `/about` con dos secciones (About + Contact)
  y conectar el formulario de contacto a Resend para enviar emails a
  kevindmadrigal@gmail.com.

---

## Scope

### In

- Nueva ruta `/about` (`app/about/page.tsx`) — client component con:
  - **About Hero:** kicker "▸ ABOUT" (neon yellow), título "ABOUT IMK'S PLAYGROUND"
    (gradiente cyan), párrafo de misión, 3 highlight cards con íconos pixel SVG
    (HEART, BROWSER, PLANT) y hover effect
  - **Pixel divider:** barra + 24 puntos animados (`.about-divider`, `.div-bar`, `.div-pixels`)
  - **Contact section:** columna intro (kicker "▸ CONTACT", título, subtítulo,
    3 LED tips) + formulario de contacto
- **Estados del formulario:** idle → sending → success | error
  - `idle`: campos NAME / EMAIL / MESSAGE + botón "▶  SEND MESSAGE"
  - `sending`: botón muestra "▶  SENDING..." y queda deshabilitado
  - `success`: terminal verde arcade con nombre del remitente en mayúsculas
  - `error`: terminal estilo arcade con borde magenta/rojo y mensaje de error
  - Validación client-side: campos vacíos → shake animation, sin llamada a la API
  - "SEND ANOTHER MESSAGE" resetea al estado idle
- **API route** `app/api/contact/route.ts`:
  - POST handler exclusivamente
  - Valida que `name`, `email`, `msg` sean strings no vacíos
  - Instancia el cliente Resend con `RESEND_API_KEY`
  - From: `IMK's Playground <onboarding@resend.dev>`
  - To: `kevindmadrigal@gmail.com`
  - Reply-to: email del remitente del formulario
  - Retorna `{ ok: true }` en éxito, `{ ok: false, error: string }` en fallo
- **Paquete `resend`** instalado vía npm
- **Variable de entorno** `RESEND_API_KEY` en `.env.local` (placeholder; el usuario
  introduce el valor real)
- **CSS de la página About** añadido a `app/globals.css` (clases `.about`, `.about-hero`,
  `.about-title`, `.about-mission`, `.highlight-row`, `.highlight`, `.about-divider`,
  `.div-bar`, `.div-pixels`, `.about-contact`, `.contact-grid`, `.contact-intro`,
  `.contact-title`, `.contact-sub`, `.contact-tips`, `.contact-form`, `.terminal-success`,
  `.term-bar`, `.term-body` y variantes — todas presentes en
  `references/home-about/styles.css`)
- Scroll-reveal (`IntersectionObserver`) en el divider y la sección Contact
  (mismo patrón `.reveal`/`.in` del Home)
- Todo el texto en inglés; plataforma nombrada "IMK'S PLAYGROUND"

### Not In

- Rate limiting o CAPTCHA en la API route
- Adjuntos en el formulario
- Dominio verificado personalizado en Resend (se usa `onboarding@resend.dev`)
- Cualquier cambio a rutas o componentes existentes fuera de `globals.css`
- Backend de autenticación o base de datos
- Tests automatizados

---

## Data Model

No se introducen estructuras de datos persistentes nuevas.

**Payload del formulario (cliente → API):**
```ts
{ name: string; email: string; msg: string }
```

**Respuesta de la API:**
```ts
{ ok: boolean; error?: string }
```

**Variable de entorno:**
```
RESEND_API_KEY=          # en .env.local — el usuario introduce el valor real
```

---

## Implementation Plan

1. **Instalar Resend y preparar entorno.**
   - `npm install resend`
   - Crear `.env.local` con `RESEND_API_KEY=` (placeholder vacío).
   - Verificar que `.env.local` está en `.gitignore`.
   - Verificar: `npm run build` sigue pasando.

2. **Añadir CSS de About a `globals.css`.**
   - Copiar las secciones `/* ===== ABOUT PAGE ===== */` y dependencias auxiliares
     (`.contact-form`, `.terminal-success`, `.term-bar`, `.term-body`, `.btn.press`,
     `.about-divider`, etc.) de `references/home-about/styles.css` al final del
     bloque existente en `app/globals.css`.
   - Ajustar los valores de color a los tokens CSS ya establecidos (`var(--cyan)`, etc.)
     — no introducir nuevas variables.
   - Verificar: `/library` y `/hall-of-fame` no presentan regresión visual.

3. **Crear API route `app/api/contact/route.ts`.**
   - Handler `POST` únicamente; rechaza otros métodos con 405.
   - Valida body: si `name`, `email` o `msg` son vacíos → 400 `{ ok: false, error: 'Missing fields' }`.
   - Instancia `new Resend(process.env.RESEND_API_KEY)`.
   - Llama a `resend.emails.send(...)` con from, to, reply-to, subject y body HTML simple.
   - En éxito → 200 `{ ok: true }`; en excepción → 500 `{ ok: false, error: message }`.
   - Verificar: `curl -X POST /api/contact` con datos válidos retorna `{ ok: true }`.

4. **Construir `app/about/page.tsx`.**
   - Marcar como `'use client'`.
   - Implementar `useReveal()` (mismo `IntersectionObserver` que Home; puede
     extraerse de `app/page.tsx` si ya existe como helper, o reimplementarse inline).
   - Implementar `HighlightIcon({ kind })` (HEART, BROWSER, PLANT — pixel SVGs
     de `references/home-about/about.jsx`, traducidos a JSX de React).
   - Ensamblar About Hero, pixel divider (con `.reveal`), Contact section (con `.reveal`).
   - State machine del formulario: `type Status = 'idle' | 'sending' | 'success' | 'error'`
   - `onSubmit`:
     1. Si algún campo vacío → shake, return.
     2. `setStatus('sending')`.
     3. `fetch('/api/contact', { method: 'POST', ... })`.
     4. Si `ok` → `setStatus('success')` + guardar nombre para mostrar.
     5. Si no → `setStatus('error')` + guardar mensaje de error.
   - Estado `success`: terminal verde con nombre del remitente en mayúsculas.
   - Estado `error`: terminal con borde magenta, línea de error en rojo/magenta.
   - Verificar: `/about` carga, todos los estados del formulario transicionan correctamente.

5. **Style pass y smoke test.**
   - Confirmar consistencia visual con el resto del app (mismos tokens, mismos botones).
   - Probar flujo completo: llenar formulario → submit → verificar email recibido.
   - `npm run build` y lint sin errores.

---

## Acceptance Criteria

**Rutas y navegación**
- [ ] `/about` carga sin errores.
- [ ] El link "About" del Navbar navega a `/about`.

**About Hero**
- [ ] Kicker "▸ ABOUT" visible en neon yellow.
- [ ] Título "ABOUT IMK'S PLAYGROUND" visible con gradiente cyan.
- [ ] Párrafo de misión visible.
- [ ] 3 highlight cards renderizan con íconos pixel SVG (HEART, BROWSER, PLANT).
- [ ] Hover en una highlight card eleva el borde y añade glow.

**Pixel divider**
- [ ] Divider con barras y 24 puntos animados (cyan, magenta, yellow) visible entre secciones.

**Contact section**
- [ ] Intro column muestra kicker "▸ CONTACT", título "CONTACT US", subtítulo y 3 LED tips.
- [ ] Formulario muestra campos NAME, EMAIL ADDRESS, MESSAGE.

**Comportamiento del formulario**
- [ ] Submit con campos vacíos dispara shake animation; no se llama a la API.
- [ ] Submit válido muestra "▶  SENDING..." y deshabilita el botón.
- [ ] Respuesta exitosa muestra terminal verde con nombre del remitente en mayúsculas y caret parpadeante.
- [ ] Respuesta de error muestra terminal con borde magenta y mensaje de error.
- [ ] Botón "SEND ANOTHER MESSAGE" resetea el formulario al estado idle.

**Email**
- [ ] El email llega a kevindmadrigal@gmail.com con nombre, email y mensaje del remitente.
- [ ] El campo Reply-to del email es el email introducido en el formulario.
- [ ] `RESEND_API_KEY` existe en `.env.local` y no está commiteada en git.

**Build**
- [ ] `npm run build` pasa sin errores.
- [ ] ESLint pasa sin errores.

---

## Decisions Taken and Discarded

| # | Decisión | Elegido | Descartado | Justificación |
|---|----------|---------|------------|---------------|
| 1 | Sender de Resend | `onboarding@resend.dev` (sandbox) | Dominio personalizado verificado | El usuario no tiene dominio verificado; el sandbox funciona de inmediato sin configuración extra |
| 2 | Reply-to | Email del remitente (del formulario) | Sin reply-to | Permite responder directamente a quien escribe sin copiar la dirección manualmente |
| 3 | UI de error | Terminal arcade con borde magenta | Toast genérico o texto inline | Consistente con el estado de éxito; mantiene la estética del app |
| 4 | Validación en API | Comprobación manual de strings vacíos | Zod u otro schema validator | No añade dependencias; el input es simple y ya está validado en cliente |
| 5 | Rate limiting | Sin implementar | Upstash / middleware de Next.js | Fuera de scope en esta etapa; el formulario no es de acceso público masivo |
| 6 | Nombre de la plataforma | "IMK'S PLAYGROUND" | "ARCADE VAULT" (referencia) | Decisión #6 del spec 02: todo el contenido adaptado al nombre real del app |
| 7 | Idioma | Inglés | Español (como en la referencia) | Decisión #5 del spec 02: el app usa inglés en todas las pantallas |

---

## Identified Risks

| # | Riesgo | Impacto | Mitigación |
|---|--------|---------|------------|
| 1 | `RESEND_API_KEY` no configurada en producción/staging | La API route retorna 500; el formulario muestra estado de error | Documentar en `.env.local`; el usuario debe replicar la variable en el entorno de deployment |
| 2 | `onboarding@resend.dev` puede aterrizar en spam | El email de contacto nunca llega | Reply-to apunta al remitente, lo que ayuda a Gmail a no marcarlo como spam; mitigación a largo plazo: verificar dominio propio en Resend |
| 3 | Límite del plan gratuito de Resend (100 emails/día) | Los envíos se detienen al alcanzar el cuota | Aceptable en esta etapa; documentar el límite como riesgo conocido |
