---
to: src/modules/<%= h.changeCase.lcFirst(name) %>/entity.js
---
import { DataTypes, Model } from 'sequelize';
import initDB from '../../common/db';

class <%= name %> extends Model {}

<%= name %>.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
}, { sequelize: initDB(), modelName: '<%= name %>' });

export default <%= name %>;
