import express, { Request, Response } from 'express';
import Product from './models/products';
import mongoose from 'mongoose';

const router = express.Router();

const DB_CONNECTION = "mongodb+srv://test:test@products.msidtrh.mongodb.net/?retryWrites=true&w=majority&appName=Products";

const connect = async () => {
  try {
    await mongoose.connect(DB_CONNECTION, {
      dbName: "Products",
    });
    console.log("Connected to the Products database!");
  } catch (err) {
    console.error(err);
  }
};

connect();

router.post('/products', async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    return res.status(201).send(product);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.send(products);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send();
    }
    return res.send(product);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params['id']);
    if (!product) {
      return res.status(404).send();
    }
    return res.send(product);
  } catch (e) {
    return res.status(500).send(e);
  }
});

export default router;





// import express, { Request, Response } from 'express';
// import path from 'path';

// const app = express();

// app.use(express.static("public"));

// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is starting...`);
//   console.log(`Server is running on http://localhost:${PORT}`);
//   console.log(`Open your browser and visit http://localhost:${PORT}`);
// });



//=========================================================================================================

// import express, { Request, Response } from 'express';
// import Product from './models/products'; // Схема продукту
// import mongoose from 'mongoose';

// const router = express.Router();

// const DB_CONNECTION = "mongodb+srv://test:test@products.msidtrh.mongodb.net/?retryWrites=true&w=majority&appName=Products";

// const connect = async () => {
//   try {
//     await mongoose.connect(DB_CONNECTION, {
//       dbName: "Products",
//     });
//     console.log("Connected to the Products database!");
//   } catch (err) {
//     console.error(err);
//   }
// };

// connect();

// // Create product
// router.post('/products', async (req: Request, res: Response) => {
//   try {
//     const product = new Product(req.body);
//     await product.save();
//     res.status(201).send(product);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // Get all products
// router.get('/products', async (req: Request, res: Response) => {
//   try {
//     const products = await Product.find();
//     res.send(products);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// // Update product
// router.put('/products/:id', async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params['id'], req.body, { new: true, runValidators: true });
//     if (!product) {
//       return res.status(404).send();
//     }
//     res.send(product);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // Delete product
// router.delete('/products/:id', async (req: Request, res: Response) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params['id']);
//     if (!product) {
//       return res.status(404).send();
//     }
//     return res.send(product); // Тут потрібно явно повернути відповідь
//   } catch (e) {
//     return res.status(500).send(e); // І тут також
//   }
// });

// export default router;