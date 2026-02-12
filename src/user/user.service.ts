import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    user = [
        { id: 1, name: 'User A', age: 25 },
        { id: 2, name: 'User B', age: 30 },
        { id: 3, name: 'User C', age: 35 },
    ]

    getUserList(): object[] {
        return this.user
    }
}
