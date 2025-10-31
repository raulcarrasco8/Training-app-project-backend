

## 🧠 **README — BACKEND**


# 🏋️‍♂️ Training App — Backend

## 📝 Descripción

**Training App** es una API construida con **Express** y **MongoDB**, que permite gestionar usuarios, disciplinas y entrenamientos.  
Este backend se conecta con el frontend desarrollado en React para ofrecer una experiencia completa de seguimiento de entrenamientos.

> ⚠️ Este repositorio contiene el **backend (API)** del proyecto.  
> El **frontend** se encuentra en este enlace:  
> 👉 [Training App Frontend] https://github.com/raulcarrasco8/Training-app-project-frontend

---

## ⚙️ Tecnologías utilizadas

- Express.js  
- MongoDB + Mongoose  
- Node.js  
- Render (para despliegue)  
- Postman (para pruebas de API)

---

## 🚀 Instrucciones para ejecutar el proyecto localmente

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/raulcarrasco8/Training-app-project-backend

2. **Instalar dependencias**

    npm install

3. **Configurar variables de entorno**

    Crea un archivo .env en la raíz del proyecto con las siguientes variables:
        PORT=5005
        ORIGIN=http://localhost:5173
        MONGODB_URI=tu_uri_de_mongoatlas

    💡 Para conectar con MongoDB Atlas, debes crear una cuenta en https://www.mongodb.com/atlas
        , crear una base de datos y obtener tu URI de conexión.

4. **Ejecutar el servidor**

    npm run dev
    El backend se ejecutará por defecto en:
    http://localhost:5005

## 🌐 Demo

Backend desplegado en Render:
👉 https://training-app-project-backend.onrender.com

Frontend desplegado en Vercel:
👉 https://app-training.vercel.app/

## 📚 Endpoints principales

## 🔐 Autenticación

Método	Endpoint	Descripción

POST	/auth/signup	Registrar nuevo usuario
POST	/auth/login	Iniciar sesión
GET	/auth/verify	Verificar token de autenticación

## 🏁 Disciplinas

Método	Endpoint	Descripción

POST	/api/disciplines	Crear nueva disciplina
GET	/api/disciplines	Obtener todas las disciplinas
DELETE	/api/disciplines/:disciplineId	Eliminar una disciplina

## 💪 Entrenamientos

Método	Endpoint	Descripción

POST	/api/workouts	Crear un nuevo entrenamiento
GET	/api/workouts	Obtener todos los entrenamientos
GET	/api/workouts/:workoutId	Obtener un entrenamiento por ID
PUT	/api/workouts/:workoutId	Editar un entrenamiento existente
DELETE	/api/workouts/:workoutId	Eliminar un entrenamiento

## 📂 Estructura básica del proyecto

src/
 ├── config/
 ├── db/
 ├── error-handling/
 ├── middlewares/
 ├── models/
 ├── node_modules/
 ├── routes/
 ├── app.js
 └── server.js


## 👨‍💻 Autor

Proyecto desarrollado por Raúl Carrasco.