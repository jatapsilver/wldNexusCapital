"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getUserInformation } from "@/server/dashboard/profile/getInformationUser";
import { updateUserInformation } from "@/server/dashboard/profile/updateInformationUser";

const FormSchema = z.object({
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "La fecha de nacimiento debe estar en formato YYYY-MM-DD",
  }),
  country: z
    .string()
    .min(3, { message: "El país debe tener al menos 3 caracteres" })
    .max(50, { message: "Máximo 50 caracteres" }),
  phoneNumber: z
    .string()
    .min(5, { message: "El número de celular es requerido" }),
  wallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: "Dirección de wallet inválida" }),
});

interface UserData {
  name: string;
  email: string;
  username: string;
  sponsor: string;
  wallet: string | null;
  phoneNumber: string | null;
  birthdate: string | null;
  country: string | null;
  createdAt: string;
}

export function FormProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const userId = localStorage.getItem("sub");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      birthdate: "",
      country: "",
      phoneNumber: "",
      wallet: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("sub");
      if (userId) {
        const data = await getUserInformation(userId);

        const mappedUserData: UserData = {
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
          username: data.credential.username,
          sponsor: data.sponsor,
          phoneNumber: data.celphone,
          birthdate: data.birthdate,
          country: data.country,
          wallet: data.credential.walletPublica,
        };

        setUserData(mappedUserData);
        form.reset({
          birthdate: mappedUserData.birthdate ?? "",
          country: mappedUserData.country ?? "",
          phoneNumber: mappedUserData.phoneNumber ?? "",
          wallet: mappedUserData.wallet ?? "",
        });
      } else {
        console.error("User ID is null");
      }
    };

    fetchUserData();
  }, [form]);

  useEffect(() => {
    if (isEditing && userData) {
      form.reset({
        birthdate: userData.birthdate ?? "",
        country: userData.country ?? "",
        phoneNumber: userData.phoneNumber ?? "",
        wallet: userData.wallet ?? "",
      });
    }
  }, [isEditing, userData, form]);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (!userData) return;

    try {
      const updateValues = {
        birthdate: values.birthdate,
        country: values.country,
        celphone: values.phoneNumber,
        walletPublica: values.wallet,
      };
      if (userId) {
        await updateUserInformation(userId, updateValues);
      } else {
        console.error("User ID is null");
      }
      setUserData((prev) => (prev ? { ...prev, ...values } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar la información:", error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-gray-50 px-9 xl:px-40">
      <div className="w-full max-w-lx p-10 border-2 border-black rounded-lg bg-white shadow-md">
        <Form {...form}>
          <form
            className="w-full space-y-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                Nombre Completo
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <Input
                  placeholder={userData?.name ?? "Cargando..."}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                Correo Electrónico
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <Input
                  placeholder={userData?.email ?? "Cargando..."}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                Fecha de Registro
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <Input
                  placeholder={
                    userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString("es-CO")
                      : "Cargando..."
                  }
                  readOnly
                  className="bg-gray-100 cursor-not-allowed text-black"
                />
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">Celular</FormLabel>
              <FormControl className="sm:w-3/4">
                <div>
                  <Input
                    {...form.register("phoneNumber")}
                    readOnly={!isEditing}
                    className={
                      !isEditing
                        ? "bg-gray-100 cursor-not-allowed text-black"
                        : "text-black"
                    }
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                Fecha de nacimiento
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <div>
                  <Input
                    {...form.register("birthdate")}
                    readOnly={!isEditing}
                    className={
                      !isEditing
                        ? "bg-gray-100 cursor-not-allowed text-black"
                        : "text-black"
                    }
                  />
                  {form.formState.errors.birthdate && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.birthdate.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                País de residencia
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <div>
                  <Input
                    {...form.register("country")}
                    readOnly={!isEditing}
                    className={
                      !isEditing
                        ? "bg-gray-100 cursor-not-allowed text-black"
                        : "text-black"
                    }
                  />
                  {form.formState.errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.country.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <FormLabel className="text-black md:w-2/4">
                Wallet de Retiros
              </FormLabel>
              <FormControl className="sm:w-3/4">
                <div>
                  <Input
                    {...form.register("wallet")}
                    readOnly={!isEditing}
                    className={
                      !isEditing
                        ? "bg-gray-100 cursor-not-allowed text-black"
                        : "text-black"
                    }
                  />
                  {form.formState.errors.wallet && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.wallet.message}
                    </p>
                  )}
                </div>
              </FormControl>
            </div>

            <div className="text-end text-xl text-black font-semibold">
              Recuerda utilizar la red de Optimism (OP Mainnet)
            </div>

            {isEditing ? (
              <Button type="submit" className="w-full md:w-1/4 bg-black">
                Enviar Cambios
              </Button>
            ) : (
              <button
                type="button"
                onClick={handleUpdateClick}
                className="w-full md:w-1/4 bg-black p-2 rounded-lg"
              >
                Actualizar Datos
              </button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
