# AgriFlow Pro

### Sistema de gestión comercial y agrícola | Desarrollo Full-Stack

AgriFlow Pro es una aplicación web de gestión comercial diseñada para el sector agrícola. Centraliza procesos relacionados con prospectos, pedidos pendientes (*backorders*), inventario, cartera vencida, vendedores, logística y aprobaciones, mediante una plataforma que facilita la administración y el seguimiento de las operaciones comerciales.

El sistema integra una interfaz web, una API REST y una base de datos relacional para organizar la información y ofrecer funcionalidades adaptadas a las necesidades de los equipos comerciales.

---

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
- **Reportes:** generación y exportación de información en PDF y Excel.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 |
| Herramienta de desarrollo | Vite |
| Backend | Node.js y Express |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Contenedores | Docker y Docker Compose |

---

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

Docker Compose permite configurar y ejecutar los servicios del sistema mediante contenedores.

---

## Roles del sistema

| Rol | Función principal |
|---|---|
| **Master** | Acceso general al sistema y a su configuración. |
| **Admin** | Gestión de usuarios, aprobaciones e inventario. |
| **Vendedor** | Gestión de prospectos, pedidos y cartera propia. |
| **Logística** | Gestión del despacho y seguimiento de pedidos. |

---

## Instalación y ejecución

### Requisitos previos

**Opción A — Con Docker (recomendada)**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Opción B — Sin Docker**

- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior

---

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

| Servicio | Dirección |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Para detener los servicios:

```bash
docker-compose down
```

---

### Opción B: instalación manual

#### 1. Configurar PostgreSQL

Crea una base de datos llamada `agro_flow` y un usuario con los permisos necesarios.

#### 2. Configurar el backend

```bash
cd backend
cp .env.example .env   # En Windows: copia y renombra el archivo manualmente
```

Edita `backend/.env` con tus credenciales de PostgreSQL, instala las dependencias y sincroniza la base de datos:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

El backend estará disponible en `http://localhost:8080`.

#### 3. Configurar el frontend

En una nueva terminal desde la raíz del proyecto:

```bash
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## Variables de entorno

El backend requiere un archivo `backend/.env` basado en `backend/.env.example`.

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/agro_flow"
PORT=8080
```

> **Importante:** no incluyas credenciales reales en el repositorio. El archivo `.env.example` debe contener únicamente valores de ejemplo.

---

## Endpoints principales de la API

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

---

## Estructura del proyecto

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
├── docker-compose.yml      # Configuración de servicios
├── Dockerfile              # Configuración de la imagen del frontend
└── package.json            # Dependencias del frontend
```

---


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
