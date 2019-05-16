const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.passwd, config);

db.Sequelize = Sequelize;
db.sequelize = sequelize;
//User 테이블 생성
db.User = require('./user')(sequelize, Sequelize);
//Medicine 테이블 생성
db.Medicine = require('./medicine')(sequelize, Sequelize);

//User:Medicine = N:M 관계 구현
//N:M은 user_medicine 테이블에 생성됩니다.
db.User.belongsToMany(db.Medicine, { through: 'user_medicine' });
db.Medicine.belongsToMany(db.User, { through: 'user_medicine' });


module.exports = db;
