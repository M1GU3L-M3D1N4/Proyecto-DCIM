export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();
// Solo agregamos parámetros que tengan un valor definido y no vacío
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, value);
    }
  });
// Construimos la cadena de consulta a partir de los parámetros válidos
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
// Función para construir una cadena de consulta a partir de un objeto de parámetros
// Solo se incluyen parámetros que tengan un valor definido y no vacío, lo que evita agregar claves con valores vacíos a la URL.
export async function fetchJson(path, fallback = undefined) {
  try {
    const token = localStorage.getItem("token"); // Obtener el token de autenticación del almacenamiento local
    const response = await fetch(path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }); // Realizar la solicitud fetch con el token en el encabezado si está disponible
    if (!response.ok) {
      if (fallback !== undefined) return fallback;
      throw new Error(`HTTP ${response.status}`);
    }
    // Intentar parsear la respuesta como JSON, si falla se devuelve null
    return await response.json();
  } catch (error) {
    if (fallback !== undefined) return fallback;
    throw error;
  }
}
// Función para realizar una solicitud GET y parsear la respuesta como JSON
// Si la respuesta no es exitosa (status no OK), se lanza un error con el código HTTP
// Si ocurre cualquier error durante la solicitud o el parseo, se devuelve un valor de fallback si se proporciona, o se lanza el error.
export async function postJson(path, body) {
  const token = localStorage.getItem("token");
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // Agregar el token al encabezado si está disponible
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);
// Si la respuesta no es exitosa, se lanza un error con el mensaje proporcionado por el servidor o el código HTTP
  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return data;
}
// Función para realizar una solicitud POST con un cuerpo JSON
// El token de autenticación se incluye en el encabezado si está disponible
// Si la respuesta no es exitosa, se lanza un error con el mensaje proporcionado por el servidor o el código HTTP 
export async function putJson(path, body) {
  const token = localStorage.getItem("token");
  const response = await fetch(path, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return data;
}

// Función para realizar una solicitud PUT con un cuerpo JSON
// El token de autenticación se incluye en el encabezado si está disponible
// Si la respuesta no es exitosa, se lanza un error con el mensaje proporcionado por el servidor o el código HTTP 
export async function deleteJson(path) {
  const token = localStorage.getItem("token");
  const response = await fetch(path, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || `HTTP ${response.status}`);
  }

  return true;
}