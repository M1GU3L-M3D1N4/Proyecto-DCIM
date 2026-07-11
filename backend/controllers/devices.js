/* Devices es un controlador que maneja las operaciones CRUD para los dispositivos en la aplicación.
Se conecta al repositorio de la base de datos para realizar las operaciones necesarias y devuelve las respuestas adecuadas al cliente. 
Las funciones incluyen listar dispositivos, obtener un dispositivo por ID, crear un nuevo dispositivo, actualizar un dispositivo existente y eliminar un dispositivo. 
Cada función maneja errores y devuelve mensajes de error apropiados en caso de fallas.
Es el backend del componente de dispositivos, que se encuentra en la ruta ./components/Devices.jsx.
Cada constante y función está documentada con comentarios para explicar su propósito y funcionamiento.
Pide solicitudes HTTP y devuelve respuestas JSON con los datos de los dispositivos o mensajes de error según corresponda.
*/

const repository = require('../db/repository');  // Esta línea importa el módulo de repositorio de la base de datos, que contiene funciones para interactuar con la base de datos y realizar operaciones CRUD en los dispositivos.

// GET /api/devices esto significa que la función list se ejecutará cuando se haga una solicitud GET a la ruta /api/devices.
exports.list = async (req, res) => {
  try {
    const { rack_id, model_id, status } = req.query;
    const filters = {};
    if (rack_id) filters.rack_id = rack_id;
    if (model_id) filters.model_id = model_id;
    if (status) filters.status = status;
    
    const devices = await repository.getDevices(filters);
    return res.json(devices);
  } catch (error) {
    console.error('Error listing devices:', error);
    return res.status(500).json({ error: 'Error al cargar dispositivos', details: error.message });
  }
};
/* La sesion del codigo anterior es la funcion list, que es un controlador que maneja la solicitud GET a la ruta /api/devices.
Esta función obtiene los parámetros de consulta (rack_id, model_id, status) de la solicitud y los utiliza para filtrar los dispositivos que se obtendrán de la base de datos.
Luego, llama a la función getDevices del repositorio para obtener la lista de dispositivos según los filtros aplicados.
Si la operación es exitosa, devuelve la lista de dispositivos en formato JSON. 
Si ocurre un error durante el proceso, captura el error, lo registra en la consola y devuelve una respuesta con un código de estado 500 y un mensaje de error en formato JSON.
*/



// GET /api/devices/:id esto significa que la función getById se ejecutará cuando se haga una solicitud GET a la ruta /api/devices/:id, donde :id es un parámetro de ruta que representa el ID del dispositivo que se desea obtener.
exports.getById = async (req, res) => {
  try {
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    return res.json({
      ...device,
      model_name: device.model_name ?? 'Sin modelo',
      vendor_name: device.vendor_name ?? 'Sin fabricante',
      device_type: device.device_type ?? 'N/D',
      rack_code: device.rack_code ?? 'Sin rack',
      room_name: device.room_name ?? 'Sin sala',
      room_floor: device.room_floor ?? 'N/D',
      site_name: device.site_name ?? 'Sin sitio',
    });
  } catch (error) {
    console.error('Error getting device:', error);
    return res.status(500).json({ error: 'Error al obtener dispositivo', details: error.message });
  }
};
/* La sesion del codigo anterior es la funcion getById, que es un controlador que maneja la solicitud GET a la ruta /api/devices/:id. Esta función obtiene el ID del dispositivo de los parámetros de la solicitud y llama a la función getDeviceById del repositorio para obtener los detalles del dispositivo correspondiente.
Si el dispositivo no se encuentra, devuelve una respuesta con un código de estado 404 y un mensaje de error en formato JSON.
Si el dispositivo se encuentra, devuelve los detalles del dispositivo en formato JSON, incluyendo información adicional como el nombre del modelo, el nombre del fabricante, el tipo de dispositivo, el código del rack, el nombre de la sala, el piso de la sala y el nombre del sitio. 
Si ocurre un error durante el proceso, captura el error, lo registra en la consola y devuelve una respuesta con un código de estado 500 y un mensaje de error en formato JSON.
*/

// POST /api/devices esto significa que la función create se ejecutará cuando se haga una solicitud POST a la ruta /api/devices. Esta función se encarga de crear un nuevo dispositivo en la base de datos.
exports.create = async (req, res) => {
  try {
    const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = req.body;
    
    if (!model_id || !name) {
      return res.status(400).json({ error: 'model_id y name son requeridos' });
    }
    
    const model = await repository.getModelById(model_id);
    if (!model) return res.status(404).json({ error: 'Model no encontrado' });
    
    const newDevice = await repository.createDevice({
      model_id,
      name,
      asset_tag,
      serial_number,
      rack_id,
      u_start,
      status: status || 'active',
      installed_at,
    });
    
    return res.status(201).json(newDevice);
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      const duplicateField = error?.sqlMessage?.includes('serial_number')
        ? 'serial_number'
        : error?.sqlMessage?.includes('asset_tag')
          ? 'asset_tag'
          : 'campo único';
      return res.status(409).json({
        error: `Valor duplicado en ${duplicateField}`,
        details: 'El serial y asset tag deben ser únicos por equipo.',
      });
    }
    console.error('Error creating device:', error);
    return res.status(500).json({ error: 'Error al crear dispositivo', details: error.message });
  }
};
/* La seccion anterior de codigo es la funcion create, que es un controlador que maneja la solicitud POST a la ruta /api/devices. Esta función obtiene los datos del nuevo dispositivo del cuerpo de la solicitud y valida que se proporcionen los campos requeridos (model_id y name).
Luego, verifica si el modelo especificado existe en la base de datos llamando a la función getModelById del repositorio. Si el modelo no se encuentra, devuelve una respuesta con un código de estado 404 y un mensaje de error en formato JSON.
Si el modelo existe, llama a la función createDevice del repositorio para crear un nuevo dispositivo con los datos proporcionados. Si la operación es exitosa, devuelve el nuevo dispositivo creado en formato JSON con un código de estado 201.
Si ocurre un error durante el proceso, captura el error y verifica si es un error de entrada duplicada (ER_DUP_ENTRY). Si es así, devuelve una respuesta con un código de estado 409 y un mensaje de error indicando qué campo tiene un valor duplicado. 
Si ocurre cualquier otro error, lo registra en la consola y devuelve una respuesta con un código de estado 500 y un mensaje de error en formato JSON.
*/

// PUT /api/devices/:id esto significa que la función update se ejecutará cuando se haga una solicitud PUT a la ruta /api/devices/:id, donde :id es un parámetro de ruta que representa el ID del dispositivo que se desea actualizar. Esta función se encarga de actualizar un dispositivo existente en la base de datos.
exports.update = async (req, res) => {
  try {
    const { model_id, name, asset_tag, serial_number, rack_id, u_start, status, installed_at } = req.body;
    
    if (!model_id || !name) {
      return res.status(400).json({ error: 'model_id y name son requeridos' });
    }
    
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    const model = await repository.getModelById(model_id);
    if (!model) return res.status(404).json({ error: 'Model no encontrado' });
    
    const updatedDevice = await repository.updateDevice(req.params.id, {
      model_id,
      name,
      asset_tag,
      serial_number,
      rack_id,
      u_start,
      status: status || 'active',
      installed_at,
    });
    
    return res.json(updatedDevice);
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      const duplicateField = error?.sqlMessage?.includes('serial_number')
        ? 'serial_number'
        : error?.sqlMessage?.includes('asset_tag')
          ? 'asset_tag'
          : 'campo único';
      return res.status(409).json({
        error: `Valor duplicado en ${duplicateField}`,
        details: 'El serial y asset tag deben ser únicos por equipo.',
      });
    }
    console.error('Error updating device:', error);
    return res.status(500).json({ error: 'Error al actualizar dispositivo', details: error.message });
  }
};
/* esta sección de código es la función update, que es un controlador que maneja la solicitud PUT a la ruta /api/devices/:id. Esta función obtiene el ID del dispositivo de los parámetros de la solicitud y los datos actualizados del cuerpo de la solicitud.
Valida que se proporcionen los campos requeridos (model_id y name) y verifica si el dispositivo y el modelo especificado existen en la base de datos llamando a las funciones getDeviceById y getModelById del repositorio. 
Si el dispositivo o el modelo no se encuentran, devuelve una respuesta con un código de estado 404 y un mensaje de error en formato JSON.
Si ambos existen, llama a la función updateDevice del repositorio para actualizar el dispositivo con los datos proporcionados. Si la operación es exitosa, devuelve el dispositivo actualizado en formato JSON.
Si ocurre un error durante el proceso, captura el error y verifica si es un error de entrada duplicada (ER_DUP_ENTRY). Si es así, devuelve una respuesta con un código de estado 409 y un mensaje de error indicando qué campo tiene un valor duplicado. 
Si ocurre cualquier otro error, lo registra en la consola y devuelve una respuesta con un código de estado 500 y un mensaje de error en formato JSON.
*/

// DELETE /api/devices/:id esto significa que la función delete se ejecutará cuando se haga una solicitud DELETE a la ruta /api/devices/:id, donde :id es un parámetro de ruta que representa el ID del dispositivo que se desea eliminar. Esta función se encarga de eliminar un dispositivo existente en la base de datos.
exports.delete = async (req, res) => {
  try {
    const device = await repository.getDeviceById(req.params.id);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    
    await repository.deleteDevice(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting device:', error);
    return res.status(500).json({ error: 'Error al eliminar dispositivo', details: error.message });
  }
};
/* la ultima sección de código es la función delete, que es un controlador que maneja la solicitud DELETE a la ruta /api/devices/:id. Esta función obtiene el ID del dispositivo de los parámetros de la solicitud y verifica si el dispositivo existe en la base de datos llamando a la función getDeviceById del repositorio.
Si el dispositivo no se encuentra, devuelve una respuesta con un código de estado 404 y un mensaje de error en formato JSON.
Si el dispositivo existe, llama a la función deleteDevice del repositorio para eliminar el dispositivo de la base de datos. Si la operación es exitosa, devuelve una respuesta con un código de estado 204 (sin contenido).
Si ocurre un error durante el proceso, captura el error, lo registra en la consola y devuelve una respuesta con un código de estado 500 y un mensaje de error en formato JSON.
*/

/* el repositorio de la base de datos (repository) es un módulo que contiene funciones para interactuar con la base de datos y realizar operaciones CRUD en los dispositivos.
Las funciones del repositorio incluyen:
- getDevices(filters): Obtiene una lista de dispositivos según los filtros proporcionados.
- getDeviceById(id): Obtiene los detalles de un dispositivo específico por su ID.
- createDevice(deviceData): Crea un nuevo dispositivo en la base de datos con los datos proporcionados.
- updateDevice(id, deviceData): Actualiza un dispositivo existente en la base de datos con los datos proporcionados.
- deleteDevice(id): Elimina un dispositivo existente de la base de datos por su ID.
esto se almacena en el archivo backend/db/repository.js y se importa en este controlador para ser utilizado en las funciones CRUD.
*/
