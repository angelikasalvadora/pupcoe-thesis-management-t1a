const config = {
  development: {
    db: {
      database: 'thesisver2',
      user: 'postgres',
      password: 'xxreallay',
      host: 'localhost',
      port: 5432
    },
    nodemailer: {
    }
  },
  production: {
    db: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: 5432,
      ssl: true
    },
    nodemailer: {

    }
  }
};

module.exports = process.env.NODE_ENV === 'production' ? config.production : config.development;
