import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddToCartButton from "../../components/add-to-cart-button/AddToCartButton";
import LockButton from "../../components/lock-button/LockButton";
import MenuButton from "../../components/menu-button/MenuButton";
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
			fetch(`${HOST}/api/stock-price/${skuSelected?.code || initialSkuCode}`)
				.then((response) => response.json())
				.then((stockData) => {
					setStockInfo({ stock: stockData.stock, price: stockData.price });
				})
				.catch((error) =>
					window.alert("Error fetching stock data: " + error.message)
				);
		};

		fetchStockInfo();
		const interval = setInterval(fetchStockInfo, 5000);

		return () => clearInterval(interval);
	}, [product, skuSelected, initialSkuCode]);

	if (!product) return <div>Loading...</div>;

	const handleNavigate = () => {
		navigate(-1);
	};

	const toggleInformation = () => {
		setShowFullInformation((prev) => !prev);
	};

	const priceInDollars = stockInfo ? stockInfo.price : "";

	return (
		<div className="product-detail">
			<div className="buttons-position">
				<MenuButton
					action={handleNavigate}
					children={
						<div className="arrow-back">
							<span className="arrow-left" />
						</div>
					}
				/>
				<span className="detail-title">Detail</span>
				<MenuButton children={<span className="dots"> ... </span>} />
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
							isSkuSelected={skuSelected?.code === sku.code}
							key={sku.code}
							action={() => handleSkuChange(sku)}
							name={sku.name}
						/>
					))}
				</div>
			</section>

			<section className="skus-flex m-top">
				<LockButton />
				<AddToCartButton brand={product.brand} />
			</section>
		</div>
	);
};

export default ProductDetail;
