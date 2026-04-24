const Product = require("../model/product");
const redisClient = require("../lib/redis.service");

const CACHE_TTL = 60 * 60; // 1 soat

// GET /products — barcha productlarni olish (Redis cache bilan)
const getAllProducts = async (req, res) => {
  try {
    const cacheKey = "products:all";

    // Avval Redis dan tekshir
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        source: "cache",
        data: JSON.parse(cached),
      });
    }

    // DB dan olish
    const products = await Product.find();

    // Redis ga saqlash
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(products));

    return res.status(200).json({
      source: "db",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// GET /products/:id — bitta productni olish
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `products:${id}`;

    // Redis cache tekshirish
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        source: "cache",
        data: JSON.parse(cached),
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product topilmadi" });
    }

    // Cache ga saqlash
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(product));

    return res.status(200).json({ source: "db", data: product });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// POST /products — yangi product yaratish
const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Nom va narx majburiy" });
    }

    const product = await Product.create({ name, price, description, stock });

    // Cache ni tozalash (list o'zgardi)
    await redisClient.del("products:all");

    return res.status(201).json({ message: "Product yaratildi", data: product });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// PUT /products/:id — productni yangilash
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product topilmadi" });
    }

    // Cache ni yangilash
    await redisClient.del(`products:${id}`);
    await redisClient.del("products:all");

    return res.status(200).json({ message: "Product yangilandi", data: product });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

// DELETE /products/:id — productni o'chirish
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product topilmadi" });
    }

    // Cache dan o'chirish
    await redisClient.del(`products:${id}`);
    await redisClient.del("products:all");

    return res.status(200).json({ message: "Product o'chirildi" });
  } catch (error) {
    return res.status(500).json({ message: "Server xatosi", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};