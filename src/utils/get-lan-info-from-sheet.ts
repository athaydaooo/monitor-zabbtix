import axios from "axios";
import csv from "csvtojson";
import { GET_SHEET_DATA_ERROR } from "@errors/sheet";

export interface HostData {
  latitude: number;
  longitude: number;
  host: string;
  name: string;
}

async function getLanInfoFromSheet(): Promise<HostData[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/11nX5gzxfbcHdrzR12ttZGL4RSjmppLqd/export?format=csv`;

    const response = await axios.get(url);

    const rows = response.data;

    const sheetJson = await csv({
      noheader: false,
    }).fromString(rows);

    const filteredData: HostData[] = sheetJson
      .filter((row: any) => row.Latitude && row.Longitude && row.LAN)
      .map(
        (row: any) =>
          ({
            latitude: Number(row.Latitude),
            longitude: Number(row.Longitude),
            name: row.Setor,
            host: `lan_${row.LAN}`,
          }) as HostData
      );
    return filteredData;
  } catch {
    throw GET_SHEET_DATA_ERROR;
  }
}

export default getLanInfoFromSheet;
