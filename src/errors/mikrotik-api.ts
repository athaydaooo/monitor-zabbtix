import { AppError } from ".";

export const MIKROTIK_API_CONFIG_ERROR = new AppError(
  "IP address, username, and password are required.",
  400,
  "MIKROTIK_API.CONFIG_ERROR"
);

export const MIKROTIK_API_ADDRESS_REQUIRED = new AppError(
  "Destination address (dstAddress) is required.",
  400,
  "MIKROTIK_API.PING_DESTINATION_ADDRESS_REQUIRED"
);

export const MIKROTIK_API_PING_ERROR = new AppError(
  "Error trying to ping the destination address.",
  400,
  "MIKROTIK_API.PING_ERROR"
);
