import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';
import { PermissionEntity } from '../permission';

class Role extends Model {}

Role.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.CHAR(20), allowNull: false },
    desc: { type: DataTypes.CHAR(255), allowNull: false },
  },
  { sequelize: initDB(), modelName: 'Role' }
);

// 角色权限多对多
Role.belongsToMany(PermissionEntity, { through: 'role_permission' });
PermissionEntity.belongsToMany(Role, { through: 'role_permission' });

export default Role;
