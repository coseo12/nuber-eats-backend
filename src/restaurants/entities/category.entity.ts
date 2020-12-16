import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Restaurant } from './restaurants.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  @Length(5)
  name: string;

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field(type => String)
  @Column({ unique: true })
  @IsString()
  slug: string;

  @Field(type => [Restaurant])
  @OneToMany(
    type => Restaurant,
    restaurant => restaurant.category,
  )
  restaurants: Restaurant[];
}
