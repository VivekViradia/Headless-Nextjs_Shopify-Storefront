
'use client' //

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchShopifyAPI } from '@/shopify';
import { useSearchParams } from 'next/navigation';

function ProductPage() {
  // const router = useRouter();
  // const { handle } = router.query;

  const searchParams = useSearchParams();
  const handle = searchParams.get('productHandle')
  console.log('productHandle', handle)


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const gql = String.raw;
        const query = gql`
        query($handle: String!) {
            productByHandle(handle: $handle) {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    priceV2 {
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
          handle: handle,
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

    if (handle) {
      fetchProduct();
    }
  }, [handle]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }


  return (
    <div>
      <h1>Vivek Viradia</h1>
      <h1>{product.title}</h1>
      {/* <p>{product.description}</p>
      <img src={product.images.edges[0].node.originalSrc} alt={product.images.edges[0].node.altText} />
      <p>Price: {product.variants.edges[0].node.priceV2.amount}</p> */}
    </div>
  );
}

export default ProductPage;
