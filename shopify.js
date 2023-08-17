export async function fetchShopifyAPI(query, variables = {}) {
    try {
        const response = await fetch('https://hydrogen-storefront-ec.myshopify.com/api/2023-07/graphql.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': '614cfb3168b5b9ae186388e295f1edf0',
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
        console.log("Shopify response data", data)

        if (!data) {
            throw new Error('No data received from Shopify API');
        }

        return data;
    } catch (error) {
        throw new Error(`Error fetching from Shopify API: ${error.message}`);
    }
}


// import { GraphQLClient } from 'graphql-request'
// const fetchShopifyAPI = async (query, variables) => {
//     const endpoint = 'https://hydrogen-storefront-ec.myshopify.com/api/2023-07/graphql.json'
//     const token = "614cfb3168b5b9ae186388e295f1edf0"
//     const graphQLClient = new GraphQLClient(endpoint, {
//         headers: {
//             'X-Shopify-Storefront-Access-Token': token,
//         },
//     })
//     return await graphQLClient.request(query, variables)
// }
// export default fetchShopifyAPI