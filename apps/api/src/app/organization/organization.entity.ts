import { Column, Entity, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsDate,
	IsOptional,
	IsEnum
} from 'class-validator';
import { Base } from '../core/entities/base';
import {
	Organization as IOrganization,
	CurrenciesEnum,
	DefaultValueDateTypeEnum,
	WeekDaysEnum
} from '@gauzy/models';

@Entity('organization')
export class Organization extends Base implements IOrganization {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column()
	name: string;

	@ApiPropertyOptional({ type: String, maxLength: 500 })
	@IsOptional()
	@Column({ length: 500, nullable: true })
	imageUrl?: string;

	@ApiProperty({ type: String, enum: CurrenciesEnum })
	@IsEnum(CurrenciesEnum)
	@IsNotEmpty()
	@Index()
	@Column()
	currency: string;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	valueDate?: Date;

	@ApiProperty({ type: String, enum: DefaultValueDateTypeEnum })
	@IsEnum(DefaultValueDateTypeEnum)
	@IsNotEmpty()
	@Index()
	@Column()
	defaultValueDateType: string;

	@ApiProperty({ type: Boolean, default: true })
	@Column({ default: true })
	isActive: boolean;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	defaultAlignmentType?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	timeZone?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	brandColor?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	dateFormat?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	officialName?: string;

	@ApiProperty({ type: String, enum: WeekDaysEnum })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	startWeekOn?: string;

	@ApiProperty({ type: String, maxLength: 256 })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	taxId?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	country?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	city?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	address?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	address2?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	postcode?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	regionCode?: string;

	@ApiProperty({ type: String })
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	numberFormat?: string;
}
