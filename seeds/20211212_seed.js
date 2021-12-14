require('dotenv').config()
const { subscribe } = require('../server/util/subscribe');
const testData = require('./testdata.json');
console.log(testData);

if (!process.env.TEST_PHONE_NUMBER) {
  throw new Error('You must set the TEST_PHONE_NUMBER environment variable to an SMS-capable phone.')
}



exports.seed = async function(knex) {
  // Clear out all the tables
  await knex('cases').del();
  await knex('subscriptions').del();
  await knex('subscribers').del();
  await knex('defendants').del();
  const today = new Date();
  const courtDates = [new Date(), new Date(), new Date()];
  courtDates[0].setDate(today.getDate() + 2);
  courtDates[1].setDate(today.getDate() + 7);
  courtDates[2].setDate(today.getDate() - 3);

  console.log('Now the loop ' + typeof testData.subscriptions.length);
  for (let i = 0; i<testData.subscriptions.length; ++i) {
    let itm = testData.subscriptions[i];
    let d = courtDates[i%3];
    for (let j=0; j<itm.details.cases.length; ++j) {
      itm.details.cases[j].courtDate = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
    }
    const defendant = await subscribe(process.env.TEST_PHONE_NUMBER, itm.selectedDefendant, itm.details);
    console.log(JSON.stringify(defendant));
  }

  // // Deletes ALL existing entries
  // return knex('table_name').del()
  //   .then(function () {
  //     // Inserts seed entries
  //     return knex('table_name').insert([
  //       {id: 1, colName: 'rowValue1'},
  //       {id: 2, colName: 'rowValue2'},
  //       {id: 3, colName: 'rowValue3'}
  //     ]);
  //   });
};
