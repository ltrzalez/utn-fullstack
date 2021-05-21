import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function FormularioPersona(props) {

    // Traer todos los libros que tiene un usuario, para tambien mostar esa informacion
    // Podria ser en extender cada item de la lista, cambiar los item de la lista por card o un nuevo componente


    const params = useParams();
    const [form, setForm] = React.useState({
        id: null,
        nombre: "",
        apellido: "",
        mail: "",
        alias: ""
    });



    // ver de agregar un if en esta funcion para tambien hacer el metodo put
    const addPersona = async (persona) => {
        let personaSinId = {...persona}
        personaSinId = {
            nombre: persona.nombre,
            apellido: persona.apellido,
            mail: persona.mail,
            alias: persona.alias
        }
        try{
            let res = await axios.post('http://localhost:5000/persona', personaSinId)                            
                if( res.status === 200) {
                alert("Persona Añadida", res.request.response)
                // props.history.push("/libro") esta linea de codigo no funciona pero se deberia implementar para volver al listado
                }
            
        } catch (error){ 
            let mensajeDeError = Object.values(error.response.data)
            alert(mensajeDeError)
        }  

    }

    const handleChangeNombre = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.nombre = e.target.value ;
        setForm(nuevoState)
    }    

    const handleChangeApellido = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.apellido = e.target.value ;
        setForm(nuevoState)
    }

    const handleChangeMail = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.mail = e.target.value ;
        setForm(nuevoState)
    }

    const handleChangeAlias = (e) => {
        let nuevoState =  JSON.parse(JSON.stringify(form));
        nuevoState.alias = e.target.value ;
        setForm(nuevoState)
    }

    React.useEffect(() => {
        const getPersona = async (personaId) => {
            try {
                const infoFromServer = await axios.get(`http://localhost:5000/persona/${personaId}`)                                
                setForm(infoFromServer.data[0])
            } catch (error) {
                let mensajeDeError = Object.values(error.response.data)
                console.log(mensajeDeError)
            }
        }
        
        if(params.id === "0"){
            return            
        } else {
            getPersona(params.id)
        }

    }, [params]);


    return (
        <div>
            <form style={{ backgroundColor: 'red'}}>
                <div >
                    <label>Nombre</label>
                    <input type='text' placeholder='Nombre' value={form.nombre}  onChange={(e) => handleChangeNombre(e)}/>
                </div>
                <div >
                    <label>Apellido</label>
                    <input type='text' placeholder='Apellido' value={form.apellido} onChange={(e) => handleChangeApellido(e)}/>
                </div>            
                <div>
                    <label>Email</label>
                    <input type='text' placeholder='correo electronico' value={form.mail} onChange={(e) => handleChangeMail(e)}/>
                </div>
                <div>
                    <label>Alias</label>
                    <input type='text' placeholder='Como le dicen' value={form.alias} onChange={(e) => handleChangeAlias(e)}/>
                </div> 
                <input type='submit' value={form.id ? 'Guardar cambio' : 'Agregar persona'} onClick={() => addPersona(form)} />
            </form>
        </div>
    )
}
