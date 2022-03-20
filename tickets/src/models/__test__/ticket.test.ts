import { Ticket } from "../ticket"

it(`implements optmistic concurrency control by updating with incorrect version`, async () => {
  const ticket = Ticket.build({
    title: `hi`,
    price: `5`,
    userId: `1233`
  })
  await ticket.save()

  const firstInstance = await Ticket.findById(ticket.id)
  const secondInstance = await Ticket.findById(ticket.id)

  firstInstance!.set({ price: `70` })
  secondInstance!.set({ price: `70` })

  await firstInstance!.save()
  //Below should error
  await secondInstance!.save()
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error(`Should not reach this point.`)
  // expect(async() => {}).toThrow()
})


it(`increments version number on multiple saves`, async () => {
  const ticket = Ticket.build({
    title: `hi`,
    price: `5`,
    userId: `1233`
  })
  await ticket.save()
  expect(ticket.version).toEqual(0)
  await ticket.save()
  expect(ticket.version).toEqual(1)
  await ticket.save()
  expect(ticket.version).toEqual(2)
})