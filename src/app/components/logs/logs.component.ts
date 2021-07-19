import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnChanges {

  @Input() logs = "";

  ngOnChanges(changes: SimpleChanges) {
    const logs = changes.logs.currentValue;
    this.logs = logs.split('\n').reverse().join('\n');
  }

}
