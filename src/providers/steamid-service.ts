import { Injectable } from '@angular/core';

@Injectable()
export class SteamIDService {
  private key_name = 'steam_id';
  constructor() { }

  public getID() {
    return localStorage.getItem(this.key_name);
  }

  public setID(value) {
    return localStorage.setItem(this.key_name, value);
  }

  public removeID() {
    return localStorage.removeItem(this.key_name);
  }
}
