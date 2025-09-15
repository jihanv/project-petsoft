// components/submit-button.tsx
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { AuthProps } from "./auth-form";

export function AuthFormBtn({ type }: AuthProps) {
    const { pending } = useFormStatus();
    return (<Button disabled={pending}>
        {type === "logIn" ? "Login" : "Sign Up"}
    </Button>);
}
