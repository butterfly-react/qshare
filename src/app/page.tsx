import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";

type Props = {
	searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Home({ searchParams }: Props) {

	const teamMembers= searchParams ? searchParams["count"] ?? "4" : "4"; // default value is "4"


	return (
		<main>
			<Hero />
			<Pricing />
		</main>
	);
}
