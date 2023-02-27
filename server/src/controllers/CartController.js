const cartController = {
    index: (req,res) => {

        let cartCounter = 0;
        if(req.session.cart !== undefined){
            cartCounter = req.session.cart.reduce((result, product) => { return result + product.quantity; }, 0);
            // Criando cookie da sessão
            res.cookie("cartCounter", cartCounter);
        }

        return res.render("cart",{
            title:"Carrinho",
            user: req.cookies.user,
            cartCounter,
            selectedItens: req.session.cart,
        });
    },
    addCart: (req,res) => {

        const { selectedItemId, selectedItemName, selectedItemImage, selectedItemPrice } = req.body;

        // Verificar se existe item no carrinho, caso exista, adicione mais um ao array, senão, cria um array
        if(req.session.cart !== undefined){

            const productInCart = req.session.cart.find(item => item.id == selectedItemId)
            
            if(productInCart !== undefined){
                productInCart.quantity += 1;                
            }else{
                req.session.cart.push({
                    id:selectedItemId, 
                    name:selectedItemName, 
                    price:selectedItemPrice,
                    image:selectedItemImage,
                    quantity: 1,
                });
            }            

        }else{
            req.session.cart = [{
                id: selectedItemId,
                name: selectedItemName,
                price:selectedItemPrice,
                image: selectedItemImage,
                quantity: 1,
            }];
            
        }
        // console.log(req.session.cart);
        res.redirect("/carrinho");
    },
    resetCart: (req,res)=>{
        delete req.session.cart;
        res.clearCookie("cartCounter");
        res.redirect("/carrinho");
    }
};

module.exports = cartController;


