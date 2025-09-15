import AuthForm from "@/components/auth-form";
import H1 from "@/components/h1";
import { cookies } from "next/headers";
import Link from "next/link";

export default function Page() {
    const flash = cookies().get("flash")?.value;
    return (
        <main>
            <H1 className="text-center mb-5">Login</H1>
            {flash && <p className="text-sm">{flash}</p>}
            <AuthForm type="logIn" />
            <p className="mt-6 text-sm text-zinc-500">
                No account yet?{" "}
                <Link href="/signup" className="font-medium">Sign up</Link>
            </p>
        </main>
    )
}
