import Branding from "@/components/branding";
import H1 from "@/components/h1"
import Stats from "@/components/stats";

export default function Home() {
    return (
        <main>
            <div className="flex items-center justify-between text-white py-8">
                <Branding />
                <Stats />
            </div>
        </main >
    );
}
