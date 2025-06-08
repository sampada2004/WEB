const express=require('express');
const app=express();
const path=require('path')

app.get('/',(req,res)=>{
    res.send(`
            <li><a href='/cse'>CSE</a></li> 
            <li><a href='/ece'>ece</a></li>     
            <li><a href='/mech'>mech</a></li>     
    
        `)
});

app.get('/cse',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','cse.html'));
});

app.get('/ece',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','ece.html'));
});

app.get('/mech',(req,res)=>{
    res.sendFile(path.join(__dirname,'views','mech.html'));
});

app.listen(5000,()=>{
    console.log("listening on 5000");
})


