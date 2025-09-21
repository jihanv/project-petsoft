import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  // Stripe will send a webhook with json data

  const data = await request.json();

  // Verify webhook came from stripe

  // Fufill order
  await prisma.user.update({
    where: {
      email: data.data.object.customer_email,
    },
    data: {
      hasAccess: true,
    },
  });

  console.log("Approved!" + data.data.object.customer_email);

  // Return 200 OK
  return Response.json(null, { status: 200 });
}

//Open folder that has stripe then open with cmd.exe
// stripe login
// stripe listen --forward-to localhost:3000/api/stripe
