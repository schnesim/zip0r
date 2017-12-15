import * as _ from 'underscore';

export class ArrayUtils {
  public static getLast(array: Array<any>): any {
    if (_.isArray(array) && array.length > 0) {
      return array[array.length - 1];
    }
    return void 0;
  }
  
  public static getFirst(array: Array<any>): any {
    if (_.isArray(array) && array.length > 0) {
      return array[0];
    }
    return void 0;
  }
}