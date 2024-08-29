import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import Redirect from "@/components/Redirect";

type Plan = 'popular' | 'premium' | 'enterprise';
type Period = 'monthly' | 'yearly';

type Props = {
    searchParams?: { [key: string]: string | undefined }
}


const isValidPlan = (plan: string | undefined): plan is Plan => {
    return plan === 'popular' || plan === 'premium' || plan === 'enterprise';
};

const isValidPeriod = (period: string | undefined): period is Period => {
    return period === 'monthly' || period === 'yearly';
};

export default function Subscription({ searchParams }: Props) {
  
    const subscription = searchParams?.plan;
    const period = searchParams?.period;

    console.log(typeof subscription, typeof period);

  
    if (isValidPlan(subscription) && isValidPeriod(period)) {
        return <Redirect plan={subscription} period={period} />;
    }

	return (
		<main>
			{/* <Hero />
			<Pricing /> */}
		</main>
	);
}
