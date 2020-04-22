import { Injectable } from '@angular/core';
import { Ticket } from '../models/ticket';

type ArrayPdfTicket = {
  "str": string
};
@Injectable({
  providedIn: 'root'
})
export class TicketFormatterService {
  constructor() { }

  formatPdfTicket(arrayPdfTicket) {
    let ticket: Ticket = {
      products: [],
      timestamp: undefined,
      description: "",
    }

    let productArray: string[] = []
    let priceArray: number[] = []

    let firstProductIndex: number
    let lastProductIndex: number
    let rightProductLimit: number
    let leftPriceLimit: number
    let rightPriceLimit: number

    let pdfTicket: ArrayPdfTicket[] = arrayPdfTicket.items

    pdfTicket.forEach((element, index) => {
      //Set limit
      if (element.str.includes("IVA") && element.str.includes("EURO")) {
        firstProductIndex = ++index
        rightProductLimit = element.str.indexOf("IVA")
        leftPriceLimit = element.str.indexOf("EURO")
        rightPriceLimit = element.str.length
      }
      if (element.str.includes("TOTALE") && element.str.includes("EURO"))
        lastProductIndex = --index
    });


    //Parse value
    for (let index = firstProductIndex; index <= lastProductIndex; index++) {
      productArray.push(pdfTicket[index].str.slice(0, rightProductLimit).trim())
      priceArray.push(parseFloat(pdfTicket[index].str.slice(leftPriceLimit, rightPriceLimit).replace(",", ".")))
    }

    //Clean from invalid and sales
    for (let index = 0; index < productArray.length; index++) {
      if (Number.isNaN(priceArray[index])) {
        productArray.splice(index, 1)
        priceArray.splice(index, 1)
      }

      if (productArray[index].includes("SCONTO")) {
        priceArray[index - 1] -= priceArray[index]
        productArray.splice(index, 1)
        priceArray.splice(index, 1)
      }

      //Final insert
      ticket.products.push(
        {
          name: productArray[index],
          price: priceArray[index],
          quantity: 1,
          participants: []
        })
    }

    ticket.timestamp = Date.now()

    return ticket
  }
}