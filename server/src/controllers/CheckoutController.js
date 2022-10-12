const checkoutController = {
    index: (req,res)=>{

        //Itens no carrinho
        let cartCounter = 0;
        if(req.session.cart !== undefined){
            cartCounter = req.session.cart.length;
        }  

        return res.render("checkout",{
            title:"Checkout",
            user: req.cookies.user,
            cartCounter,
        });
    }
};

module.exports = checkoutController;