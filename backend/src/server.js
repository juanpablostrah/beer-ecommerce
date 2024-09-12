import express from "express";
import cors from "cors";
import products from "./products.mjs";
import stockPrice from "./stock-price.mjs";

const app = express();
app.use(cors());

app.get("/api/products", (req, res) => {
	res.json(products);
});

app.get("/api/stock/:productId", (req, res) => {
	const { productId } = req.params;
	const productStock = stockPrice[productId];

	if (!productStock) {
		return res.status(404).json({ message: "Product not found" });
	}

	res.json(productStock);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
