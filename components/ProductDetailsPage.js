
'use client' //
import { useEffect, useState } from 'react';
import { fetchShopifyAPI } from '@/shopify';

function ProductDetailsPage({ productId }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                const gql = String.raw;
                const query = gql`
         query($productId: ID!) {
  product(id: $productId) {
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
          price
        }
      }
    }
    createdAt
  }
}
        `;

                const variables = {
                    productId: productId,
                };

                const { product } = await fetchShopifyAPI(query, variables);
                setProduct(product);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchProductDetails();
    }, [productId]);

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
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            {/* <img src={product.images.edges[0].node.originalSrc} alt={product.images.edges[0].node.altText} />
            <p>Price: {product.variants.edges[0].node.priceV2.amount}</p> */}
        </div>
    );
}

export default ProductDetailsPage;
