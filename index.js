const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
var express = require('express');
var app = express();
const translate = require('google-translate-cn-api');


// English => Chinese



app.set('view engine', 'ejs');  

app.use('/public', express.static(__dirname + '/public'));

// app.get('/', function(req, res) {  
//   res.render('default', {  
//    title: '首頁',  
//    users: ['Kai', 'aYen', 'Kyousuke']  
//   });  
//  });  

app.get('/', async function(reqq, ress){

  

  //指定 /views/idex.ejs
  const url = reqq.query.url
  await request(url, async(err, res, body) => {
    // console.log(body)
    // 把 body 放進 cheerio 準備分析
    const $ = cheerio.load(body)
    let weathers = []
    var ans = {}
    var final=[]
    $('#MainDiv #QForm table tbody tr .RightItem select option').each(function(i, elem) {
        // console.log($(this).options.value)
        
        if(i>0&&i<11){
          // console.log('第'+i+'題，填下'+)
          ans[i]=Number($(this).val())+1
          // console.log($(this).val());
        }
        // weathers.push($(this).text().split('\n'))
      })
  
    console.log(ans)
    $('#MainDiv #QForm table tbody tr').each(function(i, elem) {
      // console.log($(this).options.value)
      // console.log($(this).text())
      weathers.push($(this).text().split('\n'))
      // console.log(ans[i+1])
    })
    // console.log(weathers)
    
  
    await Promise.all(weathers.map(async(weather,i)=>{
      // console.log(weather[0])
      // console.log(weather[ans[i+1]])
      await translate(weather[0], { to: 'zh-cn' }).then(async(result)=>{
        await translate(weather[ans[i+1]], { to: 'zh-cn' }).then((result2)=>{
          var que = weather[0].slice(2)
          var replaceQQ = que.replace('???', "");
          final.push({que:replaceQQ,ans:weather[ans[i+1]],trans:result.text,transAns:result2.text})
        })
      })
      
    }))
    
    // console.log(final)
    ress.render('default',{title:'研究生線上英文字彙破解',show:final});
    
    


  })
});

var server = app.listen(3030, function() {  
  console.log('Listening on port 3030');  
 });   


// const url = 'http://www.englishvocabularyexercises.com/AWL/AWLSublist09-Ex1a.htm'
// request(url, (err, res, body) => {
//   // console.log(body)
//   // 把 body 放進 cheerio 準備分析
//   const $ = cheerio.load(body)
//   let weathers = []
//   var ans = {}
//   var final=[]
//   $('#MainDiv #QForm table tbody tr .RightItem select option').each(function(i, elem) {
//       // console.log($(this).options.value)
      
//       if(i>0&&i<11){
//         // console.log('第'+i+'題，填下'+)
//         ans[i]=Number($(this).val())+1
//         // console.log($(this).val());
//       }
//       // weathers.push($(this).text().split('\n'))
//     })

//   console.log(ans)
//   $('#MainDiv #QForm table tbody tr').each(function(i, elem) {
//     // console.log($(this).options.value)
//     // console.log($(this).text())
//     weathers.push($(this).text().split('\n'))
//     // console.log(ans[i+1])
//   })
//   // console.log(weathers)
  

//   weathers.forEach((weather,i)=>{
//     // console.log(weather[0])
//     // console.log(weather[ans[i+1]])
//     final.push({que:weather[0],ans:weather[ans[i+1]]})
//   })

//   console.log(final)
// })