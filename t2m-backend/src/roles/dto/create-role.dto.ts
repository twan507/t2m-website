import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional} from "class-validator"
import { Types } from "mongoose"

export class CreateRoleDto {

    @IsNotEmpty({ message: "name không được để trống" })
    name: string

    // @IsNotEmpty({ message: "isActive không được để trống" })
    // @IsBoolean({ message: "isActive phải có giá trị boolean" })
    // isActive: boolean

    @IsOptional()
    @IsArray({ message: "permissions phải có định dạng là array" })
    @IsMongoId({ each: true, message: 'each permission phải là MongoId Object' })
    permissions: Types.ObjectId[]

}
