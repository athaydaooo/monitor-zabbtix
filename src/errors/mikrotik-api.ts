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

export const getPingError = (address: string, dstAddress: string): AppError => {
  return new AppError(
    `Error trying to ping ${dstAddress} from ${address}.`,
    500,
    "MIKROTIK_API.PING_ERROR"
  );
};

export const getResourceError = (address: string): AppError => {
  return new AppError(
    `Error trying to get resource data from ${address}.`,
    500,
    "MIKROTIK_API.RESOURCE_ERROR"
  );
};

export const getIdentityError = (address: string): AppError => {
  return new AppError(
    `Error trying to get Mikrotik Identity of ${address}.`,
    500,
    "MIKROTIK_API.IDENTITY_ERROR"
  );
};

export const getInterfacesError = (address: string): AppError => {
  return new AppError(
    `Error trying to get Mikrotik interfaces from ${address}.`,
    500,
    "MIKROTIK_API.INTERFACES_ERROR"
  );
};
