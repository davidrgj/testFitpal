import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    showHeaderTitle: boolean = false;

    constructor(
    ) { }

    /* 
     * Funcionalidad para agregar diseño a los titulos de los header
    */
    showTitlePage(position: any) {
        if (parseFloat(position / 10 as any) > parseFloat(2.4 as any)) {
            this.showHeaderTitle = true;
        } else {
            this.showHeaderTitle = false;
        }
    }

}
