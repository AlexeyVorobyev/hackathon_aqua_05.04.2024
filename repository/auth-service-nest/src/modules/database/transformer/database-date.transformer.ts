import * as moment from 'moment'
import { ValueTransformer } from 'typeorm';

export const databaseDateTransformer: ValueTransformer = {
    to: (value: Date) => value,
    from: (value: Date) => (value ? moment(value).utc().toISOString() : null),
};
