# Documentación del Proyecto DCIM

Esta documentación reúne la información necesaria para instalar, comprender y mantener el proyecto **DCIM (Data Center Infrastructure Management)**. Su objetivo es servir como guía para cualquier desarrollador que necesite ejecutar, modificar o ampliar el sistema.

---

# Documentación incluida

## 1. GUIA_INSTALACION.md

Este documento explica el proceso de instalación y configuración del proyecto desde cero.

**Contenido**

* Requisitos previos
* Instalación de Node.js y MySQL
* Configuración de la base de datos
* Configuración del backend
* Configuración del frontend
* Variables de entorno
* Ejecución del proyecto
* Solución de problemas comunes
* Recomendaciones para despliegue

**Dirigido a:** desarrolladores que ejecutan el proyecto por primera vez.

---

## 2. DOCUMENTACION_COMPLETA.md

Describe la arquitectura general del sistema y explica el funcionamiento de cada uno de sus módulos.

**Contenido**

* Descripción general del proyecto
* Arquitectura del sistema
* Organización de carpetas
* Backend
* Frontend
* Flujo de datos
* Sistema de autenticación
* Base de datos
* Tecnologías utilizadas

**Dirigido a:** desarrolladores que necesiten comprender la estructura y funcionamiento del proyecto.

---

## 3. DOCUMENTACION_COMPONENTES.md

Explica la organización del frontend y el funcionamiento de los principales componentes de React.

**Contenido**

* Organización del proyecto
* Componentes reutilizables
* Componentes de navegación
* Páginas principales
* Comunicación con el backend
* Patrones de implementación
* Configuración del proyecto

**Dirigido a:** desarrolladores frontend.

---

# Estructura general del sistema

```text
DCIM
│
├── Autenticación
│   ├── Inicio de sesión
│   ├── JWT
│   └── Protección de rutas
│
├── Infraestructura
│   ├── Sitios
│   │   └── Salas
│   │       └── Racks
│   │           └── Dispositivos
│   │               └── Ocupación
│   │
│   ├── Fabricantes
│   └── Modelos
│
├── Frontend
│   ├── Dashboard
│   ├── Sitios
│   ├── Salas
│   ├── Racks
│   ├── Dispositivos
│   ├── Fabricantes
│   └── Modelos
│
└── Backend
    ├── Express
    ├── Autenticación
    └── Base de datos MySQL
```
# Flujo general del sistema

## Proceso de autenticación

El acceso al sistema sigue el siguiente flujo:

```text
Usuario
    ↓
Inicio de sesión
    ↓
Validación en el servidor
    ↓
Generación del token JWT
    ↓
Almacenamiento del token
    ↓
Acceso al Dashboard
```

---

## Operaciones sobre la información

Todas las operaciones de creación, actualización y eliminación siguen el mismo proceso:

```text
Usuario
      ↓
Frontend
      ↓
Backend
      ↓
Base de datos
      ↓
Respuesta
      ↓
Actualización de la interfaz
```

---

## Consulta de información

```text
Usuario
      ↓
Frontend
      ↓
Solicitud de datos
      ↓
Backend
      ↓
MySQL
      ↓
Respuesta
      ↓
Renderizado de información
```

---

# Modelo de datos

La infraestructura administrada por el sistema sigue la siguiente jerarquía:

```text
Usuarios
    │
    └── Sitios
            │
            └── Salas
                    │
                    └── Racks
                            │
                            ├── Dispositivos
                            └── Ocupación
```

Las principales tablas de la base de datos son:

* users
* sites
* rooms
* racks
* vendors
* device_models
* devices
* rack_unit_occupancy

---

# Seguridad

El sistema implementa autenticación mediante JSON Web Token (JWT).

Las principales características son:

* Inicio de sesión mediante correo electrónico y contraseña.
* Contraseñas protegidas mediante bcrypt.
* Tokens con una duración de ocho horas.
* Protección de las operaciones que modifican la información del sistema.

Actualmente el token se almacena en **localStorage**, ya que el proyecto fue desarrollado con fines académicos. Para un entorno de producción sería recomendable utilizar cookies **httpOnly** y mecanismos adicionales de seguridad.

---

# Funcionalidades principales

## Dashboard

El panel principal ofrece un resumen del estado general de la infraestructura mediante indicadores como:

* Total de sitios registrados.
* Total de racks.
* Total de dispositivos.
* Estado de los equipos.
* Accesos rápidos a los diferentes módulos.

---

## Gestión de infraestructura

El sistema permite administrar toda la estructura física del centro de datos mediante operaciones de creación, consulta, actualización y eliminación para:

* Sitios
* Salas
* Racks
* Dispositivos

También permite registrar la ubicación exacta de cada equipo dentro de un rack.

---

## Catálogo de fabricantes y modelos

Los fabricantes y modelos funcionan como catálogos independientes que facilitan la estandarización de la información de los dispositivos registrados en el sistema.

---

## Ocupación de racks

Cada rack muestra el porcentaje de ocupación y las unidades disponibles, permitiendo conocer rápidamente la capacidad restante y la ubicación de los equipos instalados.

---

# Tecnologías utilizadas

## Backend

El servidor fue desarrollado utilizando:

* Node.js
* Express
* MySQL
* JSON Web Token (JWT)
* bcrypt

---

## Frontend

La interfaz gráfica fue desarrollada utilizando:

* React
* React Router
* Vite
* CSS

---

# Recomendaciones para comenzar

Se recomienda seguir el siguiente orden para conocer el proyecto:

1. Leer la guía de instalación.
2. Configurar la base de datos.
3. Ejecutar el backend.
4. Ejecutar el frontend.
5. Iniciar sesión.
6. Explorar el Dashboard.
7. Revisar la documentación técnica para comprender la arquitectura y los componentes del sistema.

---

# Soporte

La documentación se encuentra organizada según el área del proyecto:

* **GUIA_INSTALACION.md:** instalación y configuración del entorno.
* **DOCUMENTACION_COMPLETA.md:** arquitectura, backend, frontend y base de datos.
* **DOCUMENTACION_COMPONENTES.md:** estructura del frontend y funcionamiento de los componentes.

---

# Versiones

**Backend:** 1.0.0

**Frontend:** 0.0.0

**Base de datos:** MySQL 5.7 o superior

**Última actualización:** 01 de julio de 2026.

---

# Recursos de consulta

Durante el desarrollo del proyecto se utilizaron como referencia las siguientes tecnologías y su documentación oficial:

* Express.js
* React
* MySQL
* JSON Web Token (JWT)

Como herramientas de apoyo para el desarrollo y las pruebas se recomienda el uso de:

* Visual Studio Code
* MySQL Workbench
* Postman
* Herramientas para desarrolladores del navegador
