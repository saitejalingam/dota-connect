import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
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

  public getProfile(steamid) {
    return JSON.parse(localStorage.getItem(steamid));
  }

  public setProfile(steamid, profile) {
    localStorage.setItem(steamid, JSON.stringify(profile));
  }

  public removeProfile(steamid) {
    localStorage.removeItem(steamid);
  }

  public getFriends(steamid) {
    return JSON.parse(localStorage.getItem(steamid + '_friends'));
  }

  public setFriends(steamid, friends) {
    localStorage.setItem(steamid + '_friends', JSON.stringify(friends));
  }

  public removeFriends(steamid) {
    localStorage.removeItem(steamid + '_friends');
  }

  public getFavorites(steamid) {
    return JSON.parse(localStorage.getItem(steamid + '_favorites'));
  }

  public setFavorites(steamid, favorites) {
    localStorage.setItem(steamid + '_favorites', JSON.stringify(favorites));
  }

  public removeFavorites(steamid) {
    localStorage.removeItem(steamid + '_favorites');
  }
}
