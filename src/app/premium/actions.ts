"use server";

import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function isUserSubscribed() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return { success: false };

  const existingUser = await prisma.user.findUnique({ where: { id: user.id } });

  if (!existingUser) return { success: false };


  const isSubscribed = existingUser.plan === "premium" || existingUser.plan === "popular";

  return { success: true, subscribed: isSubscribed };
}
