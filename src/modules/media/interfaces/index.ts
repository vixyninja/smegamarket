export interface IMediaService {
  findFile(fileId: string): Promise<any>;
  readOne(fileId: string): Promise<any>;
  uploadFile(file: Express.Multer.File, folder?: string): Promise<any>;
  uploadFiles(files: Express.Multer.File[], folder?: string): Promise<any>;
  deleteFile(fileId: string): Promise<any>;
  deleteFolder(folder: string): Promise<any>;
}
