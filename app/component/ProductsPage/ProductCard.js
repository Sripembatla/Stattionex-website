import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddtoCartMutation } from "@/app/redux-tookit/services/authApi";
import { addItemToCart, removeItemFromCart, updateItemQuantity } from "@/app/redux-tookit/cart/cartSlicer";
import AddToCartButton from "@/app/utils/reusable/addtocart";
import QuantityController from "@/app/utils/reusable/quantity";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  console.log("product", product);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.accessToken);
  const cartData = useSelector((state) => state.cart);


  const [isImageHovered, setIsImageHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const variant = product.variants[0]; // Use the first variant

  // Slideshow effect on hover
  useEffect(() => {
    if (isImageHovered && product?.images?.length > 1) {
      const intervalId = setInterval(() => {
        setImageIndex((prevIndex) =>
          prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
        );
      }, 1500);

      return () => clearInterval(intervalId);
    } else {
      setImageIndex(0); // Reset image when not hovered
    }
  }, [isImageHovered, product.images]);

  const handleMouseLeave = () => {
    setIsImageHovered(false);
    setImageIndex(0);
  };

  const getImageToShow = () => {
    return product?.images?.[imageIndex] || "/fallback.jpg";
  };

  const sellingPrice = variant.sellingPrice;
  const mrp = variant.mrp;
  const hasDiscount = mrp > sellingPrice;
  const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);

  const [addtoCart, { data: cart, isSuccess, isError }] =
    useAddtoCartMutation();

  const cartItem = useSelector((state) =>
    state.cart?.cartItems.find(
      (item) =>
        item.productId === product.id && item.variantId === variant.id
    )
  );

  const handleAddtoCart = async (data, type) => {
    if (variant.inStock === 0) return toast.error("Out of stock");


    if (!variant) return toast.error("Please select a variant");

    if (token == null && type === "orderSummary") return router.push("/auth");

    const selectedImage = product?.images?.[0] || "";

    const dataRedux = {
      productId: product?.id,
      name: product?.name,
      variants: variant, // full variant object
      quantity: 1,
      img: selectedImage || "",
      variantId: variant.id,
    };

    const dataApi = {
      productId: product?.id,
      variantId: variant._id || variant.id,
      units: 1, // update this to user-selected quantity if needed
    };

    const existingItem = cartData?.cartItems?.find(
      (item) =>
        item.productId === dataRedux.productId &&
        item.variantId === dataRedux.variantId
    );

   

    try {


      if (token) {
        const result = await addtoCart(dataApi).unwrap();
        if (result) {
          console.log("result", result);
          if(result.success){

          
          

          toast.success("Item added to cart successfully!");
          if (existingItem) {
            dispatch(
              updateItemQuantity({
                productId: dataRedux.productId,
                variantId: dataRedux.variantId,
                quantity: dataRedux.quantity,
              })
            );
          } else {
            dispatch(addItemToCart(dataRedux));
          }
          // dispatch(
          //   addItemToCart({
          //     ...dataRedux
          //   })
          // );
        }
        } else {
          toast.error("Failed to add item to cart.");
          dispatch(removeItemFromCart({ dataRedux }));
        }
      } else {
        if (existingItem) {
          dispatch(
            updateItemQuantity({
              productId: dataRedux.productId,
              variantId: dataRedux.variantId,
              quantity: dataRedux.quantity,
            })
          );
        } else {
          dispatch(addItemToCart(dataRedux));
        }
        toast.success("Item added to cart successfully!");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong. Try again.");
      dispatch(removeItemFromCart({ dataRedux }));
    }


  };

  return (
    <div className="product-ui-card">
      <div
        className="product-item cursor-pointer"
      >
        {/* Product Image */}
        {product.images.length > 0 ? (
          <figure className="relative group mb-2" onClick={() => router.push(`/products/${product.id}`)}>
            <div className="image-container relative overflow-hidden">
              <img
                alt={product.name}
                src={getImageToShow()}
                className=""
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={handleMouseLeave}
              />
            </div>

            {/* Image navigation dots */}
            {product.images.length > 1 && (
              <div
                className={`flex justify-center space-x-2 h-2 absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${isImageHovered ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
              >
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    aria-label={`Show image ${idx + 1}`}
                    className={`w-2 h-2 rounded-full transition-transform duration-200 ${imageIndex === idx ? "bg-secondary scale-110" : "bg-gray-400"
                      } hover:scale-110 cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageIndex(idx);
                    }}
                  ></button>
                ))}
              </div>
            )}


            {/* Discount Badge */}
            {/* {hasDiscount && (
              <span className="absolute top-2 left-2 bg-white text-[#7b9220] text-sm px-2 py-1 rounded shadow">
                {discount}% OFF
              </span>
            )} */}
          </figure>
        ) : (
          <div className="h-[310px] flex justify-center items-center bg-gray-100">
            No Image Available
          </div>
        )}

        {/* Product Info */}
        <div className="px-2">
          <div className="flex items-center justify-between mt-1">
            <p className="text-sm text-[#141842]">{product.brand}</p>
            <div className="text-[15px] font-medium text-[#262626]">
              ₹{sellingPrice.toFixed(2)}
              {hasDiscount && (
                <span className="text-sm line-through ml-2 text-gray-500">
                  ₹{mrp.toFixed(2)}
                </span>
              )}
            </div>

          </div>
          <h3
            className="text-[14px] font-semibold text-[#141842] h-[40px] line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="text-sm text-gray-600">
            {variant.quantity} {variant.unit}
          </div>

          {cartItem?.quantity > 0 ? (
            <QuantityController
              quantity={cartItem.quantity}
              onIncrease={() =>
                dispatch(
                  updateItemQuantity({
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                    quantity: cartItem.quantity + 1,
                    operation: "increment",
                  })
                )
              }
              onDecrease={() => {
                if (cartItem.quantity > 1) {
                  dispatch(
                    updateItemQuantity({
                      productId: cartItem.productId,
                      variantId: cartItem.variantId,
                      quantity: cartItem.quantity - 1,
                      operation: "decrement",
                    })
                  );
                } else {
                  dispatch(
                    removeItemFromCart({
                      productId: cartItem.productId,
                      variantId: cartItem.variantId,
                    })
                  );
                }
              }}
              onRemove={() =>
                dispatch(
                  removeItemFromCart({
                    productId: cartItem.productId,
                    variantId: cartItem.variantId,
                  })
                )
              }
            />
          ) : (
            variant.inStock === 0 ? (
              <button
      className="bg-[#1d2e36] text-white  px-4 p-2 flex items-center justify-center gap-2 rounded-lg w-full my-2 cursor-not-allowed opacity-70"
    >
      <Icon icon="material-symbols:shopping-cart" width={20} height={20} />
      Add to Cart
    </button>
            ) : (
              <AddToCartButton onAdd={handleAddtoCart} />
            )
            
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
