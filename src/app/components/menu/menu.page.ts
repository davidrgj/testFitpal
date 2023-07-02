import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'menu.page.html',
  styleUrls: ['menu.page.scss']
})
export class MenuPage {

  showHeaderTitle: boolean = false;
  isDarkMode: boolean = localStorage.getItem('isDarkMode') == '1' ? true : false;
  photo: string = '';

  constructor(
    private _utilsService: UtilsService
  ) { }

  ngOnInit() {

  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });

    this.photo = `data:image/jpeg;base64,${image.base64String}`;
  }

  changeTheme(event: any) {
    if (event.detail.checked) {
      localStorage.setItem('isDarkMode', '1');
      document.body.setAttribute('color-theme', 'dark');
    } else {
      localStorage.setItem('isDarkMode', '0');
      document.body.setAttribute('color-theme', 'light');
    }
  }

  onScroll(event: any) {
    this.showHeaderTitle = this._utilsService.showHeaderTitle;

    const position = event.detail.scrollTop;
    this._utilsService.showTitlePage(position);
  }

}
