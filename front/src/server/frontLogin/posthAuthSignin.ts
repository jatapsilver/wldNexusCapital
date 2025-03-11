import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginRequestBody {
  email: string;
  password: string;
}

interface DecodedToken {
  username: string;
  sub: string;
  profile: string;
  iat?: number;
  exp?: number;
}

export const postAuthSignin = async (
  email: string,
  password: string
): Promise<{
  token: string;
  profile: string;
  username: string;
  uuid: string;
} | null> => {
  try {
    const requestBody: LoginRequestBody = { email, password };

    const response = await fetch(`${API_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = response.headers.get("content-type");

    let responseData;
    if (contentType?.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new Error(responseData.message || "Error en el inicio de sesión");
    }

    const decoded: DecodedToken = jwtDecode(responseData.access_token);

    localStorage.setItem("token", responseData.access_token);
    localStorage.setItem("profile", decoded.profile);
    localStorage.setItem("username", decoded.username);
    localStorage.setItem("sub", decoded.sub);

    Swal.fire({
      icon: "success",
      title: "Inicio de sesión exitoso",
      text: "Bienvenido a NeuroBotIA",
      confirmButtonColor: "#2ECC71",
    });

    return {
      token: responseData.access_token,
      profile: decoded.profile[0],
      username: decoded.username,
      uuid: decoded.sub,
    };
  } catch (error: unknown) {
    let errorMessage =
      "Hubo un problema al iniciar sesión. Inténtalo nuevamente.";

    if (error instanceof Error) {
      console.error("Error al iniciar sesión:", error.message);
      errorMessage = error.message;
    } else {
      console.error("Error al iniciar sesión:", error);
    }

    Swal.fire({
      icon: "error",
      title: "Error de inicio de sesión",
      text: errorMessage,
      confirmButtonColor: "#FF4500",
    });

    return null;
  }
};
