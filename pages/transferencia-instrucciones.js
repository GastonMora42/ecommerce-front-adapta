import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import { useRouter } from "next/router";
import Footer from "@/components/Footer"; // Importamos el Footer

const Container = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
`;

const InfoContainer = styled.div`
  margin-top: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 10px;
`;

const ProductContainer = styled.div`
  margin-top: 20px;
`;

const ProductBox = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
`;

const ProductImage = styled.img`
  max-width: 80px;
  max-height: 80px;
  border-radius: 8px;
`;

const TotalContainer = styled(Container)`
  background-color: #e9ecef;
`;

const TransferenciaInstrucciones = () => {
  const router = useRouter();
  const { products, name, email, city, postalCode, streetAddress, items, country, total } = router.query;

  // Parsear los productos si están presentes en el query
  let parsedProducts = [];
  if (products) {
    try {
      parsedProducts = JSON.parse(products);
    } catch (error) {
      console.error("Error parsing products JSON:", error);
    }
  }

  // Calcular el total con descuento del 10%
  const totalNumber = parseFloat(total);
  const descuento = totalNumber * 0.1;
  const totalConDescuento = totalNumber - descuento;

  return (
    <>
      <Header />
      <Center>

        {/* Mostrar productos */}
        <ProductContainer>
          <SectionTitle>Productos Seleccionados:</SectionTitle>
          {parsedProducts && parsedProducts.map((product, index) => (
            <ProductBox key={index}>
              <ProductImage src={product.images[0]} alt={product.title} />
              <InfoText>{product.title}</InfoText>
            </ProductBox>
          ))}
        </ProductContainer>

        {/* Mostrar total a transferir */}
        <TotalContainer>
          <SectionTitle>Total a Transferir:</SectionTitle>
          <InfoText>${totalConDescuento.toFixed(2)}</InfoText>
          <InfoText>(Descuento del 10% aplicado)</InfoText>
        </TotalContainer>

        <Container>
          <SectionTitle>Instrucciones para la Transferencia Bancaria</SectionTitle>
          <InfoText>
            En espera de pago
            <br />
            ¡Hola! 😊 Gracias por tu compra. Sólo falta el pago para que empaquetemos tus productos.
          </InfoText>
          <InfoText>
            Haz una transferencia bancaria a esta cuenta:
          </InfoText>
          <InfoText>
            <strong>Gaston Mora</strong><br />
            Alias: gastonmora42<br />
            Banco: Lemon<br />
            CVU: 0000168300000004196161<br />
            CUIT: 20433586205
          </InfoText>
          <InfoText>
            ❗️IMPORTANTE:
          </InfoText>
          <InfoText>
            📧 Envío de Comprobante: Envía el comprobante a gaston-mora@hotmail.com y escríbenos el DNI o CUIT de la persona que realiza el pago (Titular de la cuenta).
          </InfoText>
          <InfoText>
            🔄 Qué comprobante: Por favor, utiliza el botón de compartir / descargar comprobante desde la app de tu banco. Asegúrate que aparezcan todos los datos.
          </InfoText>
          <InfoText>
            Un Solo Medio 📤: Envía el comprobante solo por un medio (correo a gaston-mora@hotmail.com) para evitar confusiones.
          </InfoText>
          <InfoText>
            Aprobación ⏰: Los comprobantes se aprueban de lunes a viernes en horario laboral.
          </InfoText>
          <InfoText>
            Si tenes alguna duda o necesitas asistencia adicional, no dudes en contactarnos vía Whatsapp.
          </InfoText>
        </Container>

        {/* Mostrar datos del pedido */}
        <Container>
          <SectionTitle>Datos del Pedido:</SectionTitle>
          <InfoText>Nombre: {name}</InfoText>
          <InfoText>Email: {email}</InfoText>
          <InfoText>Ciudad: {city}</InfoText>
          <InfoText>Código Postal: {postalCode}</InfoText>
          <InfoText>Calle: {streetAddress}</InfoText>
          <InfoText>País: {country}</InfoText>
        </Container>
      </Center>
      <Footer />
    </>
  );
};

export default TransferenciaInstrucciones;
