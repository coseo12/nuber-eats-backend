import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@ObjectType()
export class RepositoryRestaurantOutput extends CoreOutput {
  @Field(type => Restaurant, { nullable: true })
  restaurant?: Restaurant;

  @Field(type => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field(type => Int, { nullable: true })
  totalResults?: number;

  @Field(type => Int, { nullable: true })
  totalPages?: number;
}
