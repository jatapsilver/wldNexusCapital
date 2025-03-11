"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterForm } from "@/components/RegisterForm";
import { ForgetForm } from "@/components/ForgetForm";
import { Eye, EyeOff } from "lucide-react";
import { postAuthSignin } from "@/server/frontLogin/posthAuthSignin";

export function LoginForm({
  className,
  ...props
}: Readonly<React.ComponentPropsWithoutRef<"div">>) {
  const [view, setView] = useState<"login" | "register" | "forget">("login");
  const [viewPassword, setViewPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = await postAuthSignin(email, password);

    if (userData) {
      if (userData.profile === "superadmin" || userData.profile === "admin") {
        router.push("/dashboardAdmin");
      } else if (
        userData.profile === "ambassador" ||
        userData.profile === "user"
      ) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 z-30 ", className)} {...props}>
      {(() => {
        if (view === "register") {
          return <RegisterForm onBack={() => setView("login")} />;
        } else if (view === "forget") {
          return <ForgetForm onBack={() => setView("login")} />;
        } else {
          return (
            <Card className="bg-white/10 animate-fade-in z-30">
              <CardHeader>
                <CardTitle className="text-2xl text-accent-landing">
                  Iniciar Sesión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6 text-white">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@mail.com"
                        className="text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Contraseña</Label>
                        <button
                          type="button"
                          onClick={() => setView("forget")}
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline hover:text-accent-landing"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>
                      <div className="flex items-center">
                        <Input
                          id="password"
                          type={viewPassword ? "text" : "password"}
                          placeholder="********"
                          className="text-black"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setViewPassword(!viewPassword)}
                          className="ml-2 text-sm text-accent-landing hover:underline"
                        >
                          {viewPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Login
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm text-white">
                    ¿No tienes cuenta?{" "}
                    <button
                      type="button"
                      onClick={() => setView("register")}
                      className="underline underline-offset-4 hover:text-accent-landing"
                    >
                      Regístrate
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>
          );
        }
      })()}
    </div>
  );
}
