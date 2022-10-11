const cartController = {
    index: (req,res) => {
        return res.render("cart",{
            title:"Carrinho",
            user: req.cookies.user
        });
    },
    addCart: (req,res) => {

        const { selectedItem } = req.body;

        // Verificar se existe item no carrinho, caso exista, adicione mais um ao array, senão, cria um array
        if(req.session.cart !== undefined){
            req.session.cart.push(selectedItem);
        }else{
            req.session.cart = [selectedItem];
        }
        // console.log(req.session);
        res.redirect("/carrinho");
    }
};

module.exports = cartController;


