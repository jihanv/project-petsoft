import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import { auth } from "@/lib/auth"

export default async function Home() {

    const session = await auth()
    return (<main>
        <H1 className=" text-white my-8">Your Account</H1>

        <ContentBlock className="h-[500px] flex justify-center items-center">
            <p>Logged in as {session?.user?.email}</p>
        </ContentBlock>
    </main>);
}
// use auth() to access logged user email for the session (server)
// use useSession() to access logged user email for the session (client)