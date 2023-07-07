'use client'  // 

import { useEffect, useState } from 'react';
import { fetchShopifyAPI } from '@/shopify';
import NavBar from './NavBar';
import Footer from './Footer';
import Link from 'next/link';

function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const gql = String.raw
                const query = gql`
                query {
                  products(first: 10) {
                    edges {
                      node {
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
                  }
                }
              `;
                const { products } = await fetchShopifyAPI(query)
                setProducts(products.edges);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    console.log("PRODUCTS", products)
    console.log("Price", products[3].node.variants.edges[0].node.priceV2.amount)

    return (
        <div>
            <NavBar />
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    Announcing our next round of funding.{' '}
                    <a href="#" className="font-semibold text-indigo-600">
                        <span className="absolute inset-0" aria-hidden="true" />
                        Read more <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </div>
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Data to enrich your online business
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                    fugiat veniam occaecat fugiat aliqua.
                </p>
            </div>
            <div className='w-screen h-screen'>

                <img
                    src='snowBoard.jpg'
                    alt='Snow Board Image'
                    className='object-cover w-full h-full' />
            </div>

            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="sr-only">Products</h2>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">

                        {products.map((product) => (
                            <Link key={product.node.id}
                                href={`/products/${product.node.handle}`}
                                legacyBehavior>
                                <a className="group">
                                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                        {
                                            product.node.images.edges.length > 0 ?
                                                (product.node.images.edges.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img.node.originalSrc}
                                                        alt={img.node.altText}
                                                        // width={500}
                                                        // height={500}
                                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                                    />
                                                ))) : (
                                                    <img
                                                        src='no-image-icon-6.png'
                                                        alt='No Product Image Found'
                                                        // width={500}
                                                        // height={500}
                                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                                    />
                                                )
                                        }
                                    </div>
                                    <h3 className="mt-4 text-sm text-gray-700">{product.node.title}</h3>
                                    {
                                        product.node.variants.edges.map((edge) => (
                                            <p className="mt-1 text-lg font-medium text-gray-900">{edge.node.priceV2.amount}</p>
                                        ))
                                    }

                                </a>
                            </Link>
                        ))}

                    </div>
                </div>
            </div>
            <Footer />
        </div >
    );
}

export default HomePage