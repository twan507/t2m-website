import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional} from "class-validator"
import { Types } from "mongoose"

export class CreateRoleDto {

    @IsNotEmpty({ message: "name không được để trống" })
    name: string

    @IsOptional()
    @IsArray({ message: "permissions phải có định dạng là array" })
    @IsMongoId({ each: true, message: 'each permission phải là MongoId Object' })
    permissions: Types.ObjectId[]

}
