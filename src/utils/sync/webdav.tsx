import { restoreFromfilePath } from "../file/restore";
import ConfigService from "../service/configService";

class WebdavUtil {
  static UploadFile = async (blob: any) => {
    return new Promise<boolean>(async (resolve, reject) => {
      let { url, username, password } = JSON.parse(
        ConfigService.getReaderConfig("webdav_token") || "{}"
      );
      const fs = window.require("fs");
      const path = window.require("path");
      const { ipcRenderer } = window.require("electron");
      const dirPath = ipcRenderer.sendSync("user-data", "ping");
      const arrayBuffer = await blob.arrayBuffer();
      const fileName = "data.zip";
      fs.writeFileSync(path.join(dirPath, fileName), Buffer.from(arrayBuffer));
      resolve(
        await ipcRenderer.invoke("webdav-upload", {
          url,
          username,
          password,
          fileName,
        })
      );
    });
  };
  static DownloadFile = async () => {
    return new Promise<boolean>(async (resolve, reject) => {
      let { url, username, password } = JSON.parse(
        ConfigService.getReaderConfig("webdav_token") || ""
      );
      const fileName = "data.zip";
      const path = window.require("path");
      const { ipcRenderer } = window.require("electron");
      const dirPath = ipcRenderer.sendSync("user-data", "ping");
      let result = await ipcRenderer.invoke("webdav-download", {
        url,
        username,
        password,
        fileName,
      });
      if (result) {
        let result = await restoreFromfilePath(path.join(dirPath, fileName));
        if (!result) resolve(false);
      }
      resolve(true);
      try {
        const fs_extra = window.require("fs-extra");
        fs_extra.remove(path.join(dirPath, fileName), (error: any) => {
          if (error) resolve(false);
          resolve(true);
        });
      } catch (e) {
        console.log("error removing ", path.join(dirPath, fileName));
        resolve(false);
      }
    });
  };
}

export default WebdavUtil;
