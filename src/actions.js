import { firebaseApp } from './firebase';
import firebase from 'firebase';
require('firebase/firestore');
// import 'firebase/firestore';

// Con esto ya tendremos acceso a nuestra base de datos. Es como crear una conexión.
const db = firebase.firestore(firebaseApp);

// Recibe como parámetro la el nombre de la colección que tengamos en firebase.
export const getCollection = async (collection) => {
   // Inicializamos el objeto en caso de que falle
   const result = { statusResponse: false, data: null, error: null };
   try {
      // Si lo puede hacer, obtenemos los datos
      const data = await db.collection(collection).get(); // Get para consultar

      // Mapeamos el resultado.
      const arrayData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      result.statusResponse = true; // Pudo traer la info, entonces ponemos true
      result.data = arrayData; // Ingresamos la info
   } catch (error) {
      result.error = error;
   }

   return result;
};

// Esto nos permite agregar tareas. Recibimos el nombre de la colección y el dato.
export const addDocument = async (collection, data) => {
   const result = { statusReponse: false, data: null, error: null };
   try {
      const response = await db.collection(collection).add(data); // Add para agregar

      result.data = { id: response.id };
      result.statusResponse = true;
   } catch (error) {
      result.error = error;
   }

   return result;
};

// Solo consulta un dato
export const getDocument = async (collection, id) => {
   const result = { statusResponse: false, data: null, error: null };
   try {
      const response = await db.collection(collection).doc(id).get(); // Consultamos de acuerdo al id

      result.data = { id: response.id, ...response.data() };
      result.statusResponse = true;
   } catch (error) {
      result.error = error;
   }

   return result;
};

// Nos permite actualizar un dato
export const updateDocument = async (collection, id, data) => {
   const result = { statusResponse: false, error: null };
   try {
      await db.collection(collection).doc(id).update(data); // Buscamos de acuerdo al id, y actualizamos el data

      result.statusResponse = true;
   } catch (error) {
      result.error = error;
   }

   return result;
};

// Método para eliminar un dato
export const deleteDocument = async (collection, id) => {
   const result = { statusReponse: false, error: null };
   try {
      await db.collection(collection).doc(id).delete(); // Elimina la tarea.

      result.statusResponse = true;
   } catch (error) {
      result.error = error;
   }

   return result;
};
