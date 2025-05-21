import { Metadata } from "next";
import { getProductById } from "@/app/utils/api";

export async function generateMetadata({ params }) {
  console.log("Generating metadata for product ID:", params.id); // Development log, remove in production

  try {
    // Fetch product details from the API
    const product = await getProductById(params.id);

    if (!product) {
      console.log("Product not found for ID:", params.id); // Log when product is not found
      return {
        title: "Product Not Found",
        description: "This product does not exist.",
        openGraph: {
          title: "Product Not Found",
          description: "This product does not exist.",
          images: [{ url: "/default-image.jpg", width: 1200, height: 630 }],
          type: "website", // Use 'website' type for a general page
          url: `https://new.d1sxehwz73fgxh.amplifyapp.com/products/${params.id}`, // Use dynamic URL
        },
        twitter: {
          card: "summary_large_image",
          title: "Product Not Found",
          description: "This product does not exist.",
          images: ["/default-image.jpg"],
          site: "@YourTwitterHandle", // Optionally add your Twitter handle
        },
      };
    }

    console.log("Product found:", JSON.stringify(product)); // Development log, remove in production

    const productData = product?.product;
    const imageUrl = productData?.variants?.[0]?.images[0] || "/default-image.jpg"; // Safeguard against missing images

    return {
      title: productData?.name || "No Name",
      description: productData?.description || "Check out this product!",
      openGraph: {
        title: productData?.name || "No Name",
        description: productData?.description || "Check out this product!",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          },
        ],
        type: "website", // Use 'website' for product pages
        url: `https://new.d1sxehwz73fgxh.amplifyapp.com/products/${params.id}`, // Dynamic URL
      },
      twitter: {
        card: "summary_large_image",
        title: productData?.name || "No Name",
        description: productData?.description || "Check out this product!",
        images: [imageUrl],
        site: "@YourTwitterHandle", // Add your Twitter handle
      },
    };
  } catch (error) {
    console.error("Error fetching product:", error); // Log any errors in fetching product
    return {
      title: "Error Fetching Product",
      description: "There was an error fetching product details.",
      openGraph: {
        title: "Error Fetching Product",
        description: "There was an error fetching product details.",
        images: [{ url: "/default-image.jpg", width: 1200, height: 630 }],
        type: "website", // Type to indicate a general website page
        url: "https://new.d1sxehwz73fgxh.amplifyapp.com/error", // Dynamic URL or error page URL
      },
      twitter: {
        card: "summary_large_image",
        title: "Error Fetching Product",
        description: "There was an error fetching product details.",
        images: ["/default-image.jpg"],
        site: "@YourTwitterHandle", // Add your Twitter handle
      },
    };
  }
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
