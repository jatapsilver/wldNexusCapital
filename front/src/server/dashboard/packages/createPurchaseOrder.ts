// createPurchaseOrder.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPurchaseOrder = async (
  userId: string,
  packageID: string
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Error: No se encontró el token de autenticación.");
      return null;
    }
    const response = await fetch(
      `${API_URL}/purchase-order/createPurchaseOrder/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageID }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error al crear la orden de compra: ${response.statusText}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error al crear la orden de compra:", error);
    return null;
  }
};
