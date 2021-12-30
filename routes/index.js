const express = require('express')
const router  = express.Router()
const session = require('express-session');
const app = require('../app')

router.get('/', (req, res) => {
    res.render('login', {
        is_error: false
    })
})
router.get('/loginnouser', (req, res) => {
    res.render('login',{
        is_error: true,
        message: 'User doesnt exist, please register'
    })
})
router.get('/loginwrong', (req, res) => {
    res.render('login', {
        is_error: true,
        message: 'Wrong password, please try again'
    })
})
router.get('/registration', (req, res) => {
    res.render('registration',{
        is_error: false,
    })
})
router.get('/registrationwitherror', (req, res) => {
    res.render('registration',{
        is_error: true,
        message: 'Username already exists.'
    })
})
router.get('/registrationempty', (req, res) => {
    res.render('registration',{
        is_error: true,
        message: 'Either field or both is empty.'
    })
})
router.get('/home', (req, res) => {
    if (req.session.loggedin) {
		res.render('home',{ 
            username: req.session.username 
        });
	} else {
		res.redirect('/');
	}
})
router.get('/phones', (req, res) => {
    if (req.session.loggedin) {
        res.render('phones')
    }
    else {
		res.redirect('/');
	}
})
router.get('/iphone', (req, res) => {
    if (req.session.loggedin) {
        res.render('iphone')
    }
    else {
		res.redirect('/');
	}
})
router.get('/galaxy', (req, res) => {
    if (req.session.loggedin) {
        res.render('galaxy')    
    }
    else {
		res.redirect('/');
	}
})
router.get('/books', (req, res) => {
    if (req.session.loggedin) {
        res.render('books')
    }
    else {
		res.redirect('/');
	}
})
router.get('/sports', (req, res) => {
    if (req.session.loggedin) {
        res.render('sports')
    }
    else {
		res.redirect('/');
	}
})
router.get('/cart', async (req, res) => {
    if (req.session.loggedin) {
        await app.getClient.connect();
        var cart = []
        let carts = await app.getClient.db('ecom').collection('carts').find().toArray();
        for (let i =0; i < carts.length;i++){
            if ( carts[i].username.toLowerCase() == req.session.username.toLowerCase() ){
                cart = carts[i].items
                break
            }
        }
    
        context = {
            items: cart,
            is_error: false
        }
    
        res.render('cart', context)    
    }
    else {
		res.redirect('/');
	}
    
})
router.get('/cartwitherror', async (req, res) => {
    if (req.session.loggedin) {
        await app.getClient.connect();
        var cart = []
        let carts = await app.getClient.db('ecom').collection('carts').find().toArray();
        for (let i =0; i < carts.length;i++){
            if ( carts[i].username.toLowerCase() == req.session.username.toLowerCase() ){
                cart = carts[i].items
                break
            }
        }
    
        context = {
            items: cart,
            is_error: true,
            message: "The item was already added."
        }
    
        res.render('cart', context)    
    }
    else {
		res.redirect('/');
	}
    
})
router.get('/leaves', (req, res) => {
    if (req.session.loggedin) {
        res.render('leaves')
    }
    else {
		res.redirect('/');
	}
})
router.get('/sun', (req, res) => {
    if (req.session.loggedin) {
        res.render('sun')
    }
    else {
		res.redirect('/');
	}
})
router.get('/boxing', (req, res) => {
    if (req.session.loggedin) {
        res.render('boxing')
    }
    else {
		res.redirect('/');
	}
})
router.get('/tennis', (req, res) => {
    if (req.session.loggedin) {
        res.render('tennis')
    }
    else {
		res.redirect('/');
	}
})

router.post('/search', (req, res) => {
    if (req.session.loggedin) {
        let items = ['Galaxy S21 Ultra', 'iPhone 13 Pro', 'Leaves of Grass', 'The Sun and Her Flowers', 'Boxing Bag', 'Tennis Racket']
        let links =  ['galaxy', 'iphone', 'leaves', 'sun', 'boxing', 'tennis']
        let query = req.body.Search.toLowerCase()
        var context = {
            is_found: false,
            result: [],
            link: []
        }
        for( let i =0; i < items.length; i++ ){
            if ( items[i].toLowerCase().includes(query) ){
                context.is_found = true
                context.result.push(items[i])
                context.link.push(links[i])
            }
        }
        res.render('searchresults', context)
    }
    else {
		res.redirect('/');
	}
})

module.exports = router