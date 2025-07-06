export interface User {
  email: string;
  password: string;
}


export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  rol: string;
  imageURL: string;
}