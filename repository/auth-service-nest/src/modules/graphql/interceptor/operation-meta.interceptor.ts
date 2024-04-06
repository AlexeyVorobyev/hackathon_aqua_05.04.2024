import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { DefaultAttributes } from '../attributes/default.attributes'
import { Builder } from 'builder-pattern'
import { OperationMetaAttributes } from '../attributes/operation-meta.attributes'

@Injectable()
export class OperationMetaInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const beforeTimeStamp = Date.now()

        return next
            .handle()
            .pipe(
                map((data) => {
                    const afterTimeStamp = Date.now()

                    const operationMetaAttributes = Builder<OperationMetaAttributes>()

                    console.log('here2')

                    operationMetaAttributes
                        .startTimestamp(beforeTimeStamp)
                        .finishTimestamp(afterTimeStamp)
                        .deltaTimestamp(afterTimeStamp - beforeTimeStamp)

                    console.log(operationMetaAttributes.build(), data)

                    return {
                        ...data,
                        operationMeta: operationMetaAttributes.build(),
                    } as DefaultAttributes
                }),
            )
    }
}