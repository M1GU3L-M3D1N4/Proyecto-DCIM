# Documentación de Componentes - Frontend DCIM

## Introducción

Este documento describe la organización del frontend del proyecto **DCIM (Data Center Infrastructure Management)**, así como la función de los principales componentes que conforman la aplicación.

El frontend fue desarrollado utilizando **React** y **Vite**, siguiendo una estructura modular que facilita el mantenimiento del código y la incorporación de nuevas funcionalidades.

---

# Organización del proyecto

La estructura principal del frontend es la siguiente:

```text
src/
│
├── main.jsx
├── App.jsx
├── index.css
│
├── components/
│   ├── layout/
│   ├── QuickAccess.jsx
│   ├── StatCard.jsx
│   └── StatusPanel.jsx
│
├── pages/
│   ├── login/
│   ├── dashboard/
│   ├── vendors/
│   ├── models/
│   ├── sites/
│   ├── rooms/
│   ├── racks/
│   └── devices/
│
└── lib/
    └── dcimApi.js
```

Cada carpeta tiene una responsabilidad específica dentro de la aplicación.

* **components/** contiene componentes reutilizables.
* **pages/** almacena las vistas principales del sistema.
* **layout/** reúne los elementos comunes de navegación.
* **lib/** contiene funciones auxiliares utilizadas para comunicarse con el backend.

---

# Organización de la aplicación

El frontend está dividido en tres grupos principales:

## Componentes de navegación

Incluyen los elementos visibles durante toda la navegación del usuario, como el menú lateral y la información del usuario autenticado.

## Componentes reutilizables

Son elementos visuales utilizados en varias páginas del sistema, como tarjetas estadísticas o paneles informativos.

## Páginas

Representan cada uno de los módulos del sistema y contienen la lógica principal para consultar y modificar la información.

---

# Comunicación con el backend

Todas las solicitudes HTTP se centralizan en el archivo:

```text
src/lib/dcimApi.js
```

Este archivo evita repetir código en cada página y proporciona una interfaz común para realizar operaciones sobre la API.

Las funciones disponibles permiten realizar operaciones de consulta, creación, actualización y eliminación de registros.

---

# Funciones principales de dcimApi.js

## buildQueryString()

Construye automáticamente los parámetros enviados en la URL.

Su objetivo es evitar parámetros vacíos y generar consultas más limpias.

Se utiliza principalmente en las páginas que permiten aplicar filtros, como dispositivos, salas o racks.

---

## fetchJson()

Realiza solicitudes **GET** hacia el backend.

Entre sus responsabilidades se encuentran:

* enviar el token JWT cuando existe;
* procesar la respuesta del servidor;
* convertir la respuesta a formato JSON;
* manejar errores de comunicación.

Esta función es utilizada por prácticamente todas las páginas para consultar información.

---

## postJson()

Se utiliza para registrar nuevos elementos en la base de datos.

Envía la información al backend utilizando el método **POST** e incluye automáticamente el encabezado de autenticación cuando el usuario ha iniciado sesión.

---

## putJson()

Permite actualizar registros existentes mediante solicitudes **PUT**.

Su funcionamiento es similar al de **postJson()**, diferenciándose únicamente en el método HTTP utilizado.

---

## deleteJson()

Realiza solicitudes **DELETE** para eliminar registros del sistema.

Cuando la operación finaliza correctamente, la página correspondiente vuelve a cargar la información para reflejar los cambios realizados.

---

# Componentes reutilizables

Los componentes reutilizables permiten mantener una interfaz consistente y reducir la duplicación de código.

---

## StatCard

Este componente muestra un indicador numérico acompañado de una descripción.

Se utiliza principalmente en el Dashboard y en las páginas que presentan estadísticas generales.

Ejemplos de información mostrada:

* Cantidad de sitios.
* Número de racks.
* Total de dispositivos.
* Fabricantes registrados.
* Modelos disponibles.

Cada tarjeta recibe el nombre del indicador y el valor correspondiente.

---

## StatusPanel

Presenta un resumen del estado actual de los dispositivos registrados.

La información suele agruparse en categorías como:

* Activos.
* En mantenimiento.
* Retirados.

Cada estado se representa mediante un indicador visual que facilita la interpretación rápida de la información.

---

## QuickAccess

Este componente muestra accesos directos hacia los módulos más utilizados del sistema.

Su objetivo es reducir la cantidad de navegación necesaria para acceder a las funciones principales.

Desde el Dashboard permite acceder rápidamente a:

* Sitios.
* Salas.
* Racks.
* Dispositivos.
* Fabricantes.
* Modelos.

---

# Componentes de navegación

Los componentes de navegación permanecen visibles durante la mayor parte de la utilización del sistema.

---

## Sidebar

El menú lateral constituye el principal mecanismo de navegación de la aplicación.

Desde este componente es posible acceder a todos los módulos del sistema.

La navegación se encuentra organizada en dos grupos principales.

### Operación

Incluye los módulos utilizados durante la administración diaria de la infraestructura:

* Dashboard.
* Sitios.
* Salas.
* Racks.
* Dispositivos.

### Catálogos

Incluye la información utilizada como referencia para el resto del sistema.

* Fabricantes.
* Modelos.

El componente utiliza React Router para resaltar automáticamente la opción correspondiente a la ruta activa.

Su diseño también es adaptable a diferentes tamaños de pantalla.

---

## UserCard

Este componente presenta la información del usuario autenticado.

Los datos son obtenidos desde **localStorage**, donde se almacenan el token de autenticación y la información básica del usuario después del inicio de sesión.

Además de mostrar el nombre del usuario, incorpora la opción para cerrar la sesión.

Al cerrar sesión se realizan las siguientes acciones:

* eliminación del token de autenticación;
* eliminación de la información del usuario almacenada localmente;
* actualización del estado de autenticación;
* redirección hacia la pantalla de inicio de sesión.

---

# Flujo general de los componentes

La mayoría de los componentes siguen una estructura similar.

```text
Usuario
      │
      ▼
Componente React
      │
      ▼
Funciones de dcimApi.js
      │
      ▼
Backend
      │
      ▼
Base de datos
      │
      ▼
Respuesta
      │
      ▼
Actualización de la interfaz
```

Esta organización permite mantener separada la lógica de negocio de la presentación visual, facilitando el mantenimiento del código y la reutilización de componentes.

---

# Consideraciones generales

Durante el desarrollo del frontend se procuró mantener una estructura modular, donde cada componente tenga una única responsabilidad.

Las funciones relacionadas con el acceso a datos se concentran en un único archivo, mientras que la interfaz se divide en componentes reutilizables y páginas independientes. Esta organización facilita la incorporación de nuevas funcionalidades sin afectar el comportamiento del resto de la aplicación.

# Documentación de las Páginas

Las páginas del proyecto representan los diferentes módulos funcionales del sistema. Cada una de ellas es responsable de consultar, mostrar y administrar la información correspondiente a una entidad específica.

Todas las páginas utilizan las funciones definidas en **dcimApi.js** para comunicarse con el backend y mantienen una estructura similar basada en componentes reutilizables.

---

# Login

La página **Login** constituye el punto de acceso al sistema.

Su función es autenticar al usuario mediante correo electrónico y contraseña.

Durante el proceso de autenticación se realizan las siguientes acciones:

1. Validación de los datos ingresados.
2. Envío de las credenciales al servidor.
3. Recepción del token JWT.
4. Almacenamiento del token y la información del usuario en el navegador.
5. Redirección al Dashboard.

Si las credenciales son incorrectas o el usuario no tiene permisos de acceso, la aplicación muestra el mensaje correspondiente sin abandonar la página.

---

# Dashboard

El Dashboard es la pantalla principal del sistema después del inicio de sesión.

Su objetivo es ofrecer una visión general del estado de la infraestructura administrada por el DCIM.

Para construir esta vista se consultan diferentes recursos del backend, entre ellos:

* Sitios.
* Racks.
* Dispositivos.

Con esta información se generan indicadores como:

* Número total de sitios.
* Cantidad de racks registrados.
* Total de dispositivos.
* Estado de los equipos.
* Accesos rápidos a los principales módulos.

El Dashboard utiliza los componentes **StatCard**, **StatusPanel** y **QuickAccess** para presentar la información de manera resumida.

---

# Gestión de Fabricantes

La página de fabricantes permite administrar el catálogo de fabricantes disponibles dentro del sistema.

Las operaciones disponibles son:

* Consultar fabricantes registrados.
* Crear nuevos fabricantes.
* Modificar información existente.
* Eliminar registros.

Cada fabricante puede estar asociado a diferentes modelos de dispositivos, por lo que este módulo sirve como información de referencia para el resto del sistema.

Después de cada operación la lista se actualiza automáticamente para reflejar los cambios realizados.

---

# Detalle de Fabricante

Esta vista muestra la información completa de un fabricante específico.

Entre los datos presentados se encuentran:

* Nombre.
* Dirección web o sitio oficial.
* Modelos asociados.

Desde esta página también es posible actualizar la información del fabricante o regresar al listado principal.

---

# Gestión de Modelos

Este módulo administra los modelos de equipos registrados en el sistema.

Cada modelo se encuentra asociado a un fabricante y almacena información utilizada posteriormente durante el registro de dispositivos.

Los datos administrados incluyen, entre otros:

* Fabricante.
* Nombre del modelo.
* Tipo de dispositivo.
* Altura en unidades (U).

Las operaciones disponibles son:

* Crear modelos.
* Consultar modelos existentes.
* Editar información.
* Eliminar registros.

También es posible visualizar únicamente los modelos pertenecientes a un fabricante específico cuando la navegación proviene del módulo de fabricantes.

---

# Gestión de Sitios

Los sitios representan los centros de datos administrados por el sistema.

Cada sitio almacena información general como:

* Nombre.
* Ciudad.
* Dirección.

Desde este módulo pueden realizarse las operaciones habituales de administración:

* Crear sitios.
* Consultar información.
* Actualizar datos.
* Eliminar registros.

Adicionalmente es posible acceder directamente al listado de salas pertenecientes a un sitio determinado.

---

# Gestión de Salas

Cada sala pertenece a un sitio y representa un espacio físico donde se encuentran instalados los racks.

La información administrada incluye:

* Nombre.
* Sitio asociado.
* Ubicación.

Desde esta página pueden consultarse únicamente las salas de un sitio específico mediante filtros aplicados desde la navegación.

Cada registro también permite acceder directamente a los racks contenidos dentro de la sala.

---

# Gestión de Racks

Los racks representan la ubicación física donde se instalan los dispositivos.

Cada rack almacena información como:

* Código identificador.
* Sala asociada.
* Capacidad total en unidades (U).
* Nivel de ocupación.

El sistema calcula automáticamente el porcentaje de ocupación a partir de los dispositivos registrados.

Cada rack puede visualizarse individualmente para consultar su información detallada y los equipos instalados.

---

# Detalle del Rack

Esta página presenta información específica sobre un rack.

Entre los datos disponibles se encuentran:

* Código.
* Sala.
* Sitio.
* Capacidad.
* Espacio ocupado.
* Espacio disponible.

También muestra la relación de dispositivos instalados dentro del rack, permitiendo conocer la distribución física de la infraestructura.

---

# Gestión de Dispositivos

Este módulo administra todos los equipos registrados dentro del sistema.

Cada dispositivo puede almacenar información como:

* Nombre.
* Modelo.
* Fabricante.
* Número de serie.
* Asset Tag.
* Estado.
* Rack asociado.
* Posición dentro del rack.

La información puede filtrarse utilizando diferentes criterios, como el rack, el modelo o el estado del dispositivo.

Las operaciones disponibles incluyen:

* Registrar dispositivos.
* Consultar inventario.
* Actualizar información.
* Eliminar registros.

---

# Detalle de Dispositivo

Esta vista presenta toda la información relacionada con un dispositivo específico.

Además de los datos generales, muestra la ubicación completa del equipo dentro de la infraestructura.

La información incluye:

* Sitio.
* Sala.
* Rack.
* Posición ocupada.
* Estado actual.
* Fecha de instalación.

Esta vista facilita la localización física de cualquier dispositivo registrado.

---

# Navegación entre módulos

Las páginas del sistema se encuentran relacionadas entre sí para facilitar la administración de la infraestructura.

El flujo habitual de navegación es el siguiente:

```text
Dashboard
      │
      ▼
Sitios
      │
      ▼
Salas
      │
      ▼
Racks
      │
      ▼
Dispositivos
```

Los catálogos de fabricantes y modelos funcionan de manera independiente, aunque son utilizados posteriormente durante el registro de dispositivos.

```text
Fabricantes
      │
      ▼
Modelos
      │
      ▼
Dispositivos
```

---

# Carga de información

La mayoría de las páginas utilizan un comportamiento similar al inicializarse.

Cuando el usuario accede a un módulo:

1. Se realiza una solicitud al backend.
2. El servidor consulta la base de datos.
3. La información es enviada al frontend.
4. React actualiza automáticamente la interfaz.

Este comportamiento garantiza que la información mostrada siempre corresponda al estado actual de la base de datos.

---

# Manejo de errores

Las páginas implementan un manejo básico de errores para informar al usuario cuando ocurre alguna situación inesperada.

Los casos más comunes incluyen:

* Error de conexión con el servidor.
* Datos inválidos.
* Fallos durante la autenticación.
* Recursos inexistentes.
* Errores al crear o actualizar registros.

Cuando ocurre alguno de estos eventos, la aplicación muestra un mensaje descriptivo y evita que la interfaz quede en un estado inconsistente.

---

# Diseño de las páginas

Todas las vistas del sistema mantienen una estructura visual uniforme.

Generalmente están compuestas por:

* Menú lateral de navegación.
* Encabezado de la página.
* Indicadores o estadísticas cuando son necesarios.
* Área principal de trabajo.
* Formularios para creación o edición.
* Listados o tablas con la información registrada.

Mantener esta estructura común facilita el aprendizaje de la aplicación y proporciona una experiencia de uso consistente para el usuario.

# Patrones de Desarrollo

El frontend fue desarrollado siguiendo una estructura modular que facilita la reutilización de componentes y el mantenimiento del código.

Cada módulo tiene una responsabilidad específica y evita concentrar demasiada lógica en un único archivo.

---

# Organización de los componentes

Los componentes del proyecto pueden clasificarse en tres grupos principales.

## Componentes de interfaz

Son elementos reutilizables encargados de mostrar información al usuario.

Entre ellos se encuentran:

* StatCard
* StatusPanel
* QuickAccess

Estos componentes reciben información mediante propiedades (props) y no contienen lógica relacionada con la base de datos.

---

## Componentes de navegación

Se encargan de la estructura general de la aplicación y permanecen visibles durante la navegación.

En este grupo se encuentran:

* Sidebar
* UserCard

Su responsabilidad consiste en facilitar el desplazamiento entre los diferentes módulos y mostrar la información del usuario autenticado.

---

## Páginas

Las páginas representan los módulos principales del sistema.

Cada una contiene la lógica necesaria para:

* Consultar información.
* Mostrar resultados.
* Crear registros.
* Actualizar datos.
* Eliminar información.

---

# Comunicación con el Backend

Todas las solicitudes HTTP se realizan mediante las funciones definidas en **dcimApi.js**.

Esta estrategia permite centralizar la comunicación con el servidor y evita repetir código en cada componente.

Las operaciones implementadas son:

* Consulta de información.
* Creación de registros.
* Actualización de datos.
* Eliminación de registros.

Además, el archivo incorpora automáticamente el token JWT cuando el usuario ha iniciado sesión.

---

# Manejo del estado

La aplicación utiliza los Hooks de React para administrar el estado de cada componente.

Los más utilizados son:

* **useState**, para almacenar información temporal.
* **useEffect**, para ejecutar operaciones al cargar una página.
* **useNavigate**, para realizar cambios de ruta.
* **useSearchParams**, para administrar filtros enviados mediante la URL.

Cada página administra únicamente el estado relacionado con su propio funcionamiento.

---

# Flujo de una operación

Las operaciones realizadas por el usuario siguen un flujo similar.

```text
Usuario
      │
      ▼
Interfaz React
      │
      ▼
dcimApi.js
      │
      ▼
Backend
      │
      ▼
Base de datos
      │
      ▼
Respuesta
      │
      ▼
Actualización de la vista
```

Este proceso se utiliza tanto para consultas como para operaciones de creación, edición y eliminación.

---

# Organización de la información

La información recibida desde el backend se almacena temporalmente dentro del estado del componente correspondiente.

Cuando el servidor devuelve nuevos datos, React actualiza automáticamente la interfaz sin necesidad de recargar la página.

Este comportamiento proporciona una experiencia de usuario más fluida y mantiene sincronizada la información mostrada con la base de datos.

---

# Navegación

La navegación entre módulos se implementó utilizando **React Router**.

Cada opción del menú corresponde a una ruta específica dentro de la aplicación.

El sistema permite desplazarse entre:

* Dashboard
* Sitios
* Salas
* Racks
* Dispositivos
* Fabricantes
* Modelos

Algunos módulos también permiten navegar utilizando parámetros en la URL para mostrar únicamente la información relacionada con un recurso determinado.

Por ejemplo:

```text
/sites
/rooms?site_id=1
/racks?room_id=3
/devices?rack_id=5
```

Este mecanismo facilita la reutilización de páginas sin necesidad de crear nuevas vistas para cada caso.

---

# Organización de estilos

Los estilos del proyecto fueron desarrollados mediante archivos CSS independientes.

Cada componente posee su propio archivo de estilos, lo que facilita el mantenimiento y evita conflictos entre diferentes secciones de la aplicación.

La estructura utilizada es la siguiente:

```text
Componente.jsx
Componente.css
```

Adicionalmente existe un archivo **index.css**, donde se definen los estilos globales utilizados por toda la aplicación.

---

# Configuración del proyecto

La aplicación utiliza **Vite** como herramienta para el desarrollo y construcción del frontend.

Durante el desarrollo se configuró un proxy que redirige las solicitudes realizadas al backend.

De esta forma, las peticiones enviadas desde el frontend utilizan la ruta `/api`, mientras que Vite se encarga de redireccionarlas automáticamente al servidor correspondiente.

Esta configuración simplifica el desarrollo y evita problemas relacionados con CORS.

---

# Buenas prácticas implementadas

Durante el desarrollo del frontend se procuró mantener las siguientes prácticas:

* Separación entre la lógica de negocio y la interfaz.
* Reutilización de componentes.
* Organización modular del proyecto.
* Centralización de las solicitudes HTTP.
* Uso de componentes independientes para facilitar el mantenimiento.
* Nombres descriptivos para carpetas, archivos y funciones.

Estas prácticas permiten ampliar el sistema con nuevas funcionalidades sin afectar significativamente el código existente.

---

# Consideraciones de mantenimiento

Para incorporar nuevos módulos al sistema se recomienda seguir la estructura ya existente.

Cada nueva funcionalidad debería incluir:

* Una carpeta dentro de **pages**.
* Los componentes específicos necesarios.
* Las funciones correspondientes en el backend.
* Las rutas necesarias dentro de React Router.

Mantener esta organización ayuda a conservar la consistencia del proyecto y facilita su evolución.

---

# Resumen

El frontend del proyecto DCIM fue diseñado siguiendo una arquitectura basada en componentes reutilizables y páginas independientes.

La comunicación con el backend se encuentra centralizada, lo que reduce la duplicación de código y simplifica el mantenimiento de la aplicación.

La utilización de React, React Router y Vite permitió construir una interfaz organizada, de fácil navegación y preparada para futuras ampliaciones.

Esta documentación tiene como propósito servir como guía para comprender la estructura general del frontend y facilitar futuras tareas de mantenimiento o desarrollo sobre el proyecto.
