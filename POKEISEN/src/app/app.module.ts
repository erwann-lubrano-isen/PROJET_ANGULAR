import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PokedexPageComponent } from './pokedex-page/pokedex-page.component';
import { PokemonPageComponent } from './pokemon-page/pokemon-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { TestPageComponent } from './test-page/test-page.component';
import { PokemonMoveListComponent } from './pokemon-move-list/pokemon-move-list.component';
import { PokemonMoveListRowComponent } from './pokemon-move-list-row/pokemon-move-list-row.component';
import { PokemonStatsComponent } from './pokemon-stats/pokemon-stats.component';
import { TypeComponent } from './type/type.component';
import { GenSelectorComponent } from './gen-selector/gen-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    PokedexPageComponent,
    PokemonPageComponent,
    AboutPageComponent,
    TestPageComponent,
    PokemonMoveListComponent,
    PokemonMoveListRowComponent,
    PokemonStatsComponent,
    TypeComponent,
    GenSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ReactiveFormsModule,
    HttpClientModule,
	HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
	
}
