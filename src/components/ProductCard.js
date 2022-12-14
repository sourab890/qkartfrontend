import { AddShoppingCartOutlined } from "@mui/icons-material";
import { Box } from "@mui/system";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ products, items = [], product, handleAddToCart }) => {
  return (
    <Box display="flex" justifyContent="center">
      <Card className="card">
        <CardMedia
          component="img"
          image={product.image}
          alt={product.category}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            <b>${product.cost}</b>
          </Typography>
          <Rating name="read-only" value={product.rating} readOnly />
        </CardContent>
        <CardActions className="card-actions">
          <Button
            className="card-button"
            type="button"
            variant="contained"
            startIcon={<AddShoppingCartOutlined />}
            fullWidth
            onClick={async () =>
              await handleAddToCart(
                window.localStorage.getItem("token"),
                items,
                products,
                product["_id"],
                1,
                { preventDuplicate: true }
              )
            }
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default ProductCard;
