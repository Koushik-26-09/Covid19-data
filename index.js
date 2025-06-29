const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const bcrypt = require('bcrypt')
const sqlite3 = require('sqlite3')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())
let db = null;
app.use(express.static(path.join(__dirname, 'public')))

const dbPath = path.join(__dirname, 'covid19.db')
const intializeAndConnect = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at --> http://localhost:3000/')
    })
  } catch (e) {
    console.log('DB Error: ', e.message)
    process.exit(1)
  }
}
intializeAndConnect()
const authenticationToken =  (request, res, next) => {
  let jwtoken
  const authHeaders = request.headers['authorization']
  if (authHeaders !== undefined) {
    jwtoken = authHeaders.split(' ')[1]
  }
  if (jwtoken === undefined) {
    res.status(401).send('Invalid JWT Token')
  } else {
    jwt.verify(jwtoken, 'MY_SECRET_TOKEN',  (error, payload) => {
      if (error) {
        res.status(401).send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

app.post("/register/", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  const selectUserQuery = `SELECT * FROM user WHERE username = ?`;
  const dbUser = await db.get(selectUserQuery, [username]);
  if (dbUser === undefined) {
    const createUserQuery = `
      INSERT INTO 
        user (username, name, password, gender, location) 
      VALUES (?, ?, ?, ?, ?)`;
    const dbResponse = await db.run(createUserQuery, [
      username, name, hashedPassword, gender, location
    ]);
    const newUserId = dbResponse.lastID;
    response.send({ message: `Created new user with id ${newUserId}` });
  } else {
    response.status(400).send({ message: "User already exists" });
  }
});
app.post('/login/', async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = `SELECT * FROM user WHERE username = ?`;
    const dbUser = await db.get(query, [username]);

    if (!dbUser) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { username };
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
      res.json({ jwtToken });
    } else {
      res.status(400).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//API 1
app.get('/states/', authenticationToken, async (request, response) => {
  const query = `select * from state ;`
  const dbResponse = await db.all(query)
  const result = dbResponse.map(state => {
    return {
      stateId: state.state_id,
      stateName: state.state_name,
      population: state.population,
    }
  })
  response.send(result)
})
//API 2
app.get('/states/:stateId/', authenticationToken, async (request, response) => {
  const {stateId} = request.params
  const query = `SELECT * FROM state WHERE state_id = ?;`

  const dbResponse = await db.get(query, [stateId])
  if (dbResponse === undefined) {
   response.status(404).send('State Not Found')

  } else {
    const result = {
      stateId: dbResponse.state_id,
      stateName: dbResponse.state_name,
      population: dbResponse.population,
    }
    response.send(result)
  }
})
//API 3
app.post('/districts/', authenticationToken, async (request, response) => {
  const {districtName, stateId, cases, cured, active, deaths} = request.body
  const query = `
  INSERT
    INTO 
   district (district_name,state_id,cases,cured,active,deaths) 
   VALUES (?,?,?,?,?,?); `
  await db.run(query, [districtName, stateId, cases, cured, active, deaths])
  response.send('District Successfully Added')
})
//API4
app.get(
  '/districts/:districtId/',
  authenticationToken,
  async (request, response) => {
    const {districtId} = request.params
    const query = `SELECT * FROM district WHERE district_id = ?;`

    const dbResponse = await db.get(query, [districtId])
    if (dbResponse === undefined) {
      response.status(404).send('District Not Found')
    } else {
      const result = {
        districtId: dbResponse.district_id,
        districtName: dbResponse.district_name,
        stateId: dbResponse.state_id,
        cases: dbResponse.cases,
        cured: dbResponse.cured,
        active: dbResponse.active,
        deaths: dbResponse.deaths,
      }
      response.send(result)
    }
  },
)
//API5
app.delete(
  '/districts/:districtId/',
  authenticationToken,
  async (request, response) => {
    const {districtId} = request.params
    const query = `delete from district where district_id=?`
    await db.run(query, [districtId])
    response.send('District Removed')
  },
)
//API6
app.put(
  '/districts/:districtId/',
  authenticationToken,
  async (request, response) => {
    const {districtId} = request.params
    const {districtName, stateId, cases, cured, active, deaths} = request.body
    const query = `UPDATE district SET district_name=?,state_id=?,cases=?,cured=?,active=?,deaths=? WHERE district_id=?`
    await db.run(query, [
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
      districtId,
    ])
    response.send('District Details Updated')
  },
)

//API7
app.get(
  '/states/:stateId/stats/',
  authenticationToken,
  async (request, response) => {
    const {stateId} = request.params
    const query = `SELECT SUM(cases) as totalCases,
    SUM(cured) as totalCured ,SUM(active) as totalActive,SUM(deaths) as totalDeaths
   FROM district where state_id=?;`

    const dbResponse = await db.get(query, [stateId])
    response.send(dbResponse)
  },
)
//api8
app.get('/districts/:districtId/details/', async (request, response) => {
  const {districtId} = request.params
  const query = `select state_id from district where district_id=?;`

  const dbResponse = await db.get(query, [districtId])
  const query2 = `select state_name as stateName from state where state_id=${dbResponse.state_id} `
  const dbResponse1 = await db.get(query2)
  response.send(dbResponse1)
})
module.exports = app
