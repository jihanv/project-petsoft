import { prisma } from "@/lib/db";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  // Stripe will send a webhook with json data

  // const data = await request.json();

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  // Verify webhook came from stripe

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook verification failed.", error);
    return Response.json(null, { status: 400 });
  }

  // Fufill order

  switch (event.type) {
    case "checkout.session.completed":
      await prisma.user.update({
        where: {
          email: event.data.object.customer_email,
        },
        data: {
          hasAccess: true,
        },
      });
      console.log("Approved!" + event.data.object.customer_email);

      break;
    default:
      console.log("Unhandled event type ", event.type);
  }

  // Return 200 OK
  return Response.json(null, { status: 200 });
}

//Open folder that has stripe then open with cmd.exe
// stripe login
// stripe listen --forward-to localhost:3000/api/stripe

// ngrok
// ngrok http --url=biogenic-greg-unadmonitory.ngrok-free.app 3000
