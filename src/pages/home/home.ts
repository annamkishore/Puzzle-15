import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private puzzle: [];
  private emptyTileLoc: string;

  /**
   *
   * @param navCtrl
   */
  constructor(public navCtrl: NavController) {
    this.puzzle = [ [1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0] ];
    this.emptyTileLoc = "44";
    console.log(this.puzzle)
  }

  /**
   *
   * @param event
   */
  moveTiles(event){
    console.log("function moveTiles--------")
    var clickedTileId = "" + event.path.filter(item =>item.tagName=="ION-COL")[0].id;
    var clickedTileLoc = clickedTileId.substring(1);  //ex: 43

    console.log( "clicked: " + clickedTileLoc + "--" + "empty: " + this.emptyTileLoc )
    if( clickedTileLoc.charAt(0) == this.emptyTileLoc.charAt(0) ) {       // row
      this.equalRowClicked(clickedTileLoc)
    }else if( clickedTileLoc.charAt(1) == this.emptyTileLoc.charAt(1) ) { // col
      this.equalColClicked(clickedTileLoc);
    }
    console.log( "empty tile loc: " + this.emptyTileLoc );
  }

  /**
   *
   * @param clickedTileLoc
   */
  equalRowClicked(clickedTileLoc) {
    var clickedCol, emptyCol;
    clickedCol = clickedTileLoc.charAt(1)
    emptyCol = this.emptyTileLoc.charAt(1)

    var currRow = this.emptyTileLoc.charAt(0)
    if( clickedCol < emptyCol ) {
      while( clickedCol < emptyCol ) {
        this.swap(`t${currRow}${emptyCol}`, `t${currRow}${emptyCol-1}`)
        emptyCol--;
      }
    }else if( emptyCol < clickedCol ) {
      while( emptyCol < clickedCol ) {
        this.swap(`t${currRow}${emptyCol}`, `t${currRow}${parseInt(emptyCol)+1}`)
        emptyCol++;
      }
    }
    this.emptyTileLoc = `${currRow}${emptyCol}`;
  }

  /**
   *
   * @param clickedTileLoc
   */
  equalColClicked(clickedTileLoc) {
    var clickedRow, emptyRow;
    clickedRow = clickedTileLoc.charAt(0);
    emptyRow = this.emptyTileLoc.charAt(0);

    var currCol = this.emptyTileLoc.charAt(1);
    if( clickedRow < emptyRow ) {
      while( clickedRow < emptyRow ) {
        this.swap(`t${emptyRow}${currCol}`, `t${emptyRow-1}${currCol}`);
        emptyRow--;
      }
    }else if( emptyRow < clickedRow ) {
      while( emptyRow < clickedRow ) {
        this.swap(`t${emptyRow}${currCol}`, `t${parseInt(emptyRow)+1}${currCol}`);
        emptyRow++;
      }
    }
    this.emptyTileLoc = `${emptyRow}${currCol}`;
  }

  /**
   *
   * @param tile1
   * @param tile2
   */
  swap(tile1, tile2) {
    console.log( "swaping: " + tile1 + ", " + tile2)
    var t1 = document.querySelector("#" + tile1);
    var t2 = document.querySelector("#" + tile2);

    var temp = t1.innerHTML;
    t1.innerHTML = t2.innerHTML;
    t2.innerHTML = temp;
  }
}