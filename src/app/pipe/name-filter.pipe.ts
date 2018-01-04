import { Pipe, PipeTransform } from '@angular/core';
import { UserInfo } from '../model/user-info';

@Pipe({
  name: 'nameFilter'
})
export class NameFilterPipe implements PipeTransform {

  transform(items: UserInfo[], searchText: string): UserInfo[] {
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      return it.lastName.toLowerCase().includes(searchText) || it.firstName.toLowerCase().includes(searchText);
    });
   }
}
