import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
                pathname: "/**",
            },
        ],
    },
    // allowedDevOrigins: [
    //     "http://localhost:3000"
    // ],

    reactCompiler: true,
};

export default nextConfig;
