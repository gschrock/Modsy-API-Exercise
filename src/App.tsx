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
 * exercise - there are a lot more for each
 * product!
 */
export interface Product {
  image: string;
  name: string;
  longDescription: string;
  salePrice: number;
  sku: number;
}

const AppImpl: React.SFC = () => {
  // The products we have for display.
  const [products, setProducts] = useState<Product[] | undefined>(undefined);
  /**
   * The total amount of pages for this api query. We set a
   * initial value of 2 pages until we update the total
   * on ComponentDidMount.
   */
  const [totalPages, setTotalPages] = useState(2);
  // The current page of results we have requested.
  const [currentPage, setCurrentPage] = useState(1);
  // Tracks fetching state of the app.
  const [isFetching, setIsFetching] = useState(false);

  /**
   * By passing an empty array to this useEffect hook as
   * a dependency, we fetch the inital products and set them
   * and the total pages for the query with useState on
   * ComponentDidMount.
   */
  useEffect(() => {
    const fetchProducts = async () => {
      const url = `https://api.bestbuy.com/v1/products(search=oven&search=stainless&search=steel)?format=json&show=all&page=1&apiKey=mPlbr5GXMVkagVgzwT7T2V5X`;
      const apiResponse = await fetch(url).then(response =>
        response.json().then((data: ApiData) => data)
      );
      setProducts(apiResponse.products);
      setTotalPages(apiResponse.totalPages);
    };
    fetchProducts();
  }, []);

  /**
   * This hook is used to add and remove a scroll event listener,
   * and handleScroll is used to set our fetching state to true
   * when the user scrolls to the bottom of the window.
   */
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    /**
     * If the page to fetch is less than or equal to the total pages
     * available for this product query, we set our fetching state
     * to true.
     */
    let pageToFetch = currentPage;
    pageToFetch = pageToFetch + 1;
    if (pageToFetch <= totalPages) {
      setIsFetching(true);
    }
  };

  /**
   * When the fetching state is true we make another request to the
   * api for the next page of results. If the response is successful
   * we update the fetching state to false, update the current page,
   * and finally concat the newly retrieved products to the product
   * state.
   */
  useEffect(() => {
    if (!isFetching) return;
    const fetchProducts = async () => {
      const url = `https://api.bestbuy.com/v1/products(search=oven&search=stainless&search=steel)?format=json&show=all&page=${currentPage +
        1}&apiKey=mPlbr5GXMVkagVgzwT7T2V5X`;
      const apiResponse = await fetch(url)
        .then(response => {
          if (response.status !== 200)
            throw new Error(`HTTP request error, status = ${response.status}`);
          return response.json();
        })
        .then((data: ApiData) => {
          setIsFetching(false);
          setCurrentPage(currentPage + 1);
          return data;
        })
        .catch(error => console.error(error));
      products &&
        apiResponse &&
        setProducts(products.concat(apiResponse.products));
    };
    fetchProducts();
  }, [currentPage, products, totalPages, isFetching]);

  return (
    <div style={{ padding: "0.5rem" }}>
      <ProductCardContainer>
        {/**
         * If we have products to display, iterate over
         * the items and render them. Otherwise, if we
         * have no products, the app should display a
         * loading spinner to let the user know that the
         * initial items to displayed are being fetched.
         */}
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
      {/**
       * If fetching, display the loading spinner at the
       * bottom of the products list.
       */}
      {isFetching && <LoadingSpinnerImpl />}
      {/**
       * If the current page is equal to the max number of
       * pages, display a message that there are no more
       * products to display.
       */}
      {currentPage === totalPages && (
        <NoMoreProductsText>No more products to display.</NoMoreProductsText>
      )}
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

const NoMoreProductsText = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 0.25rem;
`;

export default AppImpl;
