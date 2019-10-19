import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

/**
 * A reusable loading spinner component.
 */
const LoadingSpinnerImpl: React.SFC = () => {
  return (
    <LoadSpinnerContainer>
      <Spinner animation="border" variant="success" />
      <LoadingText>Loading...</LoadingText>
    </LoadSpinnerContainer>
  );
};

const LoadingText = styled.div`
  padding-left: 0.25rem;
`;

const LoadSpinnerContainer = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0.25rem;
`;

export default LoadingSpinnerImpl;
