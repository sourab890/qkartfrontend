import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Paper,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom} from "./Cart";

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

 const Heroheadingcomponent = () => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      <Grid item className="product-grid">
        <Box className="hero">
          <p className="hero-heading">
            India’s <span className="hero-highlight">FASTEST DELIVERY</span> to
            your door step
          </p>
        </Box>
      </Grid>
    </Grid>
  );
};

 const Progresscomponent = () => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress disableShrink />
      <p>Loading Products..</p>
    </Box>
  );
};

const Noproductsfound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ p: 20 }}
    >
      <SentimentDissatisfied />
      <p>No Products Found</p>
    </Box>
  );
};

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [progressIndicator, setProgressIndicator] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [cartFetchData, setFetchCartData] = useState([]);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    performAPICall();
    storeCartData();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      window.localStorage.getItem("LoggedInStatus") === "true" &&
      cartFetchData !== []
    ) {
      const cartUpdated = generateCartItemsFrom(cartFetchData, data);
      setCartData(cartUpdated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartFetchData]);

  const storeCartData = async () => {
    const cartFetch = await fetchCart(window.localStorage.getItem("token"));
    setFetchCartData(cartFetch);
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setProgressIndicator(true);
    axios
      .get(`${config.endpoint}/products`)
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
        setProgressIndicator(false);
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(error.response.data.message, { variant: `error` });
          setProgressIndicator(false);
        } else if (error.request) {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and return valid JSON  ",
            { variant: `error` }
          );
          setProgressIndicator(false);
        } else {
         
          console.log("Error", error.message);
          setProgressIndicator(false);
        }
        
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    setProgressIndicator(true);
    const query = `?value=${text}`;
    const url = `${config.endpoint}/products/search${query}`;
    axios
      .get(url)
      .then((response) => {
        
        setData(response.data);
        setProgressIndicator(false);
      })
      .catch((error) => {
        if (error.response) {
          
          setData([]);
          setProgressIndicator(false);
        } else if (error.request) {
          
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and return valid JSON  ",
            { variant: `error` }
          );
          setProgressIndicator(false);
        } else {
          
          console.log("Error", error.message);
          setProgressIndicator(false);
        }
        
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (event.target.value) {
      if (timerId) {
        clearTimeout(timerId);
      }
      const debounceTimeoutId = setTimeout(
        () => performSearch(event.target.value),
        debounceTimeout
      );
      setTimerId(debounceTimeoutId);
    } else {
      performAPICall();
    }
  };

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };



  const isItemInCart = (items, productId) => {
    for (let obj in items) {
      if (items[obj]["productId"] === productId) {
        return true;
      }
    }
    return false;
  };


  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) return;

    let quantity = 0;
    if (options.preventDuplicate) {
      if (isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the Cart Sidebar to update the Quantity or Remove Item.",
          { variant: `warning` }
        );
        return;
      } else {
        quantity = qty;
      }
    } else {
      for (let obj in items) {
        if (items[obj]["productId"] === productId) {
          quantity = quantity + (items[obj]["qty"] + qty);
          break;
        }
      }
    }

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFetchCartData(response.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not Post cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };


  return (
    <div>
    <Header>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      <Box
        sx={{
          width: 500,
          maxWidth: "100%",
        }}
      >
        <TextField
          className="search-desktop"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, 500)}
        />
      </Box>
    </Header>

    {/* Search view for mobiles */}
    <TextField
      className="search-mobile"
      size="small"
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
      onChange={(e) => debounceSearch(e, 500)}
    />
    {window.localStorage.getItem("LoggedInStatus") === "true" ? (
      <div>
        <Grid container columns={12}>
          <Grid item xs={12} sm={8} md={9}>
            <Heroheadingcomponent />
            {progressIndicator ? (
              <Progresscomponent />
            ) : (
              <Paper sx={{ p: 2, margin: "auto" }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
                  {data.length ? (
                    data.map((product) => (
                      <Grid item xs={6} md={3} key={data.id}>
                        <ProductCard
                           product={product}
                           items={cartData}
                           products={data}
                           handleAddToCart={addToCart}
                         
                        />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12} key="1233444">
                      <Noproductsfound />
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </Grid>
          <Grid item xs={12} sm={4} md={3} sx={{ background: "#E9F5E1" }}>
          <Cart
                items={cartData}
                products={data}
                handleQuantity={addToCart}
          />
          </Grid>
        </Grid>
      </div>
    ) : (
      <div>
        <Heroheadingcomponent />
        {progressIndicator ? (
          <Progresscomponent />
        ) : (
          <Paper sx={{ p: 2, margin: "auto" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={12}>
              {data.length ? (
                data.map((product) => (
                  <Grid item xs={6} md={3} key={data.id}>
                    <ProductCard
                      product={product}
                      handleAddToCart={addToCart}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} key="123">
                  <Noproductsfound />
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
      </div>
    )}
    <Footer />
  </div>
);
};

export default Products;
