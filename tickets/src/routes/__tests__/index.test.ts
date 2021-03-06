import request from "supertest";
import { app } from "../../app";

jest.mock(`../../__mocks__/natsWrapper.ts`)
const createTicket = () => {
    return request(app)
        .post(`/api/tickets`)
        .set(`Cookie`,global.signIn())
        .send({
            title: `fdshjn`,
            price: 100
        })

}

it(`it can fetch a list of tickets`,async() => {
    await createTicket()
    await createTicket()
    await createTicket()

    const response = await request(app)
        .get(`/api/tickets`)
        .send()
        .expect(200)
    expect(response.body.length).toEqual(3)
})