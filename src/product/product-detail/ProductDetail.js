import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import { HOST } from "../../utils/constants";
import SkuName from "../sku-name/SkuName";
import "./product-detail.scss";

const ProductDetail = () => {
	const { productIdBrand } = useParams();
	const [productId] = productIdBrand.split("-");
	const [product, setProduct] = useState(null);
	const [stockInfo, setStockInfo] = useState({});
	const [showFullInformation, setShowFullInformation] = useState(false);
	const [skuSelected, setSkuSelected] = useState(null);

	const initialSkuCode = product?.skus[0].code;

	const navigate = useNavigate();

	const handleSkuChange = (skuKey) => {
		setSkuSelected(skuKey);
	};

	useEffect(() => {
		fetch(`${HOST}/api/products`)
			.then((response) => response.json())
			.then((data) => {
				const foundProduct = data.find((p) => p.id.toString() === productId);
				setProduct(foundProduct || null);
				if (foundProduct && foundProduct.skus?.length > 0) {
					setSkuSelected(foundProduct.skus[0]);
				}
			})
			.catch((error) =>
				window.alert("Error fetching product details: " + error.message)
			);
	}, [productId]);

	useEffect(() => {
		const fetchStockInfo = () => {
			if (!skuSelected?.code && !initialSkuCode) return;

			fetch(`${HOST}/api/stock-price/${skuSelected?.code || initialSkuCode}`)
				.then((response) => response.json())
				.then((stockData) => {
					setStockInfo({ stock: stockData.stock, price: stockData.price });
				})
				.catch((error) =>
					window.alert("Error fetching stock data: " + error.message)
				);
		};

		if (skuSelected || initialSkuCode) {
			fetchStockInfo();
			const interval = setInterval(fetchStockInfo, 5000);
			return () => clearInterval(interval);
		}
	}, [skuSelected, initialSkuCode]);

	if (!product) return <div>Loading...</div>;

	const handleNavigate = () => {
		navigate(-1);
	};

	const toggleInformation = () => {
		setShowFullInformation((prev) => !prev);
	};

	const handleAddToCart = () => {
		window.alert(`You add ${product.brand} - ${skuSelected.name} to cart!`);
	};

	const priceInDollars = stockInfo ? stockInfo.price : "";

	return (
		<div className="product-detail">
			<div className="buttons-position">
				<Button className="button" onClick={handleNavigate}>
					<div className="arrow-back">
						<span className="arrow-left" />
					</div>
				</Button>
				<span className="detail-title">Detail</span>
				<Button className="button">
					<span className="dots"> ... </span>
				</Button>
			</div>
			<div className="image-container">
				<img
					className="image-detail"
					src={`${HOST}${product?.image}`}
					alt={product.brand}
				/>
			</div>

			<section className="brand-flex">
				<span className="product-brand">{product.brand}</span>
				<span className="product-price">${priceInDollars}</span>
			</section>
			<section>
				<span className="stock">
					<span>Origin: {product.origin}</span>
					{" | "}
					<span>Stock: {stockInfo.stock}</span>
				</span>
			</section>
			<section>
				<h3>Description</h3>
				<span className="sku-description">
					{showFullInformation
						? product.information
						: `${product.information.slice(0, 200)} ...`}
				</span>
				{product.information.length > 200 && (
					<button className="button-read-more" onClick={toggleInformation}>
						{showFullInformation ? "Read Less" : "Read More"}
					</button>
				)}
			</section>
			<section>
				<h3>Size</h3>
				<div className="skus-flex">
					{product.skus?.map((sku) => (
						<SkuName
							key={sku.code}
							isSkuSelected={skuSelected?.code === sku.code}
							action={() => handleSkuChange(sku)}
							name={sku.name}
						/>
					))}
				</div>
			</section>

			<section className="skus-flex m-top">
				<Button iconClassName="lock-icon" className="lock-button">
					<FontAwesomeIcon icon={faLock} className="lock-icon" />
				</Button>
				<Button onClick={handleAddToCart} className="add-to-cart">
					<span className="text">Add to cart</span>
				</Button>
			</section>
		</div>
	);
};

export default ProductDetail;
