import axios from "axios";

export default class ReviewService {


  static updateReviews = async (id, rating, comment, dateOfVisit, jwt) => {
    return axios.patch(`http://localhost:5000/review/${id}`, {id, rating, comment, dateOfVisit}, {
      headers : {
        'Content-Type': 'application/json;charset=UTF-8',
        jwt,
      }
    });
  }

  static addReview = async (id, rating, comment, jwt) => {
    return axios.post(`http://localhost:5000/restaurants/review/${id}`, { rating, comment}, {
      headers : {
        'Content-Type': 'application/json;charset=UTF-8',
        jwt,
      }
    });
  }

  static deleteReview = async(reviewId, jwt) => {
    return axios.delete(`http://localhost:5000/review/${reviewId}`,{
    headers : {
      'Content-Type': 'application/json;charset=UTF-8',
      jwt,
    }
  });
}


}
