import { Module, applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

export const ApiResponseTags = (): ClassDecorator => {
  return applyDecorators(
    Module({
      controllers: [],
      providers: [],
      exports: [],
    }),
    ApiOkResponse({ description: 'Data was deleted successfully' }),
    ApiCreatedResponse({ description: 'Data Created Succesfully' }),
    ApiUnprocessableEntityResponse({ description: 'Bad Request' }),
    ApiNotFoundResponse({ description: 'Data not found' }),
    ApiForbiddenResponse({ description: 'Unauthorized Request' }),
  );
};
