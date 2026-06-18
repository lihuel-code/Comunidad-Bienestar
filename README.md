# Comunidad Bienestar — Landing (Next.js)

Landing page para campañas de Google Ads hecha en **Next.js** (App Router): formulario arriba, botones de contacto, foco en mobile y WhatsApp flotante. Pensada para desplegar en **Vercel**, que detecta Next.js solo.

---

## 📁 Estructura

```
comunidad-bienestar-landing/
├── app/
│   ├── layout.js        ← <head>, SEO, Open Graph, dominio del sitio
│   ├── page.js          ← la página (solo monta el componente)
│   ├── Landing.jsx      ← TODO el contenido + formulario + WhatsApp ⭐
│   └── globals.css      ← estilos (colores de marca, tipografías)
├── public/
│   ├── assets/          ← logos, favicon e imagen para compartir (OG)
│   ├── fonts/           ← Poppins y Sacramento (auto-alojadas)
│   ├── site.webmanifest
│   └── robots.txt
├── package.json
├── next.config.mjs
└── .gitignore
```

> Para editar **textos, planes y el número de WhatsApp**, el archivo es **`app/Landing.jsx`**.

---

## 🚀 Subir a GitHub y desplegar en Vercel

### 1. Crear el repositorio en GitHub
1. Entrá a [github.com/new](https://github.com/new).
2. Nombre: `comunidad-bienestar-landing` (o el que quieras).
3. **Create repository** (sin README, ya tenés uno).

### 2. Subir los archivos
La forma más fácil, sin instalar nada:
1. En el repo, hacé clic en **uploading an existing file**.
2. Arrastrá **todo el contenido** de esta carpeta (las carpetas `app` y `public`, y los archivos sueltos).
   - **No subas** `node_modules` ni `.next` si llegaran a aparecer: se generan solos.
3. **Commit changes**.

> Con terminal: `git init`, `git add .`, `git commit -m "primera versión"`, `git branch -M main`, `git remote add origin <URL>`, `git push -u origin main`.

### 3. Conectar con Vercel
1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con GitHub.
2. **Add New… → Project** → elegí el repo → **Import**.
3. Vercel detecta **Next.js** automáticamente. No cambies nada.
4. **Deploy**.

En ~1 minuto tenés tu URL (ej: `https://comunidad-bienestar-landing.vercel.app`). Cada cambio que subas a GitHub se publica solo.

---

## ✏️ Qué revisar / editar

### 1. Número de WhatsApp ⚠️ (importante)
Abrí **`app/Landing.jsx`** y, arriba de todo, está:

```js
const WHATSAPP_NUMBER = "5491153230047";
```

Está en formato internacional sin `+`, espacios ni guiones. Argentina (celular) lleva el **9** después del 54.

**Probá el formulario y los botones.** Si se abre WhatsApp pero **el mensaje no aparece escrito**, cambialo por la versión **sin el 9**:

```js
const WHATSAPP_NUMBER = "541153230047";
```

Cuál funciona depende de cómo está dado de alta el número. Probá ambos.

### 2. Tu dominio (para que el link se vea bien al compartir)
En **`app/layout.js`**, arriba, cambiá:

```js
const SITE_URL = "https://TU-DOMINIO.vercel.app";
```

por tu URL real de Vercel (o tu dominio propio). De ahí salen el `canonical` y la imagen de Open Graph que se ven en WhatsApp/Facebook/Instagram.

### 3. Testimonios (son de ejemplo)
En `app/Landing.jsx`, sección **TESTIMONIOS**: los textos de María, Carolina y Lucía son **de ejemplo**. Reemplazalos por reales (con permiso) o borrá esa sección.

### 4. Textos, planes, contacto
Todo está en `app/Landing.jsx`, en español y con comentarios. Editá lo que quieras.

---

## 📊 Conversión de Google Ads

Para que Ads registre cuando alguien completa el formulario:

1. En Google Ads creá una **acción de conversión** y copiá tu etiqueta (algo como `AW-123456789/AbC-D_efg`).
2. En `app/layout.js`, importá el componente de scripts de Next y pegá el snippet de gtag dentro del `<body>`, antes de `{children}`:

   ```jsx
   import Script from "next/script";
   // ...
   <Script
     src="https://www.googletagmanager.com/gtag/js?id=AW-123456789"
     strategy="afterInteractive"
   />
   <Script id="gtag-init" strategy="afterInteractive">
     {`window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'AW-123456789');`}
   </Script>
   ```

3. En `app/Landing.jsx`, completá tu etiqueta en `GADS_CONVERSION.send_to` y **descomentá** las líneas dentro de `trackConversion()`. Esa función ya se llama sola al enviar el formulario.

---

## 📩 (Opcional) Recibir los formularios por email

Por defecto, el formulario **solo abre WhatsApp** con los datos escritos. Si además querés que te lleguen por mail:

1. Creá un formulario gratis en [formspree.io](https://formspree.io).
2. En `app/Landing.jsx`, pegá tu endpoint:

   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/xxxxxxx";
   ```

Así cada envío abre WhatsApp **y** te manda una copia por email.

---

## 💻 Probar en tu compu (opcional)

Necesitás [Node.js](https://nodejs.org) (versión 18.18 o superior). En una terminal, dentro de la carpeta:

```bash
npm install      # solo la primera vez
npm run dev      # arranca en http://localhost:3000
```

Para probar la versión final optimizada (como en Vercel):

```bash
npm run build
npm run start
```

---

## 🎨 Marca

- **Colores:** violeta `#9B22BD`, verde `#A7DF65`, gris `#878787`.
- **Tipografías:** Poppins (textos) y Sacramento (la firma "script", en reemplazo de *Amsterdam Two*, que no está disponible para web).
- **Detalle de marca:** el trazo "infinito" (∞) del logo aparece como hilo conductor, ligado a la idea de *romper el círculo* de las dietas que no funcionan.

> Nota responsable: no se usan fotos de cuerpos ni promesas de "bajá X kilos en Y días". El foco está en acompañamiento, comunidad y hábitos sostenibles.
