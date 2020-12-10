const sql = require("mssql");
// var Connection = require("tedious").Connection;
var express = require("express"); // Web Framework
const bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
  user: "sa",
  password: "12_Sylvester",
  server: "localhost",
  database: "euda",
  options: {
    enableArithAbort: true,
  },
};

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);

app.get("/all_employees", function (req, res) {
  sql.connect(config, function () {
    var request = new sql.Request();
    request.query("select * from employees", function (err, recordset) {
      if (err) console.log(err);
      res.end(JSON.stringify(recordset)); // Result in JSON format
    });
  });
});

app.post("/signin", function (req, res) {
  sql.connect(config, function () {
    var request = new sql.Request();
    request.query(('select * from employees WHERE username=' + '\'' + req.body.username + '\''), function (err, recordset) {
      if (err) console.log(err);
      res.end(JSON.stringify(recordset)); // Result in JSON format
    });
  });
});

app.post("/signinAdmin", function (req, res) {
  sql.connect(config, function () {
    var request = new sql.Request();
    request.query(('select * from employees WHERE username=' + '\'' + req.body.username + '\'' + 'AND user_id=2 '), function (err, recordset) {
      if (err) console.log(err);
      else {
        console.log("what is new ", recordset)

        if (recordset.rowsAffected == 0) res.status(500).send(JSON.stringify({ message: "Admin not found" }));
        else
          res.end(JSON.stringify(recordset.recordset)); // Result in JSON format
      }

    });
  });
});

app.post("/getDeviceAllocations", function (req, res) {
  sql.connect(config, function () {
    console.log(req)
    var request = new sql.Request();
    request.query(('select * from device_allocations where employee_id=' + '\'' + req.query.employee_id + '\''), function (err, recordset) {
      if (err) console.log(err);
      else {
        if (recordset.rowsAffected == 0) res.status(500).send(JSON.stringify({ message: "Admin not found" }));
        else
          res.end(JSON.stringify(recordset.recordset)); // Result in JSON format
      }

    });
  });
});




app.post("/liabilityStaging", function (req, res) {
  sql.connect(config, function () {
    var request = new sql.Request();
    request.query("insert into erp_liability_staging ( transaction_code,  request_number, request_date,  requestor_username,  facilitator_username, asset_type_lookup,asset_tag,asset_serial, export_flag) VALUES ('DISPOSE_LAPTOP',     'REQTEST202009-030',   SYSDATETIME(),'SHANIQUA', 'WANJIGE','LAPTOP','S0527960',  'SPC00Y5PX', 'A')", function (err, recordset) {
      if (err) console.log(err);
      res.end(JSON.stringify(recordset)); // Result in JSON format
    });
  });
});

app.post("/liabilityStagingSet", function (req, res) {
  sql.connect(config, function () {
    var request = new sql.Request();
    let stmnt = 'INSERT INTO erp_liability_staging SET ? ';

    let post = {
      transaction_code: req.body.transaction_code,
      request_number: req.body.request_number,
      request_date: Date.now(),
      requestor_username: req.body.requestor_username,
      facilitator_username: req.body.facilitator_username,
      asset_type_lookup: req.body.asset_type_lookup,
      asset_tag: req.body.asset_tag,
      asset_serial: req.body.asset_serial,
      export_flag: req.body.export_flag
    }

    var parameters = [
      { name: 'transaction_code', sqltype: sql.NVarChar, value: req.body.transaction_code },
      { name: 'request_number', sqltype: sql.NVarChar, value: req.body.request_number },
      { name: 'request_date', sqltype: sql.DateTime, value: new Date().toISOString().slice(0, 19).replace('T', ' ') },
      { name: 'requestor_username', sqltype: sql.NVarChar, value: req.body.requestor_username },
      { name: 'facilitator_username', sqltype: sql.NVarChar, value: req.body.facilitator_username },
      { name: 'asset_type_lookup', sqltype: sql.NVarChar, value: req.body.asset_type_lookup },
      { name: 'asset_tag', sqltype: sql.NVarChar, value: req.body.asset_tag },
      { name: 'asset_serial', sqltype: sql.NVarChar, value: req.body.asset_serial },
      { name: 'export_flag', sqltype: sql.NVarChar, value: req.body.export_flag },
    ];

    // Add parameters
    parameters.forEach(function (p) {
      request.input(p.name, p.sqltype, p.value);
    });

    var query = "INSERT INTO erp_liability_staging ( transaction_code,  request_number, request_date,  requestor_username,  facilitator_username, asset_type_lookup,asset_tag,asset_serial, export_flag) VALUES (@transaction_code, @request_number,@request_date, @requestor_username, @facilitator_username, @asset_type_lookup, @asset_tag, @asset_serial, @export_flag)";
    request.query(query, function (err, recordset) {
      if (err) console.log(err);
      res.end(JSON.stringify(recordset)); // Result in JSON format
    });
  });
});


