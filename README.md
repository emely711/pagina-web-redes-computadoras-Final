
## ¿Qué es este proyecto?

Esta página web fue creada con fines académicos, con el objetivo de ayudar a los estudiantes a comprender de mejor manera la materia de **Redes de Computadoras**. Reúne el temario de la asignatura, respuestas a preguntas frecuentes y un canal de contacto directo, todo en un solo lugar y con acceso mediante cuenta de usuario.

## Equipo

Mateo Rodriguez 
Estaban Rodriguez 
Emely  Bone 
Marjorie Valdivieso 

## Recorrido por la app

| Sección | Qué encontrarás |
|---|---|
| **Inicio** | Landing con presentación del curso |
| **Sobre Nosotros** | Contexto del proyecto y su propósito |
| **Temario** | Listado de temas, cada uno con su propia vista de detalle |
| **Preguntas** | FAQ en formato acordeón |
| **Contacto** | Formulario de contacto + newsletter |
| **Login / Registro** | Acceso de usuarios vía correo/contraseña o Google |
| **Dashboard** | Panel privado, solo visible con sesión iniciada |

## Stack técnico

- **React** — construcción de la interfaz por componentes
- **Vite** — servidor de desarrollo y build
- **Firebase Authentication** — login con correo/contraseña y Google
- **React Router DOM** — navegación entre páginas y protección de la ruta `/dashboard`
- **React Toastify** — notificaciones de éxito y error
- **CSS con variables custom** — tema claro/oscuro sincronizado con `localStorage` y la preferencia del sistema

## Puesta en marcha

```bash
git clone <url-del-repositorio>
cd redes-computadoras
npm install
```

Crea `src/firebase.js` con tu propia configuración de Firebase:

```js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

En Firebase Console, habilita **Email/Password** y **Google** dentro de `Authentication > Sign-in method`.

Levanta el servidor:

```bash
npm run dev
```

Disponible en `http://localhost:5173`.

