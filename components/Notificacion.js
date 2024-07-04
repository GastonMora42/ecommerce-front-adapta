import styled from "styled-components";
import { useContext } from "react";
import { CartContext } from "@/components/CartContext";

const NotificationBox = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #b3e5fc;
  color: #000;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 1rem;
`;

export default function Notification() {
  const { notification } = useContext(CartContext);

  return notification ? <NotificationBox>{notification}</NotificationBox> : null;
}
