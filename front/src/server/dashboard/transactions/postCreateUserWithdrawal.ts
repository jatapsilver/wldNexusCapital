import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createUserWithdrawal = async (
  id: string,
  createUserWithdrawalsDto: { description: string; value: string }
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    const body = JSON.stringify(createUserWithdrawalsDto);

    const response = await fetch(
      `${API_URL}/transaction-history/createUserWithdrawal/${id}`,
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
      let errorMsg = "Error al crear el retiro del usuario";
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } else {
        errorMsg = await response.text();
      }
      throw new Error(errorMsg);
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
      text: data.message ?? "El retiro se procesó correctamente.",
      icon: "success",
      confirmButtonText: "Aceptar",
    });

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error en la petición:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Ocurrió un error al procesar el retiro.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } else {
      console.error("Error en la petición:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al procesar el retiro.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
    return null;
  }
};
