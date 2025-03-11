const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCancelledPurchaseOrder = async (userId: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No se encontró el token de autenticación.");
      return null;
    }

    const response = await fetch(
      `${API_URL}/purchase-order/cancelledPurchaseOrder/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error al cancelar la orden: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cancelar la orden:", error);
    return null;
  }
};
