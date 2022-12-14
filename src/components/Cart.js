import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<{ _id: String, name: String, category: String, image: String, rating: Number, cost: Number}> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<{ productId: String, qty: Number, name: String, category: String, image: String, rating: Number, cost: Number}> }
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const cartDataUpdated = cartData.map((cartItem) => {
    let cartItemUpdate = {};
    for (let obj in productsData) {
      if (productsData[obj]["_id"] === cartItem.productId) {
        cartItemUpdate = {
          ...cartItem,
          name: productsData[obj]["name"],
          category: productsData[obj]["category"],
          image: productsData[obj]["image"],
          rating: productsData[obj]["rating"],
          cost: productsData[obj]["cost"],
        };
      }
    }
    return cartItemUpdate;
  });

  return cartDataUpdated;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<{ productId: String, qty: Number, name: String, category: String, image: String, rating: Number, cost: Number}> }
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalValue = 0;
  items.forEach((item) => {
    // console.log(item);
    totalValue += item.cost * item.qty;
  });
  return totalValue;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<{ productId: String, qty: Number, name: String, category: String, image: String, rating: Number, cost: Number}> }
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    total items quantity
 *
 */
export const getTotalItems = (items = []) => {
  let totalItems = 0;
  items.forEach((item) => {
    // console.log(item);
    totalItems += item.qty;
  });
  return totalItems;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({ value, handleAdd, handleDelete, readOnly }) => {
  if (readOnly) {
    return (
      <Stack direction="row" alignItems="center">
        <Box padding="0.5rem" data-testid="item-qty">
          Qty:{value}
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  }
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<{ productId: String, name: String, category: String, image: String, rating: Number, cost: Number}> }
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<{ productId: String, qty: Number, name: String, category: String, image: String, rating: Number, cost: Number}> }
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly }) => {
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        <Box display="flex" flexDirection="column">
          {items.map((item) => (
            <div>
              <Box display="flex" alignItems="flex-start" padding="1rem">
                <Box className="image-container">
                  <img
                    // Add product image
                    src={item.image}
                    // Add product name as alt eext
                    alt={item.name}
                    width="100%"
                    height="100%"
                  />
                </Box>

                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{/* Add product name */ item.name}</div>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    {isReadOnly ? (
                      <ItemQuantity
                        // Add required props by checking implementation

                        value={item.qty}
                        readOnly={isReadOnly}
                      />
                    ) : (
                      <ItemQuantity
                        // Add required props by checking implementation

                        value={item.qty}
                        handleAdd={async () =>
                          await handleQuantity(
                            window.localStorage.getItem("token"),
                            items,
                            products,
                            item.productId,
                            1,
                            { preventDuplicate: false }
                          )
                        }
                        handleDelete={async () =>
                          await handleQuantity(
                            window.localStorage.getItem("token"),
                            items,
                            products,
                            item.productId,
                            -1,
                            { preventDuplicate: false }
                          )
                        }
                      />
                    )}

                    <Box padding="0.5rem" fontWeight="700">
                      ${/* Add product cost */ item.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            </div>
          ))}
        </Box>
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        {!isReadOnly && (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => history.push("/checkout", { from: "Cart" })}
            >
              Checkout
            </Button>
          </Box>
        )}
      </Box>
      {isReadOnly && (
        <Box className="cart">
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontWeight="700"
              fontSize="1.5rem"
            >
              Order Details
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Products
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              {getTotalItems(items)}
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Subtotal
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Shipping Charges
            </Box>
            <Box color="#3C3C3C" alignSelf="center">
              $0
            </Box>
          </Box>
          <Box
            padding="0.5rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box
              color="#3C3C3C"
              alignSelf="center"
              fontWeight="700"
              fontSize="1.5rem"
            >
              Total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
