import React from "react";
import { Button, Card } from "react-bootstrap";
import styled from "styled-components";
import { Product } from "../App";

interface Props {
  item: Product;
}

const ProductCardImpl: React.SFC<Props> = ({ item }) => {
  return (
    <StyledCard style={{ width: "18rem" }}>
      <Card.Title>{item.name}</Card.Title>
      <Card.Img variant="top" src={item.image} />
      <Card.Body>
        <Card.Text>{item.longDescription}</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  color: black;
  font-size: 1rem;
  width: 18rem;
`;

export default ProductCardImpl;
