import { BrowserRouter as Router, Route } from 'react-router-dom'
import FormularioLibro from './Libros/FormularioLibro';
import Libros from './Libros/Libros'
import Personas from './Personas/Personas'
import FormularioPersona from './Personas/FormularioPersona';
import Categorias from './Categorias/Categorias'
import FormularioCategoria from './Categorias/FormularioCategoria';
import Header from './components/Header'
import './App.css'
import CategoriasLibrosAsosciados from './Categorias/CategoriasLibrosAsosciados';
import PersonaLibrosAsosciados from './Personas/PersonaLibrosAsosciados';



function App() {

  return (         
    <div >      
      <Router>
        <Header />
        <Route exact path="/libro" component={Libros} />
        <Route exact path={"/libro/editar/:id"} component={FormularioLibro} />
        <Route exact path="/persona" component={Personas} />
        <Route exact path={"/persona/editar/:id"} component={FormularioPersona} />
        <Route exact path={"/persona/libros/:id"} component={PersonaLibrosAsosciados} />
        <Route exact path="/categoria" component={Categorias} />
        <Route exact path={"/categoria/editar/:id"} component={FormularioCategoria} />
        <Route exact path={"/categoria/libros/:id"} component={CategoriasLibrosAsosciados} />
      </Router>
    </div>
  );
}

export default App;
