const express = require('express')
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { google } = require('googleapis')
const path = require('path');
const app = express()
const axios = require('axios');
var parseString = require('xml2js').parseString;


 startUloading()



  function axiosTest() {
    console.log('geting data from the server')
    var options=
      {
        method: 'get',
        url: 'https://www.buynow.co.za/Export.aspx?key=11',
        timeout: 180000, // Let's say you want to wait at least 180 seconds
      }
    
    return axios(options).then(response => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data)
      console.log('done geting data')
      return response.data
    })
  }

 async function insertBatch(data){
    try {
      const client = await google.auth.getClient({
        keyFile: path.join(__dirname, 'Shopping API-145f77376c3c.json'),
        scopes: 'https://www.googleapis.com/auth/content',
      });
      console.log("now inserting to google mecharnt")
      const content = google.content({ version: 'v2.1', auth: client });
      const response = await content.products.custombatch({"resource":data})
      //console.log(response.data);
      console.log(response.status+' '+response.statusText);
      return response.data;
    } catch (error) {
      console.log(error)
    }
  
 }
 function startUloading(){
 var hrstart = process.hrtime()
    
    axiosTest().then(data => {
      // res.send(data)
      console.log('done now passing data and converting it')
      parseString(data, function (err, result) {
        let products =result.rss.channel[0].item
        let entries = { entries: [] }

        for (let index = 0; index < products.length; index++) {
          let price = products[index]['g:price'][0].split(' ')
          const params = {
            merchantId: 134645521,
            batchId: index + 1,
            method: "insert",
            product: {
              channel: "online",
              contentLanguage: "en",
              offerId: products[index]['g:id'][0],
              targetCountry: "ZA",
              brand: products[index]['g:brand'][0],
              title: products[index]['g:title'][0].replace(/<\/?[^>]+(>|$)/g, ""),
              link: products[index]['g:link'][0],
              description: products[index]['g:description'][0].replace(/<\/?[^>]+(>|$)/g, ""),
              imageLink: products[index]['g:image_link'][0],
              productTypes:[ products[index]['g:google_product_category'][0]],
              price: {
                currency: price[1],
                value: price[0]
              },
              availability: products[index]['g:availability'][0],
              condition:products[index]['g:condition'][0]
            
            }
          };
  
          entries.entries.push(params)
        
        }
       // res.json(entries)
        insertBatch(entries).catch(console.error)

      });

    })
  }

  app.get('/', function (req, res) {
    async function runSample() {
      const client = await google.auth.getClient({
        keyFile: path.join(__dirname, 'Shopping API-8bd0b5bf1bca.json'),
        scopes: 'https://www.googleapis.com/auth/content',
      });
  
      const params = {
        merchantId: 134645521
      };
      const content = google.content({ version: 'v2.1', auth: client });
      const response = await content.products.list(params)
      console.log(response.status+' '+response.statusText);
     // res.json(response.data)
  
      return response.data;
    }
  
    runSample().catch(console.error)
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