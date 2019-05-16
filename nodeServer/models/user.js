module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user', {
//유저아이디
	user_id: {
		type: DataTypes.STRING(20),
		allowNull: false,
		unique: true,
	},
//비번
	password: {
		type: DataTypes.STRING(20),
		allowNull: false,
		unique: true,
	},
//유저이름
	name: {
		type: DataTypes.STRING(10),
		allowNull: false,
	},
//나이
	age: {
		type: DataTypes.INTEGER.UNSIGNED,
		allowNull: false,
	},
//성별
	sex: {
		type: DataTypes.STRING(10),
		allowNull: false,
	},
	flag: {
		type: DataTypes.INTEGER.UNSIGNED,
	},
}, {
	timestamps: false,
});
};	
