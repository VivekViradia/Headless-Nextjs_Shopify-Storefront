
'use client' //

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchShopifyAPI } from '@/shopify';
import { useSearchParams } from 'next/navigation';

function ProductPage() {

  const searchParams = useSearchParams();
  const productHandle = searchParams.get('productHandle')
  console.log('productHandle', productHandle)


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
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

        const variables = {
          productHandle: productHandle,
        };

        const { productByHandle } = await fetchShopifyAPI(query, variables);
        console.log('Product Handle Data', productByHandle)
        setProduct(productByHandle);
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

  console.log(product.description)
  return (
    <div>
      <h1>Vivek Viradia</h1>
      <h1>{product.title}</h1>
      <div >
        <div>
          {
            product.images.edges.map((img, index) => (
              <img
                key={index}
                src={img.node.url}
                alt={img.node.alttext}
                width='200'
                height='200'
              />
            ))
          }
          <div>
            {
              product.variants.edges.map((price, index) => (
                <p key={index}>Price:{price.node.price.amount}</p>
              ))
            }
          </div>
          <div>
            <h3>
              Description:{product.description}
            </h3>
          </div>
          <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add to bag
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
