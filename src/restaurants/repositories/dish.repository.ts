import { CoreOutput } from 'src/common/dtos/output.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Dish } from '../entities/dish.entity';

@EntityRepository(Dish)
export class DishRepository extends Repository<Dish> {
  async checkDish(ownerId: number, dishId: number): Promise<CoreOutput> {
    const dish = await this.findOne(dishId, {
      relations: ['restaurant'],
    });
    if (!dish) {
      return {
        ok: false,
        error: 'Dish not found',
      };
    }
    if (dish.restaurant.ownerId !== ownerId) {
      return {
        ok: false,
        error: `You can't do that`,
      };
    }

    return {
      ok: true,
    };
  }
}
