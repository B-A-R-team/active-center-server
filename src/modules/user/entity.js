import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';
import { RoleEntity } from '../role';
import { TeamEntity } from '../team';

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.CHAR(15), allowNull: false },
    password: { type: DataTypes.CHAR(255), allowNull: false },
    stu_id: { type: DataTypes.CHAR(9), allowNull: false, unique: true },
    gender: { type: DataTypes.TINYINT(2) },
    card_id: { type: DataTypes.CHAR(10) },
    phone: { type: DataTypes.CHAR(11) },
    class_name: { type: DataTypes.CHAR(15) },
    avatar_url: { type: DataTypes.CHAR(255) },
    comment: { type: DataTypes.CHAR(255) },
    is_delete: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize: initDB(), modelName: 'User' }
);

// 用户角色多对多
User.belongsToMany(RoleEntity, { through: 'user_role' });
RoleEntity.belongsToMany(User, { through: 'user_role' });

// 团队用户一对多
TeamEntity.hasOne(User, { foreignKey: 'team_id' });
User.belongsTo(TeamEntity, { foreignKey: 'team_id' });

export default User;
