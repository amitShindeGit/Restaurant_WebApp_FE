import * as Faker from "faker";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default class RestaurantList {
  // static fetchRestaurants = async (pageNumber) => {
  //   //todo add page
  //   const restaurants = [];
  //   for (let i = 0; i < 30; i++) {
  //     let hr = Math.floor(Math.random() * 3) + 3;
  //     let lr = Math.floor(Math.random() * 3) + 1;
  //     const restaurant = {
  //       //todo add review details like review, userid, username, date. for all 3
  //       //handle case when restraunt is newly created ie. it has no review.. UI ......
  //       id: uuidv4(),
  //       title: Faker.company.companyName(),
  //       description: Faker.company.catchPhrase(),
  //       location: Faker.address.country(),
  //       highestRatingDetails: {
  //         highestRating: hr,
  //         reviewerName: "Rohit Kumar",
  //         review:
  //           " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco labor nisi ut aliquip ex ea commodo consequat.",
  //         date: "12/01/2022",
  //       },
  //       lowestRatingDetails: {
  //         lowestRating: lr,
  //         reviewerName: "Sumit Singh",
  //         review:
  //           " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco labor nisi ut aliquip ex ea commodo consequat.",
  //         date: "14/08/2022",
  //       },
  //       latestRatingDetails: {
  //         latestRating: Math.floor(Math.random() * (hr - lr)) + lr,
  //         reviewerName: "Mahesh Gupta",
  //         review:
  //           " Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore magna aliqua. Utenim ad minim veniam, quis nostrud exercitation ullamco labor nisi ut aliquip ex ea commodo consequat.",
  //         date: "24/03/2022",
  //       },
  //     };
  //     restaurants.push(restaurant);
  //   }

  //   return restaurants;
  // };

  static fetchRestaurants = async (pageNumber) => {
    return axios.get('http://localhost:5000/restaurants');
  }

  // static deleteRestaurant = async (id) => {
  //   //todo: use this format for BE response.. show Toast on FE accordingly, Apply Reload logic acc.

  //   return {
  //     data: {
  //       message: "Delete Successful",
  //     },
  //   };

  // };

  static deleteRestaurant = async (id) => {
    return axios.delete(`http://localhost:5000/restaurants/${id}`);
  }


  // static updateRestaurant = async (id, updatedDetails) => {
  //   //TOOD:
  //   return {
  //     data: {
  //       message: "Update Restaurant Successful",
  //     },
  //     updateRestaurantDetails: updatedDetails,
  //   };
  // };

  static updateRestaurant = async (id, updatedDetails) => {
    return axios.patch(`http://localhost:5000/restaurants/${id}`,  updatedDetails);
  }

  // static addNewRestaurant = async (newRestaurant) => {
  //   return {
  //     data: {
  //       message: "Add new restaurant Successful",
  //     },
  //     restaurantDetails: newRestaurant,
  //   };
  // };

  static addNewRestaurant = async (title, description, location, jwt) => {
    return axios.post('http://localhost:5000/restaurants',  {title, description, location}, {
      headers : {
        'Content-Type': 'application/json;charset=UTF-8',
        jwt,
      }
    });
  }

  // static addRestaurant = async ({ name, description }, { jwt }) => {
  //   return Axios.post(
  //     `${API_URL}/res`,
  //     { name, description },
  //     { headers: { jwt } }
  //   );
  // };


  static getRestaurantDetails = async (restaurantId) => {
    return axios.get(`http://localhost:5000/restaurants/${restaurantId}`);
  };

  
}
