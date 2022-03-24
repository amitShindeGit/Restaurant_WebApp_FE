import * as React from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

export default function ReadOnlyRating({ value, read, name, setRestaurantsList, onChangeValue }) {
  //   const [value, setValue] = React.useState(3.5);
  //TOdo do this inplace controlled and readonly...

  const lowestRatingChangeHandler = (event) => {
    setRestaurantsList((prevState) => {
      const arr = prevState.map((restaurant) => {
        if (restaurant.id === event.target.name) {
          return {
            ...restaurant,
            lowestRatingDetails: {
              ...restaurant.lowestRatingDetails,
              lowestRating: event.target.value,
            },
          };
        } else {
          return { ...restaurant };
        }
      });
      return arr;
    });
  };

  return (
    <Box>
      <Rating precision={0.5} name={name} onChange={onChangeValue}  value={value} readOnly={read} />
    </Box>
  );
}
