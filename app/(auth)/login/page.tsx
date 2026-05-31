import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";
import Image from "next/image";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-screen h-screen">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 w-[30vw] lg:w-[10vw]">
        <Image
          src="/logo/logo_line.svg"
          alt="Logo Lifeflow™"
          className="w-full h-full object-contain"
          width={1920}
          height={1080}
        />
      </div>
      <div className="flex h-screen w-screen">
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-8">
          <LoginForm />
        </div>

        <div className="w-1/2 h-full p-4 hidden lg:block">
          <div className="bg-olive-200 rounded-2xl w-full h-full flex items-center justify-center aspect-[1/1.125] overflow-hidden">
            <Image
              src="/placeholders/auth-placeholder_upscale.webp"
              alt="Placeholder"
              loading="eager"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-left"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
