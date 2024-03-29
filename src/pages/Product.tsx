import { useParams } from "react-router-dom";

const ProductPage = () => {
  const params = useParams();
  console.log(params.id);

  return <div>ProductPage</div>;
};

export default ProductPage;
