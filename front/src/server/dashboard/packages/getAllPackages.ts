const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllPackages = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No se encontró el token de autenticación.");
      return null;
    }

    const response = await fetch(`${API_URL}/packages/getAllPackages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los paquetes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los paquetes:", error);
    return null;
  }
};
