import React from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import ProductList from "./product/product-list/ProductList";
import ProductDetail from "./product/product-detail/ProductDetail";
import "./app.scss";

const App = () => {
	return (
		<div className="main">
			<Router>
				<Routes>
					<Route path="/" element={<Navigate to="/products" />} />
					<Route path="/products" element={<ProductList />} />
					<Route path="/product/:productIdBrand" element={<ProductDetail />} />
					<Route path="*" element={<div>Ruta no encontrada</div>} />
				</Routes>
			</Router>
		</div>
	);
};

export default App;
