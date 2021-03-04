var mysql = require('mysql');


var con = mysql.createConnection({
  host: "levelupworks-database.cdhmmvn79fgv.us-east-1.rds.amazonaws.com",
  user: "LevelUpDBAdmin",
  password: "$Levelupdbadmin21",
  database: "new_db"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM Teachers", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });

