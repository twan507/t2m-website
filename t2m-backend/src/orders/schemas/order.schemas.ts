import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {

    @Prop()
    type: string;

    @Prop()
    buyer: string;

    @Prop()
    saler: string;

    @Prop()
    price: number;

    @Prop()
    code: string;

    @Prop({ type: Object })
    deletedBy: {
        _id: Types.ObjectId
        email: string
    };

    @Prop()
    createdAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
