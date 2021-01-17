/**
 * 类型声明文件，用于JS DOC智能提示
 */

import { RouterParamContext } from '@koa/router';
import { ParameterizedContext } from 'koa';

export type CustomContext = ParameterizedContext<
  any,
  RouterParamContext<any, {}>
>;

export type UserDto = {
  id: number;
  name: string;
  password: string;
  stu_id: string;
  gender: string;
  card_id: string;
  phone: string;
  class_name: string;
  avatar_url: string;
  comment: string;
  team_id: number;
  is_delete: boolean;
  createdAt: Date;
  updatedAt: Date;
  Team?: TeamDto;
};

export type CreateUserDto = Pick<
  UserDto,
  'name' | 'password' | 'class_name' | 'stu_id' | 'team_id'
>;

export type LoginDto = Pick<
  UserDto,
  'id' | 'name' | 'stu_id' | 'avatar_url' | 'team_id'
> & { role_id: number[] };

export type TeamDto = {
  id: number;
  name: string;
  teacher: string;
  captain_id?: number;
  tables?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTeamDto = Pick<TeamDto, 'id' | 'name' | 'teacher'>;
