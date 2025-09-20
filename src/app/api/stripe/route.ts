import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  // Stripe will send a webhook with json data

  const data = await request.text();

  console.log(data);

  // Verify webhook came from stripe

  // Fufill order
  //   await prisma.user.update({
  //     where: {
  //       email: data.data.object.customer_email,
  //     },
  //     data: {
  //       hasAccess: true,
  //     },
  //   });

  //   // Return 200 OK
  return Response.json(null, { status: 200 });
}

//Open stripe then open with cmd.exe
