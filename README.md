# AgriFlow Pro

### Sistema de gestión comercial y agrícola | Desarrollo Full-Stack

AgriFlow Pro es una aplicación web de gestión comercial diseñada para el sector agrícola. Centraliza procesos relacionados con prospectos, pedidos pendientes (*backorders*), inventario, cartera vencida, vendedores, logística y aprobaciones, mediante una plataforma que facilita la administración y el seguimiento de las operaciones comerciales.

El sistema integra una interfaz web, una API REST y una base de datos relacional para organizar la información y ofrecer funcionalidades adaptadas a las necesidades de los equipos comerciales.

## Funcionalidades principales

- **Autenticación de usuarios:** acceso al sistema mediante inicio de sesión y registro.
- **Gestión de usuarios y roles:** administración de accesos según el perfil del usuario.
- **Gestión de prospectos:** registro y seguimiento de oportunidades comerciales.
- **Control de inventario:** consulta y gestión de productos.
- **Gestión de backorders:** seguimiento de pedidos pendientes.
- **Cartera vencida:** consulta y seguimiento de cuentas pendientes de pago.
- **Gestión comercial:** consulta de información de ventas y desempeño de vendedores.
- **Sistema de aprobaciones:** consulta y administración de solicitudes que requieren autorización.
- **Logística:** herramientas para el despacho y seguimiento de pedidos.
- **Reportes:** funcionalidades para generar y exportar información en PDF y Excel, cuando estén disponibles en la versión publicada.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 |
| Herramienta de desarrollo | Vite |
| Backend | Node.js y Express |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Contenedores | Docker y Docker Compose |

## Arquitectura del sistema

AgriFlow Pro utiliza una arquitectura web en la que el frontend se comunica con el backend mediante solicitudes HTTP. El backend procesa la lógica de negocio y accede a la base de datos a través de Prisma ORM.

```text
┌───────────────────────────────┐
│            Usuario            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Frontend: React         │
│            Vite               │
└───────────────┬───────────────┘
                │
                │ Solicitudes HTTP
                ▼
┌───────────────────────────────┐
│      Backend: Node.js         │
│          Express              │
│           API REST            │
└───────────────┬───────────────┘
                │
                │ Prisma ORM
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
└───────────────────────────────┘
```

Docker Compose permite configurar y ejecutar los servicios del sistema mediante contenedores, de acuerdo con la configuración del proyecto.

## Roles del sistema

El sistema contempla diferentes perfiles de usuario para organizar los permisos y las responsabilidades.

| Rol | Función principal |
|---|---|
| **Master** | Acceso general al sistema y a su configuración. |
| **Admin** | Gestión de usuarios, aprobaciones e inventario. |
| **Vendedor** | Gestión de prospectos, pedidos y cartera propia. |
| **Logística** | Gestión del despacho y seguimiento de pedidos. |

Los permisos específicos están determinados por la implementación de cada módulo.

## Instalación y ejecución

### Requisitos previos

**Opción A — Con Docker (recomendada)**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Opción B — Sin Docker**

- [Node.js](https://nodejs.org/) v18 o superior.
- [PostgreSQL](https://www.postgresql.org/) v14 o superior.

### Opción A: ejecución con Docker

#### 1. Clonar el repositorio

```bash
git clone https://github.com/proyectosliz16-coder/Agro-Project.git
cd Agro-Project
```

#### 2. Construir e iniciar los servicios

```bash
docker-compose up --build
```

Si la configuración actual de Docker Compose utiliza estos puertos, podrás acceder a los servicios desde las siguientes direcciones:

| Servicio | Dirección |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Para detener los servicios, ejecuta:

```bash
docker-compose down
```

### Opción B: instalación manual

#### 1. Configurar PostgreSQL

Crea una base de datos llamada `agro_flow` y un usuario con los permisos necesarios para acceder a ella.

#### 2. Configurar el backend

Accede a la carpeta del backend:

```bash
cd backend
```

Crea tu archivo local de variables de entorno a partir de la plantilla:

```bash
cp .env.example .env
```

En Windows, también puedes copiar `.env.example` manualmente y renombrar la copia como `.env`.

Edita `backend/.env` y configura la conexión a PostgreSQL con tus credenciales locales.

Instala las dependencias:

```bash
npm install
```

Genera el cliente de Prisma:

```bash
npm run prisma:generate
```

Sincroniza el esquema de la base de datos:

```bash
npm run prisma:push
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará disponible en `http://localhost:8080`, siempre que se conserve el puerto configurado.

#### 3. Configurar el frontend

Abre una nueva terminal en la raíz del proyecto.

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`, si ese es el puerto configurado en Vite.

## Variables de entorno

El backend utiliza variables de entorno para configurar la conexión a la base de datos y el puerto del servidor.

Crea el archivo `backend/.env` a partir de `backend/.env.example`.

Ejemplo:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/agro_flow"
PORT=8080
```

Sustituye `USUARIO` y `CONTRASEÑA` por las credenciales de tu entorno local.

**Importante:** no publiques credenciales reales, contraseñas ni otros secretos en el repositorio. El archivo `.env.example` debe contener únicamente valores de ejemplo.

## Endpoints principales de la API

Las siguientes rutas corresponden a los endpoints documentados del proyecto.

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/login` | Autenticación de usuarios. |
| `POST` | `/api/register` | Registro de usuarios. |
| `GET` | `/api/users` | Consulta de usuarios. |
| `GET` | `/api/products` | Consulta de productos e inventario. |
| `GET` | `/api/backorders` | Consulta de pedidos pendientes. |
| `GET` | `/api/prospects` | Consulta de prospectos. |
| `GET` | `/api/cartera` | Consulta de cartera vencida. |
| `GET` | `/api/ventas` | Consulta de información de ventas. |
| `GET` | `/api/approvals` | Consulta de aprobaciones. |
| `GET` | `/api/health` | Verificación del estado del servidor. |

La disponibilidad de cada endpoint y los permisos necesarios dependen de la implementación actual del backend.

## Estructura del proyecto

La estructura general documentada del repositorio es la siguiente:

```text
Agro-Project/
├── src/                    # Código fuente del frontend
├── backend/
│   ├── src/
│   │   └── index.js        # Punto de entrada de la API
│   ├── prisma/             # Esquema y configuración de Prisma
│   ├── .env.example        # Plantilla de variables de entorno
│   └── package.json        # Dependencias del backend
├── public/                 # Recursos públicos
├── assets/                 # Recursos adicionales
├── docker-compose.yml      # Configuración de servicios
├── Dockerfile              # Configuración de la imagen del frontend
└── package.json            # Dependencias del frontend
```

## Desarrollo y autoría

**AgriFlow Pro fue desarrollado íntegramente por mí, de manera independiente.**

Me encargué del desarrollo de la aplicación de principio a fin, abarcando las distintas capas del sistema y la integración de sus componentes para construir una solución web de gestión comercial orientada al sector agrícola.

### Responsabilidades y trabajo realizado

- **Desarrollo frontend:** implementación de la interfaz de usuario y los componentes de la aplicación con React y Vite.
- **Desarrollo backend:** implementación de la lógica del servidor y de la API REST mediante Node.js y Express.
- **Diseño e integración de la base de datos:** trabajo con PostgreSQL y Prisma ORM.
- **Autenticación y gestión de roles:** implementación de las funcionalidades de acceso y administración de usuarios.
- **Desarrollo de módulos:** construcción de las funcionalidades comerciales y operativas del sistema.
- **Gestión de información comercial:** integración de funcionalidades relacionadas con prospectos, pedidos, inventario, cartera y aprobaciones.
- **Configuración del entorno:** trabajo con Docker y Docker Compose para facilitar la ejecución de los servicios.

Este proyecto refleja mi experiencia en desarrollo full-stack, diseño de aplicaciones web, integración de tecnologías y construcción independiente de soluciones de software.

## Conocimientos aplicados

- Desarrollo de aplicaciones web full-stack.
- Construcción e integración de API REST.
- Diseño y gestión de bases de datos relacionales.
- Integración de frontend, backend y persistencia de datos.
- Gestión de usuarios y permisos basados en roles.
- Configuración de entornos de desarrollo mediante Docker.
- Organización y documentación de proyectos de software.


## Capturas de pantalla

### Dashboard principal
Vista general de AgriFlow Pro y sus principales indicadores.

![Dashboard de AgriFlow Pro](docs/screenshots/dashboard.png)

### Gestión de inventario
Interfaz del módulo de inventario para consultar y administrar productos.

![Inventario de AgriFlow Pro](docs/screenshots/inventario.png)

### Gestión de prospectos
Vista del módulo para gestionar y dar seguimiento a prospectos comerciales.

![Prospectos de AgriFlow Pro](docs/screenshots/prospectos.png)

### Pipeline de ventas
Vista del módulo para seguir el progreso de cada lead a lo largo de las distintas etapas del proceso de ventas.

![Pipeline de AgriFlow Pro](docs/screenshots/pipeline.png)


## Contexto del proyecto

Proyecto desarrollado como parte de una estancia profesional.

---

**AgriFlow Pro** 🌱  
*Tecnología para organizar y optimizar la gestión comercial agrícola.*
