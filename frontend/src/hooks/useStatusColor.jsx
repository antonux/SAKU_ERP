const useStatusColor = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-400";
      case "approved":
        return "text-green-400";
      case "cancelled":
        return "text-red-500";
      case "to be received":
        return "text-blue-500";
      case "partially delivered":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "received":
        return "text-blue-500";
      default:
        return "";
    }
  }
    return {getStatusColor};
  };

  export default useStatusColor;
