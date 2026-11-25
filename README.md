# Págalo.pe con ALIGNET

Prototipo web de Págalo.pe con una experiencia unificada de pago mediante Pay-me y orquestación de ALIGNET. Incluye búsqueda de trámites, carrito, tickets pendientes y pagados, múltiples intentos por pedido, constancias y medios de pago digitales.

## Requisitos

- Node.js 22 o superior
- npm 10 o superior

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

La aplicación estará disponible en `http://localhost:8443`, salvo que se defina otra variable `PORT`.

## Variables de entorno

Configura estas variables localmente y en Vercel. No publiques credenciales reales en Git.

| Variable | Uso |
| --- | --- |
| `URL_CSS` | Hoja de estilos de Pay-me Flex |
| `URL_JS` | Biblioteca JavaScript de Pay-me Flex |
| `PAYME_AUTH_BASE_URL` | URL base de autenticación de Pay-me |
| `PAYME_API_AUDIENCE` | Audience de la API de Pay-me |
| `PAYME_CLIENT_ID` | Identificador OAuth del comercio |
| `PAYME_CLIENT_SECRET` | Secreto OAuth del comercio |
| `PAYME_MERCHANT_CODE` | Código de comercio Pay-me |

## Verificación

```bash
npm run build
npm run preview
```

## Publicación en Vercel

El proyecto incluye:

- `vercel.json` con compilación Vite y fallback para React Router.
- `api/payme-session.ts` como función serverless para obtener el nonce sin exponer secretos.
- `.env.example` como referencia de configuración.

Importa en Vercel el repositorio `pagalo-pe-alignet-demo`, registra las variables anteriores para Production y Preview, y despliega. El comando de compilación es `npm run build` y el directorio de salida es `dist`.

## Seguridad

`PAYME_CLIENT_SECRET` se usa únicamente en la función serverless. Nunca debe exponerse mediante variables con prefijo `VITE_` ni enviarse al navegador.
