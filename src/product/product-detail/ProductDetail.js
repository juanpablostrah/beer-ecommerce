import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
	const { productId } = useParams();
	const [product, setProduct] = useState(null);
	const [stockInfo, setStockInfo] = useState(null);

	useEffect(() => {
		fetch("http://localhost:4000/api/products")
			.then((response) => response.json())
			.then((data) => {
				const foundProduct = data.find((p) => p.id.toString() === productId);
				setProduct(foundProduct || null);
			})
			.catch((error) =>
				window.alert("Error fetching product details: " + error.message)
			);
	}, [productId]);

	useEffect(() => {
		const fetchStockInfo = () => {
			fetch(`http://localhost:4000/api/stock/${productId}`)
				.then((response) => response.json())
				.then((data) => setStockInfo(data))
				.catch((error) =>
					window.alert("Error fetching stock information: " + error.message)
				);
		};

		fetchStockInfo();
		const interval = setInterval(fetchStockInfo, 5000);

		return () => clearInterval(interval);
	}, [productId]);

	if (!product) return <div>Loading...</div>;

	return (
		<div className="product-detail">
			<img src={product.image} alt={product.name} />
			<h1>{product.name}</h1>
			<p>{product.description}</p>

			{stockInfo && (
				<div className="stock-info">
					{stockInfo.map((variant) => (
						<div key={variant.size}>
							<span>Size: {variant.size}</span>
							<span>Price: ${(variant.price / 100).toFixed(2)}</span>
							<span>Stock: {variant.stock}</span>
						</div>
					))}
				</div>
			)}

			<button onClick={() => window.alert("Add to cart clicked!")}>
				Add to Cart
			</button>
		</div>
	);
};

export default ProductDetail;
