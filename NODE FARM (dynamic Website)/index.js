const fs=require('fs'); //built in module
const http =require('http');//built in module
const url=require('url');
const replaceTemplate=require('./modules/replaceTemplate');
const slugify=require('slugify');
////SERVER////(create and start a server) (look at ////%%%% line below)

//replacing the place holders with real data


///HERE instead of reading data and sending it each time when someome requests(refer ////**** line) we'll read it at once and send the same data whenever someone requests
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8') ; //for overview page data
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8') ;//for card page data
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8') ;//for product page data


const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8') ; //for api data reading
const dataObj=JSON.parse(data);

const slugs=dataObj.map(el=>slugify(el.productName,{lower:true}));
console.log(slugs);
//console.log(slugify('Fresh Avacados',{lower:true}));

   const server=http.createServer((req,res)=>{ ///%%%%             //its a callback function
   
   
   const{query,pathname}=url.parse(req.url,true);
    
    //IMPLEMENTING ROUTING

    //overview page
    if(pathname==='/'||pathname==='/overview'){
        res.writeHead(200,{'Content-type':'text/html'});

        const cardsHtml=dataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);

        //console.log(cardsHtml);
        res.end(output);
    }
    
    //product page
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-type':'text/html'});
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);

        res.end(output);
    }
    //API
    else if(pathname==='/api'){ ////****
        //fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{//__dirname says where current file is located//. says where script is running
            //const productData=JSON.parse(data);//data is a string which we then converted into an object using JSON.parse
            res.writeHead(200,{'Content-type':'application/json'});//sending status code we did similar thing before in page not found thing where content was html file
            res.end(data); // server will respond by giving us all the data present in the json file
        //});
        
    }
    //NOT FOUND
    else{
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header':'hello-world'
        });
        res.end('<h1>Page Not Found!</h1>');
    }
    
});

server.listen(8000,'127.0.0.1',()=>{                        //local host standard IP address
    console.log('Listening to requests on port 8000')       //server listening to requests
});