import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./product/product-list/ProductList";
import ProductDetail from "./product/product-detail/ProductDetail";
import "./app.scss";

const App = () => {
	return (
		<div className="main">
			<Router>
				<Routes>
					<Route path="/products" element={<ProductList />} />
					<Route
						path="/product/:productId-:productBrand"
						element={<ProductDetail />}
					/>
				</Routes>
			</Router>
		</div>
	);
};

export default App;
