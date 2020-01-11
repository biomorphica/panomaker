const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars and views configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))

app.get('', (req, res) => {
    res.render('index', {
        title:'Panorama Network'    
    })
})

app.get('*', (req, res) => {
    // res.send('My 404 page')
    res.render('404', {
        title:'404',
        name: "Thomas Williams",
        errorMessage: "Page Not Found"
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port)
})