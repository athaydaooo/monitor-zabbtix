import { AppError } from ".";

export const GET_SHEET_DATA_ERROR = new AppError(
  "Could not get data from sheet.",
  500,
  "GET_SHEET_DATA.INTERNAL_ERROR"
);
