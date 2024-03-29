
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const CategoryProduct = require("../../models/CategoryProduct");
const Brand = require("../../models/Brand");
const ImageProduct = require("../../models/ImageProduct");
const ProductImage = require("../../models/ProductImage");

// Importando o express validator através da desestruturação, pegando o validationResult
const {validationResult} = require('express-validator');

const productController = {
    //Exibe a listagem de produtos
    index: async (req, res) => {

        try{

            const products = await Product.findAll({
                include: Category,
            });

            return res.render("admin/products", { 
                title: "Produtos",
                products,
                adminUser: req.cookies.adminUser
            });

        }catch(error){

            return res.render("admin/error", {
                title: "Ops!",
                message: "Erro na exibição dos produtos.",
                adminUser: req.cookies.adminUser
            });

        }
    },
    show: async (req, res) => {
        const {id} = req.params;

        try{

            const product = await Product.findByPk(id, {
                include: [
                    { model: Category },
                    { model: Brand },
                    { model: ImageProduct },
                ]
            });

            //Verificando se existe algum produto, se não existir, renderiza a view error
            if(!product){
                return res.render("admin/error", {
                    title: "Ops!",
                    message: "Produto não encontrado.",
                    adminUser: req.cookies.adminUser
                });
            }

            return res.render("admin/product", {
                title: "Detalhe do Produto",
                product,
                adminUser: req.cookies.adminUser
            });

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Produto não encontrado.",
                adminUser: req.cookies.adminUser
            });
        }
    },
    create: async (req,res)=>{

        try{

            const brands = await Brand.findAll();

            const categories = await Category.findAll();
    
            return res.render("admin/productCreateForm",{
                title:"Cadastro de Produto",
                brands,
                categories,
                adminUser: req.cookies.adminUser
            });

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Erro ao carregar a página.",
                adminUser: req.cookies.adminUser
            });
        }
    },
    store: async (req,res)=>{

        try{

            
            // Armazenando todas as informações que virão pelo req no validationResult
            const errors = validationResult(req);
            
            // Se existirem erros, renderiza a view com os erros formatados
            if(!errors.isEmpty()) {
                
                let fileMessage;
                if(!req.file){
                    fileMessage = "Insira a foto do produto";
                }
                
                // const formattedErrors = {}
                // errors.forEach(error => {
                //     formattedErrors[error.param] = error.msg;
                // });
                // console.log(formattedErrors);
                
                const brands = await Brand.findAll();
    
                const categories = await Category.findAll();

                return res.render("admin/productCreateForm",{
                    title:"Cadastro de Produto",
                    errors: errors.mapped(),
                    fileMessage,
                    old: req.body,
                    brands,
                    categories,
                    adminUser: req.cookies.adminUser
                });
            }
    
            //Recebendo os campos do formulário
            const { name, brand, flavor, roast, description, content, format, price, installment, sku, quantity, category, active } = req.body;
    
            const image = req.file.filename;
    
            //Acessando o método create do model, passando como parâmetro os dados recebidos no formulário
            const product = await Product.create({ 
                name, 
                flavor, 
                roast, 
                description, 
                content, 
                format, 
                price, 
                installment, 
                sku, 
                quantity, 
                active,
                created_at: new Date(),
                updated_at: new Date(),
                brand_id: brand,
                admin_user_id: req.cookies.adminUser.id, //dado será pego via cookies/session
            });
    
            //Inserindo imagem na tabela
            const _imageProduct = await ImageProduct.create({
                name: image,
                created_at: new Date(),
                updated_at: new Date(),
                admin_user_id: req.cookies.adminUser.id,
            });

            //Fazendo vínculos das tabelas - será criada uma relação na tabela intermediária
            await product.addImageProduct(_imageProduct, { });

            const _category = await Category.findByPk(category);

            await product.addCategory(_category, { });
  
            res.redirect("/admin/produtos");

        }catch(error){
             return res.render("admin/error", {
                title: "Ops!",
                message: "Erro ao cadastrar o produto.",
                adminUser: req.cookies.adminUser
            });
        }
    },
    edit:async (req,res)=>{

        try{

            const {id} = req.params;
            
            //Acessando o método findByPk do model
            const product = await Product.findByPk(id,{
                include: [
                    { model: Category },
                    { model: Brand },
                    { model: ImageProduct },
                ]
            });

            //Incluindo listagem de marcas e categorias para serem renderizadas no select
            const brands = await Brand.findAll();
    
            const categories = await Category.findAll();
            
            //Verificando se existe algum produto, se não existir, renderiza a view error
            if(!product){
                return res.render("admin/error", {
                    title: "Ops!",
                    message: "Produto não encontrado.",
                    adminUser: req.cookies.adminUser
                });
            }
           
            return res.render("admin/productEditForm", {
                title: "Edição de Produto",
                product,
                brands,
                categories,
                adminUser: req.cookies.adminUser
            });

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Produto não encontrado.",
                adminUser: req.cookies.adminUser
            });
        }
        
    },
    update: async (req,res)=>{

        try{

            const {id} = req.params;

            //Recebendo os campos do formulário
            const { name, brand, flavor, roast, description, content, format, price, installment, sku, quantity, category, active } = req.body;
        
            //Acessando o método update do model, passando como parâmetro o id + os dados recebidos no formulário
            const product = await Product.update({ 
                name, 
                brand, 
                flavor, 
                roast, 
                description, 
                content, 
                format, 
                price, 
                installment, 
                sku, 
                quantity, 
                active, 
                updated_at: new Date(),
                brand_id: brand,
                admin_user_id: req.cookies.adminUser.id
            },{
                where: {id}
            });

            //Atualizando imagem na tabela
            if(req.file){

                const image = req.file.filename;

                const _imageProduct = await ImageProduct.update({
                    name: image,
                    updated_at: new Date(),
                    admin_user_id: req.cookies.adminUser.id,
                },{
                    where: {
                        product_id: id,
                    }
                });

            }

            const _category = await CategoryProduct.update({
                category_id: category,
            },{
                where: {
                    product_id: id
                }
            });

            res.redirect("/admin/produtos");

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Erro ao atualizar o produto.",
                adminUser: req.cookies.adminUser
            });
        }

        
    },
    delete: async (req,res)=>{

        try{

            const {id} = req.params;

            //Acessando o método findByPk do model
            const product = await Product.findByPk(id,{
                include: [
                    { model: Category },
                    { model: Brand },
                    { model: ImageProduct },
                ]
            });
           
            //Verificando se existe algum produto, se não existir, renderiza a view error
            if(!product){
                return res.render("admin/error", {
                    title: "Ops!",
                    message: "Produto não encontrado.",
                    adminUser: req.cookies.adminUser
                });
            }

            return res.render("admin/productDelete", {
                title: "Deletar Produto",
                product,
                adminUser: req.cookies.adminUser
            });

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Produto não encontrado.",
                adminUser: req.cookies.adminUser
            });
        }
    },
    destroy: async (req,res)=>{

        try{

            const {id} = req.params;
            const product = await Product.update({
                active: 0,
                updated_at: new Date(),
                admin_user_id: req.cookies.adminUser.id
            },{
                where: {id}
            }
            );
    
            if(!product){
                return res.render("admin/error", {
                    title: "Ops!",
                    message: "Produto não encontrado.",
                    adminUser: req.cookies.adminUser
                });
            }
    
            res.redirect("/admin/produtos");

        }catch(error){
            return res.render("admin/error", {
                title: "Ops!",
                message: "Erro ao inativar o produto.",
                adminUser: req.cookies.adminUser
            });
        }

    }
};

module.exports = productController;