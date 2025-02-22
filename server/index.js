/* LIBRERIAS */
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
app.use(cors());
app.use(express.json());

/*BASE DE DATOS AWS*/
const db = mysql.createConnection({
    host: "crud-empleados.ch22cmyeq634.us-east-2.rds.amazonaws.com",
    user: "adminaws",
    password: "Adm!nAnalisis4",
    database: "empleados_crud"
});

/* REGISTRAR */
app.post("/create", (req, res) => {
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;
    const puntoA = req.body.puntoA;  // Nuevo campo
    const puntoB = req.body.puntoB;  // Nuevo campo
    const distancia = req.body.distancia;  // Nuevo campo
    const tiempo = req.body.tiempo;  // Nuevo campo

    db.query('INSERT INTO empleados (nombre, edad, pais, cargo, anios, puntoA, puntoB, distancia, tiempo) VALUES(?,?,?,?,?,?,?,?,?)',
        [nombre, edad, pais, cargo, anios, puntoA, puntoB, distancia, tiempo],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("¡Empleado registrado exitosamente!");
            }
        }
    );
});

/* CONSULTAR */
app.get("/empleados", (req, res) => {
    db.query('SELECT * FROM empleados;',
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

/* ACTUALIZAR */
app.put("/update", (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const edad = req.body.edad;
    const pais = req.body.pais;
    const cargo = req.body.cargo;
    const anios = req.body.anios;
    const puntoA = req.body.puntoA;  // Nuevo campo
    const puntoB = req.body.puntoB;  // Nuevo campo
    const distancia = req.body.distancia;  // Nuevo campo
    const tiempo = req.body.tiempo;  // Nuevo campo

    db.query('UPDATE empleados SET nombre = ?, edad = ?, pais = ?, cargo = ?, anios = ?, puntoA = ?, puntoB = ?, distancia = ?, tiempo = ? WHERE id = ?',
        [nombre, edad, pais, cargo, anios, puntoA, puntoB, distancia, tiempo, id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("¡Empleado actualizado exitosamente!");
            }
        }
    );
});

/* ELIMINAR */
app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM empleados WHERE id = ?',[id],
        (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send("¡Empleado eliminado exitosamente!");
            }
        }
    );
});

// CONSULTA SOBRE CONEXIÓN A LA BASE DE DATOS
db.connect((err) => {
    if (err) {
        console.error("❌ Error al conectar a la base de datos:", err);
        return;
    }
    console.log("✅ Conexión a la base de datos MySQL exitosa!");
});

// CONSULTA SOBRE EL PUERTO QUE ESTA ESCUCHANDO
app.listen(3001, () => {
    console.log("✅ Corriendo en el puerto 3001");
});
