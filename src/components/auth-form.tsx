import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AuthFormBtn } from "./auth-form-btn";

export type AuthProps = {
    type: "logIn" | "signUp"
}


// DO not forget to include a "name" attribute
export default function AuthForm({ type }: AuthProps) {


    return (
        <form
            action={type === "logIn" ? logIn : signUp}>
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" required />
            </div>
            <div className="mb-4 mt-2 space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" required />
            </div>
            <AuthFormBtn type={type} />
        </form>

    )
}
