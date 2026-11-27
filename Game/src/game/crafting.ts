import { assetUrl } from '../core/paths.js';
import { eventBus } from '../core/events.js';
import { gameState } from './state.js';

export interface Recipe {
  id: string;
  inputs: string[];
  output: string;
  titleKey: string;
  descKey: string;
}

/** Resep sederhana: bahan diambil dari inventaris, hasil ditambahkan kembali. */
export class CraftingDirector {
  private recipes: Recipe[] = [];

  async load(): Promise<void> {
    try {
      const response = await fetch(assetUrl('data/recipes.json'));
      if (!response.ok) return;
      const data = await response.json() as { recipes?: Recipe[] };
      this.recipes = data.recipes ?? [];
    } catch (error) {
      console.warn('[crafting] gagal memuat resep:', error);
    }
  }

  getRecipes(): Recipe[] {
    return this.recipes;
  }

  canCraft(id: string): boolean {
    const recipe = this.recipes.find(r => r.id === id);
    if (!recipe) return false;
    return recipe.inputs.every(item => gameState.hasInventory(item));
  }

  craft(id: string): boolean {
    if (!this.canCraft(id)) return false;
    const recipe = this.recipes.find(r => r.id === id)!;
    for (const item of recipe.inputs) gameState.removeInventory(item);
    gameState.addInventory(recipe.output);
    eventBus.emit('inventory:added', { id: recipe.output });
    return true;
  }
}
