"use client"

import { logIn, signUp } from "@/actions/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthFormBtn } from "./auth-form-btn";
import { useFormState } from "react-dom";

export type AuthProps = {
    type: "logIn" | "signUp"
}


// DO not forget to include a "name" attribute
export default function AuthForm({ type }: AuthProps) {

    const [signUpError, dispatchSignUp] = useFormState(signUp, undefined);
    const [logInError, dispatchLogIn] = useFormState(logIn, undefined);
    return (
        <form
            action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
            </div>
            <div className="mb-4 mt-2 space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
            </div>
            <AuthFormBtn type={type} />
            {signUpError && (<p className="text-red-500 text-sm mt-2">{signUpError.message}</p>)}
            {logInError && (<p className="text-red-500 text-sm mt-2">{logInError.message}</p>)}

        </form>

    )
}
