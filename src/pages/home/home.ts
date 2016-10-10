import { Component, AfterContentInit } from '@angular/core';

import { NavController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterContentInit{

  private puzzle: number[][];
  private emptyTileLoc: string;

  private timeTicker;
  private timerRef;
  public timeMessage: string;  // used to show to user

  /**
   *
   * @param navCtrl
   */
  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {
    // this.puzzle = [ [1,2,3,4], [5,6,7,8], [9,10,11,12], [13,14,15,0] ];
    this.puzzle = [[9, 5, 2, 3], [13, 6, 1, 7], [14, 11, 4, 8], [10, 15, 12]];
    this.emptyTileLoc = "44";
    console.log(this.puzzle);
  }

  /**
   * life cycle method
   */
  ngAfterContentInit() {
    this.initPuzzle(this.puzzle);
  }

  /**
   *
   * @param puzzle
   */
  initPuzzle(puzzle) {
    this.timeTicker = 0;
    this.timeMessage = "";

    if( this.emptyTileLoc != "44" ) {
      this.swap(`t${this.emptyTileLoc}`, "t44" );
    }

    for( var r = 0 ; r < puzzle.length ; r++ )
      for( var c = 0 ; c < puzzle[r].length ; c++ ) {
        var temp = `#t${r+1}${c+1} button span`;
        console.log( temp );
        document.querySelector(temp).textContent = puzzle[r][c];
      }

    this.startTimer();
  }

  isPuzzleSolved() {
    var solved = true;
    var arr = [];
    for( var r = 1 ; r <= 4 ; r++ )
      for( var c = 1 ; c <= 4 ; c++ ) {
        var temp = `#t${r}${c} button span`;
        arr.push( document.querySelector(temp).textContent );
      }

    for( var i = 0 ; i < 15 ; i++ ) {
      console.log(`comparing: ${arr[i]}  ${i+1}` + (Math.round(arr[i]) == (i+1)));
      if( Math.round(arr[i]) != (i+1) ) {
        solved = false;
        break;
      }
    }

    console.log( arr );

    if( solved ) {
      this.stopTimer();
      var toast = this.toastCtrl.create({message: `Congrats!! Solved in ${Math.round(this.timeTicker/60)}m ${this.timeTicker%60}s`, showCloseButton: true, closeButtonText: 'Play Again'});
      this.timeMessage = "";
      toast.onDidDismiss( () => {console.log("dismissed"); this.initPuzzle(this.puzzle)} );
      toast.present();
    }
  }

  /**
   *
   */
  startTimer() {
    this.timerRef = setInterval( ()=>{this.timeTicker++;
                                          this.timeMessage = `Timer: ${Math.round(this.timeTicker/60)}m ${this.timeTicker%60}s`;},
                                     1*1000 );
  }

  /**
   *
   */
  stopTimer() {
    clearInterval(this.timerRef);
  }

  /**
   * Event on tile click
   * @param event
   */
  moveTiles() {
    // this.initPuzzle(this.puzzle);
    console.log("function moveTiles--------")
    var srcElement = window.event.srcElement;
    var clickedTileId;
    switch( srcElement.tagName ) {
      case "SPAN":    clickedTileId = srcElement.parentElement.parentElement.id; break;
      case "BUTTON":  clickedTileId = srcElement.parentElement.id; break;
      case "ION-COL": clickedTileId = srcElement.id; break;
    }
    // var clickedTileId = "" + window.event.path.filter(item =>item.tagName == "ION-COL")[0].id; //ex: t43
    var clickedTileLoc = clickedTileId.substring(1);  //ex: 43
    this.move(clickedTileLoc);
  }

  /**
   *
   * @param clickedTileLoc
   */
  move(clickedTileLoc) {
    var temp1 = this.emptyTileLoc;
    console.log( "clicked: " + clickedTileLoc + "--" + "empty: " + this.emptyTileLoc )
    if( clickedTileLoc.charAt(0) == this.emptyTileLoc.charAt(0) ) {       // row
      this.equalRowClicked(clickedTileLoc)
    }else if( clickedTileLoc.charAt(1) == this.emptyTileLoc.charAt(1) ) { // col
      this.equalColClicked(clickedTileLoc);
    }
    console.log( "empty tile loc: " + this.emptyTileLoc );
    var temp2 = this.emptyTileLoc;

    if( temp1 != temp2 ) {
      this.isPuzzleSolved();
    }
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
        this.swap(`t${currRow}${emptyCol}`, `t${currRow}${Math.round(emptyCol)+1}`)
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
        this.swap(`t${emptyRow}${currCol}`, `t${Math.round(emptyRow)+1}${currCol}`);
        emptyRow++;
      }
    }
    this.emptyTileLoc = `${emptyRow}${currCol}`;
  }

  /**
   *
   * @param tile1 (ex: t11)
   * @param tile2 (ex: t12)
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
