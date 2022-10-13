const Product = require("../models/Product");
const ImageProduct = require("../models/ImageProduct");
const ProductImage = require("../models/ProductImage");

const indexController = {
    index: async (req,res)=>{

        try{

            // Verificar se a session cart está setada. Se sim, verificar a quantidade de itens, senão, quantidade será 0
            let cartCounter = 0;
            if(req.session.cart !== undefined){
                cartCounter = req.session.cart.length;
            }        

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
                cartCounter,
                success: req.session.success,
            });

        }catch(error){
            return res.render("error", {
                title: "Ops!",
                message: "Erro na exibição da página.",
                user: req.cookies.user,
                cartCounter,
            });
        }

    },
    about: (req,res)=>{

        let cartCounter = 0;
        if(req.session.cart !== undefined){
            cartCounter = req.session.cart.length;
        }

        return res.render("about",{
            title:"Sobre Nós",
            user: req.cookies.user,
            cartCounter,
        });
    },
    blog: (req,res)=>{

        let cartCounter = 0;
        if(req.session.cart !== undefined){
            cartCounter = req.session.cart.length;
        }

        return res.render("blog",{
            title:"Blog",
            user: req.cookies.user,
            cartCounter,
        });
    },
    contact: (req,res)=>{

        let cartCounter = 0;
        if(req.session.cart !== undefined){
            cartCounter = req.session.cart.length;
        }

        return res.render("contact",{
            title:"Contato",
            user: req.cookies.user,
            cartCounter,
        });
    }
};

module.exports = indexController;