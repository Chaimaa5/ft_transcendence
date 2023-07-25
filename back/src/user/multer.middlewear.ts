import { diskStorage } from 'multer';
import { extname } from 'path';

export const Config = {
  storage: diskStorage({
    destination: './upload/',
    filename: (req, file, callback) => {
    
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExtension = extname(file.originalname);
      const filename = `${uniqueSuffix}${fileExtension}`;
      callback(null, filename);
    },
  }),
};

