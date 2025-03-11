const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllUserHashes = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No se encontró el token de autenticación.");
      return null;
    }

    const response = await fetch(
      `${API_URL}/purchase-order/userHashTransactions/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Error al obtener hashes: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la petición:", error);
    return null;
  }
};
