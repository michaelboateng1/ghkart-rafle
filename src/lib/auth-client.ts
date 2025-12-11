import { createAuthClient } from "better-auth/svelte";
import { emailOTPClient } from "better-auth/client/plugins";

export const authCLient = createAuthClient({
    plugins: [
        emailOTPClient()
    ]
})
