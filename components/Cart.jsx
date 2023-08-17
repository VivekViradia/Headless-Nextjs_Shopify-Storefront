"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchShopifyAPI } from "@/shopify";
// import fetchShopifyAPI from "@/shopify";

const gql = String.raw;
const getCartQuery = gql`
  query getCart($cartID: ID!) {
    cart(id: $cartID) {
      id
      lines(first: 50) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                  width
                  height
                }
                product {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
      checkoutUrl
    }
  }
`;
const removeItemMutation = gql`
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
    }
  }
`;
const Cart = ({ cartID }) => {
  console.log("Cart Component", cartID);
  const [cart, setCart] = useState();

  useEffect(() => {
    async function fetchCartProducts() {
      try {
        const variables = {
          cartID: cartID,
        };
        console.log("variables", variables);
        const cartData = await fetchShopifyAPI(getCartQuery, variables);
        setCart(cartData.cart);
        console.log("Cart Product cartData", cartData);
      } catch (error) {
        console.log("Error in Data Fetching", error);
      }
    }

    if (cartID) {
      fetchCartProducts();
    }
  }, [cartID]);

  const handleRemoveItem = async (cartId, lineId) => {
    const variables = {
      cartId,
      lineIds: [lineId],
    };
    await fetchShopifyAPI(removeItemMutation, variables);
  };
  console.log("cart", cart);
  return (
    <div>
      <h1 className='text-xl'>Cart</h1>
      {console.log("Inside return", cart)}
      {console.log("Inside return", cart?.checkoutUrl)}
      <form action={cart?.checkoutUrl} method='GET'>
        <ul>
          {cart?.lines.edges.map((item) => {
            const variant = item.node.merchandise;
            return (
              <li key={item.node.id}>
                <div>
                  <Image
                    src={variant.image.url}
                    alt={variant.image.altText}
                    width={250}
                    height={250}
                  />
                </div>
                <Link
                  href={"/products/" + variant.product.handle}
                  legacyBehavior
                >
                  <a>{variant.product.title}</a>
                </Link>
                <div>{variant.priceV2.amount}</div>
                <div>Quantity: {item.node.quantity}</div>
                <button
                  onClick={() => {
                    handleRemoveItem(cart.id, item.node.id);
                  }}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
        <h2>Total</h2>
        <div>{cart?.estimatedCost.totalAmount.amount}</div>
        <button
          className='mt-10 flex border border-transparent bg-indigo-600 px-3 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          type='submit'
        >
          Checkout
        </button>
      </form>
    </div>
  );
};
export default Cart;
