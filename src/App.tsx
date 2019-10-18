import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCardImpl from "./components/ProductCard";

interface ApiData {
  canonicalUrl: string;
  currentPage: number;
  from: number;
  partial: false;
  products: Product[];
  queryTime: string;
  to: number;
  total: number;
  totalPages: number;
  totalTime: string;
}

/**
 * This interface only has types for the
 * values we care about in this exercise.
 */
export interface Product {
  image: string;
  name: string;
  longDescription: string;
  salePrice: number;
  sku: number;
}

const AppImpl: React.SFC = () => {
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  const fetchProducts = async () => {
    const url =
      "https://api.bestbuy.com/v1/products(search=oven&search=stainless&search=steel)?format=json&show=all&apiKey=mPlbr5GXMVkagVgzwT7T2V5X";
    const apiResponse = await fetch(url)
      .then(function(response) {
        return response.json();
      })
      .then(function(data: ApiData) {
        return data;
      });
    setProducts(apiResponse.products);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <StyledApp>
      <ProductCardContainer>
        {products &&
          products.map(item => (
            <div key={item.sku}>
              <ProductCardImpl item={item} />
            </div>
          ))}
      </ProductCardContainer>
    </StyledApp>
  );
};

const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5rem;
`;

const ProductCardContainer = styled.div`
  max-height: 480px;
  overflow: scroll;
`;

export default AppImpl;
