/**
 * 类型声明文件，用于JS DOC智能提示
 */

import { RouterParamContext } from '@koa/router';
import { ParameterizedContext } from 'koa';

export type CustomContext = ParameterizedContext<
  any,
  RouterParamContext<any, {}>
>;
