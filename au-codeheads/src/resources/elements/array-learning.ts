import {bindable} from 'aurelia-framework';

export class ArrayLearning {
  @bindable model = [];

  constructor(
    public arrayMaze: string[][]
  ) {
    this.arrayMaze = [
      ['ʕ','•','ᴥ','•','ʔ']
    ]
  }

  valueChanged(newValue, oldValue) {

  }
}
