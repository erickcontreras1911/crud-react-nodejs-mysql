import './App.css';
import { useState } from "react";
import Axios from "axios";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faEdit, faTrash, faBan } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

//HOLA MUX

function App() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState();
  const [pais, setPais] = useState("");
  const [cargo, setCargo] = useState("");
  const [anios, setAnios] = useState();
  const [puntoA, setPuntoA] = useState(""); // Nuevo campo
  const [puntoB, setPuntoB] = useState(""); // Nuevo campo
  const [distancia, setDistancia] = useState(""); // Nuevo campo
  const [tiempo, setTiempo] = useState(""); // Nuevo campo
  const [id, setId] = useState();
  const [editar, setEditar] = useState(false);
  const [empleadosList, setEmpleados] = useState([]);

  useEffect(() => {
    getEmpleados();
  }, []);

  const add = () => {
    Axios.post("http://localhost:3001/create", {
      nombre,
      edad,
      pais,
      cargo,
      anios,
      puntoA, 
      puntoB,
      distancia,
      tiempo
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "Registro exitoso",
        html: "El usuario <strong>" + nombre + "</strong> fue registrado correctamente",
        icon: "success",
        draggable: true,
        timer: 5000
      });
    }).catch(function (error) {
      Swal.fire({
        title: "Lo sentimos",
        html: "El no se ha podido registrar correctamente el usuario",
        icon: "error",
        timer: 5000,
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Desconexión en el servidor - Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  }

  const update = () => {
    Axios.put("http://localhost:3001/update", {
      nombre,
      edad,
      pais,
      cargo,
      anios,
      puntoA, 
      puntoB,
      distancia,
      tiempo,
      id,
    }).then(() => {
      getEmpleados();
      limpiarCampos();
      Swal.fire({
        title: "Actualización exitosa",
        html: "El usuario <strong>" + nombre + "</strong> fue actualizado correctamente",
        icon: "success",
        draggable: true,
        timer: 5000
      });
    }).catch(function (error) {
      Swal.fire({
        title: "Lo sentimos",
        html: "El no se ha podido actualizar",
        icon: "error",
        timer: 5000,
        footer: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Desconexión en el servidor - Intente mas tarde" : JSON.parse(JSON.stringify(error)).message
      });
    });
  }

  const eliminar = (val) => {
    Swal.fire({
      title: "Confirmación Eliminación",
      html: "¿Seguro que desea eliminar el usuario <strong>" + val.nombre + "</strong>?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#328754",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id}`).then(() => {
          getEmpleados();
          limpiarCampos();
          Swal.fire({
            title: "Registro Eliminado",
            html: "El usuario <strong>" + val.nombre + " </strong> se eliminó correctamente",
            icon: "success",
            timer: 5000
          });
        }).catch(function (error) {
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

  const limpiarCampos = () => {
    setNombre("");
    setEdad("");
    setPais("");
    setCargo("");
    setAnios("");
    setPuntoA(""); // Limpiando nuevos campos
    setPuntoB(""); // Limpiando nuevos campos
    setDistancia(""); // Limpiando nuevos campos
    setTiempo(""); // Limpiando nuevos campos
    setEditar(false);
  }

  const getEmpleados = () => {
    Axios.get("http://localhost:3001/empleados").then((response) => {
      setEmpleados(response.data);
    });
  }


  const editarEmpleado = (val) => {
    setEditar(true);
    setNombre(val.nombre);
    setEdad(val.edad);
    setPais(val.pais);
    setCargo(val.cargo);
    setAnios(val.anios);
    setPuntoA(val.puntoA); 
    setPuntoB(val.puntoB); 
    setDistancia(val.distancia); 
    setTiempo(val.tiempo); 
    setId(val.id);
  }

  //FUNCIONES PARA EL MAPA
  const [map, setMap] = useState(false);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  useEffect(() => {
    initMap();
  }, []);

  const initMap = () => {
    const centro = { lat: 14.504039274759423, lng: -90.61420438463328 };  
    const googleMap = new window.google.maps.Map(document.getElementById("map"), {
      center: centro,
      zoom: 12,
    });

    const service = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer();
    renderer.setMap(googleMap);

    setMap(googleMap);
    setDirectionsService(service);
    setDirectionsRenderer(renderer);
  };

  // Ejemplo de uso de map más adelante
  useEffect(() => {
    if (map) {
      // Aquí podrías usar la referencia del mapa para algo, por ejemplo:
      console.log('Mapa inicializado', map);
    }
  }, [map]);

  const calcularRuta = () => {
    const origen = puntoA;
    const destino = puntoB;

    if (!origen || !destino) {
      alert("Por favor, ingresa tanto el origen como el destino.");
      return;
    }

    const request = {
      origin: origen,
      destination: destino,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        const distancia = result.routes[0].legs[0].distance.text;
        const tiempo = result.routes[0].legs[0].duration.text;
        setDistancia(distancia);
        setTiempo(tiempo);
      } else {
        alert("No se pudo calcular la ruta. Intenta de nuevo.");
      }
    });
  };


  return (
    <div className='container'>
      <br />
      <h1 className='text-center'>CRUD NodeJS + React + MySQL</h1>
      <h1 className='text-center text-success'>ERICK CONTRERAS</h1>
      <h1 className='text-center text-danger'>CRISTIAN BERNAL</h1>
      <br />
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
              type="text" className="form-control" value={nombre} placeholder="Juan Perez" aria-label="Nombre" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Edad:</span>
            <input
              onChange={(event) => {
                setEdad(event.target.value);
              }}
              type="number" value={edad} className="form-control" placeholder="10" aria-label="Edad" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">País:</span>
            <input
              onChange={(event) => {
                setPais(event.target.value);
              }}
              type="text" value={pais} className="form-control" placeholder="Guatemala" aria-label="Pais" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Cargo:</span>
            <input
              onChange={(event) => {
                setCargo(event.target.value);
              }}
              type="text" value={cargo} className="form-control" placeholder="Gerente" aria-label="Cargo" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Años Experiencia:</span>
            <input
              onChange={(event) => {
                setAnios(event.target.value);
              }}
              type="number" value={anios} className="form-control" placeholder="5" aria-label="Años Experiencia" aria-describedby="basic-addon1" />
          </div>


          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Punto A:</span>
            <input
              onChange={(event) => {
                setPuntoA(event.target.value);
              }}
              type="text" value={puntoA} className="form-control" placeholder="Punto A" aria-label="Punto A" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group">
            <span className="input-group-text" id="basic-addon1">Punto B:</span>
            <input
              onChange={(event) => {
                setPuntoB(event.target.value);
              }}
              type="text" value={puntoB} className="form-control" placeholder="Punto B" aria-label="Punto B" aria-describedby="basic-addon1" />
          </div>

          <button className="btn btn-primary m-3" onClick={calcularRuta}>
            Calcular Ruta
          </button>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Distancia:</span>
            <input
              onChange={(event) => {
                setDistancia(event.target.value);
              }}
              type="text" value={distancia} className="form-control" placeholder="Distancia" aria-label="Distancia" aria-describedby="basic-addon1" />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">Tiempo:</span>
            <input
              onChange={(event) => {
                setTiempo(event.target.value);
              }}
              type="text" value={tiempo} className="form-control" placeholder="Tiempo" aria-label="Tiempo" aria-describedby="basic-addon1" />
          </div>
          <br/>
         
          <div id="map" style={{ height: '400px', width: '100%' }}></div>
          
          
        </div>
        <div className="card-footer text-muted">
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
      <br />
      <hr />
      <br />
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
                <th scope="col">Punto A</th>
                <th scope="col">Punto B</th>
                <th scope="col">Distancia</th>
                <th scope="col">Tiempo</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleadosList.map((val, key) => {
                return (
                  <tr key={key}>
                    <th scope="row">{key + 1}</th>
                    <td>{val.nombre}</td>
                    <td>{val.edad}</td>
                    <td>{val.pais}</td>
                    <td>{val.cargo}</td>
                    <td>{val.anios}</td>
                    <td>{val.puntoA}</td>
                    <td>{val.puntoB}</td>
                    <td>{val.distancia}</td>
                    <td>{val.tiempo}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() => editarEmpleado(val)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-danger" onClick={() => eliminar(val)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
