import request from 'supertest'
import { app } from '../../app'
import {Ticket} from '../../models/ticket'
import { natsWrapper } from '../../natsWrapper'
jest.mock(`../../__mocks__/natsWrapper.ts`)

it(`has a route handler listening to api/tickets for post requests`,async() =>{
    const response = await request(app)
        .post(`/api/tickets`)
        .send({})
    expect(response.status).not.toEqual(404)
})
it(`can only be accessed if user is signed in`,async() =>{
    const response = await request(app)
        .post(`/api/tickets`)
        .send({})
        .expect(401)
})
//!! NOTE for some reason cookie is being attached to header not session here
it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .set('Content-Type', 'application/json')
    .send({});

  expect(response.status).not.toEqual(401);
});

it(`returns error if invalid title is provided`,async() =>{
 const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .set('Content-Type', 'application/json')
    .send({
      title: '',
      price: 10,
    });

  expect(response.status).toEqual(400)
})
it(`returns error if invalid price is provided`,async() =>{
   await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .set('Content-Type', 'application/json')
    .send({
      title: '',
      price: -10,
    })
    .expect(400);
 
   await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .set('Content-Type', 'application/json')
    .send({
      title: '',
    })
    .expect(400)
})
it(`creates a ticket with valid inputs`,async() =>{
  //add Check to make sure ticket is saved
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`,global.signIn())
    .send({
      title: `Hello`,
      price: 100
    })
    .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1)
})


it(`publishes an event`, async () => {
  const title = `whatever`

  await request(app)
    .post(`/api/tickets`)
    .set(`Cookie`,global.signIn())
    .send({
      title,
      price: `20`
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})