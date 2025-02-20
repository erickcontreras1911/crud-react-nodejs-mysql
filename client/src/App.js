import './App.css';
import { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faEdit, faTrash, faBan } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';


function App() {

  //USE STATE QUE HACE LOS ELEMENTOS SE ACTUALICEN DE INMEDIATO CON REACT
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [id, setId] = useState();

  const [editar, setEditar] = useState(false);

  const [empleadosList,setEmpleados] = useState([]);

  //OBTIENE LOS EMPLEADOS SIEMPRE QUE SE CARGA LA APP
  useEffect(() => {
    getEmpleados();
  }, []);


  //FUNCION QUE REGISTRA UN NUEVO USUARIO
  const add = () =>{
    Axios.post("http://localhost:3001/create",{
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios
    }).then(()=>{
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "Registro exitoso",
        html: "El usuario <strong>"+nombre+"</strong> fue registrado correctamente",
        icon: "success",
        draggable: true,
        timer: 5000
      });
    }).catch(function(error){
      Swal.fire({
        title: "Lo sentimos",
        html: "El no se ha podido registrar correctamente el usuario",
        icon: "error",
        timer: 5000,
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Desconexión en el servidor - Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });;

  }

   //FUNCIÓN QUE EDITA O ACTUALIZA UN EMPLEADO
   const update = () =>{
    Axios.put("http://localhost:3001/update",{
      nombre: nombre,
      edad: edad,
      pais: pais,
      cargo: cargo,
      anios: anios,
      id: id,
    }).then(()=>{
      getEmpleados();
      limpiarCampos();

      Swal.fire({
        title: "Actualización exitosa",
        html: "El usuario <strong>"+nombre+"</strong> fue actualizado correctamente",
        icon: "success",
        draggable: true,
        timer: 5000
      })

    }).catch(function(error){
          Swal.fire({
            title: "Lo sentimos",
            html: "El no se ha podido actualizar",
            icon: "error",
            timer: 5000,
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Desconexión en el servidor - Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
          });
        });

  }

  //FUNCIÓN QUE ELIMINA UN EMPLEADO
  const eliminar = (val) =>{

    Swal.fire({
      title: "Confirmación Eliminación",
      html: "¿Seguro que desea eliminar el usuario <strong>"+val.nombre+"</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#328754",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        //USUARIO CONFIRMA QUE SI DESEA ELIMINAR
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(()=>{
          getEmpleados();
          limpiarCampos();

          Swal.fire({
            title: "Registro Eliminado",
            html: "El usuario <strong>" + val.nombre + " </strong> se eliminó correctamente",
            icon: "success",
            timer: 5000
          });
        }).catch(function(error){
          Swal.fire({
            title: "Lo sentimos",
            html: "El usuario <strong>" + val.nombre + " </strong> no se ha podido eliminar",
            icon: "error",
            timer: 5000,
            footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Desconexión en el servidor - Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
          });
        });
      }
    });

  }

  //FUNCIÓN PARA CANCELAR
  const limpiarCampos = () =>{
      setNombre("");
      setEdad("");
      setPais("");
      setCargo("");
      setAnios("");
      setEditar(false);
  }

  //FUNCIÓN QUE MUESTRA LOS EMPLEADOS
  const getEmpleados = () =>{
    Axios.get("http://localhost:3001/empleados").then((response)=>{
      setEmpleados(response.data);
    });

  }

  //FUNCIÓN PARA TOMAR VALORES EN LOS INPUT PARA EDITAR
  const editarEmpleado = (val) =>{
    setEditar(true);

    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setId(val.id);
    
  }

  //HTML QUE RETORNA LA VISTA
  return (
    <div className='container'>
      <br/>
      <h1 className='text-center'>CRUD NodeJS + React + MySQL</h1>
      <br/>
      <div className="card text-center">
        <div className="card-header">
          <h4>Gestión de Empleados</h4>
        </div>
        <div className="card-body">
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Nombre:</span>
            <input 
            onChange={(event) => {
              setNombre(event.target.value);
            }}
            type="text" className="form-control" value={nombre} placeholder="Juan Perez" aria-label="Nombre" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input 
            onChange={(event) => {
              setEdad(event.target.value);
            }}
            type="number" value={edad} className="form-control" placeholder="10" aria-label="Edad" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">País:</span>
            <input 
            onChange={(event) => {
              setPais(event.target.value);
            }}
            type="text" value={pais} className="form-control" placeholder="Guatemala" aria-label="Pais" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input 
            onChange={(event) => {
              setCargo(event.target.value);
            }}
            type="text" value={cargo} className="form-control" placeholder="Gerente" aria-label="Cargo" aria-describedby="basic-addon1"/>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años Experiencia:</span>
            <input 
            onChange={(event) => {
              setAnios(event.target.value);
            }}
            type="number" value={anios} className="form-control" placeholder="5" aria-label="Años Experiencia" aria-describedby="basic-addon1"/>
          </div>
        </div>
        <div class="card-footer text-muted">
          {
            editar === true ?

              <div>
                  <button className="btn btn-warning" onClick={update}>
                    <FontAwesomeIcon icon={faEdit} /> Actualizar
                  </button>

                  <button className="btn btn-danger btn-derecha" onClick={limpiarCampos}>
                    <FontAwesomeIcon icon={faBan} /> Cancelar
                  </button>
              </div>
              :
              <button className="btn btn-success" onClick={add}>
                <FontAwesomeIcon icon={faUserPlus} /> Agregar Usuario
              </button>
          }
          
        </div>
      </div>
      <br/>
      <hr/>
      <br/>
      <div className="card text-center">
        <div className="card-header">
          <h4>Empleados Registrados</h4>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">País</th>
              <th scope="col">Cargo</th>
              <th scope="col">Años Experiencia</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              empleadosList.map((val, key)=>{
                return <tr key={val.id}>
                          <th scope="row">{val.id}</th>
                          <td>{val.nombre}</td>
                          <td>{val.edad}</td>
                          <td>{val.pais}</td>
                          <td>{val.cargo}</td>
                          <td>{val.anios}</td>
                          <td>
                            <div class="btn-group" role="group" aria-label="Basic example">
                              <button onClick={()=>{
                                  editarEmpleado(val);
                              }} type="button" className="btn btn-warning"><FontAwesomeIcon icon={faEdit} /></button>
                              
                              <button onClick={()=>{
                                  eliminar(val);
                              }}
                              type="button" className="btn btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                            </div>

                          </td>
                        </tr>
              })
            }

            
          </tbody>
        </table>
        </div>
        <div className="card-footer text-muted">
          <label>Prueba React + NodeJS + MySQL - Erick Contreras</label>
        </div>
      </div>
    </div>
  );
}

export default App;
