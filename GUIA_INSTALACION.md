# Guía de Instalación y Configuración

Esta guía explica el proceso de instalación y configuración del proyecto **DCIM (Data Center Infrastructure Management)** en un entorno de desarrollo.

---

# Requisitos previos

Antes de iniciar la instalación es necesario contar con el siguiente software:

* Node.js 16 o superior.
* MySQL 5.7 o superior.
* Git (opcional, si el proyecto se obtiene desde un repositorio).

Para verificar la instalación de Node.js ejecutar:

```bash
node --version
npm --version
```

---

# Configuración de la base de datos

## Crear la base de datos

Ingresar a MySQL:

```bash
mysql -u root -p
```

Crear la base de datos:

```sql
CREATE DATABASE dcim CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE dcim;
```

---

## Importar el esquema

Dentro del proyecto se encuentra el archivo:

```
backend/db/schema.sql
```

Puede importarse mediante cualquiera de las siguientes opciones.

Desde consola:

```bash
mysql -u root -p dcim < backend/db/schema.sql
```

O desde MySQL:

```sql
USE dcim;

SOURCE backend/db/schema.sql;
```

---

## Crear un usuario para la base de datos

Aunque puede utilizarse el usuario **root**, se recomienda crear un usuario específico para la aplicación.

```sql
CREATE USER 'dcim_user'@'localhost'
IDENTIFIED BY 'contraseña_segura';

GRANT ALL PRIVILEGES
ON dcim.*
TO 'dcim_user'@'localhost';

FLUSH PRIVILEGES;
```

---

## Verificar la instalación

Ejecutar:

```sql
SHOW TABLES;
```

Las tablas creadas deben corresponder a:

* users
* vendors
* device_models
* sites
* rooms
* racks
* devices
* rack_unit_occupancy

---

# Configuración del Backend

Ingresar a la carpeta del servidor:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

---

## Archivo de configuración

Crear un archivo llamado **.env** dentro de la carpeta **backend**.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=dcim_user
DB_PASSWORD=contraseña_segura
DB_NAME=dcim

PORT=3000

JWT_SECRET=clave_secreta_del_proyecto
```

El archivo **.env** no debe compartirse ni incluirse en el repositorio.

---

## Verificar la conexión

Desde la carpeta backend ejecutar:

```bash
node -e "const repo = require('./db/repository'); repo.testConnection().then(r => console.log(r));"
```

Si la conexión fue exitosa se obtendrá una respuesta indicando que la base de datos se encuentra disponible.

---

## Ejecutar el servidor

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

Si todo fue configurado correctamente aparecerá un mensaje indicando que el servidor se encuentra escuchando en el puerto configurado.

---

# Configuración del Frontend

Ingresar a la carpeta correspondiente:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Para iniciar la aplicación:

```bash
npm run dev
```

El servidor de desarrollo se ejecutará normalmente en:

```
http://localhost:5173
```

Para generar la versión de producción:

```bash
npm run build
```

---

# Ejecución del proyecto

El backend y el frontend deben ejecutarse en terminales independientes.

## Terminal 1

```bash
cd backend

npm run dev
```

## Terminal 2

```bash
cd frontend

npm run dev
```

Finalmente abrir el navegador en:

```
http://localhost:5173
```

---

# Verificación

Una vez iniciado el proyecto se recomienda comprobar lo siguiente:

* El servidor backend inicia sin errores.
* La conexión con MySQL es correcta.
* El frontend carga la pantalla de inicio de sesión.
* Es posible iniciar sesión con un usuario registrado.
* Después del inicio de sesión se muestra el Dashboard.

---

# Usuario de prueba

Si la base de datos no contiene usuarios, puede crearse uno manualmente.

```sql
INSERT INTO users
(username,email,password_hash,full_name,active)
VALUES
(
'admin',
'admin@ejemplo.com',
'HASH_BCRYPT',
'Administrador',
1
);
```

El valor **HASH_BCRYPT** debe generarse previamente utilizando bcrypt desde Node.js.

---

# Solución de problemas

## Error al instalar dependencias

Si ocurre algún problema durante la instalación, eliminar las dependencias y volver a instalarlas.

```bash
npm cache clean --force

npm install
```

---

## No es posible conectar con MySQL

Verificar:

* Que el servicio de MySQL esté iniciado.
* Que la base de datos exista.
* Que las credenciales del archivo **.env** sean correctas.

---

## Puerto ocupado

Si el puerto configurado ya está siendo utilizado, modificar el valor de **PORT** dentro del archivo **.env** o finalizar el proceso que está utilizando dicho puerto.

---

## Problemas de autenticación

Verificar que:

* El token JWT se almacene correctamente.
* La clave definida en **JWT_SECRET** no haya cambiado.
* El token no haya expirado.

---

# Estructura del proyecto

```text
Proyecto-DCIM
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── db
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── Documentación
```

---

# Comandos principales

## Backend

```bash
npm install

npm run dev

npm start
```

## Frontend

```bash
npm install

npm run dev

npm run build

npm run preview
```

---

# Checklist de instalación

* Node.js instalado.
* MySQL instalado y en ejecución.
* Base de datos creada.
* Esquema SQL importado.
* Archivo **.env** configurado.
* Dependencias del backend instaladas.
* Dependencias del frontend instaladas.
* Backend ejecutándose correctamente.
* Frontend ejecutándose correctamente.
* Inicio de sesión funcional.
* Dashboard accesible.

---

# Observaciones

Esta guía corresponde a la configuración utilizada durante el desarrollo del proyecto. Si en el futuro se realizan cambios en la arquitectura o se agregan nuevas funcionalidades, se recomienda actualizar este documento para mantener la información sincronizada con el estado del sistema.
