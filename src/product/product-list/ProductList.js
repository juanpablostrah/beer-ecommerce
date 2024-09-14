import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../../components/menu-button/MenuButton";
import PlusButton from "../../components/plus-button/PlusButton";
import "./product-list.scss";

const ProductList = () => {
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	console.log("products: ", products);
	const [prices, setPrices] = useState({});
	console.log("prices: ", prices);

	useEffect(() => {
		// Fetch de los productos
		fetch("http://localhost:4000/api/products")
			.then((response) => response.json())
			.then((data) => {
				setProducts(data);
				// Fetch para los precios de cada SKU
				data.forEach((product) => {
					product.skus.forEach((skuItem) => {
						const sku = skuItem.code.toString(); // Asegurarse de que el SKU esté en formato string
						fetch(`http://localhost:4000/api/stock-price/${sku}`)
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

	const addToCart = () => {};

	return (
		<div className="body-product">
			<div className="buttons-position">
				<MenuButton
					children={
						<div className="lines-container">
							<span className="line line-top"></span>
							<span className="line line-middle"></span>
							<span className="line line-bottom"></span>
						</div>
					}
				/>
				<MenuButton
					children={
						<img
							className="user-image"
							src="/images/icons/User.jpg"
							alt="user"
						/>
					}
				/>
			</div>
			<div>
				<h3 className="hello-title">Hi Mr. Micheal,</h3>
				<h2 className="welcome-title">Welcome Back!</h2>
				<h3 className="product-title">Our Products</h3>
			</div>

			<div className="product-list">
				{products.map((product) => (
					<button
						className="product-item"
						onClick={() => navigateToDetail(product.id, product.brand)}
					>
						<div className="card-container">
							<h3 className="brand-name">{product.brand}</h3>
							<img
								className="image"
								src={`http://localhost:4000${product?.image}`}
								alt={product.brand}
							/>
						</div>
						<div className="buttons-display">
							<div>
								<span className="price">
									{prices[product.skus[0].code] !== undefined
										? `$${prices[product.skus[0].code]}`
										: "Loading price..."}
								</span>
							</div>
							<PlusButton onClick={() => addToCart()} />
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default ProductList;
