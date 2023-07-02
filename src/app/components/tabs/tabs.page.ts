import { Component, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  @ViewChild(IonTabs, { static: true }) ionTabs!: IonTabs;
  current_tab = 'today';

  constructor() { }

  setCurrentTab(event: any) {
    this.current_tab = event.tab;
  }

  overrideTabContainer() {
    setTimeout(() => {
      const routerOutlet = (this.ionTabs.outlet as any).nativeEl as HTMLElement;
      const container = routerOutlet.querySelector('ion-content');
      if (container) {
        container.style.setProperty('--padding-bottom', '80px');
      }
    });
  }

}
