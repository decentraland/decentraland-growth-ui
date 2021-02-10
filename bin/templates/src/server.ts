import express from 'express'
// import database from 'decentraland-gatsby/dist/entities/Database/index'
// import manager from 'decentraland-gatsby/dist/entities/Job/index'
import { listen } from 'decentraland-gatsby/dist/entities/Server/utils'
import { status, filesystem } from 'decentraland-gatsby/dist/entities/Route/routes'
import { withMetrics } from 'decentraland-gatsby/dist/entities/Prometheus/middleware'
import { withDDosProtection, withLogs, withCors } from 'decentraland-gatsby/dist/entities/Route/middleware'
import metrics from 'decentraland-gatsby/dist/entities/Prometheus/routes'
import handle from 'decentraland-gatsby/dist/entities/Route/handle'
import RequestError from 'decentraland-gatsby/dist/entities/Route/error'

// const jobs = manager()
// jobs.cron('@eachMinute', () => console.log('Runnign Job...'))

const app = express()
app.set('x-powered-by', false)
app.use(withLogs())
app.use(withMetrics())
app.use('/api', [
  status(),
  withDDosProtection(),
  withCors(),
  // routes
  handle(async () => {
    throw new RequestError('NotFound', RequestError.NotFound)
  })
])

app.use(metrics)
app.use(filesystem('public', '404.html'))

Promise.resolve()
  // .then(() => database.connect())
  //.then(() => process.env.JOBS !== 'false' && jobs.start())
  .then(() => listen(
    app,
    process.env.PORT || 4000,
    process.env.HOST
  ))
