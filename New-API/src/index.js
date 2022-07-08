const express = require('express')
const path = require('path')
const morgan =require('morgan')
const { engine } = require('express-handlebars');
const app = express()
const port = 9999
const https = require('https');



//template engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views',path.join(__dirname,'resource/views'))
app.use(express.static(path.join(__dirname, '/public')));

//HTTP logger
app.use(morgan('combined'))
app.get('/', (req, res) => {
  res.render('home');
})

app.post('/pay',function(req,res){
  var partnerCode = "MOMO0KFT20220628";
  var accessKey = "nQvQVkEE5HVd7Ay7";
  var secretkey = "qvNxNYLV43CMv8i3HSKCFwYbAbsaZGn1";
  var requestId = partnerCode + new Date().getTime();
  var orderId = requestId;
  var orderInfo = "Sừng ác quỷ nhỏ";
  var redirectUrl = "https://momo.vn/return";
  var ipnUrl = "https://callback.url/notify";
  var amount = "30000";
  var requestType = "captureWallet"
  var extraData = ""; 

  var rawSignature = "accessKey="+accessKey+"&amount=" + amount+"&extraData=" + extraData+"&ipnUrl=" + ipnUrl+"&orderId=" + orderId+"&orderInfo=" + orderInfo+"&partnerCode=" + partnerCode +"&redirectUrl=" + redirectUrl+"&requestId=" + requestId+"&requestType=" + requestType
const crypto = require('crypto');
var signature = crypto.createHmac('sha256', secretkey)
    .update(rawSignature)
    .digest('hex');

//json object send to MoMo endpoint
const requestBody = JSON.stringify({
    partnerCode : partnerCode,
    accessKey : accessKey,
    requestId : requestId,
    amount : amount,
    orderId : orderId,
    orderInfo : orderInfo,
    redirectUrl : redirectUrl,
    ipnUrl : ipnUrl,
    extraData : extraData,
    requestType : requestType,
    signature : signature,
    lang: 'en'
});

//Create the HTTPS objects
const options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/v2/gateway/api/create',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
    }
}

//Send the request and get the response
  req = https.request(options, data => {
  data.setEncoding('utf8');
  data.on('data', (body) => {
      console.log('Body: ');
      console.log(body);
      console.log('payUrl: ');
      res.redirect(JSON.parse(body).payUrl);
  });
  res.on('end', () => {
      console.log('No more data in response.');
  });
})

req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});
// write data to request body
console.log("Sending....")
req.write(requestBody);
req.end();

})

app.listen(port, () => {
  console.log(`App listening `)
})
