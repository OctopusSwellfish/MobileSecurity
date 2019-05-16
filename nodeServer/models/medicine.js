module.exports = (sequelize, DataTypes) => {
	return sequelize.define('medicine', {
//약 이름
		name: {
			type: DataTypes.STRING(30),
			allowNull: false,
		},
//성분
		ingredient: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
//복용주기(식후30분등...)
		period: {
			type: DataTypes.TEXT,
		},
//효능	
		effect: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
//주의사항
		caution: {
			type: DataTypes.TEXT,
		},
//제약 회사
		company: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
}, {
	timestamps: false,
});
};
