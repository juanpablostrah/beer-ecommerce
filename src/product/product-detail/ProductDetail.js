import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddToCartButton from "../../components/add-to-cart-button/AddToCartButton";
import LockButton from "../../components/lock-button/LockButton";
import MenuButton from "../../components/menu-button/MenuButton";
import SkuName from "../sku-name/SkuName";
import "./product-detail.scss";

const ProductDetail = () => {
	const { productIdBrand } = useParams();
	const [productId] = productIdBrand.split("-");
	const [product, setProduct] = useState(null);
	const [stockInfo, setStockInfo] = useState({});
	const [showFullInformation, setShowFullInformation] = useState(false);

	const [skuSelected, setSkuSelected] = useState(null);

	console.log("skuSelected: ", skuSelected);

	const navigate = useNavigate();

	const handleSkuChange = (skuKey) => {
		console.log("skuKey: ", skuKey);
		setSkuSelected(skuKey);
	};

	useEffect(() => {
		const firstSkuKey = Object.keys(stockInfo)[0];
		if (firstSkuKey) {
			const firstSkuObject = stockInfo[firstSkuKey];
			setSkuSelected(firstSkuObject);
		}
	}, [stockInfo]);

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
			if (!product?.skus) return; // Asegúrate de que el producto tenga SKUs antes de intentar el fetch

			product.skus.forEach((skuItem) => {
				fetch(`http://localhost:4000/api/stock/${skuItem.code}`)
					.then((response) => response.json())
					.then((data) => {
						setStockInfo((prevStockInfo) => ({
							...prevStockInfo,
							[skuItem.code]: data,
						}));
					})
					.catch((error) =>
						window.alert("Error fetching stock information: " + error.message)
					);
			});
		};

		fetchStockInfo();
		const interval = setInterval(fetchStockInfo, 5000);

		return () => clearInterval(interval);
	}, [product]);

	if (!product) return <div>Loading...</div>;

	const handleNavigate = () => {
		navigate(-1);
	};

	const toggleInformation = () => {
		setShowFullInformation((prev) => !prev);
	};

	const priceInDollars = (skuSelected?.price / 100).toFixed(2);

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
					src={`http://localhost:4000${product?.image}`}
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
					<span>Stock: {"ver como mostrar stock"}</span>
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
						<SkuName action={() => handleSkuChange(sku)} name={sku.name} />
					))}
				</div>
			</section>

			<section className="skus-flex m-top">
				<LockButton />
				<AddToCartButton />
			</section>
		</div>
	);
};

export default ProductDetail;
