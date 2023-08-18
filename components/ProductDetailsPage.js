
'use client' //

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchShopifyAPI } from '@/shopify';
// import fetchShopifyAPI from "@/shopify";
import { useSearchParams } from 'next/navigation';
import { useAppContext } from '@/lib/AppContext';

const gql = String.raw;
const query = gql`
query($productHandle: String!) {
    productByHandle(handle: $productHandle) {
      id
      title
      handle
      description
      images(first: 1) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const createCartMutation = gql`
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
      }
    }
  }
`

const updateCartMutation = gql`
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
    }
  }
`

const ProductPage = async () => {

  const searchParams = useSearchParams();
  const productHandle = searchParams.get('productHandle')
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1)
  const { state, setState } = useAppContext()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const variables = {
          productHandle: productHandle,
        };
        console.log("variables", variables)
        const { productByHandle } = await fetchShopifyAPI(query, variables);
        console.log('Product Handle Data', productByHandle)
        setProduct(productByHandle);
        setState(productByHandle)
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }

    if (productHandle) {
      fetchProduct();
    }
  }, [productHandle]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }
  const getLines = () => [
    {
      quantity: parseInt(quantity),
      merchandiseId: product.variants.edges[0].node.id,
    },
  ]


  const handleAddToCart = async () => {
    let cartId = sessionStorage.getItem('cartId')
    if (cartId) {
      const variables = {
        cartId,
        lines: getLines(),
      }
      const data = await fetchShopifyAPI(updateCartMutation, variables)
      cartId = data.cartLinesAdd.cart.id
      sessionStorage.setItem('cartId', cartId)
    } else {
      const variables = {
        input: {
          lines: getLines(),
        },
      }
      const data = await fetchShopifyAPI(createCartMutation, variables)
      cartId = data.cartCreate.cart.id
      sessionStorage.setItem('cartId', cartId)
    }
    console.log("cartId", cartId)
    const cartNumber = cartId.slice(19,)
    router.push(`/cart?cartNumber=${cartNumber}`)
  }

  console.log("Product Page---", state)

  return (
    <div>
      <h1>{product.title}</h1>
      <div >
        <div>
          {
            product.images.edges.length > 0 ?
              (product.images.edges.map((img, index) => (
                <img
                  key={index}
                  src={img.node.url}
                  alt={img.node.altText}
                  width='200'
                  height='200'
                />
              ))) : (
                <img
                  src='no-image-icon-6.png'
                  alt='No Product Image Found'
                  width='200'
                  height='200'
                />
              )
          }
          <div>
            {
              product.variants.edges.map((price, index) => (
                <p key={index}>Price:{price.node.price.amount}</p>
              ))
            }
          </div>
          <div>
            {
              product.description ? (<h3>
                Description:{product.description}
              </h3>) : (<h3>No Description need</h3>)
            }

          </div>
          <input
            type="number"
            name="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div>
            <button
              onClick={handleAddToCart}
              type="submit"
              className="mt-10 flex border border-transparent bg-indigo-600 px-3 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add to bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
