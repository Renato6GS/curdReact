// Agregamos react
// Agregamos useState, y useEffect. Este último es más para firebase
import React, { useState, useEffect } from 'react';

// Una vez agregado "lodash", lo importamos
// yarn add lodash
import { isEmpty, size, sortBy } from 'lodash';

// Vamos a importar una librería para generar ID únicos. YA NO LO VAMOS A UTILIZAR PORQUE FIREBASE GENERA UNO
// yarn add shortid
import shortid from 'shortid';
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';

// Importamos el hook de estado "useState", sirve para manejar datos.

// IMPORTAMOS FIRBASE, CON: yarn add firebase@~7.9.0

function App() {
   // Utilizamos el hook
   // Deconstruimos, y le colocamos de nombre task y setTask (se puede cualquier nombre)
   // Lo iniciamos como null o "" porque iniciamos sin tareas.
   const [task, setTask] = useState('');

   // Vamos a colocar un arreglo de tareas
   const [tasks, setTasks] = useState([]);

   // Un nuevo estado. Iniciamos el modo edición en false
   const [editMode, setEditMode] = useState(false);
   const [id, setId] = useState(''); // Y guardamos el id de la tarea editada

   const [error, setError] = useState(null);

   // Este método se va a ejecutar cuando la página cargue
   // Va a traes los datos alojados en firebase
   useEffect(() => {
      (async () => {
         const result = await getCollection('tasks'); // Agregamos el nombre de la colección para consultar en firebase

         // Si fue exitosa la operación, retornará true
         if (result.statusResponse) {
            setTasks(sortBy(result.data, ['name'])); // Insertamos los datos consultados en pantalla, además ordenamos con lodash
         }
      })();
   }, []);

   const validarForm = () => {
      let isValid = true;
      setError(null);
      // Abrimos una terminal en vsc y agregamos la siguiente librerías
      // OJO, NAVEGAR HASTA EL PROYECTO EN LA CONSOLA
      // yarn add lodash
      // Con esta librería ya podemos validar:
      if (isEmpty(task)) {
         setError('Debes de ingresar una tarea.');
         isValid = false;
      }
      return isValid;
   };

   // Método para agregar el método
   const addTask = async (e) => {
      e.preventDefault(); // Evitamos que se recargue la página

      if (!validarForm()) return;

      // ESTO YA ES CON FIREBASE: Consultamos el id
      const result = await addDocument("tasks", {name: task}); // Le pasamos el nombre de la colección.

      if(result.statusReponse){
         setError(result.error);
         return;
      }

      const newTask = {id: result.data.id, name: task}; // Con firebase

      // Creamos un objeto con su id y su tarea, pero esto no va con firebase
      // const newTask = {
      //    id: shortid.generate(),
      //    name: task,
      // };

      // Con spred operator:
      // setTasks guarda las lista de tareas en tasks. También se podría hacer con tasks.push(newTask)
      // Pero es mejor manejarlo con el setter
      setTasks([...tasks, newTask]);

      console.log(setTask());
      setTask(''); // Limpiamos el textField
   };

   // Será llamado cuando se presione el botón "Eliminar"
   const deleteTask = async (id) => {

      if(!(window.confirm("Are you sure to delete this task?"))) return;

      const result = await deleteDocument("tasks", id); // Eliminamos en firebase
      if(!result.statusResponse){
         setError(result.error);
         return;
      }

      // La vamos a eliminar con el método filter. Dejará de lado aquella en donde el id coincida
      const filteredTasks = tasks.filter((task) => task.id !== id);
      setTasks(filteredTasks);
   };

   // Este método será llamado cuando presione el botón "Editar"
   const editTask = (theTask) => {
      setTask(theTask.name);
      setEditMode(true); // Colocamos el modo edit.
      // editMode ? setEditMode(false) : setEditMode(true);
      setId(theTask.id); // Guardamos el id porque se pierde tras editarlo.
   };

   // Este método será llamado cuando tras darle al botón "Guardar" en el formulario
   const saveTask = async(e) => {
      e.preventDefault();
      if (!validarForm()) return;

      const result = await updateDocument("tasks", id, {name: task}); // Actualizamos en firebase
      if(!result.statusResponse){
         setError(result.error);
         return;
      }

      const editedTask = tasks.map((item) => (item.id === id ? { id, name: task } : item));
      setTasks(editedTask);
      setEditMode(false);
      setTask('');
      setId('');
   };

   return (
      // Colocamos className porque esto es React y no HTML 5
      <div className="container mt-5">
         <h1>Tareas</h1>
         <hr />

         <div className="row">
            {/* LISTA DE TAREAS: Columna de 8 */}
            <div className="col-md-8 col-sm-12">
               <h4 className="text-center">Lista de tareas</h4>
               {/* size es un método de lodash */}
               {size(tasks) === 0 ? (
                  <h5 className="text-center">No hay tareas por mostrar.</h5>
               ) : (
                  <ul className="list-group">
                     {/* Las llaves significa que vamos agregar código js: */}
                     {tasks.map((task) => (
                        <li className="list-group-item" key={task.id}>
                           <span className="lead">{task.name}</span>
                           {/* Con el evento onClick, agregamos la función */}
                           <button
                              className="btn btn-danger btn-sm float-right mx-2"
                              onClick={() => deleteTask(task.id)}
                           >
                              Eliminar
                           </button>
                           <button className="btn btn-warning btn-sm float-right" onClick={() => editTask(task)}>
                              Editar
                           </button>
                        </li>
                     ))}
                  </ul>
               )}
            </div>

            {/* FORMULARIO: Columna de 4 para completar las 12 */}
            <div className="col-sm-12 col-md-4">
               <h4 className="text-center">{editMode ? 'Modificar tarea' : 'Agregar tarea'}</h4>

               {/* Colocamos "addTask" porque el método no lleva parámetros y podemos hacerlo así */}
               <form onSubmit={editMode ? saveTask : addTask}>
                  {/* Con "onChange" capturamos el dato y con "value" lo leyemos */}
                  <input
                     type="text"
                     className="form-control mb-2"
                     placeholder="Ingrese la tarea..."
                     onChange={(text) => setTask(text.target.value)}
                     value={task}
                  ></input>
                  {error && <span className="text-danger mb-2">{error}</span>}
                  <button type="submit" className={editMode ? 'btn btn-warning btn-block' : 'btn btn-dark btn-block'}>
                     {editMode ? 'Guardar' : 'Agregar'}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}

export default App;
