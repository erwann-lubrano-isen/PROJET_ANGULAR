import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page.component';
import { PokedexPageComponent } from './pokedex-page/pokedex-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { PokemonPageComponent } from './pokemon-page/pokemon-page.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/home' },
    { path: 'home', component: HomePageComponent },
	{ path: 'pokedex', component: PokedexPageComponent },
	{ path: 'about', component: AboutPageComponent },
    { path: 'pokedex/:id', component: PokemonPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
