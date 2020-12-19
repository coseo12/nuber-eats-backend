import { EntityRepository, Repository } from 'typeorm';
import { Dish } from '../entities/dish.entity';

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {}
