import sql from "mssql";

const dbSettings = {
    user: "sa",
    password: "Admin12345",
    server: "FREDDY",
    database: "SIPE",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

export const getConnection = async () => {
    try {
        const pool = await sql.connect(dbSettings);
        const result = await pool.request().query("SELECT GETDATE()")
        console.log(result);
        return pool;
    } catch (error) {
        console.log(error);
    }
};
