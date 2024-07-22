import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import archiver from "archiver";
import { fileURLToPath } from "url";
import { Readable } from "stream";

class ExcelTcService {
  constructor(aggregatorModel) {
    this.aggregatorModel = aggregatorModel;
    this.apiKeyDadata = "71378de14318d10009285e018aedbfe5a353bb5a";
    this.providerNameById = {
      1: "Русская компания",
      2: "МТС",
      3: "МегаФон",
    };
    this.__dirname = path.dirname(fileURLToPath(import.meta.url));
  }

  async addressCheck(address) {
    const apiKey = "bbbdb08051ba3df93014d80a721660db6c19f0db";
    try {
      const response = await fetch(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Token " + apiKey,
          },
          body: JSON.stringify({
            query: address,
          }),
        }
      ).then((response) => response.json());

      if (!response.suggestions || response.suggestions.length === 0) {
        return false;
      }

      const value = response.suggestions[0].value;

      return value;
    } catch (error) {
      return false;
    }
  }

  async tcCheck(address) {
    try {
      const response = await fetch(
        `http://92.63.178.153:5003/api/v1/providersOnAddress/${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "x-api-key": "g2H3Ym90U3nmhStLikyWOLM662xaiG6BK3l41pYq",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      if (!data || !data.providers || data.providers.length === 0) {
        throw new Error("No providers found");
      }

      return data.providers;
    } catch (error) {
      return null;
    }
  }

  delflat(address) {
    const arrAddress = address.split(",");
    arrAddress.pop();
    return arrAddress.join(",").trim();
  }

  addHousing(address) {
    const arrAddress = address.split(",");
    let lastElement = arrAddress[arrAddress.length - 1];
    const arrHouse = lastElement.split(" ");

    if (arrHouse.length === 4) {
      lastElement = arrHouse[1] + " " + arrHouse[2] + " " + "к. " + arrHouse[3];
      arrAddress[arrAddress.length - 1] = lastElement;
    }

    return arrAddress.join(",");
  }

  async excelTc(path_to_file) {
    const inputExcel = xlsx.readFile(path_to_file);
    const sheet = inputExcel.Sheets[inputExcel.SheetNames[0]];
    const range = xlsx.utils.decode_range(sheet["!ref"]);

    let addresses = [];
    let numbers = [];
    let TC = [];

    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const idCellsNumber = xlsx.utils.encode_cell({ r: rowNum, c: 10 });
      const idCellsAddress = xlsx.utils.encode_cell({ r: rowNum, c: 5 });
      const idCellsState = xlsx.utils.encode_cell({ r: rowNum, c: 7 });

      let cellState = sheet[idCellsState];
      let cellStateValue = cellState ? cellState.v : undefined;

      if (cellStateValue === "Услуга подключена" || cellStateValue === "Тест") {
        continue;
      }

      let cellNumber = sheet[idCellsNumber];
      let cellAddress = sheet[idCellsAddress];

      cellNumber = cellNumber ? cellNumber.v : undefined;
      cellAddress = cellAddress ? cellAddress.v : undefined;

      if (cellAddress) {
        let address = this.delflat(cellAddress);
        address = this.addHousing(address);

        addresses.push(address);
      }
      if (cellNumber) {
        numbers.push(cellNumber);
      }
    }

    addresses = addresses.slice(1);
    numbers = numbers.slice(1);

    for (let i = 0; i < addresses.length; i++) {
      console.log(i);

      const value = await this.addressCheck(addresses[i]);
      console.log(value);
      if (!value) {
        TC.push("Dadata не нашла");
        continue;
      }

      const providers = await this.tcCheck(value);
      let providersIds;
      if (!providers) {
        TC.push("Провaдеров нет");
        console.log("Провaдеров нет");
      } else {
        providersIds = providers.map((provider) => provider.id);
        console.log(providersIds);
        TC.push(providersIds.join(", "));
      }
    }

    // Функция для записи файла в память
    const writeBuffer = (data) => {
      const ws = xlsx.utils.aoa_to_sheet(data);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
      return xlsx.write(wb, { bookType: "xlsx", type: "buffer" });
    };

    // Данные для записи в файлы
    const worksheetData = [
      ["Адрес", "Номер", "Техническая возможность(Провайдеры)"],
    ];
    const worksheetDataMts = [["Номер"]];
    const worksheetDataMegafon = [["Номер"]];
    const worksheetDataRusCom = [["Номер"]];
    const worksheetDataNoCN = [
      ["Адрес", "Номер", "Техническая возможность(Провайдеры)"],
    ];

    try {
      for (let i = 0; i < addresses.length; i++) {
        worksheetData.push([addresses[i], numbers[i], TC[i]]);
        console.log(addresses[i], numbers[i], TC[i]);
        if (TC[i].includes("2")) {
          worksheetDataMts.push([numbers[i]]);
        } else if (TC[i].includes("3")) {
          worksheetDataMegafon.push([numbers[i]]);
        } else if (TC[i].includes("1")) {
          worksheetDataRusCom.push([numbers[i]]);
        } else {
          worksheetDataNoCN.push([addresses[i], numbers[i], TC[i]]);
        }
      }
    } catch (error) {
      console.log(error);
    }

    console.log("кайф");

    // Генерация буферов Excel-файлов
    const buffers = {
      output: writeBuffer(worksheetData),
      outputMts: writeBuffer(worksheetDataMts),
      outputMegafon: writeBuffer(worksheetDataMegafon),
      outputRusCom: writeBuffer(worksheetDataRusCom),
      outputNoCN: writeBuffer(worksheetDataNoCN),
    };

    // Создание архива в памяти
    const archive = archiver("zip", { zlib: { level: 9 } });
    const archiveBuffers = [];

    archive.on("data", (chunk) => {
      archiveBuffers.push(chunk);
    });

    archive.on("end", () => {
      console.log("Archive created");
    });

    archive.append(buffers.output, { name: "output.xlsx" });
    archive.append(buffers.outputMts, { name: "outputMts.xlsx" });
    archive.append(buffers.outputMegafon, { name: "outputMegafon.xlsx" });
    archive.append(buffers.outputRusCom, { name: "outputRusCom.xlsx" });
    archive.append(buffers.outputNoCN, { name: "outputNoCN.xlsx" });

    await archive.finalize();

    // Возвращаем буфер архива
    return Buffer.concat(archiveBuffers);
  }
}

export default ExcelTcService;
