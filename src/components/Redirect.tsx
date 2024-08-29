'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


type Plan = 'popular' | 'premium' | 'enterprise'
type Period = 'monthly' | 'yearly'


const STRIPE_LINKS: Record<Plan, Record<Period, string | undefined>> = {
    popular: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK_FOUR_USERS,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK_FOUR_USERS,
    },
    premium: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK_TEN_USERS,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK_TEN_USERS,
    },
    enterprise: {
        monthly: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PAYMENT_LINK_TWENTY_USERS,
        yearly: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PAYMENT_LINK_TWENTY_USERS,
    },
}

type Props = {
    plan: Plan
    period: Period
}

const RedirectRoute: React.FC<Props> = ({ plan, period }) => {
    const router = useRouter()

    useEffect(() => {
        const getStripePaymentLink = () => {
           
            if (STRIPE_LINKS[plan] && STRIPE_LINKS[plan][period]) {
                return STRIPE_LINKS[plan][period]
            } else {
                console.error('Invalid plan or period.')
                return null
            }
        }

        const link = getStripePaymentLink()

        if (link) {
            window.location.href = link
        } else {
            console.error('No payment link found for the specified plan and period.')
        }
    }, [plan, period])

    return <div>Redirecting...</div>
}

export default RedirectRoute
