# pill-alert Frontend

pill-alert es una aplicación web desarrollada con React, TypeScript y Vite, diseñada para la gestión y acceso de estudiantes y colaboradores en la Universidad La Salle Cancún. Este proyecto implementa una arquitectura moderna, componentes reutilizables y un diseño responsivo utilizando TailwindCSS.

## Características principales
- Inicio de sesión y registro para estudiantes y colaboradores.
- Panel de control (dashboard) para estudiantes.
- Navegación estructurada y sidebar dinámico.
- Componentes reutilizables (inputs, botones, modales, alertas, etc.).
- Gestión de estado global con Redux Toolkit.
- Consumo de APIs mediante RTK Query.
- Temas claro/oscuro y diseño responsivo.

## Tecnologías utilizadas
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS 4](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router DOM 7](https://reactrouter.com/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [React Icons](https://react-icons.github.io/react-icons/)

## Estructura del proyecto
```
├── public/
├── src/
│   ├── assets/           # Imágenes y fuentes
│   ├── components/       # Componentes reutilizables y de layout
│   ├── hooks/            # Custom hooks
│   ├── interfaces/       # Tipos y contratos TypeScript
│   ├── pages/            # Vistas principales (login, dashboard, etc.)
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de consumo de APIs
│   ├── slices/           # Slices de Redux
│   ├── store/            # Configuración de Redux
│   └── utils/            # Utilidades generales
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Scripts disponibles
- `npm run dev`     : Inicia el servidor de desarrollo.
- `npm run build`   : Compila la aplicación para producción.
- `npm run preview` : Previsualiza la build de producción.
- `npm run lint`    : Ejecuta ESLint para analizar el código.

## Instalación y uso
1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd pill-alert-frontend
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```sh
   npm run dev
   ```
4. Accede a la aplicación en [http://localhost:5173](http://localhost:5173) (puerto por defecto de Vite).

## Notas
- Asegúrate de tener Node.js >= 18 instalado.
- El proyecto está en desarrollo y puede contener rutas o componentes de ejemplo.

---
Desarrollado por y para la comunidad de la Universidad La Salle Cancún.
