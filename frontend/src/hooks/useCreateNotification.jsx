import { useState } from "react";
import axios from "axios";

const useCreateNotification = () => {

  const createNotification = async ({ role, type, message, rf_id }) => {

    try {
      const response = await axios.post("http://localhost:4000/api/notification/create", {
        role,
        type,
        message,
        rf_id,
      });
      return response.data; 
    } catch (err) {
      console.error(
        "Error creating notification:",
        err.response?.data || err.message
      );
    }
  };

  return { createNotification };
};

export default useCreateNotification;
