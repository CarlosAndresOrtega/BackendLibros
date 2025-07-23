# 🧠 BookScraper API – NestJS + PostgreSQL

Una API desarrollada con **NestJS + TypeORM** que permite hacer scraping de libros, almacenarlos en una base de datos PostgreSQL, y acceder a ellos mediante filtros. Forma parte de la prueba técnica para **Double V Partners**.

---

## 📋 Tabla de Contenidos

- [🎯 Descripción General](#-descripción-general)
- [🏗️ Estructura del Proyecto](#%EF%B8%8F-estructura-del-proyecto)
- [🚀 Inicio Rápido](#-inicio-rápido)
- [🌍 Variables de Entorno](#-variables-de-entorno)
- [🧪 Endpoints Principales](#-endpoints-principales)
- [🗃️ Base de Datos](#-base-de-datos)
- [🎨 Tecnologías Usadas](#-tecnologías-usadas)
- [📦 Scripts Útiles](#-scripts-útiles)
- [🙋‍♂️ Autor](#-autor)

---

## 🎯 Descripción General

Este backend incluye funcionalidades como:

- 🔐 Registro y login con JWT
- 🔎 Scraping de libros (título, precio, rating, stock, etc.)
- 📄 Almacenamiento en PostgreSQL con TypeORM
- 🧾 Filtros por categoría, rating, stock, etc.
- 🛡️ Protecciones básicas de seguridad (autenticación, DTOs, validaciones)

---

## 🏗️ Estructura del Proyecto

```
book-scraper-api/
├── src/                                     # Código fuente de la aplicación
│   ├── auth/                                # Módulo de autenticación (login, register)
│   ├── books/                               # Lógica de scraping y libros
│   ├── users/                               # Módulo de usuarios
│   ├── app.module.ts                        # Módulo raíz de NestJS
│   └── main.ts                              # Archivo principal de arranque
├── schema.sql                               # Estructura de la base de datos (dump en SQL)
├── postgress-books.postman_collection.json  # Colección de Postman para probar los endpoints
├── package.json                             # Dependencias y scripts de Node.js
└── README.md                                # Documentación del proyecto

```

---

## 🚀 Inicio Rápido

### 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- PostgreSQL (puedes usar Docker)

### ⚡ Instalación

```bash
# 1️⃣ Clonar el repositorio
git clone https://github.com/CarlosAndresOrtega/BackendLibros.git
cd BackendLibros

# 2️⃣ Instalar dependencias
npm install

# 3️⃣ Crear base de datos y cargar estructura
docker run --name postgres-books -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
createdb -U postgres booksdb
psql -U postgres -d booksdb -f schema.sql
```

### ▶️ Levantar la API

```bash
npm run start:dev
```

La API estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## 🌍 Variables de Entorno

Crea un archivo `.env` en la raíz con el siguiente contenido (si usas configuración dinámica):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=booksdb
JWT_SECRET=supersecret
```

> Alternativamente, la conexión puede estar en `TypeOrmModule.forRoot()` en código.

---

## 🧪 Endpoints Principales

### 🔐 Auth

| Método | Endpoint       | Descripción             | Protegido |
| ------ | -------------- | ----------------------- | --------- |
| POST   | /auth/register | Registrar usuario nuevo | ❌        |
| POST   | /auth/login    | Login y retorno de JWT  | ❌        |

### 📚 Books

| Método | Endpoint                                      | Descripción                                                 | Protegido |
| ------ | --------------------------------------------- | ----------------------------------------------------------- | --------- |
| GET    | /books                                        | Obtener todos los libros (paginación, filtros, orden)       | ✅        |
| GET    | /books/:id                                    | Obtener un libro por ID                                     | ✅        |
| DELETE | /books/:id                                    | Eliminar un libro por ID                                    | ✅        |
| GET    | /books?category=Music                         | Filtrar libros por rating                                   | ✅        |
| GET    | /books?category=Musi&priceMin=10&priceMax=100 | Filtrar por categoría y precio                              | ✅        |
| GET    | /books/filters                                | Obtener filtros disponibles (categorías y rangos de precio) | ✅        |
| GET    | /books/scrape-books?page=1&totalPages=2       | Scrapear libros con paginación                              | ✅        |
| GET    | /books/scrape-books                           | Scrapear libros (versión alternativa, sin paginación)       | ✅        |

### 👤 Users

| Método | Endpoint   | Descripción               | Protegido |
| ------ | ---------- | ------------------------- | --------- |
| POST   | /users     | Crear nuevo usuario       | ❌        |
| GET    | /users     | Listar todos los usuarios | ❌        |
| GET    | /users/:id | Obtener usuario por ID    | ❌        |

📬 Postman Collection
Para facilitar las pruebas de los endpoints disponibles, se incluye una colección de Postman:
postgress-books.postman_collection.json

Puedes importarla directamente en Postman para probar el login, registro, scraping y operaciones CRUD sobre libros. Asegúrate de autenticarte primero para acceder a los endpoints protegidos.

---

> Las rutas protegidas requieren el header `Authorization: Bearer <token>`

---

## 🗃️ Base de Datos

- Motor: PostgreSQL
- ORM: TypeORM
- Estructura disponible en el archivo `schema.sql`

```bash
# Importar estructura manualmente:
psql -U postgres -d booksdb -f schema.sql
```

También puedes configurar migraciones con TypeORM si deseas mayor control.

---

## 🎨 Tecnologías Usadas

| Tecnología | Versión | Descripción                       |
| ---------- | ------- | --------------------------------- |
| NestJS     | ^10.x   | Framework backend                 |
| TypeORM    | ^0.3.x  | ORM para PostgreSQL               |
| PostgreSQL | 17.5    | Motor de base de datos relacional |
| JWT        | ^9.x    | Autenticación basada en tokens    |
| Docker     | latest  | Contenedor para base de datos     |
| pg_dump    | 17.5    | Exportador de esquema `.sql`      |

---

## 📦 Scripts Útiles

```bash
npm run start:dev      # Ejecuta con hot-reload (desarrollo)
npm run build          # Compila el proyecto a dist/
npm run test           # Ejecuta pruebas unitarias (si existen)
```

---

## 🙋‍♂️ Autor

**Carlos Andres Ortega Yate**  
📧 caortegayate@gmail.com  
🔗 GitHub: [github.com/tuusuario](https://github.com/CarlosAndresOrtega)

---

<div align="center">

_💡 Desarrollado con NestJS + PostgreSQL para Double V Partners_

</div>
