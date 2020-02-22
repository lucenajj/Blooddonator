const express = require("express")
const server = express()

// Configurar servidor para arquivos extras.
server.use(express.static("public"))

// Habilitar body do formulário.
server.use(express.urlencoded({extended: true}))


// Configurar a conexão com banco de dados.
const Pool= require('pg').Pool
const db = new Pool({
    user:'postgres',
    password: 'ASL@jj191308',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})

// Configurando o template egine.
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,

    noCache: true,
})


// Servidor pegue a barra.
server.get("/", function(req, res){

    db.query("SELECT * from donors", function(err, result){
        if (err) return res.send("ERRO de banco de dados!") 

        const donors = result.rows

        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req, res){
    //Pegar dados do formulário.
    const name = req.body.name 
    const tel = req.body.tel 
    const email = req.body.email  
    const blood = req.body.blood  

    if(name == "" || tel == "" || email == "" || blood == ""){
        return res.send ("Todos os campos devem ser preenchidos!!!")

    }

    //Colocando valores dentro do banco de dados.
    const query = `
    INSERT INTO donors ("name", "tel", "email", "blood")
    VALUES ($1, $2, $3, $4)`

    const values = [name, tel, email, blood]
    db.query(query, values, function(err){
        // Fluxo de erros
        if(err) 
        return res.send("Erro no banco de dados!")

        //Fluxo ideal.
        return res.redirect("/")
    })

})


// Porta para o servidor.
server.listen(3000, function(){
    console.log("Iniciei o servidor!!!")
})