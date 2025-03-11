import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createSupportTicket = async (
  id: string,
  subject: string,
  message: string
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const body = JSON.stringify({
      subject,
      message,
    });

    const response = await fetch(
      `${API_URL}/support-tickets/createSupportTicket/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el ticket de soporte");
    }

    let data: { message?: string } = {};
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data.message = text;
    }

    Swal.fire({
      title: "Operación exitosa",
      text: data.message ?? "El ticket se creó correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un error al crear el ticket.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      console.error("Error en la petición:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al crear el ticket.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    return null;
  }
};
