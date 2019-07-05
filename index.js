const express = require('express')
const { google } = require('googleapis')
const path = require('path');
//const serviceAccountJwt = require('./Shopping API-145f77376c3c.json')
const app = express()
var parseString = require('xml2js').parseString;
var request = require('request');

app.get('/', function (req, res) {
  async function runSample() {
    const client = await google.auth.getClient({
      keyFile: path.join(__dirname, 'Shopping API-145f77376c3c.json'),
      scopes: 'https://www.googleapis.com/auth/content',
    });

    const params = {
      merchantId: 134645521
    };
    const content = google.content({ version: 'v2.1', auth: client });
    const response = await content.products.list(params)
    console.log(response.data);
    res.json(response.data)

    return response.data;
  }

  runSample().catch(console.error)
})

app.get('/csv', function (req, res) {
  let vm = this;
  var hrstart = process.hrtime()
  var options = {
    url:  'https://www.buynow.co.za/Export.aspx?key=3',
    timeout: 120000
  }
  request(options, function (error, response, body) {

     console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    parseString(body, function (err, result) {
      let products = result.ROOT.Products;
      let entries = { entries: [] }

      for (let index = 0; index < products.length; index++) {
        const params = {
          merchantId: "120407712",
          batchId: index+1,
          method: "insert",
          product: {
            channel: "online",
            contentLanguage: "en",
            offerId: products[index].ProductCode[0],
            id:products[index].ProductCode[0],
            targetCountry: "ZA",
            brand: products[index].Brand[0],
            title: products[index].ProductName[0],
            link: products[index].ProductURL[0],
            description: products[index].ProductDescription[0],
            imageLink: products[index].ImageURL[0],
            product_type: products[index].Category1[0],
            price: {
              currency: "ZAR",
              value: products[index].Price[0]
            },
            availability: products[index].StockLevel[0]
          }
        };
        if(products[index].hasOwnProperty('OnSpecial')){
          params.product.salePrice= {
            "value": products[index].SpecialPrice[0],
            "currency": 'ZAR'
          }
          //console.log(index)
      }
        entries.entries.push(params)
      }
      hrend = process.hrtime(hrstart)

    
      console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    
      // if(products[index].ProductCode[0])
      res.json(entries)
    });

  });





})


app.get('/insert', function (req, res) {
  async function insert() {
    const client = await google.auth.getClient({
      keyFile: path.join(__dirname, 'Shopping API-145f77376c3c.json'),
      scopes: 'https://www.googleapis.com/auth/content',
    });

    const params = {
      merchantId: "134645521",
      resource: {
        channel: "online",
        contentLanguage: "en",
        offerId: "g003",
        targetCountry: "ZA",
        brand: "samsung",
        title: "Samsung A30",
        link: "https://www.samsung.com/za/smartphones/galaxy-a30-a305/SM-A305FZBEXFA/",
        description: "The best in samsung",
        imageLink: "https://i.gadgets360cdn.com/large/samsung_galaxy_a30_a50_fronts_1551359465736.jpg",
        mpn: "44444",
        price: {
          currency: "ZAR",
          value: "4499"
        },
        availability: "in stock"
      }
    };
    const content = google.content({ version: 'v2.1', auth: client });
    const response = await content.products.insert(params)
    console.log(response.data);
    res.json(response.data)

    return response.data;
  }

  insert().catch(console.error)
})



app.listen(3000)


//view-source:https://www.buynow.co.za/Export.aspx?key=3//
//http://www.buynow.co.za/Export.aspx?key=8&Price=6&ID=YourBidOrBuyID&ShippingProductClass=This-needs-to-match-a-shipping-product-class-the-seller-has-defined-on-bidorbuy
//https://www.buynow.co.za/Export.aspx?key=0