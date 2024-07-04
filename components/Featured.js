import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import Image from "next/image"; // Importa la imagen de Next.js para optimización

const Bg = styled.div`
  background-color: #222;
  background-image: url('/portada-web-adapta.png');
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.h2`
  margin: 10px 0;
  font-size: 1.2rem;
  text-align: center;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  img {
    max-width: 80%; /* Reducir el tamaño máximo de la imagen al 80% del contenedor */
    display: block;
    margin: 0 auto;
  }
  @media screen and (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    img {
      max-width: 50%;
      max-height: none;
    }
  }
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    margin-top: 0;
  }
`;

export default function Featured({ products }) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <div>
            <Title>Adapta</Title>
            <Subtitle>Bienvenido al mundo fungi</Subtitle>
            <ButtonsWrapper>
              <ButtonLink href={'/products'} outline={1} white={1}>Conoce todos nuestros productos</ButtonLink>
            </ButtonsWrapper>
          </div>
          <Image src="/sticker-hongo.png" alt="Sticker de hongo" width={300} height={300} />
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
