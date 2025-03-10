import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IScenario } from '../../models/scenario';
import { DataManagerService } from '../data-manager/data-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ScenariosRegistryService {
  public registryUpdated = new BehaviorSubject<IScenario[]>([]);
  private scenarios: IScenario[] = [];
  private scenarioByIds: Map<string, IScenario> = new Map();

  constructor(private dataManager: DataManagerService) {}

  /**
   * Get a scenario by its id.
   */
  public get(id: string):
    | (IScenario & {
        index: number;
      })
    | undefined {
    const scenario = this.scenarioByIds.get(id);
    if (!scenario) {
      return undefined;
    }

    return {
      ...scenario,
      index: this.scenarios.indexOf(scenario),
    };
  }

  /**
   * Return all the scenarios
   */
  public getAll(): IScenario[] {
    return [...this.scenarios];
  }

  /**
   * Return all the scenarios by category
   */
  public getAllByCategories(): { [category: string]: IScenario[] } {
    return this.scenarios.reduce((acc, scenario) => {
      acc[scenario.category || ''] = acc[scenario.category || ''] || [];
      acc[scenario.category || ''].push(scenario);
      return acc;
    }, {} as { [category: string]: IScenario[] });
  }

  /**
   * Check the data manager to see if there is some scenario data in it
   */
  public load(): boolean {
    const data = this.dataManager.get<IScenario[]>('scenarios');
    if (!data || data.length === 0) {
      return false;
    }

    this.reset(data);
    return true;
  }

  /**
   * Clear the registry and set the new scenarios.
   */
  public reset(scenarios: IScenario[]): void {
    this.clear();
    this.addScenarios(scenarios);
  }

  /**
   * Get the next scenario from the given scenario, or undefined if none is existing
   */
  public next(id: string):
    | (IScenario & {
        index: number;
      })
    | undefined {
    const scenario = this.get(id);

    if (!scenario) {
      return undefined;
    }
    console.log(scenario.index, this.scenarios[scenario.index + 1]);
    return this.get(this.scenarios[scenario.index + 1]?.id);
  }

  /**
   * Get the previous scenario from the given scenario, or undefined if none is existing
   */
  public previous(id: string):
    | (IScenario & {
        index: number;
      })
    | undefined {
    const scenario = this.get(id);

    if (!scenario) {
      return undefined;
    }

    return this.get(this.scenarios[scenario.index - 1]?.id);
  }

  /**
   * Get the number of scenarios in the registry
   */
  public get length(): number {
    return this.scenarios.length;
  }

  private addScenarios(scenarios: IScenario[]): void {
    scenarios.forEach((scenario) => this.addScenario(scenario));

    this.registryUpdated.next(this.getAll());
    this.dataManager.set('scenarios', this.scenarios);
  }

  private addScenario(scenario: IScenario): void {
    if (!scenario.id) {
      return;
    }

    // Force the category, the subcategory and the comment to be string or null
    const item = Object.assign(
      { category: null, subcategory: null, comment: null },
      scenario
    );
    this.scenarios.push(item);
    this.scenarioByIds.set(scenario.id, item);
  }

  private clear(): void {
    this.scenarios = [];
    this.scenarioByIds.clear();
    this.dataManager.delete('scenarios');
    this.registryUpdated.next(this.getAll());
  }
}
