import axios from "axios";

export default class UsersListServices {

  static addUser = async ( name, email, password) => {
    return axios.post('http://localhost:5000/user',  name, email, password);
  };


  static getUsers = async () => {
    return axios.get('http://localhost:5000/user/allUsers');
    
  };

  static deleteUser = async (id, name, email, password) => {
    return axios.delete(`http://localhost:5000/user/delete/${id}`);

  };

  static updateUser = async (id, name, email, password, jwt) => {
    //users->user add deatils to param
    return axios.patch(`http://localhost:5000/user/updateUser/${id}`, {name, email, password},{
      headers:{
        'Content-Type': 'application/json;charset=UTF-8',
        jwt,
      }
    })
  };

  
}
