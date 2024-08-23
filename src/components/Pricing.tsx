import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import PaymentLink from "./PaymentLink";

enum PopularPlanType {
	NO = 0,
	YES = 1,
}

interface PricingProps {
	title: string;
	popular: PopularPlanType;
	price: number;
	description: string;
	buttonText: string;
	benefitList: string[];
	href: string;
	billing: string;
	paymentLink?: string
}

const pricingList: PricingProps[] = [

	{
		title: "Popular",
		popular: 0,
		price: 1796,
		description: "Ideal for growing teams needing more resources and flexibility. 14 day free trial included. Cancel any time.",
		buttonText: "Get Started",
		benefitList: ["Up to 4 Team members", "2 GB Gallery", "100 products", "Up to 4 templates", "Community support", "Cancel any time"],
		href: "/api/auth/login",
		paymentLink: process.env.STRIPE_MONTHLY_PAYMENT_LINK_FOUR_USERS,
		billing: "/month",
	},
	{
		title: "Premium",
		popular: 1,
		price: 2045,
		description: "Best for established teams requiring advanced features. Cancel any time.",
		buttonText: "Buy Now",
		benefitList: [" 5 Team members", "4 GB Gallery", "Up to 6 templates", "Priority support", "Cancel any time"],
		href: "/api/auth/login",
		billing: "/month",
		paymentLink: process.env.STRIPE_MONTHLY_PAYMENT_LINK_FIVE_USERS,
	},
	{
		title: "Enterprise",
		popular: 0,
		price: 18319,
		description: "Comprehensive solution for large organizations with complex needs. Yearly subscription. Cancel any time",
		buttonText: "Buy Now",
		benefitList: ["Up to 4 Team members", "8 GB Gallery", "Up to 10 templates", "Priority support", "Cancel any time."],
		href: "/api/auth/login",
		billing: "/year",
		paymentLink: process.env.STRIPE_YEARLY_PAYMENT_LINK_FOUR_USERS,
	},
];


export const Pricing = () => {
	return (
		<section id='pricing' className='container'>
			<h2 className='text-3xl md:text-4xl font-bold text-center'>
				Get
				<span className='bg-gradient-to-b from-[#667EEA] to-[#764BA2] uppercase text-transparent bg-clip-text'>
					{" "}
					Unlimited{" "}
				</span>
				Access
			</h2>
			<h3 className='text-xl text-center text-muted-foreground pt-4 pb-8'>
			Choose from the different plans.
			</h3>
			<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{pricingList.map((pricing: PricingProps) => (
					<Card
						key={pricing.title}
						className={
							pricing.popular === PopularPlanType.YES
								? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
								: ""
						}
					>
						<CardHeader>
							<CardTitle className='flex item-center justify-between'>
								{pricing.title}
								{pricing.popular === PopularPlanType.YES ? (
									<Badge variant='secondary' className='text-sm text-primary'>
										Most popular
									</Badge>
								) : null}
							</CardTitle>
							<div>
								<span className='text-3xl font-bold'>DKK {pricing.price}</span>
								<span className='text-muted-foreground'> {pricing.billing}</span>
							</div>

							<CardDescription>{pricing.description}</CardDescription>
						</CardHeader>

						<CardContent>
						<PaymentLink
								href={pricing.href}
								text={pricing.buttonText}
								paymentLink={pricing.paymentLink}
							/>
						</CardContent>

						<hr className='w-4/5 m-auto mb-4' />

						<CardFooter className='flex'>
							<div className='space-y-4'>
								{pricing.benefitList.map((benefit: string) => (
									<span key={benefit} className='flex'>
										<Check className='text-purple-500' /> <h3 className='ml-2'>{benefit}</h3>
									</span>
								))}
							</div>
						</CardFooter>
					</Card>
				))}
			</div>
		</section>
	);
};
