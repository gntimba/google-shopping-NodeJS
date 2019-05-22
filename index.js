const express = require('express')
const { google } = require('googleapis')
const readXlsxFile = require('read-excel-file/node');
var fs = require('fs');
const path = require('path');
//const serviceAccountJwt = require('./Shopping API-145f77376c3c.json')
const app = express()

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

app.get('/csv',function(req,res){

  readXlsxFile(fs.createReadStream('test.xlsx')).then((rows) => {
    res.send(rows)
  })


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
        description:"The best in samsung",
        imageLink: "https://i.gadgets360cdn.com/large/samsung_galaxy_a30_a50_fronts_1551359465736.jpg",
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