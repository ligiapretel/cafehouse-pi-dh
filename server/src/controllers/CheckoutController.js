const checkoutController = {
    index: (req,res)=>{

        return res.render("checkout",{
            title:"Checkout",
            user: req.cookies.user,
            cartCounter: req.cookies.cartCounter,
        });
    }
};

module.exports = checkoutController;