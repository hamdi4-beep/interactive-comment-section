import z from "zod";
import type { $ZodType, $ZodTypeInternals } from "zod/v4/core";

type Schema = {
    [k: string]: $ZodType<unknown, unknown, $ZodTypeInternals>
}

export function isSchemaInvalid<T extends Readonly<Schema>>(schema: z.ZodObject<T>, value: object) {
    try {
        schema.parse(value)
    } catch (e) {
        if (e instanceof z.ZodError)
            console.error(e.issues)
    }
}