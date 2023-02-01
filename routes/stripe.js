const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment", async (req, resp) => {
  const charge = await stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        resp.status(500).json(stripeErr);
      } else {
        console.log("Stripe res: " + stripeRes);
        resp.status(200).json(charge);
      }
    }
  );
});

module.exports = router;
