import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import { HOST } from "../../utils/constants";
import "./product-list.scss";

const ProductList = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [prices, setPrices] = useState({});

	useEffect(() => {
		// fetch products
		fetch(`${HOST}/api/products`)
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				// fetch prices for every sku
				data.forEach((product) => {
					product.skus.forEach((skuItem) => {
						const sku = skuItem.code.toString();
						fetch(`${HOST}/api/stock-price/${sku}`)
							.then((response) => response.json())
							.then((stockData) => {
								setPrices((prevPrices) => ({
									...prevPrices,
									[sku]: stockData.price,
								}));
							})
							.catch((error) =>
								window.alert("Error fetching stock price: " + error.message)
							);
					});
				});
			})
			.catch((error) =>
				window.alert("Error fetching products: " + error.message)
			);
	}, []);

	const navigateToDetail = (id, brand) => {
		const formattedBrand = brand.toLowerCase().replace(/ /g, "-").trim();
		navigate(`/product/${id}-${formattedBrand}`);
	};

	return (
		<div className="body-product">
			<div className="buttons-position">
				<Button className="button">
					<div className="lines-container">
						<span className="line line-top"></span>
						<span className="line line-middle"></span>
						<span className="line line-bottom"></span>
					</div>
				</Button>
				<Button className="button">
					<img className="user-image" src="/images/icons/User.jpg" alt="user" />
				</Button>
			</div>
			<div>
				<h3 className="hello-title">Hi Mr. Micheal,</h3>
				<h2 className="welcome-title">Welcome Back!</h2>
				<h3 className="product-title">Our Products</h3>
			</div>

			<div className="product-list">
				{products.map((product) => (
					<button
						key={product.id}
						className="product-item"
						onClick={() => navigateToDetail(product.id, product.brand)}
					>
						<div className="card-container">
							<h3 className="brand-name">{product.brand}</h3>
							<img
								className="image"
								src={`${HOST}${product?.image}`}
								alt={product.brand}
							/>
						</div>
						<div className="buttons-display">
							<div className="button-padding">
								<span className="price">
									{prices[product.skus[0].code] !== undefined
										? `$${prices[product.skus[0].code]}`
										: "Loading price..."}
								</span>
							</div>
							<div className="plus-button">
								<span className="plus-sign">+</span>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default ProductList;
