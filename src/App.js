// Agregamos react
import React, { useState } from 'react';

// Una vez agregado "lodash", lo importamos
// yarn add lodash
import { isEmpty } from 'lodash';

// Vamos a importar una librería para generar ID únicos
// yarn add shortid
import shortid from 'shortid';

// Importamos el hook de estado "useState", sirve para manejar datos.

function App() {
   // Utilizamos el hook
   // Deconstruimos, y le colocamos de nombre task y setTask (se puede cualquier nombre)
   // Lo iniciamos como null o "" porque iniciamos sin tareas.
   const [task, setTask] = useState('');

   // Vamos a colocar un arreglo de tareas
   const [tasks, setTasks] = useState([]);

   // Método para agregar el método
   const addTask = (e) => {
      e.preventDefault(); // Evitamos que se recargue la página

      // Abrimos una terminal en vsc y agregamos la siguiente librerías
      // OJO, NAVEGAR HASTA EL PROYECTO EN LA CONSOLA
      // yarn add lodash
      // Con esta librería ya podemos validar:
      if (isEmpty(task)) {
         console.log('Task empty');
         return;
      }

      console.log('Ok');

      // Creamos un objeto con su id y su tarea
      const newTask = {
         id: shortid.generate(),
         name: task,
      };

      // Con spred operator:
      setTasks([...tasks, newTask]);
      // Probar:
      // setTask.push(newTask);

      console.log(setTask());
      setTask(''); // Limpiamos el textField
   };

   return (
      // Colocamos className porque esto es React y no HTML 5
      <div className="container mt-5">
         <h1>Tareas</h1>
         <hr />

         <div className="row">
            {/* LISTA DE TAREAS: Columna de 8 */}
            <div className="col-8">
               <h4 className="text-center">Lista de tareas</h4>

               <ul className="list-group">
                  {/* Las llaves significa que vamos agregar código js: */}
                  {tasks.map((task) => (
                     <li className="list-group-item" key={task.id}>
                        <span className="lead">{task.name}</span>
                        <button className="btn btn-danger btn-sm float-right mx-2">Eliminar</button>
                        <button className="btn btn-warning btn-sm float-right">Editar</button>
                     </li>
                  ))}
               </ul>
            </div>

            {/* FORMULARIO: Columna de 4 para completar las 12 */}
            <div className="col-4">
               <h4 className="text-center">Formulario</h4>

               {/* Colocamos "addTask" porque el método no lleva parámetros y podemos hacerlo así */}
               <form onSubmit={addTask}>
                  {/* Con "onChange" capturamos el dato y con "value" lo leyemos */}
                  <input
                     type="text"
                     className="form-control mb-2"
                     placeholder="Ingrese la tarea..."
                     onChange={(text) => setTask(text.target.value)}
                     value={task}
                  ></input>
                  <button type="submit" className="btn btn-dark btn-block">
                     Agregar
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default App;
