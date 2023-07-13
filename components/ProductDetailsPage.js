
'use client' //

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchShopifyAPI } from '@/shopify';
import { useSearchParams } from 'next/navigation';

function ProductPage() {
  // const router = useRouter();
  // const { handle } = router.query;

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
