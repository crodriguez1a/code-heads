import Component from '@glimmer/component';

export default class AboutResume extends Component {
  private print(e) {
    e.preventDefault();
    
    window.print();
  }
};
