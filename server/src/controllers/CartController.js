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
        // console.log(req.session.cart);
        res.redirect("/carrinho");
    },
    removeCart: (req,res) => {
        // Recebendo id do produto a ser removido
        const { id } = req.params;
        // Verifica se existe produto no carrinho
        if(req.session.cart !== undefined){
            // Se sim, filtra o carrinho de acordo com o item passado pela url
            const itemToBeRemoved = req.session.cart.find(item=>item.id == id);
            
            // Se a quantidade do item for maior que 1, decremento em 1 unidade
            if(itemToBeRemoved.quantity > 1){
                itemToBeRemoved.quantity--
            }else if(itemToBeRemoved.quantity == 1 && req.session.cart.length > 1 ){
                // Se for igual a 1, precisarei encontrar qual a posição do item para removê-lo 
                const itemIndex = req.session.cart.findIndex(item=>item.id == id);
                req.session.cart.splice(itemIndex,1);
            }else{
                // Se for o último item do carrinho, redireciono para a rota que limpa a session
                res.redirect("/carrinho/esvaziar");
            }
        }

        res.redirect("/carrinho");

    },
    resetCart: (req,res)=>{
        delete req.session.cart;
        res.clearCookie("cartCounter");
        res.redirect("/carrinho");
    },    
};

module.exports = cartController;


