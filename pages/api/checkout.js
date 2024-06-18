import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2070490052301144-061720-329a5aec1f647459f124e5273afbfd73-1861272759' });

const preference = new Preference(client);

preference.create({
  body: {
    items: [
      {
        title: 'My product',
        quantity: 1,
        unit_price: 2000
      }
    ],
  }
})
.then(console.log)
.catch(console.log);
