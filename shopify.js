// import { ApolloClient, InMemoryCache } from '@apollo/client';

// const client = new ApolloClient({
//     uri: 'https://hydrogen-storefront-ec.myshopify.com/api/2021-07/graphql.json', // Replace with your Shopify Storefront API endpoint
//     cache: new InMemoryCache(),
//     headers: {
//         'X-Shopify-Storefront-Access-Token': '0bedf783cf155d3a5baa8c67fe741c39',
//         // Replace with your Storefront API access token
//     },
// });

// export default client;

export async function fetchShopifyAPI(query, variables = {}) {
    try {
        const response = await fetch('https://hydrogen-storefront-ec.myshopify.com/api/2023-07/graphql.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': '0bedf783cf155d3a5baa8c67fe741c39',
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const { data } = await response.json();

        if (!data) {
            throw new Error('No data received from Shopify API');
        }

        return data;
    } catch (error) {
        throw new Error(`Error fetching from Shopify API: ${error.message}`);
    }
}
