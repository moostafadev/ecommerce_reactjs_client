import { Grid } from "@chakra-ui/react";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { IProduct } from "../interfaces";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/products?populate=*`)
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Grid
      margin={30}
      templateColumns={"repeat(auto-fill, minmax(300px, 1fr))"}
      gap={"3"}
    >
      {products.map((product: IProduct) => (
        <ProductCard
          key={product.id}
          id={product.id}
          attributes={product.attributes}
        />
      ))}
    </Grid>
  );
}

export default ProductsPage;
