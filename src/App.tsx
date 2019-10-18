import React, { useEffect, useState } from "react";
import styled from "styled-components";
import LoadingSpinnerImpl from "./components/LoadingSpinner";
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
 * product details we care about in this
 * exercise.
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
  const [totalPages, setTotalPages] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchProducts = async (currentPage: number) => {
    setCurrentPage((currentPage += 1));
    if (currentPage <= totalPages) {
      const url = `https://api.bestbuy.com/v1/products(search=oven&search=stainless&search=steel)?format=json&show=all&page=${currentPage}&apiKey=mPlbr5GXMVkagVgzwT7T2V5X`;
      const apiResponse = await fetch(url).then(response =>
        response.json().then((data: ApiData) => data)
      );
      products
        ? setProducts(products.concat(apiResponse.products))
        : setProducts(apiResponse.products);
      setTotalPages(apiResponse.totalPages);
      setCurrentPage(apiResponse.currentPage);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setIsFetching(true);
  };

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  const fetchMoreListItems = () => {
    setTimeout(() => {
      fetchProducts(currentPage);
    }, 300);
  };

  return (
    <div style={{ padding: "0.5rem" }}>
      <ProductCardContainer>
        {products && products.length > 0 ? (
          products.map(item => (
            <div key={item.sku}>
              <ProductCardImpl item={item} />
            </div>
          ))
        ) : (
          <AppLoadSpinnerContainer>
            <LoadingSpinnerImpl />
          </AppLoadSpinnerContainer>
        )}
      </ProductCardContainer>
      {isFetching && <LoadingSpinnerImpl />}
    </div>
  );
};

const AppLoadSpinnerContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ProductCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
`;

export default AppImpl;
