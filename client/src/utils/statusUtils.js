export const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 2,
};
export const getStatusText = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "Active";
    case USER_STATUS.INACTIVE:
      return "Inactive";
    default:
      return "Unknown";
  }
};
export const getStatusTextLower = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "active";
    case USER_STATUS.INACTIVE:
      return "inactive";
    default:
      return "unknown";
  }
};
export const getStatusNumber = (statusText) => {
  switch (statusText.toLowerCase()) {
    case "active":
      return USER_STATUS.ACTIVE;
    case "inactive":
      return USER_STATUS.INACTIVE;
    default:
      return USER_STATUS.ACTIVE;
  }
};
export const getStatusColor = (status) => {
  switch (status) {
    case USER_STATUS.ACTIVE:
      return "text-green-600 bg-green-100";
    case USER_STATUS.INACTIVE:
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};
export const isUserActive = (status) => {
  return status === USER_STATUS.ACTIVE;
};
