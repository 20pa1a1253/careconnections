//const e = require("express");
const express = require("express");
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({extended:false}))
const port = 8000;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Create a fake DOM environment
const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`);
const { window } = dom;

// Define global variables for the fake environment
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

const functions = require('firebase-functions');
const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");


var serviceAccount = require("./key.json");
initializeApp({
	credential: cert(serviceAccount),
});


 const db = getFirestore();
//const db = firebase.firestore();

app.set("view engine","ejs");
app.use(express.static('public'));

app.get("/",(req,res)=>{
	res.render("home");
});
app.post("/fo",(req,res)=>{
	res.render("fundforms");
	

	
});
app.post("/form",(req,res)=>{
	res.send("donor");
	const d=req.body.picker;
	console.log(d)
	switch (d) {
		case "div1":

		  // Show food related content
		  
		  break;
		case "div2":
		  // Show grocery related content
		  break;
		case "div3":
		  // Show clothes related content
		  break;
		case "div4":
		  // Show others related content
		  break;
		default:
		  // Hide all content
		  break;
	  }
	
	
	//}
  });
  
app.get("/ss",(req,res)=>{
	const n=req.query.nam;
	db.collection("users").add({
		name:n
	})
	.then(()=>{
		res.send("index");

	})
	
});

app.get("/login",(req,res)=>{
	res.render("login");
});
app.get("/loginsubmit",(req,res)=>{
	const email=req.query.email;
	const pwd=req.query.pwd;
	const role=req.query.role;
	console.log(role);
	if(role=="organiser"){
		db.collection("Organisers")
		.where("email","==",email)
	    .where("pwd","==",pwd)
	    .get()
	    .then((docs) => {
			if(docs.size > 0){
			console.log("pwd");
			res.render("organ");
			}
		})
    }
	else if(role=="donor"){
		db.collection("donors")
		.where("email","==",email)
	    .where("pasword","==",pwd)
	    .get()
	    .then((docs) => {
			if(docs.size > 0){
				console.log("pwd");
				res.render("donor");
			}
		})
    }
	else{
		res.send("loginfailed");
	}
});


app.get("/signup",(req,res)=>{
	res.render("ss");
});
app.get("/we",(req,res)=>{
	res.render("landing");
});
app.get("/d",(req,res)=>{
	res.render("donor");
});
app.get("/donorReg.ejs",(req,res)=>{
	res.render("donorReg");
});
app.get("/dr",async(req,res)=>{
	const fname=req.query.fname;
	const lname=req.query.lname;
	const phn=req.query.tel;
	const emailid = req.query.email;
	const pwd = req.query.pwd;
	const add= req.query.add;
	console.log(emailid);
	console.log(fname);
	db.collection("donors").add({
		donar: fname+""+lname,
		email:emailid,
		pasword:pwd,
		address:add,
		phonenum:phn,
	}).then(()=>{
	res.render("donor");
	 })

 })
app.get("/organReg.ejs",(req,res)=>{
	res.render("organReg");
});
app.get("/Or",async(req,res)=>{
	const fname=req.query.org;
	const lname=req.query.orgname;
	const phn1=req.query.num1;
	const phn2=req.query.num2;
	const count=req.query.pp;
	const emailid = req.query.email;
	const pwd = req.query.pwd;
	const add= req.query.add;
	console.log(emailid);
	console.log(fname);
	db.collection("Organisers").add({
		organisation: fname,
		organiser:lname,
		phone1:phn1,
		phone2:phn2,
		count:count,
		email:emailid,
		pwd:pwd,
		address:add,
	}).then(()=>{
		res.render("organ");
	 })

 })
 const funds =[];
 app.get("/funds",async(req,res)=>{

	const mencl=req.query.men;
	const food=req.query.food;
	const phn=req.query.phn;
	const other = req.query.othr;
	const menum = req.query.menum;
	const othrnum= req.query.othrnum;
	console.log(food);
	console.log(phn);
	funds.push(phn);
	funds.push(food);
	funds.push(mencl);
	funds.push(menum);
	funds.push(other);
	funds.push(othrnum);
	//console.log(funds);
	//res.send("success");
	var snapshot= await db.collection("donors").get();
	var re= db.collection("donors")
	.where("phonenum","==",phn).get();
	re.then((docs)=>{
		res.send("Thanks for your contribution your'e funds collected :))");

	})
	
	re.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			console.log(doc.id);
			
			//exports.myFunction = functions.https.onCall((data, context) => {
				db.collection("donors").doc(doc.id).get().then((doc) => {
					const items = doc.data().Funds || [];
					
					// Add the new item to the items array
					items.push({"number":phn,"food":food,"clothes":mencl,"clothcount":menum,"others":other,"othercount":othrnum});
					console.log(items);
					
					// Update the items array in the document
					db.collection("donors").doc(doc.id).update({
					  "Funds": items
				    })
				// db.collection("donors").doc(doc.id).update({
				// 	'Funds.number': phn,
				// 	'Funds.food':food,
				// 	'Funds.clothes':mencl,
				// 	'Funds.clothcount':menum,
				// 	'Funds.others':other,
				// 	'Funds.otherscount':othrnum,
				// });
				// const docRef = db.collection('donors').doc(doc.id);
				// docRef.update({
				// 	'Funds': [funds]
				//   });
				  
				
				// console.log(doc.data().Funds)
			//})
		});
	})
	
	
	
 })
})
 app.get("/needs",(req,res)=>{
	const ned=req.query.needs;
	const num=req.query.number;
	//const pwd=req.query.pwd;
	const a=[];
	var re= db.collection("Organisers").where("phone1","==",num);
	console.log(num);
	console.log(ned);
	res.send("thankyou!!you're needs collected succesfully");
	re.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			db.collection("Organisers").doc(doc.id).update({
				needs:ned,
				
			})
			
			a.push(doc.id);
			console.log(doc.id);
		});
	});
	
});
const dc=[];
app.get("/signupsubmit",async(req,res)=>{
	const name=req.query.user;
	const email=req.query.email;
	const pwd=req.query.pwd;
	console.log(name);
	console.log(email);
	// const citiesRef = db.collection('customers');
    // const snapshot = await citiesRef.where('email', '==', email).where('pwd','==',pwd).get();
	// if(snapshot.empty){
	// 	db.collection("customers").add({
	// 		username: name,
	// 		Email : email,
	// 		password: pwd,
	// 	}).then(()=>{
	// 		res.render("landing");
	// 		console.log("emailadded");
	// 		console.log(email);
	// 	});
	// }
	// else{
	// 	res.send("email already exists");

	//}
	
    var re=await db.collection("customers")
		.where("email","==",email)
	    .where("pwd","==",pwd)
		.get();
		//.then((docs)=>{
			re.forEach(doc=>{
				dc.push(doc.data())
			})
			//console.log("the")
			//doc.push(docs.data());

		//})
	//console.log(dc);
	res.render ("landing")
	// if(dc.length==0){
	// 	db.collection("customers").add({
	// 		username: name,
	// 		Email : email,
	// 		password: pwd,
	// 	}).then(()=>{
	// 		res.render("landing");
	// 		console.log("emailadded");
	// 	});

	// }
	// else{
	// 	res.send("email already exists");
	// }


		
	// await db.collection("customers").add({
	//  		username: name,
	// 	 		Email : email,
	// 			password: pwd,
	// 		}).then(()=>{
	// 			res.render("landing");
	// 			console.log("emailadded");
	// 		});
	    
		
		
});
app.get("/fun",(req,res)=>{
	res.render("fund");
});
app.get("/ned",(req,res)=>{
	res.render("needs");
});

// app.get("/home",(req,res)=>{
// 	res.render("home");
// });




app.get("/cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("Cart").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});
app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
})
