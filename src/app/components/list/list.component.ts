import { Component, OnInit } from '@angular/core';
import { animate, style, group, query, transition, trigger } from '@angular/animations';

interface Contact {
  id: number,
  name: string,
  email: string,
  avatarUrl: string
}

const CONTATC_MOCK: Contact[] = new Array(5)
  .fill({})
  .map(
    (c: Contact, i: number) =>
    ({
      id: i,
      name: `Contact ${i}`,
      email: `email${i}@provider.com`,
      avatarUrl: `https://api.adorable.io/avatars/100/${~~(Math.random() * 100)}`,
    } as Contact)
  )
  .reverse(); // * to have them sorted in DESC order

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  animations: [
    trigger('listItemAnimation', [
      transition(':enter', [
        style({ height: '0px', overflow: 'hidden' }),
        group([animate('250ms ease-out', style({height: '!'}))]),
        // although group is useless here (since we have only one animation)
        // i like to leave it anyway just in case i want to add another 
        // parallel animation in the future
      ]),
      transition(':leave', [
        style({ height: '!', overflow: 'hidden' }),
        group([animate('250ms ease-out', style({ height: '0px' }))]),
      ]),
    ]),

    trigger('sideContentAnimation', [
      transition(':enter', [
        // we set the width of the outer container to 0, and hide the
        // overflow (so the inner container won't be visible)
        style({ width: '0px', overflow: 'hidden' }),
        group([
          // we animate the outer container width to it's original value
          animate('250ms ease-out', style({ width: '!' })),

          // in the same time we translate the inner element all the
          // way from left to right
          query('.side-list-content-data-inner', [
            style({ transform: 'translateX(-110%)' }),
            group([animate('250ms ease-out', style({ transform: 'translateX(-0%)' }))]),
          ]),
        ]),
      ]),
      transition(':leave', [
        group([
          animate('250ms ease-out', style({ width: '0' })),
          query('.side-list-content-data-inner', [
            style({ transform: 'translateX(-0%)' }),
            group([animate('250ms ease-out', style({ transform: 'translateX(-110%)' }))]),
          ]),
        ]),
      ]),
    ]),
  ]
})
export class ListComponent implements OnInit {
  contactList: Contact[] = CONTATC_MOCK;
  selectedContact: Contact;

  constructor() { }

  ngOnInit() {}

  onSelectItem(contact: Contact) {
    // * selecting a contact to focus on
    this.selectedContact = contact ? {...contact} : null;
  }

  onAddItem() {
    const rndNum = Date.now();
    const newContact: Contact = {
      id: this.contactList.length * rndNum,
      name: `Contact ${this.contactList.length}`,
      email: `email${this.contactList.length}@provider.com`,
      avatarUrl: `https://api.adorable.io/avatars/285/${rndNum}`,
    };

    // * adding a new contact to the list
    this.contactList = [newContact, ...this.contactList];

    // * selecting the newly created contact
    this.onSelectItem(newContact);
  }

  onDeleteItem(contact: Contact) {
    // * removing a contact from the list
    this.contactList = this.contactList.filter(c => c.id != contact.id);

    if (this.selectedContact && this.selectedContact.id == contact.id) {
      // * if the removed contact is being focused on, then we remove the focus
      this.onSelectItem(null);
    }
  }

}
