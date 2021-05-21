const express = require("express");
const app = express();
const PUERTO = process.env.PORT ? process.env.PORT : 5000;
// var bodyParser = require('body-parser')
const cors = require('cors');
app.use(express.json());
// app.use(bodyParser.json({limit: '10mb', extended: true}))
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
const util = require("util");

const mysql = require("mysql");
const { type } = require("os");
const { query } = require("express");
const conexion = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database: 'biblioteca'
});
conexion.connect((error)=>{
    if(error){
        throw error;
    }
    console.log ("Conexion con base de datos establecida");
});

const qy = util.promisify(conexion.query).bind(conexion);
const SELECT_ALL = 'SELECT * FROM';
const SELECT_ID = 'SELECT id FROM';
const WHERE_ID = 'WHERE id = ?';
const DELETE = 'DELETE FROM';
const INSERT = 'INSERT INTO';

app.get('/categoria', async(req,res)=>{
    try{
        let respuesta = await qy(`${SELECT_ALL} categoria`);
        res.send(respuesta);
    }
    catch(e){
        console.error(e.message);
        res.status(413).send([]);
    }
});

app.get('/categoria/:id', async(req,res)=>{
    try{
        let respuesta = await qy(`${SELECT_ALL} categoria ${WHERE_ID}`, [req.params.id] );
        if(respuesta.length == 0 ){
            throw new Error('categoria no encontrada');
        } 
        res.send(respuesta[0]);
    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error inesperado": e.message});
    }
});

app.post('/categoria/', async (req, res) => {
    try{ 
        if(!req.body.nombre ){
            throw new Error ('faltan datos')
        }
        const nombre = req.body.nombre.toUpperCase();
        if(req.body.nombre === undefined){
            throw new Error('faltan datos');
        }        
        let query = 'SELECT nombre FROM categoria WHERE nombre = ?';
        let respuesta =  await qy (query, [nombre]);
        if(respuesta.length > 0){
            throw new Error('ese nombre de categoria ya existe');
        }        
        query = `${INSERT} categoria (nombre) VALUE (?)`;
        respuesta = await qy(query, [nombre]);        
        res.send({"id": respuesta.insertId, "nombre": nombre});
    }    
    catch(e){
        console.error(e.message);
        res.status(413).send({"error inesperado": e.message});
    }
})

app.delete ('/categoria/:id', async(req,res)=> {
    try{    
        let id =  [req.params.id]              
        let query = `${SELECT_ALL} categoria ${WHERE_ID}`;
        let respuesta = await qy(query, id );       
        if(respuesta.length == 0 ){
            throw new Error('no existe la categoria indicada');
        }
        
        query = 'SELECT * FROM libro WHERE categoria_id = ? ';
        respuesta = await qy( query, [req.params.id]);       
        if(respuesta.length > 0){
            throw new Error('Categoria asociada a un libro, no se puede ELIMINAR');
        }
        query = `${DELETE} categoria ${WHERE_ID}`;
        respuesta = await qy (query, id );
        res.status(200).send("se borro correctamente");
     }
     catch(e){
        console.error(e.message);
        res.status(413).send({"error inesperado": e.message});
    }

});

app.get('/libro', async (req, res) =>{
    try{
        let respuesta = await qy(`${SELECT_ALL} libro`);
        res.send(respuesta);
    }catch(e){
        console.error(e.message);
        res.status(413).send({"error inesperado": e.message});
    }
})

app.get('/libro/:id', async(req,res)=>{
    try{
        let respuesta = await qy(`${SELECT_ALL} libro ${WHERE_ID}`, [req.params.id] );
        if(respuesta.length == 0 ){
            throw new Error('no se encuentra ese libro');
        } 
        res.send(respuesta);
    }catch(e){
        console.error(e.message);
        res.status(413).send({"error inesperado": e.message});
    }
});

app.put('/libro/:id', async (req, res) => {
    try {
        let id =  [req.params.id]      
        let queryLibro = `${SELECT_ID} libro ${WHERE_ID}`;        
        let infoLibro = await qy(queryLibro, id);
        if(infoLibro.length == 0 ){
            throw new Error('El libro no existe');
        }        
        let queryEdit = `UPDATE libro SET descripcion = ? ${WHERE_ID}`;        
        let  editLibro  = [req.body.descripcion, id];
        if (!req.body.descripcion || Object.keys(req.body).length >= 2){
            throw new Error("solo se puede modificar la descripcion del libro")
        } 
        respuesta = await qy(queryEdit, editLibro);
        infoLibro = await qy(`${SELECT_ALL} libro ${WHERE_ID}`, id);
        res.send({"libro editado": infoLibro});       
        
    } catch (error) {
        console.error(error.message);
        res.status(413).send({"error inesperado": error.message});
    }
});

app.put('/libro/prestar/:id', async (req, res) => {
    try {
        let id =  [req.params.id]      
        let query = `${SELECT_ID} libro ${WHERE_ID}`;
        let respuesta = await qy(query, id);
        if(respuesta.length == 0 ){
            throw new Error('no se encontro el libro');
        }
        respuesta = await qy(`${SELECT_ID} persona ${WHERE_ID}`, [req.body.persona_id] );
        if(respuesta.length == 0){
            throw new Error('no se encontro la persona a la que se quiere prestar el libro');
        }
        query = 'SELECT persona_id FROM libro WHERE persona_id =?';
        respuesta = await qy(query, req.body.persona_id);
        console.log(respuesta)        
        if(respuesta.length > 0){
            console.log(Object.keys(respuesta))
            throw new Error('el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva');
        }
        let datos = [req.body.persona_id, req.params.id];
        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
        respuesta = await qy(query, datos)
        res.status(200).send("se presto correctamente");
        
    } catch (error) {
        console.error(error.message);
        res.status(413).send({"Error": error.message});
    }
});

app.put('/libro/devolver/:id', async (req, res) => {
    try {
        let id =  [req.params.id]      
        let query = `${SELECT_ID} libro ${WHERE_ID}`;
        let respuesta = await qy(query, id);
        if(respuesta.length == 0 ){
            throw new Error('ese libro no existe');
        }       
        respuesta = await qy(`${SELECT_ALL} libro ${WHERE_ID}`, id);
        if(respuesta[0].persona_id === null){
            throw new Error('ese libro no estaba prestado!');
        }         
        let datos = [null, id];
        query = 'UPDATE libro SET persona_id = ? WHERE id = ?';
        respuesta = await qy(query, datos)
        res.status(200).send("se realizo la devolucion correctamente");
        
    } catch (error) {
        console.error(error.message);
        res.status(413).send({"error inesperado": error.message});
    }
});


app.post('/libro', async (req, res) => {
    try{ 
        const nuevoLibro = req.body; 
        console.log(nuevoLibro)       
        if(!nuevoLibro.nombre || !nuevoLibro.categoria_id ){
            throw new Error('nombre y categoria son datos obligatorios');
        }         
        let respuesta = await qy(`${SELECT_ID} persona ${WHERE_ID}`, [req.body.persona_id] );
        if(respuesta.length == 0 && req.body.persona_id ){
            throw new Error('no existe la persona indicada');
        } 
        respuesta = await qy(`${SELECT_ID} categoria ${WHERE_ID}`, [req.body.categoria_id] );
        if(respuesta.length == 0 ){
            throw new Error('no existe la categoria indicada');
        } 
        
        let query = 'SELECT nombre FROM libro WHERE nombre = ? ';
        respuesta = await qy(query, [req.body.nombre]);
        if(respuesta.length > 0){           
            throw new Error('ese libro ya existe')         
            
        }
        console.log(respuesta)
        query = 'INSERT INTO libro (nombre, descripcion, categoria_id) VALUES (?,?,?)';
        let datos = [req.body.nombre, req.body.descripcion, req.body.categoria_id];
        // for(let i = 0; i < datos.length; i++){            
        //     datos[i] = datos[i].toUpperCase();
        //     console.log('no es uppercase')
        // };
        
        respuesta = await qy (query, datos);
        let idLibro = respuesta.insertId
        respuesta = await qy(`${SELECT_ALL} libro ${WHERE_ID}`, idLibro );
        try{
            res.send(respuesta[0])
        }
        catch{
            console.error(error)
        }
    }
    
    catch(e){
        console.error(e.message);
        res.status(413).send({"error inesperado": e.message});
    }
})

app.delete ('/libro/:id', async(req,res)=> {
    try{
        let id =  [req.params.id]      
        let query = `${SELECT_ALL} libro ${WHERE_ID}`;
        let respuesta = await qy(query, id );
        console.log(Object.values(respuesta))
        if(respuesta[0].persona_id){
            throw new Error( "ese libro esta prestado no se puede borrar");         
        }else if(respuesta.length == 0 ){
            throw new Error( "no se encuentra ese libro");
        } 
        query = `${DELETE} libro ${WHERE_ID}`;
        respuesta = await qy (query, id );
        res.send ("se borro correctamente");
     }
     catch(e){
        console.error(e.message);
        res.status(413).send({"Error inesperado": e.message});
    }

});

app.get('/persona', async (req, res) =>{
    try{
        let respuesta = await qy(`${SELECT_ALL} persona `);
        res.send(respuesta);
        
    }catch(e){
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
})

app.get('/persona/:id', async(req,res)=>{
    try{
        let respuesta = await qy(`${SELECT_ALL} persona ${WHERE_ID}`, [req.params.id] );
        if(respuesta.length == 0 ){
            throw new Error('no se encuentra ese persona');
        } 
        res.send(respuesta);
    }catch(e){
        console.error(e.message);
        res.status(413).send({"Error": e.message});
    }
});

app.post('/persona', async (req, res) =>{
    try {
        if(!req.body.nombre || !req.body.apellido || !req.body.alias || !req.body.mail ){
            throw new Error('Todos los datos son obligatorios');
        }        
        let query = 'SELECT id FROM persona WHERE mail = ?'
        let respuesta = await qy(query, req.body.mail)
        console.log(respuesta)
        if(respuesta.length > 0){
            throw new Error ('el email ya se encuentra registrado')
        }
        var nuevaPersona = Object.values(req.body)
        query = `${INSERT} persona (nombre, apellido, mail, alias) VALUES (?,?,?,?) `;
        respuesta = await qy(query, nuevaPersona);                      
        res.send({"id": respuesta.insertId, "nombre": req.body.nombre, "apellido":req.body.apellido, "email": req.body.mail, "alias": req.body.alias});

    } catch (error) {
        console.error(error.message);
        res.status(413).send({"Error inesperado": error.message});
    }
});

app.put('/persona/:id', async (req, res) => {
    try{
        let query = 'SELECT *FROM persona WHERE id =?';
        let respuesta = await qy(query,[req.params.id]);
        
        if (respuesta.length ==0){
         throw new Error  ("El usuario no exixste");
        };

        query = 'UPDATE persona SET nombre =?, apellido =?, alias =?  WHERE id=?';

        respuesta = await qy(query, [req.body.nombre, req.body.apellido, req.body.alias, req.params.id]);
            if (respuesta.length ==0){
            throw new Error  ("El usuario no exixste");
        };
        query = 'UPDATE persona SET nombre =?, apellido =?, alias =?  WHERE id=?';
        respuesta = await qy(query, [req.body.nombre, req.body.apellido, req.body.alias, req.params.id]);
        res.send({"respuesta": respuesta});
}

        catch(e){
        console.error(e.message);
           
        res.status(413).send({"Error": e.message});
        }
});

app.delete ('/persona/:id', async(req,res)=> {
    try{
        let id =  [req.params.id]      
        let query = `${SELECT_ALL} persona ${WHERE_ID}`;
        let respuesta = await qy(query, id );

        if(respuesta.length == 0 ){
            throw new Error('no existe esa persona"');
        }
        query = 'SELECT persona_id FROM libro WHERE persona_id = ?', id;
        respuesta = qy(query);
        if(respuesta.length > 0){
            throw new Error ('Esa persona tiene libro asociados no se puede eliminar')
        }
        
        query = `${DELETE} persona ${WHERE_ID}`;
        respuesta = await qy (query, id );
        res.send ("se borro correctamente");
     }
     catch(e){
        console.error(e.message);
        res.status(413).send('parece tener libros');
    }

});

app.listen(PUERTO, () =>{
    console.log("Servidor en el puerto: "  , PUERTO, `\n http://localhost:${PUERTO}`)
});