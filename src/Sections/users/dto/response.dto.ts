export class UserResponseDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly is_active: boolean;
  readonly token?: string;
  readonly is_super_user?: boolean;

  constructor(
    id: number,
    name: string,
    email: string,
    phone: string,
    is_active: boolean,
    token?: string,
    is_super_user?: boolean,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.token = token;
    this.is_super_user = is_super_user;
    this.is_active = is_active;
  }
}
