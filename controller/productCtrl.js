const Product = require('../model/productModel')


const productCtrl = {
    getAll:async(req,res) => {
        try{
            // res.json("get all works")
            const products =await Product.find();
                res.status(200).json({
                        data:products,
                        length:products.length
                })
        }catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },

    getSingle:async(req,res) => {
        try{
            // res.json("get single works")
            const product = await Product.findById({_id:req.params.id});
                res.status(200).json({singleData:product});
        }catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },

    create:async(req,res) => {
        try{
            const{product_id,title,price,image,desc,content,stock,discount,category} = req.body;

            if(!image) 
                return res.status(400).json({msg:"no iamge found"});

            const product = await Product.findOne({product_id});
                if(product)
                    return res.status(400).json({msg:"This Product already exists"})

            const newProduct = Product({
                product_id,
                title:title.toLowerCase(),
                price,
                image,
                desc,
                content,
                stock,
                discount,
                category
            })
            // res.json({newProduct})
            await newProduct.save();
            res.status(200).json({msg:"Product Created Successfully."})

        }catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },

    update:async(req,res) => {
        try{
            // res.json("update works")
            const {product_id,title,price,image,desc,content,stock,discount,category} = req.body;

                if(!image)
                    return res.status(400).json({msg:"No Image Found"});

                    await Product.findOneAndUpdate({_id:req.params.id}, {
                        product_id,
                        title:title.toLowerCase(),
                        price,
                        image,
                        desc,content,stock,discount,category
                    })
                    res.status(200).json({msg:"Product Updated"});
        }catch(err) {
            return res.status(500).json({msg:err.message})
        }
    },

    delete:async(req,res) => {
        try {
            // res.json("delete wroks")
            await Product.findByIdAndDelete(req.params.id);
                res.status(200).json({msg:"Product deleted Successfully"})
        }catch(err) {
            return res.status(500).json({msg:err.message})
        }
    }
}

module.exports = productCtrl;