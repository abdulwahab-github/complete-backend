const { sendResponse } = require("../helper/helper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel");


const authController =({
    signup:async(req ,res)=>{
        const {userName,email,password}= req.body;
        const object = {userName , email,password};
        let require = ["userName", "email","password"];
        let errormsg = [];
        require.forEach((arr)=>{
            if(!object[arr]){
                errormsg.push(arr)
            }
        });
        if(errormsg.length >0){
            res
            .send(sendResponse(false ,null , "Some Feilding Are Missing :(",errormsg)).status(400);
            return;
        }else{
            let harhsPassrword = await  bcrypt.hash(object.password , 10) ;
            object.password= harhsPassrword;
            const existinguser = await userModel.findOne({email});
            if(existinguser){
                res.send(sendResponse(false ,null, "This Email Already Exist")).status(403);
          }else{
            userModel.create(object).then((result)=>{
                res.send(sendResponse(true,result,"User Saved Successfully"))
            }).catch((err) => {
                res
                  .send(sendResponse(false, err, "Internal Server Error"))
                  .status(400);
              });
          }
        }
    
    },
    login:async(req,res)=>{
        const {email , password} =req.body;
        const object = {email , password};
        let result = await userModel.findOne({email});
        if(result){
          let conform =  await bcrypt.compare(object.password, result.password);
          if(conform){
            let token = jwt.sign({ ...result} , process.env.SECURE_KEY)
            res.send(sendResponse(true,{user:result, token},"Login Successfully"))
          }else{
            res.send(sendResponse(false,null ,"Password Error"))
          }
        }else{
          res.send(sendResponse(false, null, "User Doesn't Exist"));
      
        }
      },
    getuser:async (req , res)=>{
        let result = userModel.find().then((result)=>{
          res.send(sendResponse(true ,result))
        }).catch((e)=>{
          console.log(e)
        })
      },
    getuserByid: async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching user.' });
  }
},

    protected: async (req, res, next) => {
        let token = req.headers.authorization;
        if (token) {
          token = token.split(" ")[1];
          jwt.verify(token, process.env.SECURE_KEY, (err, decoded) => {
            if (err) {
              res.send(sendResponse(false, null, "Unauthorized")).status(403);
            } else {
            //   console.log(decoded);
              next();
            }
          });
        } else {
          res.send(sendResponse(false, null, "Unauthorized")).status(403);
        }
      },
})

module.exports = authController;
