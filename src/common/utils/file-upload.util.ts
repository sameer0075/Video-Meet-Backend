import { extname } from 'path';
import * as moment from 'moment';
import * as uuid from 'uuid';
const uniqueId = uuid.v4();
const dateCreated: Date | string = moment().format('YYYY-MM-DD HH:mm:ss');
import { HttpException, HttpStatus } from '@nestjs/common';

export const imageFileFilter = (_req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    const Exception = new HttpException(
      {
        success: false,
        message: 'Only image files are allowed!',
      },
      HttpStatus.NOT_ACCEPTABLE,
    );
    return callback(Exception, false);
  }
  callback(null, true);
};
export const addFileName = (_req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const id = uniqueId + '-' + name + '-' + dateCreated + fileExtName;
  const splitedid = id.replace(/:/gi, '');
  const finalName = splitedid.replace(/\s/g, '');
  callback(null, finalName);
};
