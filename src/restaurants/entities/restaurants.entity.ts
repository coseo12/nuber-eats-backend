import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(type => Number)
  id: number;

  @Field(type => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field(type => Boolean, { defaultValue: false })
  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;

  @Field(type => String, { defaultValue: '강남' })
  @Column({ default: '강남' })
  @IsOptional()
  @IsString()
  address: string;
}
