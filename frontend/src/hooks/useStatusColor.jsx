const useStatusColor = () => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "text-green-500 font-semibold";
      case "unavailable":
        return "text-red-500 font-semibold";
      case "pending":
        return "text-orange-400 font-semibold";
      case "approved":
        return "text-green-400 font-semibold";
      case "cancelled":
        return "text-red-500 font-semibold";
      case "to be received":
        return "text-blue-500 font-semibold";
      case "partially delivered":
        return "text-blue-500 font-semibold";
      case "delivered":
        return "text-blue-600 font-semibold";
      case "completed":
        return "text-green-500 font-semibold";
      case "received DR":
        return "text-orange-400 font-semibold";
      case "unchecked":
        return "text-red-400 font-semibold";
      case "checked":
        return "text-green-400 font-semibold";
      case "redeliver":
        return "text-orange-400 font-semibold";
      case "partial":
        return "text-orange-400 font-semibold";
      case "partially received":
        return "text-blue-500 font-semibold";
      case "complete":
        return "text-green-500 font-semibold";
      case "in stock":
        return "text-green-500 font-semibold";
      case "low stock":
        return "text-orange-500 font-semibold";
      case "out of stock":
        return "text-red-500 font-semibold";
      default:
        return "font-semibold"; 
    }
  };
  
  return { getStatusColor };
};

export default useStatusColor;
