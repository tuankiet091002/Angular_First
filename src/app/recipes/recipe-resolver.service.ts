import { Injectable, inject } from '@angular/core';
import {
    ResolveFn,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';


import { Recipe } from './recipe.model';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';

@Injectable({ providedIn: 'root' })
export class RecipeResolverService {
    constructor(
        private dataStorageService: DataStorageService,
        private recipeService: RecipeService
    ) {}

    getRecipes() {
        const recipes = this.recipeService.getRecipes();
        if (recipes.length === 0) return this.dataStorageService.fetchRecipes();
        else return recipes;
    }
}

export const recipeResolver: ResolveFn<Recipe[]> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return inject(RecipeResolverService).getRecipes();
};
