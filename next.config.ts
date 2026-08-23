import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Square injects its card form from these origins; omitting any of them breaks
// card entry. Both sandbox and production hosts are allowed so switching
// SQUARE_ENVIRONMENT does not require a CSP change.
const SQUARE_SCRIPT = [
  "https://web.squarecdn.com",
  "https://sandbox.web.squarecdn.com",
  "https://js.squareup.com",
  "https://js.squareupsandbox.com",
];
const SQUARE_FRAME = [
  "https://web.squarecdn.com",
  "https://sandbox.web.squarecdn.com",
  "https://connect.squareup.com",
  "https://connect.squareupsandbox.com",
];
const SQUARE_CONNECT = [
  "https://pci-connect.squareup.com",
  "https://pci-connect.squareupsandbox.com",
  "https://connect.squareup.com",
  "https://connect.squareupsandbox.com",
];

const csp = [
  `default-src 'self'`,
  // 'unsafe-inline' is required by Next's inline bootstrap; 'unsafe-eval' only in dev.
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ""}${SQUARE_SCRIPT.join(" ")}`,
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `font-src 'self' data: https://fonts.gstatic.com https://d1g145x70srn7h.cloudfront.net`,
  `img-src 'self' data: blob: https://images.unsplash.com https://plus.unsplash.com https://res.cloudinary.com`,
  `connect-src 'self' ${SQUARE_CONNECT.join(" ")} https://api.cloudinary.com`,
  `frame-src 'self' ${SQUARE_FRAME.join(" ")}`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  ...(isDev ? [] : [`upgrade-insecure-requests`]),
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Report-Only until a full sandbox checkout is verified against it,
          // then rename to "Content-Security-Policy" to enforce.
          { key: "Content-Security-Policy-Report-Only", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;
