import React from "react";
import { Card } from "react-bootstrap";
import styled from "styled-components";
import { Product } from "../App";

interface Props {
  item: Product;
}

const ProductCardImpl: React.SFC<Props> = ({ item }) => {
  return (
    <StyledCard>
      <StyledCardTitle>{item.name}</StyledCardTitle>
      <ImgContainer>
        {item.image ? (
          <StyledCardImg variant="top" src={item.image} />
        ) : (
          "No Image"
        )}
      </ImgContainer>
      <Card.Body>
        <Card.Text>{item.longDescription}</Card.Text>
        <StyledPriceText>{`$${item.salePrice}`}</StyledPriceText>
      </Card.Body>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  color: black;
  font-size: 1rem;
  width: 18rem;
  margin-bottom: 0.25rem;
`;

const StyledCardTitle = styled(Card.Title)`
  padding: 1.25rem;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledCardImg = styled(Card.Img)`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const StyledPriceText = styled(Card.Text)`
  font-weight: 900;
  display: flex;
  justify-content: flex-end;
`;

export default ProductCardImpl;
