const stripe = require('stripe')(process.env.STRIP_TOKEN);
var dbSchema= require('../config/config');
const Strip_Status= require('../config/globals').Strip_Status;
var stripTransactions = dbSchema.stripTransactions;

var loadingHTML=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" >
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"  /> -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" ></script>
    <script src="https://use.fontawesome.com/399a39c8ae.js"></script>
    <title>AnryTronToken</title>
</head>
<body>
    <div class="alert alert-primary" role="alert">
        <i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i> Please dont refresh or go back.... 
    </div>
</body>
</html>`

module.exports={


    /*********************************************************/
    /*******************ACTION SUMMARY************************/
    /*********************************************************/
    /*Action Name : initPayment
    /*ActionUrl : base + /stripe/make/payment
    /*Method Type : Post
    /*Params Type : {Tokens:NUMBER}
    /********************END SUMMARY**************************/

    initPayment:async (req,res,next)=>{
        ////console.log(req.Tokens,"----tokens")

         /* 
            [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                    'name' => $name,
                    ],
                    'unit_amount' => $amount,
                ],
                'quantity' => 1,
                ]
        
        
        */ //parseInt(req.body.Tokens),

        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                //price:"price_1NpFDMCJfbu8VX7DZEpYOerL",
                price_data:{currency:'usd','product_data' : {'name':"AnryTronToken"},unit_amount:parseFloat(req.body.amount)},
                quantity: 1 , 
              },
            ],
            mode: 'payment',
            success_url: process.env.HOST+'stripe/response?id={CHECKOUT_SESSION_ID}',
            cancel_url:  process.env.HOST+'stripe/response?id={CHECKOUT_SESSION_ID}',
          });
        
        //var product= await getProductList();
        ////console.log(parseInt(req.body.Tokens),"=======tookens")
        var paymentObj=generatePaymentObj(req.userId,"price_1NpFDMCJfbu8VX7DZEpYOerL",session,req.body);

        ////console.log(paymentObj,"================")
        



        let newTransaction=new stripTransactions(paymentObj);

        try{
           await newTransaction.save()
        }catch(err){
          return  res.send({status:false,msg:"Error Create  Entry",err});
        }
        
        
        //res.redirect(303,session.url)
        res.send({status:true,url:session.url});


    },


    /*********************************************************/
    /*******************ACTION SUMMARY************************/
    /*********************************************************/
    /*Action Name : successPayment
    /*Method Type : get
    /*Params Type : query{id}
    /********************END SUMMARY**************************/

    Response:async (req,res,next)=>{

        ////console.log(req.body,req.query);
        var stripe_sessionId=req.query.id

        if(req.query.mobile==undefined)
          return res.send(loadingHTML);


        if(stripe_sessionId==undefined || stripe_sessionId==""){
            return res.send({status:false});
        }

        var stripe_session=await stripe.checkout.sessions.retrieve(stripe_sessionId);
        var filter={"transactionSessionId":stripe_sessionId}

        stripTransactions.updateOne(filter,{status:stripe_session.payment_status,transactionJSON:JSON.stringify(stripe_session)},async (err,docs)=>{
            if (err) {
              return res.send(err);
            } else {

              data=await stripTransactions.findOne(filter);

              if(stripe_session.payment_status=='paid'){
                let check= await dbSchema.User.findOneAndUpdate({_id: data.userId},{$inc:{walletCoins: parseInt(data.token)} }).exec();

                return res.send({status:true,data:{amount:data.amount,trasactionId:data.trasactionId,token:data.token,createdOn:data.createdOn,payment_status:stripe_session.payment_status}});
              
              }else{
                return res.send({status:false,data:{}});
              }

               
              
            }
        });
            
        

    }
    

}



function  generatePaymentObj(userid,productId,sessionObj,body){

    
    return {
        "userId":userid,
        "amount":body.amount,
        "token":body.Tokens,
        "productId":productId,
        "trasactionId":sessionObj.payment_intent,
        "transactionJSON":"",
        "transactionSessionId":sessionObj.id
    }
}

async function getProductList(){
    /// fetch all stripe products.

}