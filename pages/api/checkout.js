export const createOrder = async (req, res) => {
  mercadopage.configure({
    access_token: "APP_USR-2070490052301144-061720-329a5aec1f647459f124e5273afbfd73-1861272759",
  });

  try {
    const result = await mercadopage.preferences.create({
      items: [
        {
          title: "Laptop",
          unit_price: 500,
          currency_id: "PEN",
          quantity: 1,
        },
      ],
      notification_url: "https://e720-190-237-16-208.sa.ngrok.io/webhook",
      back_urls: {
        success: "http://localhost:3000/success",
        // pending: "https://e720-190-237-16-208.sa.ngrok.io/pending",
        // failure: "https://e720-190-237-16-208.sa.ngrok.io/failure",
      },
    });

    console.log(result);

    // res.json({ message: "Payment creted" });
    res.json(result.body);
  } catch (error) {
    return res.status(500).json({ message: "Something goes wrong" });
  }
};

export const receiveWebhook = async (req, res) => {
  try {
    const payment = req.query;
    console.log(payment);
    if (payment.type === "payment") {
      const data = await mercadopage.payment.findById(payment["data.id"]);
      console.log(data);
    }

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something goes wrong" });
  }
};