import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all subscriptions
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { subscriptions: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user.subscriptions);
}

// POST add subscription
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticker } = await req.json();
  if (!ticker) return NextResponse.json({ error: "Ticker required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const subscription = await prisma.subscription.create({
      data: { ticker, userId: user.id },
    });
    return NextResponse.json(subscription);
  } catch (err: any) {
    if (err.code === "P2002") return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE subscription
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker");
  if (!ticker) return NextResponse.json({ error: "Ticker required" }, { status: 400 });

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const deleted = await prisma.subscription.deleteMany({
      where: { userId: user.id, ticker },
    });

    if (deleted.count === 0) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
