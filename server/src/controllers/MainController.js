const Product = require("../models/Product");
const ImageProduct = require("../models/ImageProduct");
const ProductImage = require("../models/ProductImage");

const indexController = {
    index: async (req,res)=>{

        try{
  
            const bestSellerProducts = await Product.findAll({
                where: {
                    active: 1,
                },
                limit: 4,
                include: ImageProduct,
            });

            const newestProducts = await Product.findAll({
                where: {
                    active: 1,
                },
                limit: 4,
                order: [
                    ["created_at","DESC"],
                ],                
                include: ImageProduct,
            },
            );

            return res.render("index",{
                title:"Home",
                bestSellerProducts,
                newestProducts,
                user: req.cookies.user,
                cartCounter: req.cookies.cartCounter,
                success: req.session.success,
            });

        }catch(error){
            return res.render("error", {
                title: "Ops!",
                message: "Erro na exibição da página.",
                user: req.cookies.user,
                cartCounter: req.cookies.cartCounter,
            });
        }

    },
    about: (req,res)=>{

        return res.render("about",{
            title:"Sobre Nós",
            user: req.cookies.user,
            cartCounter: req.cookies.cartCounter,
        });
    },
    blog: (req,res)=>{       

        return res.render("blog",{
            title:"Blog",
            user: req.cookies.user,
            cartCounter: req.cookies.cartCounter,
        });
    },
    contact: (req,res)=>{

        return res.render("contact",{
            title:"Contato",
            user: req.cookies.user,
            cartCounter: req.cookies.cartCounter,
        });
    }
};

module.exports = indexController;