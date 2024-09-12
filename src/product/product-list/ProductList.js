import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./product-list.scss";

const ProductList = () => {
	const [products, setProducts] = useState([]);
	console.log("products: ", products);

	useEffect(() => {
		fetch("http://localhost:4000/api/products")
			.then((response) => response.json())
			.then((data) => setProducts(data))
			.catch((error) =>
				window.alert("Error fetching products: " + error.message)
			);
	}, []);

	return (
		<div className="body-product">
			<div>
				<h3 className="hello-title">Hi Mr. Micheal,</h3>
				<h2 className="welcome-title">Welcome Back!</h2>
				<h3 className="product-title">Our Products</h3>
			</div>

			<div className="product-list">
				{products.map((product) => (
					<Link
						key={product.id}
						to={`/product/${product.id}-${product.brand
							.toLowerCase()
							.replace(/ /g, "-")}`}
					>
						<div className="product-item">
							<img src={product.image} alt={product.name} />
							<h3>{product.brand}</h3>
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default ProductList;
