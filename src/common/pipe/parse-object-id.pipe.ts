import { PipeTransform, BadRequestException } from "@nestjs/common";
import { Types, isValidObjectId } from "mongoose";
import { InvalidValueException } from "../exception/invalid-value.exception";

export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
    transform(value: string): Types.ObjectId {
       try {
        const objectId = new Types.ObjectId(value);
        return objectId;
       } catch (e) {
        throw new InvalidValueException(`INVALID_OBJECT_ID_FORMAT ${value}`);
       }
    }
}