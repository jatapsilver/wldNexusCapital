import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SignupRequestBody {
  name: string;
  email: string;
  sponsor: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export const postAuthSignup = async (
  name: string,
  email: string,
  sponsor: string,
  username: string,
  password: string,
  confirmPassword: string
): Promise<void> => {
  try {
    const requestBody: SignupRequestBody = {
      name,
      email,
      sponsor,
      username,
      password,
      confirmPassword,
    };

    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type");

    let responseData;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        responseData.message || responseData || "Error en el registro"
      );
    }

    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text:
        typeof responseData === "object" ? responseData.message : responseData,
      confirmButtonColor: "#2ECC71",
    });
  } catch (error: unknown) {
    let errorMessage =
      "Hubo un problema al crear tu cuenta. Inténtalo nuevamente.";

    if (error instanceof Error) {
      console.error("Error al registrar usuario:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Error al registrar usuario:", error);
    }

    Swal.fire({
      icon: "error",
      title: "Error en el registro",
      text: errorMessage,
      confirmButtonColor: "#FF4500",
    });
  }
};
