import Head from "@/components/Head";
import Recipe from "@/components/Recipe";

export default function Home() {
    return (
        <main className="main">
            <div className="container">
                <Head 
                    title="Food assistant"
                    text="This calorie calculator will break down your chosen dish into ingredients and calculate their calorie content."
                />
                <Recipe />
            </div>
        </main>
    );
}
