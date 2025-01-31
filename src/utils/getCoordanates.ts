import axios from "axios";
import csv from "csvtojson";
import logger from "./logger";
import { GET_SHEET_DATA_ERROR } from "@errors/sheet";

export interface HostCoordinate {
  latitude: number;
  longitude: number;
  host: string;
}

async function getCoordinatesFromSheet(): Promise<HostCoordinate[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/11nX5gzxfbcHdrzR12ttZGL4RSjmppLqd/export?format=csv`;

    const response = await axios.get(url);

    const rows = response.data;

    const sheetJson = await csv({
      noheader: false,
    }).fromString(rows);

    const filteredCoordinates: HostCoordinate[] = sheetJson
      .filter((row: any) => row.Latitude && row.Longitude && row.LAN)
      .map(
        (row: any) =>
          ({
            latitude: Number(row.Latitude),
            longitude: Number(row.Longitude),
            host: `lan_${row.LAN}`,
          }) as HostCoordinate
      );

    return filteredCoordinates;
  } catch {
    throw GET_SHEET_DATA_ERROR;
  }
}

export default getCoordinatesFromSheet;
