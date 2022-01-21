import {app} from './server.js'
import 'dotenv/config'
const port = process.env.PORT || 3000;
app.listen(port, async () => {
    console.log(`Fraud Detection Service listening at http://localhost:${port}`)
})