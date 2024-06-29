import Center from "@/components/Center";
import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";

const Bg = styled.div`
  background-color: #222;
  background-image: url('/portada-web-adapta.png'); 
  background-size:  max-width: 300%; max-height: 200px;
  background-position: center; /* Centra la imagen */
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 3rem;
  }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: .8rem;
`;

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  img {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
    div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 100%;
    }
  }
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export default function Featured({ products }) {
  return (
    <Bg>
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>Adapta</Title>
              <h2>Bienvenido al mundo fungi</h2>
              <ButtonsWrapper>
                <ButtonLink href={'/products'} outline={1} white={1}>Conoce todos nuestros productos</ButtonLink>
              </ButtonsWrapper>
            </div>
          </Column>
          <Column>
            <img src="/sticker-hongo.png" alt=""/>
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
