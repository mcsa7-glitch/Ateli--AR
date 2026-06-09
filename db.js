
const { Pool } = require("pg");

const db = new Pool({
  user: "atelie_u37m_user",
  host: "dpg-d8jdd2dckfvc73cnaiig-a.oregon-postgres.render.com",
  database: "atelie_u37m",
  password: "uyECjhJGBCLm2qpUxSkxdVfTJueDPpnT",
  port: 5432
});

module.exports = db;