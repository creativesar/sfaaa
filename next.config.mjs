/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'cdn.sanity.io'
            }
        ],
        domains: ['cdn.sanity.io', 'pagedone.io'], // Add the hostnames here
    }
};

export default nextConfig;