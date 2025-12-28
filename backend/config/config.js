
try {
	if (process.env.NODE_ENV !== 'production') {
		require('dotenv').config();
	}
} catch (e) {
	
}


module.exports = {
	PORT: process.env.PORT || 3000,
	
	DB_URL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/project_manager'
};

