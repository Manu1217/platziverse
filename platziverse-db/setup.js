'use strict'

const db = require('./')
const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')

const prompt = inquirer.createPromptModule()
async function setup() {
  let flag = process.argv[2]
  if (flag != '-y') {

    const answer = await prompt([{
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your db, are you sure?'
    }])
    // for flag config

    if (!answer.setup) {
      return console.log('Nothing happened!')
    }
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'manu',
    password: process.env.DB_PASS || 'manux1217',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true,
    operatorsAliases: false
  }

  await db(config).catch(handleFataError)

  console.log('Success!')
  process.exit(0)
}

function handleFataError(err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()
