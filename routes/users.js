const express = require('express')
const router  = express.Router()
const session = require('express-session');
const app = require('../app')

router.post('/register', async function(req, res){
    var user = {username: req.body.username, password: req.body.password}
    
    if (user.username.length == 0 || user.password.length == 0) {
        res.redirect('../registrationempty')
    }
    else {
        var cart = {username: req.body.username.toLowerCase(), items: []}
        await app.getClient.connect();
        let x = await app.getClient.db('ecom').collection('users').find().toArray();
        let isFound = false
        for (let i = 0; i < x.length; i++){
            if (x[i].username.toLowerCase() == user.username.toLowerCase()) {
                isFound = true
            }
        }
        if (!isFound){
            await app.getClient.db('ecom').collection('users').insertOne(user)
            await app.getClient.db('ecom').collection('carts').insertOne(cart)
            req.session.loggedin = true;
            req.session.username = req.body.username
            res.redirect('../home')        }
        else {
            res.redirect('../registrationwitherror')
        }
        app.getClient.close();
    }
})

router.post('/login', async function(req, res){
    await app.getClient.connect();
    let users = await app.getClient.db('ecom').collection('users').find().toArray();
    let user = null
    for (let i =0; i < users.length;i++){
        if ( users[i].username.toLowerCase() == req.body.username.toLowerCase() ){
            user = users[i]
            break
        }
    }
    if (user == null){
        return res.redirect('../loginnouser')
    }
    try {
        if ( req.body.password == user.password ) {
            req.session.loggedin = true;
            req.session.username = req.body.username
            res.redirect('../home')
        }
        else {
            res.redirect('../loginwrong')
        }
    }
    catch {
        res.status(500).send()
    }

})

router.post('/addtocart', async function (req, res) {
    await app.getClient.connect();

    var myquery = { username: req.session.username.toLowerCase() };
    let item = req.query.item
    var cart = []

    let carts = await app.getClient.db('ecom').collection('carts').find().toArray();
    for (let i =0; i < carts.length;i++){
        if ( carts[i].username.toLowerCase() == req.session.username.toLowerCase() ){
            cart = carts[i].items
            break
        }
    }
    if (cart.includes(req.query.item)){
        res.redirect('../cartwitherror')
    }
    else {
        cart.push(item)
        var newvalues = { $set: { items: cart } }

        app.getClient.db('ecom').collection("carts").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            app.getClient.close();
        });
        res.redirect('../' + item)  
    }
})

module.exports = router