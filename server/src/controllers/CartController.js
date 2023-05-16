const cartController = {
    index: (req,res) => {
        
        let totalPrice = 0;
        let freight = 0;
        let cartCounter = 0;
        if(req.session.cart !== undefined){
            totalPrice = req.session.cart.reduce((result, product) => { return result + parseFloat(product.total); }, 0);
            freight = 10;
            cartCounter = req.session.cart.reduce((result, product) => { return result + product.quantity; }, 0);
            // Criando cookie da sessão
            res.cookie("cartCounter", cartCounter);
        }
          
        return res.render("cart",{
            title:"Carrinho",
            user: req.cookies.user,
            totalPrice,
            freight,
            cartCounter,
            selectedItens: req.session.cart,
        });
    },
    addCart: (req,res) => {

        const { selectedItemId, selectedItemName, selectedItemImage, selectedItemPrice } = req.body;

        // Verificar se existe item no carrinho, caso exista, adicione mais um ao array, senão, cria um array
        if(req.session.cart !== undefined){

            const productInCart = req.session.cart.find(item => parseInt(item.id) === parseInt(selectedItemId));
            
            if(productInCart !== undefined){
                productInCart.quantity += 1;
                productInCart.total = selectedItemPrice * productInCart.quantity;           
            }else{
                req.session.cart.push({
                    id:selectedItemId, 
                    name:selectedItemName, 
                    price:selectedItemPrice,
                    image:selectedItemImage,
                    quantity: 1,
                    total: selectedItemPrice,
                });
            }            

        }else{
            req.session.cart = [{
                id: selectedItemId,
                name: selectedItemName,
                price:selectedItemPrice,
                image: selectedItemImage,
                quantity: 1,
                total: selectedItemPrice,
            }];
            
        }
        res.redirect("/carrinho");
    },
    updateQuantity: (req,res)=>{
        const { id } = req.params;
        const { quantity } = req.body;
        
        if(req.session.cart !== undefined){
            const productInCart = req.session.cart.find(item => parseInt(item.id) === parseInt(id));
            productInCart.quantity = quantity;
            productInCart.total = productInCart.price * productInCart.quantity; 
            console.log(req.session.cart);    
        }
        return res.redirect("/carrinho");        
        
    },
    removeCart: (req,res) => {
        // Recebendo id do produto a ser removido
        const { id } = req.params;

        // Verifica se existe produto no carrinho
        if(req.session.cart !== undefined){
             
            // Se existirem outros produtos no carrinho, precisarei encontrar qual a posição do item para removê-lo 
           if(req.session.cart.length > 1 ){
                const itemIndex = req.session.cart.findIndex(item=>item.id == id);
                req.session.cart.splice(itemIndex,1);            

            }else{
                // Se for o último item do carrinho, redireciono para a rota que limpa a session
                return res.redirect("/carrinho/esvaziar");
            }
        }

        return res.redirect("/carrinho");

    },
    resetCart: (req,res)=>{
        delete req.session.cart;
        res.clearCookie("cartCounter");
        res.redirect("/carrinho");
    },    
};

module.exports = cartController;


