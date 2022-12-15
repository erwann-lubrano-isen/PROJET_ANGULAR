import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, filter, take, range, of, from } from 'rxjs';

@Component({
  selector: 'app-ligne-pokedesk',
  templateUrl: './ligne-pokedesk.component.html',
  styleUrls: ['./ligne-pokedesk.component.css']
})


export class LignePokedeskComponent implements OnInit {


  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }
}



