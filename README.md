# 🌱 AgriFlow Pro

Sistema de gestión comercial y agrícola diseñado para equipos de ventas. Permite administrar prospectos, pedidos (backorders), inventario, cartera vencida, vendedores y aprobaciones desde un panel centralizado.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Contenedores | Docker + Docker Compose |

---

## 📋 Requisitos Previos

Asegúrate de tener instalado uno de los siguientes:

**Opción A — Con Docker (recomendado):**
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**Opción B — Sin Docker:**
- [Node.js](https://nodejs.org/) v18 o superior
- [PostgreSQL](https://www.postgresql.org/) v14 o superior

---

## 🚀 Instalación y Ejecución

### ▶️ Opción A: Con Docker (más fácil)

```bash
# 1. Clona el repositorio
git clone https://github.com/proyectosliz16-coder/Agro-Project.git
cd Agro-Project

# 2. Levanta todos los servicios (base de datos, backend y frontend)
docker-compose up --build
```

Una vez iniciado, accede a:
- 🌐 **Frontend:** http://localhost:5173
- ⚙️ **Backend API:** http://localhost:8080
- 🗄️ **Base de datos:** localhost:5432

---

### ▶️ Opción B: Sin Docker (manual)

#### 1. Configura la base de datos

Crea una base de datos PostgreSQL llamada `agro_flow` con un usuario `agro_user`.

#### 2. Configura el Backend

```bash
cd backend

# Copia y edita el archivo de variables de entorno
cp .env.example .env
# Abre .env y configura tu DATABASE_URL con tus credenciales reales

# Instala dependencias
npm install

# Genera el cliente de Prisma y sincroniza la base de datos
npm run prisma:generate
npm run prisma:push

# Inicia el servidor
npm run dev
```

El backend correrá en: **http://localhost:8080**

#### 3. Configura el Frontend

Abre una nueva terminal en la raíz del proyecto:

```bash
# Instala dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

El frontend correrá en: **http://localhost:5173**

---

## 🔧 Variables de Entorno

Crea el archivo `backend/.env` basándote en `backend/.env.example`:

```env
DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/agro_flow"
PORT=8080
```

---

## 📂 Estructura del Proyecto

```
Agro-Project/
├── src/                    # Código fuente del frontend (React)
├── backend/
│   ├── src/
│   │   └── index.js        # API REST principal (Express)
│   ├── prisma/             # Esquema y migraciones de la base de datos
│   ├── .env.example        # Plantilla de variables de entorno
│   └── package.json
├── public/                 # Assets públicos
├── docker-compose.yml      # Orquestación de contenedores
├── Dockerfile              # Imagen del frontend
└── package.json            # Dependencias del frontend
```

---

## 🔌 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/login` | Autenticación de usuario |
| `POST` | `/api/register` | Registro de nuevo usuario |
| `GET` | `/api/users` | Listar usuarios |
| `GET` | `/api/products` | Listar productos/inventario |
| `GET` | `/api/backorders` | Listar pedidos pendientes |
| `GET` | `/api/prospects` | Listar prospectos |
| `GET` | `/api/cartera` | Listar cartera vencida |
| `GET` | `/api/ventas` | Ranking de vendedores |
| `GET` | `/api/approvals` | Listar aprobaciones |
| `GET` | `/api/health` | Estado del servidor |

---

## 👥 Roles del Sistema

| Rol | Permisos |
|-----|---------|
| **Master** | Acceso total al sistema y configuración |
| **Admin** | Gestión de usuarios, aprobaciones e inventario |
| **Vendedor** | Gestión de prospectos, pedidos y cartera propia |
| **Logística** | Gestión de despacho y seguimiento de pedidos |

---

## 📄 Licencia

Proyecto desarrollado como parte de una estancia profesional.
