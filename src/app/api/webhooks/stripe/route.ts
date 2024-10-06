import prisma from "@/db/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const BACKEND_BASE_URL = process.env.STRIPE_BACKEND_BASE_URL!;
const ACCESS_TOKEN = process.env.STRIPE_SUBSCRIPTION_SAVE_ACCESS_TOKEN!;

export async function POST(req: Request) {
  const body = await req.text();

  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;
  
  
  try {
	  event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
	} catch (err: any) {
		console.error("Webhook signature verification failed.", err.message);
		return new Response(`Webhook Error: ${err.message}`, { status: 400 });
	}
	
	// Handle the event
	try {
	const s = event.data.object as Stripe.Checkout.Session;
    switch (event.type) {
      case "checkout.session.completed":
        const session = await stripe.checkout.sessions.retrieve(
          (event.data.object as Stripe.Checkout.Session).id,
          {
            expand: ["line_items"],
          }
        );
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        console.log("SUBSCRIPTION! :", subscription);

        const customerId = session.customer as string;
        const customerDetails = session.customer_details;
        const qshareAdmin = session.custom_fields[0]?.text?.value;
        const subDomain = session.custom_fields[1]?.text?.value;

        if (customerDetails?.email) {
          const user = await prisma.user.findUnique({
            where: { email: customerDetails.email },
          });
          if (!user) throw new Error("User not found");

          // if (!user.customerId) {
          // 	await prisma.user.update({
          // 		where: { id: user.id },
          // 		data: { customerId },
          // 	});
          // }

          const lineItems = session.line_items?.data || [];

          for (const item of lineItems) {
            const priceId = item.price?.id;
            const isSubscription = item.price?.type === "recurring";

            if (isSubscription) {
              // let endDate = new Date();
              // if (priceId === process.env.STRIPE_YEARLY_PRICE_ID_FOUR_USERS!) {
              // 	endDate.setFullYear(endDate.getFullYear() + 1);
              // } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID_FOUR_USERS! ||  priceId === process.env.STRIPE_MONTHLY_PRICE_ID_FIVE_USERS!) {
              // 	endDate.setMonth(endDate.getMonth() + 1);
              // } else {
              // 	throw new Error("Invalid priceId");
              // }

              if (
                priceId === process.env.STRIPE_YEARLY_PRICE_ID_FOUR_USERS! ||
                priceId === process.env.STRIPE_MONTHLY_PRICE_ID_FOUR_USERS!
              ) {
                // await prisma.subscription.upsert({
                //     where: { userId: user.id! },
                //     create: {
                //         userId: user.id,
                //         startDate: new Date(),
                //         endDate: endDate,
                //         plan: "popular",
                //         period: priceId === process.env.STRIPE_YEARLY_PRICE_ID_FOUR_USERS! ? "yearly" : "monthly",
                //     },
                //     update: {
                //         plan: "popular",
                //         period: priceId === process.env.STRIPE_YEARLY_PRICE_ID_FOUR_USERS! ? "yearly" : "monthly",
                //         startDate: new Date(),
                //         endDate: endDate,
                //     },
                // });

                // await prisma.user.update({
                //     where: { id: user.id },
                //     data: { plan: "popular" },
                // });

                await fetch(`${BACKEND_BASE_URL}/subscription/save`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-strfe-access-header": `${ACCESS_TOKEN}`,
                  },
                  body: JSON.stringify({
                    action: "create",
                    subscriptionId: session.subscription,
                    user: {
                      email: customerDetails.email,
                      customerId: customerId,
                    },
                    // startDate: new Date().toISOString(),
                    // endDate: endDate.toISOString(),
                    startDate: new Date(
                      subscription.current_period_start * 1000
                    ).toISOString(),
                    endDate: new Date(
                      subscription.current_period_end * 1000
                    ).toISOString(),
                    plan: "popular",
                    period:
                      priceId === process.env.STRIPE_YEARLY_PRICE_ID_FOUR_USERS!
                        ? "yearly"
                        : "monthly",
                    canceledAtPeriodEnd: false,
                    additionalData: { qshareAdmin, subDomain },
                  }),
                });
              } else if (
                priceId === process.env.STRIPE_MONTHLY_PRICE_ID_TEN_USERS! ||
                priceId === process.env.STRIPE_YEARLY_PRICE_ID_TEN_USERS!
              ) {
                console.log("HERE 20");
                // await prisma.subscription.upsert({
                //     where: { userId: user.id! },
                //     create: {
                //         userId: user.id,
                //         startDate: new Date(),
                //         endDate: endDate,
                //         plan: "premium",
                //         period: "monthly",
                //     },
                //     update: {
                //         plan: "premium",
                //         period:  "monthly",
                //         startDate: new Date(),
                //         endDate: endDate,
                //     },
                // });

                // await prisma.user.update({
                //     where: { id: user.id },
                //     data: { plan: "premium" },
                // });

                await fetch(`${BACKEND_BASE_URL}/subscription/save`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-strfe-access-header": `${ACCESS_TOKEN}`,
                  },
                  body: JSON.stringify({
                    action: "create",
                    subscriptionId: session.subscription,
                    user: {
                      email: customerDetails.email,
                      customerId: customerId,
                    },
                    startDate: new Date(
                      subscription.current_period_start * 1000
                    ).toISOString(),
                    endDate: new Date(
                      subscription.current_period_end * 1000
                    ).toISOString(),
                    plan: "premium",
                    period:
                      priceId === process.env.STRIPE_YEARLY_PRICE_ID_TEN_USERS!
                        ? "yearly"
                        : "monthly",
                    canceledAtPeriodEnd: false,
                    additionalData: { qshareAdmin, subDomain },
                  }),
                });
              } else if (
                priceId === process.env.STRIPE_MONTHLY_PRICE_ID_TWENTY_USERS! ||
                priceId === process.env.STRIPE_YEARLY_PRICE_ID_TWENTY_USERS!
              ) {
                console.log("HERE 20");
                // await prisma.subscription.upsert({
                //     where: { userId: user.id! },
                //     create: {
                //         userId: user.id,
                //         startDate: new Date(),
                //         endDate: endDate,
                //         plan: "enterprise",
                //         period: "monthly",
                //     },
                //     update: {
                //         plan: "enterprise",
                //         period:  "yearly",
                //         startDate: new Date(),
                //         endDate: endDate,
                //     },
                // });

                // await prisma.user.update({
                //     where: { id: user.id },
                //     data: { plan: "enterprise" },
                // });

                await fetch(`${BACKEND_BASE_URL}/subscription/save`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-strfe-access-header": `${ACCESS_TOKEN}`,
                  },
                  body: JSON.stringify({
                    action: "create",
                    subscriptionId: session.subscription,
                    user: {
                      email: customerDetails.email,
                      customerId: customerId,
                    },
                    startDate: new Date(
                      subscription.current_period_start * 1000
                    ).toISOString(),
                    endDate: new Date(
                      subscription.current_period_end * 1000
                    ).toISOString(),
                    plan: "enterprise",
                    period:
                      priceId ===
                      process.env.STRIPE_YEARLY_PRICE_ID_TWENTY_USERS!
                        ? "yearly"
                        : "monthly",
                    canceledAtPeriodEnd: false,
                    additionalData: { qshareAdmin, subDomain },
                  }),
                });
              }
            } else {
              // one_time_purchase
            }
          }
        }
        break;
      case "customer.subscription.updated":
        {
  
          const subscription = await stripe.subscriptions.retrieve(
            (event.data.object as Stripe.Subscription).id
          );

          if (subscription.cancel_at && subscription.cancel_at_period_end) {
            const canceledAtPeriodEnd = subscription.cancel_at_period_end;
            const status = subscription.status;

            const body = {
              action: "update",
              subscriptionId: subscription.id,
              canceledAtPeriodEnd: canceledAtPeriodEnd,
              user: {
                customerId: subscription.customer,
              },
              ...(status !== undefined && { status }),
            };

            await fetch(`${BACKEND_BASE_URL}/subscription/save`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-strfe-access-header":
                  "UUKLD7B06gTxPttHTFvgfekswwdRmltcHCAqKukknuevlOOZU9RebIkbw5UOOcIaCrxmjkLueWu1Sv0HfpXLeO2bilzFH3Rl3SHG",
              },
              body: JSON.stringify(body),
            });
          }

          // const user = await prisma.user.findUnique({
          // 	where: { customerId: subscription.customer as string },
          // });

          // if (user && subscription) {
          // 	const canceledAtPeriodEnd = subscription.cancel_at_period_end;

          // 	await prisma.subscription.update({
          // 		where: { userId: user.id! },
          // 		data: {
          // 			canceledAtPeriodEnd: canceledAtPeriodEnd, // Set based on Stripe subscription
          // 		},
          // 	});
          // }
        }
        break;
      case "customer.subscription.deleted": {
        console.log("DELETED");
        const subscription = await stripe.subscriptions.retrieve(
          (event.data.object as Stripe.Subscription).id
        );
        // const user = await prisma.user.findUnique({
        // 	where: { customerId: subscription.customer as string },
        // });
        // if (user) {
        // 	await prisma.user.update({
        // 		where: { id: user.id },
        // 		data: { plan: "cancelled" },
        // 	});
        // } else {
        // 	console.error("User not found for the subscription deleted event.");

        // }

        try {
          await fetch(`${BACKEND_BASE_URL}/subscription/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-strfe-access-header":
                "UUKLD7B06gTxPttHTFvgfekswwdRmltcHCAqKukknuevlOOZU9RebIkbw5UOOcIaCrxmjkLueWu1Sv0HfpXLeO2bilzFH3Rl3SHG",
            },
            body: JSON.stringify({
              action: "delete",
              subscriptionId: subscription.id,
            }),
          });
        } catch (error) {
          console.log((error as Error).message);
        }

        break;
      }

      case "invoice.payment_succeeded": {
       
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string ;
		let subscription: Stripe.Subscription | null = null;
        let sessionId: string | undefined;

        if (subscriptionId) {
          subscription = await stripe.subscriptions.retrieve(subscriptionId);
        } 
		else {
          sessionId = (event.data.object as Stripe.Invoice)?.metadata
            ?.session_id;
			if(sessionId){

				const sessionFromStripe = await stripe.checkout.sessions.retrieve(
				  sessionId
				);
	  
				subscription = await stripe.subscriptions.retrieve(
				  sessionFromStripe.subscription as string
				);
				if(!subscription){
				subscription = await stripe.subscriptions.retrieve(
					  s.subscription as string
				);

				}
			}
        }
		
	
	

		if (subscription) {
			try {
				const response = await fetch(
					`${BACKEND_BASE_URL}/subscription/save`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"x-strfe-access-header": `${ACCESS_TOKEN}`,
						},
						body: JSON.stringify({
							action: "renew",
							subscriptionId: subscription.id, // Itt a subscription típusa Stripe.Subscription
							user: {
								customerId: subscription.customer, // Customer ID
							},
							startDate: new Date(subscription.current_period_start * 1000).toISOString(), // Kezdési dátum
							endDate: new Date(subscription.current_period_end * 1000).toISOString(), // Befejezési dátum
							canceledAtPeriodEnd: false,
						}),
					}
				);
	
				if (!response.ok) {
					throw new Error(`Failed to update subscription: ${response.statusText}`);
				}
			} catch (error) {
				console.error("Error during subscription renewal:", error);
			}
		} else {
			console.warn("No subscription found for this invoice.");
		}
	
		break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error("Error handling event", error);
    return new Response("Webhook Error", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
