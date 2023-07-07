import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    subscription!: Subscription;
    editMode = false;
    editedItemIndex!: number;
    editedItem!: Ingredient;
    @ViewChild('f') slForm!: NgForm;

    constructor(private slService: ShoppingListService) { }

    ngOnInit() {
        this.subscription = this.slService.startedEditing.subscribe(
            (index: number) => {
                this.editedItemIndex = index;
                this.editMode = true;
                this.editedItem = this.slService.getIngredient(index);
                this.slForm.setValue({
                    name: this.editedItem.name,
                    amount: this.editedItem.amount
                })
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newIngredient = new Ingredient(value.name, value.amount);
        if(this.editMode)
            this.slService.updateIngredient(this.editedItemIndex, newIngredient);
        else
            this.slService.addIngredient(newIngredient);
        this.onClear();
    }

    onClear() {
        this.slForm.reset();
        this.editMode = false;
    }

    onDelete() {
        this.slService.deleteIngredient(this.editedItemIndex);
        this.onClear();
    }

}
