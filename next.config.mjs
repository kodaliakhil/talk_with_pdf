/** @type {import('next').NextConfig} */

const nextConfig = {
    // (Optional) Export as a static site
    // See https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#configuration
    // output: 'export', // Feel free to modify/remove this option
    output: 'standalone',
    // Override the default webpack configuration

    // transformers.js configuration for `client-side`
    // webpack: (config) => {
    //     // See https://webpack.js.org/configuration/resolve/#resolvealias
    //     config.resolve.alias = {
    //         ...config.resolve.alias,
    //         "sharp$": false,
    //         "onnxruntime-node$": false,
    //     }
    //     return config;
    // },

    // transformers.js configuration for `server-side`
    experimental: {
        serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
    },
}



export default nextConfig